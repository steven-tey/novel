import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, EditorView } from "@tiptap/pm/view";

const uploadKey = new PluginKey("upload-image");

export const UploadImagesPlugin = ({ imageClass }: { imageClass: string }) =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);
        // See if the transaction adds or removes any placeholders
        //@ts-expect-error - not yet sure what the type I need here
        const action = tr.getMeta(this);
        if (action && action.add) {
          const { id, pos, src } = action.add;

          const placeholder = document.createElement("div");
          placeholder.setAttribute("class", "img-placeholder");
          const image = document.createElement("img");
          image.setAttribute("class", imageClass);
          image.src = src;
          placeholder.appendChild(image);
          const deco = Decoration.widget(pos + 1, placeholder, {
            id,
          });
          set = set.add(tr.doc, [deco]);
        } else if (action && action.remove) {
          set = set.remove(
            set.find(
              undefined,
              undefined,
              (spec) => spec.id == action.remove.id,
            ),
          );
        }
        return set;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });

function findPlaceholder(state: EditorState, id: {}) {
  const decos = uploadKey.getState(state) as DecorationSet;
  const found = decos.find(undefined, undefined, (spec) => spec.id == id);
  return found.length ? found[0]?.from : null;
}

export interface ImageUploadOptions {
  validateFn?: (file: File) => void;
  onUpload: (file: File) => Promise<unknown>;
}

export const createImageUpload =
  ({ validateFn, onUpload }: ImageUploadOptions): UploadFn =>
  (file, view, pos) => {
    // check if the file is an image
    const validated = validateFn?.(file);
    if (!validated) return;
    // A fresh object to act as the ID for this upload
    const id = {};

    // Replace the selection with a placeholder
    const tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection();

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      tr.setMeta(uploadKey, {
        add: {
          id,
          pos,
          src: reader.result,
        },
      });
      view.dispatch(tr);
    };

    onUpload(file).then((src) => {
      const { schema } = view.state;

      let pos = findPlaceholder(view.state, id);

      // If the content around the placeholder has been deleted, drop
      // the image
      if (pos == null) return;

      // Otherwise, insert it at the placeholder's position, and remove
      // the placeholder

      // When BLOB_READ_WRITE_TOKEN is not valid or unavailable, read
      // the image locally
      const imageSrc = typeof src === "object" ? reader.result : src;

      const node = schema.nodes.image?.create({ src: imageSrc });
      if (!node) return;

      const transaction = view.state.tr
        .replaceWith(pos, pos, node)
        .setMeta(uploadKey, { remove: { id } });
      view.dispatch(transaction);
    });
  };

export type UploadFn = (file: File, view: EditorView, pos: number) => void;

export const handleImagePaste = (
  view: EditorView,
  event: ClipboardEvent,
  uploadFn: UploadFn,
) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    const [file] = Array.from(event.clipboardData.files);
    const pos = view.state.selection.from;

    if (file) uploadFn(file, view, pos);
    return true;
  }
  return false;
};

export const handleImageDrop = (
  view: EditorView,
  event: DragEvent,
  moved: boolean,
  uploadFn: UploadFn,
) => {
  if (!moved && event.dataTransfer?.files.length) {
    event.preventDefault();
    const [file] = Array.from(event.dataTransfer.files);
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    // here we deduct 1 from the pos or else the image will create an extra node
    if (file) uploadFn(file, view, coordinates?.pos ?? 0 - 1);
    return true;
  }
  return false;
};

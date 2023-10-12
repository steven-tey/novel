import { BlobResult } from '@vercel/blob';
import { toast } from 'sonner';
import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';

const uploadKey = new PluginKey('upload-video');

const UploadVideos = () =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);
        // See if the transaction adds or removes any placeholders
        const action = tr.getMeta(this);
        if (action && action.add) {
          const { id, pos, src } = action.add;

          const placeholder = document.createElement('div');
          placeholder.setAttribute('class', 'img-placeholder');
          const video = document.createElement('video');
          video.setAttribute('class', 'opacity-40 rounded-lg border border-stone-200');
          video.src = src;
          placeholder.appendChild(video);
          const deco = Decoration.widget(pos + 1, placeholder, {
            id,
          });
          set = set.add(tr.doc, [deco]);
        } else if (action && action.remove) {
          set = set.remove(set.find(null, null, (spec) => spec.id == action.remove.id));
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

export default UploadVideos;

function findPlaceholder(state: EditorState, id: {}) {
  const decos = uploadKey.getState(state);
  const found = decos.find(null, null, (spec) => spec.id == id);
  return found.length ? found[0].from : null;
}

export function startVideoUpload(
  file: File,
  view: EditorView,
  pos: number,
  videoUploader: (file: File) => Promise<string>,
) {
  // check if the file is an image
  const allowedTypes = ['image/gif', 'video/mp4', 'video/quicktime'];
  if (!allowedTypes.includes(file.type)) {
    toast.error('File type not supported.');
    return;

    // check if the file size is less than 20MB
  } else if (file.size / 1024 / 1024 > 25) {
    toast.error('File size too big (max 25MB).');
    return;
  }

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

  if (videoUploader) {
    videoUploader(file).then((src) => {
      const { schema } = view.state;

      let pos = findPlaceholder(view.state, id);
      // If the content around the placeholder has been deleted, drop
      // the image
      if (pos == null) return;

      // Otherwise, insert it at the placeholder's position, and remove
      // the placeholder

      // When BLOB_READ_WRITE_TOKEN is not valid or unavailable, read
      // the image locally
      const imageSrc = typeof src === 'object' ? reader.result : src;

      const node = schema.nodes.video.create({ src: imageSrc });
      const transaction = view.state.tr
        .replaceWith(pos, pos, node)
        .setMeta(uploadKey, { remove: { id } });
      view.dispatch(transaction);
    });
  } else {
    handleImageUpload(file).then((src) => {
      const { schema } = view.state;

      let pos = findPlaceholder(view.state, id);
      // If the content around the placeholder has been deleted, drop
      // the image
      if (pos == null) return;

      // Otherwise, insert it at the placeholder's position, and remove
      // the placeholder

      // When BLOB_READ_WRITE_TOKEN is not valid or unavailable, read
      // the image locally
      const imageSrc = typeof src === 'object' ? reader.result : src;

      const node = schema.nodes.image.create({ src: imageSrc });
      const transaction = view.state.tr
        .replaceWith(pos, pos, node)
        .setMeta(uploadKey, { remove: { id } });
      view.dispatch(transaction);
    });
  }
}

export const handleImageUpload = (file: File) => {
  // upload to Vercel Blob
  return new Promise((resolve) => {
    toast.promise(
      fetch('/api/upload', {
        method: 'POST',
        headers: {
          'content-type': file?.type || 'application/octet-stream',
          'x-vercel-filename': file?.name || 'image.png',
        },
        body: file,
      }).then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as BlobResult;
          // preload the image
          let image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);

          throw new Error(
            '`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.',
          );
          // Unknown error
        } else {
          throw new Error(`Error uploading image. Please try again.`);
        }
      }),
      {
        loading: 'Uploading image...',
        success: 'Image uploaded successfully.',
        error: (e) => e.message,
      },
    );
  });
};

import { EditorProps } from "@tiptap/pm/view";
import { toast } from "sonner";

export const TiptapEditorProps: EditorProps = {
  attributes: {
    class:
      "prose-lg prose-headings:font-display focus:outline-none prose-img:rounded-md prose-img:border prose-img:border-stone-200",
  },
  handleDOMEvents: {
    keydown: (_view, event) => {
      // Prevents the editor from handling the Enter key when slash commands are active (but exclude shift+enter)
      return event.key === "Enter" && !event.shiftKey;
    },
  },
  handlePaste: (view, event, _slice) => {
    if (
      event.clipboardData &&
      event.clipboardData.files &&
      event.clipboardData.files[0]
    ) {
      event.preventDefault();
      const file = event.clipboardData.files[0];
      if (!file.type.includes("image/")) {
        toast.error("File type not supported");
      } else if (file.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target?.result as string;
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.image.create({
                src: img.src,
              }),
            ),
          );
        };
        reader.readAsDataURL(file);
      }
    }
    return false;
  },
  handleDrop: (view, event, _slice, moved) => {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (!file.type.includes("image/")) {
        toast.error("File type not supported");
      } else if (file.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const { schema } = view.state;
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          const node = schema.nodes.image.create({ src: e.target?.result }); // creates the image element
          const transaction = view.state.tr.insert(coordinates?.pos || 0, node); // inserts the image at the current cursor position
          return view.dispatch(transaction);
        };
        reader.readAsDataURL(file);
      }
    }
    return false;
  },
};

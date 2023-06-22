import { EditorView } from "@tiptap/pm/view";
import { BlobResult } from "@vercel/blob";
import { toast } from "sonner";

export const handleImageUpload = (
  file: File,
  view: EditorView,
  event: ClipboardEvent | DragEvent | Event,
) => {
  // check if the file is an image
  if (!file.type.includes("image/")) {
    toast.error("File type not supported");

    // check if the file size is less than 50MB
  } else if (file.size / 1024 / 1024 > 50) {
    toast.error("File size too big (max 50MB)");
  } else {
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   const { schema } = view.state;
    //   const node = schema.nodes.image.create({
    //     src: e.target?.result,
    //     alt: file,
    //     title: file.name,
    //   }); // creates the image element
    //   const transaction = view.state.tr.replaceSelectionWith(node);
    //   view.dispatch(transaction);
    // };
    // reader.readAsDataURL(file);

    // upload to Vercel Blob
    toast.promise(
      fetch("/api/upload", {
        method: "POST",
        headers: {
          "content-type": file?.type || "application/octet-stream",
          "x-vercel-filename": file?.name || "image.png",
        },
        body: file,
      }).then(async (res) => {
        if (res.status === 200) {
          const { url } = (await res.json()) as BlobResult;
          // preload the image
          let image = new Image();
          image.src = url;
          image.onload = () => {
            // for paste events
            if (event instanceof ClipboardEvent) {
              return view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.create({
                    src: url,
                    alt: file.name,
                    title: file.name,
                  }),
                ),
              );

              // for drag and drop events
            } else if (event instanceof DragEvent) {
              const { schema } = view.state;
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              const node = schema.nodes.image.create({
                src: url,
                alt: file.name,
                title: file.name,
              }); // creates the image element
              const transaction = view.state.tr.insert(
                coordinates?.pos || 0,
                node,
              ); // places it in the correct position
              return view.dispatch(transaction);

              // for input upload events
            } else if (event instanceof Event) {
              return view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.create({
                    src: url,
                    alt: file.name,
                    title: file.name,
                  }),
                ),
              );
            }
          };
        } else {
          throw new Error("Failed to upload image");
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded",
        error: "Failed to upload image",
      },
    );
  }
};

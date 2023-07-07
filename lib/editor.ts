import { Editor } from "@tiptap/core";
import { BlobResult } from "@vercel/blob";
import { toast } from "sonner";

export const handleImageUpload = (file: File) => {
  // check if the file is an image
  if (!file.type.includes("image/")) {
    toast.error("File type not supported.");

    // check if the file size is less than 50MB
  } else if (file.size / 1024 / 1024 > 50) {
    toast.error("File size too big (max 50MB).");
  } else {
    // upload to Vercel Blob
    return new Promise((resolve) => {
      toast.promise(
        fetch("/api/upload", {
          method: "POST",
          headers: {
            "content-type": file?.type || "application/octet-stream",
            "x-vercel-filename": file?.name || "image.png",
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
              "`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.",
            );
            // Unknown error
          } else {
            throw new Error(`Error uploading image. Please try again.`);
          }
        }),
        {
          loading: "Uploading image...",
          success: "Image uploaded successfully.",
          error: (e) => e.message,
        },
      );
    });
  }
};

export const getPrevText = (
  editor: Editor,
  {
    chars,
    offset = 0,
  }: {
    chars: number;
    offset?: number;
  },
) => {
  // for now, we're using textBetween for now until we can figure out a way to stream markdown text
  // with proper formatting: https://github.com/steven-tey/novel/discussions/7
  return editor.state.doc.textBetween(
    Math.max(0, editor.state.selection.from - chars),
    editor.state.selection.from - offset,
    "\n",
  );
  // complete(editor.storage.markdown.getMarkdown());
};

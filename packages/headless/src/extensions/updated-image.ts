import Image from "@tiptap/extension-image";

const UpdatedImage = Image.extend({
  name: "updated-image",
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },
});

export default UpdatedImage;

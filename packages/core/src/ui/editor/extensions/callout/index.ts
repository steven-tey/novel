import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CalloutComponent from "./callout";

export const Callout = Node.create<{}>({
  name: "callout",

  group: "block",

  content: "inline*",

  parseHTML() {
    return [
      {
        tag: "callout",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["callout", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent);
  },
});

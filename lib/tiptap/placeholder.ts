import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

interface PlaceholderOptions {
  autocomplete: string | null;
  placeholder: string;
  showOnlyWhenEditable: boolean;
  includeChildren: boolean;
}

const Placeholder = Extension.create<PlaceholderOptions>({
  name: "placeholder",

  addOptions() {
    return {
      autocomplete: null,
      placeholder: "Write something...",
      showOnlyWhenEditable: true,
      includeChildren: false,
    };
  },

  // Tab Auto-Complete
  addKeyboardShortcuts() {
    return {
      Tab: () =>
        this.editor
          .chain()
          .focus()
          .command(({ tr }) => {
            tr.insertText(this.options.autocomplete || "");
            this.options.autocomplete = null;
            return true;
          })
          .run(),
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("placeholder"),
        props: {
          decorations: ({ doc, selection }) => {
            const active =
              this.editor.isEditable || !this.options.showOnlyWhenEditable;
            const { anchor } = selection;
            console.log("SELECTION", selection);
            const decorations: Decoration[] = [];

            if (!active) {
              return null;
            }

            const emptyDocInstance = doc.type.createAndFill();
            const isEditorEmpty =
              emptyDocInstance?.sameMarkup(doc) &&
              emptyDocInstance.content.findDiffStart(doc.content) === null;

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;

              if (hasAnchor) {
                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: "is-empty",
                  // "data-placeholder": isEditorEmpty
                  //   ? this.options.placeholder
                  //   : this.options.autocomplete || "",
                  "data-placeholder": "hello world 12345",
                });

                decorations.push(decoration);
              }

              return this.options.includeChildren;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default Placeholder;

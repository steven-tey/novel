import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

interface PlaceholderOptions {
  emptyNodeClass: string;
  autocomplete: string | null;
  placeholder: string;
  showOnlyWhenEditable: boolean;
  showOnlyCurrent: boolean;
  includeChildren: boolean;
}

const Placeholder = Extension.create<PlaceholderOptions>({
  name: "placeholder",

  addOptions() {
    return {
      emptyNodeClass: "is-empty",
      autocomplete: null,
      placeholder: "Write something...",
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
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
              const isEmpty = !node.isLeaf && !node.childCount;
              if (hasAnchor || !this.options.showOnlyCurrent) {
                const classes = [this.options.emptyNodeClass];
                console.log(node, pos, classes);
                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(" "),
                  "data-placeholder": isEditorEmpty
                    ? this.options.placeholder
                    : `${node.textContent}${this.options.autocomplete || ""}`,
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

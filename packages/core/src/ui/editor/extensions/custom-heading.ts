import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingOptions {
  levels: Level[];
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  // eslint-disable-next-line no-unused-vars
  interface Commands<ReturnType> {
    heading: {
      /**
       * Set a heading node
       */
      // eslint-disable-next-line no-unused-vars
      setHeading: (attributes: { level: Level }) => ReturnType;
      /**
       * Toggle a heading node
       */
      // eslint-disable-next-line no-unused-vars
      toggleHeading: (attributes: { level: Level }) => ReturnType;
      /**
       * Set a background color
       */
      // eslint-disable-next-line no-unused-vars
      setHeadingBackgroundColor: (attributes: { bgColor: string }) => ReturnType;
    };
  }
}

// REFS: https://github.com/ueberdosis/tiptap/tree/develop/packages/extension-heading
export const Heading = Node.create<HeadingOptions>({
  name: "heading",

  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {},
    };
  },

  content: "inline*",

  group: "block",

  defining: true,

  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
      bgColor: {
        default: "inherit",
        rendered: false,
      },
    };
  },

  parseHTML() {
    return this.options.levels.map((level: Level) => ({
      tag: `h${level}`,
      attrs: { level },
    }));
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes({
        ...this.options.HTMLAttributes,
        style: `background-color: ${node.attrs.bgColor}`, 
      }, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setHeading:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }

          return commands.setNode(this.name, attributes);
        },
      toggleHeading:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }

          return commands.toggleNode(this.name, "paragraph", attributes);
        },
      setHeadingBackgroundColor:
        (attributes) =>
        ({ commands }) => {
          if (!attributes.bgColor) {
            return false;
          }
          return commands.updateAttributes(this.name, attributes);
        },
    };
  },

  addKeyboardShortcuts() {
    return this.options.levels.reduce(
      (items, level) => ({
        ...items,
        ...{
          [`Mod-Alt-${level}`]: () =>
            this.editor.commands.toggleHeading({ level }),
        },
      }),
      {},
    );
  },

  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{1,${level}})\\s$`),
        type: this.type,
        getAttributes: {
          level,
        },
      });
    });
  },
});

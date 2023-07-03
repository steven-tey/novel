(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@tiptap/extension-highlight"] = {}, global.core));
})(this, (function (exports, core) { 'use strict';

  const inputRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/;
  const pasteRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g;
  const Highlight = core.Mark.create({
      name: 'highlight',
      addOptions() {
          return {
              multicolor: false,
              HTMLAttributes: {},
          };
      },
      addAttributes() {
          if (!this.options.multicolor) {
              return {};
          }
          return {
              color: {
                  default: null,
                  parseHTML: element => element.getAttribute('data-color') || element.style.backgroundColor,
                  renderHTML: attributes => {
                      if (!attributes.color) {
                          return {};
                      }
                      return {
                          'data-color': attributes.color,
                          style: `background-color: ${attributes.color}; color: inherit`,
                      };
                  },
              },
          };
      },
      parseHTML() {
          return [
              {
                  tag: 'mark',
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['mark', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setHighlight: attributes => ({ commands }) => {
                  return commands.setMark(this.name, attributes);
              },
              toggleHighlight: attributes => ({ commands }) => {
                  return commands.toggleMark(this.name, attributes);
              },
              unsetHighlight: () => ({ commands }) => {
                  return commands.unsetMark(this.name);
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-Shift-h': () => this.editor.commands.toggleHighlight(),
          };
      },
      addInputRules() {
          return [
              core.markInputRule({
                  find: inputRegex,
                  type: this.type,
              }),
          ];
      },
      addPasteRules() {
          return [
              core.markPasteRule({
                  find: pasteRegex,
                  type: this.type,
              }),
          ];
      },
  });

  exports.Highlight = Highlight;
  exports["default"] = Highlight;
  exports.inputRegex = inputRegex;
  exports.pasteRegex = pasteRegex;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map

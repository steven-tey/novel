(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@tiptap/extension-underline"] = {}, global.core));
})(this, (function (exports, core) { 'use strict';

  const Underline = core.Mark.create({
      name: 'underline',
      addOptions() {
          return {
              HTMLAttributes: {},
          };
      },
      parseHTML() {
          return [
              {
                  tag: 'u',
              },
              {
                  style: 'text-decoration',
                  consuming: false,
                  getAttrs: style => (style.includes('underline') ? {} : false),
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['u', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setUnderline: () => ({ commands }) => {
                  return commands.setMark(this.name);
              },
              toggleUnderline: () => ({ commands }) => {
                  return commands.toggleMark(this.name);
              },
              unsetUnderline: () => ({ commands }) => {
                  return commands.unsetMark(this.name);
              },
          };
      },
      addKeyboardShortcuts() {
          return {
              'Mod-u': () => this.editor.commands.toggleUnderline(),
              'Mod-U': () => this.editor.commands.toggleUnderline(),
          };
      },
  });

  exports.Underline = Underline;
  exports["default"] = Underline;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map

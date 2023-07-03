(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@tiptap/extension-image"] = {}, global.core));
})(this, (function (exports, core) { 'use strict';

  const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
  const Image = core.Node.create({
      name: 'image',
      addOptions() {
          return {
              inline: false,
              allowBase64: false,
              HTMLAttributes: {},
          };
      },
      inline() {
          return this.options.inline;
      },
      group() {
          return this.options.inline ? 'inline' : 'block';
      },
      draggable: true,
      addAttributes() {
          return {
              src: {
                  default: null,
              },
              alt: {
                  default: null,
              },
              title: {
                  default: null,
              },
          };
      },
      parseHTML() {
          return [
              {
                  tag: this.options.allowBase64
                      ? 'img[src]'
                      : 'img[src]:not([src^="data:"])',
              },
          ];
      },
      renderHTML({ HTMLAttributes }) {
          return ['img', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
      },
      addCommands() {
          return {
              setImage: options => ({ commands }) => {
                  return commands.insertContent({
                      type: this.name,
                      attrs: options,
                  });
              },
          };
      },
      addInputRules() {
          return [
              core.nodeInputRule({
                  find: inputRegex,
                  type: this.type,
                  getAttributes: match => {
                      const [, , alt, src, title] = match;
                      return { src, alt, title };
                  },
              }),
          ];
      },
  });

  exports.Image = Image;
  exports["default"] = Image;
  exports.inputRegex = inputRegex;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map

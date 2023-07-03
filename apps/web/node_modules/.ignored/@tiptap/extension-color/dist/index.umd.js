(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/extension-text-style'), require('@tiptap/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/extension-text-style', '@tiptap/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@tiptap/extension-color"] = {}, null, global.core));
})(this, (function (exports, extensionTextStyle, core) { 'use strict';

  const Color = core.Extension.create({
      name: 'color',
      addOptions() {
          return {
              types: ['textStyle'],
          };
      },
      addGlobalAttributes() {
          return [
              {
                  types: this.options.types,
                  attributes: {
                      color: {
                          default: null,
                          parseHTML: element => { var _a; return (_a = element.style.color) === null || _a === void 0 ? void 0 : _a.replace(/['"]+/g, ''); },
                          renderHTML: attributes => {
                              if (!attributes.color) {
                                  return {};
                              }
                              return {
                                  style: `color: ${attributes.color}`,
                              };
                          },
                      },
                  },
              },
          ];
      },
      addCommands() {
          return {
              setColor: color => ({ chain }) => {
                  return chain()
                      .setMark('textStyle', { color })
                      .run();
              },
              unsetColor: () => ({ chain }) => {
                  return chain()
                      .setMark('textStyle', { color: null })
                      .removeEmptyTextStyle()
                      .run();
              },
          };
      },
  });

  exports.Color = Color;
  exports["default"] = Color;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map

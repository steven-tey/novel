(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/core'), require('@tiptap/pm/state')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/core', '@tiptap/pm/state'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@tiptap/extension-horizontal-rule"] = {}, global.core, global.state));
})(this, (function (exports, core, state) { 'use strict';

  const HorizontalRule = core.Node.create({
      name: 'horizontalRule',
      addOptions() {
          return {
              HTMLAttributes: {},
          };
      },
      group: 'block',
      parseHTML() {
          return [{ tag: 'hr' }];
      },
      renderHTML({ HTMLAttributes }) {
          return ['hr', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
      },
      addCommands() {
          return {
              setHorizontalRule: () => ({ chain }) => {
                  return (chain()
                      .insertContent({ type: this.name })
                      // set cursor after horizontal rule
                      .command(({ tr, dispatch }) => {
                      var _a;
                      if (dispatch) {
                          const { $to } = tr.selection;
                          const posAfter = $to.end();
                          if ($to.nodeAfter) {
                              tr.setSelection(state.TextSelection.create(tr.doc, $to.pos));
                          }
                          else {
                              // add node after horizontal rule if it’s the end of the document
                              const node = (_a = $to.parent.type.contentMatch.defaultType) === null || _a === void 0 ? void 0 : _a.create();
                              if (node) {
                                  tr.insert(posAfter, node);
                                  tr.setSelection(state.TextSelection.create(tr.doc, posAfter));
                              }
                          }
                          tr.scrollIntoView();
                      }
                      return true;
                  })
                      .run());
              },
          };
      },
      addInputRules() {
          return [
              core.nodeInputRule({
                  find: /^(?:---|—-|___\s|\*\*\*\s)$/,
                  type: this.type,
              }),
          ];
      },
  });

  exports.HorizontalRule = HorizontalRule;
  exports["default"] = HorizontalRule;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map

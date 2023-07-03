(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/core'), require('@tiptap/extension-blockquote'), require('@tiptap/extension-bold'), require('@tiptap/extension-bullet-list'), require('@tiptap/extension-code'), require('@tiptap/extension-code-block'), require('@tiptap/extension-document'), require('@tiptap/extension-dropcursor'), require('@tiptap/extension-gapcursor'), require('@tiptap/extension-hard-break'), require('@tiptap/extension-heading'), require('@tiptap/extension-history'), require('@tiptap/extension-horizontal-rule'), require('@tiptap/extension-italic'), require('@tiptap/extension-list-item'), require('@tiptap/extension-ordered-list'), require('@tiptap/extension-paragraph'), require('@tiptap/extension-strike'), require('@tiptap/extension-text')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/core', '@tiptap/extension-blockquote', '@tiptap/extension-bold', '@tiptap/extension-bullet-list', '@tiptap/extension-code', '@tiptap/extension-code-block', '@tiptap/extension-document', '@tiptap/extension-dropcursor', '@tiptap/extension-gapcursor', '@tiptap/extension-hard-break', '@tiptap/extension-heading', '@tiptap/extension-history', '@tiptap/extension-horizontal-rule', '@tiptap/extension-italic', '@tiptap/extension-list-item', '@tiptap/extension-ordered-list', '@tiptap/extension-paragraph', '@tiptap/extension-strike', '@tiptap/extension-text'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@tiptap/starter-kit"] = {}, global.core, global.extensionBlockquote, global.extensionBold, global.extensionBulletList, global.extensionCode, global.extensionCodeBlock, global.extensionDocument, global.extensionDropcursor, global.extensionGapcursor, global.extensionHardBreak, global.extensionHeading, global.extensionHistory, global.extensionHorizontalRule, global.extensionItalic, global.extensionListItem, global.extensionOrderedList, global.extensionParagraph, global.extensionStrike, global.extensionText));
})(this, (function (exports, core, extensionBlockquote, extensionBold, extensionBulletList, extensionCode, extensionCodeBlock, extensionDocument, extensionDropcursor, extensionGapcursor, extensionHardBreak, extensionHeading, extensionHistory, extensionHorizontalRule, extensionItalic, extensionListItem, extensionOrderedList, extensionParagraph, extensionStrike, extensionText) { 'use strict';

  const StarterKit = core.Extension.create({
      name: 'starterKit',
      addExtensions() {
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
          const extensions = [];
          if (this.options.blockquote !== false) {
              extensions.push(extensionBlockquote.Blockquote.configure((_a = this.options) === null || _a === void 0 ? void 0 : _a.blockquote));
          }
          if (this.options.bold !== false) {
              extensions.push(extensionBold.Bold.configure((_b = this.options) === null || _b === void 0 ? void 0 : _b.bold));
          }
          if (this.options.bulletList !== false) {
              extensions.push(extensionBulletList.BulletList.configure((_c = this.options) === null || _c === void 0 ? void 0 : _c.bulletList));
          }
          if (this.options.code !== false) {
              extensions.push(extensionCode.Code.configure((_d = this.options) === null || _d === void 0 ? void 0 : _d.code));
          }
          if (this.options.codeBlock !== false) {
              extensions.push(extensionCodeBlock.CodeBlock.configure((_e = this.options) === null || _e === void 0 ? void 0 : _e.codeBlock));
          }
          if (this.options.document !== false) {
              extensions.push(extensionDocument.Document.configure((_f = this.options) === null || _f === void 0 ? void 0 : _f.document));
          }
          if (this.options.dropcursor !== false) {
              extensions.push(extensionDropcursor.Dropcursor.configure((_g = this.options) === null || _g === void 0 ? void 0 : _g.dropcursor));
          }
          if (this.options.gapcursor !== false) {
              extensions.push(extensionGapcursor.Gapcursor.configure((_h = this.options) === null || _h === void 0 ? void 0 : _h.gapcursor));
          }
          if (this.options.hardBreak !== false) {
              extensions.push(extensionHardBreak.HardBreak.configure((_j = this.options) === null || _j === void 0 ? void 0 : _j.hardBreak));
          }
          if (this.options.heading !== false) {
              extensions.push(extensionHeading.Heading.configure((_k = this.options) === null || _k === void 0 ? void 0 : _k.heading));
          }
          if (this.options.history !== false) {
              extensions.push(extensionHistory.History.configure((_l = this.options) === null || _l === void 0 ? void 0 : _l.history));
          }
          if (this.options.horizontalRule !== false) {
              extensions.push(extensionHorizontalRule.HorizontalRule.configure((_m = this.options) === null || _m === void 0 ? void 0 : _m.horizontalRule));
          }
          if (this.options.italic !== false) {
              extensions.push(extensionItalic.Italic.configure((_o = this.options) === null || _o === void 0 ? void 0 : _o.italic));
          }
          if (this.options.listItem !== false) {
              extensions.push(extensionListItem.ListItem.configure((_p = this.options) === null || _p === void 0 ? void 0 : _p.listItem));
          }
          if (this.options.orderedList !== false) {
              extensions.push(extensionOrderedList.OrderedList.configure((_q = this.options) === null || _q === void 0 ? void 0 : _q.orderedList));
          }
          if (this.options.paragraph !== false) {
              extensions.push(extensionParagraph.Paragraph.configure((_r = this.options) === null || _r === void 0 ? void 0 : _r.paragraph));
          }
          if (this.options.strike !== false) {
              extensions.push(extensionStrike.Strike.configure((_s = this.options) === null || _s === void 0 ? void 0 : _s.strike));
          }
          if (this.options.text !== false) {
              extensions.push(extensionText.Text.configure((_t = this.options) === null || _t === void 0 ? void 0 : _t.text));
          }
          return extensions;
      },
  });

  exports.StarterKit = StarterKit;
  exports["default"] = StarterKit;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/core'), require('linkifyjs'), require('@tiptap/pm/state')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/core', 'linkifyjs', '@tiptap/pm/state'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@tiptap/extension-link"] = {}, global.core, global.linkifyjs, global.state));
})(this, (function (exports, core, linkifyjs, state) { 'use strict';

  function autolink(options) {
      return new state.Plugin({
          key: new state.PluginKey('autolink'),
          appendTransaction: (transactions, oldState, newState) => {
              const docChanges = transactions.some(transaction => transaction.docChanged) && !oldState.doc.eq(newState.doc);
              const preventAutolink = transactions.some(transaction => transaction.getMeta('preventAutolink'));
              if (!docChanges || preventAutolink) {
                  return;
              }
              const { tr } = newState;
              const transform = core.combineTransactionSteps(oldState.doc, [...transactions]);
              const { mapping } = transform;
              const changes = core.getChangedRanges(transform);
              changes.forEach(({ oldRange, newRange }) => {
                  // at first we check if we have to remove links
                  core.getMarksBetween(oldRange.from, oldRange.to, oldState.doc)
                      .filter(item => item.mark.type === options.type)
                      .forEach(oldMark => {
                      const newFrom = mapping.map(oldMark.from);
                      const newTo = mapping.map(oldMark.to);
                      const newMarks = core.getMarksBetween(newFrom, newTo, newState.doc).filter(item => item.mark.type === options.type);
                      if (!newMarks.length) {
                          return;
                      }
                      const newMark = newMarks[0];
                      const oldLinkText = oldState.doc.textBetween(oldMark.from, oldMark.to, undefined, ' ');
                      const newLinkText = newState.doc.textBetween(newMark.from, newMark.to, undefined, ' ');
                      const wasLink = linkifyjs.test(oldLinkText);
                      const isLink = linkifyjs.test(newLinkText);
                      // remove only the link, if it was a link before too
                      // because we don’t want to remove links that were set manually
                      if (wasLink && !isLink) {
                          tr.removeMark(newMark.from, newMark.to, options.type);
                      }
                  });
                  // now let’s see if we can add new links
                  const nodesInChangedRanges = core.findChildrenInRange(newState.doc, newRange, node => node.isTextblock);
                  let textBlock;
                  let textBeforeWhitespace;
                  if (nodesInChangedRanges.length > 1) {
                      // Grab the first node within the changed ranges (ex. the first of two paragraphs when hitting enter)
                      textBlock = nodesInChangedRanges[0];
                      textBeforeWhitespace = newState.doc.textBetween(textBlock.pos, textBlock.pos + textBlock.node.nodeSize, undefined, ' ');
                  }
                  else if (nodesInChangedRanges.length
                      // We want to make sure to include the block seperator argument to treat hard breaks like spaces
                      && newState.doc.textBetween(newRange.from, newRange.to, ' ', ' ').endsWith(' ')) {
                      textBlock = nodesInChangedRanges[0];
                      textBeforeWhitespace = newState.doc.textBetween(textBlock.pos, newRange.to, undefined, ' ');
                  }
                  if (textBlock && textBeforeWhitespace) {
                      const wordsBeforeWhitespace = textBeforeWhitespace.split(' ').filter(s => s !== '');
                      if (wordsBeforeWhitespace.length <= 0) {
                          return false;
                      }
                      const lastWordBeforeSpace = wordsBeforeWhitespace[wordsBeforeWhitespace.length - 1];
                      const lastWordAndBlockOffset = textBlock.pos + textBeforeWhitespace.lastIndexOf(lastWordBeforeSpace);
                      if (!lastWordBeforeSpace) {
                          return false;
                      }
                      linkifyjs.find(lastWordBeforeSpace)
                          .filter(link => link.isLink)
                          .filter(link => {
                          if (options.validate) {
                              return options.validate(link.value);
                          }
                          return true;
                      })
                          // calculate link position
                          .map(link => ({
                          ...link,
                          from: lastWordAndBlockOffset + link.start + 1,
                          to: lastWordAndBlockOffset + link.end + 1,
                      }))
                          // add link mark
                          .forEach(link => {
                          tr.addMark(link.from, link.to, options.type.create({
                              href: link.href,
                          }));
                      });
                  }
              });
              if (!tr.steps.length) {
                  return;
              }
              return tr;
          },
      });
  }

  function clickHandler(options) {
      return new state.Plugin({
          key: new state.PluginKey('handleClickLink'),
          props: {
              handleClick: (view, pos, event) => {
                  var _a, _b, _c;
                  if (event.button !== 0) {
                      return false;
                  }
                  const attrs = core.getAttributes(view.state, options.type.name);
                  const link = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest('a');
                  const href = (_b = link === null || link === void 0 ? void 0 : link.href) !== null && _b !== void 0 ? _b : attrs.href;
                  const target = (_c = link === null || link === void 0 ? void 0 : link.target) !== null && _c !== void 0 ? _c : attrs.target;
                  if (link && href) {
                      window.open(href, target);
                      return true;
                  }
                  return false;
              },
          },
      });
  }

  function pasteHandler(options) {
      return new state.Plugin({
          key: new state.PluginKey('handlePasteLink'),
          props: {
              handlePaste: (view, event, slice) => {
                  const { state } = view;
                  const { selection } = state;
                  const { empty } = selection;
                  if (empty) {
                      return false;
                  }
                  let textContent = '';
                  slice.content.forEach(node => {
                      textContent += node.textContent;
                  });
                  const link = linkifyjs.find(textContent).find(item => item.isLink && item.value === textContent);
                  if (!textContent || !link) {
                      return false;
                  }
                  options.editor.commands.setMark(options.type, {
                      href: link.href,
                  });
                  return true;
              },
          },
      });
  }

  const Link = core.Mark.create({
      name: 'link',
      priority: 1000,
      keepOnSplit: false,
      onCreate() {
          this.options.protocols.forEach(protocol => {
              if (typeof protocol === 'string') {
                  linkifyjs.registerCustomProtocol(protocol);
                  return;
              }
              linkifyjs.registerCustomProtocol(protocol.scheme, protocol.optionalSlashes);
          });
      },
      onDestroy() {
          linkifyjs.reset();
      },
      inclusive() {
          return this.options.autolink;
      },
      addOptions() {
          return {
              openOnClick: true,
              linkOnPaste: true,
              autolink: true,
              protocols: [],
              HTMLAttributes: {
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow',
                  class: null,
              },
              validate: undefined,
          };
      },
      addAttributes() {
          return {
              href: {
                  default: null,
              },
              target: {
                  default: this.options.HTMLAttributes.target,
              },
              class: {
                  default: this.options.HTMLAttributes.class,
              },
          };
      },
      parseHTML() {
          return [{ tag: 'a[href]:not([href *= "javascript:" i])' }];
      },
      renderHTML({ HTMLAttributes }) {
          return ['a', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
      },
      addCommands() {
          return {
              setLink: attributes => ({ chain }) => {
                  return chain().setMark(this.name, attributes).setMeta('preventAutolink', true).run();
              },
              toggleLink: attributes => ({ chain }) => {
                  return chain()
                      .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
                      .setMeta('preventAutolink', true)
                      .run();
              },
              unsetLink: () => ({ chain }) => {
                  return chain()
                      .unsetMark(this.name, { extendEmptyMarkRange: true })
                      .setMeta('preventAutolink', true)
                      .run();
              },
          };
      },
      addPasteRules() {
          return [
              core.markPasteRule({
                  find: text => linkifyjs.find(text)
                      .filter(link => {
                      if (this.options.validate) {
                          return this.options.validate(link.value);
                      }
                      return true;
                  })
                      .filter(link => link.isLink)
                      .map(link => ({
                      text: link.value,
                      index: link.start,
                      data: link,
                  })),
                  type: this.type,
                  getAttributes: match => {
                      var _a;
                      return ({
                          href: (_a = match.data) === null || _a === void 0 ? void 0 : _a.href,
                      });
                  },
              }),
          ];
      },
      addProseMirrorPlugins() {
          const plugins = [];
          if (this.options.autolink) {
              plugins.push(autolink({
                  type: this.type,
                  validate: this.options.validate,
              }));
          }
          if (this.options.openOnClick) {
              plugins.push(clickHandler({
                  type: this.type,
              }));
          }
          if (this.options.linkOnPaste) {
              plugins.push(pasteHandler({
                  editor: this.editor,
                  type: this.type,
              }));
          }
          return plugins;
      },
  });

  exports.Link = Link;
  exports["default"] = Link;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map

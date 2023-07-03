'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@tiptap/core');
var state = require('@tiptap/pm/state');
var view = require('@tiptap/pm/view');

const Placeholder = core.Extension.create({
    name: 'placeholder',
    addOptions() {
        return {
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            placeholder: 'Write something …',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
            includeChildren: false,
        };
    },
    addProseMirrorPlugins() {
        return [
            new state.Plugin({
                key: new state.PluginKey('placeholder'),
                props: {
                    decorations: ({ doc, selection }) => {
                        const active = this.editor.isEditable || !this.options.showOnlyWhenEditable;
                        const { anchor } = selection;
                        const decorations = [];
                        if (!active) {
                            return null;
                        }
                        // only calculate isEmpty once due to its performance impacts (see issue #3360)
                        const emptyDocInstance = doc.type.createAndFill();
                        const isEditorEmpty = (emptyDocInstance === null || emptyDocInstance === void 0 ? void 0 : emptyDocInstance.sameMarkup(doc))
                            && emptyDocInstance.content.findDiffStart(doc.content) === null;
                        doc.descendants((node, pos) => {
                            const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
                            const isEmpty = !node.isLeaf && !node.childCount;
                            if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                                const classes = [this.options.emptyNodeClass];
                                if (isEditorEmpty) {
                                    classes.push(this.options.emptyEditorClass);
                                }
                                const decoration = view.Decoration.node(pos, pos + node.nodeSize, {
                                    class: classes.join(' '),
                                    'data-placeholder': typeof this.options.placeholder === 'function'
                                        ? this.options.placeholder({
                                            editor: this.editor,
                                            node,
                                            pos,
                                            hasAnchor,
                                        })
                                        : this.options.placeholder,
                                });
                                decorations.push(decoration);
                            }
                            return this.options.includeChildren;
                        });
                        return view.DecorationSet.create(doc, decorations);
                    },
                },
            }),
        ];
    },
});

exports.Placeholder = Placeholder;
exports["default"] = Placeholder;
//# sourceMappingURL=index.cjs.map

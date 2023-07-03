import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';

const HorizontalRule = Node.create({
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
        return ['hr', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
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
                            tr.setSelection(TextSelection.create(tr.doc, $to.pos));
                        }
                        else {
                            // add node after horizontal rule if it’s the end of the document
                            const node = (_a = $to.parent.type.contentMatch.defaultType) === null || _a === void 0 ? void 0 : _a.create();
                            if (node) {
                                tr.insert(posAfter, node);
                                tr.setSelection(TextSelection.create(tr.doc, posAfter));
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
            nodeInputRule({
                find: /^(?:---|—-|___\s|\*\*\*\s)$/,
                type: this.type,
            }),
        ];
    },
});

export { HorizontalRule, HorizontalRule as default };
//# sourceMappingURL=index.js.map

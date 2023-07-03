'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@tiptap/core');

const TextStyle = core.Mark.create({
    name: 'textStyle',
    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },
    parseHTML() {
        return [
            {
                tag: 'span',
                getAttrs: element => {
                    const hasStyles = element.hasAttribute('style');
                    if (!hasStyles) {
                        return false;
                    }
                    return {};
                },
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
        return {
            removeEmptyTextStyle: () => ({ state, commands }) => {
                const attributes = core.getMarkAttributes(state, this.type);
                const hasStyles = Object.entries(attributes).some(([, value]) => !!value);
                if (hasStyles) {
                    return true;
                }
                return commands.unsetMark(this.name);
            },
        };
    },
});

exports.TextStyle = TextStyle;
exports["default"] = TextStyle;
//# sourceMappingURL=index.cjs.map

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@tiptap/core');

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
//# sourceMappingURL=index.cjs.map

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@tiptap/core');

const TaskList = core.Node.create({
    name: 'taskList',
    addOptions() {
        return {
            itemTypeName: 'taskItem',
            HTMLAttributes: {},
        };
    },
    group: 'block list',
    content() {
        return `${this.options.itemTypeName}+`;
    },
    parseHTML() {
        return [
            {
                tag: `ul[data-type="${this.name}"]`,
                priority: 51,
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['ul', core.mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': this.name }), 0];
    },
    addCommands() {
        return {
            toggleTaskList: () => ({ commands }) => {
                return commands.toggleList(this.name, this.options.itemTypeName);
            },
        };
    },
    addKeyboardShortcuts() {
        return {
            'Mod-Shift-9': () => this.editor.commands.toggleTaskList(),
        };
    },
});

exports.TaskList = TaskList;
exports["default"] = TaskList;
//# sourceMappingURL=index.cjs.map

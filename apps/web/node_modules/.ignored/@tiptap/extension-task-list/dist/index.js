import { Node, mergeAttributes } from '@tiptap/core';

const TaskList = Node.create({
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
        return ['ul', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': this.name }), 0];
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

export { TaskList, TaskList as default };
//# sourceMappingURL=index.js.map

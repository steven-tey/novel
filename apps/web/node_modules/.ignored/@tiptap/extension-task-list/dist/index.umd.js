(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tiptap/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tiptap/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@tiptap/extension-task-list"] = {}, global.core));
})(this, (function (exports, core) { 'use strict';

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

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map

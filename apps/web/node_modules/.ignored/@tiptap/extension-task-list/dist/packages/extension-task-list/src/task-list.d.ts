import { Node } from '@tiptap/core';
export interface TaskListOptions {
    itemTypeName: string;
    HTMLAttributes: Record<string, any>;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        taskList: {
            /**
             * Toggle a task list
             */
            toggleTaskList: () => ReturnType;
        };
    }
}
export declare const TaskList: Node<TaskListOptions, any>;

import { DOMParser } from 'prosemirror-model';

import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  // eslint-disable-next-line no-unused-vars
  interface Commands<ReturnType> {
    InsertVideoExtension: {
      // eslint-disable-next-line no-unused-vars
      insertVideo: (value: string) => ReturnType;
    };
  }
}

const InsertVideoExtension = Extension.create({
  name: 'InsertVideoExtension',
  addCommands() {
    return {
      insertVideo:
        (value: any) =>
        ({ state, dispatch }: { state: any; dispatch: any }) => {
          // check if value is string
          if (typeof value !== 'string') {
            return false;
          }
          const { selection } = state;
          const element = document.createElement('video');
          // video will be fullwidth with controls on
          element.setAttribute('src', value);
          // insert video at current cursor position
          const slice = DOMParser.fromSchema(state.schema).parseSlice(element);
          const transaction = state.tr.insert(selection.from, slice.content);
          dispatch(transaction);
        },
    };
  },
});

export default InsertVideoExtension;

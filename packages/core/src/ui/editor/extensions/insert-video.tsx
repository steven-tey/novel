import { DOMParser } from 'prosemirror-model';

import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  // eslint-disable-next-line no-unused-vars
  interface Commands<ReturnType> {
    InsertVideoExtension: {
      insertVideo: () => ReturnType;
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
          element.setAttribute('controls', 'true');
          element.setAttribute('width', '100%');
          element.setAttribute('height', 'auto');
          element.setAttribute('src', value);

          const slice = DOMParser.fromSchema(state.schema).parseSlice(element);
          const transaction = state.tr.insert(selection.anchor, slice.content);

          dispatch(transaction);
        },
    };
  },
});

export default InsertVideoExtension;

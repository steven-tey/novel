import { DOMParser } from 'prosemirror-model';

import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  // eslint-disable-next-line no-unused-vars
  interface Commands<ReturnType> {
    InsertHTMLExtension: {
      insertHTML: () => ReturnType;
    };
  }
}

const InsertHTMLExtension = Extension.create({
  name: 'InsertHTMLExtension',
  addCommands() {
    return {
      insertHTML:
        (value: any) =>
        ({ state, dispatch }: { state: any; dispatch: any }) => {
          // check if value is string
          if (typeof value !== 'string') {
            return false;
          }
          const { selection } = state;
          const element = document.createElement('div');

          element.innerHTML = value.trim();

          const slice = DOMParser.fromSchema(state.schema).parseSlice(element);
          const transaction = state.tr.insert(selection.anchor, slice.content);
          dispatch(transaction);
        },
    };
  },
});

export default InsertHTMLExtension;

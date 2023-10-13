import { Node, mergeAttributes } from '@tiptap/core';

const Video = Node.create({
  name: 'video', // unique name for the Node
  group: 'block', // belongs to the 'block' group of extensions
  selectable: true, // so we can select the video
  draggable: true, // so we can drag the video
  atom: true, // is a single unit

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)];
  },
});

export default Video;

import { CommandListProps, EditorCommandItem, EditorCommandList } from "@novel/headless";

const CommandList = (props: CommandListProps) => (
  <EditorCommandList
    {...props}
    Element={EditorCommandItem}
    className='z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all'
  />
);

export default CommandList;

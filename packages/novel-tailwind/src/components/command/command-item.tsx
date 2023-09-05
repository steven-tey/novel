import LoadingCircle from "./loading-circle";
import { CommandListItemProps, EditorCommandItem } from "@novel/headless";

const CommandItem = (props: CommandListItemProps) => {
  const { title, isLoading, icon, active, description } = props;
  return (
    <EditorCommandItem
      {...props}
      className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 ${
        active ? "bg-stone-100 text-stone-900" : ""
      }`}>
      <div className='flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white'>
        {title === "Continue writing" && isLoading ? <LoadingCircle /> : icon}
      </div>
      <div>
        <p className='font-medium'>{title}</p>
        <p className='text-xs text-stone-500'>{description}</p>
      </div>
    </EditorCommandItem>
  );
};

export default CommandItem;

import React, { ReactNode } from "react";
import LoadingCircle from "./loading-circle";

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  active: boolean;
  isLoading: boolean;
  onSelect: () => void;
}

const CommandItem = ({
  title,
  description,
  icon,
  onSelect,
  active,
  isLoading,
}: CommandItemProps) => {
  return (
    <button
      className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 ${
        active ? "bg-stone-100 text-stone-900" : ""
      }`}
      onClick={onSelect}>
      <div className='flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white'>
        {title === "Continue writing" && isLoading ? <LoadingCircle /> : icon}
      </div>
      <div>
        <p className='font-medium'>{title}</p>
        <p className='text-xs text-stone-500'>{description}</p>
      </div>
    </button>
  );
};

export default CommandItem;

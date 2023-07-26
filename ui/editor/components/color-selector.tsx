import { Editor } from "@tiptap/core";
import {
  Check,
  ChevronDown
} from "lucide-react";
import { FC } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/ui/primitives/popover";

export interface BubbleColorMenuItem {
  name: string;
  color: string | null;
}

interface ColorSelectorProps {
  editor: Editor;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-black)",
  },
  {
    name: "Purple",
    color: "#9333EA",
  },
  {
    name: "Red",
    color: "#E00000",
  },
  {
    name: "Yellow",
    color: "#EAB308",
  },
  {
    name: "Blue",
    color: "#2563EB",
  },
  {
    name: "Green",
    color: "#008A00",
  },
  {
    name: "Orange",
    color: "#FFA500",
  },
  {
    name: "Pink",
    color: "#BA4081",
  },
  {
    name: "Gray",
    color: "#A8A29E",
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-highlight-default)",
  },
  {
    name: "Purple",
    color: "var(--novel-highlight-purple)",
  },
  {
    name: "Red",
    color: "var(--novel-highlight-red)",
  },
  {
    name: "Yellow",
    color: "var(--novel-highlight-yellow)",
  },
  {
    name: "Blue",
    color: "var(--novel-highlight-blue)",
  },
  {
    name: "Green",
    color: "var(--novel-highlight-green)",
  },
  {
    name: "Orange",
    color: "var(--novel-highlight-orange)",
  },
  {
    name: "Pink",
    color: "var(--novel-highlight-pink)",
  },
  {
    name: "Gray",
    color: "var(--novel-highlight-gray)",
  },
];

export const ColorSelector: FC<ColorSelectorProps> = ({
  editor,
}) => {
  const activeColorItem = TEXT_COLORS.find(({color}) =>
    editor.isActive("textStyle", {color}),
  );
  
  const activeHighlightItem = HIGHLIGHT_COLORS.find(({color}) =>
    editor.isActive("highlight", {color}),
  );
  
  return (
    <Popover>
      <PopoverTrigger
        className="flex h-full items-center gap-1 p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span
          className="rounded-sm px-1"
          style={{
            color: activeColorItem?.color,
            backgroundColor: activeHighlightItem?.color,
          }}
        >
          A
        </span>
        
        <ChevronDown className="h-4 w-4"/>
      </PopoverTrigger>
      <PopoverContent className="w-48 flex-col py-1">
        <div className="my-1 px-2 flex w-full flex-col text-sm text-stone-500">Color</div>
        {TEXT_COLORS.map(({name, color}, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              editor.commands.unsetColor();
              name !== "Default" &&
              editor.chain().focus().setColor(color).run();
            }}
            className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100 w-full"
          >
            <div className="flex items-center space-x-2">
              <div
                className="rounded-sm border border-stone-200 px-1 py-px font-medium"
                style={{color}}
              >
                A
              </div>
              <span>{name}</span>
            </div>
            {editor.isActive("textStyle", {color}) && (
              <Check className="h-4 w-4"/>
            )}
          </button>
        ))}
        
        <div className="mb-1 mt-2 px-2 text-sm text-stone-500">
          Background
        </div>
        
        {HIGHLIGHT_COLORS.map(({name, color}, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              editor.commands.unsetHighlight();
              name !== "Default" && editor.commands.setHighlight({color});
            }}
            className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100 w-full"
          >
            <div className="flex items-center space-x-2">
              <div
                className="rounded-sm border border-stone-200 px-1 py-px font-medium"
                style={{backgroundColor: color}}
              >
                A
              </div>
              <span>{name}</span>
            </div>
            {editor.isActive("highlight", {color}) && (
              <Check className="h-4 w-4"/>
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

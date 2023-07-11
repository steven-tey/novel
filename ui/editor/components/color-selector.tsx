import { Editor } from "@tiptap/core";
import {
  Check,
  ChevronDown
} from "lucide-react";
import {
  Dispatch,
  FC,
  SetStateAction
} from "react";
import { Button } from "@/components/ui/button";

export interface BubbleColorMenuItem {
  name: string;
  color: string | null;
}

interface ColorSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
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
  isOpen,
  setIsOpen,
}) => {
  const activeColorItem = TEXT_COLORS.find(({color}) =>
    editor.isActive("textStyle", {color}),
  );
  
  const activeHighlightItem = HIGHLIGHT_COLORS.find(({color}) =>
    editor.isActive("highlight", {color}),
  );
  
  return (
    <div className="relative h-full">
      <button
        className="flex h-full items-center gap-1 p-2 text-sm font-medium hover:bg-muted active:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
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
      </button>
      
      {isOpen && (
        <section className="fixed top-full z-[99999] mt-1 flex w-auto overflow-hidden divide-x rounded border bg-background p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          <div className="pr-2">
            <div className="px-2 text-sm text-muted-foreground">Color</div>
            {TEXT_COLORS.map(({name, color}, index) => (
              <Button
                variant="ghost"
                size="sm"
                key={index}
                onClick={() => {
                  editor.commands.unsetColor();
                  name !== "Default" &&
                  editor.chain().focus().setColor(color).run();
                  setIsOpen(false);
                }}
                className="w-full justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="rounded-sm border px-1 py-px font-medium"
                    style={{color}}
                  >
                    A
                  </div>
                  <span>{name}</span>
                </div>
                {editor.isActive("textStyle", {color}) && (
                  <Check className="h-4 w-4"/>
                )}
              </Button>
            ))}
          </div>
          
          <div className="pl-2">
            <div className="px-2 text-sm text-muted-foreground">
              Background
            </div>
            
            {HIGHLIGHT_COLORS.map(({name, color}, index) => (
              <Button
                variant="ghost"
                size="sm"
                key={index}
                onClick={() => {
                  editor.commands.unsetHighlight();
                  name !== "Default" && editor.commands.setHighlight({color});
                  setIsOpen(false);
                }}
                className="w-full justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="rounded-sm border px-1 py-px font-medium"
                    style={{backgroundColor: color}}
                  >
                    A
                  </div>
                  <span>{name}</span>
                </div>
                {editor.isActive("highlight", {color}) && (
                  <Check className="h-4 w-4"/>
                )}
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

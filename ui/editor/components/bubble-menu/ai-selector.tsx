import { Editor } from "@tiptap/core";
import {
  Check,
  CheckCheck,
  ChevronDown,
  CornerDownLeft,
  Wand,
} from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Command } from "cmdk";
import { NAVIGATION_KEYS } from "@/lib/constants";
import Magic from "@/ui/shared/magic";
import { useCompletion } from "ai/react";
import AIBubbleMenu from "./ai";

interface AISelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AISelector: FC<AISelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const items = [
    {
      name: "Improve writing",
      icon: Wand,
    },
    {
      name: "Fix spelling & grammar",
      icon: CheckCheck,
    },
  ];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (NAVIGATION_KEYS.includes(e.key)) {
        e.preventDefault();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
    } else {
      document.removeEventListener("keydown", onKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const { complete } = useCompletion({
    id: "novel-edit",
    api: "/api/generate",
  });

  return (
    <div className="relative h-full">
      <button
        className="flex h-full items-center gap-1 border-r border-stone-200 p-2 text-sm font-medium text-purple-500 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Magic className="h-4 w-4" />
        <span className="whitespace-nowrap">Ask AI</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <Command className="fixed top-full z-[99999] mt-1 w-60 overflow-hidden rounded border border-stone-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-1">
          <Command.List>
            {items.map((item, index) => (
              <Command.Item
                key={index}
                onSelect={() => {
                  const { from, to } = editor.state.selection;
                  const text = editor.state.doc.textBetween(from, to, " ");
                  complete(text);
                  setIsOpen(false);
                }}
                className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm text-gray-600 active:bg-stone-200 aria-selected:bg-stone-100"
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4 text-purple-500" />
                  <span>{item.name}</span>
                </div>
                <CornerDownLeft className="invisible h-4 w-4 aria-selected:visible" />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      )}
    </div>
  );
};

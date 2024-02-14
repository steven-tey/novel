"use client";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/tailwind/ui/command";

import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { useEditor } from "novel";
import { getPrevText } from "novel/extensions";
import { useState } from "react";
import { match } from "ts-pattern";
import Markdown from "react-markdown";

const options = [
  {
    value: "improve",
    label: "Improve writing",
  },
  {
    value: "continue",
    label: "Continue writing",
  },
  {
    value: "fix",
    label: "Fix grammar",
  },
  {
    value: "sorter",
    label: "Make shorter",
  },
  {
    value: "longer",
    label: "Make longer",
  },
];

const completionOption = [
  {
    value: "replace",
    label: "Replace selection",
  },
  {
    value: "insert",
    label: "Insert below",
  },
  {
    value: "continue",
    label: "Continue writing",
  },
  {
    value: "longer",
    label: "Make longer",
  },
  {
    value: "again",
    label: "Try again",
  },
  {
    value: "discard",
    label: "Discard",
  },
]; //TODO: I think it makes more sense to create a custom Tiptap extension for this functionality https://tiptap.dev/docs/editor/ai/introduction

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISelector({ open, onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [extraPrompt, setExtraPrompt] = useState("");

  const { completion, complete, isLoading } = useCompletion({
    // id: "novel",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });

  const hasCompletion = completion.length > 0;
  return (
    <Command>
      {hasCompletion && (
        <div className="prose p-2 px-4 text-sm">
          <Markdown>{completion}</Markdown>
        </div>
      )}

      <CommandInput
        onFocus={() => {
          editor.chain().setHighlight({ color: "#c1ecf970" }).run();
        }}
        value={extraPrompt}
        onValueChange={setExtraPrompt}
        autoFocus
        placeholder={
          isLoading ? "AI is writing" : "Ask AI to edit or generate..."
        }
        className="w-[350px]"
      />
      {!hasCompletion && (
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              className="px-4"
              key={option.value}
              value={option.value}
              onSelect={(option) => {
                const text = match(option)
                  .with("improve", () => {
                    const slice = editor.state.selection.content();
                    const markdown =
                      editor.storage.markdown.serializer.serialize(
                        slice.content,
                      );

                    return markdown;
                  })
                  .with("continue", () => {
                    return getPrevText(editor, {
                      chars: 5000,
                    });
                  })
                  .run();
                complete(text, { body: { option } });
              }}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
      {hasCompletion && (
        <CommandGroup>
          {completionOption.map((option) => (
            <CommandItem
              className="px-4"
              key={option.value}
              value={option.value}
              onSelect={(option) => {
                if (option === "continue") {
                  getPrevText(editor, {
                    chars: 5000,
                  });
                  complete(editor.getText());
                }
              }}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </Command>
  );
}

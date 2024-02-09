"use client";
import { Github } from "@/components/ui/icons";
import {
  defaultEditorProps,
  Editor,
  EditorBubble,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
} from "novel";
import { useState } from "react";
import {
  taskItem,
  taskList,
  tiptapImage,
  tiptapLink,
  updatedImage,
  horizontalRule,
  slashCommand,
  starterKit,
  placeholder,
} from "../lib/extensions";
import { NodeSelector } from "../lib/selectors/node-selector";
import { LinkSelector } from "../lib/selectors/link-selector";
import { ColorSelector } from "../lib/selectors/color-selector";
import TextButtons from "../lib/selectors/text-buttons";
import { suggestionItems } from "../lib/suggestions";
import { ImageResizer } from "novel/extensions";
import { defaultEditorContent } from "@/lib/content";
import { AISelector } from "@/lib/selectors/ai-selector";
import Magic from "@/components/ui/icons/magic";
import { Button } from "@/components/ui/button";
import Menu from "@/components/ui/menu";
import { Separator } from "@/components/ui/separator";

const extensions = [
  starterKit,
  horizontalRule,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  slashCommand,
  placeholder,
];
export default function Page() {
  const [saveStatus, setSaveStatus] = useState("Saved");

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
      <Button
        size="icon"
        variant="outline"
        className="absolute bottom-5 left-5 z-10 max-h-fit rounded-lg p-2 transition-colors duration-200 sm:bottom-auto sm:top-5"
      >
        <a href="https://github.com/steven-tey/novel" target="_blank">
          <Github />
        </a>
      </Button>
      <Menu />
      <div className="relative w-full max-w-screen-lg">
        <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
          {saveStatus}
        </div>
        <Editor>
          <EditorContent
            extensions={extensions}
            content={defaultEditorContent}
            className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
            editorProps={{
              ...defaultEditorProps,
              attributes: {
                class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
              },
            }}
            onUpdate={() => {
              setSaveStatus("Unsaved");
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommand>

            <EditorBubble
              tippyOptions={{
                placement: openAI ? "bottom" : "top",
              }}
              className="flex w-fit overflow-hidden rounded border border-muted bg-background shadow-xl"
            >
              {openAI ? (
                <AISelector open={openAI} onOpenChange={setOpenAI} />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenAI(!openAI);
                    }}
                    className="items-center justify-between gap-2 rounded-none"
                  >
                    <Magic className="h-5 w-5" /> Ask AI
                  </Button>
                  <Separator orientation="vertical" />
                  <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                  <Separator orientation="vertical" />

                  <LinkSelector open={openLink} onOpenChange={setOpenLink} />

                  <Separator orientation="vertical" />

                  <TextButtons />
                  <Separator orientation="vertical" />

                  <ColorSelector open={openColor} onOpenChange={setOpenColor} />
                </>
              )}
            </EditorBubble>
          </EditorContent>
        </Editor>
      </div>
    </div>
  );
}

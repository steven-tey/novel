"use client";
import { Github } from "@/ui/icons";
import Menu from "@/ui/menu";
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
import { defaultEditorContent } from "./content";
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
} from "./_components/extensions";
import { NodeSelector } from "./_components/selectors/node-selector";
import { LinkSelector } from "./_components/selectors/link-selector";
import { ColorSelector } from "./_components/selectors/color-selector";
import TextButtons from "./_components/selectors/text-buttons";
import { suggestionItems } from "./_components/command/suggestions";
import { ImageResizer } from "novel/extensions";

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

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
      <a
        href="https://github.com/steven-tey/novel"
        target="_blank"
        className="absolute bottom-5 left-5 z-10 max-h-fit rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto sm:top-5"
      >
        <Github />
      </a>
      <Menu />
      <Editor>
        <div className="relative w-full max-w-screen-lg">
          <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
            {saveStatus}
          </div>
          <EditorContent
            extensions={extensions}
            content={defaultEditorContent}
            className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
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
            <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-stone-700">
                No results
              </EditorCommandEmpty>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 aria-selected:bg-stone-100 `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-stone-500">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommand>
            <EditorBubble
              tippyOptions={{
                onHidden: () => {
                  setIsColorSelectorOpen(false);
                  setIsNodeSelectorOpen(false);
                  setIsLinkSelectorOpen(false);
                },
              }}
              className="flex w-fit divide-x divide-stone-200 rounded border border-stone-200 bg-white shadow-xl"
            >
              <NodeSelector
                isOpen={isNodeSelectorOpen}
                setIsOpen={() => {
                  setIsNodeSelectorOpen(!isNodeSelectorOpen);
                  setIsColorSelectorOpen(false);
                  setIsLinkSelectorOpen(false);
                }}
              />
              <LinkSelector
                isOpen={isLinkSelectorOpen}
                setIsOpen={() => {
                  setIsLinkSelectorOpen(!isLinkSelectorOpen);
                  setIsColorSelectorOpen(false);
                  setIsNodeSelectorOpen(false);
                }}
              />

              <TextButtons />
              <ColorSelector
                isOpen={isColorSelectorOpen}
                setIsOpen={() => {
                  setIsColorSelectorOpen(!isColorSelectorOpen);
                  setIsNodeSelectorOpen(false);
                  setIsLinkSelectorOpen(false);
                }}
              />
            </EditorBubble>
          </EditorContent>
        </div>
      </Editor>
    </div>
  );
}

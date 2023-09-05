"use client";

import { useState } from "react";
import {
  EditorBubble,
  EditorProvider,
  createEditorSlashCommand,
} from "@novel/headless";
import {
  ColorSelector,
  EditorCommandList,
  LinkSelector,
  NodeSelector,
  TextButtons,
  defaultExtensionsStylingOptions,
} from "@novel/tailwind";

export default function Editor() {
  const [saveStatus, setSaveStatus] = useState("Saved");

  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
        {saveStatus}
      </div>
      <EditorProvider
        className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
        extensions={[createEditorSlashCommand(EditorCommandList)]}
        editorProps={{
          attributes: {
            class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        onUpdate={() => {
          setSaveStatus("Unsaved");
        }}
        onDebouncedUpdate={() => {
          setSaveStatus("Saving...");
          // Simulate a delay in saving.
          setTimeout(() => {
            setSaveStatus("Saved");
          }, 500);
        }}
        defaultStylingOptions={defaultExtensionsStylingOptions}
      >
        <EditorBubble
          onHidden={() => {
            setIsColorSelectorOpen(false);
            setIsNodeSelectorOpen(false);
            setIsLinkSelectorOpen(false);
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
      </EditorProvider>
    </div>
  );
}

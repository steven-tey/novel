"use client";

import useLocalStorage from "@/lib/hooks/use-local-storage";
import "@blocknote/core/style.css";
import { BlockNoteEditor, Block } from "@blocknote/core";
import {
  BlockNoteView,
  defaultReactSlashMenuItems,
  ReactSlashMenuItem,
  useBlockNote,
} from "@blocknote/react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Edit3, Wand2, WrapText } from "lucide-react";

const editorClasses = [
  {
    tag: "prose-code",
    className:
      "rounded-md bg-gray-200 px-1.5 py-1 font-mono font-medium text-rose-500",
  },
  {
    tag: "prose-a",
    className:
      "text-stone-400 underline underline-offset-[3px] transition-colors cursor-pointer",
  },
];

export default function Editor() {
  const [content, setContent] = useLocalStorage<string | null>("content", null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [editorReady, setEditorReady] = useState(false);
  const [hydratedEditor, setHydratedEditor] = useState(false);

  const debouncedSave = useDebouncedCallback(async (markdown: string) => {
    setSaveStatus("Saving...");
    setContent(markdown);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus("Saved");
    }, 200);
  }, 500);

  // debounce the changes by 100ms to avoid a flash of "Unsaved" on first load
  const debouncedChanges = useDebouncedCallback(
    async (editor: BlockNoteEditor) => {
      const markdown: string = await editor.blocksToMarkdown(
        editor.topLevelBlocks,
      );
      if (content !== markdown) {
        setSaveStatus("Unsaved");
        debouncedSave(markdown);
      }
    },
    100,
  );

  const predict = async (editor: BlockNoteEditor, prompt: string) => {
    const currentBlock: Block = editor.getTextCursorPosition().block;
    console.log("currentBlock", currentBlock);
    const content: string = await editor.blocksToMarkdown(
      editor.topLevelBlocks,
    );
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        content,
      }),
    });
    if (!response.ok) {
      alert(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let text = "";
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      text += chunkValue;

      editor.updateBlock(currentBlock, {
        content: [
          // @ts-expect-error TODO: fix this
          ...currentBlock.content.slice(0, -1),
          // @ts-expect-error TODO: fix this
          {
            ...currentBlock.content.at(-1),
            // @ts-expect-error TODO: fix this
            text: currentBlock.content.at(-1).text + text.trim(),
          },
        ],
      });
    }
  };

  const slashMenuItems = [
    new ReactSlashMenuItem(
      "Continue writing",
      async (editor) => await predict(editor, "continue writing"),
      ["ai", "elaborate", "expand"],
      "Novel AI",
      <Edit3 size={18} />,
      "Use AI to expand on your existing thoughts",
    ),
    new ReactSlashMenuItem(
      "Improve writing",
      () => {
        alert("WIP");
      },
      ["ai"],
      "Novel AI",
      <Wand2 size={18} />,
      "Use AI to improve your writing",
    ),
    new ReactSlashMenuItem(
      "Simplify writing",
      () => {
        alert("WIP");
      },
      ["ai", "shorten", "concise"],
      "Novel AI",
      <WrapText size={18} />,
      "Make your writing more concise with AI",
    ),
    new ReactSlashMenuItem(
      "Expand writing",
      () => {
        alert("WIP");
      },
      ["ai", "make longer", "elaborate"],
      "Novel AI",
      <WrapText size={18} />,
      "Make your writing longer with AI",
    ),
    ...defaultReactSlashMenuItems.map((item) => ({
      ...item,
      shortcut: undefined,
    })),
  ];

  const editorClassesStr = editorClasses
    .flatMap(({ tag, className }) =>
      className.split(" ").flatMap((c) => `${tag}:${c}`),
    )
    .join(" ");

  const editor: BlockNoteEditor | null = useBlockNote({
    onEditorContentChange: debouncedChanges,
    editorDOMAttributes: {
      class: `prose-lg prose-headings:font-vercel font-default prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg ${editorClassesStr}`,
    },
    defaultStyles: false,
    slashCommands: slashMenuItems,
    onEditorReady: () => {
      setEditorReady(true);
    },
  });

  useEffect(() => {
    // only run this once, when:
    // - the editor is ready
    // - the content is ready
    // - the editor has not been hydrated yet
    if (editor && editorReady && content && !hydratedEditor) {
      const getBlocks = async () => {
        const blocks: Block[] = await editor.markdownToBlocks(content);
        editor.replaceBlocks(editor.topLevelBlocks, blocks);
        setHydratedEditor(true);
      };
      getBlocks();
    }
  }, [editor, editorReady, content, hydratedEditor]);

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border border-gray-200 p-10 pt-16 pr-16 shadow-lg sm:rounded-lg">
      <div className="absolute top-5 right-7 mb-5 rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-400">
        {saveStatus}
      </div>
      <BlockNoteView editor={editor} />
    </div>
  );
}

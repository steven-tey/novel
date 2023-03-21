"use client";

import useLocalStorage from "@/lib/hooks/use-local-storage";
import "@blocknote/core/style.css";
import { BlockNoteEditor, Block } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Editor() {
  const [content, setContent] = useLocalStorage<string | null>("content", null);
  const [contentDraft, setContentDraft] = useLocalStorage<string>(
    "content-draft",
    "",
  );
  const draftStatus = useMemo(
    () => (content && contentDraft === content ? "Published" : "Draft"),
    [content, contentDraft],
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [editorReady, setEditorReady] = useState(false);
  const [hydratedEditor, setHydratedEditor] = useState(false);

  const debouncedSave = useDebouncedCallback(async (markdown: string) => {
    setSaveStatus("Saving...");
    setContentDraft(markdown);
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
      if (contentDraft !== markdown) {
        setSaveStatus("Unsaved");
        debouncedSave(markdown);
      }
    },
    100,
  );

  const editor: BlockNoteEditor | null = useBlockNote({
    onEditorContentChange: debouncedChanges,
    _tiptapOptions: {
      editorProps: {
        attributes: {
          class: "prose font-vercel",
        },
      },
    },
    onEditorReady: () => {
      setEditorReady(true);
    },
  });

  useEffect(() => {
    // only run this once, when:
    // - the editor is ready
    // - the contentDraft is ready
    // - the editor has not been hydrated yet
    if (editor && editorReady && contentDraft && !hydratedEditor) {
      const getBlocks = async () => {
        const blocks: Block[] = await editor.markdownToBlocks(contentDraft);
        editor.replaceBlocks(editor.topLevelBlocks, blocks);
        setHydratedEditor(true);
      };
      getBlocks();
    }
  }, [editor, editorReady, contentDraft, hydratedEditor]);

  return (
    <>
      <div className="mb-5 rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-400">
        {saveStatus}
      </div>
      <div className="min-h-[500px] w-full max-w-screen-lg rounded-lg border-2 border-gray-600 p-10">
        <BlockNoteView editor={editor} />
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Editor as NovelEditor, createSlashCommand } from "novel";

export default function Editor() {
  const [saveStatus, setSaveStatus] = useState("Saved");

  const slashCommandExtension = createSlashCommand({
    suggestionItems: [],
  });

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
        {saveStatus}
      </div>
      <NovelEditor
        onUpdate={() => {
          setSaveStatus("Unsaved");
        }}
        extensions={[slashCommandExtension]}
        onDebouncedUpdate={() => {
          setSaveStatus("Saving...");
          // Simulate a delay in saving.
          setTimeout(() => {
            setSaveStatus("Saved");
          }, 500);
        }}
      />
    </div>
  );
}

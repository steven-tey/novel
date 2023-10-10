'use client';

import { useRef, useState } from 'react';
import { Editor as NovelEditor } from '@patikadev/novel';
import { Editor as EditorClass } from '@tiptap/core';

export default function Editor() {
  const [saveStatus, setSaveStatus] = useState('Saved');
  const editorRef = useRef<EditorClass>();

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
        {saveStatus}
      </div>
      <NovelEditor
        setEditor={(e: any) => {
          editorRef.current = e;
        }}
        onUpdate={() => {
          setSaveStatus('Unsaved');
        }}
        onDebouncedUpdate={() => {
          setSaveStatus('Saving...');
          // Simulate a delay in saving.
          setTimeout(() => {
            setSaveStatus('Saved');
          }, 500);
        }}
      />
    </div>
  );
}

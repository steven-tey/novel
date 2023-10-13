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
        defaultValue={''}
        disableLocalStorage={true}
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
        imageUploader={async (file: File) => {
          console.log('Uploading image...', file);
          return 'https://s19538.pcdn.co/wp-content/uploads/2020/03/passion.jpg';
        }}
        videoUploader={async (file: File) => {
          console.log('Uploading image...', file);
          // video chosen by copilot
          return 'https://www.youtube.com/watch?v=9bZkp7q19f0';
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { prosemirrorJSONToYXmlFragment } from "y-prosemirror";
import type { Editor } from "@tiptap/core";
import type { Schema } from "@tiptap/pm/model";

import { yProvider } from "./extensions/collaboration";
import DEFAULT_EDITOR_CONTENT from "./default-content";

export function useInitialEditorState(editor: Editor | null) {
  const [seedInitialState, setSeedInitialState] =
    useState<(editor: Schema) => void>();

  useEffect(() => {
    const handleSync = (connected: boolean) => {
      if (connected) {
        setSeedInitialState(() => (schema: Schema) => {
          const aloneInTheRoom = yProvider.awareness.getStates().size === 1;
          const fragment = yProvider.doc.getXmlFragment("content");

          if (
            aloneInTheRoom &&
            (fragment.length === 0 ||
              (fragment.length === 1 &&
                fragment.toJSON() === "<paragraph></paragraph>"))
          ) {
            prosemirrorJSONToYXmlFragment(
              schema,
              DEFAULT_EDITOR_CONTENT,
              fragment,
            );
          }
        });
      }
    };

    yProvider.on("sync", handleSync);

    return () => yProvider.off("sync", handleSync);
  }, []);

  useEffect(() => {
    if (editor && seedInitialState) {
      seedInitialState(editor.schema);
    }
  }, [editor, seedInitialState]);
}

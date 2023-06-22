import { useEffect } from "react";
import type { Editor } from "@tiptap/core";

import { useConnectionStatus } from "./extensions/collaboration";
import DEFAULT_EDITOR_CONTENT from "./default-content";

export function useInitialEditorState(editor: Editor | null) {
  const connectionStatus = useConnectionStatus();

  // useEffect(() => {
  //   const isOffline =
  //     connectionStatus === "disconnected" &&
  //     !window.location.search.includes("room=");
  //   if (editor && isOffline) {
  //     editor.commands.setContent(DEFAULT_EDITOR_CONTENT);
  //   }
  // }, [editor, connectionStatus]);
}

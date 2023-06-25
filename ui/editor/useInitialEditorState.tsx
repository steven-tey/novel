import { useEffect } from "react";
import type { Editor } from "@tiptap/core";

import {
  useCollaborationProvider,
  useConnectionStatus,
} from "./extensions/collaboration";
import DEFAULT_EDITOR_CONTENT from "./default-content";

export function useInitialEditorState(editor: Editor | null) {
  const connectionStatus = useConnectionStatus();
  const yProvider = useCollaborationProvider();

  useEffect(() => {
    const isOffline =
      connectionStatus === "disconnected" &&
      !window.location.search.includes("room=");

    if (
      editor &&
      isOffline &&
      yProvider.persistence.synced &&
      yProvider.doc.getXmlFragment("offline-room").get(0)?.toJSON() ===
        "<paragraph></paragraph>"
    ) {
      editor.commands.setContent(DEFAULT_EDITOR_CONTENT);
    }
  }, [editor, connectionStatus, yProvider.doc, yProvider.persistence.synced]);
}

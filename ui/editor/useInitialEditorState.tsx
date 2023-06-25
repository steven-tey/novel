import { useEffect } from "react";
import type { Editor } from "@tiptap/core";

import {
  useCollaborationProvider,
  useConnectionStatus,
} from "./extensions/collaboration";
import DEFAULT_EDITOR_CONTENT from "./default-content";
import { usePersistenceSynced } from "./extensions/collaboration/usePersistenceSynced";

export function useInitialEditorState(editor: Editor | null) {
  const connectionStatus = useConnectionStatus();
  const yProvider = useCollaborationProvider();
  const persistenceSynced = usePersistenceSynced();

  useEffect(() => {
    const isOffline =
      connectionStatus === "disconnected" &&
      yProvider.persistence.name === "offline-room";

    const firstParagraph = yProvider.doc.getXmlFragment("offline-room").get(0);

    if (
      editor &&
      isOffline &&
      persistenceSynced &&
      (!firstParagraph || firstParagraph.toJSON() === "<paragraph></paragraph>")
    ) {
      editor.commands.setContent(DEFAULT_EDITOR_CONTENT);
    }
  }, [
    editor,
    connectionStatus,
    yProvider.doc,
    yProvider.persistence?.name,
    persistenceSynced,
  ]);
}

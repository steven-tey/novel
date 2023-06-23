import TiptapCollaboration from "@tiptap/extension-collaboration";
import TiptapCursor from "@tiptap/extension-collaboration-cursor";
import { useMemo } from "react";
import { useCollaborationProvider } from "./collaborationStore";

export function useCollaborationExtensions() {
  const yProvider = useCollaborationProvider();

  return useMemo(() => {
    return [
      TiptapCollaboration.configure({
        document: yProvider.doc,
        field: yProvider.roomname,
      }),
      TiptapCursor.configure({ provider: yProvider }),
    ];
  }, [yProvider]);
}


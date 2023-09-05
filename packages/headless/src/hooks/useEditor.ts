import { Editor } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";

const useEditor = useCurrentEditor as () => { editor: Editor | null };

export default useEditor;

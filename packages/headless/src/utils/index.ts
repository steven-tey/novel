import { Fragment, type Node } from "@tiptap/pm/model";
import type { EditorInstance } from "../components";

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (_e) {
    return null;
  }
}

// Get the text before a given position in markdown format
export const getPrevText = (editor: EditorInstance, position: number) => {
  const nodes: Node[] = [];
  editor.state.doc.forEach((node, pos) => {
    if (pos >= position) return false;
    nodes.push(node);
    return true;
  });
  const fragment = Fragment.fromArray(nodes);
  const doc = editor.state.doc.copy(fragment);

  return editor.storage.markdown.serializer.serialize(doc) as string;
};

// Get all content from the editor in markdown format
export const getAllContent = (editor: EditorInstance) => {
  const fragment = editor.state.doc.content;
  const doc = editor.state.doc.copy(fragment);

  return editor.storage.markdown.serializer.serialize(doc) as string;
};

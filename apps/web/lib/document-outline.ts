export type OutlineItem = {
  id: string;
  level: 1 | 2 | 3;
  text: string;
};

const collectText = (node: any): string => {
  if (!node) return "";
  if (node.type === "text" && typeof node.text === "string") return node.text;
  if (!Array.isArray(node.content)) return "";
  return node.content.map(collectText).join("");
};

export const getDocumentOutline = (contentJson: any): OutlineItem[] => {
  const nodes = Array.isArray(contentJson?.content) ? contentJson.content : [];

  return nodes
    .map((node: any, index: number) => {
      if (node?.type !== "heading") return null;
      const level = node.attrs?.level;
      if (level !== 1 && level !== 2 && level !== 3) return null;
      const text = collectText(node).trim();
      if (!text) return null;
      return {
        id: `${index}-${level}-${text}`,
        level,
        text,
      };
    })
    .filter((item): item is OutlineItem => Boolean(item));
};

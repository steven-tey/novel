import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch (e) {
    return null;
  }
}

export function isMarkdown(text: string) {
  const markdownPatterns = [
    /^# .+/gm, // Headers
    /^- .+/gm, // Unordered list
    /^\* .+/gm, // Unordered list alternative
    /\*\*.+\*\*/g, // Bold text
    /!\[.*\]\(.*\)/g, // Images
    /__.*__/g, // Bold text alternative
    /\*.*\*/g, // Italic text
    /_.*_/g, // Italic text alternative
    /\[.*\]\(.*\)/g, // Links
    /^> .+/gm, // Blockquotes
    /`.*`/g, // Inline code
    /```[\s\S]*?```/g, // Code block
    /^\d+\..+/gm, // Ordered list
    /^---+$/gm, // Horizontal rule
    /^- - -+$/gm, // Horizontal rule alternative
    /^\* \* \*+$/gm, // Horizontal rule alternative
    /\[x\]/gi, // Task list checked
    /\[ \]/gi, // Task list unchecked
    /^```[\w\W]+?```/gm, // Fenced code block
    /^\|?.+\|.+\|/gm, // Tables
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
}

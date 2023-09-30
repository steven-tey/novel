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

export const convertMarkdownToHTML = (markdown: string): string => {
  type ImageContent = {
    src: string;
    alt: string;
  };
  type LinkContent = {
    href: string;
    text: string;
  };
  type ChecklistItemContent = {
    text: string;
    checked: boolean;
  };
  type HeadingContent = {
    text: string;
    level: number;
  };
  type Content = string | string[] | ImageContent | LinkContent | ChecklistItemContent[] | HeadingContent;
  type ParsedElement = {
    type: "heading" | "blockquote" | "multilineBlockquote" | "checklist" | "ul" | "ol" | "strong" | "em" | "img" | "a" | "code" | "pre" | "paragraph" | "strikethrough" | "inline";
    content: Content;
  };
  type Appender<T> = {
    [key in ParsedElement['type']]: (content: T) => string;
  }

  const parseInlineElements = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\!\[(.*?)\]\((.+?)\)/g, '<img alt="$1" src="$2">')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>');
  };

  const appenders: Appender<Content> = {
    heading: (content) => {
      const headingContent = content as HeadingContent;
      return `<h${headingContent.level}>${headingContent.text}</h${headingContent.level}>`;  // Use HeadingContent type
    },
    blockquote: (content) => `<blockquote><p>${content}</p></blockquote>`,
    ul: (content) => `<ul><li>${content}</li></ul>`,
    ol: (content) => `<ol><li>${content}</li></ol>`,
    strong: (content) => `<strong>${content}</strong>`,
    em: (content) => `<em>${content}</em>`,
    img: (content) => `<img alt="${(content as ImageContent).alt}" src="${(content as ImageContent).src}">`,
    a: (content) => `<a href="${(content as LinkContent).href}">${(content as LinkContent).text}</a>`,
    code: (content) => `<code>${content}</code>`,
    pre: (content) => `<pre><code>${content}</code></pre>`,
    paragraph: (content) => `<p>${content}</p>`,
    strikethrough: (content) => `<del>${content}</del>`,
    inline: (content) => `${content}`,
    multilineBlockquote: (content) => `<blockquote><p>${(content as string[]).join('</p><p>')}</p></blockquote>`,
    checklist: (content) => {
      const items = content as ChecklistItemContent[];
      const itemsHtml = items.map(item => `
        <li data-checked="${item.checked}">
          <label contenteditable="false">
            <input type="checkbox" ${item.checked ? 'checked' : ''}>
            <span></span>
          </label>
          <div>
            <p>${item.text}</p>
          </div>
        </li>
      `).join('');

      return `<ul data-type="taskList">${itemsHtml}</ul>`;
    },
  };

  const patterns: {
    regex: RegExp;
    type: ParsedElement['type'];
    replacer: (match: string, ...groups: string[]) => Content;
  }[] = [
      { regex: /^> .+/, type: 'blockquote', replacer: (match) => match.replace(/^> /, '') },
      {
        regex: /^(#{1,6}) (.+)/,
        type: 'heading',
        replacer: (match, hashes, content) => ({ text: content, level: hashes.length })
      },
      { regex: /^\* .+/, type: 'ul', replacer: (match) => match.replace(/^[\*\-] /, '') },
      { regex: /^- .+/, type: 'ul', replacer: (match) => match.replace(/^[\*\-] /, '') },
      { regex: /^\d+\. .+/, type: 'ol', replacer: (match) => match.replace(/^\d+\. /, '') },
      { regex: /\*\*(.+)\*\*/, type: 'strong', replacer: (match, content) => content },
      { regex: /\*(.+)\*/, type: 'em', replacer: (match, content) => content },
      {
        regex: /\!\[(.+)\]\((.+)\)/,
        type: 'img',
        replacer: (match, alt, src) => ({ alt, src })
      },
      { regex: /\[(.+)\]\((.+)\)/, type: 'a', replacer: (match, text, href) => ({ text, href }) },
      { regex: /`([^`]+)`/, type: 'code', replacer: (match, content) => content },
      { regex: /~~(.+?)~~/, type: 'strikethrough', replacer: (match, content) => content },
    ];

  const parseLine = (lines: string[]): ParsedElement => {
    if (lines.every(line => line.startsWith('>'))) {
      return { type: 'multilineBlockquote', content: lines.map(line => line.replace(/^> /, '')) };
    }

    const inlineParsed = parseInlineElements(lines[0]);

    for (const pattern of patterns) {
      if (pattern.regex.test(inlineParsed)) {
        const match = inlineParsed.match(pattern.regex)!;
        return { type: pattern.type, content: pattern.replacer(...(match as [string, ...string[]])) };
      }
    }

    // Check if the entire line is an inline element and, if so, don’t wrap it in a paragraph
    const inlineElementRegex = /^(<img|<a|<code|<strong|<em|<del).+$/;
    if (inlineElementRegex.test(inlineParsed.trim())) {
      return { type: 'inline', content: inlineParsed.trim() };
    }

    return { type: 'paragraph', content: inlineParsed };
  };

  const handleChecklistItems = (parsedElements: ParsedElement[], checklistItems: ChecklistItemContent[]) => {
    if (checklistItems.length > 0) {
      parsedElements.push({ type: 'checklist', content: checklistItems });
      return [];
    }
    return checklistItems;
  };

  const handleAccumulatingLines = (parsedElements: ParsedElement[], accumulatingLines: string[]) => {
    if (accumulatingLines.length > 0) {
      parsedElements.push(parseLine(accumulatingLines));
      return [];
    }
    return accumulatingLines;
  };

  function handleFencedCodeBlock(parsedElements: ParsedElement[], codeLines: string[]) {
    const codeBlock = codeLines.join('\n');
    const patternCodeBlock = /```(?:\w*\r?\n)?([\s\S]+?)```/;
  
    if (patternCodeBlock.test(codeBlock)) {
      const match = codeBlock.match(patternCodeBlock);
      if (match) {
        const content = match[1].trim();
        parsedElements.push({ type: 'pre', content });
      }
      codeLines.length = 0;  // Clear the codeLines array
    }
  }

  const lines = markdown.split('\n');
  const parsedElements: ParsedElement[] = [];
  let accumulatingLines: string[] = [];
  let checklistItems: ChecklistItemContent[] = [];
  let codeLines: string[] = [];


  lines.forEach(line => {
    const checkboxMatch = line.match(/^- \[(x| )\] (.+)/);
    if (line.startsWith('```')) {
      codeLines.push(line);
    } else if (codeLines.length) {
      codeLines.push(line);
      handleFencedCodeBlock(parsedElements, codeLines);
    } else if (checkboxMatch) {
      checklistItems.push({
        text: parseInlineElements(checkboxMatch[2]),
        checked: checkboxMatch[1] === 'x'
      });
    } else if (line.startsWith('>')) {
      checklistItems = handleChecklistItems(parsedElements, checklistItems);
      accumulatingLines.push(parseInlineElements(line));
    } else {
      accumulatingLines = handleAccumulatingLines(parsedElements, accumulatingLines);
      checklistItems = handleChecklistItems(parsedElements, checklistItems);
      parsedElements.push(parseLine([line]));
    }
  });

  handleAccumulatingLines(parsedElements, accumulatingLines);
  handleChecklistItems(parsedElements, checklistItems);

  let html = '';
  parsedElements.forEach((item) => {
    if (appenders[item.type]) {
      html += appenders[item.type](item.content);
    } else {
      console.warn(`No appender for type ${item.type}`);
    }
  });

  return html;
};


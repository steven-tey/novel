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
    type: "heading" | "blockquote" | "checklist" | "ul" | "ol" | "strong" | "em" | "img" | "a" | "code" | "pre" | "paragraph" | "strikethrough" | "inline" | "horizontalRule";
    content: Content;
};
type Appender<T> = {
    [key in ParsedElement['type']]: (content: T) => string;
}

export const REGEX_PATTERNS = {
    BOLD: /\*\*(.+?)\*\*/g,
    ITALIC: /\*(.+?)\*/g,
    IMAGE: /\!\[(.+)\]\((.+)\)/,
    LINK: /(?<!\!)\[(.+?)\]\((.+?)\)/g,
    INLINE_CODE: /`([^`]+)`/g,
    STRIKETHROUGH: /~~(.+?)~~/g,
    HEADING: /^(#{1,6}) (.+)/,
    UNORDERED_LIST: /^[\*\-] .+/,
    ORDERED_LIST: /^\d+\. .+/,
    BLOCKQUOTE: /^> (.+)/,
    HORIZONTAL_RULE: /^(-\s*){3,}$|^\*\s*(\*\s*){2,}$|^_\s*(_\s*){2,}$/,
    FENCED_CODE_BLOCK: /```(?:\w*\r?\n)?([\s\S]+?)```/,
    CHECKLIST: /^- \[(x| )\] (.+)/,
    STRONG: /\*\*(.+?)\*\*/,
    EMPHASIS: /\*(.+?)\*/,
};

export const replaceInlineElements = (text: string): string => {
    return text
        .replace(REGEX_PATTERNS.BOLD, '<strong>$1</strong>')
        .replace(REGEX_PATTERNS.ITALIC, '<em>$1</em>')
        .replace(REGEX_PATTERNS.LINK, '<a href="$2">$1</a>')
        .replace(REGEX_PATTERNS.INLINE_CODE, '<code>$1</code>')
        .replace(REGEX_PATTERNS.STRIKETHROUGH, '<del>$1</del>');
};

export const isBlockquote = (line: string): boolean => REGEX_PATTERNS.BLOCKQUOTE.test(line);
export const isFencedCodeBlock = (line: string): boolean => line.startsWith('```');
export const isChecklist = (line: string): boolean => REGEX_PATTERNS.CHECKLIST.test(line);
export const isHorizontalRule = (line: string): boolean => REGEX_PATTERNS.HORIZONTAL_RULE.test(line.trim());


function parseHeading(line: string): ParsedElement | null {
    const match = line.match(REGEX_PATTERNS.HEADING);
    if (match) {
        const level = match[1].length;
        const text = match[2];
        return { type: 'heading', content: { text, level } };
    }
    return null;
}

function parseUnorderedList(line: string): ParsedElement | null {
    if (REGEX_PATTERNS.UNORDERED_LIST.test(line)) {
        const content = line.replace(/^[\*\-] /, '');
        return { type: 'ul', content };
    }
    return null;
}

function parseOrderedList(line: string): ParsedElement | null {
    const match = line.match(REGEX_PATTERNS.ORDERED_LIST);
    if (match) {
        const content = match[0].replace(/^\d+\. /, '');
        return { type: 'ol', content };
    }
    return null;
}

function parseLink(line: string): ParsedElement | null {
    const match = line.match(REGEX_PATTERNS.LINK);
    if (match) {
        const text = match[1];
        const href = match[2];
        return { type: 'a', content: { text, href } };
    }
    return null;
}

function parseImage(line: string): ParsedElement | null {
    const match = line.match(REGEX_PATTERNS.IMAGE);
    if (match) {
        const alt = match[1];
        const src = match[2];
        return { type: 'img', content: { alt, src } };
    }
    return null;
}

function parseStrong(line: string): ParsedElement | null {
    const match = line.match(REGEX_PATTERNS.STRONG);
    if (match) {
        const content = match[1];
        return { type: 'strong', content };
    }
    return null;
}

function parseEmphasis(line: string): ParsedElement | null {
    const match = line.match(REGEX_PATTERNS.EMPHASIS);
    if (match) {
        const content = match[1];
        return { type: 'em', content };
    }
    return null;
}

function parseInlineCode(line: string): ParsedElement | null {
    const match = line.match(REGEX_PATTERNS.INLINE_CODE);
    if (match) {
        const content = match[1];
        return { type: 'code', content };
    }
    return null;
}

function parseStrikethrough(line: string): ParsedElement | null {
    const match = line.match(REGEX_PATTERNS.STRIKETHROUGH);
    if (match) {
        const content = match[1];
        return { type: 'strikethrough', content };
    }
    return null;
}

function parseHorizontalRule(line: string): ParsedElement | null {
    if (REGEX_PATTERNS.HORIZONTAL_RULE.test(line.trim())) {
        return { type: 'horizontalRule', content: '' };
    }
    return null;
}

// parse default for paragraph
function parseParagraph(line: string): ParsedElement {
    const content = line;
    return { type: 'paragraph', content };
}

function parseBlockquote(lines: string[], nextLine: string): ParsedElement | null {
    const blockquoteLines = lines.filter(line => REGEX_PATTERNS.BLOCKQUOTE.test(line));
    if (blockquoteLines.length > 0 && isBlockquote(nextLine) === false) {
        const content = blockquoteLines.map(line => line.replace(REGEX_PATTERNS.BLOCKQUOTE, '$1'));
        return { type: 'blockquote', content };
    }
    return null;
}

function parseFencedCodeBlock(codeBlock: string): ParsedElement | null {
    const match = codeBlock.match(REGEX_PATTERNS.FENCED_CODE_BLOCK);
    if (match) {
        const content = match[1].trim();
        return { type: 'pre', content };
    }
    return null;
}

function parseChecklist(lines: string[], nextLine: string): ParsedElement | null {
    const checklistItems = lines.map(line => {
        const match = line.match(REGEX_PATTERNS.CHECKLIST);
        if (match && isChecklist(nextLine) === false) {
            const checked = match[1] === 'x';
            const text = match[2];
            return { text, checked };
        }
        return null;
    }).filter(item => item !== null);

    if (checklistItems.length > 0) {
        return { type: 'checklist', content: checklistItems as ChecklistItemContent[] };
    }
    return null;
}

type MarkdownProcessingResult = {
    parsedElements: ParsedElement[];
};

export const processMarkdown = (markdown: string): MarkdownProcessingResult => {
    const lines = markdown.split('\n');
    const parsedElements: ParsedElement[] = [];
    let blockquoteLines: string[] = [];
    let codeLines: string[] = [];
    let checklistLines: string[] = [];

    lines.forEach((_line, index) => {
        const line = replaceInlineElements(_line).trim()
        const nextLine = replaceInlineElements(lines[index + 1] || '').trim();

        if (isBlockquote(line)) {
            blockquoteLines.push(line);
            const blockquoteElement = parseBlockquote(blockquoteLines, nextLine);
            if (blockquoteElement) {
                parsedElements.push(blockquoteElement);
                blockquoteLines = [];
            }
            return;
        }

        if (isFencedCodeBlock(line) || codeLines.length > 0) {
            codeLines.push(line);
            const codeBlock = codeLines.join('\n');
            const codeBlockElement = parseFencedCodeBlock(codeBlock);
            if (codeBlockElement) {
                parsedElements.push(codeBlockElement);
                codeLines = [];
            }
            return;
        }

        if (isChecklist(line) || checklistLines.length > 0) {
            checklistLines.push(line);
            const checklistElement = parseChecklist(checklistLines, nextLine);
            if (checklistElement) {
                parsedElements.push(checklistElement);
                checklistLines = [];
            }
            return;
        }

        if (isHorizontalRule(_line)) {
            parsedElements.push({ type: 'horizontalRule', content: '' });
            return;
        }

        // Parse other elements
        const parsers = [
            parseHeading,
            parseUnorderedList,
            parseOrderedList,
            parseLink,
            parseImage,
            parseStrong,
            parseEmphasis,
            parseInlineCode,
            parseStrikethrough,
            parseHorizontalRule,
            parseParagraph
        ];

        for (const parser of parsers) {
            const element = parser(line);
            if (element) {
                parsedElements.push(element);
                break;
            }
        }
    });

    return { parsedElements };
};

const appenders: Appender<Content> = {
    heading: (content) => {
        const headingContent = content as HeadingContent;
        return `<h${headingContent.level}>${headingContent.text}</h${headingContent.level}>`;  // Use HeadingContent type
    },
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
    blockquote: (content) => `<blockquote><p>${(content as string[]).join('</p><p>')}</p></blockquote>`,
    checklist: (content) => {
        const items = content as ChecklistItemContent[];
        const itemsHtml = items.map(item => `
        <li data-checked="${item.checked}">
          <label>
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
    horizontalRule: () => '<hr>',
};

export const convertParsedElementsToHTML = (parsedElements: ParsedElement[]): string => {
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

export const markdownToHtml = (markdown: string): string => {
    const { parsedElements } = processMarkdown(markdown);
    return convertParsedElementsToHTML(parsedElements);
};
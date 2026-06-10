"use client";
import { defaultEditorContent } from "@/lib/content";
import { cn } from "@/lib/utils";
// 这些是novel已经封装好的功能直接用就可以了
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";


import { useEffect, useRef, useState } from "react"; 
// React Hooks：useState 用来管理组件状态，useEffect 用来处理组件加载后的副作用逻辑

import { useDebouncedCallback } from "use-debounce"; 
// 防抖 Hook：用于延迟执行函数，比如用户停止输入 500ms 后再触发自动保存

import { defaultExtensions } from "./extensions"; 
// 编辑器扩展配置：决定 Novel/Tiptap 编辑器支持哪些能力，比如标题、列表、图片、Markdown、代码块等

import { ColorSelector } from "./selectors/color-selector"; 
// 颜色选择器组件：用于修改文字颜色或高亮颜色

import { LinkSelector } from "./selectors/link-selector"; 
// 链接选择器组件：用于插入、编辑或取消超链接

import { MathSelector } from "./selectors/math-selector"; 
// 数学公式选择器组件：用于插入或编辑数学公式

import { NodeSelector } from "./selectors/node-selector"; 
// 节点类型选择器组件：用于切换段落、标题、列表、引用等块类型

import { Separator } from "./ui/separator"; 
// 分割线组件：用于在工具栏按钮之间做视觉分隔

import GenerativeMenuSwitch from "./generative/generative-menu-switch";
// AI 浮动菜单组件：选中文本后弹出的 AI 操作入口，比如续写、润色、总结等

import { uploadFn } from "./image-upload";
// 图片上传函数：粘贴或拖拽图片时调用，用来上传图片并返回图片地址

import { TextButtons } from "./selectors/text-buttons";
// 文本样式按钮组件：用于加粗、斜体、下划线、删除线、代码等文字格式操作

import { slashCommand, suggestionItems } from "./slash-command";
// slashCommand：斜杠菜单扩展，用来监听用户输入 "/" 并触发命令菜单
// suggestionItems：斜杠菜单里的命令列表，比如标题、列表、图片、代码块等

const hljs = require("highlight.js");
// 代码语法高亮库

const extensions = [...defaultExtensions, slashCommand];
// 把默认编辑器能力和 Slash 命令能力合并成一个 extensions 数组，然后传给编辑器使用。

const cloneEditorContent = (value: JSONContent) => JSON.parse(JSON.stringify(value)) as JSONContent;

export interface EditorChangePayload {
  json: JSONContent;
  html: string;
  markdown: string;
  text: string;
  words: number;
}

interface TailwindAdvancedEditorProps {
  documentId?: string;
  editorKey?: string;
  content?: JSONContent;
  onChange?: (payload: EditorChangePayload) => void;
  showMeta?: boolean;
  syncUpdates?: boolean;
  appearance?: "default" | "document";
}

const TailwindAdvancedEditor = ({
  documentId = "default",
  editorKey = "base",
  content,
  onChange,
  showMeta = true,
  syncUpdates = false,
  appearance = "default",
}: TailwindAdvancedEditorProps) => {
  // initialContent 是编辑器的初始文档结构。Tiptap 推荐用 JSON 保存正文，
  // 因为它能保留 heading、image、taskList 等节点语义，后续做版本、导出、AI 分析都更方便。
  
const editorInstanceKey = `${documentId}-${editorKey}`;
const initialContentRef = useRef<{ key: string; value: JSONContent }>({
  key: editorInstanceKey,
  value: cloneEditorContent(content ?? defaultEditorContent),
});

// 切换文档时必须在本次渲染里同步换成新内容，避免 EditorContent 先用上一篇文档内容挂载。
if (initialContentRef.current.key !== editorInstanceKey) {
  initialContentRef.current = {
    key: editorInstanceKey,
    value: cloneEditorContent(content ?? defaultEditorContent),
  };
}

const initialContent = initialContentRef.current.value;

// 保存状态：
// 用于显示当前文档是否已保存，比如已保存、未保存、保存中、保存失败。
  const [saveStatus, setSaveStatus] = useState("已保存");

// 字数统计：
// 用于保存当前编辑器内容的单词数/字数，展示在页面右上角。
const [charsCount, setCharsCount] = useState();

// 节点类型菜单开关：
// 控制段落、标题、列表、引用等节点选择器是否展开。
const [openNode, setOpenNode] = useState(false);

// 颜色选择器开关：
// 控制文字颜色或高亮颜色选择器是否展开。
const [openColor, setOpenColor] = useState(false);

// 链接选择器开关：
// 控制插入链接、编辑链接的弹窗是否展开。
const [openLink, setOpenLink] = useState(false);

// AI 菜单开关：
// 控制 AI 浮动菜单是否展开，比如续写、润色、总结等功能。
const [openAI, setOpenAI] = useState(false);


  // editor.getHTML() 只负责把文档转成 HTML，这里额外对代码块做高亮处理，
  // 所以保存到 html-content 的内容可以直接用于预览或发布页渲染。
  // 这个函数就是给富文本/AI 内容里的代码块补语法高亮的。
  // Tiptap 负责编辑结构，highlight.js 负责代码颜色，这个函数负责把两者连接起来。
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  // onUpdate 会在每次输入时触发，频率非常高。这里用 debounce 合并连续输入，
  // 用户停止输入 500ms 后再保存，避免每敲一个字都写 localStorage 或请求后端。
  // 用户编辑内容后，延迟 500ms 自动保存编辑器内容，
  // 并同时导出 JSON、HTML、Markdown 三种格式到 localStorage。
  const emitEditorChange = (editor: EditorInstance) => {
    const json = editor.getJSON();
    const words = editor.storage.characterCount.words();
    const html = highlightCodeblocks(editor.getHTML());
    const markdown = editor.storage.markdown.getMarkdown();
    const text = editor.getText();
    setCharsCount(words);
    // 同一份编辑器内容导出三种格式：
    // JSON 作为主存储，HTML 用于预览/发布，Markdown 用于导出或发给 AI 处理。
    onChange?.({ json, html, markdown, text, words });
    setSaveStatus("已保存");
  };

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    emitEditorChange(editor);
  }, 500);

  useEffect(() => {
    setSaveStatus("已保存");
    setCharsCount(undefined);
  }, [editorInstanceKey]);

  return (
    <div className="relative w-full max-w-screen-lg">
      {showMeta && (
        <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
          <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">{saveStatus}</div>
          <div className={charsCount ? "rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground" : "hidden"}>
            {charsCount} 字
          </div>
        </div>
      )}
      <EditorRoot>
        {/* EditorRoot 提供编辑器上下文，EditorContent 是真正挂载 Tiptap 编辑器的地方。 */}
        <EditorContent
          key={`${documentId}-${editorKey}`}
          initialContent={initialContent}
          // extensions 决定编辑器支持哪些能力，例如标题、列表、图片、AI 高亮、Markdown、斜杠菜单。
          extensions={extensions}
          className={cn(
            "relative w-full max-w-screen-lg bg-background",
            appearance === "document"
              ? "min-h-[520px]"
              : "min-h-[500px] border-muted sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg",
          )}
          editorProps={{
            handleDOMEvents: {
              // 把键盘事件交给命令菜单处理，保证 / 菜单可以用上下键和回车选择。
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            // 粘贴/拖拽图片时统一走 uploadFn，上传成功后再把图片节点插入编辑器。
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: cn(
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
                appearance === "document" &&
                  "docflow-document-editor min-h-[520px] !p-0 prose-p:my-2 prose-headings:mb-2 prose-headings:mt-7",
              ),
            },
          }}
          onUpdate={({ editor }) => {
            // 内容变化后先标记为未保存，再交给防抖函数异步持久化。
            if (syncUpdates) {
              emitEditorChange(editor);
            } else {
              debouncedUpdates(editor);
            }
            setSaveStatus("未保存");
          }}
          slotAfter={<ImageResizer />}
        >
          {/* EditorCommand 是输入 / 后弹出的 Notion 风格命令菜单。 */}
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <EditorCommandEmpty className="px-2 text-muted-foreground">没有找到相关命令</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          {/* 选中文本后出现的浮动工具栏，包含 AI、标题类型、链接、公式、文字样式、颜色等操作。 */}
          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;

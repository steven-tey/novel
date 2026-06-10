import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Twitter,
  Youtube,
} from "lucide-react";
import { Command, createSuggestionItems, renderItems } from "novel";
import { uploadFn } from "./image-upload";

// suggestionItems 是斜杠菜单的数据源。用户输入 / 后，Novel 的 Command 扩展会读取这些配置，
// 渲染出候选项，并在用户选择时执行对应 command。
export const suggestionItems = createSuggestionItems([
  {
    title: "反馈建议",
    description: "告诉我们哪里还可以改进。",
    icon: <MessageSquarePlus size={18} />,
    command: ({ editor, range }) => {
      // range 表示用户输入的 /xxx 这段文本，执行命令前先删除它，再插入或执行目标内容。
      editor.chain().focus().deleteRange(range).run();
      window.open("/feedback", "_blank");
    },
  },
  {
    title: "正文",
    description: "插入普通正文段落。",
    searchTerms: ["p", "paragraph", "text", "正文", "段落"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      // Tiptap 的 chain() 可以把多个编辑器操作串起来，最后 run() 一次性执行。
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
  {
    title: "待办列表",
    description: "用复选框追踪任务事项。",
    searchTerms: ["todo", "task", "list", "check", "checkbox", "待办", "任务"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "一级标题",
    description: "插入最大的章节标题。",
    searchTerms: ["title", "big", "large", "标题", "一级"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "二级标题",
    description: "插入中等层级标题。",
    searchTerms: ["subtitle", "medium", "标题", "二级"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "三级标题",
    description: "插入较小层级标题。",
    searchTerms: ["subtitle", "small", "标题", "三级"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "无序列表",
    description: "插入项目符号列表。",
    searchTerms: ["unordered", "point", "列表", "无序"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "有序列表",
    description: "插入带编号的列表。",
    searchTerms: ["ordered", "列表", "有序", "编号"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "引用",
    description: "插入引用块。",
    searchTerms: ["blockquote", "quote", "引用"],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
  },
  {
    title: "代码块",
    description: "插入代码片段。",
    searchTerms: ["codeblock", "code", "代码"],
    icon: <Code size={18} />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "图片",
    description: "从本地上传图片。",
    searchTerms: ["photo", "picture", "media", "图片", "照片"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // 主动创建 file input，选择图片后复用统一的 uploadFn 上传并插入 image node。
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFn(file, editor.view, pos);
        }
      };
      input.click();
    },
  },
  {
    title: "YouTube 视频",
    description: "嵌入 YouTube 视频。",
    searchTerms: ["video", "youtube", "embed"],
    icon: <Youtube size={18} />,
    command: ({ editor, range }) => {
      const videoLink = prompt("请输入 YouTube 视频链接");
      // 先校验链接格式，再调用 setYoutubeVideo 插入自定义视频节点。
      const ytregex = new RegExp(
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
      );

      if (ytregex.test(videoLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setYoutubeVideo({
            src: videoLink,
          })
          .run();
      } else {
        if (videoLink !== null) {
          alert("请输入正确的 YouTube 视频链接");
        }
      }
    },
  },
  {
    title: "X 推文",
    description: "嵌入 X/Twitter 推文。",
    searchTerms: ["twitter", "x", "embed", "推文"],
    icon: <Twitter size={18} />,
    command: ({ editor, range }) => {
      const tweetLink = prompt("请输入 X/Twitter 链接");
      const tweetRegex = new RegExp(/^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/);

      if (tweetRegex.test(tweetLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setTweet({
            src: tweetLink,
          })
          .run();
      } else {
        if (tweetLink !== null) {
          alert("请输入正确的 X/Twitter 链接");
        }
      }
    },
  },
]);

// slashCommand 把上面的候选项注册进 Tiptap/Novel 的 Command 扩展。
// renderItems 负责把候选项渲染成弹层列表，键盘导航在 advanced-editor.tsx 里处理。
export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});

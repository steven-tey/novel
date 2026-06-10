import { FileText, HelpCircle, Languages, ListChecks, PenLine, RefreshCcwDot, ShieldAlert, Sparkles, Wand2 } from "lucide-react";
import { useEditor } from "novel";
import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";

const rewriteOptions = [
  {
    value: "improve",
    label: "润色选区",
    description: "更顺畅、专业，保留原意",
    icon: Wand2,
  },
  {
    value: "simplify",
    label: "精简表达",
    description: "去掉废话，保留关键信息",
    icon: PenLine,
  },
  {
    value: "expand",
    label: "适度扩写",
    description: "补充背景和行动，不编造事实",
    icon: Sparkles,
  },
  {
    value: "formal",
    label: "改为正式语气",
    description: "更适合企业文档和汇报",
    icon: RefreshCcwDot,
  },
  {
    value: "translate",
    label: "翻译成英文",
    description: "商务英文，直接替换可用",
    icon: Languages,
  },
];

const analysisOptions = [
  {
    value: "summary",
    label: "总结内容",
    description: "核心结论、关键要点、后续建议",
    icon: FileText,
  },
  {
    value: "todos",
    label: "提取待办",
    description: "整理负责人、事项、时间和优先级",
    icon: ListChecks,
  },
  {
    value: "faq",
    label: "生成 FAQ",
    description: "生成问题和回答，适合知识库",
    icon: HelpCircle,
  },
  {
    value: "risks",
    label: "检查风险点",
    description: "发现责任、时间、流程和合规风险",
    icon: ShieldAlert,
  },
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  const getTargetMarkdown = () => {
    const { empty } = editor.state.selection;

    if (empty) {
      return editor.storage.markdown.getMarkdown();
    }

    const slice = editor.state.selection.content();
    return editor.storage.markdown.serializer.serialize(slice.content);
  };

  return (
    <>
      <CommandGroup heading="改写选区" className="px-2 py-2">
        {rewriteOptions.map((option) => (
          <CommandItem
            onSelect={() => {
              onSelect(getTargetMarkdown(), option.value);
            }}
            className="flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
            key={option.value}
            value={option.value}
          >
            <option.icon className="mt-0.5 h-4 w-4 text-purple-500" />
            <span className="min-w-0">
              <span className="block text-sm">{option.label}</span>
              <span className="block truncate text-xs text-muted-foreground">{option.description}</span>
            </span>
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="分析生成" className="px-2 py-2">
        {analysisOptions.map((option) => (
          <CommandItem
            onSelect={() => {
              onSelect(getTargetMarkdown(), option.value);
            }}
            className="flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
            key={option.value}
            value={option.value}
          >
            <option.icon className="mt-0.5 h-4 w-4 text-purple-500" />
            <span className="min-w-0">
              <span className="block text-sm">{option.label}</span>
              <span className="block truncate text-xs text-muted-foreground">{option.description}</span>
            </span>
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="续写" className="px-2 py-2">
        <CommandItem
          onSelect={() => {
            onSelect(getTargetMarkdown(), "continue");
          }}
          value="continue"
          className="gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
        >
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-sm">基于上下文续写</span>
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AISelectorCommands;

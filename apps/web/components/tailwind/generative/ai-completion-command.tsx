import { CommandGroup, CommandItem, CommandSeparator } from "../ui/command";
import { useEditor } from "novel";
import { Check, Clipboard, RotateCcw, TextQuote, TrashIcon } from "lucide-react";
import { toast } from "sonner";

const cleanCompletionForEditor = (value: string) =>
  value
    .replace(/^```[\w-]*\s*/g, "")
    .replace(/```$/g, "")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();

const AICompletionCommands = ({
  completion,
  onDiscard,
  onApply,
  onRegenerate,
  preferredAction = "replace",
  selectionRange,
}: {
  completion: string;
  onDiscard: () => void;
  onApply?: () => void;
  onRegenerate?: () => void;
  preferredAction?: "replace" | "insert";
  selectionRange?: { from: number; to: number };
}) => {
  const { editor } = useEditor();
  const cleanedCompletion = cleanCompletionForEditor(completion);
  const selection = selectionRange ?? editor.view.state.selection;

  const replaceLabel = preferredAction === "replace" ? "替换选区（推荐）" : "替换选区";
  const insertLabel = preferredAction === "insert" ? "插入到下方（推荐）" : "插入到下方";

  return (
    <>
      <CommandGroup>
        <CommandItem
          className="gap-2 px-4"
          value="replace"
          onSelect={() => {
            // Replace selection：用 AI 结果覆盖当前选中的文本，适合“润色/修正”场景。
            editor
              .chain()
              .focus()
              .insertContentAt(
                {
                  from: selection.from,
                  to: selection.to,
                },
                cleanedCompletion,
              )
              .run();
            onApply?.();
          }}
        >
          <Check className="h-4 w-4 text-muted-foreground" />
          {replaceLabel}
        </CommandItem>
        <CommandItem
          className="gap-2 px-4"
          value="insert"
          onSelect={() => {
            // Insert below：把 AI 结果插入到选区后方，适合“续写/生成补充内容”场景。
            editor
              .chain()
              .focus()
              .insertContentAt(selection.to, `\n\n${cleanedCompletion}`)
              .run();
            onApply?.();
          }}
        >
          <TextQuote className="h-4 w-4 text-muted-foreground" />
          {insertLabel}
        </CommandItem>
        {onRegenerate && (
          <CommandItem className="gap-2 px-4" value="regenerate" onSelect={onRegenerate}>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
            重新生成
          </CommandItem>
        )}
        <CommandItem
          className="gap-2 px-4"
          value="copy"
          onSelect={() => {
            navigator.clipboard.writeText(completion);
            toast.success("AI 结果已复制");
          }}
        >
          <Clipboard className="h-4 w-4 text-muted-foreground" />
          复制结果
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem onSelect={onDiscard} value="thrash" className="gap-2 px-4">
          <TrashIcon className="h-4 w-4 text-muted-foreground" />
          丢弃结果
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AICompletionCommands;

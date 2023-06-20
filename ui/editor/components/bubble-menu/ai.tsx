import LoadingCircle from "@/ui/shared/loading-circle";
import LoadingDots from "@/ui/shared/loading-dots";
import Magic from "@/ui/shared/magic";
import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import { useCompletion } from "ai/react";

type Props = {
  editor: Editor;
};

const AIBubbleMenu: React.FC<Props> = ({ editor }: Props) => {
  const { completion } = useCompletion({
    id: "novel-edit",
    api: "/api/generate",
  });

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        placement: "bottom",
        popperOptions: {
          strategy: "fixed",
        },
      }}
      className="mt-2 w-full overflow-hidden rounded border border-stone-200 bg-white shadow-xl animate-in fade-in slide-in-from-bottom-1"
    >
      <div className="p-4">
        {completion.length > 0 ? (
          completion
        ) : (
          <LoadingCircle className="h-4 w-4" />
        )}
      </div>
      <div className="flex w-full items-center bg-stone-100 p-2">
        <div className="flex items-center space-x-1 text-stone-500">
          <Magic className="h-5 w-5" />
          <p className="text-sm font-medium">AI is writing</p>
          <LoadingDots color="#78716C" />
        </div>
      </div>
    </BubbleMenu>
  );
};

export default AIBubbleMenu;

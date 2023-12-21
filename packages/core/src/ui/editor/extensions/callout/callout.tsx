import { NodeViewContent, NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import EmojiPicker from "emoji-picker-react";
import * as Popover from "@radix-ui/react-popover";
import React, { useState } from "react";

const Callout = (props: NodeViewProps) => {
  const [open, setOpen] = useState(false);
  const [emoji, setEmoji] = useState<string>(props.node.attrs.emoji ?? "📣");
  const isEditable = props.editor.isEditable;

  return (
    <NodeViewWrapper className="callout">
      <div className="novel-py-2">
        <div className="novel-bg-stone-100 novel-w-full novel-p-5 novel-flex novel-items-start">
          {isEditable ? (
            <Popover.Root open={open}>
              <Popover.Trigger
                asChild
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <button className="novel-ml-2 novel-pr-3 novel-text-2xl">
                  {emoji}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content sideOffset={5} className="novel-ml-4">
                  <EmojiPicker
                    // NOTE: in the node view, focus on the search input can't be set
                    searchDisabled
                    onEmojiClick={({ emoji }) => {
                      setEmoji(emoji);
                      setOpen(false);
                      props.editor.commands.updateAttributes("callout", {
                        emoji,
                      });
                    }}
                  />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ) : (
            <div className="novel-ml-2 novel-pr-3 novel-text-2xl">{emoji}</div>
          )}
          <div className="novel-w-full novel-border">
            <NodeViewContent />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default Callout;

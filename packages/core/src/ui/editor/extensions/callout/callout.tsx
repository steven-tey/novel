import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import EmojiPicker from "emoji-picker-react";
import * as Popover from "@radix-ui/react-popover";
import React, { useState } from "react";

const Callout = () => {
  const [open, setOpen] = useState(false);
  const [emoji, setEmoji] = useState<string>("📣");

  return (
    <NodeViewWrapper className="callout">
      <div className="novel-py-2">
        <div className="novel-bg-stone-100 novel-w-full novel-p-5 novel-flex novel-items-start">
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
                  }}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <div className="novel-w-full novel-border">
            <NodeViewContent />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default Callout;

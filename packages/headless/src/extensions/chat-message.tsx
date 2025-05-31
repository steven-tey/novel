import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer, type ReactNodeViewRendererOptions, type NodeViewProps } from "@tiptap/react";
import React from "react";

export interface ChatMessageOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    chatMessage: {
      setChatMessage: (options: { sender: string; content: any; timestamp?: string; error?: string }) => ReturnType;
    };
  }
}

const ChatMessageComponent = (props: NodeViewProps) => {
  const { node } = props;
  const { sender, timestamp, error } = node.attrs as any;
  return (
    <NodeViewWrapper as="div" data-chat-message={sender} className={`chat-message chat-message-${sender}` + (error ? " chat-message-error" : "")}
      style={{ border: error ? "1px solid red" : undefined, background: error ? "#fff0f0" : undefined }}>
      <div className="chat-message-meta">
        <span className="chat-message-sender">{sender === "ai" ? "AI" : "You"}</span>
        {timestamp && <span className="chat-message-timestamp">{timestamp}</span>}
      </div>
      <div className="chat-message-content">
        {error ? <span className="chat-message-error-text">{error}</span> : <NodeViewContent className="chat-message-node-content" />}
      </div>
    </NodeViewWrapper>
  );
};

export const ChatMessage = Node.create<ChatMessageOptions>({
  name: "chatMessage",
  group: "block",
  content: "block+",
  draggable: false,
  selectable: true,
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    return {
      sender: {
        default: "user",
      },
      timestamp: {
        default: null,
      },
      error: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-chat-message]",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-chat-message": HTMLAttributes.sender }, HTMLAttributes), 0];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ChatMessageComponent);
  },
  addCommands() {
    return {
      setChatMessage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              sender: options.sender,
              timestamp: options.timestamp || new Date().toISOString(),
              error: options.error || null,
            },
            content: options.content,
          });
        },
    };
  },
}); 
"use client";

import { Button } from "@/components/tailwind/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/tailwind/ui/dialog";
import { KnowledgeAskPanel } from "@/components/workspace/knowledge-ask-panel";
import type { KnowledgeIndexStore } from "@/lib/knowledge-base";
import { cn } from "@/lib/utils";
import { Bot, Maximize2, Minimize2, Send, Sparkles } from "lucide-react";
import { useState } from "react";

interface KnowledgeAssistantProps {
  knowledgeIndex: KnowledgeIndexStore;
  onOpenDocument: (documentId: string) => void;
  onOpenSyncCenter: () => void;
}

export function KnowledgeAssistant({ knowledgeIndex, onOpenDocument, onOpenSyncCenter }: KnowledgeAssistantProps) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [draftQuestion, setDraftQuestion] = useState("");
  const [initialQuestion, setInitialQuestion] = useState("");
  const [autoAskKey, setAutoAskKey] = useState<number | undefined>();

  const openAssistant = (options?: { fullscreen?: boolean; useDraft?: boolean }) => {
    setInitialQuestion(options?.useDraft ? draftQuestion.trim() : "");
    setFullscreen(Boolean(options?.fullscreen));
    setOpen(true);
  };

  const submitDraftQuestion = () => {
    if (!draftQuestion.trim()) {
      openAssistant();
      return;
    }
    setInitialQuestion(draftQuestion.trim());
    setFullscreen(true);
    setOpen(true);
    setAutoAskKey(Date.now());
  };

  const expanded = Boolean(draftQuestion.trim());

  return (
    <>
      <div className="group rounded-md border bg-background p-2 shadow-sm transition-colors hover:border-foreground/20">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            onClick={() => openAssistant()}
          >
            <Bot className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">AI 助手</span>
          </button>
          <div className="flex shrink-0 items-center gap-1">
            <div className="hidden items-center gap-1 text-[11px] text-muted-foreground group-hover:flex group-focus-within:flex">
              <Sparkles className="h-3 w-3" />
              {knowledgeIndex.chunks.length}
            </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openAssistant({ fullscreen: true })}>
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="sr-only">全屏打开 AI 助手</span>
          </Button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            expanded ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0 group-hover:mt-2 group-hover:max-h-40 group-hover:opacity-100 group-focus-within:mt-2 group-focus-within:max-h-40 group-focus-within:opacity-100",
          )}
        >
        <textarea
          value={draftQuestion}
          onChange={(event) => setDraftQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submitDraftQuestion();
            }
          }}
          className="min-h-14 w-full resize-none rounded border bg-[#fbfbfa] px-2 py-1.5 text-xs leading-5 outline-none focus:border-foreground dark:bg-background"
          placeholder="问问知识库..."
        />

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            {knowledgeIndex.chunks.length} 个片段
          </div>
          <Button size="sm" className="h-7 gap-1.5 px-2 text-xs" onClick={submitDraftQuestion}>
            <Send className="h-3 w-3" />
            发送
          </Button>
        </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "gap-0 overflow-hidden p-0",
            fullscreen
              ? "h-screen max-h-screen max-w-none translate-y-[-50%] sm:rounded-none"
              : "max-h-[88vh] max-w-5xl",
          )}
        >
          <div className="border-b px-5 py-4 pr-16">
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle>AI 知识库助手</DialogTitle>
                  <DialogDescription>基于已入库文档片段回答问题，并保留引用来源。</DialogDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setFullscreen((value) => !value)}>
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  <span className="sr-only">{fullscreen ? "退出全屏" : "全屏"}</span>
                </Button>
              </div>
            </DialogHeader>
          </div>

          <div className={cn("overflow-y-auto p-5", fullscreen ? "h-[calc(100vh-89px)]" : "max-h-[calc(88vh-89px)]")}>
            <KnowledgeAskPanel
              knowledgeIndex={knowledgeIndex}
              initialQuestion={initialQuestion}
              autoAskKey={autoAskKey}
              className="border-0 p-0"
              onOpenDocument={(documentId) => {
                setOpen(false);
                onOpenDocument(documentId);
              }}
              onOpenSyncCenter={() => {
                setOpen(false);
                onOpenSyncCenter();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

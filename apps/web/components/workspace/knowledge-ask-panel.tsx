"use client";

import { Button } from "@/components/tailwind/ui/button";
import {
  getRelevantKnowledgeChunks,
  type KnowledgeIndexStore,
  type KnowledgeSearchResult,
} from "@/lib/knowledge-base";
import { cn } from "@/lib/utils";
import { Bot, ChevronDown, FileText, Loader2, MessageSquareText, RadioTower, Send, Sparkles, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type AskCitation = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  headingPath: string[];
  quote: string;
};

type RagDebugChunk = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  headingPath: string[];
  text: string;
  score: number | null;
  provider: "local" | "qdrant" | "pgvector";
};

type AskResponse = {
  answer: string;
  citations: AskCitation[];
  provider?: "local" | "qdrant" | "pgvector";
  retrievedChunks: RagDebugChunk[];
};

interface KnowledgeAskPanelProps {
  knowledgeIndex: KnowledgeIndexStore;
  initialQuestion?: string;
  autoAskKey?: number;
  className?: string;
  onOpenDocument: (documentId: string) => void;
  onOpenSyncCenter: () => void;
}

export function KnowledgeAskPanel({
  knowledgeIndex,
  initialQuestion = "",
  autoAskKey,
  className,
  onOpenDocument,
  onOpenSyncCenter,
}: KnowledgeAskPanelProps) {
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<AskCitation[]>([]);
  const [answerProvider, setAnswerProvider] = useState<AskResponse["provider"]>();
  const [retrievedChunks, setRetrievedChunks] = useState<RagDebugChunk[]>([]);
  const [debugOpen, setDebugOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askedQuestion, setAskedQuestion] = useState("");
  const lastAutoAskKey = useRef<number | null>(null);

  const previewMatches = useMemo(
    () => (question.trim() ? getRelevantKnowledgeChunks(knowledgeIndex.chunks, question, 4) : []),
    [knowledgeIndex.chunks, question],
  );
  const canAsk = Boolean(question.trim() && knowledgeIndex.chunks.length && !asking);

  useEffect(() => {
    setQuestion(initialQuestion);
  }, [initialQuestion]);

  const askKnowledgeBase = async (questionOverride?: string) => {
    const nextQuestion = (questionOverride ?? question).trim();
    if (!nextQuestion || asking) return;

    setQuestion(nextQuestion);
    const matchedChunks = getRelevantKnowledgeChunks(knowledgeIndex.chunks, nextQuestion, 5);
    if (!matchedChunks.length) {
      setError("当前还没有可用于回答的知识片段，请先同步知识库。");
      setAnswer("");
      setCitations([]);
      setRetrievedChunks([]);
      return;
    }

    setAsking(true);
    setError(null);
    setAskedQuestion(nextQuestion);
    setAnswer("");
    setCitations([]);
    setAnswerProvider(undefined);
    setRetrievedChunks([]);
    setDebugOpen(false);

    try {
      const response = await fetch("/api/knowledge/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: nextQuestion,
          allowedDocumentIds: knowledgeIndex.documents.map((document) => document.documentId),
          chunks: matchedChunks.map(toAskContextChunk),
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(typeof payload?.error === "string" ? payload.error : "AI 问答失败，请稍后重试。");
      }

      const normalizedPayload = normalizeAskResponse(payload);
      setAnswer(normalizedPayload.answer);
      setCitations(normalizedPayload.citations);
      setAnswerProvider(normalizedPayload.provider);
      setRetrievedChunks(normalizedPayload.retrievedChunks);
    } catch (err) {
      setAnswer("");
      setCitations([]);
      setAnswerProvider(undefined);
      setRetrievedChunks([]);
      setError(err instanceof Error ? err.message : "AI 问答失败，请稍后重试。");
    } finally {
      setAsking(false);
    }
  };

  useEffect(() => {
    if (autoAskKey === undefined || lastAutoAskKey.current === autoAskKey || !initialQuestion.trim()) return;
    lastAutoAskKey.current = autoAskKey;
    void askKnowledgeBase(initialQuestion);
  }, [autoAskKey]);

  return (
    <section className={cn("rounded-md border bg-background p-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">AI 知识库问答</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">从已入库知识片段中检索上下文，再由 DeepSeek 生成带来源的答案。</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={onOpenSyncCenter}>
          <RadioTower className="h-3.5 w-3.5" />
          管理知识库
        </Button>
      </div>

      <div className="mt-4 rounded-md border bg-[#fbfbfa] p-3 dark:bg-background">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-h-20 w-full resize-none bg-transparent text-sm leading-6 outline-none"
          placeholder="问问知识库，例如：产品需求评审记录里有哪些风险点？"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquareText className="h-3.5 w-3.5" />
            已索引 {knowledgeIndex.documents.length} 篇文档，{knowledgeIndex.chunks.length} 个片段
          </div>
          <Button className="h-8 gap-2" disabled={!canAsk} onClick={() => askKnowledgeBase()}>
            {asking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {asking ? "生成中" : "提问"}
          </Button>
        </div>
      </div>

      {!knowledgeIndex.chunks.length && (
        <div className="mt-3 flex gap-2 rounded-md border border-dashed px-3 py-3 text-xs leading-5 text-muted-foreground">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>当前还没有知识片段，请先在任务中心同步文档后再提问。</span>
        </div>
      )}

      {question.trim() && previewMatches.length > 0 && !answer && (
        <div className="mt-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            将参考这些片段
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {previewMatches.map((match) => (
              <ReferencePreview key={match.id} result={match} onOpenDocument={onOpenDocument} />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex gap-2 rounded-md bg-red-50 px-3 py-2 text-xs leading-5 text-red-700 dark:bg-red-950 dark:text-red-300">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {answer && (
        <div className="mt-4 space-y-4">
          <div className="rounded-md border bg-background p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              回答：{askedQuestion}
              {answerProvider && <span>来源：{getProviderLabel(answerProvider)}</span>}
            </div>
            <div className="whitespace-pre-wrap text-sm leading-7">{answer}</div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium text-muted-foreground">引用来源</div>
            <div className="grid gap-2 md:grid-cols-2">
              {citations.map((citation, index) => (
                <button
                  key={citation.chunkId}
                  type="button"
                  className="rounded-md border px-3 py-2 text-left transition-colors hover:bg-accent"
                  onClick={() => onOpenDocument(citation.documentId)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-medium">
                      [{index + 1}] {citation.documentTitle}
                    </span>
                    <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </div>
                  {citation.headingPath.length > 0 && (
                    <div className="mt-1 truncate text-xs text-muted-foreground">{citation.headingPath.join(" / ")}</div>
                  )}
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{citation.quote}</p>
                </button>
              ))}
            </div>
          </div>

          <RagDebugPanel
            open={debugOpen}
            onOpenChange={setDebugOpen}
            provider={answerProvider}
            chunks={retrievedChunks}
            onOpenDocument={onOpenDocument}
          />
        </div>
      )}
    </section>
  );
}

function ReferencePreview({
  result,
  onOpenDocument,
}: {
  result: KnowledgeSearchResult;
  onOpenDocument: (documentId: string) => void;
}) {
  return (
    <button
      type="button"
      className="rounded-md border px-3 py-2 text-left transition-colors hover:bg-accent"
      onClick={() => onOpenDocument(result.documentId)}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-sm font-medium">{result.documentTitle}</span>
        <span className="shrink-0 text-xs text-muted-foreground">{result.score > 0 ? `score ${result.score}` : "兜底片段"}</span>
      </div>
      {result.headingPath.length > 0 && (
        <div className="mt-1 truncate text-xs text-muted-foreground">{result.headingPath.join(" / ")}</div>
      )}
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{result.snippet}</p>
    </button>
  );
}

function toAskContextChunk(result: KnowledgeSearchResult) {
  return {
    id: result.id,
    documentId: result.documentId,
    documentTitle: result.documentTitle,
    headingPath: result.headingPath,
    text: result.text,
    score: result.score,
    snippet: result.snippet,
  };
}

function normalizeAskResponse(value: unknown): AskResponse {
  if (!value || typeof value !== "object") {
    return {
      answer: "",
      citations: [],
      retrievedChunks: [],
    };
  }

  const record = value as Record<string, unknown>;

  return {
    answer: typeof record.answer === "string" ? record.answer : "",
    provider:
      record.provider === "qdrant" || record.provider === "pgvector" || record.provider === "local"
        ? record.provider
        : undefined,
    retrievedChunks: Array.isArray(record.retrievedChunks)
      ? record.retrievedChunks
          .map((item) => normalizeDebugChunk(item))
          .filter((item): item is RagDebugChunk => Boolean(item))
      : [],
    citations: Array.isArray(record.citations)
      ? record.citations
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const citation = item as Record<string, unknown>;
            const chunkId = typeof citation.chunkId === "string" ? citation.chunkId : "";
            const documentId = typeof citation.documentId === "string" ? citation.documentId : "";
            if (!chunkId || !documentId) return null;

            return {
              chunkId,
              documentId,
              documentTitle: typeof citation.documentTitle === "string" ? citation.documentTitle : "无标题",
              headingPath: Array.isArray(citation.headingPath)
                ? citation.headingPath.filter((heading): heading is string => typeof heading === "string")
                : [],
              quote: typeof citation.quote === "string" ? citation.quote : "",
            };
          })
          .filter((item): item is AskCitation => Boolean(item))
      : [],
  };
}

function getProviderLabel(provider: NonNullable<AskResponse["provider"]>) {
  if (provider === "qdrant") return "LangChain + Qdrant";
  if (provider === "pgvector") return "LangChain + pgvector";
  return "本地片段";
}

function normalizeDebugChunk(value: unknown): RagDebugChunk | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const chunkId = typeof record.chunkId === "string" ? record.chunkId : "";
  const documentId = typeof record.documentId === "string" ? record.documentId : "";
  if (!chunkId || !documentId) return null;

  return {
    chunkId,
    documentId,
    documentTitle: typeof record.documentTitle === "string" ? record.documentTitle : "无标题",
    headingPath: Array.isArray(record.headingPath)
      ? record.headingPath.filter((heading): heading is string => typeof heading === "string")
      : [],
    text: typeof record.text === "string" ? record.text : "",
    score: typeof record.score === "number" && Number.isFinite(record.score) ? record.score : null,
    provider:
      record.provider === "qdrant" || record.provider === "pgvector" || record.provider === "local"
        ? record.provider
        : "local",
  };
}

function RagDebugPanel({
  open,
  onOpenChange,
  provider,
  chunks,
  onOpenDocument,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: AskResponse["provider"];
  chunks: RagDebugChunk[];
  onOpenDocument: (documentId: string) => void;
}) {
  return (
    <div className="rounded-md border bg-background">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-accent"
        onClick={() => onOpenChange(!open)}
      >
        <span className="min-w-0">
          <span className="block text-xs font-medium">检索调试</span>
          <span className="block truncate text-xs text-muted-foreground">
            {getProviderLabel(provider ?? "local")} · 命中 {chunks.length} 个片段
          </span>
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t px-3 py-3">
          {chunks.length ? (
            <div className="space-y-2">
              {chunks.map((chunk, index) => (
                <button
                  key={`${chunk.chunkId}-${index}`}
                  type="button"
                  className="w-full rounded-md border bg-[#fbfbfa] p-3 text-left transition-colors hover:bg-accent dark:bg-background"
                  onClick={() => onOpenDocument(chunk.documentId)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-medium">
                      [{index + 1}] {chunk.documentTitle}
                    </span>
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {formatDebugScore(chunk.score)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{getProviderLabel(chunk.provider)}</span>
                    {chunk.headingPath.length > 0 && <span className="min-w-0 truncate">{chunk.headingPath.join(" / ")}</span>}
                  </div>
                  <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">{chunk.text}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed px-3 py-4 text-xs leading-5 text-muted-foreground">
              本次回答没有返回检索片段。请检查知识库是否已同步、RAG 后端是否启用，或尝试更具体的问题。
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatDebugScore(score: number | null) {
  if (score === null) return "score -";
  return `score ${score.toFixed(score >= 10 ? 1 : 3)}`;
}

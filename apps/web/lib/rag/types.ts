import type { DocumentItem } from "@/lib/documents";

export type RagProvider = "local" | "qdrant" | "pgvector";

export type RagBackendStatus = {
  enabled: boolean;
  provider: RagProvider;
  message: string;
  missing: string[];
};

export type RagChunkMetadata = {
  source: "docflow";
  chunkId: string;
  documentId: string;
  documentTitle: string;
  headingPath: string[];
  chunkIndex: number;
  contentHash: string;
  updatedAt: string;
  tags: string[];
  summary: string;
  parentId: string | null;
};

export type RagRetrievedChunk = {
  id: string;
  documentId: string;
  documentTitle: string;
  headingPath: string[];
  text: string;
  score: number;
  provider: Exclude<RagProvider, "local">;
};

export type RagIndexResult = {
  enabled: boolean;
  provider: RagProvider;
  indexedDocuments: number;
  indexedChunks: number;
  message: string;
};

export type RagIndexableDocument = Pick<
  DocumentItem,
  "id" | "title" | "contentJson" | "contentText" | "tags" | "summary" | "parentId" | "updatedAt"
>;

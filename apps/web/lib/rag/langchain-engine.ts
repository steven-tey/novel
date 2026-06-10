import { buildDocumentKnowledgeIndex } from "@/lib/knowledge-base";
import { getRagBackendStatus, getRagRuntimeConfig, type RagRuntimeConfig } from "@/lib/rag/config";
import { OpenAICompatibleEmbeddings } from "@/lib/rag/openai-compatible-embeddings";
import type { RagChunkMetadata, RagIndexResult, RagIndexableDocument, RagRetrievedChunk } from "@/lib/rag/types";
import { Document as LangChainDocument } from "@langchain/core/documents";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import type { DocumentInterface } from "@langchain/core/documents";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { QdrantVectorStore } from "@langchain/qdrant";
import { createHash } from "node:crypto";

type VectorStoreWithScore = {
  addDocuments: (documents: LangChainDocument<RagChunkMetadata>[], options?: { ids?: string[] }) => Promise<void>;
  delete: (params: { ids?: string[]; filter?: Record<string, unknown> | object }) => Promise<void>;
  similaritySearchWithScore: (query: string, k?: number, filter?: unknown) => Promise<[DocumentInterface, number][]>;
  ensureCollection?: () => Promise<void>;
};

const createEmbeddings = (config: RagRuntimeConfig): EmbeddingsInterface =>
  new OpenAICompatibleEmbeddings({
    apiKey: config.embedding.apiKey,
    baseURL: config.embedding.baseURL,
    model: config.embedding.model,
    dimensions: config.embedding.dimensions,
    batchSize: config.embedding.batchSize,
  });

const createVectorStore = async (config: RagRuntimeConfig): Promise<VectorStoreWithScore> => {
  const embeddings = createEmbeddings(config);

  if (config.provider === "qdrant") {
    return new QdrantVectorStore(embeddings, {
      url: config.qdrant.url,
      apiKey: config.qdrant.apiKey,
      collectionName: config.qdrant.collectionName,
      contentPayloadKey: "text",
      metadataPayloadKey: "metadata",
      collectionConfig: config.embedding.dimensions
        ? {
            vectors: {
              size: config.embedding.dimensions,
              distance: "Cosine",
            },
          }
        : undefined,
    }) as VectorStoreWithScore;
  }

  return PGVectorStore.initialize(embeddings, {
    postgresConnectionOptions: {
      connectionString: config.pgvector.connectionString,
    },
    tableName: config.pgvector.tableName,
    collectionName: config.pgvector.collectionName,
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
    distanceStrategy: "cosine",
    scoreNormalization: "similarity",
    dimensions: config.pgvector.dimensions,
  }) as Promise<VectorStoreWithScore>;
};

const createPointId = (chunkId: string) => {
  const hash = createHash("sha1").update(chunkId).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    `${((Number.parseInt(hash[16], 16) & 0x3) | 0x8).toString(16)}${hash.slice(17, 20)}`,
    hash.slice(20, 32),
  ].join("-");
};

const createIndexedPageContent = (chunk: { text: string; headingPath: string[] }, document: RagIndexableDocument) =>
  [
    `文档：${document.title.trim() || "无标题"}`,
    document.tags?.length ? `标签：${document.tags.join("、")}` : "",
    document.summary?.trim() ? `摘要：${document.summary.trim()}` : "",
    chunk.headingPath.length ? `位置：${chunk.headingPath.join(" / ")}` : "",
    "",
    chunk.text,
  ]
    .filter(Boolean)
    .join("\n");

const createLangChainDocuments = (document: RagIndexableDocument) => {
  const payload = buildDocumentKnowledgeIndex({
    ...document,
    sortOrder: 0,
    parentId: document.parentId,
    createdAt: document.updatedAt,
    deletedAt: null,
    status: "draft",
    knowledgeStatus: "indexed",
  });

  return payload.chunks.map((chunk) => {
    const metadata: RagChunkMetadata = {
      source: "docflow",
      chunkId: chunk.id,
      documentId: document.id,
      documentTitle: document.title.trim() || "无标题",
      headingPath: chunk.headingPath,
      chunkIndex: chunk.chunkIndex,
      contentHash: chunk.contentHash,
      updatedAt: document.updatedAt,
      tags: document.tags ?? [],
      summary: document.summary ?? "",
      parentId: document.parentId,
    };

    return new LangChainDocument<RagChunkMetadata>({
      id: createPointId(chunk.id),
      pageContent: createIndexedPageContent(chunk, document),
      metadata,
    });
  });
};

const normalizeDocumentIds = (documentIds: string[]) => [...new Set(documentIds.map((id) => id.trim()).filter(Boolean))];

const getDocumentMetadata = (document: DocumentInterface): RagChunkMetadata | null => {
  const metadata = document.metadata as Partial<RagChunkMetadata> | undefined;
  if (!metadata || metadata.source !== "docflow" || typeof metadata.documentId !== "string") return null;

  return {
    source: "docflow",
    chunkId: typeof metadata.chunkId === "string" ? metadata.chunkId : document.id ?? metadata.documentId,
    documentId: metadata.documentId,
    documentTitle: typeof metadata.documentTitle === "string" ? metadata.documentTitle : "无标题",
    headingPath: Array.isArray(metadata.headingPath)
      ? metadata.headingPath.filter((heading): heading is string => typeof heading === "string")
      : [],
    chunkIndex: typeof metadata.chunkIndex === "number" ? metadata.chunkIndex : 0,
    contentHash: typeof metadata.contentHash === "string" ? metadata.contentHash : "",
    updatedAt: typeof metadata.updatedAt === "string" ? metadata.updatedAt : new Date().toISOString(),
    tags: Array.isArray(metadata.tags) ? metadata.tags.filter((tag): tag is string => typeof tag === "string") : [],
    summary: typeof metadata.summary === "string" ? metadata.summary : "",
    parentId: typeof metadata.parentId === "string" ? metadata.parentId : null,
  };
};

const createQdrantDocumentFilter = (documentIds: string[]) => ({
  must: [
    {
      key: "metadata.documentId",
      match: documentIds.length === 1 ? { value: documentIds[0] } : { any: documentIds },
    },
  ],
});

const createPgDocumentFilter = (documentIds: string[]) =>
  documentIds.length === 1 ? { documentId: documentIds[0] } : { documentId: { in: documentIds } };

const calculateLexicalBoost = (query: string, document: DocumentInterface, metadata: RagChunkMetadata) => {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return 0;

  const title = metadata.documentTitle.toLowerCase();
  const path = metadata.headingPath.join(" / ").toLowerCase();
  const tags = metadata.tags.join(" ").toLowerCase();
  const text = document.pageContent.toLowerCase();
  let boost = 0;

  if (title === keyword) boost += 20;
  if (title.includes(keyword)) boost += 10;
  if (tags.includes(keyword)) boost += 8;
  if (path.includes(keyword)) boost += 6;
  if (text.includes(keyword)) boost += 3;

  return boost;
};

const normalizeVectorScore = (score: number) => {
  if (!Number.isFinite(score)) return 0;
  if (score >= 0 && score <= 1) return score * 100;
  return score;
};

export const getLangChainRagStatus = () => getRagBackendStatus();

export const upsertDocumentsToLangChainRag = async (documents: RagIndexableDocument[]): Promise<RagIndexResult> => {
  const config = getRagRuntimeConfig();
  const status = getRagBackendStatus(config);

  if (!status.enabled) {
    return {
      enabled: false,
      provider: status.provider,
      indexedDocuments: 0,
      indexedChunks: 0,
      message: status.message,
    };
  }

  const vectorStore = await createVectorStore(config);
  const langChainDocuments = documents.flatMap(createLangChainDocuments);

  if (!langChainDocuments.length) {
    return {
      enabled: true,
      provider: config.provider,
      indexedDocuments: 0,
      indexedChunks: 0,
      message: "没有可写入向量库的知识片段。",
    };
  }

  await deleteDocumentsFromVectorStore(vectorStore, config, documents.map((document) => document.id));
  await vectorStore.addDocuments(langChainDocuments, {
    ids: langChainDocuments.map((document) => document.id ?? createPointId(document.metadata.chunkId)),
  });

  return {
    enabled: true,
    provider: config.provider,
    indexedDocuments: documents.length,
    indexedChunks: langChainDocuments.length,
    message: `已写入 ${config.provider}：${documents.length} 篇文档，${langChainDocuments.length} 个向量片段。`,
  };
};

export const deleteDocumentsFromLangChainRag = async (documentIds: string[]): Promise<RagIndexResult> => {
  const config = getRagRuntimeConfig();
  const status = getRagBackendStatus(config);
  const normalizedDocumentIds = normalizeDocumentIds(documentIds);

  if (!status.enabled || !normalizedDocumentIds.length) {
    return {
      enabled: status.enabled,
      provider: status.provider,
      indexedDocuments: 0,
      indexedChunks: 0,
      message: normalizedDocumentIds.length ? status.message : "没有需要删除的文档。",
    };
  }

  const vectorStore = await createVectorStore(config);
  await deleteDocumentsFromVectorStore(vectorStore, config, normalizedDocumentIds);

  return {
    enabled: true,
    provider: config.provider,
    indexedDocuments: normalizedDocumentIds.length,
    indexedChunks: 0,
    message: `已从 ${config.provider} 删除 ${normalizedDocumentIds.length} 篇文档的向量片段。`,
  };
};

const deleteDocumentsFromVectorStore = async (
  vectorStore: VectorStoreWithScore,
  config: RagRuntimeConfig,
  documentIds: string[],
) => {
  if (!documentIds.length) return;

  await vectorStore.ensureCollection?.();
  await vectorStore.delete({
    filter:
      config.provider === "qdrant"
        ? createQdrantDocumentFilter(documentIds)
        : createPgDocumentFilter(documentIds),
  });
};

export const retrieveFromLangChainRag = async (
  query: string,
  limit?: number,
  documentIds?: string[],
): Promise<RagRetrievedChunk[]> => {
  const config = getRagRuntimeConfig();
  const status = getRagBackendStatus(config);
  if (!status.enabled || !query.trim()) return [];
  const normalizedDocumentIds = documentIds ? normalizeDocumentIds(documentIds) : [];
  if (documentIds && !normalizedDocumentIds.length) return [];

  const vectorStore = await createVectorStore(config);
  const rawResults = await vectorStore.similaritySearchWithScore(
    query,
    limit ?? config.topK,
    normalizedDocumentIds.length
      ? config.provider === "qdrant"
        ? createQdrantDocumentFilter(normalizedDocumentIds)
        : createPgDocumentFilter(normalizedDocumentIds)
      : undefined,
  );

  return rawResults
    .map(([document, score]) => {
      const metadata = getDocumentMetadata(document);
      if (!metadata) return null;

      return {
        id: metadata.chunkId,
        documentId: metadata.documentId,
        documentTitle: metadata.documentTitle,
        headingPath: metadata.headingPath,
        text: document.pageContent,
        score: normalizeVectorScore(score) + calculateLexicalBoost(query, document, metadata),
        provider: config.provider,
      };
    })
    .filter((item): item is RagRetrievedChunk => Boolean(item))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit ?? config.topK);
};

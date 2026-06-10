import type { RagBackendStatus, RagProvider } from "@/lib/rag/types";

export type RagRuntimeConfig = {
  provider: RagProvider;
  topK: number;
  embedding: {
    apiKey: string;
    baseURL: string;
    model: string;
    dimensions?: number;
    batchSize: number;
  };
  qdrant: {
    url: string;
    apiKey?: string;
    collectionName: string;
  };
  pgvector: {
    connectionString: string;
    tableName: string;
    collectionName: string;
    dimensions?: number;
  };
};

const trimSlash = (value: string) => value.replace(/\/+$/, "");

const readInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const readProvider = (): RagProvider => {
  const provider = (process.env.RAG_ENGINE ?? "local").trim().toLowerCase();
  if (provider === "qdrant" || provider === "pgvector") return provider;
  return "local";
};

export const getRagRuntimeConfig = (): RagRuntimeConfig => ({
  provider: readProvider(),
  topK: readInteger(process.env.RAG_TOP_K, 6),
  embedding: {
    apiKey: process.env.RAG_EMBEDDING_API_KEY?.trim() ?? "",
    baseURL: trimSlash(process.env.RAG_EMBEDDING_BASE_URL?.trim() || "https://api.openai.com/v1"),
    model: process.env.RAG_EMBEDDING_MODEL?.trim() || "text-embedding-3-small",
    dimensions: process.env.RAG_EMBEDDING_DIMENSIONS
      ? readInteger(process.env.RAG_EMBEDDING_DIMENSIONS, 0)
      : undefined,
    batchSize: readInteger(process.env.RAG_EMBEDDING_BATCH_SIZE, 16),
  },
  qdrant: {
    url: process.env.QDRANT_URL?.trim() ?? "",
    apiKey: process.env.QDRANT_API_KEY?.trim() || undefined,
    collectionName: process.env.QDRANT_COLLECTION?.trim() || "docflow_knowledge",
  },
  pgvector: {
    connectionString: process.env.PGVECTOR_CONNECTION_STRING?.trim() ?? "",
    tableName: process.env.PGVECTOR_TABLE?.trim() || "docflow_rag_chunks",
    collectionName: process.env.PGVECTOR_COLLECTION?.trim() || "docflow_knowledge",
    dimensions: process.env.RAG_EMBEDDING_DIMENSIONS
      ? readInteger(process.env.RAG_EMBEDDING_DIMENSIONS, 0)
      : undefined,
  },
});

export const getRagBackendStatus = (config = getRagRuntimeConfig()): RagBackendStatus => {
  if (config.provider === "local") {
    return {
      enabled: false,
      provider: "local",
      missing: [],
      message: "当前使用浏览器本地知识库。配置 RAG_ENGINE=qdrant 或 pgvector 后会启用后端向量检索。",
    };
  }

  const missing = new Set<string>();
  if (!config.embedding.apiKey) missing.add("RAG_EMBEDDING_API_KEY");
  if (!config.embedding.model) missing.add("RAG_EMBEDDING_MODEL");

  if (config.provider === "qdrant" && !config.qdrant.url) {
    missing.add("QDRANT_URL");
  }

  if (config.provider === "pgvector" && !config.pgvector.connectionString) {
    missing.add("PGVECTOR_CONNECTION_STRING");
  }

  if (missing.size) {
    return {
      enabled: false,
      provider: config.provider,
      missing: [...missing],
      message: `后端 RAG 未启用，缺少配置：${[...missing].join(", ")}`,
    };
  }

  return {
    enabled: true,
    provider: config.provider,
    missing: [],
    message: config.provider === "qdrant" ? "后端 RAG 已启用：LangChain.js + Qdrant。" : "后端 RAG 已启用：LangChain.js + pgvector。",
  };
};

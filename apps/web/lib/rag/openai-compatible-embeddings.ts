import { Embeddings } from "@langchain/core/embeddings";

type EmbeddingResponse = {
  data?: Array<{
    index?: number;
    embedding?: number[];
  }>;
  error?: {
    message?: string;
  };
};

export type OpenAICompatibleEmbeddingsConfig = {
  apiKey: string;
  baseURL: string;
  model: string;
  dimensions?: number;
  batchSize: number;
};

export class OpenAICompatibleEmbeddings extends Embeddings {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly model: string;
  private readonly dimensions?: number;
  private readonly batchSize: number;

  constructor(config: OpenAICompatibleEmbeddingsConfig) {
    super({ maxConcurrency: 4 });
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
    this.model = config.model;
    this.dimensions = config.dimensions;
    this.batchSize = config.batchSize;
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    const vectors: number[][] = [];

    for (let index = 0; index < documents.length; index += this.batchSize) {
      const batch = documents.slice(index, index + this.batchSize);
      vectors.push(...(await this.embedBatch(batch)));
    }

    return vectors;
  }

  async embedQuery(document: string): Promise<number[]> {
    const [vector] = await this.embedBatch([document]);
    return vector;
  }

  private async embedBatch(input: string[]) {
    const response = await fetch(`${this.baseURL}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        input,
        ...(this.dimensions ? { dimensions: this.dimensions } : {}),
      }),
    });
    const payload = (await response.json().catch(() => null)) as EmbeddingResponse | null;

    if (!response.ok) {
      throw new Error(payload?.error?.message || `Embedding 请求失败：HTTP ${response.status}`);
    }

    const embeddings = payload?.data
      ?.slice()
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((item) => item.embedding)
      .filter((item): item is number[] => Array.isArray(item));

    if (!embeddings?.length || embeddings.length !== input.length) {
      throw new Error("Embedding 服务没有返回完整向量结果。");
    }

    return embeddings;
  }
}

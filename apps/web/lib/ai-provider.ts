import { createOpenAI } from "@ai-sdk/openai";

/**
 * Returns the configured LLM model for AI completions.
 *
 * Provider priority:
 *   1. If MINIMAX_API_KEY is set → MiniMax (MiniMax-M3)
 *   2. If OPENAI_API_KEY is set  → OpenAI  (gpt-4o-mini)
 *
 * MiniMax uses an OpenAI-compatible API, so we reuse @ai-sdk/openai
 * with a custom baseURL and apiKey.
 */
export function getModel() {
  if (process.env.MINIMAX_API_KEY) {
    const minimax = createOpenAI({
      baseURL: "https://api.minimax.io/v1",
      apiKey: process.env.MINIMAX_API_KEY,
    });
    return minimax(process.env.MINIMAX_MODEL ?? "MiniMax-M3");
  }

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini");
}

/**
 * Clamp temperature for MiniMax: must be in (0.0, 1.0].
 * OpenAI accepts 0–2, so no clamping needed for OpenAI.
 */
export function getTemperature(base: number): number {
  if (process.env.MINIMAX_API_KEY) {
    return Math.max(0.01, Math.min(base, 1.0));
  }
  return base;
}

/**
 * Returns true when an LLM API key is configured (either provider).
 */
export function hasApiKey(): boolean {
  return !!(process.env.MINIMAX_API_KEY || process.env.OPENAI_API_KEY);
}

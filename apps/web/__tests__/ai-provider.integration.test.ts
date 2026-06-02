import { describe, it, expect, beforeAll } from "vitest";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

/**
 * Integration tests that call the MiniMax API.
 * Requires MINIMAX_API_KEY to be set in the environment.
 *
 * Run with:
 *   MINIMAX_API_KEY=<key> pnpm vitest run __tests__/ai-provider.integration.test.ts
 */
describe("MiniMax integration", () => {
  const apiKey = process.env.MINIMAX_API_KEY;

  beforeAll(() => {
    if (!apiKey) {
      console.warn("Skipping integration tests: MINIMAX_API_KEY not set");
    }
  });

  it.skipIf(!apiKey)("generates text with MiniMax-M3", async () => {
    const minimax = createOpenAI({
      baseURL: "https://api.minimax.io/v1",
      apiKey: apiKey!,
    });

    const result = await generateText({
      model: minimax("MiniMax-M3"),
      prompt: "Say hello in exactly 5 words.",
      maxTokens: 64,
      temperature: 0.7,
    });

    expect(result.text).toBeTruthy();
    expect(result.text.length).toBeGreaterThan(0);
    console.log("MiniMax-M3 response:", result.text);
  }, 30000);

  it.skipIf(!apiKey)("generates text with MiniMax-M2.7", async () => {
    const minimax = createOpenAI({
      baseURL: "https://api.minimax.io/v1",
      apiKey: apiKey!,
    });

    const result = await generateText({
      model: minimax("MiniMax-M2.7"),
      prompt: "What is 2+2? Reply with just the number.",
      maxTokens: 128,
      temperature: 0.7,
    });

    expect(result.text).toBeTruthy();
    // Strip potential thinking tokens before checking
    const answer = result.text.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();
    expect(answer).toContain("4");
    console.log("MiniMax-M2.7 response:", answer);
  }, 30000);

  it.skipIf(!apiKey)("generates text with MiniMax-M2.7-highspeed", async () => {
    const minimax = createOpenAI({
      baseURL: "https://api.minimax.io/v1",
      apiKey: apiKey!,
    });

    const result = await generateText({
      model: minimax("MiniMax-M2.7-highspeed"),
      prompt: "Say hello in exactly 5 words.",
      maxTokens: 64,
      temperature: 0.7,
    });

    expect(result.text).toBeTruthy();
    expect(result.text.length).toBeGreaterThan(0);
    console.log("MiniMax-M2.7-highspeed response:", result.text);
  }, 30000);

  it.skipIf(!apiKey)("streams text with MiniMax-M3", async () => {
    const { streamText } = await import("ai");
    const minimax = createOpenAI({
      baseURL: "https://api.minimax.io/v1",
      apiKey: apiKey!,
    });

    const result = await streamText({
      model: minimax("MiniMax-M3"),
      prompt: "Count from 1 to 5, one number per line.",
      maxTokens: 64,
      temperature: 0.7,
    });

    let fullText = "";
    for await (const chunk of result.textStream) {
      fullText += chunk;
    }

    expect(fullText).toBeTruthy();
    // Strip thinking tokens if present
    const answer = fullText.replace(/<think>[\s\S]*?<\/think>\s*/g, "").trim();
    expect(answer).toBeTruthy();
    expect(answer).toContain("1");
    console.log("MiniMax streaming response:", answer);
  }, 60000);
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getModel, getTemperature, hasApiKey } from "@/lib/ai-provider";

// Save original env
const originalEnv = { ...process.env };

beforeEach(() => {
  // Clear provider env vars before each test
  delete process.env.OPENAI_API_KEY;
  delete process.env.MINIMAX_API_KEY;
  delete process.env.OPENAI_MODEL;
  delete process.env.MINIMAX_MODEL;
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("hasApiKey", () => {
  it("returns false when no API key is set", () => {
    expect(hasApiKey()).toBe(false);
  });

  it("returns true when OPENAI_API_KEY is set", () => {
    process.env.OPENAI_API_KEY = "sk-test-openai-key";
    expect(hasApiKey()).toBe(true);
  });

  it("returns true when MINIMAX_API_KEY is set", () => {
    process.env.MINIMAX_API_KEY = "sk-test-minimax-key";
    expect(hasApiKey()).toBe(true);
  });

  it("returns true when both keys are set", () => {
    process.env.OPENAI_API_KEY = "sk-test-openai-key";
    process.env.MINIMAX_API_KEY = "sk-test-minimax-key";
    expect(hasApiKey()).toBe(true);
  });
});

describe("getTemperature", () => {
  it("returns the base temperature when using OpenAI", () => {
    process.env.OPENAI_API_KEY = "sk-test";
    expect(getTemperature(0.7)).toBe(0.7);
    expect(getTemperature(0)).toBe(0);
    expect(getTemperature(1.5)).toBe(1.5);
  });

  it("clamps temperature to (0.0, 1.0] for MiniMax", () => {
    process.env.MINIMAX_API_KEY = "sk-test";
    // Normal value in range
    expect(getTemperature(0.7)).toBe(0.7);
    // Zero should be clamped to 0.01
    expect(getTemperature(0)).toBe(0.01);
    // Negative should be clamped to 0.01
    expect(getTemperature(-0.5)).toBe(0.01);
    // Values above 1.0 should be clamped to 1.0
    expect(getTemperature(1.5)).toBe(1.0);
    // Exactly 1.0 is valid
    expect(getTemperature(1.0)).toBe(1.0);
  });
});

describe("getModel", () => {
  it("returns an OpenAI model when OPENAI_API_KEY is set", () => {
    process.env.OPENAI_API_KEY = "sk-test-openai";
    const model = getModel();
    expect(model.modelId).toBe("gpt-4o-mini");
  });

  it("allows overriding OpenAI model via OPENAI_MODEL", () => {
    process.env.OPENAI_API_KEY = "sk-test-openai";
    process.env.OPENAI_MODEL = "gpt-4o";
    const model = getModel();
    expect(model.modelId).toBe("gpt-4o");
  });

  it("returns a MiniMax model when MINIMAX_API_KEY is set", () => {
    process.env.MINIMAX_API_KEY = "sk-test-minimax";
    const model = getModel();
    expect(model.modelId).toBe("MiniMax-M3");
  });

  it("allows overriding MiniMax model via MINIMAX_MODEL", () => {
    process.env.MINIMAX_API_KEY = "sk-test-minimax";
    process.env.MINIMAX_MODEL = "MiniMax-M2.7-highspeed";
    const model = getModel();
    expect(model.modelId).toBe("MiniMax-M2.7-highspeed");
  });

  it("prioritizes MiniMax over OpenAI when both keys are set", () => {
    process.env.OPENAI_API_KEY = "sk-test-openai";
    process.env.MINIMAX_API_KEY = "sk-test-minimax";
    const model = getModel();
    expect(model.modelId).toBe("MiniMax-M3");
  });
});

import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts"],
  banner: {
    js: "'use client'",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: false,
  external: ["react"],
  injectStyle: true,
  ...options,
}));

import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts"],
  banner: {
    js: "'use client'",
  },
  minify: true,
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  splitting: true,
  treeshake: true,
  ...options,
}));

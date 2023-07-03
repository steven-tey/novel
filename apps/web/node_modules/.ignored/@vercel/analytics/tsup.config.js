import { defineConfig } from 'tsup';

const cfg = {
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: false,
  dts: true,
  format: ['esm', 'cjs'],
};

export default defineConfig([
  {
    ...cfg,
    entry: {
      index: 'src/generic.ts',
    },
    outDir: 'dist',
  },
  {
    ...cfg,
    entry: {
      index: 'src/react.tsx',
    },
    external: ['react'],
    outDir: 'dist/react',
    esbuildOptions: (options) => {
      // Append "use client" to the top of the react entry point
      options.banner = {
        js: '"use client";',
      };
    },
  },
]);

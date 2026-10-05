import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
  // SWC (unlike esbuild) emits the decorator metadata NestJS dependency injection relies on.
  plugins: [swc.vite({ module: { type: "es6" } })],
});

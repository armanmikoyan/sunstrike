import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.tsx"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/e2e/**",
        "vitest.*.{ts,tsx}",
        "src/ui/**",
        "src/app/**/layout.tsx",
      ],
      // Floors sit just under today's numbers: enough to catch a regression
      // during the restructure without failing on unrelated churn.
      thresholds: {
        statements: 85,
        branches: 83,
        functions: 80,
        lines: 87,
      },
    },
  },
});

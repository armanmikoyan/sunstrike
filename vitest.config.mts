import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.tsx"],
    include: [
      "tests/unit/**/*.test.{ts,tsx}",
      "tests/components/**/*.test.{ts,tsx}",
    ],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/components/ui/**",
        "src/app/**/layout.tsx",
        "src/app/**/favicon.ico",
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

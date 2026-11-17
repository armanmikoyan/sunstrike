import { defineConfig } from "vitest/config";

// Shared runner configuration. Every folder under `apps/` that has a
// `vitest.config.mts` becomes a project and inherits these options; a project
// only declares what differs (environment, setup files, aliases, includes).
// Coverage stays in `apps/lab` until the engine measures coverage too,
// because Vitest reads coverage options from the root config only.
export default defineConfig({
  test: {
    projects: ["apps/*"],
    // The engine scaffold has projects but no tests yet.
    passWithNoTests: true,
  },
});

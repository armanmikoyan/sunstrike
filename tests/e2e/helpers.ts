import { expect, type Page } from "@playwright/test";

export const appRoutes = [
  { path: "/library", heading: "Library" },
  { path: "/explore", heading: "The feed" },
  { path: "/assets", heading: "Assets" },
  { path: "/favorites", heading: "Favorites" },
  { path: "/pricing" },
  { path: "/billing", heading: "Billing" },
  { path: "/settings", heading: "Settings" },
  { path: "/help", heading: "Help center" },
] as const;

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow, "page must not scroll horizontally").toBeLessThanOrEqual(0);
}

export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

export async function openApp(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();
  // The HTML paints before React attaches listeners, so a click can be lost.
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
  // Streamed segments hydrate after the root provider, and their chunks load
  // after the document. Let the network settle so the first keystroke is not
  // racing a chunk that is still in flight.
  await page
    .waitForLoadState("networkidle", { timeout: 2_000 })
    .catch(() => {});
}

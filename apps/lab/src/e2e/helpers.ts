import { expect, type Page } from "@playwright/test";

export const appRoutes = [
  { path: "/library", heading: "Library" },
  { path: "/explore", heading: "The feed" },
  { path: "/assets", heading: "Assets" },
  { path: "/favorites", heading: "Favorites" },
  { path: "/pricing" },
  { path: "/settings/account", heading: "Settings" },
  { path: "/settings/notifications" },
  { path: "/settings/billing" },
  { path: "/settings/usage" },
  { path: "/help", heading: "Help center" },
  { path: "/privacy", heading: "Privacy policy" },
  { path: "/terms", heading: "Terms of service" },
] as const;

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
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
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === "true");
  // Streamed segments hydrate after the root provider, and their chunks load
  // after the document. Let the network settle so the first keystroke is not
  // racing a chunk that is still in flight.
  await page.waitForLoadState("networkidle", { timeout: 2_000 }).catch(() => {});
  await dismissConsent(page);
}

/**
 * The consent banner is fixed to the bottom of the viewport, so it can sit on
 * top of controls a spec wants to click. Dismissing it here keeps every other
 * spec focused on its own screen.
 */
export async function dismissConsent(page: Page) {
  const banner = page.getByRole("region", { name: "Cookie consent" });
  if (!(await banner.isVisible().catch(() => false))) return;
  await page.getByRole("button", { name: "Essential only" }).click();
  await expect(banner).toBeHidden();
}

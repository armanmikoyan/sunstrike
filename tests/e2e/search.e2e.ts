import { expect, test, type Page } from "@playwright/test";
import { openApp } from "./helpers";

const search = (page: Page) =>
  page.getByRole("searchbox", { name: "Search the studio" });

test.describe("nav search", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows a hotkey hint while empty", async ({ page }) => {
    await openApp(page, "/library");
    const field = search(page);
    await expect(field).toBeVisible();
    await expect(field).toHaveValue("");
    await expect(page.locator("form[role=search] kbd")).toBeVisible();
    await expect(page.locator("form[role=search] kbd")).toHaveText(/K/);
    await expect(page.getByRole("button", { name: "Clear search" })).toHaveCount(
      0,
    );
  });

  test("swaps the hint for a clear button in the same slot", async ({ page }) => {
    await openApp(page, "/library");
    const badge = page.locator("form[role=search] kbd");
    const badgeBox = await badge.boundingBox();

    await search(page).fill("neon alley");

    const clear = page.getByRole("button", { name: "Clear search" });
    await expect(clear).toBeVisible();
    await expect(badge).toHaveCount(0);

    const clearBox = await clear.boundingBox();
    expect(badgeBox).not.toBeNull();
    expect(clearBox).not.toBeNull();
    // Same right edge, within a pixel.
    expect(
      Math.abs(
        badgeBox!.x + badgeBox!.width - (clearBox!.x + clearBox!.width),
      ),
    ).toBeLessThanOrEqual(1);
  });

  test("clears the field and keeps focus", async ({ page }) => {
    await openApp(page, "/library");
    await search(page).fill("neon alley");
    await page.getByRole("button", { name: "Clear search" }).click();

    await expect(search(page)).toHaveValue("");
    await expect(search(page)).toBeFocused();
    await expect(page.locator("form[role=search] kbd")).toBeVisible();
  });

  test("submits to the explore feed", async ({ page }) => {
    await openApp(page, "/library");
    await search(page).fill("neon alley");
    await search(page).press("Enter");

    await expect(page).toHaveURL(/\/explore\?q=neon%20alley$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "The feed" }),
    ).toBeVisible();
  });

  test("focuses from the keyboard shortcut", async ({ page }) => {
    await openApp(page, "/library");
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+k" : "Control+k",
    );
    await expect(search(page)).toBeFocused();
  });

  test("clears with escape", async ({ page }) => {
    await openApp(page, "/library");
    await search(page).fill("neon");
    await search(page).press("Escape");

    await expect(search(page)).toHaveValue("");
    await expect(search(page)).not.toBeFocused();
  });
});

test.describe("nav search on small screens", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("is reachable without a keyboard", async ({ page }) => {
    await openApp(page, "/library");
    const field = search(page);
    await expect(field).toBeVisible();

    const box = await field.boundingBox();
    expect(box!.width).toBeGreaterThan(80);
    // No hotkey hint on a touch layout.
    await expect(page.locator("form[role=search] kbd")).toBeHidden();

    await field.fill("portrait");
    await expect(page.getByRole("button", { name: "Clear search" })).toBeVisible();
  });

  test("submits on the mobile keyboard", async ({ page }) => {
    await openApp(page, "/library");
    await search(page).fill("portrait");
    await search(page).press("Enter");

    await expect(page).toHaveURL(/\/explore\?q=portrait$/);
  });
});

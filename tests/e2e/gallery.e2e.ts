import { expect, test } from "@playwright/test";
import { openApp } from "./helpers";

test.describe("library", () => {
  test("filters by tab and search", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openApp(page, "/library");

    const cards = page.getByRole("article");
    const total = await cards.count();
    expect(total).toBeGreaterThan(4);

    await page.getByRole("tab", { name: "Video" }).click();
    await expect(cards).not.toHaveCount(total);
    await expect(cards.first()).toContainText("Video");

    await page.getByPlaceholder("Search your library").fill("zzzz-no-match");
    await expect(page.getByText("Nothing here yet")).toBeVisible();
  });

  test("opens a work item's remix route", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openApp(page, "/library");

    const remix = page.getByRole("link", { name: /Remix/ }).first();
    await expect(remix).toHaveAttribute("href", "/create/video");
  });
});

test.describe("explore", () => {
  test("filters the feed", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openApp(page, "/explore");

    const counter = page.getByText(/\d+ frames/).first();
    const before = await counter.textContent();

    // The counter only moves once the feed is hydrated; retry the typing so a
    // keystroke that lands during hydration is not lost.
    const search = page.locator("main").getByPlaceholder("Search");
    await expect(async () => {
      await search.fill("Mara Lune");
      await expect(counter).not.toHaveText(before ?? "");
    }).toPass({ timeout: 10000 });

    await page.locator("main").getByPlaceholder("Search").fill("nothing-matches-this");
    await expect(page.getByText("No frames found")).toBeVisible();
  });

  test("sorts by most liked", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openApp(page, "/explore");

    const first = page.getByRole("article").first();
    const before = await first.textContent();

    await page.getByRole("button", { name: /Trending/ }).click();
    await page.getByRole("menuitem", { name: "Most liked" }).click();

    await expect(page.getByRole("article").first()).not.toHaveText(
      before ?? "",
    );
  });
});

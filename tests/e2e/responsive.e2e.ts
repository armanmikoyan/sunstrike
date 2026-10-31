import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, openApp } from "./helpers";

const widths = [320, 390, 768, 1024, 1280, 1440];

for (const width of widths) {
  test(`layout holds at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openApp(page, "/library");

    await expectNoHorizontalOverflow(page);
    await expect(
      page.getByRole("searchbox", { name: "Search the studio" }),
    ).toBeVisible();

    const hamburger = page.getByRole("button", { name: "Open navigation" });
    const toolNav = page.locator('nav[aria-label="Studio tools"]');

    if (width < 1024) {
      await expect(hamburger).toBeVisible();
      await expect(toolNav).toBeHidden();
    } else {
      await expect(hamburger).toBeHidden();
      await expect(toolNav).toBeVisible();
    }
  });
}

test("every page fits the viewport on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });

  for (const path of [
    "/",
    "/library",
    "/explore",
    "/pricing",
    "/billing",
  ]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expectNoHorizontalOverflow(page);
  }
});

test("every page fits the viewport on a tablet", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });

  for (const path of [
    "/",
    "/library",
    "/explore",
    "/pricing",
    "/billing",
  ]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expectNoHorizontalOverflow(page);
  }
});

test("the drawer leaves the page visible behind it", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await openApp(page, "/library");

  await page.getByRole("button", { name: "Open navigation" }).click();
  const box = await page.getByRole("dialog").boundingBox();

  expect(box!.width / 360).toBeGreaterThan(0.7);
  expect(box!.width / 360).toBeLessThan(0.95);
});

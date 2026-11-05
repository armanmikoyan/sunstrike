import { expect, test } from "@playwright/test";
import { openApp } from "./helpers";

test.describe("pricing", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openApp(page, "/pricing");
  });

  test("leads with video and bills in dollars", async ({ page }) => {
    await expect(page.getByRole("tab", { name: "Video" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("tabpanel")).toContainText("$2.04");
    await expect(page.getByRole("tabpanel")).toContainText("$0.51");
  });

  test("switches to the image calculator", async ({ page }) => {
    await page.getByRole("tab", { name: "Images" }).click();

    await expect(page.getByRole("tabpanel")).toContainText("$0.60");
    await expect(
      page.getByRole("slider", { name: "Number of images" }),
    ).toBeVisible();
  });

  test("applies the 500 image volume tier", async ({ page }) => {
    await page.getByRole("tab", { name: "Images" }).click();
    await page.getByRole("button", { name: /50–500/ }).click();

    await expect(page.getByRole("tabpanel")).toContainText("$2.50");
    await expect(page.getByRole("tabpanel")).toContainText("$0.05");
  });

  test("re-prices video by model and clip count", async ({ page }) => {
    // The estimator only re-prices once React has hydrated, so a click that
    // lands during hydration is silently dropped. Retry the interaction
    // instead of trusting that the page is interactive.
    await expect(async () => {
      await page.getByRole("button", { name: /Motion Turbo/ }).click();
      await expect(page.getByRole("tabpanel")).toContainText("$1.36", {
        timeout: 2000,
      });
    }).toPass({ timeout: 15000 });

    await page.getByRole("button", { name: "Increase clips" }).click();
    await expect(page.getByRole("tabpanel")).toContainText("$1.70");
  });

  test("top-up packs are priced in dollars", async ({ page }) => {
    await expect(page.getByText("$10", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("$25", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("$50", { exact: true }).first()).toBeVisible();
  });
});

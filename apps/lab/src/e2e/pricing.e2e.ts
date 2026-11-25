import { expect } from "@playwright/test";
import { openApp, test } from "./helpers";

test.describe("pricing", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await openApp(page, "/pricing");
  });

  test("lists every video model at a per-second rate", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /Every second at the model's price/i,
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chronolab Motion 2" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chronolab Loop" })).toBeVisible();
    await expect(page.getByText("$0.085", { exact: true })).toHaveCount(2);
    await expect(page.getByText("$0.10", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("$0.072", { exact: true })).toBeVisible();
    await expect(page.getByText("$0.51 per 6-second clip")).toHaveCount(2);
  });

  test("filters the rate list to image models", async ({ page }) => {
    await page.getByRole("button", { name: "Image models" }).click();

    await expect(page.getByRole("button", { name: "Image models" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: "Chronolab Image 2" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chronolab Motion 2" })).toHaveCount(0);
    await expect(page.getByText("$0.07", { exact: true })).toBeVisible();
  });

  test("scrolls to the rates without running the route loader", async ({ page }) => {
    await page.getByRole("link", { name: "See model rates" }).click();

    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBeGreaterThan(100);

    const bar = page.locator('[aria-hidden="true"]').first();
    await expect(bar).not.toHaveClass(/opacity-100/);
  });

  test("opens a question without moving the footer", async ({ page }) => {
    const footerTop = () =>
      page.evaluate(() => Math.round(document.querySelector("footer")!.getBoundingClientRect().top + window.scrollY));

    const before = await footerTop();
    await page.getByRole("button", { name: "How does billing work?" }).click();
    await page.waitForTimeout(500);

    expect(await footerTop()).toBe(before);
  });

  test("top-up presets drive the custom amount", async ({ page }) => {
    const presets = page.getByRole("button", { name: /^Select \$/ });
    await expect(presets).toHaveCount(6);

    const slider = page.getByRole("slider", { name: "Custom top-up amount" });
    await expect(slider).toHaveAttribute("aria-valuenow", "50");

    await page.getByRole("button", { name: "Select $5000", exact: true }).click();
    await expect(slider).toHaveAttribute("aria-valuenow", "5000");
    await expect(page.getByRole("button", { name: "Select $5000", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

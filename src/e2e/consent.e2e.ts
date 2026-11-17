import { expect, test, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

async function openFresh(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
  );
}

test.describe("cookie consent", () => {
  test("asks on the first visit and remembers Accept all", async ({ page }) => {
    await openFresh(page);

    const banner = page.getByRole("region", { name: "Cookie consent" });
    await expect(banner).toBeVisible();
    await page.getByRole("button", { name: "Accept all" }).click();
    await expect(banner).toBeHidden();

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => document.documentElement.dataset.hydrated === "true",
    );
    await expect(banner).toBeHidden();
    expect(
      await page.evaluate(() =>
        window.localStorage.getItem("chronolab:cookie-consent"),
      ),
    ).toBe("all");
  });

  test("Essential only dismisses without analytics", async ({ page }) => {
    await openFresh(page, "/pricing");

    await page.getByRole("button", { name: "Essential only" }).click();
    await expect(
      page.getByRole("region", { name: "Cookie consent" }),
    ).toBeHidden();
    expect(
      await page.evaluate(() =>
        window.localStorage.getItem("chronolab:cookie-consent"),
      ),
    ).toBe("essential");
  });

  test("links to the cookie section of the privacy policy", async ({ page }) => {
    await openFresh(page);

    await page.getByRole("link", { name: "Privacy policy" }).click();
    await expect(page).toHaveURL(/\/privacy#cookies$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Privacy policy" }),
    ).toBeVisible();
    await expect(page.locator("#cookies")).toBeVisible();
  });

  test("does not overflow a phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await openFresh(page);

    await expect(
      page.getByRole("region", { name: "Cookie consent" }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});

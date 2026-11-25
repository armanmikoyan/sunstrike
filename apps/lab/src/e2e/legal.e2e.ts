import { expect, test } from "@playwright/test";
import { openApp } from "./helpers";

test.describe("legal contents rail", () => {
  test("marks the section being read and follows a jump", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/privacy");

    const nav = page.getByRole("navigation", { name: "On this page" });
    const link = (name: string) => nav.getByRole("link", { name });

    await expect(link("Overview")).toHaveAttribute("aria-current", "location");

    // Walking the last stretch of the page must surface each final section in
    // order, not skip straight from Security to Contact.
    const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    const seen = new Set<string>();

    for (let offset = 560; offset >= 0; offset -= 10) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), maxScroll - offset);
      await page.waitForTimeout(70);
      const current = await nav.locator('[aria-current="location"]').textContent();
      if (current) seen.add(current);
    }

    expect([...seen]).toEqual(expect.arrayContaining(["Your rights", "Security", "Children", "Changes", "Contact"]));

    // The last sections are too short to scroll up to the nav line, so a
    // click must still select them and hold until the next scroll.
    await link("Cookies").click();
    await expect(link("Cookies")).toHaveAttribute("aria-current", "location");

    await link("Children").click();
    await expect(link("Children")).toHaveAttribute("aria-current", "location");
    await expect(link("Contact")).not.toHaveAttribute("aria-current");

    await link("Changes").click();
    await expect(link("Changes")).toHaveAttribute("aria-current", "location");

    await link("Contact").click();
    await expect(link("Contact")).toHaveAttribute("aria-current", "location");

    // The first item is still selectable from the bottom of the page.
    await link("Overview").click();
    await expect(page).toHaveURL(/\/privacy#overview$/);
    await expect(link("Overview")).toHaveAttribute("aria-current", "location");
  });

  test("selects the tail sections on the terms page", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/terms");

    const nav = page.getByRole("navigation", { name: "On this page" });
    const link = (name: string) => nav.getByRole("link", { name });

    await expect(link("The agreement")).toHaveAttribute("aria-current", "location");

    await link("Changes to these terms").click();
    await expect(link("Changes to these terms")).toHaveAttribute("aria-current", "location");
    await expect(link("Contact")).not.toHaveAttribute("aria-current");
  });

  test("keeps the rail off a phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openApp(page, "/terms");

    await expect(page.getByRole("navigation", { name: "On this page" })).toBeHidden();
  });
});

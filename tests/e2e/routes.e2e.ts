import { expect, test } from "@playwright/test";
import {
  appRoutes,
  collectErrors,
  expectNoHorizontalOverflow,
  openApp,
} from "./helpers";

test.describe("routes", () => {
  for (const route of appRoutes) {
    test(`${route.path} renders without errors`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("main")).toBeVisible();

      if ("heading" in route) {
        await expect(
          page.getByRole("heading", { level: 1, name: route.heading }),
        ).toBeVisible();
      }

      await expectNoHorizontalOverflow(page);
      expect(errors).toEqual([]);
    });
  }

  test("home opens with the prompt composer over the wall", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("button", { name: "Start generation" }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Describe your generation" }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });

  test("video studio loads", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/create/video", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Video Studio")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Generate video" }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("image studio loads", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/create/image", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Image Studio")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Generate image" }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("login page loads outside the app shell", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "A studio for",
    );
    await expect(page.getByRole("button", { name: /Open navigation/ })).toHaveCount(
      0,
    );
    expect(errors).toEqual([]);
  });

  test("unknown create mode is a 404", async ({ page }) => {
    const response = await page.goto("/create/audio", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(404);
  });

  test("pricing does not sell credits", async ({ page }) => {
    await openApp(page, "/pricing");
    await expect(page.locator("body")).not.toContainText(/credit/i);
    await expect(page.getByText("$0.51").first()).toBeVisible();
  });

  test("billing shows transactions in dollars", async ({ page }) => {
    await openApp(page, "/billing");
    await expect(page.getByText(/\+\$25\.00/)).toBeVisible();
    await expect(page.getByText(/−\$0\.51/)).toBeVisible();
  });
});

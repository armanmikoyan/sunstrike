import { expect, test } from "@playwright/test";
import { collectErrors, openApp } from "./helpers";

test.describe("app shell", () => {
  test("expands and collapses the desktop rail", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/library");

    const expand = page.getByRole("button", { name: "Expand sidebar" });
    await expect(expand).toBeVisible();
    await expand.click();

    const collapse = page.getByRole("button", { name: "Collapse sidebar" });
    await expect(collapse).toBeVisible();
    await expect(page.getByRole("link", { name: "Favorites" })).toBeVisible();
    // Wordmark appears next to the collapse control, the bar keeps the mark.
    await expect(
      page.getByRole("link", { name: "Chronolab.ai home" }),
    ).toHaveCount(2);

    await collapse.click();
    await expect(expand).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Chronolab.ai home" }),
    ).toHaveCount(1);
  });

  test("animates the rail open instead of snapping", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/library");

    const rail = page.locator("aside").first();
    expect((await rail.boundingBox())!.width).toBeCloseTo(61, 0);

    // Record the width on every frame until the rail settles. Sampling starts
    // before the click and keeps going for a couple of seconds so a slow first
    // commit cannot make the transition look instant to the test.
    await page.evaluate(() => {
      const samples: number[] = [];
      (window as unknown as { __rail: number[] }).__rail = samples;
      // Keep sampling until the rail has actually settled. A fixed window
      // can expire before a click that a busy, parallel run delayed.
      const started = performance.now();
      const tick = () => {
        const aside = document.querySelector("aside");
        if (aside) samples.push(aside.getBoundingClientRect().width);
        const last = samples.slice(-3);
        const settled =
          last.length === 3 && last.every((width) => width > 199.95);
        if (!settled && performance.now() - started < 20_000) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    });

    await page.getByRole("button", { name: "Expand sidebar" }).click();
    await expect(
      page.getByRole("button", { name: "Collapse sidebar" }),
    ).toBeVisible();
    await page.waitForFunction(() => {
      const samples = (window as unknown as { __rail: number[] }).__rail;
      return samples.length > 3 && Math.abs(samples.at(-1)! - 200) < 0.05;
    });

    const samples = await page.evaluate(
      () => (window as unknown as { __rail: number[] }).__rail,
    );
    const between = samples.filter((value) => value > 63 && value < 198);

    expect(Math.min(...samples)).toBeLessThanOrEqual(63);
    expect(Math.max(...samples)).toBeGreaterThanOrEqual(198);
    // At least a few frames land in the middle of the travel.
    expect(between.length).toBeGreaterThanOrEqual(2);
    expect((await rail.boundingBox())!.width).toBeCloseTo(200, 0);
  });

  test("grows the rail out of one axis instead of shifting its controls", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/library");

    // The collapsed rail is the 40px control plus the same 10px inset the open
    // rail uses, so a nav pill sits at x=10 in both states and must not move
    // sideways at all. An earlier, 80px-wide rail centred the pill at x=19.5
    // and flipped `self-center` off with the state, so it jumped 9.5px before
    // the rail moved. The header toggle is the one control with a real trip —
    // rail centre to rail edge — and it must make it with the rail instead of
    // teleporting because the flex row re-aligned it.
    const sample = (run: () => Promise<void>, target: number) =>
      page
        .evaluate((target) => {
          const frames: { rail: number; x: number; toggle: number }[] = [];
          (window as unknown as { __axis: typeof frames }).__axis = frames;
          const started = performance.now();
          (window as unknown as { __axisDone: Promise<void> }).__axisDone =
            new Promise<void>((resolve) => {
              const tick = () => {
                const aside = document.querySelector("aside");
                const item = aside?.querySelector('a[aria-label="Explore"]');
                const toggle = aside?.querySelector("button[aria-expanded]");
                if (aside && item && toggle) {
                  frames.push({
                    rail: aside.getBoundingClientRect().width,
                    x: item.getBoundingClientRect().x,
                    toggle: toggle.getBoundingClientRect().x,
                  });
                }
                // Settle on the target width instead of running for a fixed
                // window, which can expire before a delayed click lands.
                const last = frames.slice(-3);
                const settled =
                  last.length === 3 &&
                  last.every((frame) => Math.abs(frame.rail - target) < 0.05);
                if (settled || performance.now() - started > 20_000) {
                  resolve();
                  return;
                }
                requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            });
        }, target)
        .then(run)
        .then(() =>
          page.evaluate(
            () =>
              (window as unknown as { __axisDone: Promise<void> }).__axisDone,
          ),
        )
        .then(() =>
          page.evaluate(
            () =>
              (
                window as unknown as {
                  __axis: { rail: number; x: number; toggle: number }[];
                }
              ).__axis,
          ),
        );

    // A frame may be skipped on a busy machine, so allow the toggle to cover
    // ground in one step — but only in proportion to the rail moving with it.
    const expectNoTeleport = (frames: { rail: number; toggle: number }[]) => {
      for (let index = 1; index < frames.length; index++) {
        const moved = Math.abs(frames[index].toggle - frames[index - 1].toggle);
        const railMoved = Math.abs(frames[index].rail - frames[index - 1].rail);
        expect(moved).toBeLessThanOrEqual(railMoved * 2 + 12);
      }
    };

    const expanding = await sample(
      () => page.getByRole("button", { name: "Expand sidebar" }).click(),
      200,
    );
    expect(expanding.length).toBeGreaterThan(4);
    for (const frame of expanding) {
      // Pinned to the rail's inset: the pill never leads or lags the rail.
      expect(Math.abs(frame.x - 10)).toBeLessThan(0.6);
    }
    expect(Math.abs(expanding.at(-1)!.toggle - 157)).toBeLessThan(1);
    expectNoTeleport(expanding);

    const collapsing = await sample(
      () => page.getByRole("button", { name: "Collapse sidebar" }).click(),
      61,
    );
    for (const frame of collapsing) {
      expect(Math.abs(frame.x - 10)).toBeLessThan(0.6);
      // While the rail is still fully open, nothing may have moved yet.
      if (frame.rail > 199) expect(frame.toggle).toBeCloseTo(157, 0);
    }
    expect(Math.abs(collapsing.at(-1)!.toggle - 10)).toBeLessThan(1);
    expectNoTeleport(collapsing);
  });

  test("keeps every collapsed control inside the rail", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/library");

    const rail = await page.locator("aside").first().boundingBox();
    const item = page.getByRole("link", { name: "Explore" });
    await item.hover();

    const controls = {
      toggle: page.getByRole("button", { name: "Expand sidebar" }),
      generation: page.locator('aside a[aria-label="New generation"]'),
      item,
      account: page.locator("aside button[aria-label='Account menu']"),
    };

    const centres: number[] = [];
    for (const control of Object.values(controls)) {
      const box = (await control.boundingBox())!;
      // The hover surface and every other control keep a 10px gutter to the
      // rail's border instead of sitting flush against it.
      expect(box.x).toBeGreaterThan(rail!.x + 9);
      expect(box.x + box.width).toBeLessThan(rail!.x + rail!.width - 9);
      centres.push(box.x + box.width / 2);
    }

    // One vertical axis for the collapsed rail.
    for (const centre of centres) {
      expect(centre).toBeCloseTo(centres[0], 0);
    }

    // The bubble hugs the rail instead of floating out in the page.
    const tip = (await page.getByRole("tooltip").boundingBox())!;
    expect(tip.x).toBeLessThan(rail!.x + rail!.width + 12);
  });

  test("keeps the rail's contents still between the two states", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/library");

    const controls = [
      page.locator('aside a[aria-label="New generation"]'),
      page.getByRole("link", { name: "Create" }),
      page.getByRole("link", { name: "Favorites" }),
      page.locator("aside button[aria-label='Account menu']"),
    ];
    const collapsed = await Promise.all(
      controls.map(async (control) => (await control.boundingBox())!),
    );

    await page.getByRole("button", { name: "Expand sidebar" }).click();
    await expect(
      page.getByRole("button", { name: "Collapse sidebar" }),
    ).toBeVisible();
    // Let the width transition settle before reading the layout.
    await page.waitForFunction(() => {
      const rail = document.querySelector("aside")!;
      return Math.abs(rail.getBoundingClientRect().width - 200) < 0.05;
    });

    const expanded = await Promise.all(
      controls.map(async (control) => (await control.boundingBox())!),
    );

    // Only the width may animate: nothing may drift down the rail.
    collapsed.forEach((box, index) => {
      expect(expanded[index].y).toBeCloseTo(box.y, 0);
      expect(expanded[index].height).toBeCloseTo(box.height, 0);
    });
  });

  test("does not resurrect a tooltip when the rail collapses under the pointer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/library");

    await page.getByRole("button", { name: "Expand sidebar" }).click();
    await expect(
      page.getByRole("button", { name: "Collapse sidebar" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Explore" }).hover();
    await page.waitForTimeout(250);

    // Collapse without moving the pointer off the item.
    await page
      .getByRole("button", { name: "Collapse sidebar" })
      .evaluate((button) => (button as HTMLElement).click());
    await expect(
      page.getByRole("button", { name: "Expand sidebar" }),
    ).toBeVisible();
    await page.waitForTimeout(400);
    await expect(page.getByRole("tooltip")).toHaveCount(0);

    // A fresh hover still explains the icon.
    await page.mouse.move(520, 420);
    await page.getByRole("link", { name: "Explore" }).hover();
    await expect(page.getByRole("tooltip")).toContainText("Explore");
  });

  test("keeps billing and settings inside the profile menu", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/library");
    await page.getByRole("button", { name: "Expand sidebar" }).click();

    await page.getByRole("button", { name: "Account menu" }).click();

    const menu = page.getByRole("menu");
    await expect(menu.getByRole("menuitem", { name: /Balance/ })).toHaveAttribute(
      "href",
      "/pricing",
    );
    await expect(menu.getByRole("menuitem", { name: "Billing" })).toHaveAttribute(
      "href",
      "/billing",
    );
    await expect(
      menu.getByRole("menuitem", { name: "Account settings" }),
    ).toHaveAttribute("href", "/settings");
    await expect(menu.getByRole("menuitem", { name: "Sign out" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  test("the rail does not repeat billing or settings", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/library");

    // Pricing and Help sit below the primary nav but still in the rail.
    const hrefs = await page
      .locator("aside a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));

    expect(hrefs).not.toContain("/billing");
    expect(hrefs).not.toContain("/settings");
    expect(hrefs).toContain("/pricing");
    expect(hrefs).toContain("/help");
  });

  test("navigates from the rail", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openApp(page, "/library");

    await page.getByRole("link", { name: "Explore" }).click();
    await expect(page).toHaveURL(/\/explore$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "The feed" }),
    ).toBeVisible();
  });

  test("drawer opens over the page, not full screen", async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 900 });
    await openApp(page, "/library");

    await page.getByRole("button", { name: "Open navigation" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(412 * 0.7);
    expect(box!.width).toBeLessThanOrEqual(440);
    expect(box!.width).toBeLessThan(412);

    // The drawer is wider than the 200px rail, so its controls must stretch
    // with it rather than inherit the rail's 180px content cap.
    const item = await dialog
      .getByRole("link", { name: "Explore" })
      .boundingBox();
    expect(item!.width).toBeGreaterThan(box!.width - 40);
  });

  test("drawer closes with escape and keeps the page behind it", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 412, height: 900 });
    await openApp(page, "/library");

    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(
      page.getByRole("heading", { level: 1, name: "Library" }),
    ).toBeVisible();
  });

  test("drawer navigation closes the drawer", async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 900 });
    await openApp(page, "/library");

    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Explore" }).click();

    await expect(page).toHaveURL(/\/explore$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("drawer exposes the account panel", async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 900 });
    await openApp(page, "/library");

    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("button", { name: "Account menu" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("link", { name: /Balance/ })).toHaveAttribute(
      "href",
      "/pricing",
    );
    await expect(
      dialog.getByRole("link", { name: "Account settings" }),
    ).toBeVisible();
  });

  test("no console errors while moving through the shell", async ({ page }) => {
    const errors = collectErrors(page);
    await openApp(page, "/library");
    await page.getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    expect(errors).toEqual([]);
  });
});

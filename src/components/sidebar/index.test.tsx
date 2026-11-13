import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MobileSidebar, Sidebar } from ".";
import { TooltipProvider } from "@/ui/tooltip";
import { setPathname } from "~/vitest.setup";

function renderSidebar(props: { expanded: boolean; onToggle?: () => void }) {
  return render(
    <TooltipProvider>
      <Sidebar expanded={props.expanded} onToggle={props.onToggle ?? vi.fn()} />
    </TooltipProvider>,
  );
}

function renderDrawer(open = true) {
  const onOpenChange = vi.fn();
  const ui = (isOpen: boolean) => (
    <TooltipProvider>
      <MobileSidebar open={isOpen} onOpenChange={onOpenChange} />
    </TooltipProvider>
  );

  // Mount closed, then open: that is how the shell uses it, and it mirrors a
  // real user tap rather than a drawer that starts open on first paint.
  const utils = render(ui(false));
  if (open) utils.rerender(ui(true));

  return { ...utils, onOpenChange, rerender: (next: boolean) => utils.rerender(ui(next)) };
}

const railNavLinks = () =>
  within(screen.getByRole("navigation", { name: "Studio" })).getAllByRole("link");

describe("sidebar rail", () => {
  it("lists the primary destinations", () => {
    renderSidebar({ expanded: false });
    const hrefs = railNavLinks().map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "/create/video",
      "/explore",
      "/library",
      "/assets",
      "/favorites",
    ]);
  });

  it("fades the labels out when collapsed and back in when expanded", () => {
    const { unmount } = renderSidebar({ expanded: false });
    expect(screen.getByRole("link", { name: "Library" })).toBeInTheDocument();
    // The label stays mounted so the rail can fade it instead of snapping.
    expect(screen.getByText("Library")).toHaveClass("opacity-0");
    unmount();

    renderSidebar({ expanded: true });
    expect(screen.getByText("Library")).toHaveClass("opacity-100");
    expect(screen.getByText("Favorites")).toHaveClass("opacity-100");
  });

  it("keeps pricing and help in the rail but not billing or settings", () => {
    renderSidebar({ expanded: true });
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/pricing");
    expect(hrefs).toContain("/help");
    expect(hrefs).not.toContain("/billing");
    expect(hrefs).not.toContain("/settings");
  });

  it("marks the current section", () => {
    setPathname("/library");
    renderSidebar({ expanded: true });
    expect(screen.getByRole("link", { name: "Library" })).toHaveClass(
      "bg-secondary",
    );
    expect(screen.getByRole("link", { name: "Assets" })).not.toHaveClass(
      "bg-secondary",
    );
  });

  it("treats every create route as the create destination", () => {
    setPathname("/create/image");
    renderSidebar({ expanded: true });
    expect(screen.getByRole("link", { name: "Create" })).toHaveClass(
      "bg-secondary",
    );
  });

  it("hands the expand control back to the shell", async () => {
    const onToggle = vi.fn();
    renderSidebar({ expanded: false, onToggle });
    await userEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("links to the composer from the new generation call to action", () => {
    renderSidebar({ expanded: true });
    expect(
      screen.getByRole("link", { name: /New generation/ }),
    ).toHaveAttribute("href", "/create/video");
  });
});

describe("sidebar profile menu", () => {
  it("keeps the balance, billing and settings inside the profile", async () => {
    renderSidebar({ expanded: true });
    await userEvent.click(screen.getByRole("button", { name: "Account menu" }));

    const menu = await screen.findByRole("menu");
    expect(within(menu).getByText("Account")).toBeInTheDocument();
    expect(
      within(menu).getByText("arman@chronolab.ai"),
    ).toBeInTheDocument();
    expect(within(menu).queryByText("Arman Mikoyan")).not.toBeInTheDocument();

    const balance = within(menu).getByRole("menuitem", { name: /Balance/ });
    expect(balance).toHaveAttribute("href", "/billing");
    expect(balance).toHaveTextContent("$10.54");

    expect(within(menu).getByRole("menuitem", { name: /Billing/ })).toHaveAttribute(
      "href",
      "/billing",
    );
    expect(
      within(menu).getByRole("menuitem", { name: /Account settings/ }),
    ).toHaveAttribute("href", "/settings");
    expect(
      within(menu).getByRole("menuitem", { name: /Sign out/ }),
    ).toHaveAttribute("href", "/login");
  });

  it("shows the same entries from the collapsed rail", async () => {
    renderSidebar({ expanded: false });
    await userEvent.click(screen.getByRole("button", { name: "Account menu" }));

    const menu = await screen.findByRole("menu");
    expect(
      within(menu).getAllByRole("menuitem").map((item) => item.textContent?.trim()),
    ).toEqual([
      expect.stringContaining("Balance"),
      "Billing",
      "Account settings",
      "Help",
      "Sign out",
    ]);
  });

  it("never mentions credits", () => {
    renderSidebar({ expanded: true });
    expect(screen.queryByText(/credit/i)).not.toBeInTheDocument();
  });
});

describe("mobile drawer", () => {
  it("renders as a modal dialog with the full navigation", async () => {
    renderDrawer(true);
    const dialog = await screen.findByRole("dialog");

    expect(within(dialog).getByRole("link", { name: "Create" })).toBeVisible();
    expect(within(dialog).getByRole("link", { name: "Library" })).toBeVisible();
    expect(
      within(dialog).getByRole("link", { name: /New generation/ }),
    ).toBeInTheDocument();
  });

  it("closes from its unexpand control", async () => {
    const { onOpenChange } = renderDrawer(true);
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Close navigation" }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes on escape", () => {
    const { onOpenChange } = renderDrawer(true);
    expect(onOpenChange).not.toHaveBeenCalled();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("reveals the account panel inline", async () => {
    renderDrawer(true);
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Account menu" }),
    );

    const panel = await screen.findByRole("dialog");
    expect(within(panel).getByRole("link", { name: /Balance/ })).toHaveAttribute(
      "href",
      "/billing",
    );
    expect(
      within(panel).getByRole("link", { name: /Account settings/ }),
    ).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /Sign out/ })).toBeVisible();
  });

  it("does not render when closed", () => {
    renderDrawer(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

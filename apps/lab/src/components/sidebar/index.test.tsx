import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from ".";
import { MobileSidebar } from "./mobile-sidebar";
import { TooltipProvider } from "@/ui/tooltip";
import { fetchMock, routerMock, setPathname } from "~/vitest.setup";

function renderSidebar(expanded: boolean, onToggle: () => void = vi.fn()) {
  return render(
    <TooltipProvider>
      <Sidebar expanded={expanded} onToggle={onToggle} />
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

  return {
    ...utils,
    onOpenChange,
    rerender: (next: boolean) => utils.rerender(ui(next)),
  };
}

const railNavLinks = () => within(screen.getByRole("navigation", { name: "Studio" })).getAllByRole("link");

function mockSession(email = "arman@chronolab.ai") {
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify({ user: { id: "user-1", email } }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  );
}

describe("sidebar rail", () => {
  it("lists the primary destinations", () => {
    renderSidebar(false);
    const hrefs = railNavLinks().map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual(["/create/video", "/explore", "/library", "/assets", "/favorites"]);
  });

  it("fades the labels out when collapsed and back in when expanded", () => {
    const { unmount } = renderSidebar(false);
    expect(screen.getByRole("link", { name: "Library" })).toBeInTheDocument();
    // The label stays mounted so the rail can fade it instead of snapping.
    expect(screen.getByText("Library")).toHaveClass("opacity-0");
    unmount();

    renderSidebar(true);
    expect(screen.getByText("Library")).toHaveClass("opacity-100");
    expect(screen.getByText("Favorites")).toHaveClass("opacity-100");
  });

  it("keeps pricing and help in the rail but not the settings page", () => {
    renderSidebar(true);
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/pricing");
    expect(hrefs).toContain("/help");
    expect(hrefs).not.toContain("/settings/account");
  });

  it("gives the pricing icon a muted duotone and leaves help neutral", () => {
    renderSidebar(true);

    const pricing = screen.getByRole("link", { name: "Pricing" });
    const gem = pricing.querySelector("svg.lucide-gem");
    expect(gem).toBeInTheDocument();
    expect(gem).toHaveClass("text-brand-secondary");
    expect(gem?.getAttribute("class")).toContain("stroke-brand-tertiary");

    const helpIcon = screen.getByRole("link", { name: "Help" }).querySelector("svg");
    expect(helpIcon).not.toHaveClass("text-brand-secondary");
  });

  it("marks the current section", () => {
    setPathname("/library");
    renderSidebar(true);
    expect(screen.getByRole("link", { name: "Library" })).toHaveClass("bg-secondary");
    expect(screen.getByRole("link", { name: "Assets" })).not.toHaveClass("bg-secondary");
  });

  it("treats every create route as the create destination", () => {
    setPathname("/create/image");
    renderSidebar(true);
    expect(screen.getByRole("link", { name: "Create" })).toHaveClass("bg-secondary");
  });

  it("hands the expand control back to the shell", async () => {
    const onToggle = vi.fn();
    renderSidebar(false, onToggle);
    await userEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("links to the composer from the new generation call to action", () => {
    renderSidebar(true);
    expect(screen.getByRole("link", { name: /New generation/ })).toHaveAttribute("href", "/create/video");
  });
});

describe("sidebar profile menu", () => {
  it("keeps the balance and settings inside the profile", async () => {
    mockSession();
    renderSidebar(true);
    expect(await screen.findByText("arman@chronolab.ai")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Account menu" }));

    const menu = await screen.findByRole("menu");
    expect(within(menu).getByText("Account")).toBeInTheDocument();
    expect(within(menu).getByText("arman@chronolab.ai")).toBeInTheDocument();
    expect(within(menu).queryByText("Arman Mikoyan")).not.toBeInTheDocument();

    const balance = within(menu).getByRole("menuitem", { name: /Balance/ });
    expect(balance).toHaveAttribute("href", "/settings/billing");
    expect(balance).toHaveTextContent("$10.54");

    expect(within(menu).getByRole("menuitem", { name: "Settings" })).toHaveAttribute("href", "/settings/account");
    expect(within(menu).getByRole("menuitem", { name: /Sign out/ })).toBeInTheDocument();
  });

  it("links to login without a session", async () => {
    renderSidebar(true);

    expect(await screen.findByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("button", { name: "Account menu" })).not.toBeInTheDocument();
  });

  it("signs out through the BFF and returns to login", async () => {
    mockSession();
    renderSidebar(true);
    await screen.findByText("arman@chronolab.ai");
    await userEvent.click(screen.getByRole("button", { name: "Account menu" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: /Sign out/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/auth/sign-out", { method: "POST" }));
    expect(routerMock.replace).toHaveBeenCalledWith("/login");
  });

  it("shows the same entries from the collapsed rail", async () => {
    mockSession();
    renderSidebar(false);
    await userEvent.click(screen.getByRole("button", { name: "Account menu" }));

    const menu = await screen.findByRole("menu");
    expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((item) => item.textContent?.trim()),
    ).toEqual([expect.stringContaining("Balance"), "Settings", "Sign out"]);
  });

  it("never mentions credits", () => {
    renderSidebar(true);
    expect(screen.queryByText(/credit/i)).not.toBeInTheDocument();
  });
});

describe("mobile drawer", () => {
  it("renders as a modal dialog with the full navigation", async () => {
    renderDrawer(true);
    const dialog = await screen.findByRole("dialog");

    expect(within(dialog).getByRole("link", { name: "Create" })).toBeVisible();
    expect(within(dialog).getByRole("link", { name: "Library" })).toBeVisible();
    expect(within(dialog).getByRole("link", { name: /New generation/ })).toBeInTheDocument();
  });

  it("closes from its unexpand control", async () => {
    const { onOpenChange } = renderDrawer(true);
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Close navigation" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes on escape", () => {
    const { onOpenChange } = renderDrawer(true);
    expect(onOpenChange).not.toHaveBeenCalled();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("reveals the account panel inline", async () => {
    mockSession();
    renderDrawer(true);
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Account menu" }));

    const panel = await screen.findByRole("dialog");
    expect(within(panel).getByRole("link", { name: /Balance/ })).toHaveAttribute("href", "/settings/billing");
    expect(within(panel).getByRole("link", { name: "Settings" })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /Sign out/ })).toBeVisible();
  });

  it("closes the inline account on escape", async () => {
    mockSession();
    renderDrawer(true);
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Account menu" }));
    expect(await screen.findByRole("link", { name: /Balance/ })).toBeVisible();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("link", { name: /Balance/ })).not.toBeInTheDocument());
  });

  it("closes the inline account when the page is tapped elsewhere", async () => {
    mockSession();
    renderDrawer(true);
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Account menu" }));
    expect(await screen.findByRole("link", { name: /Balance/ })).toBeVisible();

    await userEvent.click(document.body);

    expect(screen.queryByRole("link", { name: /Balance/ })).not.toBeInTheDocument();
  });

  it("links to login without a session", async () => {
    renderDrawer(true);
    const dialog = await screen.findByRole("dialog");

    expect(await within(dialog).findByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
    expect(within(dialog).queryByRole("button", { name: "Account menu" })).not.toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderDrawer(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("collapsed rail tooltip", () => {
  it("names an icon-only destination on hover", async () => {
    renderSidebar(false);
    await userEvent.hover(screen.getByRole("link", { name: "Library" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Library");
  });

  it("stays quiet while the rail is expanded", async () => {
    renderSidebar(true);
    await userEvent.hover(screen.getByRole("link", { name: "Library" }));

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});

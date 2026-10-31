import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TopNav } from "@/components/layout/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routerMock } from "../../mocks/navigation";

function renderTopNav(onOpenMenu = vi.fn()) {
  const utils = render(
    <TooltipProvider>
      <TopNav onOpenMenu={onOpenMenu} />
    </TooltipProvider>,
  );
  return { ...utils, onOpenMenu };
}

const search = () => screen.getByRole("searchbox", { name: "Search the studio" });
const clearButton = () => screen.queryByRole("button", { name: "Clear search" });

describe("top nav", () => {
  it("is the brand entry point", () => {
    renderTopNav();
    expect(
      screen.getByRole("link", { name: "Sunstrike.ai home" }),
    ).toHaveAttribute("href", "/");
  });

  it("exposes the creative tool menus on desktop", () => {
    renderTopNav();
    for (const label of ["Image", "Video", "Motion", "Edit"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("opens the info panel for a tool on hover", () => {
    renderTopNav();
    const image = screen.getByRole("link", { name: "Image" });
    fireEvent.mouseEnter(image.parentElement as HTMLElement);

    expect(
      screen.getByRole("link", { name: /Text to image/ }),
    ).toBeInTheDocument();
  });

  it("hands the mobile menu button back to the shell", async () => {
    const { onOpenMenu } = renderTopNav();
    await userEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });

  it("keeps the balance in the bar and opens billing", () => {
    renderTopNav();
    const pill = screen.getByRole("link", { name: /balance/i });
    expect(pill).toHaveAttribute("href", "/billing");
    expect(pill).toHaveTextContent("$10.54");
  });
});

describe("nav search", () => {
  it("shows the hotkey hint while empty", () => {
    renderTopNav();
    expect(screen.getByText("Ctrl K")).toBeInTheDocument();
    expect(clearButton()).not.toBeInTheDocument();
  });

  it("swaps the hotkey hint for a clear button once there is text", async () => {
    renderTopNav();
    await userEvent.type(search(), "neon");

    expect(screen.queryByText("Ctrl K")).not.toBeInTheDocument();
    expect(clearButton()).toBeInTheDocument();
  });

  it("clears the field and keeps focus", async () => {
    renderTopNav();
    await userEvent.type(search(), "neon alley");
    await userEvent.click(clearButton()!);

    expect(search()).toHaveValue("");
    expect(search()).toHaveFocus();
    expect(screen.getByText("Ctrl K")).toBeInTheDocument();
  });

  it("clears on escape", async () => {
    renderTopNav();
    await userEvent.type(search(), "neon");
    await userEvent.keyboard("{Escape}");

    expect(search()).toHaveValue("");
    expect(search()).not.toHaveFocus();
  });

  it("submits the query to the explore page", async () => {
    renderTopNav();
    await userEvent.type(search(), "  neon alley  ");
    await userEvent.keyboard("{Enter}");

    expect(routerMock.push).toHaveBeenCalledWith("/explore?q=neon%20alley");
  });

  it("goes to explore when submitted empty", async () => {
    renderTopNav();
    await userEvent.click(search());
    await userEvent.keyboard("{Enter}");

    expect(routerMock.push).toHaveBeenCalledWith("/explore");
  });

  it("focuses the field from the keyboard shortcut", () => {
    renderTopNav();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(search()).toHaveFocus();
  });

  it("reacts to cmd+k as well", () => {
    renderTopNav();
    fireEvent.keyDown(window, { key: "K", metaKey: true });
    expect(search()).toHaveFocus();
  });
});

describe("notifications", () => {
  it("opens a panel with recent activity", async () => {
    renderTopNav();
    await userEvent.click(screen.getByRole("button", { name: "Notifications" }));

    const panel = await screen.findByRole("menu");
    expect(within(panel).getByText("Your render is ready")).toBeInTheDocument();
    expect(
      within(panel).getByRole("menuitem", { name: /View all activity/i }),
    ).toHaveAttribute("href", "/library");
  });
});

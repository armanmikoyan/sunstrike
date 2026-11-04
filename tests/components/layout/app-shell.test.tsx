import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppShell } from "@/components/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

function renderShell() {
  return render(
    <TooltipProvider>
      <AppShell>
        <h1>Library</h1>
      </AppShell>
    </TooltipProvider>,
  );
}

describe("app shell", () => {
  it("renders the rail, the bar and the page", () => {
    renderShell();
    expect(screen.getByRole("heading", { name: "Library" })).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search the studio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Expand sidebar" }),
    ).toBeInTheDocument();
  });

  it("expands and collapses the rail", async () => {
    renderShell();
    await userEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));

    const collapse = await screen.findByRole("button", {
      name: "Collapse sidebar",
    });
    expect(screen.getByText("Favorites")).toBeInTheDocument();

    await userEvent.click(collapse);
    expect(
      await screen.findByRole("button", { name: "Expand sidebar" }),
    ).toBeInTheDocument();
  });

  it("opens the drawer from the bar", async () => {
    renderShell();
    await userEvent.click(screen.getByRole("button", { name: "Open navigation" }));

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("link", { name: "Create" }),
    ).toBeInTheDocument();
  });

  it("returns focus to the menu button when the drawer closes", async () => {
    renderShell();
    const opener = screen.getByRole("button", { name: "Open navigation" });
    await userEvent.click(opener);

    const dialog = await screen.findByRole("dialog");
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Close navigation" }),
    );

    expect(opener).toHaveFocus();
  });
});

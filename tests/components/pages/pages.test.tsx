import { Provider } from "jotai";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/(app)/page";
import LibraryPage from "@/app/(app)/library/page";
import ExplorePage from "@/app/(app)/explore/page";
import PricingPage from "@/app/(app)/pricing/page";
import BillingPage from "@/app/(app)/billing/page";
import SettingsPage from "@/app/(app)/settings/page";
import AssetsPage from "@/app/(app)/assets/page";
import FavoritesPage from "@/app/(app)/favorites/page";
import HelpPage from "@/app/(app)/help/page";
import LoginPage from "@/app/login/page";
import { TooltipProvider } from "@/components/ui/tooltip";

function renderPage(ui: React.ReactNode) {
  return render(
    <Provider>
      <TooltipProvider>{ui}</TooltipProvider>
    </Provider>,
  );
}

describe("app pages", () => {
  it("library", () => {
    renderPage(<LibraryPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Library" }),
    ).toBeInTheDocument();
  });

  it("explore", () => {
    renderPage(<ExplorePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "The feed" }),
    ).toBeInTheDocument();
  });

  it("pricing", () => {
    renderPage(<PricingPage />);
    expect(screen.getByText(/Pay for output/)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Video" })).toBeInTheDocument();
  });

  it("billing", () => {
    renderPage(<BillingPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Billing" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Auto top-up")).toBeInTheDocument();
  });

  it("settings", () => {
    renderPage(<SettingsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
  });

  it("assets", () => {
    renderPage(<AssetsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Assets" }),
    ).toBeInTheDocument();
  });

  it("favorites", () => {
    renderPage(<FavoritesPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Favorites" }),
    ).toBeInTheDocument();
  });

  it("help", () => {
    renderPage(<HelpPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Help center" }),
    ).toBeInTheDocument();
  });

  it("login", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent("A studio for");
    expect(screen.getByPlaceholderText("you@studio.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("home", () => {
    renderPage(<HomePage />);
    expect(
      screen.getByRole("button", { name: "Start generation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Describe your generation" }),
    ).toBeInTheDocument();
  });
});

describe("pricing copy", () => {
  it("talks about balance and dollars, never credits", () => {
    const { container } = renderPage(<PricingPage />);
    expect(container.textContent).not.toMatch(/credit/i);
    expect(container.textContent).toMatch(/\$\d/);
  });
});

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("usage settings page", () => {
  it("lists every ledger entry", () => {
    renderWithProviders(<Page />);
    expect(screen.getByRole("heading", { name: "Usage" })).toBeInTheDocument();
    expect(screen.getAllByText(/Balance top-up/).length).toBeGreaterThan(0);
    expect(screen.getByText("+$25.00")).toBeInTheDocument();
  });
});

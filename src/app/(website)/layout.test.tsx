import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WebsiteLayout from "./layout";
import { renderWithProviders } from "~/vitest.setup";

describe("website layout", () => {
  it("renders the page and the footer", () => {
    renderWithProviders(
      <WebsiteLayout>
        <h1>Home</h1>
      </WebsiteLayout>,
    );

    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.queryByRole("searchbox", { name: "Search the studio" }),
    ).toBeNull();
    expect(screen.getByRole("contentinfo")).toHaveAttribute(
      "id",
      "site-footer",
    );
  });
});

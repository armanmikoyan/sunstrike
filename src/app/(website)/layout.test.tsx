import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WebsiteLayout from "./layout";
import { renderWithProviders } from "~/vitest.setup";

describe("website layout", () => {
  it("mounts the chrome and the footer", () => {
    renderWithProviders(
      <WebsiteLayout>
        <h1>Home</h1>
      </WebsiteLayout>,
    );

    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search the studio" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toHaveAttribute(
      "id",
      "site-footer",
    );
  });
});

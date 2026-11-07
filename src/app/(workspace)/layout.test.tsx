import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WorkspaceLayout from "./layout";
import { renderWithProviders } from "~/vitest.setup";

describe("workspace layout", () => {
  it("renders the page without the footer", () => {
    renderWithProviders(
      <WorkspaceLayout>
        <h1>Library</h1>
      </WorkspaceLayout>,
    );

    expect(screen.getByRole("heading", { name: "Library" })).toBeInTheDocument();
    expect(
      screen.queryByRole("searchbox", { name: "Search the studio" }),
    ).toBeNull();
    expect(screen.queryByRole("contentinfo")).toBeNull();
  });
});

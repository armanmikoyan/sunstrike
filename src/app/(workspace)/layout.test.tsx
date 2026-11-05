import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WorkspaceLayout from "./layout";
import { renderWithProviders } from "~/vitest.setup";

describe("workspace layout", () => {
  it("mounts the chrome without the footer", () => {
    renderWithProviders(
      <WorkspaceLayout>
        <h1>Library</h1>
      </WorkspaceLayout>,
    );

    expect(screen.getByRole("heading", { name: "Library" })).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search the studio" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("contentinfo")).toBeNull();
  });
});

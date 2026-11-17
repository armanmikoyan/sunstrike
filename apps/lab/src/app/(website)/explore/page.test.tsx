import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExplorePage from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("explore page", () => {
  it("renders its page heading", () => {
    renderWithProviders(<ExplorePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Explore" }),
    ).toBeInTheDocument();
  });
});

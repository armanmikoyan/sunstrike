import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FavoritesPage from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("favorites page", () => {
  it("renders its page heading", () => {
    renderWithProviders(<FavoritesPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Favorites" }),
    ).toBeInTheDocument();
  });
});

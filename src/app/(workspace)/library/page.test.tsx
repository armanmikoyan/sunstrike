import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LibraryPage from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("library page", () => {
  it("renders its page heading", () => {
    renderWithProviders(<LibraryPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Library" }),
    ).toBeInTheDocument();
  });
});

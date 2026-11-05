import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AssetsPage from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("assets page", () => {
  it("renders its page heading", () => {
    renderWithProviders(<AssetsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Assets" }),
    ).toBeInTheDocument();
  });
});

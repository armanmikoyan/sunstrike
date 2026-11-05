import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HelpPage from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("help page", () => {
  it("renders its page heading", () => {
    renderWithProviders(<HelpPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Help center" }),
    ).toBeInTheDocument();
  });
});

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("home page", () => {
  it("opens with the prompt composer", () => {
    renderWithProviders(<Page />);
    expect(
      screen.getByRole("button", { name: "Start generation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Describe your generation" }),
    ).toBeInTheDocument();
  });
});

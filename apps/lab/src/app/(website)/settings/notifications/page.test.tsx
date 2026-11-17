import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("notifications settings page", () => {
  it("lists the notifications", () => {
    renderWithProviders(<Page />);
    expect(
      screen.getByRole("heading", { name: "Notifications" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Generation (ready|failed)/).length,
    ).toBeGreaterThan(0);
  });
});

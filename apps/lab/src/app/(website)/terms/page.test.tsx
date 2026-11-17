import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TermsPage, { metadata } from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("terms page", () => {
  it("renders its page heading", () => {
    renderWithProviders(<TermsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Terms of service" }),
    ).toBeInTheDocument();
  });

  it("exports a title for the route", () => {
    expect(metadata.title).toBe("Terms of service");
  });
});

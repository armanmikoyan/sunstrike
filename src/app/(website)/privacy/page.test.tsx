import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage, { metadata } from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("privacy page", () => {
  it("renders its page heading", () => {
    renderWithProviders(<PrivacyPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy policy" }),
    ).toBeInTheDocument();
  });

  it("exports a title for the route", () => {
    expect(metadata.title).toBe("Privacy policy");
  });
});

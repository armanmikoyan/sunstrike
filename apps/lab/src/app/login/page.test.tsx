import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage, { metadata } from "./page";

describe("login page", () => {
  it("asks for an email and password", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "A studio for",
    );
    expect(screen.getByPlaceholderText("you@studio.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("asks search engines not to index the sign-in screen", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrivacyPolicy, TermsOfService } from ".";
import { PRIVACY_DOCUMENT, TERMS_DOCUMENT } from "./constants";

describe("legal documents", () => {
  it("renders the privacy policy with every section and its contents", () => {
    const { container } = render(<PrivacyPolicy />);

    expect(screen.getByRole("heading", { level: 1, name: "Privacy policy" })).toBeInTheDocument();
    expect(screen.getByText(/17 November 2026/)).toBeInTheDocument();

    for (const section of PRIVACY_DOCUMENT.sections) {
      expect(container.querySelector(`#${section.id}`)).not.toBeNull();
      expect(screen.getByRole("link", { name: section.title })).toHaveAttribute("href", `#${section.id}`);
    }
  });

  it("gives the cookie section an anchor the banner can link to", () => {
    const { container } = render(<PrivacyPolicy />);
    const cookies = container.querySelector("#cookies");

    expect(cookies).not.toBeNull();
    expect(cookies?.textContent).toMatch(/essential only/i);
  });

  it("renders the terms with its own heading and contact", () => {
    const { container } = render(<TermsOfService />);

    expect(screen.getByRole("heading", { level: 1, name: "Terms of service" })).toBeInTheDocument();
    expect(container.textContent).toMatch(/support@chronolab\.ai/);
    for (const section of TERMS_DOCUMENT.sections) {
      expect(container.querySelector(`#${section.id}`)).not.toBeNull();
    }
  });

  it("keeps body copy sentence case and free of red-state language", () => {
    const { container } = render(<PrivacyPolicy />);
    const headings = [...container.querySelectorAll("h2")].map((heading) => heading.textContent ?? "");

    expect(headings.every((heading) => !/^[A-Z\s]+$/.test(heading))).toBe(true);
    expect(container.textContent).not.toMatch(/credit/i);
  });
});

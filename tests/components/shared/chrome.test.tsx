import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { ClipStrip } from "@/components/clip-strip";

describe("page header", () => {
  it("renders a level one heading with optional context", () => {
    render(
      <PageHeader
        eyebrow="Your studio"
        title="Library"
        description="Everything you have made."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Library" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Your studio")).toBeInTheDocument();
    expect(screen.getByText("Everything you have made.")).toBeInTheDocument();
  });

  it("renders an action slot", () => {
    render(<PageHeader title="Assets" action={<button>Upload</button>} />);
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });
});

describe("section header", () => {
  it("renders a level two heading with its description", () => {
    render(<SectionHeader title="Recent work" description="Newest first." />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Recent work" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Newest first.")).toBeInTheDocument();
  });
});

describe("site footer", () => {
  it("links to the studio areas", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: /Video studio/ })).toHaveAttribute(
      "href",
      "/create/video",
    );
    expect(screen.getByRole("link", { name: /Billing/ })).toHaveAttribute(
      "href",
      "/billing",
    );
  });

  it("does not promise credits that expire", () => {
    const { container } = render(<SiteFooter />);
    expect(container.textContent).toMatch(/no expiring balance/i);
    expect(container.textContent).not.toMatch(/credit/i);
  });
});

describe("clip strip", () => {
  it("prints a dollar price under every clip", () => {
    render(<ClipStrip ids={["01", "02"]} />);
    expect(screen.getAllByText(/^\$\d+\.\d{2}$/)).toHaveLength(2);
  });

  it("skips unknown ids", () => {
    const { container } = render(<ClipStrip ids={["01", "missing"]} />);
    expect(container.querySelectorAll("video")).toHaveLength(1);
  });
});

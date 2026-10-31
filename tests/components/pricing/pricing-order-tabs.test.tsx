import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PricingOrderTabs } from "@/components/pricing/pricing-order-tabs";

describe("pricing order tabs", () => {
  it("starts on video", () => {
    render(<PricingOrderTabs />);
    expect(screen.getByRole("tab", { name: "Video" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("$2.04");
  });

  it("switches to the image calculator", async () => {
    render(<PricingOrderTabs />);
    await userEvent.click(screen.getByRole("tab", { name: "Images" }));

    expect(screen.getByRole("tab", { name: "Images" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("slider", { name: "Number of images" })).toBeVisible();
    expect(screen.queryByRole("slider", { name: "Number of clips" })).toBeNull();
  });

  it("keeps the selection when switching back and forth", async () => {
    render(<PricingOrderTabs />);
    await userEvent.click(screen.getByRole("tab", { name: "Images" }));
    await userEvent.click(screen.getByRole("tab", { name: "Video" }));
    expect(screen.getByRole("slider", { name: "Number of clips" })).toBeVisible();
  });

  it("labels the visible calculator with dollars", () => {
    render(<PricingOrderTabs />);
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getAllByText(/^\$/).length).toBeGreaterThan(0);
    expect(panel).not.toHaveTextContent(/credit/i);
  });
});

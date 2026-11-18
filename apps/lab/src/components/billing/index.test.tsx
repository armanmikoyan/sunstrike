import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BillingPane } from ".";
import { BILLING_TRANSACTIONS } from "./constants";
import { UsagePane } from "./usage-pane";

describe("billing pane", () => {
  it("shows the balance, the refill card and the payment method", () => {
    render(<BillingPane />);

    expect(screen.getByText("Available balance")).toBeInTheDocument();
    expect(screen.getByText("Auto top-up")).toBeInTheDocument();
    expect(screen.getByText("•••• 4242")).toBeInTheDocument();
  });
});

describe("usage pane", () => {
  it("prints every ledger entry with its signed amount", () => {
    render(<UsagePane />);

    for (const transaction of BILLING_TRANSACTIONS) {
      expect(screen.getAllByText(transaction.title).length).toBeGreaterThan(0);
    }

    const rows = screen.getAllByText(/^[+−]\$/);
    expect(rows).toHaveLength(BILLING_TRANSACTIONS.length);
  });

  it("styles refunds differently from charges", () => {
    render(<UsagePane />);
    const refund = screen.getByText("Failed generation refund").closest("div")?.parentElement as HTMLElement;
    const refunded = within(refund).getByText("Refunded");

    expect(refunded.className).toContain("text-foreground");
  });
});

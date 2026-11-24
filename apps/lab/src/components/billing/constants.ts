import { ArrowDownToLine, Coins, Film, Image as ImageIcon, type LucideIcon } from "lucide-react";
import type { UsageTransactionKind } from "./types";

export const TRANSACTION_ICONS: Record<UsageTransactionKind, LucideIcon> = {
  video: Film,
  image: ImageIcon,
  "top-up": Coins,
  refund: ArrowDownToLine,
};

export const BILLING_COPY = {
  title: "Billing",
  description: "One balance for every model. No subscription, no expiry, no seat minimum.",
  addFunds: "Add funds",
  balance: {
    label: "Available balance",
    tag: "PAYG",
    currency: "USD",
    note: "Never expires",
  },
  payment: {
    title: "Payment method",
    description: "Charged when you add funds",
    network: "Visa",
    badge: "VISA",
    card: "•••• 4242",
    expiry: "Expires 08/29",
    manage: "Manage payment methods",
  },
  receipts: {
    download: "Download all",
    history: "View full transaction history",
  },
  usage: {
    title: "Usage",
    description: "Every charge, top-up and refund on your balance, newest first.",
  },
  low: {
    title: "Running low?",
    description: "Auto top-up keeps your balance above $5. You can switch it off from this page at any time.",
    action: "See top-up options",
  },
  footer: {
    note: "All prices in USD. Your next charge is only when you top up.",
    help: "Billing help",
    tax: "Tax information",
  },
};

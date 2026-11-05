import {
  ArrowDownToLine,
  Coins,
  Film,
  Image as ImageIcon,
} from "lucide-react";

export const billingTransactions = [
  {
    id: "txn_20931",
    title: "Chronolab Motion 2 · After Rain",
    detail: "Video render · 6s · 1080p",
    date: "Today, 14:32",
    amount: "−$0.51",
    status: "Completed",
    icon: Film,
  },
  {
    id: "txn_20930",
    title: "Chronolab Image Pro · Soft Object",
    detail: "Image render · 2 MP",
    date: "Today, 14:08",
    amount: "−$0.12",
    status: "Completed",
    icon: ImageIcon,
  },
  {
    id: "txn_20929",
    title: "Balance top-up",
    detail: "Studio pack · Visa ending 4242",
    date: "Oct 27, 09:12",
    amount: "+$25.00",
    status: "Paid",
    icon: Coins,
  },
  {
    id: "txn_20928",
    title: "Chronolab Motion Turbo · Orbit study",
    detail: "Video render · 4s · 720p",
    date: "Oct 27, 08:44",
    amount: "−$0.34",
    status: "Completed",
    icon: Film,
  },
  {
    id: "txn_20927",
    title: "Failed render refund",
    detail: "Chronolab Motion 2 · automatic refund",
    date: "Oct 26, 19:03",
    amount: "+$0.51",
    status: "Refunded",
    icon: ArrowDownToLine,
  },
  {
    id: "txn_20926",
    title: "Balance top-up",
    detail: "Starter pack · Visa ending 4242",
    date: "Oct 18, 12:21",
    amount: "+$10.00",
    status: "Paid",
    icon: Coins,
  },
];

export const billingUsage = [
  22, 38, 30, 58, 46, 72, 34, 55, 88, 62, 40, 76, 48, 64,
];

export const billingCopy = {
  eyebrow: "Account",
  title: "Billing",
  description:
    "One balance for every model. No subscription, no expiry, no seat minimum.",
  addFunds: "Add funds",
  balance: {
    label: "Available balance",
    tag: "PAYG",
    value: "$10.54",
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
    title: "Usage & receipts",
    download: "Download all",
    history: "View full transaction history",
  },
  usage: {
    title: "Last 14 days",
    total: "$12.40",
    start: "Oct 18",
    end: "Oct 31",
  },
  low: {
    title: "Running low?",
    description:
      "Auto top-up keeps your balance above $5. You can switch it off from this page at any time.",
    action: "See top-up options",
  },
  footer: {
    note: "All prices in USD. Your next charge is only when you top up.",
    help: "Billing help",
    tax: "Tax information",
  },
};

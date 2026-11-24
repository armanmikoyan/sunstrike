import type { UsageTransaction } from "@/components/billing/types";

/** The signed-in account's available balance, in USD. */
export const balance = 10.54;

export const transactions: UsageTransaction[] = [
  {
    id: "txn_20931",
    kind: "video",
    title: "Chronolab Motion 2 · After Rain",
    detail: "Video generation · 6s · 1080p",
    date: "Today, 14:32",
    amount: "−$0.51",
    status: "Completed",
  },
  {
    id: "txn_20930",
    kind: "image",
    title: "Chronolab Image Pro · Soft Object",
    detail: "Image generation · 2 MP",
    date: "Today, 14:08",
    amount: "−$0.12",
    status: "Completed",
  },
  {
    id: "txn_20929",
    kind: "top-up",
    title: "Balance top-up",
    detail: "Studio pack · Visa ending 4242",
    date: "Oct 27, 09:12",
    amount: "+$25.00",
    status: "Paid",
  },
  {
    id: "txn_20928",
    kind: "video",
    title: "Chronolab Motion Turbo · Orbit study",
    detail: "Video generation · 4s · 720p",
    date: "Oct 27, 08:44",
    amount: "−$0.34",
    status: "Completed",
  },
  {
    id: "txn_20927",
    kind: "refund",
    title: "Failed generation refund",
    detail: "Chronolab Motion 2 · automatic refund",
    date: "Oct 26, 19:03",
    amount: "+$0.51",
    status: "Refunded",
  },
  {
    id: "txn_20926",
    kind: "top-up",
    title: "Balance top-up",
    detail: "Starter pack · Visa ending 4242",
    date: "Oct 18, 12:21",
    amount: "+$10.00",
    status: "Paid",
  },
];

// Accents stay in the brand's cool range (violet to cyan) so the row reads as
// one family. The prices double as the range marks on the custom bar, and the
// popular pack is selected when the page loads.
export const topUpPacks = [
  { id: "five", price: 5, note: "A few shots", accent: "#8b5cf6" },
  {
    id: "fifty",
    price: 50,
    note: "Viral reels every day",
    accent: "#6366f1",
    popular: true,
  },
  { id: "two-fifty", price: 250, note: "Ad campaign", accent: "#0ea5e9" },
  { id: "thousand", price: 1000, note: "Full production", accent: "#14b8a6" },
  { id: "five-thousand", price: 5000, note: "Full movie", accent: "#22c55e" },
  {
    id: "ten-thousand",
    price: 10000,
    note: "Billionaire era",
    accent: "#a3e635",
  },
];

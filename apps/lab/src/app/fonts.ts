import { Inter, Instrument_Serif, Space_Grotesk, Space_Mono } from "next/font/google";

export const INTER = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const SPACE_GROTESK = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const SPACE_MONO = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
});

export const INSTRUMENT_SERIF = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

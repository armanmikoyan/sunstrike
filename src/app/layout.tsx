import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Space_Grotesk, Space_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sunstrike.ai"),
  applicationName: "Sunstrike.ai",
  title: {
    default: "Sunstrike.ai — Generative Studio",
    template: "%s — Sunstrike.ai",
  },
  description:
    "Generate cinematic video and stills from a prompt. Pay as you go, keep every frame.",
};

export const viewport: Viewport = {
  themeColor: "#131517",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

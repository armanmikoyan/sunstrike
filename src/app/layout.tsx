import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Space_Grotesk, Space_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import { SOCIAL_SRC } from "@/components/brand/constants";
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
  metadataBase: new URL("https://chronolab.ai"),
  applicationName: "Chronolab.ai",
  title: {
    default: "Chronolab.ai — Generative Studio",
    template: "%s — Chronolab.ai",
  },
  description:
    "Generate cinematic video and stills from a prompt. Pay as you go, keep every frame.",
  manifest: "/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
      { url: "/favicons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "Chronolab.ai — Generative Studio",
    description:
      "Generate cinematic video and stills from a prompt. Pay as you go, keep every frame.",
    siteName: "Chronolab.ai",
    type: "website",
    images: [{ url: SOCIAL_SRC, width: 1200, height: 630, alt: "Chronolab.ai" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [SOCIAL_SRC],
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
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

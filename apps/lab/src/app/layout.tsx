import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import { AppShell } from "@/app/shell";
import { SOCIAL_SRC } from "@/components/brand/constants";
import { GoogleOneTap } from "@/components/auth/google-one-tap";
import { SignOutOverlay } from "@/components/auth/sign-out-overlay";
import { CookieConsent } from "@/components/cookie-consent";
import { INSTRUMENT_SERIF, INTER, SPACE_GROTESK, SPACE_MONO } from "@/app/fonts";
import "./globals.css";

const SITE_URL = process.env.SITE_URL ?? "https://chronolab.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Chronolab.ai",
  title: {
    default: "Chronolab.ai — Generative Studio",
    template: "%s — Chronolab.ai",
  },
  description: "Generate cinematic video and images from a prompt. Pay as you go, keep every frame.",
  icons: {
    icon: "/brand/favicon.ico",
  },
  openGraph: {
    title: "Chronolab.ai — Generative Studio",
    description: "Generate cinematic video and images from a prompt. Pay as you go, keep every frame.",
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
      data-scroll-behavior="smooth"
      className={`dark scroll-smooth motion-reduce:scroll-auto ${INTER.variable} ${SPACE_GROTESK.variable} ${SPACE_MONO.variable} ${INSTRUMENT_SERIF.variable}`}
    >
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
          <GoogleOneTap />
          <SignOutOverlay />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}

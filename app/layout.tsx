import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const SITE = "https://ashutoshgupta.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Ashutosh Gupta — Full-Stack Engineer",
  description:
    "Full-stack engineer shipping products end-to-end — from Postgres schema to the last pixel. Six years building software at scale.",
  keywords: [
    "full-stack engineer",
    "Next.js",
    "NestJS",
    "React",
    "TypeScript",
    "AWS",
    "portfolio",
  ],
  authors: [{ name: "Ashutosh Gupta" }],
  openGraph: {
    title: "Ashutosh Gupta — Full-Stack Engineer",
    description:
      "Full-stack engineer shipping products end-to-end — from Postgres schema to the last pixel.",
    url: SITE,
    siteName: "Ashutosh Gupta",
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "Ashutosh Gupta — Full-Stack Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashutosh Gupta — Full-Stack Engineer",
    description:
      "Full-stack engineer shipping products end-to-end — from Postgres schema to the last pixel.",
    images: ["/og"],
  },
};

// Honors a ?theme= query param before paint (the ashOS takeover iframe passes
// the parent's current theme). Mirrors the desktop takeover behavior.
const THEME_SCRIPT = `(function(){try{var t=new URLSearchParams(location.search).get('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_SCRIPT}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}

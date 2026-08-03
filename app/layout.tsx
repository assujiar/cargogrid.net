import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "../src/index.css";
import { LanguageProvider } from "../src/components/shared/LanguageProvider";
import UtmCapture from "../src/components/shared/UtmCapture";
import { ogImage, siteGraphJsonLd, siteUrl } from "../src/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Not preloaded: the mono face is only used for small badges, metric labels and
// timestamps, never for the headline or subheadline that decide LCP. Preloading
// it put a third font download on the critical path competing for bandwidth
// with the two faces that do gate first paint.
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CargoGrid OS - Sistem Operasi Logistik Enterprise Terintegrasi & ERP Software",
  description:
    "CargoGrid OS adalah sistem operasi logistik terintegrasi dan software ERP end-to-end untuk Freight Forwarder, 3PL Warehouse, armada Trucking, dan Corporate Shipper.",
  keywords: [
    "sistem operasi logistik",
    "ERP logistik enterprise",
    "software logistik indonesia",
    "freight forwarding software",
    "warehouse management system",
    "fleet management",
    "ePOD",
  ],
  authors: [{ name: "CargoGrid Enterprise" }],
  openGraph: {
    title: "CargoGrid OS - Sistem Operasi Logistik Enterprise Terintegrasi & ERP Software",
    description:
      "Sistem operasi logistik dan ERP end-to-end untuk Freight Forwarder, 3PL Warehouse, armada Trucking, dan Corporate Shipper.",
    type: "website",
    siteName: "CargoGrid OS",
    locale: "id_ID",
    images: [{ ...ogImage, alt: "CargoGrid OS — Sistem Operasi Logistik Enterprise Terintegrasi" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage.url],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#eaf0f6",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphJsonLd()) }}
        />
        <LanguageProvider>
          <UtmCapture />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

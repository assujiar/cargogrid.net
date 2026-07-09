import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "../src/index.css";

export const metadata: Metadata = {
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
  },
};

export const viewport: Viewport = {
  themeColor: "#eaf0f6",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

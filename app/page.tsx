import SiteShell from "../src/components/chrome/SiteShell";
import HomeRouter from "../src/components/HomeRouter";
import { buildMetadata } from "../src/lib/seo";

export const metadata = buildMetadata({
  path: "/",
  title: "CargoGrid OS — Platform Logistik Modern untuk Freight Forwarder, 3PL & Trucking",
  description:
    "Kelola RFQ, penawaran harga, dispatch armada, WMS, e-POD, hingga billing dan akuntansi dalam satu platform logistik terhubung. Hentikan pekerjaan manual di Excel dan WhatsApp.",
  keywords: [
    "sistem operasi logistik",
    "ERP logistik enterprise",
    "software logistik indonesia",
    "freight forwarding software",
    "warehouse management system",
    "fleet management",
    "ePOD",
  ],
});

export default function HomePage() {
  return (
    <SiteShell>
      <HomeRouter />
    </SiteShell>
  );
}

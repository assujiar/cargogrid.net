import Link from "next/link";
import SiteShell from "../../src/components/chrome/SiteShell";
import PageJourneyNav from "../../src/components/chrome/PageJourneyNav";
import PricingSection from "../../src/components/PricingSection";
import { buildMetadata, breadcrumbJsonLd } from "../../src/lib/seo";

export const metadata = buildMetadata({
  path: "/paket",
  title: "Paket Harga CargoGrid OS — TrackPortal hingga Enterprise Custom",
  description:
    "6 paket sistem logistik: TrackPortal, QuoteOps, Operations Pro, Warehouse WMS, ERP Suite, hingga Enterprise Custom. Bandingkan harga, fitur, dan add-on yang tersedia.",
  keywords: ["harga software logistik", "paket cargogrid", "biaya WMS", "biaya ERP logistik"],
});

export default function PaketPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/paket", "Paket")) }}
      />
      <PricingSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <p className="text-xs text-slate-500 font-semibold">
          Punya pertanyaan seputar paket dan implementasi?{" "}
          <Link href="/faq" className="text-brand-teal font-black hover:underline">
            Lihat FAQ lengkap
          </Link>{" "}
          atau{" "}
          <Link href="/kontak" className="text-brand-teal font-black hover:underline">
            hubungi tim kami
          </Link>
          .
        </p>
      </div>
      <PageJourneyNav view="plans" />
    </SiteShell>
  );
}

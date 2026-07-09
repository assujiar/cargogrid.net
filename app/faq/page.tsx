import SiteShell from "../../src/components/chrome/SiteShell";
import FaqSection from "../../src/components/FaqSection";
import { buildMetadata, breadcrumbJsonLd, faqPageJsonLd } from "../../src/lib/seo";

export const metadata = buildMetadata({
  path: "/faq",
  title: "FAQ — Pertanyaan Seputar CargoGrid OS",
  description:
    "Jawaban lengkap seputar integrasi akuntansi, langganan modul terpisah, kustomisasi SOP, keamanan data, waktu implementasi, dan biaya tersembunyi CargoGrid OS.",
  keywords: ["FAQ cargogrid", "pertanyaan software logistik", "implementasi WMS", "keamanan data logistik"],
});

export default function FaqPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd()) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/faq", "FAQ")) }}
      />
      <FaqSection />
    </SiteShell>
  );
}

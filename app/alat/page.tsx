import SiteShell from "../../src/components/chrome/SiteShell";
import ToolIndexView from "../../src/components/tools/ToolIndexView";
import { buildMetadata, breadcrumbJsonLd, toolCollectionJsonLd } from "../../src/lib/seo";

export const metadata = buildMetadata({
  path: "/alat",
  title: "Alat & Referensi Logistik Gratis — Kalkulator CBM, Muatan Truk, Demurrage | CargoGrid",
  description:
    "Kalkulator CBM dan berat volumetrik, kalkulator muatan truk, kalkulator free time dan demurrage, tabel ukuran kontainer, jenis truk Indonesia, Incoterms 2020, dan kamus istilah logistik.",
  keywords: [
    "kalkulator logistik",
    "alat bantu freight forwarding",
    "kalkulator CBM",
    "kalkulator muatan truk",
    "referensi logistik indonesia",
  ],
});

export default function AlatPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/alat", "Alat & Referensi")) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolCollectionJsonLd()) }}
      />
      <ToolIndexView />
    </SiteShell>
  );
}

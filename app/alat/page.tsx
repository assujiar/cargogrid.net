import SiteShell from "../../src/components/chrome/SiteShell";
import ToolIndexView from "../../src/components/tools/ToolIndexView";
import { buildMetadata, breadcrumbJsonLd, toolCollectionJsonLd } from "../../src/lib/seo";

export const metadata = buildMetadata({
  path: "/alat",
  title: "Alat & Referensi Logistik Gratis: Kalkulator CBM, Muatan Truk, Demurrage | CargoGrid",
  description:
    "Sembilan alat gratis: kalkulator muatan truk, biaya operasional per kilometer, CBM dan berat volumetrik, free time dan demurrage, serta tabel jenis truk Indonesia, golongan tol dan penyeberangan, ukuran kontainer, Incoterms 2020, dan kamus istilah logistik.",
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

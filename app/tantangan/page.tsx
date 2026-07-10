import SiteShell from "../../src/components/chrome/SiteShell";
import PageJourneyNav from "../../src/components/chrome/PageJourneyNav";
import ProblemSection from "../../src/components/ProblemSection";
import { buildMetadata, breadcrumbJsonLd } from "../../src/lib/seo";

export const metadata = buildMetadata({
  path: "/tantangan",
  title: "Tantangan Operasional Logistik — Excel, WhatsApp & POD Terlambat | CargoGrid OS",
  description:
    "RFQ tercecer di WhatsApp, rate vendor manual di Excel, dan POD fisik yang telat menahan invoice berminggu-minggu. Lihat kebocoran operasional nyata dan bandingkan alur kerja lama vs. CargoGrid.",
  keywords: [
    "tantangan operasional logistik",
    "POD terlambat",
    "cost leakage logistik",
    "RFQ manual excel",
    "proof of delivery digital",
  ],
});

export default function TantanganPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/tantangan", "Tantangan")) }}
      />
      <div id="problem-area">
        <ProblemSection />
      </div>
      <PageJourneyNav view="challenges" />
    </SiteShell>
  );
}

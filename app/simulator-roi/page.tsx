import dynamic from "next/dynamic";
import SiteShell from "../../src/components/chrome/SiteShell";
import PageJourneyNav from "../../src/components/chrome/PageJourneyNav";
import DelayCalculator from "../../src/components/DelayCalculator";
import { buildMetadata, breadcrumbJsonLd } from "../../src/lib/seo";

const LiveDemoSandbox = dynamic(() => import("../../src/components/LiveDemoSandbox"));

export const metadata = buildMetadata({
  path: "/simulator-roi",
  title: "Simulator ROI & Preview Produk — Hitung Kebocoran Biaya POD | CargoGrid OS",
  description:
    "Hitung estimasi biaya tenaga kerja terbuang dan dana macet akibat POD lambat, lalu coba langsung simulasi RFQ, dispatch, tracking, dan billing CargoGrid OS.",
  keywords: [
    "kalkulator ROI logistik",
    "cost leakage calculator",
    "simulator POD",
    "demo software logistik",
  ],
});

export default function SimulatorRoiPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/simulator-roi", "Simulator & ROI")) }}
      />
      <div id="calculator-area">
        <DelayCalculator />
      </div>
      <div id="sandbox-area">
        <LiveDemoSandbox />
      </div>
      <PageJourneyNav view="simulator" />
    </SiteShell>
  );
}

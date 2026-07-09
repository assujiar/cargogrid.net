import SiteShell from "../../src/components/chrome/SiteShell";
import ConnectedFlowVisualizer from "../../src/components/ConnectedFlowVisualizer";
import ModulesSection from "../../src/components/ModulesSection";
import IcpSelector from "../../src/components/IcpSelector";
import { buildMetadata, breadcrumbJsonLd } from "../../src/lib/seo";

export const metadata = buildMetadata({
  path: "/solusi",
  title: "Sistem & Modul CargoGrid OS — CRM, WMS, Dispatch & Billing Terhubung",
  description:
    "7 modul siap pakai: CRM & RFQ, Pricing & Rate Book, WMS & Putaway, Job Dispatch, Job Costing, Billing & ERP Accounting, hingga Branded Customer Portal — semua berjalan dari satu alur data yang sama.",
  keywords: [
    "sistem operasi logistik",
    "modul WMS",
    "CRM RFQ logistik",
    "job dispatch trucking",
    "billing ERP logistik",
    "branded customer portal",
  ],
});

export default function SolusiPage() {
  return (
    <SiteShell view="system">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/solusi", "Solusi")) }}
      />
      <div id="flow-area">
        <ConnectedFlowVisualizer />
      </div>
      <div id="modules-area">
        <ModulesSection />
      </div>
      <div id="use-cases-area">
        <IcpSelector />
      </div>
    </SiteShell>
  );
}

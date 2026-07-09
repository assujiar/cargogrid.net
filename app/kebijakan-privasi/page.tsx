import SiteShell from "../../src/components/chrome/SiteShell";
import LegalPageHeader from "../../src/components/legal/LegalPageHeader";
import PrivacyPolicyBody from "../../src/components/legal/PrivacyPolicyBody";
import { buildMetadata, breadcrumbJsonLd } from "../../src/lib/seo";

export const metadata = buildMetadata({
  path: "/kebijakan-privasi",
  title: "Kebijakan Privasi — CargoGrid OS",
  description:
    "Bagaimana CargoGrid mengumpulkan, menggunakan, dan melindungi data kontak bisnis, data inquiry operasional, serta analitik website Anda, sesuai UU PDP dan standar GDPR.",
});

export default function KebijakanPrivasiPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/kebijakan-privasi", "Kebijakan Privasi")) }}
      />
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-24 px-4 sm:px-6 lg:px-8 relative z-10" id="legal-page-container">
        <div className="absolute top-0 left-0 w-full h-64 bg-navy-dark/10 pointer-events-none -z-10" />
        <div className="max-w-4xl mx-auto">
          <LegalPageHeader doc="privacy" />
          <PrivacyPolicyBody />
          <div className="mt-8 text-center text-xs text-slate-500 font-mono font-bold pb-4">
            Butuh draf perjanjian legal khusus untuk korporasi Anda? Hubungi service@cargogrid.net
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

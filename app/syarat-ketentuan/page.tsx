import SiteShell from "../../src/components/chrome/SiteShell";
import LegalPageHeader from "../../src/components/legal/LegalPageHeader";
import TermsBody from "../../src/components/legal/TermsBody";
import { buildMetadata, breadcrumbJsonLd } from "../../src/lib/seo";

export const metadata = buildMetadata({
  path: "/syarat-ketentuan",
  title: "Syarat & Ketentuan — CargoGrid OS",
  description:
    "Ketentuan penggunaan situs, permintaan demo/audit, tanggung jawab keakuratan data, hak kekayaan intelektual, dan batasan tanggung jawab CargoGrid OS.",
});

export default function SyaratKetentuanPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/syarat-ketentuan", "Syarat & Ketentuan")) }}
      />
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-24 px-4 sm:px-6 lg:px-8 relative z-10" id="legal-page-container">
        <div className="absolute top-0 left-0 w-full h-64 bg-navy-dark/10 pointer-events-none -z-10" />
        <div className="max-w-4xl mx-auto">
          <LegalPageHeader doc="terms" />
          <TermsBody />
          <div className="mt-8 text-center text-xs text-slate-500 font-mono font-bold pb-4">
            Butuh draf perjanjian legal khusus untuk korporasi Anda? Hubungi service@cargogrid.net
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

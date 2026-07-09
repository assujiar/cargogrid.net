import SiteShell from "../../src/components/chrome/SiteShell";
import LeadCaptureForm from "../../src/components/LeadCaptureForm";
import { buildMetadata, breadcrumbJsonLd } from "../../src/lib/seo";

// LeadCaptureForm transitively requires Supabase env vars at module-load time
// (see src/lib/supabase.ts). Those are only guaranteed to be present at
// runtime in the deployed environment, not at `next build` time, so this
// route is rendered per-request rather than statically prerendered.
export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  path: "/kontak",
  title: "Kontak & Audit Sistem Gratis — CargoGrid OS",
  description:
    "Daftarkan audit sistem logistik gratis senilai Rp 5.000.000, atau hubungi tim CargoGrid langsung via email dan WhatsApp untuk konsultasi implementasi.",
  keywords: ["kontak cargogrid", "audit sistem logistik gratis", "konsultasi software logistik", "demo cargogrid"],
});

export default function KontakPage() {
  return (
    <SiteShell view="contact">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/kontak", "Kontak")) }}
      />
      <div id="lead-form-area">
        <LeadCaptureForm />
      </div>
    </SiteShell>
  );
}

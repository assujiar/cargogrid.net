import type { Article } from "./types";
import { article as odolTimbanganJembatanMuatanLebih } from "./odol-timbangan-jembatan-muatan-lebih";
import { article as perawatanArmadaPreventifVsReaktif } from "./perawatan-armada-preventif-vs-reaktif";
import { article as uangJalanKasKecilSopir } from "./uang-jalan-kas-kecil-sopir";
import { article as asuransiCargoKlaimKerusakanBarang } from "./asuransi-cargo-klaim-kerusakan-barang";
import { article as negosiasiTarifTahunanKontrakShipper } from "./negosiasi-tarif-tahunan-kontrak-shipper";
import { article as lonjakanMusimanKapasitasPeakSeason } from "./lonjakan-musiman-kapasitas-peak-season";
import { article as grupWhatsappSistemOperasionalBayangan } from "./grup-whatsapp-sistem-operasional-bayangan";
import { article as aksesSistemSaatKaryawanResign } from "./akses-sistem-saat-karyawan-resign";
import { article as returBarangReverseLogisticsGudang } from "./retur-barang-reverse-logistics-gudang";
import { article as slottingTataLetakGudangProduktivitasPicking } from "./slotting-tata-letak-gudang-produktivitas-picking";
import { article as biayaTersembunyiPodKertas } from "./biaya-tersembunyi-pod-kertas";
import { article as rekonsiliasiInvoiceForwarderTerlambat } from "./rekonsiliasi-invoice-forwarder-terlambat";
import { article as marginPerJobForwarder } from "./margin-per-job-forwarder";
import { article as alurRfqFreightForwarding } from "./alur-rfq-freight-forwarding";
import { article as manajemenVendorSubkontraktor } from "./manajemen-vendor-subkontraktor";
import { article as customerPortalLogistik } from "./customer-portal-logistik";
import { article as demurrageDetentionPelabuhan } from "./demurrage-detention-pelabuhan";
import { article as trackingMultimodaIndonesia } from "./tracking-multimoda-indonesia";
import { article as adopsiAplikasiDriver } from "./adopsi-aplikasi-driver";
import { article as kpiOperasionalLogistik } from "./kpi-operasional-logistik";
import { article as wms3plLevelBin } from "./wms-3pl-level-bin";
import { article as kapanExcelBerhentiCukup } from "./kapan-excel-berhenti-cukup";
import { article as integrasiErpAkuntansiLogistik } from "./integrasi-erp-akuntansi-logistik";
import { article as dokumenKepabeananArsipDigital } from "./dokumen-kepabeanan-arsip-digital";
import { article as memilihSoftwareLogistikPilot30Hari } from "./memilih-software-logistik-pilot-30-hari";

/**
 * Article registry.
 *
 * Ordered newest-intent-first for the index page. Each article lives in its own
 * module so a single piece can be edited, reviewed and diffed without touching
 * the other twenty-four.
 */
const registry: Article[] = [
  odolTimbanganJembatanMuatanLebih,
  perawatanArmadaPreventifVsReaktif,
  uangJalanKasKecilSopir,
  asuransiCargoKlaimKerusakanBarang,
  negosiasiTarifTahunanKontrakShipper,
  lonjakanMusimanKapasitasPeakSeason,
  grupWhatsappSistemOperasionalBayangan,
  aksesSistemSaatKaryawanResign,
  returBarangReverseLogisticsGudang,
  slottingTataLetakGudangProduktivitasPicking,
  biayaTersembunyiPodKertas,
  rekonsiliasiInvoiceForwarderTerlambat,
  marginPerJobForwarder,
  alurRfqFreightForwarding,
  manajemenVendorSubkontraktor,
  customerPortalLogistik,
  demurrageDetentionPelabuhan,
  trackingMultimodaIndonesia,
  adopsiAplikasiDriver,
  kpiOperasionalLogistik,
  wms3plLevelBin,
  kapanExcelBerhentiCukup,
  integrasiErpAkuntansiLogistik,
  dokumenKepabeananArsipDigital,
  memilihSoftwareLogistikPilot30Hari,
];

export const articles: Article[] = registry;

export const articleSlugs: string[] = registry.map((a) => a.slug);

/**
 * Cover art variant per slug, assigned by registry position. There are exactly
 * as many motifs as articles, so every piece gets a structurally different
 * picture rather than a jittered copy of its category's motif.
 */
const variantBySlug = new Map(registry.map((a, i) => [a.slug, i]));

export function coverVariant(slug: string): number {
  return variantBySlug.get(slug) ?? 0;
}

const bySlug = new Map(registry.map((a) => [a.slug, a]));

export function getArticle(slug: string): Article | undefined {
  return bySlug.get(slug);
}

/**
 * Resolves `related` slugs to articles, dropping anything unresolvable.
 *
 * Cross-links are hand-written slugs, which is exactly the kind of reference
 * that rots the first time a piece is renamed. Rather than render a link to a
 * 404, drop it and top the list up with other articles so the section is never
 * empty. `assertRegistryIntegrity` below turns the same mistake into a build
 * failure, so this is the second line of defence, not the first.
 */
export function relatedArticles(article: Article, limit = 3): Article[] {
  const picked: Article[] = [];

  for (const slug of article.related) {
    const found = bySlug.get(slug);
    if (found && found.slug !== article.slug) picked.push(found);
    if (picked.length >= limit) return picked;
  }

  for (const candidate of registry) {
    if (picked.length >= limit) break;
    if (candidate.slug === article.slug) continue;
    if (picked.some((p) => p.slug === candidate.slug)) continue;
    picked.push(candidate);
  }

  return picked;
}

/**
 * Catches duplicate slugs, dangling cross-links and duplicate heading ids at
 * module load, which under Next means at build time. A duplicated heading id
 * silently breaks the table of contents — every link jumps to the first match —
 * and that is precisely the sort of defect nobody notices by reading.
 */
function assertRegistryIntegrity(): void {
  const seen = new Set<string>();
  for (const article of registry) {
    if (seen.has(article.slug)) {
      throw new Error(`Duplicate article slug: ${article.slug}`);
    }
    seen.add(article.slug);

    const headingIds = new Set<string>();
    for (const block of article.blocks) {
      if (block.type !== "h2") continue;
      if (headingIds.has(block.id)) {
        throw new Error(`Duplicate heading id "${block.id}" in article ${article.slug}`);
      }
      headingIds.add(block.id);
    }
  }

  for (const article of registry) {
    for (const slug of article.related) {
      if (!seen.has(slug)) {
        throw new Error(`Article ${article.slug} links to unknown related slug: ${slug}`);
      }
    }
  }
}

assertRegistryIntegrity();

export * from "./types";

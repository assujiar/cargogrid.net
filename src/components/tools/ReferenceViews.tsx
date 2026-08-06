"use client";

import React from "react";
import { CONTAINER_SPECS, payloadKg, practicalCbm } from "../../content/reference/containers";
import { INCOTERMS, INCOTERMS_2020_CHANGES } from "../../content/reference/incoterms";
import {
  BODY_CAPACITY_LOGIC,
  DIMENSION_RULES,
  FERRY_CLASSES,
  ROAD_CLASSES,
  TOLL_CLASSES,
  VEHICLE_CATEGORIES,
  WEIGHT_CONCEPTS,
} from "../../content/reference/regulations";
import { formatNumber } from "../../lib/logistics/volume";
import { useLanguage } from "../shared/LanguageProvider";

/**
 * Halaman referensi statis.
 *
 * Was a pure server component -- no client JavaScript at all -- until the
 * ID/EN toggle needed to reach it. Every table here is still fully present
 * in the initial render regardless of language, just switched between two
 * already-translated strings rather than fetched or computed, so the cost
 * of that trade is one hydration step, not a page that goes blank while
 * JavaScript loads.
 *
 * Setiap tabel duduk di dalam pembungkus `overflow-x-auto` sendiri. Tabel-tabel
 * ini lebar secara alamiah dan sebagian besar pengunjungnya datang dari
 * ponsel, jadi pilihannya antara tabel yang menggeser di dalam kotaknya sendiri
 * atau badan halaman yang menggeser ke samping. Hanya yang pertama yang bisa
 * dipakai.
 */

/** Only two values ever occur in the source data, so a lookup replaces a stored field on every Incoterm row. */
const CLEARANCE_LABELS: Record<"Penjual" | "Pembeli", { id: string; en: string }> = {
  Penjual: { id: "Penjual", en: "Seller" },
  Pembeli: { id: "Pembeli", en: "Buyer" },
};

/** Same reasoning as CLEARANCE_LABELS: four fixed Indonesian words, translated at render time. */
const VOLUME_RELEVANCE_LABELS: Record<"Tinggi" | "Sedang" | "Rendah" | "Tidak relevan", { id: string; en: string }> = {
  Tinggi: { id: "Tinggi", en: "High" },
  Sedang: { id: "Sedang", en: "Medium" },
  Rendah: { id: "Rendah", en: "Low" },
  "Tidak relevan": { id: "Tidak relevan", en: "Not relevant" },
};

function TableWrap({ children, caption, minWidth = 720 }: { children: React.ReactNode; caption: string; minWidth?: number }) {
  return (
    <figure className="nm-emboss overflow-hidden rounded-3xl bg-[#eef2f6]/60">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]" style={{ minWidth }}>
          {children}
        </table>
      </div>
      <figcaption className="border-t border-slate-300/40 px-6 py-4 text-[11px] leading-[1.6] text-slate-500">
        {caption}
      </figcaption>
    </figure>
  );
}

const TH = "px-4 py-3 font-mono text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 whitespace-nowrap";
const TD = "px-4 py-3 align-top text-slate-700";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
      {children}
      <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
    </h2>
  );
}

export function ContainerTable() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="flex flex-col gap-6">
      <TableWrap
        caption={
          isEn
            ? "Dimensions and capacity follow the equipment specification published by the carrier. Tare weight varies between units; for reefer, open top, and flat rack, carriers do not publish it uniformly at all. The binding weight figure is always the one printed on the CSC plate on the door of the unit allocated to you."
            : "Dimensi dan kapasitas mengikuti spesifikasi equipment yang diterbitkan operator pelayaran. Berat kosong berbeda antar unit; untuk reefer, open top, dan flat rack operatornya memang tidak menerbitkannya secara seragam. Angka berat yang mengikat selalu yang tertera pada pelat CSC di daun pintu unit yang dialokasikan ke Anda."
        }
      >
        <thead>
          <tr className="border-b border-slate-300/50">
            <th scope="col" className={TH}>{isEn ? "Type" : "Tipe"}</th>
            <th scope="col" className={TH}>{isEn ? "ISO code" : "Kode ISO"}</th>
            <th scope="col" className={TH}>{isEn ? "Inner dimensions (m)" : "Dimensi dalam (m)"}</th>
            <th scope="col" className={TH}>{isEn ? "Door aperture (m)" : "Bukaan pintu (m)"}</th>
            <th scope="col" className={TH}>{isEn ? "Cube" : "Kubikasi"}</th>
            <th scope="col" className={TH}>{isEn ? "Realistic 85%" : "Realistis 85%"}</th>
            <th scope="col" className={TH}>{isEn ? "Tare" : "Berat kosong"}</th>
            <th scope="col" className={TH}>Payload</th>
          </tr>
        </thead>
        <tbody>
          {CONTAINER_SPECS.map((spec) => (
            <tr key={spec.id} className="border-b border-slate-300/30 last:border-0">
              <th scope="row" className={`${TD} font-display font-bold text-slate-900`}>{spec.name}</th>
              <td className={`${TD} font-mono text-[11px]`}>{spec.isoCode}</td>
              <td className={`${TD} whitespace-nowrap font-mono text-[11px]`}>
                {formatNumber(spec.inner.length, 3)} × {formatNumber(spec.inner.width, 3)} × {formatNumber(spec.inner.height, 3)}
              </td>
              <td className={`${TD} whitespace-nowrap font-mono text-[11px]`}>
                {spec.door ? `${spec.door.width} × ${spec.door.height}` : isEn ? "Loaded from top/side" : "Muat dari atas/samping"}
              </td>
              <td className={`${TD} whitespace-nowrap font-semibold`}>
                {spec.volumeIsPlanningBasis ? (
                  `${formatNumber(spec.capacityCbm, 1)} m³`
                ) : (
                  <span className="text-slate-400">{isEn ? "Not a planning basis" : "Bukan dasar rencana"}</span>
                )}
              </td>
              <td className={`${TD} whitespace-nowrap`}>
                {spec.volumeIsPlanningBasis ? (
                  `${formatNumber(practicalCbm(spec), 1)} m³`
                ) : (
                  <span className="text-slate-400">{isEn ? "Use footprint and height" : "Pakai tapak dan tinggi"}</span>
                )}
              </td>
              <td className={`${TD} whitespace-nowrap`}>
                {spec.tareKg === null ? (
                  <span className="text-slate-400">{isEn ? "Per unit" : "Per unit"}</span>
                ) : (
                  `${formatNumber(spec.tareKg)} kg`
                )}
              </td>
              <td className={`${TD} whitespace-nowrap font-semibold text-slate-900`}>{formatNumber(payloadKg(spec))} kg</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONTAINER_SPECS.map((spec) => (
          <div key={spec.id} className="nm-deboss rounded-2xl p-5">
            <p className="font-display text-sm font-bold text-slate-900">{spec.name}</p>
            <p className="mt-3 text-[12px] leading-[1.7] text-slate-600">
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal">
                {isEn ? "Used for" : "Dipakai untuk"}
              </span>
              <br />
              {isEn ? spec.useForEn : spec.useFor}
            </p>
            <p className="mt-3 text-[12px] leading-[1.7] text-slate-600">
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-orange">
                {isEn ? "What to check" : "Yang perlu diperiksa"}
              </span>
              <br />
              {isEn ? spec.cautionEn : spec.caution}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegulationsView() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="flex flex-col gap-12">
      <div>
        <SectionHeading>{isEn ? "Vehicle dimension limits" : "Batas dimensi kendaraan"}</SectionHeading>
        <TableWrap
          caption={
            isEn
              ? "Basis: PP 55/2012. The height limit carries two conditions at once, and whichever is lower governs -- a narrow-bodied truck therefore has a height limit below 4.2 metres."
              : "Dasar: PP 55/2012. Batas tinggi punya dua syarat sekaligus, dan yang berlaku adalah yang lebih rendah, truk berbadan sempit karena itu punya batas tinggi di bawah 4,2 meter."
          }
        >
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>{isEn ? "Topic" : "Hal"}</th>
              <th scope="col" className={TH}>Parameter</th>
              <th scope="col" className={TH}>{isEn ? "Rule" : "Ketentuan"}</th>
              <th scope="col" className={TH}>{isEn ? "Basis" : "Dasar"}</th>
            </tr>
          </thead>
          <tbody>
            {DIMENSION_RULES.map((rule) => (
              <tr key={rule.parameter} className="border-b border-slate-300/30 last:border-0">
                <td className={`${TD} whitespace-nowrap font-semibold`}>{isEn ? rule.topicEn : rule.topic}</td>
                <th scope="row" className={`${TD} font-display font-bold text-slate-900`}>{isEn ? rule.parameterEn : rule.parameter}</th>
                <td className={`${TD} min-w-[320px] leading-[1.7]`}>{isEn ? rule.ruleEn : rule.rule}</td>
                <td className={`${TD} whitespace-nowrap font-mono text-[11px] text-slate-500`}>{rule.basis}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div>
        <SectionHeading>{isEn ? "Road classes" : "Kelas jalan"}</SectionHeading>
        <TableWrap
          caption={
            isEn
              ? "This is why the same truck can be legal on one route and in violation on another: the constraint is the road, not the truck. MST is the maximum single-axle load, and it caps weight per axle, not total weight."
              : "Inilah sebabnya truk yang sama bisa sah di satu rute dan melanggar di rute lain: yang membatasi adalah jalannya, bukan truknya. MST adalah muatan sumbu terberat, dan ia membatasi berat per sumbu, bukan berat total."
          }
        >
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>{isEn ? "Class" : "Kelas"}</th>
              <th scope="col" className={TH}>{isEn ? "Max width" : "Lebar maks"}</th>
              <th scope="col" className={TH}>{isEn ? "Max length" : "Panjang maks"}</th>
              <th scope="col" className={TH}>{isEn ? "Max height" : "Tinggi maks"}</th>
              <th scope="col" className={TH}>MST</th>
              <th scope="col" className={TH}>{isEn ? "Note" : "Catatan"}</th>
            </tr>
          </thead>
          <tbody>
            {ROAD_CLASSES.map((rc) => (
              <tr key={rc.code} className="border-b border-slate-300/30 last:border-0">
                <th scope="row" className={`${TD} whitespace-nowrap font-display font-bold text-slate-900`}>{isEn ? rc.codeEn : rc.code}</th>
                <td className={`${TD} whitespace-nowrap`}>
                  {rc.maxWidthM === null ? <span className="text-slate-400">{isEn ? "Per permit" : "Per izin"}</span> : `${formatNumber(rc.maxWidthM, 1)} m`}
                </td>
                <td className={`${TD} whitespace-nowrap`}>
                  {rc.maxLengthM === null ? <span className="text-slate-400">{isEn ? "Per permit" : "Per izin"}</span> : `${formatNumber(rc.maxLengthM, 1)} m`}
                </td>
                <td className={`${TD} whitespace-nowrap`}>
                  {rc.maxHeightM === null ? <span className="text-slate-400">{isEn ? "Per permit" : "Per izin"}</span> : `${formatNumber(rc.maxHeightM, 1)} m`}
                </td>
                <td className={`${TD} whitespace-nowrap font-semibold text-slate-900`}>
                  {rc.mstTon === null ? (
                    <span className="font-normal text-slate-400">{isEn ? "Per permit" : "Per izin"}</span>
                  ) : (
                    `${formatNumber(rc.mstTon, 1)} ${isEn ? "tonnes" : "ton"}`
                  )}
                </td>
                <td className={`${TD} min-w-[300px] leading-[1.7]`}>{isEn ? rc.noteEn : rc.note}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div>
        <SectionHeading>{isEn ? "Toll class" : "Golongan tol"}</SectionHeading>
        <TableWrap
          caption={
            isEn
              ? "Basis: Kepmen PUPR 176/KPTS/M/2025. The class determines which tariff group a vehicle falls into, not the tariff amount itself -- tariffs differ per toll segment and per effective date."
              : "Dasar: Kepmen PUPR 176/KPTS/M/2025. Golongan menentukan kelompok tarif, bukan besaran tarifnya, tarif berbeda per ruas jalan dan per tanggal berlaku."
          }
        >
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>{isEn ? "Class" : "Golongan"}</th>
              <th scope="col" className={TH}>{isEn ? "Vehicle" : "Kendaraan"}</th>
              <th scope="col" className={TH}>{isEn ? "Classification basis" : "Dasar penggolongan"}</th>
              <th scope="col" className={TH}>{isEn ? "Note" : "Catatan"}</th>
            </tr>
          </thead>
          <tbody>
            {TOLL_CLASSES.map((tc) => (
              <tr key={tc.golongan} className="border-b border-slate-300/30 last:border-0">
                <th scope="row" className={`${TD} whitespace-nowrap font-display font-bold text-slate-900`}>{isEn ? tc.golonganEn : tc.golongan}</th>
                <td className={`${TD} min-w-[220px] leading-[1.7]`}>{isEn ? tc.descriptionEn : tc.description}</td>
                <td className={`${TD} min-w-[200px] leading-[1.7]`}>{isEn ? tc.ruleEn : tc.rule}</td>
                <td className={`${TD} min-w-[280px] leading-[1.7]`}>{isEn ? tc.noteEn : tc.note}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div>
        <SectionHeading>{isEn ? "Ferry class" : "Golongan penyeberangan"}</SectionHeading>
        <TableWrap
          caption={
            isEn
              ? "The logic is completely different from toll class: ferry classification runs on overall length and vehicle function, not axle count. A long two-axle truck can land in a higher class than a short three-axle one."
              : "Logikanya berbeda dari golongan tol: penyeberangan menggolongkan berdasarkan panjang keseluruhan dan fungsi kendaraan, bukan jumlah gandar. Truk bergandar dua yang panjang bisa masuk golongan lebih tinggi daripada truk bergandar tiga yang pendek."
          }
        >
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>{isEn ? "Class" : "Golongan"}</th>
              <th scope="col" className={TH}>{isEn ? "Vehicle type" : "Jenis kendaraan"}</th>
              <th scope="col" className={TH}>{isEn ? "Length band" : "Rentang panjang"}</th>
              <th scope="col" className={TH}>{isEn ? "Note" : "Catatan"}</th>
            </tr>
          </thead>
          <tbody>
            {FERRY_CLASSES.map((fc) => (
              <tr key={fc.golongan} className="border-b border-slate-300/30 last:border-0">
                <th scope="row" className={`${TD} whitespace-nowrap font-display font-bold text-slate-900`}>{isEn ? fc.golonganEn : fc.golongan}</th>
                <td className={`${TD} min-w-[240px] leading-[1.7]`}>{isEn ? fc.vehicleTypeEn : fc.vehicleType}</td>
                <td className={`${TD} whitespace-nowrap font-semibold`}>{isEn ? fc.lengthBandEn : fc.lengthBand}</td>
                <td className={`${TD} min-w-[260px] leading-[1.7]`}>{isEn ? fc.noteEn : fc.note}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div>
        <SectionHeading>{isEn ? "Vehicle category and weight concepts" : "Kategori kendaraan dan konsep berat"}</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...VEHICLE_CATEGORIES, ...WEIGHT_CONCEPTS].map((rule) => (
            <div key={`${rule.topic}-${rule.parameter}`} className="nm-deboss rounded-2xl p-5">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal">{isEn ? rule.topicEn : rule.topic}</p>
              <p className="mt-1.5 font-display text-sm font-bold text-slate-900">{isEn ? rule.parameterEn : rule.parameter}</p>
              <p className="mt-2 text-[12px] leading-[1.7] text-slate-600">{isEn ? rule.ruleEn : rule.rule}</p>
              <p className="mt-2 font-mono text-[10px] text-slate-400">{rule.basis}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>{isEn ? "The right capacity unit per body type" : "Satuan kapasitas yang benar per jenis bodi"}</SectionHeading>
        <TableWrap
          minWidth={880}
          caption={
            isEn
              ? "Not every vehicle deserves to be stated in cubic metres. Tankers are measured in litres and liquid density, flatbeds in loading metres and point loads, car carriers in unit count. Giving those bodies an m³ figure isn't just useless; it teaches the wrong unit."
              : "Tidak setiap kendaraan pantas dinyatakan dalam meter kubik. Tangki diukur dengan liter dan kerapatan cairan, flatbed dengan loading meter dan titik beban, car carrier dengan jumlah unit. Memberi angka m³ untuk bodi-bodi itu bukan sekadar tidak berguna; ia mengajarkan satuan yang salah."
          }
        >
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>{isEn ? "Body type" : "Jenis bodi"}</th>
              <th scope="col" className={TH}>{isEn ? "How to calculate" : "Cara menghitung"}</th>
              <th scope="col" className={TH}>{isEn ? "Unit" : "Satuan"}</th>
              <th scope="col" className={TH}>{isEn ? "Typical cargo" : "Muatan khas"}</th>
              <th scope="col" className={TH}>{isEn ? "Volume relevance" : "Relevansi volume"}</th>
              <th scope="col" className={TH}>{isEn ? "What determines it" : "Yang menentukan"}</th>
            </tr>
          </thead>
          <tbody>
            {BODY_CAPACITY_LOGIC.map((body) => (
              <tr key={body.body} className="border-b border-slate-300/30 last:border-0">
                <th scope="row" className={`${TD} whitespace-nowrap font-display font-bold text-slate-900`}>{isEn ? body.bodyEn : body.body}</th>
                <td className={`${TD} min-w-[220px] leading-[1.7]`}>{isEn ? body.formulaEn : body.formula}</td>
                <td className={`${TD} whitespace-nowrap font-mono text-[11px]`}>{isEn ? body.unitEn : body.unit}</td>
                <td className={`${TD} min-w-[180px] leading-[1.7]`}>{isEn ? body.cargoEn : body.cargo}</td>
                <td className={`${TD} whitespace-nowrap font-semibold`}>
                  {isEn ? VOLUME_RELEVANCE_LABELS[body.volumeRelevance].en : VOLUME_RELEVANCE_LABELS[body.volumeRelevance].id}
                </td>
                <td className={`${TD} min-w-[220px] leading-[1.7]`}>{isEn ? body.variablesEn : body.variables}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>
    </div>
  );
}

export function IncotermsTable() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const groups = [
    {
      mode: "semua-moda" as const,
      label: isEn ? "Applies to every transport mode" : "Berlaku untuk semua moda angkutan",
    },
    {
      mode: "laut" as const,
      label: isEn ? "Sea and inland waterway transport only" : "Khusus angkutan laut dan perairan darat",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <div key={group.mode}>
          <SectionHeading>{group.label}</SectionHeading>

          <TableWrap
            caption={
              isEn
                ? "Notice that the point risk transfers and the point cost transfers are often in different places. That is the source of most disputes, not the amount of the cost."
                : "Perhatikan bahwa titik pindah risiko dan titik pindah biaya sering berada di tempat berbeda. Itulah sumber sebagian besar sengketa, bukan besaran biayanya."
            }
          >
            <thead>
              <tr className="border-b border-slate-300/50">
                <th scope="col" className={TH}>{isEn ? "Rule" : "Aturan"}</th>
                <th scope="col" className={TH}>{isEn ? "Risk transfers at" : "Risiko pindah di"}</th>
                <th scope="col" className={TH}>{isEn ? "Seller's cost runs to" : "Biaya penjual sampai"}</th>
                <th scope="col" className={TH}>{isEn ? "Export" : "Ekspor"}</th>
                <th scope="col" className={TH}>{isEn ? "Import" : "Impor"}</th>
                <th scope="col" className={TH}>{isEn ? "Insurance" : "Asuransi"}</th>
              </tr>
            </thead>
            <tbody>
              {INCOTERMS.filter((term) => term.mode === group.mode).map((term) => (
                <tr key={term.code} className="border-b border-slate-300/30 last:border-0">
                  <th scope="row" className={`${TD} whitespace-nowrap`}>
                    <span className="font-display text-sm font-black text-slate-900">{term.code}</span>
                    <span className="mt-0.5 block font-sans text-[11px] font-normal text-slate-500">{term.name}</span>
                  </th>
                  <td className={`${TD} min-w-[200px] text-[12px] leading-[1.7]`}>{isEn ? term.riskTransferEn : term.riskTransfer}</td>
                  <td className={`${TD} min-w-[180px] text-[12px] leading-[1.7]`}>{isEn ? term.costTransferEn : term.costTransfer}</td>
                  <td className={`${TD} whitespace-nowrap text-[12px]`}>
                    {isEn ? CLEARANCE_LABELS[term.exportClearance].en : CLEARANCE_LABELS[term.exportClearance].id}
                  </td>
                  <td className={`${TD} whitespace-nowrap text-[12px]`}>
                    {isEn ? CLEARANCE_LABELS[term.importClearance].en : CLEARANCE_LABELS[term.importClearance].id}
                  </td>
                  <td className={`${TD} min-w-[200px] text-[12px] leading-[1.7]`}>{isEn ? term.insuranceEn : term.insurance}</td>
                </tr>
              ))}
            </tbody>
          </TableWrap>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {INCOTERMS.filter((term) => term.mode === group.mode).map((term) => (
              <div key={term.code} className="nm-deboss rounded-2xl p-5">
                <p className="font-display text-sm font-bold text-slate-900">
                  {term.code}, {isEn ? term.name : term.nameId}
                </p>
                <p className="mt-3 text-[12px] leading-[1.7] text-slate-600">
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal">
                    {isEn ? "Best for" : "Tepat untuk"}
                  </span>
                  <br />
                  {isEn ? term.bestForEn : term.bestFor}
                </p>
                <p className="mt-3 text-[12px] leading-[1.7] text-slate-600">
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-orange">
                    {isEn ? "Common mistake" : "Yang sering keliru"}
                  </span>
                  <br />
                  {isEn ? term.watchOutEn : term.watchOut}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <SectionHeading>{isEn ? "What changed from the 2010 edition" : "Yang berubah dari edisi 2010"}</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          {INCOTERMS_2020_CHANGES.map((change) => (
            <div key={change.title} className="nm-deboss rounded-2xl p-5">
              <p className="font-display text-sm font-bold text-slate-900">{isEn ? change.titleEn : change.title}</p>
              <p className="mt-2 text-[12px] leading-[1.7] text-slate-600">{isEn ? change.bodyEn : change.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

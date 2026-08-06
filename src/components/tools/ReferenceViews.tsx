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

/**
 * Halaman referensi statis.
 *
 * Server component tanpa satu baris pun JavaScript sisi klien -- isinya data
 * murni, dan tabel rujukan yang harus menunggu hidrasi sebelum bisa dibaca
 * gagal pada satu-satunya tugas yang dimilikinya.
 *
 * Setiap tabel duduk di dalam pembungkus `overflow-x-auto` sendiri. Tabel-tabel
 * ini lebar secara alamiah dan sebagian besar pengunjungnya datang dari
 * ponsel, jadi pilihannya antara tabel yang menggeser di dalam kotaknya sendiri
 * atau badan halaman yang menggeser ke samping. Hanya yang pertama yang bisa
 * dipakai.
 */

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
  return (
    <div className="flex flex-col gap-6">
      <TableWrap caption="Dimensi dan kapasitas mengikuti spesifikasi equipment yang diterbitkan operator pelayaran. Berat kosong berbeda antar unit; untuk reefer, open top, dan flat rack operatornya memang tidak menerbitkannya secara seragam. Angka berat yang mengikat selalu yang tertera pada pelat CSC di daun pintu unit yang dialokasikan ke Anda.">
        <thead>
          <tr className="border-b border-slate-300/50">
            <th scope="col" className={TH}>Tipe</th>
            <th scope="col" className={TH}>Kode ISO</th>
            <th scope="col" className={TH}>Dimensi dalam (m)</th>
            <th scope="col" className={TH}>Bukaan pintu (m)</th>
            <th scope="col" className={TH}>Kubikasi</th>
            <th scope="col" className={TH}>Realistis 85%</th>
            <th scope="col" className={TH}>Berat kosong</th>
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
                {spec.door ? `${spec.door.width} × ${spec.door.height}` : "Muat dari atas/samping"}
              </td>
              <td className={`${TD} whitespace-nowrap font-semibold`}>
                {spec.volumeIsPlanningBasis ? `${formatNumber(spec.capacityCbm, 1)} m³` : <span className="text-slate-400">Bukan dasar rencana</span>}
              </td>
              <td className={`${TD} whitespace-nowrap`}>
                {spec.volumeIsPlanningBasis ? `${formatNumber(practicalCbm(spec), 1)} m³` : <span className="text-slate-400">Pakai tapak dan tinggi</span>}
              </td>
              <td className={`${TD} whitespace-nowrap`}>
                {spec.tareKg === null ? <span className="text-slate-400">Per unit</span> : `${formatNumber(spec.tareKg)} kg`}
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
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal">Dipakai untuk</span>
              <br />
              {spec.useFor}
            </p>
            <p className="mt-3 text-[12px] leading-[1.7] text-slate-600">
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-orange">Yang perlu diperiksa</span>
              <br />
              {spec.caution}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegulationsView() {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <SectionHeading>Batas dimensi kendaraan</SectionHeading>
        <TableWrap caption="Dasar: PP 55/2012. Batas tinggi punya dua syarat sekaligus, dan yang berlaku adalah yang lebih rendah, truk berbadan sempit karena itu punya batas tinggi di bawah 4,2 meter.">
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>Hal</th>
              <th scope="col" className={TH}>Parameter</th>
              <th scope="col" className={TH}>Ketentuan</th>
              <th scope="col" className={TH}>Dasar</th>
            </tr>
          </thead>
          <tbody>
            {DIMENSION_RULES.map((rule) => (
              <tr key={rule.parameter} className="border-b border-slate-300/30 last:border-0">
                <td className={`${TD} whitespace-nowrap font-semibold`}>{rule.topic}</td>
                <th scope="row" className={`${TD} font-display font-bold text-slate-900`}>{rule.parameter}</th>
                <td className={`${TD} min-w-[320px] leading-[1.7]`}>{rule.rule}</td>
                <td className={`${TD} whitespace-nowrap font-mono text-[11px] text-slate-500`}>{rule.basis}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div>
        <SectionHeading>Kelas jalan</SectionHeading>
        <TableWrap caption="Inilah sebabnya truk yang sama bisa sah di satu rute dan melanggar di rute lain: yang membatasi adalah jalannya, bukan truknya. MST adalah muatan sumbu terberat, dan ia membatasi berat per sumbu, bukan berat total.">
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>Kelas</th>
              <th scope="col" className={TH}>Lebar maks</th>
              <th scope="col" className={TH}>Panjang maks</th>
              <th scope="col" className={TH}>Tinggi maks</th>
              <th scope="col" className={TH}>MST</th>
              <th scope="col" className={TH}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {ROAD_CLASSES.map((rc) => (
              <tr key={rc.code} className="border-b border-slate-300/30 last:border-0">
                <th scope="row" className={`${TD} whitespace-nowrap font-display font-bold text-slate-900`}>{rc.code}</th>
                <td className={`${TD} whitespace-nowrap`}>{rc.maxWidthM === null ? <span className="text-slate-400">Per izin</span> : `${formatNumber(rc.maxWidthM, 1)} m`}</td>
                <td className={`${TD} whitespace-nowrap`}>{rc.maxLengthM === null ? <span className="text-slate-400">Per izin</span> : `${formatNumber(rc.maxLengthM, 1)} m`}</td>
                <td className={`${TD} whitespace-nowrap`}>{rc.maxHeightM === null ? <span className="text-slate-400">Per izin</span> : `${formatNumber(rc.maxHeightM, 1)} m`}</td>
                <td className={`${TD} whitespace-nowrap font-semibold text-slate-900`}>{rc.mstTon === null ? <span className="font-normal text-slate-400">Per izin</span> : `${formatNumber(rc.mstTon, 1)} ton`}</td>
                <td className={`${TD} min-w-[300px] leading-[1.7]`}>{rc.note}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div>
        <SectionHeading>Golongan tol</SectionHeading>
        <TableWrap caption="Dasar: Kepmen PUPR 176/KPTS/M/2025. Golongan menentukan kelompok tarif, bukan besaran tarifnya, tarif berbeda per ruas jalan dan per tanggal berlaku.">
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>Golongan</th>
              <th scope="col" className={TH}>Kendaraan</th>
              <th scope="col" className={TH}>Dasar penggolongan</th>
              <th scope="col" className={TH}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {TOLL_CLASSES.map((tc) => (
              <tr key={tc.golongan} className="border-b border-slate-300/30 last:border-0">
                <th scope="row" className={`${TD} whitespace-nowrap font-display font-bold text-slate-900`}>{tc.golongan}</th>
                <td className={`${TD} min-w-[220px] leading-[1.7]`}>{tc.description}</td>
                <td className={`${TD} min-w-[200px] leading-[1.7]`}>{tc.rule}</td>
                <td className={`${TD} min-w-[280px] leading-[1.7]`}>{tc.note}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div>
        <SectionHeading>Golongan penyeberangan</SectionHeading>
        <TableWrap caption="Logikanya berbeda dari golongan tol: penyeberangan menggolongkan berdasarkan panjang keseluruhan dan fungsi kendaraan, bukan jumlah gandar. Truk bergandar dua yang panjang bisa masuk golongan lebih tinggi daripada truk bergandar tiga yang pendek.">
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>Golongan</th>
              <th scope="col" className={TH}>Jenis kendaraan</th>
              <th scope="col" className={TH}>Rentang panjang</th>
              <th scope="col" className={TH}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {FERRY_CLASSES.map((fc) => (
              <tr key={fc.golongan} className="border-b border-slate-300/30 last:border-0">
                <th scope="row" className={`${TD} whitespace-nowrap font-display font-bold text-slate-900`}>{fc.golongan}</th>
                <td className={`${TD} min-w-[240px] leading-[1.7]`}>{fc.vehicleType}</td>
                <td className={`${TD} whitespace-nowrap font-semibold`}>{fc.lengthBand}</td>
                <td className={`${TD} min-w-[260px] leading-[1.7]`}>{fc.note}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>

      <div>
        <SectionHeading>Kategori kendaraan dan konsep berat</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...VEHICLE_CATEGORIES, ...WEIGHT_CONCEPTS].map((rule) => (
            <div key={`${rule.topic}-${rule.parameter}`} className="nm-deboss rounded-2xl p-5">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal">{rule.topic}</p>
              <p className="mt-1.5 font-display text-sm font-bold text-slate-900">{rule.parameter}</p>
              <p className="mt-2 text-[12px] leading-[1.7] text-slate-600">{rule.rule}</p>
              <p className="mt-2 font-mono text-[10px] text-slate-400">{rule.basis}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>Satuan kapasitas yang benar per jenis bodi</SectionHeading>
        <TableWrap
          minWidth={880}
          caption="Tidak setiap kendaraan pantas dinyatakan dalam meter kubik. Tangki diukur dengan liter dan kerapatan cairan, flatbed dengan loading meter dan titik beban, car carrier dengan jumlah unit. Memberi angka m³ untuk bodi-bodi itu bukan sekadar tidak berguna; ia mengajarkan satuan yang salah."
        >
          <thead>
            <tr className="border-b border-slate-300/50">
              <th scope="col" className={TH}>Jenis bodi</th>
              <th scope="col" className={TH}>Cara menghitung</th>
              <th scope="col" className={TH}>Satuan</th>
              <th scope="col" className={TH}>Muatan khas</th>
              <th scope="col" className={TH}>Relevansi volume</th>
              <th scope="col" className={TH}>Yang menentukan</th>
            </tr>
          </thead>
          <tbody>
            {BODY_CAPACITY_LOGIC.map((body) => (
              <tr key={body.body} className="border-b border-slate-300/30 last:border-0">
                <th scope="row" className={`${TD} whitespace-nowrap font-display font-bold text-slate-900`}>{body.body}</th>
                <td className={`${TD} min-w-[220px] leading-[1.7]`}>{body.formula}</td>
                <td className={`${TD} whitespace-nowrap font-mono text-[11px]`}>{body.unit}</td>
                <td className={`${TD} min-w-[180px] leading-[1.7]`}>{body.cargo}</td>
                <td className={`${TD} whitespace-nowrap font-semibold`}>{body.volumeRelevance}</td>
                <td className={`${TD} min-w-[220px] leading-[1.7]`}>{body.variables}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>
    </div>
  );
}

export function IncotermsTable() {
  const groups = [
    { mode: "semua-moda" as const, label: "Berlaku untuk semua moda angkutan" },
    { mode: "laut" as const, label: "Khusus angkutan laut dan perairan darat" },
  ];

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <div key={group.mode}>
          <SectionHeading>{group.label}</SectionHeading>

          <TableWrap caption="Perhatikan bahwa titik pindah risiko dan titik pindah biaya sering berada di tempat berbeda. Itulah sumber sebagian besar sengketa, bukan besaran biayanya.">
            <thead>
              <tr className="border-b border-slate-300/50">
                <th scope="col" className={TH}>Aturan</th>
                <th scope="col" className={TH}>Risiko pindah di</th>
                <th scope="col" className={TH}>Biaya penjual sampai</th>
                <th scope="col" className={TH}>Ekspor</th>
                <th scope="col" className={TH}>Impor</th>
                <th scope="col" className={TH}>Asuransi</th>
              </tr>
            </thead>
            <tbody>
              {INCOTERMS.filter((term) => term.mode === group.mode).map((term) => (
                <tr key={term.code} className="border-b border-slate-300/30 last:border-0">
                  <th scope="row" className={`${TD} whitespace-nowrap`}>
                    <span className="font-display text-sm font-black text-slate-900">{term.code}</span>
                    <span className="mt-0.5 block font-sans text-[11px] font-normal text-slate-500">{term.name}</span>
                  </th>
                  <td className={`${TD} min-w-[200px] text-[12px] leading-[1.7]`}>{term.riskTransfer}</td>
                  <td className={`${TD} min-w-[180px] text-[12px] leading-[1.7]`}>{term.costTransfer}</td>
                  <td className={`${TD} whitespace-nowrap text-[12px]`}>{term.exportClearance}</td>
                  <td className={`${TD} whitespace-nowrap text-[12px]`}>{term.importClearance}</td>
                  <td className={`${TD} min-w-[200px] text-[12px] leading-[1.7]`}>{term.insurance}</td>
                </tr>
              ))}
            </tbody>
          </TableWrap>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {INCOTERMS.filter((term) => term.mode === group.mode).map((term) => (
              <div key={term.code} className="nm-deboss rounded-2xl p-5">
                <p className="font-display text-sm font-bold text-slate-900">
                  {term.code}, {term.nameId}
                </p>
                <p className="mt-3 text-[12px] leading-[1.7] text-slate-600">
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal">Tepat untuk</span>
                  <br />
                  {term.bestFor}
                </p>
                <p className="mt-3 text-[12px] leading-[1.7] text-slate-600">
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-orange">Yang sering keliru</span>
                  <br />
                  {term.watchOut}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <SectionHeading>Yang berubah dari edisi 2010</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          {INCOTERMS_2020_CHANGES.map((change) => (
            <div key={change.title} className="nm-deboss rounded-2xl p-5">
              <p className="font-display text-sm font-bold text-slate-900">{change.title}</p>
              <p className="mt-2 text-[12px] leading-[1.7] text-slate-600">{change.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

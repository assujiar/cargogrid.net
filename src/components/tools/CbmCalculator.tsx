"use client";

import React, { useMemo, useState } from "react";
import { Plus, Trash2, ArrowRightLeft, Box, Package, Ship, Scale, Ruler } from "lucide-react";
import {
  calculateShipment,
  formatNumber,
  VOLUMETRIC_MODES,
  type CargoLine,
  type LengthUnit,
} from "../../lib/logistics/volume";
import { FieldLabel, NumberField, ResultCard, ResultGrid, SelectField, ToolPanel } from "./controls";
import { useLanguage } from "../shared/LanguageProvider";

const UNITS: { value: LengthUnit; label: string; labelEn: string }[] = [
  { value: "cm", label: "sentimeter (cm)", labelEn: "centimeter (cm)" },
  { value: "m", label: "meter (m)", labelEn: "meter (m)" },
  { value: "mm", label: "milimeter (mm)", labelEn: "millimeter (mm)" },
  { value: "in", label: "inci", labelEn: "inch" },
];

const TIPS = {
  length: "Panjang sisi terpanjang kardus bagian luar. Ukur kemasannya, bukan barang di dalamnya.",
  width: "Lebar kardus bagian luar. Kalau barang dipaletkan, ukur sampai sisi terluar palet.",
  height:
    "Tinggi kardus bagian luar. Untuk barang berpalet, tambahkan tinggi paletnya karena ikut ditagih.",
  unit: "Satuan untuk ketiga ukuran di atas. Salah satuan adalah penyebab hasil meleset yang paling sering terjadi.",
  quantity: "Berapa banyak kardus berukuran sama ini yang dikirim. Kalau ukurannya berbeda, tambahkan baris baru.",
  weight: "Berat satu kardus sesuai timbangan, sudah termasuk kemasannya. Bukan berat total kiriman.",
  mode: "Menentukan angka penukar volume ke berat. Laut, udara, dan kurir memakai angka yang jauh berbeda.",
} as const;

const TIPS_EN = {
  length: "The longest outer side of the box. Measure the packaging, not the item inside it.",
  width: "The outer width of the box. If the goods are palletized, measure to the outer edge of the pallet.",
  height: "The outer height of the box. For palletized goods, add the pallet's height since it gets billed too.",
  unit: "The unit for the three dimensions above. A wrong unit is the most common cause of a wildly off result.",
  quantity: "How many boxes of this same size are being shipped. If sizes differ, add a new row.",
  weight: "The weight of one box as it comes off the scale, packaging included. Not the total shipment weight.",
  mode: "Sets the volume-to-weight conversion factor. Sea, air, and courier modes use very different figures.",
} as const;

interface Row extends CargoLine {
  id: number;
}

const BLANK: Omit<Row, "id"> = {
  dims: { length: 100, width: 50, height: 40, unit: "cm" },
  quantity: 10,
  weightPerPiece: 15,
};

let nextId = 1;

export default function CbmCalculator() {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const [rows, setRows] = useState<Row[]>([{ ...BLANK, id: 0 }]);
  const [modeId, setModeId] = useState(VOLUMETRIC_MODES[0].id);

  const mode = VOLUMETRIC_MODES.find((m) => m.id === modeId) || VOLUMETRIC_MODES[0];
  const result = useMemo(() => calculateShipment(rows, mode), [rows, mode]);

  function update(id: number, patch: Partial<Row>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function updateDims(id: number, patch: Partial<Row["dims"]>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, dims: { ...row.dims, ...patch } } : row)),
    );
  }

  return (
    <ToolPanel>
      <div className="flex flex-col gap-5">
        {rows.map((row, index) => (
          <div key={row.id} className="nm-deboss rounded-2xl p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                <Box className="h-3.5 w-3.5 flex-shrink-0 text-brand-teal" aria-hidden="true" />
                <span className="truncate">{isEn ? `Packaging type ${index + 1}` : `Jenis kemasan ${index + 1}`}</span>
              </span>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => setRows((current) => current.filter((r) => r.id !== row.id))}
                  className="inline-flex min-h-[2.25rem] flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                  aria-label={isEn ? `Remove packaging type ${index + 1}` : `Hapus jenis kemasan ${index + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{isEn ? "Remove" : "Hapus"}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumberField label={isEn ? "Length" : "Panjang"} suffix={row.dims.unit} value={row.dims.length} onChange={(v) => updateDims(row.id, { length: v })} min={0} step={0.1} tip={isEn ? TIPS_EN.length : TIPS.length} />
              <NumberField label={isEn ? "Width" : "Lebar"} suffix={row.dims.unit} value={row.dims.width} onChange={(v) => updateDims(row.id, { width: v })} min={0} step={0.1} tip={isEn ? TIPS_EN.width : TIPS.width} />
              <NumberField label={isEn ? "Height" : "Tinggi"} suffix={row.dims.unit} value={row.dims.height} onChange={(v) => updateDims(row.id, { height: v })} min={0} step={0.1} tip={isEn ? TIPS_EN.height : TIPS.height} />
              <SelectField
                label={isEn ? "Unit" : "Satuan ukuran"}
                value={row.dims.unit}
                onChange={(v) => updateDims(row.id, { unit: v as LengthUnit })}
                tip={isEn ? TIPS_EN.unit : TIPS.unit}
              >
                {UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {isEn ? unit.labelEn : unit.label}
                  </option>
                ))}
              </SelectField>
              <NumberField label={isEn ? "Quantity" : "Jumlah koli"} value={row.quantity} onChange={(v) => update(row.id, { quantity: v })} min={0} step={1} suffix={isEn ? "pcs" : "koli"} tip={isEn ? TIPS_EN.quantity : TIPS.quantity} />
              <NumberField label={isEn ? "Weight per piece" : "Berat per koli"} value={row.weightPerPiece} onChange={(v) => update(row.id, { weightPerPiece: v })} min={0} step={0.1} suffix="kg" tip={isEn ? TIPS_EN.weight : TIPS.weight} />

              <div className="nm-emboss-sm flex items-center gap-3 rounded-xl bg-white/40 px-4 py-3 sm:col-span-2">
                <Ruler className="h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" />
                <p className="min-w-0 text-[12px] leading-[1.6] text-slate-600">
                  {isEn ? (
                    <>
                      {formatNumber(result.lines[index]?.cbmPerPiece ?? 0, 4, isEn)} CBM per piece, total{" "}
                      <strong className="font-bold text-slate-900">
                        {formatNumber(result.lines[index]?.totalCbm ?? 0, 3, isEn)} CBM
                      </strong>{" "}
                      for this row
                    </>
                  ) : (
                    <>
                      {formatNumber(result.lines[index]?.cbmPerPiece ?? 0, 4, isEn)} CBM per koli, total{" "}
                      <strong className="font-bold text-slate-900">
                        {formatNumber(result.lines[index]?.totalCbm ?? 0, 3, isEn)} CBM
                      </strong>{" "}
                      untuk baris ini
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setRows((current) => [...current, { ...BLANK, id: nextId++ }])}
          className="nm-btn inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-extrabold text-slate-700 transition-colors hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal sm:w-fit"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {isEn ? "Add packaging type" : "Tambah jenis kemasan"}
        </button>

        <SelectField
          label={isEn ? "Shipping mode" : "Moda pengiriman"}
          value={modeId}
          onChange={setModeId}
          tip={isEn ? TIPS_EN.mode : TIPS.mode}
          hint={isEn ? mode.noteEn : mode.note}
          className="sm:max-w-md"
        >
          {VOLUMETRIC_MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {isEn ? m.labelEn : m.label}
            </option>
          ))}
        </SelectField>
      </div>

      <ResultGrid>
        <ResultCard
          label="Total volume"
          value={`${formatNumber(result.totalCbm, 3, isEn)} CBM`}
          hint={isEn ? `${formatNumber(result.totalPieces, 0, isEn)} pcs` : `${formatNumber(result.totalPieces, 0, isEn)} koli`}
          icon={<Box className="h-3 w-3" aria-hidden="true" />}
        />
        <ResultCard
          label={isEn ? "Actual weight" : "Berat aktual"}
          value={`${formatNumber(result.totalActualWeight, undefined, isEn)} kg`}
          hint={isEn ? "From the scale" : "Hasil timbangan"}
          icon={<Scale className="h-3 w-3" aria-hidden="true" />}
        />
        <ResultCard
          label={isEn ? "Volumetric weight" : "Berat volumetrik"}
          value={`${formatNumber(result.volumetricWeight, undefined, isEn)} kg`}
          hint={`${formatNumber(mode.kgPerCbm, undefined, isEn)} kg per CBM`}
          icon={<Ship className="h-3 w-3" aria-hidden="true" />}
        />
        <ResultCard
          label="Chargeable weight"
          value={`${formatNumber(result.chargeableWeight, undefined, isEn)} kg`}
          hint={
            isEn
              ? result.basis === "volume"
                ? "Charged by volume"
                : result.basis === "actual"
                  ? "Charged by weight"
                  : "Both are equal"
              : result.basis === "volume"
                ? "Ditagih menurut volume"
                : result.basis === "actual"
                  ? "Ditagih menurut berat"
                  : "Keduanya setara"
          }
          emphasis
          icon={<Package className="h-3 w-3" aria-hidden="true" />}
        />
      </ResultGrid>

      {/* The density read-out is the part that changes behaviour. Knowing the
          chargeable weight tells you this month's bill; knowing which side of
          the break-even you sit on tells you whether repacking would ever pay. */}
      <div className="nm-deboss mt-5 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <ArrowRightLeft className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" />
          <p className="min-w-0 text-[13px] leading-[1.7] text-slate-700">
            {isEn ? (
              <>
                Your cargo density is{" "}
                <strong className="font-bold text-slate-900">{formatNumber(result.densityKgPerCbm, undefined, isEn)} kg/CBM</strong>,
                against a break-even of{" "}
                <strong className="font-bold text-slate-900">{formatNumber(result.breakEvenDensity, undefined, isEn)} kg/CBM</strong>.
              </>
            ) : (
              <>
                Kepadatan muatan Anda{" "}
                <strong className="font-bold text-slate-900">{formatNumber(result.densityKgPerCbm, undefined, isEn)} kg/CBM</strong>,
                berbanding ambang{" "}
                <strong className="font-bold text-slate-900">{formatNumber(result.breakEvenDensity, undefined, isEn)} kg/CBM</strong>.
              </>
            )}
          </p>
        </div>
        <p className="text-[12px] font-semibold leading-[1.6] text-slate-500 sm:max-w-[15rem] sm:text-right">
          {isEn
            ? result.basis === "volume"
              ? "Below break-even: denser packing lowers the bill directly."
              : result.basis === "actual"
                ? "Above break-even: packing is already dense, the bill follows weight."
                : "Right at break-even."
            : result.basis === "volume"
              ? "Di bawah ambang: memadatkan kemasan langsung menurunkan tagihan."
              : result.basis === "actual"
                ? "Di atas ambang: kemasan sudah padat, tagihan mengikuti berat."
                : "Tepat di ambang."}
        </p>
      </div>
    </ToolPanel>
  );
}

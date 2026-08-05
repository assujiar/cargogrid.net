"use client";

import React, { useMemo, useState } from "react";
import { Plus, Trash2, ArrowRightLeft } from "lucide-react";
import {
  calculateShipment,
  formatNumber,
  VOLUMETRIC_MODES,
  type CargoLine,
  type LengthUnit,
} from "../../lib/logistics/volume";
import { FieldLabel, NumberField, ResultCard, ResultGrid, ToolPanel } from "./controls";

const UNITS: { value: LengthUnit; label: string }[] = [
  { value: "cm", label: "cm" },
  { value: "m", label: "m" },
  { value: "mm", label: "mm" },
  { value: "in", label: "inci" },
];

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
          <div key={row.id} className="nm-deboss rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                Baris {index + 1}
              </span>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => setRows((current) => current.filter((r) => r.id !== row.id))}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                  aria-label={`Hapus baris ${index + 1}`}
                >
                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                  Hapus
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumberField
                label="Panjang"
                value={row.dims.length}
                onChange={(v) => updateDims(row.id, { length: v })}
                min={0}
                step={0.1}
              />
              <NumberField
                label="Lebar"
                value={row.dims.width}
                onChange={(v) => updateDims(row.id, { width: v })}
                min={0}
                step={0.1}
              />
              <NumberField
                label="Tinggi"
                value={row.dims.height}
                onChange={(v) => updateDims(row.id, { height: v })}
                min={0}
                step={0.1}
              />
              <div>
                <FieldLabel htmlFor={`unit-${row.id}`}>Satuan</FieldLabel>
                <select
                  id={`unit-${row.id}`}
                  value={row.dims.unit}
                  onChange={(e) => updateDims(row.id, { unit: e.target.value as LengthUnit })}
                  className="nm-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                  {UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
              <NumberField
                label="Jumlah koli"
                value={row.quantity}
                onChange={(v) => update(row.id, { quantity: v })}
                min={0}
                step={1}
              />
              <NumberField
                label="Berat per koli (kg)"
                value={row.weightPerPiece}
                onChange={(v) => update(row.id, { weightPerPiece: v })}
                min={0}
                step={0.1}
              />
              <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                <p className="text-[12px] leading-[1.7] text-slate-500">
                  {formatNumber(result.lines[index]?.cbmPerPiece ?? 0, 4)} CBM per koli ·{" "}
                  <strong className="font-bold text-slate-700">
                    {formatNumber(result.lines[index]?.totalCbm ?? 0, 3)} CBM
                  </strong>{" "}
                  untuk baris ini
                </p>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setRows((current) => [...current, { ...BLANK, id: nextId++ }])}
          className="nm-btn inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold text-slate-700 transition-colors hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Tambah jenis kemasan
        </button>

        <div>
          <FieldLabel htmlFor="mode">Moda pengiriman</FieldLabel>
          <select
            id="mode"
            value={modeId}
            onChange={(e) => setModeId(e.target.value)}
            className="nm-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold sm:max-w-sm"
          >
            {VOLUMETRIC_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <p className="mt-2 max-w-2xl text-[12px] leading-[1.7] text-slate-500">{mode.note}</p>
        </div>
      </div>

      <ResultGrid>
        <ResultCard label="Total volume" value={`${formatNumber(result.totalCbm, 3)} CBM`} hint={`${result.totalPieces} koli`} />
        <ResultCard label="Berat aktual" value={`${formatNumber(result.totalActualWeight)} kg`} hint="Hasil timbangan" />
        <ResultCard
          label="Berat volumetrik"
          value={`${formatNumber(result.volumetricWeight)} kg`}
          hint={`${formatNumber(mode.kgPerCbm)} kg per CBM`}
        />
        <ResultCard
          label="Chargeable weight"
          value={`${formatNumber(result.chargeableWeight)} kg`}
          hint={
            result.basis === "volume"
              ? "Ditagih menurut volume"
              : result.basis === "actual"
                ? "Ditagih menurut berat"
                : "Keduanya setara"
          }
          emphasis
        />
      </ResultGrid>

      {/* The density read-out is the part that changes behaviour. Knowing the
          chargeable weight tells you this month's bill; knowing which side of
          the break-even you sit on tells you whether repacking would ever pay. */}
      <div className="nm-deboss mt-5 flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" />
          <p className="text-[13px] leading-[1.7] text-slate-700">
            Kepadatan muatan Anda <strong className="font-bold text-slate-900">{formatNumber(result.densityKgPerCbm)} kg/CBM</strong>
            {" "}berbanding ambang <strong className="font-bold text-slate-900">{formatNumber(result.breakEvenDensity)} kg/CBM</strong>.
          </p>
        </div>
        <p className="text-[12px] font-semibold leading-[1.6] text-slate-500 sm:max-w-xs sm:text-right">
          {result.basis === "volume"
            ? "Di bawah ambang: memadatkan kemasan langsung menurunkan tagihan."
            : result.basis === "actual"
              ? "Di atas ambang: kemasan sudah padat, tagihan mengikuti berat."
              : "Tepat di ambang."}
        </p>
      </div>
    </ToolPanel>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, CalendarClock, ShieldCheck } from "lucide-react";
import {
  addDays,
  calculateFreeTime,
  DEFAULT_SLABS,
  formatIDR,
  formatLongDate,
  isValidCalendarDate,
  type TariffSlab,
} from "../../lib/logistics/freeTime";
import { formatNumber } from "../../lib/logistics/volume";
import { DateField, FieldLabel, NumberField, ResultCard, ResultGrid, ToggleField, ToolPanel } from "./controls";

interface SlabRow extends TariffSlab {
  id: number;
}

let nextId = 100;

/**
 * Today's date, computed on the client only.
 *
 * Seeding it during render would put the server's UTC date into the HTML and
 * the visitor's local date into the hydrated tree — a mismatch that React
 * reports as an error and that, in Jakarta's UTC+7, is wrong for seven hours of
 * every day. So the fields start empty and fill in on mount.
 */
function todayLocal(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export default function FreeTimeCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [freeTimeDays, setFreeTimeDays] = useState(7);
  const [countStartDay, setCountStartDay] = useState(true);
  const [containers, setContainers] = useState(1);
  const [slabs, setSlabs] = useState<SlabRow[]>(DEFAULT_SLABS.map((slab, i) => ({ ...slab, id: i })));

  useEffect(() => {
    const today = todayLocal();
    setStartDate(today);
    setEndDate(addDays(today, 10));
  }, []);

  const ready = isValidCalendarDate(startDate) && isValidCalendarDate(endDate);

  const result = useMemo(() => {
    if (!ready) return null;
    return calculateFreeTime({ startDate, freeTimeDays, endDate, countStartDay, containers, slabs });
  }, [ready, startDate, freeTimeDays, endDate, countStartDay, containers, slabs]);

  function updateSlab(id: number, patch: Partial<SlabRow>) {
    setSlabs((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  return (
    <ToolPanel>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <DateField
            label="Tanggal bongkar atau keluar terminal"
            value={startDate}
            onChange={setStartDate}
            hint="Tanggal kontainer turun dari kapal untuk demurrage, atau tanggal keluar terminal untuk detention."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Free time"
              value={freeTimeDays}
              onChange={setFreeTimeDays}
              min={0}
              step={1}
              suffix="hari"
              hint="Tertera di Delivery Order."
            />
            <NumberField label="Jumlah kontainer" value={containers} onChange={setContainers} min={1} step={1} suffix="unit" />
          </div>
          <DateField
            label="Tanggal pengambilan atau pengembalian"
            value={endDate}
            onChange={setEndDate}
            hint="Isi tanggal rencana untuk memperkirakan, atau tanggal hari ini untuk melihat posisi sekarang."
          />
          <ToggleField
            label="Hari bongkar dihitung sebagai free time hari pertama"
            checked={countStartDay}
            onChange={setCountStartDay}
            hint="Berbeda antar pelayaran, dan selisihnya persis satu hari denda. Konfirmasikan sekali per pelayaran."
          />
        </div>

        <div className="nm-deboss rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              Tarif berjenjang
            </span>
            <button
              type="button"
              onClick={() =>
                setSlabs((current) => {
                  const last = current[current.length - 1];
                  const from = last ? (last.toDay ?? last.fromDay) + 1 : 1;
                  return [...current, { id: nextId++, fromDay: from, toDay: null, ratePerDay: 0 }];
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 transition-colors hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
              Jenjang
            </button>
          </div>

          <p className="mb-4 text-[11px] leading-[1.6] text-slate-500">
            Angka bawaan hanya berbentuk seperti tarif sungguhan — nominalnya bukan tarif siapa pun. Ganti dengan angka
            dari Delivery Order Anda.
          </p>

          <div className="flex flex-col gap-3">
            {slabs.map((slab, index) => (
              <div key={slab.id} className="grid grid-cols-[1fr_1fr_1.4fr_auto] items-end gap-2">
                <NumberField label={index === 0 ? "Hari ke" : ""} value={slab.fromDay} onChange={(v) => updateSlab(slab.id, { fromDay: v })} min={1} step={1} />
                <NumberField
                  label={index === 0 ? "sampai" : ""}
                  value={slab.toDay ?? 0}
                  onChange={(v) => updateSlab(slab.id, { toDay: v === 0 ? null : v })}
                  min={0}
                  step={1}
                />
                <NumberField label={index === 0 ? "Tarif/hari" : ""} value={slab.ratePerDay} onChange={(v) => updateSlab(slab.id, { ratePerDay: v })} min={0} step={50000} />
                <button
                  type="button"
                  onClick={() => setSlabs((current) => current.filter((r) => r.id !== slab.id))}
                  disabled={slabs.length === 1}
                  className="mb-1 rounded-lg p-2 text-slate-400 transition-colors hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                  aria-label={`Hapus jenjang ${index + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-[1.5] text-slate-500">Isi 0 pada kolom &ldquo;sampai&rdquo; untuk jenjang terakhir yang berlaku seterusnya.</p>
        </div>
      </div>

      {result && (
        <>
          <ResultGrid>
            <ResultCard label="Hari bebas terakhir" value={formatLongDate(result.lastFreeDay)} hint="Tanggal terakhir tanpa denda" />
            <ResultCard label="Denda mulai berjalan" value={formatLongDate(result.firstChargeableDay)} hint="Hari tertagih pertama" />
            <ResultCard
              label={result.withinFreeTime ? "Sisa waktu" : "Hari tertagih"}
              value={result.withinFreeTime ? `${formatNumber(result.daysRemaining, 0)} hari` : `${formatNumber(result.chargeableDays, 0)} hari`}
              hint={result.withinFreeTime ? "Masih dalam free time" : "Melewati free time"}
            />
            <ResultCard
              label="Estimasi biaya"
              value={formatIDR(result.total)}
              hint={containers > 1 ? `${formatIDR(result.totalPerContainer)} per kontainer` : "Menurut tarif di samping"}
              emphasis
              tone={result.withinFreeTime ? "neutral" : "warning"}
            />
          </ResultGrid>

          <div className="nm-deboss mt-5 rounded-2xl p-5">
            {result.withinFreeTime ? (
              <div className="flex items-start gap-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">Masih di dalam free time</p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                    Tersisa {formatNumber(result.daysRemaining, 0)} hari kalender sampai {formatLongDate(result.lastFreeDay)}.
                    Ingat bahwa akhir pekan dan libur nasional ikut terhitung.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <CalendarClock className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />
                <div className="w-full">
                  <p className="font-display text-sm font-bold text-slate-900">Rincian per jenjang</p>
                  <table className="mt-3 w-full text-left text-[12px]">
                    <thead>
                      <tr className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">
                        <th scope="col" className="pb-2 pr-4 font-black">Jenjang</th>
                        <th scope="col" className="pb-2 pr-4 font-black">Hari</th>
                        <th scope="col" className="pb-2 pr-4 font-black">Tarif/hari</th>
                        <th scope="col" className="pb-2 font-black">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {result.breakdown.map((charge, i) => (
                        <tr key={i} className="border-t border-slate-300/40">
                          <td className="py-2 pr-4 font-semibold">
                            Hari {charge.slab.fromDay}
                            {charge.slab.toDay === null ? " ke atas" : `-${charge.slab.toDay}`}
                          </td>
                          <td className="py-2 pr-4">{charge.days}</td>
                          <td className="py-2 pr-4">{formatIDR(charge.slab.ratePerDay)}</td>
                          <td className="py-2 font-bold text-slate-900">{formatIDR(charge.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </ToolPanel>
  );
}

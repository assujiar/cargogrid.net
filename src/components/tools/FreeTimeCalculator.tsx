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
import { DateField, NumberField, ResultCard, ResultGrid, ToggleField, ToolPanel } from "./controls";
import { useLanguage } from "../shared/LanguageProvider";

const TIPS = {
  startDate:
    "Tanggal kontainer turun dari kapal untuk demurrage, atau tanggal keluar terminal untuk detention.",
  freeTime: "Jumlah hari bebas denda. Angkanya tertulis di Delivery Order dari pelayaran.",
  containers: "Berapa kontainer dengan tanggal dan free time yang sama. Biaya dikalikan sejumlah ini.",
  endDate:
    "Tanggal kontainer diambil atau dikembalikan. Isi rencana untuk memperkirakan, atau hari ini untuk melihat posisi sekarang.",
  countStartDay:
    "Sebagian pelayaran menghitung hari bongkar sebagai free time hari pertama, sebagian mulai besoknya. Tanyakan sekali, catat per pelayaran.",
  slabFrom: "Dihitung sejak hari tertagih pertama, bukan sejak tanggal bongkar. Jenjang pertama biasanya mulai di hari ke-1.",
  slabTo: "Hari tertagih terakhir yang masih memakai tarif ini. Isi 0 untuk jenjang terakhir yang berlaku seterusnya.",
  slabRate: "Tarif per kontainer per hari pada jenjang ini, sesuai Delivery Order Anda.",
} as const;

const TIPS_EN = {
  startDate: "The date the container came off the vessel for demurrage, or the gate-out date from the terminal for detention.",
  freeTime: "The number of days free of charge. The figure is printed on the carrier's Delivery Order.",
  containers: "How many containers share the same date and free time. The cost is multiplied by this number.",
  endDate: "The date the container is picked up or returned. Enter a planned date to estimate, or today's date to see where things stand right now.",
  countStartDay:
    "Some carriers count the discharge day itself as free time day one, some start counting the next day. Ask once, and note it down per carrier.",
  slabFrom: "Counted from the first chargeable day, not from the discharge date. The first slab usually starts at day 1.",
  slabTo: "The last chargeable day still billed at this rate. Enter 0 for the final slab that applies onward indefinitely.",
  slabRate: "The rate per container per day on this slab, matching your Delivery Order.",
} as const;

interface SlabRow extends TariffSlab {
  id: number;
}

let nextId = 100;

/**
 * Today's date, computed on the client only.
 *
 * Seeding it during render would put the server's UTC date into the HTML and
 * the visitor's local date into the hydrated tree, a mismatch that React
 * reports as an error and that, in Jakarta's UTC+7, is wrong for seven hours of
 * every day. So the fields start empty and fill in on mount.
 */
function todayLocal(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export default function FreeTimeCalculator() {
  const { lang } = useLanguage();
  const isEn = lang === "en";
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
            label={isEn ? "Discharge or gate-out date" : "Tanggal bongkar atau keluar terminal"}
            value={startDate}
            onChange={setStartDate}
            tip={isEn ? TIPS_EN.startDate : TIPS.startDate}
            hint={
              isEn
                ? "Demurrage is counted from the discharge date, detention from the terminal gate-out date."
                : "Demurrage dihitung dari tanggal bongkar, detention dari tanggal keluar terminal."
            }
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumberField
              label="Free time"
              value={freeTimeDays}
              onChange={setFreeTimeDays}
              min={0}
              step={1}
              suffix={isEn ? "days" : "hari"}
              tip={isEn ? TIPS_EN.freeTime : TIPS.freeTime}
              hint={isEn ? "Printed on the Delivery Order." : "Tertera di Delivery Order."}
            />
            <NumberField
              label={isEn ? "Number of containers" : "Jumlah kontainer"}
              value={containers}
              onChange={setContainers}
              min={1}
              step={1}
              suffix={isEn ? "units" : "unit"}
              tip={isEn ? TIPS_EN.containers : TIPS.containers}
            />
          </div>
          <DateField
            label={isEn ? "Pickup or return date" : "Tanggal pengambilan atau pengembalian"}
            value={endDate}
            onChange={setEndDate}
            tip={isEn ? TIPS_EN.endDate : TIPS.endDate}
            hint={
              isEn
                ? "Enter a planned date to estimate, or today's date to see where things stand right now."
                : "Isi tanggal rencana untuk memperkirakan, atau tanggal hari ini untuk melihat posisi sekarang."
            }
          />
          <ToggleField
            label={isEn ? "Discharge day counts as free time day one" : "Hari bongkar dihitung sebagai free time hari pertama"}
            checked={countStartDay}
            onChange={setCountStartDay}
            tip={isEn ? TIPS_EN.countStartDay : TIPS.countStartDay}
            hint={
              isEn
                ? "Differs between carriers, and the gap is exactly one day of charges. Confirm once per carrier."
                : "Berbeda antar pelayaran, dan selisihnya persis satu hari denda. Konfirmasikan sekali per pelayaran."
            }
          />
        </div>

        <div className="nm-deboss rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              {isEn ? "Tiered tariff" : "Tarif berjenjang"}
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
              className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 transition-colors hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
              {isEn ? "Slab" : "Jenjang"}
            </button>
          </div>

          <p className="mb-4 text-[11px] leading-[1.6] text-slate-500">
            {isEn
              ? "The default figures only look like a real tariff; the amounts aren't anyone's actual rate. Replace them with the numbers from your Delivery Order."
              : "Angka bawaan hanya berbentuk seperti tarif sungguhan; nominalnya bukan tarif siapa pun. Ganti dengan angka dari Delivery Order Anda."}
          </p>

          <div className="flex flex-col gap-3">
            {slabs.map((slab, index) => (
              <div key={slab.id} className="nm-emboss-sm rounded-xl bg-white/40 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal">
                    {isEn ? "Slab" : "Jenjang"} {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSlabs((current) => current.filter((r) => r.id !== slab.id))}
                    disabled={slabs.length === 1}
                    className="relative rounded-lg p-2 text-slate-400 transition-colors after:absolute after:-inset-1 after:content-[''] hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                    aria-label={isEn ? `Remove slab ${index + 1}` : `Hapus jenjang ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label={isEn ? "Charged from day" : "Denda hari ke"}
                    value={slab.fromDay}
                    onChange={(v) => updateSlab(slab.id, { fromDay: v })}
                    min={1}
                    step={1}
                    tip={isEn ? TIPS_EN.slabFrom : TIPS.slabFrom}
                  />
                  <NumberField
                    label={isEn ? "Through day" : "Sampai hari"}
                    value={slab.toDay ?? 0}
                    onChange={(v) => updateSlab(slab.id, { toDay: v === 0 ? null : v })}
                    min={0}
                    step={1}
                    tip={isEn ? TIPS_EN.slabTo : TIPS.slabTo}
                  />
                  <div className="col-span-2">
                    <NumberField
                      label={isEn ? "Rate per container per day" : "Tarif per kontainer per hari"}
                      value={slab.ratePerDay}
                      onChange={(v) => updateSlab(slab.id, { ratePerDay: v })}
                      min={0}
                      step={50000}
                      suffix={isEn ? "Rp/day" : "Rp/hari"}
                      tip={isEn ? TIPS_EN.slabRate : TIPS.slabRate}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-[1.5] text-slate-500">
            {isEn
              ? 'Enter 0 in the "through" field for the final slab that applies onward indefinitely.'
              : 'Isi 0 pada kolom "sampai" untuk jenjang terakhir yang berlaku seterusnya.'}
          </p>
        </div>
      </div>

      {result && (
        <>
          <ResultGrid>
            <ResultCard
              label={isEn ? "Last free day" : "Hari bebas terakhir"}
              value={formatLongDate(result.lastFreeDay, isEn)}
              hint={isEn ? "The last date free of charges" : "Tanggal terakhir tanpa denda"}
            />
            <ResultCard
              label={isEn ? "Charges start" : "Denda mulai berjalan"}
              value={formatLongDate(result.firstChargeableDay, isEn)}
              hint={isEn ? "First chargeable day" : "Hari tertagih pertama"}
            />
            <ResultCard
              label={result.withinFreeTime ? (isEn ? "Time remaining" : "Sisa waktu") : isEn ? "Chargeable days" : "Hari tertagih"}
              value={
                result.withinFreeTime
                  ? `${formatNumber(result.daysRemaining, 0, isEn)} ${isEn ? "days" : "hari"}`
                  : `${formatNumber(result.chargeableDays, 0, isEn)} ${isEn ? "days" : "hari"}`
              }
              hint={result.withinFreeTime ? (isEn ? "Still within free time" : "Masih dalam free time") : isEn ? "Past free time" : "Melewati free time"}
            />
            <ResultCard
              label={isEn ? "Estimated cost" : "Estimasi biaya"}
              value={formatIDR(result.total, isEn)}
              hint={
                containers > 1
                  ? isEn
                    ? `${formatIDR(result.totalPerContainer, isEn)} per container`
                    : `${formatIDR(result.totalPerContainer)} per kontainer`
                  : isEn
                    ? "Per the tariff alongside"
                    : "Menurut tarif di samping"
              }
              emphasis
              tone={result.withinFreeTime ? "neutral" : "warning"}
            />
          </ResultGrid>

          <div className="nm-deboss mt-5 rounded-2xl p-5">
            {result.withinFreeTime ? (
              <div className="flex items-start gap-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">{isEn ? "Still within free time" : "Masih di dalam free time"}</p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                    {isEn ? (
                      <>
                        {formatNumber(result.daysRemaining, 0, isEn)} calendar days remain until {formatLongDate(result.lastFreeDay, true)}. Remember that
                        weekends and national holidays are counted too.
                      </>
                    ) : (
                      <>
                        Tersisa {formatNumber(result.daysRemaining, 0, isEn)} hari kalender sampai {formatLongDate(result.lastFreeDay)}. Ingat bahwa akhir
                        pekan dan libur nasional ikut terhitung.
                      </>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <CalendarClock className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />
                <div className="w-full">
                  <p className="font-display text-sm font-bold text-slate-900">{isEn ? "Breakdown by slab" : "Rincian per jenjang"}</p>
                  <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[20rem] text-left text-[12px]">
                    <thead>
                      <tr className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">
                        <th scope="col" className="pb-2 pr-4 font-black">{isEn ? "Slab" : "Jenjang"}</th>
                        <th scope="col" className="pb-2 pr-4 font-black">{isEn ? "Days" : "Hari"}</th>
                        <th scope="col" className="pb-2 pr-4 font-black">{isEn ? "Rate/day" : "Tarif/hari"}</th>
                        <th scope="col" className="pb-2 font-black">{isEn ? "Subtotal" : "Subtotal"}</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {result.breakdown.map((charge, i) => (
                        <tr key={i} className="border-t border-slate-300/40">
                          <td className="py-2 pr-4 font-semibold">
                            {isEn ? "Day" : "Hari"} {charge.slab.fromDay}
                            {charge.slab.toDay === null ? (isEn ? " and up" : " ke atas") : `-${charge.slab.toDay}`}
                          </td>
                          <td className="py-2 pr-4">{charge.days}</td>
                          <td className="py-2 pr-4">{formatIDR(charge.slab.ratePerDay, isEn)}</td>
                          <td className="py-2 font-bold text-slate-900">{formatIDR(charge.amount, isEn)}</td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </ToolPanel>
  );
}

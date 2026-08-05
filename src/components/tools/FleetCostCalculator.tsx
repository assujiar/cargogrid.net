"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, TrendingUp } from "lucide-react";
import {
  calculateFleetCost,
  distancesForPattern,
  fleetProfileForClass,
  FLEET_COST_DEFAULTS,
  ROUTE_PATTERNS,
  type FleetCostInput,
  type RoutePattern,
} from "../../lib/logistics/costPerKm";
import { formatIDR } from "../../lib/logistics/freeTime";
import { formatNumber } from "../../lib/logistics/volume";
import { classLabel, VEHICLE_ARCHETYPES, VEHICLE_CLASS_ORDER } from "../../content/reference/vehicles";
import { FieldLabel, NumberField, ResultCard, ResultGrid, ToolPanel } from "./controls";

const GROUPED = VEHICLE_CLASS_ORDER.map((cls) => ({
  label: classLabel(cls),
  items: VEHICLE_ARCHETYPES.filter((v) => v.mainClass === cls),
})).filter((group) => group.items.length > 0);

/** Percentages are stored as fractions and edited as percentages. */
function PercentField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}) {
  return (
    <NumberField label={label} value={Math.round(value * 1000) / 10} onChange={(v) => onChange(v / 100)} min={0} max={100} step={1} suffix="%" hint={hint} />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="nm-deboss rounded-2xl p-5">
      <h3 className="mb-4 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export default function FleetCostCalculator() {
  const [input, setInput] = useState<FleetCostInput>(FLEET_COST_DEFAULTS);
  const [vehicleId, setVehicleId] = useState("CV034");
  const [routePattern, setRoutePattern] = useState<RoutePattern>("pp-kosong");
  const [oneWayKm, setOneWayKm] = useState(FLEET_COST_DEFAULTS.loadedKmPerTrip);

  /**
   * Pattern and distance are two inputs producing one pair of values, so both
   * are applied through a single function. Handling them separately meant a
   * pattern change left the previous pattern's distances on screen until the
   * distance was touched again -- a stale reading of a number the whole result
   * hangs on.
   */
  function applyPattern(pattern: RoutePattern, distance: number) {
    setRoutePattern(pattern);
    setOneWayKm(distance);
    if (pattern === "manual") return;
    const { loadedKmPerTrip, emptyKmPerTrip } = distancesForPattern(pattern, distance);
    setInput((current) => ({ ...current, loadedKmPerTrip, emptyKmPerTrip }));
  }

  const vehicle = VEHICLE_ARCHETYPES.find((v) => v.id === vehicleId);
  const result = useMemo(() => calculateFleetCost(input), [input]);

  /**
   * Changing the vehicle re-seeds the figures that genuinely scale with it.
   *
   * Fuel consumption, purchase price and tyre cost do not vary slightly between
   * a pickup and a tractor head -- they vary several times over. Leaving one
   * set of numbers in place across every class would produce a result that is
   * badly wrong the moment somebody picks anything other than the class the
   * defaults happened to describe, and wrong in a way nothing on screen
   * announces.
   */
  function pickVehicle(id: string) {
    const next = VEHICLE_ARCHETYPES.find((v) => v.id === id);
    if (!next) return;
    setVehicleId(id);
    setInput((current) => ({ ...current, ...fleetProfileForClass(next.mainClass) }));
  }

  function set<K extends keyof FleetCostInput>(key: K) {
    return (value: FleetCostInput[K]) => setInput((current) => ({ ...current, [key]: value }));
  }

  const payloadOver = vehicle ? input.actualPayloadTon > vehicle.planningPayload.max : false;
  const volumeOver = vehicle?.planningVolume ? input.actualVolumeM3 > vehicle.planningVolume.max : false;
  // The source model calls this the utilisation consistency check. If trips ×
  // km per trip disagrees with the annual kilometres, one of the two is wrong,
  // and every per-km figure below inherits the error.
  const inconsistent = Math.abs(result.utilisationGap) > 0.1;

  const biggest = [...result.breakdown].sort((a, b) => b.amount - a.amount)[0];

  return (
    <ToolPanel>
      <div className="flex flex-col gap-5">
        <div>
          <FieldLabel htmlFor="fleet-vehicle">Armada yang dihitung</FieldLabel>
          <select
            id="fleet-vehicle"
            value={vehicleId}
            onChange={(e) => pickVehicle(e.target.value)}
            className="nm-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold lg:max-w-2xl"
          >
            {GROUPED.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.marketNames} — {v.commercialType}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {vehicle && (
            <p className="mt-2 max-w-2xl text-[12px] leading-[1.7] text-slate-500">
              Dipakai untuk membandingkan muatan yang Anda isi dengan perkiraan kapasitas kelas ini:{" "}
              {formatNumber(vehicle.planningPayload.min)}–{formatNumber(vehicle.planningPayload.max)} ton
              {vehicle.planningVolume
                ? `, ${formatNumber(vehicle.planningVolume.min)}–${formatNumber(vehicle.planningVolume.max)} m³`
                : ""}
              . Golongan tol {vehicle.tollClass}, golongan penyeberangan {vehicle.ferryClass}.
            </p>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="Kepemilikan kendaraan">
            <NumberField label="Harga perolehan" value={input.acquisitionPrice} onChange={set("acquisitionPrice")} min={0} step={50_000_000} suffix="Rp" hint="Termasuk karoseri bila dimiliki sendiri." />
            <PercentField label="Nilai sisa" value={input.residualRatio} onChange={set("residualRatio")} hint="Perkiraan nilai jual di akhir masa pakai." />
            <NumberField label="Umur ekonomis" value={input.usefulLifeYears} onChange={set("usefulLifeYears")} min={1} step={1} suffix="thn" />
            <NumberField label="Cicilan atau sewa per tahun" value={input.financingPerYear} onChange={set("financingPerYear")} min={0} step={10_000_000} suffix="Rp" />
          </Section>

          <Section title="Pemanfaatan armada">
            <NumberField label="Rencana km per tahun" value={input.plannedAnnualKm} onChange={set("plannedAnnualKm")} min={0} step={5_000} suffix="km" />
            <PercentField label="Faktor ketersediaan" value={input.availabilityFactor} onChange={set("availabilityFactor")} hint="Porsi waktu armada benar-benar bisa jalan, di luar servis dan rusak." />
            <NumberField label="Jumlah rit per tahun" value={input.tripsPerYear} onChange={set("tripsPerYear")} min={0} step={10} suffix="rit" />

            {/* Route pattern first, distance second. People hold a route as
                "Jakarta-Surabaya, pulang kosong", not as a loaded/empty split,
                and making them do that translation puts an easy mistake right
                in front of the input that most decides the answer. */}
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="route-pattern">Pola rute</FieldLabel>
              <select
                id="route-pattern"
                value={routePattern}
                onChange={(e) => applyPattern(e.target.value as RoutePattern, oneWayKm)}
                className="nm-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                {ROUTE_PATTERNS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[12px] leading-[1.7] text-slate-500">
                {ROUTE_PATTERNS.find((p) => p.id === routePattern)?.detail}
              </p>
            </div>

            {routePattern === "manual" ? (
              <>
                <NumberField label="Km bermuatan per rit" value={input.loadedKmPerTrip} onChange={set("loadedKmPerTrip")} min={0} step={10} suffix="km" />
                <NumberField
                  label="Km kosong per rit"
                  value={input.emptyKmPerTrip}
                  onChange={set("emptyKmPerTrip")}
                  min={0}
                  step={10}
                  suffix="km"
                  hint="Jarak posisi awal dan rit balik tanpa muatan."
                />
              </>
            ) : (
              <>
                <NumberField
                  label="Jarak satu arah"
                  value={oneWayKm}
                  onChange={(v) => applyPattern(routePattern, v)}
                  min={0}
                  step={10}
                  suffix="km"
                  hint="Jarak sekali jalan. Perjalanan baliknya dihitung otomatis sesuai pola rute."
                />
                <div className="flex items-end">
                  <p className="pb-2.5 text-[12px] leading-[1.7] text-slate-500">
                    Jarak per rit menjadi{" "}
                    <strong className="font-bold text-slate-700">
                      {formatNumber(input.loadedKmPerTrip, 0)} km bermuatan
                    </strong>{" "}
                    dan {formatNumber(input.emptyKmPerTrip, 0)} km kosong.
                  </p>
                </div>
              </>
            )}
            <NumberField label="Muatan rata-rata sesungguhnya" value={input.actualPayloadTon} onChange={set("actualPayloadTon")} min={0} step={0.5} suffix="ton" hint="Rata-rata nyata, bukan kapasitas brosur." />
            <NumberField label="Volume muatan rata-rata" value={input.actualVolumeM3} onChange={set("actualVolumeM3")} min={0} step={1} suffix="m³" hint="Isi 0 bila tarif tidak berbasis volume." />
          </Section>

          <Section title="Biaya tetap per tahun">
            <NumberField label="Asuransi" value={input.insurancePerYear} onChange={set("insurancePerYear")} min={0} step={1_000_000} suffix="Rp" />
            <NumberField label="Pajak, uji berkala, dan perizinan" value={input.taxPermitsPerYear} onChange={set("taxPermitsPerYear")} min={0} step={1_000_000} suffix="Rp" />
            <NumberField label="Gaji tetap sopir dan kernet" value={input.crewFixedPerYear} onChange={set("crewFixedPerYear")} min={0} step={5_000_000} suffix="Rp" />
            <NumberField label="GPS, langganan, dan lisensi" value={input.trackingSubscriptionPerYear} onChange={set("trackingSubscriptionPerYear")} min={0} step={1_000_000} suffix="Rp" />
            <NumberField label="Overhead yang dibebankan" value={input.overheadPerYear} onChange={set("overheadPerYear")} min={0} step={5_000_000} suffix="Rp" hint="Porsi biaya kantor, admin armada, dan dispatch." />
          </Section>

          <Section title="Biaya jalan per kilometer">
            <NumberField label="Harga bahan bakar" value={input.fuelPricePerLitre} onChange={set("fuelPricePerLitre")} min={0} step={100} suffix="Rp/L" />
            <NumberField
              label="Konsumsi saat bermuatan"
              value={input.fuelKmPerLitreLoaded}
              onChange={set("fuelKmPerLitreLoaded")}
              min={0.1}
              step={0.1}
              suffix="km/L"
              hint="Angka awal mengikuti kelas armada yang dipilih. Ganti dengan rata-rata dari catatan pengisian solar Anda sendiri — medan, umur mesin, dan gaya mengemudi menggesernya jauh."
            />
            <NumberField
              label="Konsumsi saat kosong"
              value={input.fuelKmPerLitreEmpty}
              onChange={set("fuelKmPerLitreEmpty")}
              min={0.1}
              step={0.1}
              suffix="km/L"
              hint="Dihitung terpisah dari konsumsi bermuatan. Selisihnya nyata, dan bahan bakar adalah pos biaya terbesar."
            />
            <NumberField label="Cairan aditif" value={input.additivePerKm} onChange={set("additivePerKm")} min={0} step={50} suffix="Rp/km" />
            <NumberField label="Harga satu set ban" value={input.tyreSetCost} onChange={set("tyreSetCost")} min={0} step={5_000_000} suffix="Rp" />
            <NumberField label="Umur ban" value={input.tyreLifeKm} onChange={set("tyreLifeKm")} min={1} step={5_000} suffix="km" />
            <NumberField label="Perawatan dan perbaikan" value={input.maintenancePerKm} onChange={set("maintenancePerKm")} min={0} step={100} suffix="Rp/km" />
            <NumberField label="Oli dan bahan habis pakai" value={input.lubricantsPerKm} onChange={set("lubricantsPerKm")} min={0} step={50} suffix="Rp/km" />
          </Section>

          <Section title="Biaya per rit">
            {/* The golongan is repeated here rather than only under the vehicle
                picker. Somebody filling in a toll cost needs to know which
                tariff column to read, and the answer being three sections up
                the page is the same as it not being there. */}
            <NumberField
              label="Tol"
              value={input.tollPerTrip}
              onChange={set("tollPerTrip")}
              min={0}
              step={50_000}
              suffix="Rp"
              hint={
                vehicle
                  ? `Cari tarif golongan ${vehicle.tollClass} pada ruas yang dilewati, lalu jumlahkan sekali jalan dan pulang.`
                  : "Sesuai golongan kendaraan dan ruas yang dilewati."
              }
            />
            <NumberField
              label="Penyeberangan"
              value={input.ferryPerTrip}
              onChange={set("ferryPerTrip")}
              min={0}
              step={50_000}
              suffix="Rp"
              hint={
                vehicle
                  ? `Cari tarif golongan ${vehicle.ferryClass} pada lintasan yang dipakai. Isi 0 bila rutenya tidak menyeberang.`
                  : "Sesuai golongan panjang kendaraan dan lintasannya."
              }
            />
            <NumberField label="Bongkar muat dan alat" value={input.handlingPerTrip} onChange={set("handlingPerTrip")} min={0} step={50_000} suffix="Rp" />
            <NumberField label="Parkir, retribusi, keamanan" value={input.parkingPerTrip} onChange={set("parkingPerTrip")} min={0} step={50_000} suffix="Rp" />
            <NumberField label="Uang jalan sopir dan kernet" value={input.crewAllowancePerTrip} onChange={set("crewAllowancePerTrip")} min={0} step={50_000} suffix="Rp" />
            <NumberField label="Izin khusus dan pengawalan" value={input.permitEscortPerTrip} onChange={set("permitEscortPerTrip")} min={0} step={100_000} suffix="Rp" hint="Hanya untuk angkutan alat berat atau muatan berizin khusus." />
          </Section>

          <Section title="Target margin">
            <PercentField label="Margin kotor yang dituju" value={input.targetGrossMargin} onChange={set("targetGrossMargin")} hint="Harga jual minimum = biaya dibagi (100% dikurangi margin)." />
          </Section>
        </div>
      </div>

      <ResultGrid>
        <ResultCard label="Biaya per rit" value={formatIDR(result.totalCostPerTrip)} hint={`${formatNumber(result.totalKmPerTrip, 0)} km total`} emphasis />
        <ResultCard label="Biaya per km bermuatan" value={formatIDR(result.costPerLoadedKm)} hint={`Per km total ${formatIDR(result.costPerTotalKm)}`} />
        <ResultCard label="Biaya per ton-km" value={formatIDR(result.costPerTonKm)} hint={input.actualVolumeM3 > 0 ? `Per m³-km ${formatIDR(result.costPerCbmKm)}` : "Dasar tarif berbasis berat"} />
        <ResultCard label="Harga jual minimum" value={formatIDR(result.minimumSellingPerTrip)} hint={`${formatIDR(result.minimumSellingPerLoadedKm)} per km bermuatan`} emphasis />
      </ResultGrid>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="nm-deboss rounded-2xl p-5">
          <p className="font-display text-sm font-bold text-slate-900">Ke mana uangnya pergi</p>
          <div className="mt-4 flex flex-col gap-3">
            {result.breakdown.map((part) => {
              const share = result.totalCostPerTrip > 0 ? part.amount / result.totalCostPerTrip : 0;
              return (
                <div key={part.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12px] leading-snug text-slate-600">{part.label}</span>
                    <span className="whitespace-nowrap font-mono text-[11px] font-bold text-slate-900">
                      {formatNumber(share * 100, 0)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-300/50">
                    <div
                      className="h-full rounded-full bg-brand-teal"
                      style={{ width: `${Math.min(100, share * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-slate-500">{formatIDR(part.amount)}</p>
                </div>
              );
            })}
          </div>
          {biggest && (
            <p className="mt-4 text-[12px] leading-[1.7] text-slate-500">
              Pos terbesar adalah {biggest.label.toLowerCase()}. Perbaikan yang berdampak biasanya dimulai dari pos ini,
              bukan dari pos yang paling mudah dipangkas.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="nm-deboss rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" />
              <div>
                <p className="font-display text-sm font-bold text-slate-900">Rit kosong</p>
                <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                  {formatNumber(result.emptyKmRatio * 100, 0)}% dari jarak tempuh berjalan tanpa muatan. Solar dan sopir
                  tetap dibayar untuk kilometer itu, dan seluruh biayanya dibebankan ke km bermuatan — karena itu biaya
                  per km bermuatan ({formatIDR(result.costPerLoadedKm)}) selalu lebih tinggi daripada biaya per km total
                  ({formatIDR(result.costPerTotalKm)}).
                </p>
              </div>
            </div>
          </div>

          {inconsistent && (
            <div className="nm-emboss-orange rounded-2xl bg-brand-orange/5 p-5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">Dua angka pemanfaatan ini tidak cocok</p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                    Jumlah rit dikali jarak per rit menghasilkan {formatNumber(result.impliedAnnualKm, 0)} km setahun,
                    sementara rencana km dikali faktor ketersediaan menghasilkan{" "}
                    {formatNumber(result.effectiveAnnualKm, 0)} km — selisih{" "}
                    {formatNumber(Math.abs(result.utilisationGap) * 100, 0)}%. Salah satu dari keduanya keliru, dan
                    seluruh angka per kilometer di atas ikut terbawa. Samakan dulu sebelum hasilnya dipakai menetapkan
                    tarif.
                  </p>
                </div>
              </div>
            </div>
          )}

          {(payloadOver || volumeOver) && vehicle && (
            <div className="nm-emboss-orange rounded-2xl bg-brand-orange/5 p-5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">Muatan di atas perkiraan kapasitas kelas ini</p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                    {payloadOver
                      ? `Muatan ${formatNumber(input.actualPayloadTon)} ton melebihi perkiraan batas atas ${formatNumber(vehicle.planningPayload.max)} ton. `
                      : ""}
                    {volumeOver && vehicle.planningVolume
                      ? `Volume ${formatNumber(input.actualVolumeM3)} m³ melebihi perkiraan ${formatNumber(vehicle.planningVolume.max)} m³. `
                      : ""}
                    Perkiraan ini bukan batas legal — periksa JBI pada dokumen kendaraan dan dimensi bak unit yang
                    sesungguhnya dipakai.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPanel>
  );
}

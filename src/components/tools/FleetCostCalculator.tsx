"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, TrendingUp } from "lucide-react";
import {
  calculateFleetCost,
  DEFAULT_MAINTENANCE_RATIOS,
  distancesForPattern,
  fleetProfileForClass,
  FLEET_COST_DEFAULTS,
  maintenanceFromRatios,
  ROUTE_PATTERNS,
  type FleetCostInput,
  type MaintenanceRatios,
  type RoutePattern,
} from "../../lib/logistics/costPerKm";
import { formatIDR } from "../../lib/logistics/freeTime";
import { formatNumber } from "../../lib/logistics/volume";
import { classLabel, VEHICLE_ARCHETYPES, VEHICLE_CLASS_ORDER } from "../../content/reference/vehicles";
import { NumberField, ResultCard, ResultGrid, SelectField, ToolPanel } from "./controls";

/**
 * Field-by-field guidance in plain Indonesian.
 *
 * Every line answers "what do I put in this box", not "what is this box
 * called". A visitor who has to guess at faktor ketersediaan will type
 * something plausible and walk away with a confident wrong tariff, and nothing
 * on the page will look wrong.
 */
const TIPS = {
  vehicle: "Kelas armada yang dihitung. Konsumsi bahan bakar, harga, dan biaya ban ikut menyesuaikan saat diganti.",
  price: "Harga beli kendaraan termasuk karoseri. Biaya ban dan perawatan dihitung sebagai porsi dari angka ini.",
  residual: "Perkiraan nilai jual kendaraan di akhir masa pakai, dalam persen dari harga beli. Umumnya 15 sampai 25 persen.",
  life: "Berapa tahun kendaraan dipakai sebelum dijual. Dipakai membagi penyusutan per tahun.",
  financing: "Total cicilan leasing atau sewa yang dibayar setahun. Isi 0 bila kendaraan dibeli tunai.",
  plannedKm: "Target jarak tempuh kendaraan ini dalam setahun, sebelum dikurangi hari tidak beroperasi.",
  availability:
    "Persen waktu kendaraan benar-benar bisa jalan, di luar servis, rusak, dan menunggu muatan. Realistisnya 80 sampai 90 persen.",
  trips: "Berapa kali kendaraan ini menjalani satu rit penuh dalam setahun. Satu rit berarti sekali berangkat berikut perjalanan baliknya.",
  routePattern: "Pilih pola perjalanannya. Jarak bermuatan dan jarak kosong dihitung otomatis dari pilihan ini.",
  oneWayKm: "Jarak sekali jalan saja, bukan pulang pergi. Perjalanan baliknya sudah dihitung oleh pola rute di atas.",
  loadedKm: "Jarak yang ditempuh sambil membawa muatan. Hanya jarak inilah yang menghasilkan pendapatan.",
  emptyKm: "Jarak tanpa muatan: rit balik kosong dan perjalanan menuju titik muat.",
  payload: "Rata-rata muatan yang benar-benar dibawa, bukan kapasitas maksimum di brosur.",
  volume: "Rata-rata volume muatan yang benar-benar dibawa. Isi 0 bila tarif Anda tidak berbasis volume.",
  insurance: "Premi asuransi kendaraan dan muatan yang dibayar setahun.",
  taxPermits: "Pajak kendaraan, biaya uji berkala, dan perizinan, dijumlahkan untuk setahun.",
  crewFixed: "Gaji tetap sopir dan kernet setahun. Uang jalan tidak masuk sini, ada kolomnya sendiri di bawah.",
  tracking: "Biaya GPS, langganan sistem, dan lisensi untuk kendaraan ini setahun.",
  overhead: "Porsi biaya kantor, admin armada, dan dispatch yang dibebankan ke kendaraan ini setahun.",
  fuelPrice: "Harga bahan bakar per liter yang benar-benar Anda bayar di rute ini.",
  fuelLoaded: "Berapa kilometer ditempuh per liter saat membawa muatan. Ambil dari catatan pengisian solar Anda sendiri.",
  fuelEmpty: "Berapa kilometer per liter saat jalan tanpa muatan. Biasanya lebih irit daripada saat bermuatan.",
  additive: "Biaya cairan aditif seperti AdBlue per kilometer. Isi 0 bila kendaraan tidak memakainya.",
  tyreLife: "Berapa kilometer satu set ban bertahan sebelum diganti, menurut pengalaman armada Anda.",
  tyreRatio: "Harga satu set ban sebagai persen dari harga kendaraan. Titik awal yang lazim sekitar 6 persen.",
  maintenanceRatio:
    "Biaya perawatan dan perbaikan setahun sebagai persen dari harga kendaraan. Titik awal yang lazim sekitar 10 persen.",
  lubricantsRatio: "Biaya oli dan bahan habis pakai sebagai persen dari biaya perawatan. Umumnya sekitar 12 persen.",
  toll: "Total tarif tol sekali rit, pulang pergi. Cari tarif untuk golongan kendaraan Anda di ruas yang dilewati.",
  ferry: "Total tarif penyeberangan sekali rit. Isi 0 bila rutenya tidak menyeberang.",
  handling: "Biaya bongkar muat, forklift, atau alat bantu yang Anda tanggung per rit.",
  parking: "Biaya parkir, retribusi, dan keamanan sepanjang satu rit.",
  crewAllowance: "Uang jalan sopir dan kernet untuk satu rit, di luar gaji tetap.",
  permit: "Biaya izin khusus, kajian rute, dan pengawalan. Hanya untuk angkutan alat berat atau muatan berizin khusus.",
  margin: "Margin kotor yang ingin dicapai. Harga jual minimum dihitung sebagai biaya dibagi (100 persen dikurangi angka ini).",
} as const;

const GROUPED = VEHICLE_CLASS_ORDER.map((cls) => ({
  label: classLabel(cls),
  items: VEHICLE_ARCHETYPES.filter((v) => v.mainClass === cls),
})).filter((group) => group.items.length > 0);

/**
 * Percentages are stored as fractions and edited as percentages.
 *
 * The rounding is not cosmetic: 0.1 as a float renders as 10.000000000000002
 * once multiplied, and a field showing that has already lost the visitor.
 */
function PercentField({
  label,
  value,
  onChange,
  hint,
  tip,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  tip?: string;
}) {
  return (
    <NumberField
      label={label}
      value={Math.round(value * 1000) / 10}
      onChange={(v) => onChange(v / 100)}
      min={0}
      max={100}
      step={1}
      suffix="%"
      hint={hint}
      tip={tip}
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="nm-deboss rounded-2xl p-5">
      <h3 className="mb-4 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

/**
 * Tyres, maintenance and lubricants enter as a share of the vehicle's price
 * rather than as rupiah figures, and the derived amounts flow into the same
 * model fields as before.
 *
 * The reason is that these costs genuinely track the purchase price: a dearer
 * truck runs bigger tyres, dearer parts, and a more demanding service interval.
 * Held as absolute rupiah they need re-entering for every class and go stale
 * one class at a time; held as a share they re-scale the moment the vehicle
 * changes. The derived rupiah figure is shown under each field regardless, so
 * nothing about the calculation is hidden behind a percentage.
 */
function ratioSeededInput(base: FleetCostInput, ratios: MaintenanceRatios): FleetCostInput {
  const effectiveAnnualKm = base.plannedAnnualKm * base.availabilityFactor;
  return { ...base, ...maintenanceFromRatios(base.acquisitionPrice, effectiveAnnualKm, ratios) };
}

/** Pattern the form opens on, and the one-way distance it is seeded from. */
const INITIAL_PATTERN: RoutePattern = "pp-kosong";
const INITIAL_ONE_WAY_KM = FLEET_COST_DEFAULTS.loadedKmPerTrip;

/**
 * The opening state has to satisfy the route pattern it claims to be showing.
 *
 * Seeding the distances straight from FLEET_COST_DEFAULTS left the form saying
 * "pulang pergi, balik kosong" over 500 loaded and 150 empty kilometres, which
 * that pattern cannot produce. Nothing looked broken, the totals were internally
 * consistent, and the contradiction only resolved once the user happened to
 * touch the distance field. Deriving the distances from the pattern here means
 * the first render obeys the same rule as every render after it.
 */
const INITIAL_INPUT: FleetCostInput = ratioSeededInput(
  { ...FLEET_COST_DEFAULTS, ...distancesForPattern(INITIAL_PATTERN, INITIAL_ONE_WAY_KM) },
  DEFAULT_MAINTENANCE_RATIOS,
);

export default function FleetCostCalculator() {
  const [ratios, setRatios] = useState<MaintenanceRatios>(DEFAULT_MAINTENANCE_RATIOS);
  const [input, setInput] = useState<FleetCostInput>(INITIAL_INPUT);
  const [vehicleId, setVehicleId] = useState("CV034");

  /**
   * Re-derives the three maintenance amounts from whatever the price, annual
   * kilometres and ratios currently are. Called from every input that feeds
   * them, because a ratio silently applied to a stale price is exactly the
   * failure this arrangement is meant to remove.
   */
  function reseedMaintenance(next: FleetCostInput, withRatios: MaintenanceRatios = ratios): FleetCostInput {
    return ratioSeededInput(next, withRatios);
  }

  function setRatio<K extends keyof MaintenanceRatios>(key: K) {
    return (value: number) => {
      const nextRatios = { ...ratios, [key]: value };
      setRatios(nextRatios);
      setInput((current) => reseedMaintenance(current, nextRatios));
    };
  }
  const [routePattern, setRoutePattern] = useState<RoutePattern>(INITIAL_PATTERN);
  const [oneWayKm, setOneWayKm] = useState(INITIAL_ONE_WAY_KM);

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
    setInput((current) => reseedMaintenance({ ...current, ...fleetProfileForClass(next.mainClass) }));
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

  /**
   * Some archetypes do not belong in a per-kilometre model at all.
   *
   * Mining dumpers and road trains never see a public road -- the taxonomy
   * records their toll class as site-only rather than a golongan. Modular
   * transporters and SPMT are costed by project shift or hour, because the
   * cargo sits still for days and the kilometres are trivial. Running them
   * through a cost-per-km model produces a number that looks ordinary and
   * means nothing, so the page says so rather than quietly obliging.
   */
  const notRoadCosted =
    vehicle && (vehicle.mainClass === "Off-Highway" || vehicle.mainClass === "Heavy Haul" || vehicle.tollClass.includes("N/A"));

  return (
    <ToolPanel>
      <div className="flex flex-col gap-5">
        <SelectField
          label="Armada yang dihitung"
          value={vehicleId}
          onChange={pickVehicle}
          tip={TIPS.vehicle}
          className="lg:max-w-2xl"
          hint={
            vehicle
              ? `Perkiraan kapasitas kelas ini ${formatNumber(vehicle.planningPayload.min)} sampai ${formatNumber(vehicle.planningPayload.max)} ton${
                  vehicle.planningVolume
                    ? `, ${formatNumber(vehicle.planningVolume.min)} sampai ${formatNumber(vehicle.planningVolume.max)} m³`
                    : ""
                }. Golongan tol ${vehicle.tollClass}, golongan penyeberangan ${vehicle.ferryClass}.`
              : undefined
          }
        >
          {GROUPED.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.items.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.marketNames} ({v.commercialType})
                </option>
              ))}
            </optgroup>
          ))}
        </SelectField>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Section title="Kepemilikan kendaraan">
            <NumberField
              label="Harga perolehan"
              tip={TIPS.price}
              value={input.acquisitionPrice}
              onChange={(v) => setInput((current) => reseedMaintenance({ ...current, acquisitionPrice: v }))}
              min={0}
              step={50_000_000}
              suffix="Rp"
              hint="Termasuk karoseri bila dimiliki sendiri. Biaya ban dan perawatan ikut menyesuaikan."
            />
            <PercentField label="Nilai sisa" value={input.residualRatio} onChange={set("residualRatio")} tip={TIPS.residual} />
            <NumberField label="Umur ekonomis" value={input.usefulLifeYears} onChange={set("usefulLifeYears")} min={1} step={1} suffix="thn" tip={TIPS.life} />
            <NumberField label="Cicilan atau sewa per tahun" value={input.financingPerYear} onChange={set("financingPerYear")} min={0} step={10_000_000} suffix="Rp" tip={TIPS.financing} />
          </Section>

          <Section title="Pemanfaatan armada">
            <NumberField
              label="Rencana km per tahun"
              tip={TIPS.plannedKm}
              value={input.plannedAnnualKm}
              onChange={(v) => setInput((current) => reseedMaintenance({ ...current, plannedAnnualKm: v }))}
              min={0}
              step={5_000}
              suffix="km"
            />
            <PercentField
              label="Faktor ketersediaan"
              tip={TIPS.availability}
              value={input.availabilityFactor}
              onChange={(v) => setInput((current) => reseedMaintenance({ ...current, availabilityFactor: v }))}
              hint="Porsi waktu armada benar-benar bisa jalan, di luar servis dan rusak."
            />
            <NumberField label="Jumlah rit per tahun" value={input.tripsPerYear} onChange={set("tripsPerYear")} min={0} step={10} suffix="rit" tip={TIPS.trips} />

            {/* Route pattern first, distance second. People hold a route as
                "Jakarta-Surabaya, pulang kosong", not as a loaded/empty split,
                and making them do that translation puts an easy mistake right
                in front of the input that most decides the answer. */}
            <SelectField
              label="Pola rute"
              value={routePattern}
              onChange={(v) => applyPattern(v as RoutePattern, oneWayKm)}
              tip={TIPS.routePattern}
              hint={ROUTE_PATTERNS.find((p) => p.id === routePattern)?.detail}
              className="sm:col-span-2"
            >
              {ROUTE_PATTERNS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </SelectField>

            {routePattern === "manual" ? (
              <>
                <NumberField label="Km bermuatan per rit" value={input.loadedKmPerTrip} onChange={set("loadedKmPerTrip")} min={0} step={10} suffix="km" tip={TIPS.loadedKm} />
                <NumberField
                  label="Km kosong per rit"
                  value={input.emptyKmPerTrip}
                  onChange={set("emptyKmPerTrip")}
                  min={0}
                  step={10}
                  suffix="km"
                  tip={TIPS.emptyKm}
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
                  tip={TIPS.oneWayKm}
                  hint="Perjalanan baliknya dihitung otomatis sesuai pola rute."
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
            <NumberField label="Muatan rata-rata sesungguhnya" value={input.actualPayloadTon} onChange={set("actualPayloadTon")} min={0} step={0.5} suffix="ton" tip={TIPS.payload} hint="Rata-rata nyata, bukan kapasitas brosur." />
            <NumberField label="Volume muatan rata-rata" value={input.actualVolumeM3} onChange={set("actualVolumeM3")} min={0} step={1} suffix="m³" tip={TIPS.volume} />
          </Section>

          <Section title="Biaya tetap per tahun">
            <NumberField label="Asuransi" value={input.insurancePerYear} onChange={set("insurancePerYear")} min={0} step={1_000_000} suffix="Rp" tip={TIPS.insurance} />
            <NumberField label="Pajak, uji berkala, dan perizinan" value={input.taxPermitsPerYear} onChange={set("taxPermitsPerYear")} min={0} step={1_000_000} suffix="Rp" tip={TIPS.taxPermits} />
            <NumberField label="Gaji tetap sopir dan kernet" value={input.crewFixedPerYear} onChange={set("crewFixedPerYear")} min={0} step={5_000_000} suffix="Rp" tip={TIPS.crewFixed} />
            <NumberField label="GPS, langganan, dan lisensi" value={input.trackingSubscriptionPerYear} onChange={set("trackingSubscriptionPerYear")} min={0} step={1_000_000} suffix="Rp" tip={TIPS.tracking} />
            <NumberField label="Overhead yang dibebankan" value={input.overheadPerYear} onChange={set("overheadPerYear")} min={0} step={5_000_000} suffix="Rp" tip={TIPS.overhead} />
          </Section>

          <Section title="Biaya jalan per kilometer">
            <NumberField label="Harga bahan bakar" value={input.fuelPricePerLitre} onChange={set("fuelPricePerLitre")} min={0} step={100} suffix="Rp/L" tip={TIPS.fuelPrice} />
            <NumberField
              label="Konsumsi saat bermuatan"
              value={input.fuelKmPerLitreLoaded}
              onChange={set("fuelKmPerLitreLoaded")}
              min={0.1}
              step={0.1}
              suffix="km/L"
              tip={TIPS.fuelLoaded}
              hint="Angka awal mengikuti kelas armada. Ganti dengan rata-rata dari catatan pengisian solar Anda sendiri."
            />
            <NumberField
              label="Konsumsi saat kosong"
              value={input.fuelKmPerLitreEmpty}
              onChange={set("fuelKmPerLitreEmpty")}
              min={0.1}
              step={0.1}
              suffix="km/L"
              tip={TIPS.fuelEmpty}
              hint="Dihitung terpisah dari konsumsi bermuatan. Bahan bakar adalah pos biaya terbesar."
            />
            <NumberField label="Cairan aditif" value={input.additivePerKm} onChange={set("additivePerKm")} min={0} step={50} suffix="Rp/km" tip={TIPS.additive} />
            <NumberField label="Umur ban" value={input.tyreLifeKm} onChange={set("tyreLifeKm")} min={1} step={5_000} suffix="km" tip={TIPS.tyreLife} />

            {/* Percentages of purchase price rather than rupiah figures, so
                they re-scale with the vehicle instead of needing re-entry per
                class. The derived amount sits under each field -- a percentage
                nobody can convert back is a percentage nobody can check. */}
            <PercentField
              label="Ban, porsi harga kendaraan"
              value={ratios.tyreSetOfPrice}
              onChange={setRatio("tyreSetOfPrice")}
              tip={TIPS.tyreRatio}
              hint={`Porsi harga kendaraan. Setara ${formatIDR(input.tyreSetCost)} per set, atau ${formatIDR(result.tyreCostPerKm)} per km.`}
            />
            <PercentField
              label="Perawatan setahun, porsi harga kendaraan"
              value={ratios.maintenanceOfPricePerYear}
              onChange={setRatio("maintenanceOfPricePerYear")}
              tip={TIPS.maintenanceRatio}
              hint={`Porsi harga kendaraan per tahun. Setara ${formatIDR(input.maintenancePerKm)} per km pada ${formatNumber(result.effectiveAnnualKm, 0)} km setahun.`}
            />
            <PercentField
              label="Oli, porsi biaya perawatan"
              value={ratios.lubricantsOfMaintenance}
              onChange={setRatio("lubricantsOfMaintenance")}
              tip={TIPS.lubricantsRatio}
              hint={`Porsi biaya perawatan. Setara ${formatIDR(input.lubricantsPerKm)} per km.`}
            />
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
            <NumberField label="Bongkar muat dan alat" value={input.handlingPerTrip} onChange={set("handlingPerTrip")} min={0} step={50_000} suffix="Rp" tip={TIPS.handling} />
            <NumberField label="Parkir, retribusi, keamanan" value={input.parkingPerTrip} onChange={set("parkingPerTrip")} min={0} step={50_000} suffix="Rp" tip={TIPS.parking} />
            <NumberField label="Uang jalan sopir dan kernet" value={input.crewAllowancePerTrip} onChange={set("crewAllowancePerTrip")} min={0} step={50_000} suffix="Rp" tip={TIPS.crewAllowance} />
            <NumberField label="Izin khusus dan pengawalan" value={input.permitEscortPerTrip} onChange={set("permitEscortPerTrip")} min={0} step={100_000} suffix="Rp" tip={TIPS.permit} />
          </Section>

          <Section title="Target margin">
            <PercentField label="Margin kotor yang dituju" value={input.targetGrossMargin} onChange={set("targetGrossMargin")} tip={TIPS.margin} hint="Harga jual minimum dihitung sebagai biaya dibagi sisa marginnya." />
          </Section>
        </div>
      </div>

      <ResultGrid>
        <ResultCard label="Biaya per rit" value={formatIDR(result.totalCostPerTrip)} hint={`${formatNumber(result.totalKmPerTrip, 0)} km total`} emphasis />
        <ResultCard label="Biaya per km bermuatan" value={formatIDR(result.costPerLoadedKm)} hint={`Per km total ${formatIDR(result.costPerTotalKm)}`} />
        <ResultCard label="Biaya per ton-km" value={formatIDR(result.costPerTonKm)} hint={input.actualVolumeM3 > 0 ? `Per m³-km ${formatIDR(result.costPerCbmKm)}` : "Dasar tarif berbasis berat"} />
        <ResultCard label="Harga jual minimum" value={formatIDR(result.minimumSellingPerTrip)} hint={`${formatIDR(result.minimumSellingPerLoadedKm)} per km bermuatan`} emphasis />
      </ResultGrid>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
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
                  tetap dibayar untuk kilometer itu, dan seluruh biayanya dibebankan ke km bermuatan, karena itu biaya
                  per km bermuatan ({formatIDR(result.costPerLoadedKm)}) selalu lebih tinggi daripada biaya per km total
                  ({formatIDR(result.costPerTotalKm)}).
                </p>
              </div>
            </div>
          </div>

          {inconsistent && (
            <div className="nm-emboss rounded-2xl bg-white/60 p-5 ring-2 ring-brand-orange/35">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">Dua angka pemanfaatan ini tidak cocok</p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                    Jumlah rit dikali jarak per rit menghasilkan {formatNumber(result.impliedAnnualKm, 0)} km setahun,
                    sementara rencana km dikali faktor ketersediaan menghasilkan{" "}
                    {formatNumber(result.effectiveAnnualKm, 0)} km, selisih{" "}
                    {formatNumber(Math.abs(result.utilisationGap) * 100, 0)}%. Salah satu dari keduanya keliru, dan
                    seluruh angka per kilometer di atas ikut terbawa. Samakan dulu sebelum hasilnya dipakai menetapkan
                    tarif.
                  </p>
                </div>
              </div>
            </div>
          )}

          {notRoadCosted && vehicle && (
            <div className="nm-emboss rounded-2xl bg-white/60 p-5 ring-2 ring-brand-orange/35">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">Kelas ini tidak dihitung per kilometer</p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                    {vehicle.mainClass === "Off-Highway" || vehicle.tollClass.includes("N/A")
                      ? "Kendaraan ini beroperasi di area kerja, bukan di jalan umum, sehingga tidak punya golongan tol maupun penyeberangan. Biayanya lazim dihitung per jam operasi atau per ton material yang dipindahkan, bukan per kilometer."
                      : "Angkutan alat berat dan platform modular lazim dihitung per shift atau per jam proyek, bukan per kilometer. Muatannya diam berhari-hari untuk persiapan, kajian rute, dan pengawalan, dan biaya itulah yang mendominasi, bukan jarak tempuhnya."}{" "}
                    Hasil di bawah tetap dihitung, tetapi perlakukan sebagai perbandingan kasar saja.
                  </p>
                </div>
              </div>
            </div>
          )}

          {(payloadOver || volumeOver) && vehicle && (
            <div className="nm-emboss rounded-2xl bg-white/60 p-5 ring-2 ring-brand-orange/35">
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
                    Perkiraan ini bukan batas legal, periksa JBI pada dokumen kendaraan dan dimensi bak unit yang
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

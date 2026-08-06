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
import { useLanguage } from "../shared/LanguageProvider";

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

const TIPS_EN = {
  vehicle: "The fleet class being calculated. Fuel consumption, price, and tyre cost adjust along with it when changed.",
  price: "The vehicle's purchase price including the body. Tyre and maintenance cost are calculated as a share of this figure.",
  residual: "The vehicle's estimated resale value at the end of its service life, as a percent of the purchase price. Typically 15 to 25 percent.",
  life: "How many years the vehicle is used before being sold. Used to divide the annual depreciation.",
  financing: "Total leasing or rental installments paid per year. Enter 0 if the vehicle was bought in cash.",
  plannedKm: "This vehicle's target annual distance, before subtracting non-operating days.",
  availability: "The percent of time the vehicle can actually run, excluding service, breakdowns, and waiting for a load. Realistically 80 to 90 percent.",
  trips: "How many full trips this vehicle runs in a year. One trip means one outbound run plus its return.",
  routePattern: "Choose the travel pattern. Loaded and empty distance are calculated automatically from this choice.",
  oneWayKm: "One-way distance only, not round trip. The return trip is already accounted for by the route pattern above.",
  loadedKm: "The distance travelled while carrying a load. Only this distance generates revenue.",
  emptyKm: "The distance travelled without a load: the empty return leg and the trip to the loading point.",
  payload: "The average load actually carried, not the maximum capacity from the brochure.",
  volume: "The average load volume actually carried. Enter 0 if your rate isn't volume-based.",
  insurance: "Vehicle and cargo insurance premium paid per year.",
  taxPermits: "Vehicle tax, periodic inspection fee, and permits, summed for the year.",
  crewFixed: "Driver and helper's fixed annual salary. Trip allowances don't go here, they have their own field below.",
  tracking: "GPS, system subscription, and license cost for this vehicle per year.",
  overhead: "The share of office cost, fleet admin, and dispatch charged to this vehicle per year.",
  fuelPrice: "The fuel price per litre you actually pay on this route.",
  fuelLoaded: "How many kilometres per litre while carrying a load. Take this from your own fuel log.",
  fuelEmpty: "How many kilometres per litre while running empty. Usually more efficient than while loaded.",
  additive: "The cost of additive fluids like AdBlue per kilometre. Enter 0 if the vehicle doesn't use one.",
  tyreLife: "How many kilometres one tyre set lasts before replacement, based on your fleet's experience.",
  tyreRatio: "The price of one tyre set as a percent of the vehicle price. A common starting point is around 6 percent.",
  maintenanceRatio: "Annual maintenance and repair cost as a percent of the vehicle price. A common starting point is around 10 percent.",
  lubricantsRatio: "Oil and consumables cost as a percent of maintenance cost. Typically around 12 percent.",
  toll: "Total toll fare for one round trip. Look up the fare for your vehicle's class on the roads used.",
  ferry: "Total ferry fare for one trip. Enter 0 if the route doesn't cross by ferry.",
  handling: "Loading/unloading, forklift, or equipment cost you cover per trip.",
  parking: "Parking, levies, and security cost across one trip.",
  crewAllowance: "Driver and helper's trip allowance for one trip, on top of fixed salary.",
  permit: "Special permit, route survey, and escort cost. Only for heavy-equipment or specially permitted cargo.",
  margin: "The gross margin you're aiming for. The minimum selling price is calculated as cost divided by (100 percent minus this figure).",
} as const;

function groupFleet(isEn: boolean) {
  return VEHICLE_CLASS_ORDER.map((cls) => ({
    label: isEn ? cls : classLabel(cls),
    items: VEHICLE_ARCHETYPES.filter((v) => v.mainClass === cls),
  })).filter((group) => group.items.length > 0);
}

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
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const GROUPED = useMemo(() => groupFleet(isEn), [isEn]);
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
  const result = useMemo(() => calculateFleetCost(input, isEn), [input, isEn]);

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
          label={isEn ? "Fleet being calculated" : "Armada yang dihitung"}
          value={vehicleId}
          onChange={pickVehicle}
          tip={isEn ? TIPS_EN.vehicle : TIPS.vehicle}
          className="lg:max-w-2xl"
          hint={
            vehicle
              ? isEn
                ? `This class's estimated capacity is ${formatNumber(vehicle.planningPayload.min)} to ${formatNumber(vehicle.planningPayload.max)} tonnes${
                    vehicle.planningVolume
                      ? `, ${formatNumber(vehicle.planningVolume.min)} to ${formatNumber(vehicle.planningVolume.max)} m³`
                      : ""
                  }. Toll class ${vehicle.tollClass}, ferry class ${vehicle.ferryClass}.`
                : `Perkiraan kapasitas kelas ini ${formatNumber(vehicle.planningPayload.min)} sampai ${formatNumber(vehicle.planningPayload.max)} ton${
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
                  {isEn ? `${v.marketNamesEn} (${v.commercialTypeEn})` : `${v.marketNames} (${v.commercialType})`}
                </option>
              ))}
            </optgroup>
          ))}
        </SelectField>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Section title={isEn ? "Vehicle ownership" : "Kepemilikan kendaraan"}>
            <NumberField
              label={isEn ? "Purchase price" : "Harga perolehan"}
              tip={isEn ? TIPS_EN.price : TIPS.price}
              value={input.acquisitionPrice}
              onChange={(v) => setInput((current) => reseedMaintenance({ ...current, acquisitionPrice: v }))}
              min={0}
              step={50_000_000}
              suffix="Rp"
              hint={
                isEn
                  ? "Including the body if self-owned. Tyre and maintenance cost adjust along with it."
                  : "Termasuk karoseri bila dimiliki sendiri. Biaya ban dan perawatan ikut menyesuaikan."
              }
            />
            <PercentField label={isEn ? "Residual value" : "Nilai sisa"} value={input.residualRatio} onChange={set("residualRatio")} tip={isEn ? TIPS_EN.residual : TIPS.residual} />
            <NumberField
              label={isEn ? "Useful life" : "Umur ekonomis"}
              value={input.usefulLifeYears}
              onChange={set("usefulLifeYears")}
              min={1}
              step={1}
              suffix={isEn ? "yrs" : "thn"}
              tip={isEn ? TIPS_EN.life : TIPS.life}
            />
            <NumberField
              label={isEn ? "Financing or rental per year" : "Cicilan atau sewa per tahun"}
              value={input.financingPerYear}
              onChange={set("financingPerYear")}
              min={0}
              step={10_000_000}
              suffix="Rp"
              tip={isEn ? TIPS_EN.financing : TIPS.financing}
            />
          </Section>

          <Section title={isEn ? "Fleet utilisation" : "Pemanfaatan armada"}>
            <NumberField
              label={isEn ? "Planned km per year" : "Rencana km per tahun"}
              tip={isEn ? TIPS_EN.plannedKm : TIPS.plannedKm}
              value={input.plannedAnnualKm}
              onChange={(v) => setInput((current) => reseedMaintenance({ ...current, plannedAnnualKm: v }))}
              min={0}
              step={5_000}
              suffix="km"
            />
            <PercentField
              label={isEn ? "Availability factor" : "Faktor ketersediaan"}
              tip={isEn ? TIPS_EN.availability : TIPS.availability}
              value={input.availabilityFactor}
              onChange={(v) => setInput((current) => reseedMaintenance({ ...current, availabilityFactor: v }))}
              hint={
                isEn
                  ? "The share of time the fleet can actually run, excluding service and breakdowns."
                  : "Porsi waktu armada benar-benar bisa jalan, di luar servis dan rusak."
              }
            />
            <NumberField
              label={isEn ? "Trips per year" : "Jumlah rit per tahun"}
              value={input.tripsPerYear}
              onChange={set("tripsPerYear")}
              min={0}
              step={10}
              suffix={isEn ? "trips" : "rit"}
              tip={isEn ? TIPS_EN.trips : TIPS.trips}
            />

            {/* Route pattern first, distance second. People hold a route as
                "Jakarta-Surabaya, pulang kosong", not as a loaded/empty split,
                and making them do that translation puts an easy mistake right
                in front of the input that most decides the answer. */}
            <SelectField
              label={isEn ? "Route pattern" : "Pola rute"}
              value={routePattern}
              onChange={(v) => applyPattern(v as RoutePattern, oneWayKm)}
              tip={isEn ? TIPS_EN.routePattern : TIPS.routePattern}
              hint={
                isEn
                  ? ROUTE_PATTERNS.find((p) => p.id === routePattern)?.detailEn
                  : ROUTE_PATTERNS.find((p) => p.id === routePattern)?.detail
              }
              className="sm:col-span-2"
            >
              {ROUTE_PATTERNS.map((p) => (
                <option key={p.id} value={p.id}>
                  {isEn ? p.labelEn : p.label}
                </option>
              ))}
            </SelectField>

            {routePattern === "manual" ? (
              <>
                <NumberField
                  label={isEn ? "Loaded km per trip" : "Km bermuatan per rit"}
                  value={input.loadedKmPerTrip}
                  onChange={set("loadedKmPerTrip")}
                  min={0}
                  step={10}
                  suffix="km"
                  tip={isEn ? TIPS_EN.loadedKm : TIPS.loadedKm}
                />
                <NumberField
                  label={isEn ? "Empty km per trip" : "Km kosong per rit"}
                  value={input.emptyKmPerTrip}
                  onChange={set("emptyKmPerTrip")}
                  min={0}
                  step={10}
                  suffix="km"
                  tip={isEn ? TIPS_EN.emptyKm : TIPS.emptyKm}
                  hint={isEn ? "The positioning distance and the empty return leg." : "Jarak posisi awal dan rit balik tanpa muatan."}
                />
              </>
            ) : (
              <>
                <NumberField
                  label={isEn ? "One-way distance" : "Jarak satu arah"}
                  value={oneWayKm}
                  onChange={(v) => applyPattern(routePattern, v)}
                  min={0}
                  step={10}
                  suffix="km"
                  tip={isEn ? TIPS_EN.oneWayKm : TIPS.oneWayKm}
                  hint={isEn ? "The return trip is calculated automatically from the route pattern." : "Perjalanan baliknya dihitung otomatis sesuai pola rute."}
                />
                <div className="flex items-end">
                  <p className="pb-2.5 text-[12px] leading-[1.7] text-slate-500">
                    {isEn ? (
                      <>
                        Distance per trip becomes{" "}
                        <strong className="font-bold text-slate-700">{formatNumber(input.loadedKmPerTrip, 0)} km loaded</strong> and{" "}
                        {formatNumber(input.emptyKmPerTrip, 0)} km empty.
                      </>
                    ) : (
                      <>
                        Jarak per rit menjadi{" "}
                        <strong className="font-bold text-slate-700">{formatNumber(input.loadedKmPerTrip, 0)} km bermuatan</strong> dan{" "}
                        {formatNumber(input.emptyKmPerTrip, 0)} km kosong.
                      </>
                    )}
                  </p>
                </div>
              </>
            )}
            <NumberField
              label={isEn ? "Actual average payload" : "Muatan rata-rata sesungguhnya"}
              value={input.actualPayloadTon}
              onChange={set("actualPayloadTon")}
              min={0}
              step={0.5}
              suffix={isEn ? "t" : "ton"}
              tip={isEn ? TIPS_EN.payload : TIPS.payload}
              hint={isEn ? "The real average, not the brochure capacity." : "Rata-rata nyata, bukan kapasitas brosur."}
            />
            <NumberField
              label={isEn ? "Average load volume" : "Volume muatan rata-rata"}
              value={input.actualVolumeM3}
              onChange={set("actualVolumeM3")}
              min={0}
              step={1}
              suffix="m³"
              tip={isEn ? TIPS_EN.volume : TIPS.volume}
            />
          </Section>

          <Section title={isEn ? "Fixed costs per year" : "Biaya tetap per tahun"}>
            <NumberField label={isEn ? "Insurance" : "Asuransi"} value={input.insurancePerYear} onChange={set("insurancePerYear")} min={0} step={1_000_000} suffix="Rp" tip={isEn ? TIPS_EN.insurance : TIPS.insurance} />
            <NumberField
              label={isEn ? "Tax, inspection, and permits" : "Pajak, uji berkala, dan perizinan"}
              value={input.taxPermitsPerYear}
              onChange={set("taxPermitsPerYear")}
              min={0}
              step={1_000_000}
              suffix="Rp"
              tip={isEn ? TIPS_EN.taxPermits : TIPS.taxPermits}
            />
            <NumberField
              label={isEn ? "Driver and helper fixed salary" : "Gaji tetap sopir dan kernet"}
              value={input.crewFixedPerYear}
              onChange={set("crewFixedPerYear")}
              min={0}
              step={5_000_000}
              suffix="Rp"
              tip={isEn ? TIPS_EN.crewFixed : TIPS.crewFixed}
            />
            <NumberField
              label={isEn ? "GPS, subscription, and licensing" : "GPS, langganan, dan lisensi"}
              value={input.trackingSubscriptionPerYear}
              onChange={set("trackingSubscriptionPerYear")}
              min={0}
              step={1_000_000}
              suffix="Rp"
              tip={isEn ? TIPS_EN.tracking : TIPS.tracking}
            />
            <NumberField
              label={isEn ? "Overhead charged" : "Overhead yang dibebankan"}
              value={input.overheadPerYear}
              onChange={set("overheadPerYear")}
              min={0}
              step={5_000_000}
              suffix="Rp"
              tip={isEn ? TIPS_EN.overhead : TIPS.overhead}
            />
          </Section>

          <Section title={isEn ? "Running cost per kilometre" : "Biaya jalan per kilometer"}>
            <NumberField label={isEn ? "Fuel price" : "Harga bahan bakar"} value={input.fuelPricePerLitre} onChange={set("fuelPricePerLitre")} min={0} step={100} suffix="Rp/L" tip={isEn ? TIPS_EN.fuelPrice : TIPS.fuelPrice} />
            <NumberField
              label={isEn ? "Consumption while loaded" : "Konsumsi saat bermuatan"}
              value={input.fuelKmPerLitreLoaded}
              onChange={set("fuelKmPerLitreLoaded")}
              min={0.1}
              step={0.1}
              suffix="km/L"
              tip={isEn ? TIPS_EN.fuelLoaded : TIPS.fuelLoaded}
              hint={
                isEn
                  ? "The starting figure follows the fleet class. Replace it with the average from your own fuel log."
                  : "Angka awal mengikuti kelas armada. Ganti dengan rata-rata dari catatan pengisian solar Anda sendiri."
              }
            />
            <NumberField
              label={isEn ? "Consumption while empty" : "Konsumsi saat kosong"}
              value={input.fuelKmPerLitreEmpty}
              onChange={set("fuelKmPerLitreEmpty")}
              min={0.1}
              step={0.1}
              suffix="km/L"
              tip={isEn ? TIPS_EN.fuelEmpty : TIPS.fuelEmpty}
              hint={
                isEn
                  ? "Calculated separately from loaded consumption. Fuel is the largest cost item."
                  : "Dihitung terpisah dari konsumsi bermuatan. Bahan bakar adalah pos biaya terbesar."
              }
            />
            <NumberField label={isEn ? "Additive fluid" : "Cairan aditif"} value={input.additivePerKm} onChange={set("additivePerKm")} min={0} step={50} suffix="Rp/km" tip={isEn ? TIPS_EN.additive : TIPS.additive} />
            <NumberField label={isEn ? "Tyre life" : "Umur ban"} value={input.tyreLifeKm} onChange={set("tyreLifeKm")} min={1} step={5_000} suffix="km" tip={isEn ? TIPS_EN.tyreLife : TIPS.tyreLife} />

            {/* Percentages of purchase price rather than rupiah figures, so
                they re-scale with the vehicle instead of needing re-entry per
                class. The derived amount sits under each field -- a percentage
                nobody can convert back is a percentage nobody can check. */}
            <PercentField
              label={isEn ? "Tyres, share of vehicle price" : "Ban, porsi harga kendaraan"}
              value={ratios.tyreSetOfPrice}
              onChange={setRatio("tyreSetOfPrice")}
              tip={isEn ? TIPS_EN.tyreRatio : TIPS.tyreRatio}
              hint={
                isEn
                  ? `Share of vehicle price. Equivalent to ${formatIDR(input.tyreSetCost, true)} per set, or ${formatIDR(result.tyreCostPerKm, true)} per km.`
                  : `Porsi harga kendaraan. Setara ${formatIDR(input.tyreSetCost)} per set, atau ${formatIDR(result.tyreCostPerKm)} per km.`
              }
            />
            <PercentField
              label={isEn ? "Annual maintenance, share of vehicle price" : "Perawatan setahun, porsi harga kendaraan"}
              value={ratios.maintenanceOfPricePerYear}
              onChange={setRatio("maintenanceOfPricePerYear")}
              tip={isEn ? TIPS_EN.maintenanceRatio : TIPS.maintenanceRatio}
              hint={
                isEn
                  ? `Share of vehicle price per year. Equivalent to ${formatIDR(input.maintenancePerKm, true)} per km at ${formatNumber(result.effectiveAnnualKm, 0)} km a year.`
                  : `Porsi harga kendaraan per tahun. Setara ${formatIDR(input.maintenancePerKm)} per km pada ${formatNumber(result.effectiveAnnualKm, 0)} km setahun.`
              }
            />
            <PercentField
              label={isEn ? "Oil, share of maintenance cost" : "Oli, porsi biaya perawatan"}
              value={ratios.lubricantsOfMaintenance}
              onChange={setRatio("lubricantsOfMaintenance")}
              tip={isEn ? TIPS_EN.lubricantsRatio : TIPS.lubricantsRatio}
              hint={
                isEn
                  ? `Share of maintenance cost. Equivalent to ${formatIDR(input.lubricantsPerKm, true)} per km.`
                  : `Porsi biaya perawatan. Setara ${formatIDR(input.lubricantsPerKm)} per km.`
              }
            />
          </Section>

          <Section title={isEn ? "Cost per trip" : "Biaya per rit"}>
            {/* The golongan is repeated here rather than only under the vehicle
                picker. Somebody filling in a toll cost needs to know which
                tariff column to read, and the answer being three sections up
                the page is the same as it not being there. */}
            <NumberField
              label={isEn ? "Toll" : "Tol"}
              value={input.tollPerTrip}
              onChange={set("tollPerTrip")}
              min={0}
              step={50_000}
              suffix="Rp"
              hint={
                vehicle
                  ? isEn
                    ? `Look up the fare for toll class ${vehicle.tollClass} on the roads used, then sum both directions.`
                    : `Cari tarif golongan ${vehicle.tollClass} pada ruas yang dilewati, lalu jumlahkan sekali jalan dan pulang.`
                  : isEn
                    ? "Per the vehicle's class and the roads used."
                    : "Sesuai golongan kendaraan dan ruas yang dilewati."
              }
            />
            <NumberField
              label={isEn ? "Ferry" : "Penyeberangan"}
              value={input.ferryPerTrip}
              onChange={set("ferryPerTrip")}
              min={0}
              step={50_000}
              suffix="Rp"
              hint={
                vehicle
                  ? isEn
                    ? `Look up the fare for ferry class ${vehicle.ferryClass} on the crossing used. Enter 0 if the route doesn't cross by ferry.`
                    : `Cari tarif golongan ${vehicle.ferryClass} pada lintasan yang dipakai. Isi 0 bila rutenya tidak menyeberang.`
                  : isEn
                    ? "Per the vehicle's length class and the crossing used."
                    : "Sesuai golongan panjang kendaraan dan lintasannya."
              }
            />
            <NumberField
              label={isEn ? "Loading/unloading and equipment" : "Bongkar muat dan alat"}
              value={input.handlingPerTrip}
              onChange={set("handlingPerTrip")}
              min={0}
              step={50_000}
              suffix="Rp"
              tip={isEn ? TIPS_EN.handling : TIPS.handling}
            />
            <NumberField
              label={isEn ? "Parking, levies, security" : "Parkir, retribusi, keamanan"}
              value={input.parkingPerTrip}
              onChange={set("parkingPerTrip")}
              min={0}
              step={50_000}
              suffix="Rp"
              tip={isEn ? TIPS_EN.parking : TIPS.parking}
            />
            <NumberField
              label={isEn ? "Driver and helper trip allowance" : "Uang jalan sopir dan kernet"}
              value={input.crewAllowancePerTrip}
              onChange={set("crewAllowancePerTrip")}
              min={0}
              step={50_000}
              suffix="Rp"
              tip={isEn ? TIPS_EN.crewAllowance : TIPS.crewAllowance}
            />
            <NumberField
              label={isEn ? "Special permits and escort" : "Izin khusus dan pengawalan"}
              value={input.permitEscortPerTrip}
              onChange={set("permitEscortPerTrip")}
              min={0}
              step={100_000}
              suffix="Rp"
              tip={isEn ? TIPS_EN.permit : TIPS.permit}
            />
          </Section>

          <Section title={isEn ? "Target margin" : "Target margin"}>
            <PercentField
              label={isEn ? "Target gross margin" : "Margin kotor yang dituju"}
              value={input.targetGrossMargin}
              onChange={set("targetGrossMargin")}
              tip={isEn ? TIPS_EN.margin : TIPS.margin}
              hint={isEn ? "The minimum selling price is calculated as cost divided by the remaining margin." : "Harga jual minimum dihitung sebagai biaya dibagi sisa marginnya."}
            />
          </Section>
        </div>
      </div>

      <ResultGrid>
        <ResultCard
          label={isEn ? "Cost per trip" : "Biaya per rit"}
          value={formatIDR(result.totalCostPerTrip, isEn)}
          hint={`${formatNumber(result.totalKmPerTrip, 0)} km total`}
          emphasis
        />
        <ResultCard
          label={isEn ? "Cost per loaded km" : "Biaya per km bermuatan"}
          value={formatIDR(result.costPerLoadedKm, isEn)}
          hint={isEn ? `Per total km ${formatIDR(result.costPerTotalKm, true)}` : `Per km total ${formatIDR(result.costPerTotalKm)}`}
        />
        <ResultCard
          label={isEn ? "Cost per tonne-km" : "Biaya per ton-km"}
          value={formatIDR(result.costPerTonKm, isEn)}
          hint={
            input.actualVolumeM3 > 0
              ? isEn
                ? `Per m³-km ${formatIDR(result.costPerCbmKm, true)}`
                : `Per m³-km ${formatIDR(result.costPerCbmKm)}`
              : isEn
                ? "Weight-based rate basis"
                : "Dasar tarif berbasis berat"
          }
        />
        <ResultCard
          label={isEn ? "Minimum selling price" : "Harga jual minimum"}
          value={formatIDR(result.minimumSellingPerTrip, isEn)}
          hint={isEn ? `${formatIDR(result.minimumSellingPerLoadedKm, true)} per loaded km` : `${formatIDR(result.minimumSellingPerLoadedKm)} per km bermuatan`}
          emphasis
        />
      </ResultGrid>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="nm-deboss rounded-2xl p-5">
          <p className="font-display text-sm font-bold text-slate-900">{isEn ? "Where the money goes" : "Ke mana uangnya pergi"}</p>
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
                  <p className="mt-1 font-mono text-[10px] text-slate-500">{formatIDR(part.amount, isEn)}</p>
                </div>
              );
            })}
          </div>
          {biggest && (
            <p className="mt-4 text-[12px] leading-[1.7] text-slate-500">
              {isEn
                ? `The biggest line is ${biggest.label.toLowerCase()}. An impactful fix usually starts with this line, not the one that's easiest to trim.`
                : `Pos terbesar adalah ${biggest.label.toLowerCase()}. Perbaikan yang berdampak biasanya dimulai dari pos ini, bukan dari pos yang paling mudah dipangkas.`}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="nm-deboss rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" />
              <div>
                <p className="font-display text-sm font-bold text-slate-900">{isEn ? "Empty running" : "Rit kosong"}</p>
                <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                  {isEn ? (
                    <>
                      {formatNumber(result.emptyKmRatio * 100, 0)}% of the distance travelled runs without a load. Fuel and the driver are
                      still paid for those kilometres, and their full cost is charged onto the loaded kilometres, which is why the cost per
                      loaded km ({formatIDR(result.costPerLoadedKm, true)}) is always higher than the cost per total km (
                      {formatIDR(result.costPerTotalKm, true)}).
                    </>
                  ) : (
                    <>
                      {formatNumber(result.emptyKmRatio * 100, 0)}% dari jarak tempuh berjalan tanpa muatan. Solar dan sopir tetap dibayar
                      untuk kilometer itu, dan seluruh biayanya dibebankan ke km bermuatan, karena itu biaya per km bermuatan (
                      {formatIDR(result.costPerLoadedKm)}) selalu lebih tinggi daripada biaya per km total ({formatIDR(result.costPerTotalKm)}
                      ).
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {inconsistent && (
            <div className="nm-emboss rounded-2xl bg-white/60 p-5 ring-2 ring-brand-orange/35">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">
                    {isEn ? "These two utilisation figures don't match" : "Dua angka pemanfaatan ini tidak cocok"}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                    {isEn ? (
                      <>
                        Trips multiplied by distance per trip yields {formatNumber(result.impliedAnnualKm, 0)} km a year, while planned km
                        multiplied by the availability factor yields {formatNumber(result.effectiveAnnualKm, 0)} km, a gap of{" "}
                        {formatNumber(Math.abs(result.utilisationGap) * 100, 0)}%. One of the two is wrong, and every per-kilometre figure
                        above inherits it. Reconcile them before using the result to set a rate.
                      </>
                    ) : (
                      <>
                        Jumlah rit dikali jarak per rit menghasilkan {formatNumber(result.impliedAnnualKm, 0)} km setahun, sementara rencana
                        km dikali faktor ketersediaan menghasilkan {formatNumber(result.effectiveAnnualKm, 0)} km, selisih{" "}
                        {formatNumber(Math.abs(result.utilisationGap) * 100, 0)}%. Salah satu dari keduanya keliru, dan seluruh angka per
                        kilometer di atas ikut terbawa. Samakan dulu sebelum hasilnya dipakai menetapkan tarif.
                      </>
                    )}
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
                  <p className="font-display text-sm font-bold text-slate-900">
                    {isEn ? "This class isn't costed per kilometre" : "Kelas ini tidak dihitung per kilometer"}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                    {isEn
                      ? vehicle.mainClass === "Off-Highway" || vehicle.tollClass.includes("N/A")
                        ? "This vehicle operates in a work area, not on public roads, so it has no toll or ferry class. Its cost is typically calculated per operating hour or per tonne of material moved, not per kilometre."
                        : "Heavy-haul and modular transport is typically costed per shift or per project hour, not per kilometre. The cargo sits still for days for preparation, route surveys, and escorts, and that cost dominates, not the distance travelled."
                      : vehicle.mainClass === "Off-Highway" || vehicle.tollClass.includes("N/A")
                        ? "Kendaraan ini beroperasi di area kerja, bukan di jalan umum, sehingga tidak punya golongan tol maupun penyeberangan. Biayanya lazim dihitung per jam operasi atau per ton material yang dipindahkan, bukan per kilometer."
                        : "Angkutan alat berat dan platform modular lazim dihitung per shift atau per jam proyek, bukan per kilometer. Muatannya diam berhari-hari untuk persiapan, kajian rute, dan pengawalan, dan biaya itulah yang mendominasi, bukan jarak tempuhnya."}{" "}
                    {isEn
                      ? "The result below is still calculated, but treat it as a rough comparison only."
                      : "Hasil di bawah tetap dihitung, tetapi perlakukan sebagai perbandingan kasar saja."}
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
                  <p className="font-display text-sm font-bold text-slate-900">
                    {isEn ? "Load above this class's estimated capacity" : "Muatan di atas perkiraan kapasitas kelas ini"}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">
                    {isEn ? (
                      <>
                        {payloadOver
                          ? `The ${formatNumber(input.actualPayloadTon)} t load exceeds the estimated upper limit of ${formatNumber(vehicle.planningPayload.max)} t. `
                          : ""}
                        {volumeOver && vehicle.planningVolume
                          ? `The ${formatNumber(input.actualVolumeM3)} m³ volume exceeds the estimated ${formatNumber(vehicle.planningVolume.max)} m³. `
                          : ""}
                        This estimate isn't a legal limit, check the JBI on the vehicle's documents and the actual body dimensions of the
                        unit used.
                      </>
                    ) : (
                      <>
                        {payloadOver
                          ? `Muatan ${formatNumber(input.actualPayloadTon)} ton melebihi perkiraan batas atas ${formatNumber(vehicle.planningPayload.max)} ton. `
                          : ""}
                        {volumeOver && vehicle.planningVolume
                          ? `Volume ${formatNumber(input.actualVolumeM3)} m³ melebihi perkiraan ${formatNumber(vehicle.planningVolume.max)} m³. `
                          : ""}
                        Perkiraan ini bukan batas legal, periksa JBI pada dokumen kendaraan dan dimensi bak unit yang sesungguhnya dipakai.
                      </>
                    )}
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

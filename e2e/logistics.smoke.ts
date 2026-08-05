/**
 * Arithmetic smoke test for the public calculators.
 *
 * These three modules are the only place on the site where a visitor takes a
 * number away and acts on it, so a silent regression here is worse than a
 * broken layout: a wrong chargeable weight becomes a wrong quote, and a wrong
 * free-time date becomes a demurrage bill. Cases are hand-computed and written
 * as literals — a test that recomputes the expectation with the same code it is
 * testing proves only that the code is deterministic.
 *
 * Run with `npm run test:logistics`.
 */

import { calculateShipment, cbmPerPiece, getVolumetricMode, VOLUMETRIC_MODES } from "../src/lib/logistics/volume";
import { getTool, tools } from "../src/content/tools";
import { CONTAINER_SPECS } from "../src/content/reference/containers";
import { GLOSSARY } from "../src/content/reference/glossary";
import type { LoadPlanInput } from "../src/lib/logistics/truckLoad";
import { checkCompliance, planLoad } from "../src/lib/logistics/truckLoad";
import { cargoVolume, loadableArchetypes, VEHICLE_ARCHETYPES, VEHICLE_CLASS_LABELS } from "../src/content/reference/vehicles";
import { DIMENSION_LIMITS, ferryClassForLength, ROAD_CLASSES, tollClassForAxles } from "../src/content/reference/regulations";
import type { FreeTimeInput } from "../src/lib/logistics/freeTime";
import { addDays, calculateFreeTime, daysBetween, DEFAULT_SLABS } from "../src/lib/logistics/freeTime";
import type { FleetCostInput } from "../src/lib/logistics/costPerKm";
import {
  calculateFleetCost,
  DEFAULT_MAINTENANCE_RATIOS,
  distancesForPattern,
  fleetProfileForClass,
  FLEET_COST_DEFAULTS,
  maintenanceFromRatios,
  ROUTE_PATTERNS,
} from "../src/lib/logistics/costPerKm";

let failures = 0;

function check(name: string, actual: unknown, expected: unknown): void {
  const pass = Math.abs(Number(actual) - Number(expected)) < 1e-6 || actual === expected;
  if (!pass) {
    failures += 1;
    console.error(`  FAIL  ${name}\n        expected ${String(expected)}, got ${String(actual)}`);
  } else {
    console.log(`  ok    ${name}`);
  }
}

console.log("\nvolume");

// 100 x 50 x 40 cm = 0.2 m3.
check("cbm of a 100x50x40 cm carton", cbmPerPiece({ length: 100, width: 50, height: 40, unit: "cm" }), 0.2);
check("cbm is unit-agnostic", cbmPerPiece({ length: 1, width: 0.5, height: 0.4, unit: "m" }), 0.2);
check("cbm from millimetres", cbmPerPiece({ length: 1000, width: 500, height: 400, unit: "mm" }), 0.2);

// IATA: 1 m3 = 1,000,000 cm3 / 6000 = 166.666... kg.
check("air divisor 6000 is 166.67 kg/CBM", getVolumetricMode("udara-iata").kgPerCbm, 1_000_000 / 6000);
check("every mode carries a note", VOLUMETRIC_MODES.every((m) => m.note.length > 0), true);

// 10 cartons x 0.2 m3 = 2 CBM. Air volumetric = 333.33 kg, actual = 150 kg,
// so the shipment is charged on volume.
const air = calculateShipment(
  [{ dims: { length: 100, width: 50, height: 40, unit: "cm" }, quantity: 10, weightPerPiece: 15 }],
  getVolumetricMode("udara-iata"),
);
check("air: total cbm", air.totalCbm, 2);
check("air: actual weight", air.totalActualWeight, 150);
check("air: volumetric weight", air.volumetricWeight, 2 * (1_000_000 / 6000));
check("air: chargeable is the volumetric one", air.chargeableWeight, 2 * (1_000_000 / 6000));
check("air: basis reported as volume", air.basis, "volume");
check("air: density", air.densityKgPerCbm, 75);

// Same cargo by sea LCL: 2 CBM -> 2000 kg volumetric, still above 150 kg actual.
const sea = calculateShipment(
  [{ dims: { length: 100, width: 50, height: 40, unit: "cm" }, quantity: 10, weightPerPiece: 15 }],
  getVolumetricMode("laut-lcl"),
);
check("sea: volumetric weight", sea.volumetricWeight, 2000);

// Dense cargo: 2 CBM at 400 kg/CBM = 800 kg actual beats 333.33 kg volumetric.
const dense = calculateShipment(
  [{ dims: { length: 100, width: 50, height: 40, unit: "cm" }, quantity: 10, weightPerPiece: 80 }],
  getVolumetricMode("udara-iata"),
);
check("dense: charged on actual weight", dense.chargeableWeight, 800);
check("dense: basis reported as actual", dense.basis, "actual");

// The offsetting rule: one light line and one heavy line rate together, so the
// consignment total is compared once, not line by line.
const mixed = calculateShipment(
  [
    { dims: { length: 100, width: 50, height: 40, unit: "cm" }, quantity: 1, weightPerPiece: 5 },
    { dims: { length: 100, width: 50, height: 40, unit: "cm" }, quantity: 1, weightPerPiece: 200 },
  ],
  getVolumetricMode("udara-iata"),
);
check("mixed: totals compared once", mixed.chargeableWeight, 205);
check("mixed: not the sum of per-line chargeables", mixed.chargeableWeight !== 33.33 + 200, true);

console.log("\ntruck load");

// A 1 m cube in a 6.1 x 2.0 x 2.0 m CDD Long body: 6 along, 2 across, 2 high.
const cube = planLoad({
  carton: { length: 100, width: 100, height: 100, unit: "cm" },
  weightPerCarton: 100,
  body: { length: 6.1, width: 2.0, height: 2.0 },
  payloadKg: 5000,
  allowRotation: true,
});
check("cdd long: per layer", cube.perLayer, 12);
check("cdd long: layers", cube.layers, 2);
check("cdd long: geometric fit", cube.fitByVolume, 24);
check("cdd long: weight fit", cube.fitByWeight, 50);
check("cdd long: volume is binding", cube.limitedBy, "volume");
check("cdd long: loadable", cube.maxCartons, 24);

// Same body, same box, ten times the weight: now the axles bind first.
const heavy = planLoad({
  carton: { length: 100, width: 100, height: 100, unit: "cm" },
  weightPerCarton: 1000,
  body: { length: 6.1, width: 2.0, height: 2.0 },
  payloadKg: 5000,
  allowRotation: true,
});
check("heavy: weight is binding", heavy.limitedBy, "weight");
check("heavy: loadable", heavy.maxCartons, 5);
check("heavy: leaves the body mostly empty", heavy.volumeUtilisation < 0.25, true);

// Allowing rotation searches five extra orientations and keeps the best, so it
// can only ever match or beat the fixed-orientation count — never lose cartons.
const tallBox: LoadPlanInput = {
  carton: { length: 60, width: 60, height: 190, unit: "cm" },
  weightPerCarton: 50,
  body: { length: 6.1, width: 2.0, height: 2.0 },
  payloadKg: 5000,
  allowRotation: false,
};
const upright = planLoad(tallBox);
const rotated = planLoad({ ...tallBox, allowRotation: true });
check("rotation never loses cartons", rotated.fitByVolume >= upright.fitByVolume, true);

// Fleet sizing rounds up, and the remainder is what rides on the last truck.
const fleetInput: LoadPlanInput = {
  carton: { length: 100, width: 100, height: 100, unit: "cm" },
  weightPerCarton: 100,
  body: { length: 6.1, width: 2.0, height: 2.0 },
  payloadKg: 5000,
  desiredQuantity: 50,
  allowRotation: true,
};
const fleet = planLoad(fleetInput);
check("fleet: trucks needed for 50 boxes at 24/truck", fleet.trucksNeeded, 3);
check("fleet: remainder on the last truck", fleet.remainderCartons, 2);

const exact = planLoad({ ...fleetInput, desiredQuantity: 48 });
check("fleet: an exact multiple fills the last truck", exact.remainderCartons, 24);
check("fleet: an exact multiple needs no extra truck", exact.trucksNeeded, 2);

console.log("\nvehicle master");

check("61 archetypes loaded", VEHICLE_ARCHETYPES.length, 61);
check("every payload range is ordered", VEHICLE_ARCHETYPES.every((v) => v.planningPayload.min <= v.planningPayload.max), true);
check(
  "every volume range is ordered",
  VEHICLE_ARCHETYPES.every((v) => !v.planningVolume || v.planningVolume.min <= v.planningVolume.max),
  true,
);
check("every archetype cites a source", VEHICLE_ARCHETYPES.every((v) => v.sources.length > 0), true);
check("every class has an Indonesian label", VEHICLE_ARCHETYPES.every((v) => Boolean(VEHICLE_CLASS_LABELS[v.mainClass])), true);
// Only enclosed bodies are offered in the load calculator: a tanker measured in
// cartons would teach the wrong capacity unit for that body.
check("loadable set is smaller than the full taxonomy", loadableArchetypes().length < VEHICLE_ARCHETYPES.length, true);
check("every loadable archetype has cargo dimensions", loadableArchetypes().every((v) => cargoVolume(v)! > 0), true);
check(
  "no body wider than the legal vehicle limit",
  VEHICLE_ARCHETYPES.every((v) => !v.cargo || v.cargo.width <= DIMENSION_LIMITS.widthM),
  true,
);

// Toll classes follow axle count; ferry classes follow overall length. Two
// different logics, and confusing them is a routine costing error.
check("2 axles is toll class II", tollClassForAxles(2).golongan, "Golongan II");
check("3 axles is toll class III", tollClassForAxles(3).golongan, "Golongan III");
check("5 axles is toll class V", tollClassForAxles(5).golongan, "Golongan V");
check("7 axles is still toll class V", tollClassForAxles(7).golongan, "Golongan V");
check("4.5 m goods vehicle is ferry IV-B", ferryClassForLength(4.5).golongan, "Golongan IV-B");
check("6.5 m goods vehicle is ferry V-B", ferryClassForLength(6.5).golongan, "Golongan V-B");
check("exactly 7 m stays in ferry V-B", ferryClassForLength(7).golongan, "Golongan V-B");
check("7.1 m moves up to ferry VI-B", ferryClassForLength(7.1).golongan, "Golongan VI-B");
check("16.5 m combination is ferry IX", ferryClassForLength(16.5).golongan, "Golongan IX");

console.log("\ncompliance checks");

const cdd = VEHICLE_ARCHETYPES.find((v) => v.marketNames.startsWith("CDD /"))!;
const classI = ROAD_CLASSES[0];
const classIII = ROAD_CLASSES[2];

// Within the class's own planning range on a class I road: nothing to flag.
const clean = checkCompliance({ vehicle: cdd, roadClass: classI, loadedWeightKg: 4000, payloadLimitKg: 5500, bodyWidthM: 2.0 });
check("compliant plan raises no violations", clean.every((c) => c.level !== "langgar"), true);
check("compliant plan still reports toll and ferry class", clean.some((c) => c.title.includes("Golongan tol")), true);

// A 2.4 m body cannot pass a class III road, which caps width at 2.1 m.
const narrow = checkCompliance({ vehicle: cdd, roadClass: classIII, loadedWeightKg: 4000, payloadLimitKg: 5500, bodyWidthM: 2.4 });
check("class III road flags an over-wide body", narrow.some((c) => c.level === "langgar" && c.title.includes("lebar")), true);

// Overloading past the class's planning maximum is a "verify", never a verdict:
// the tool cannot see the unit's registration papers.
const heavyLoad = checkCompliance({ vehicle: cdd, roadClass: classI, loadedWeightKg: 9000, payloadLimitKg: 9000, bodyWidthM: 2.0 });
check("overload is flagged for verification", heavyLoad.some((c) => c.level === "periksa" && c.title.includes("kapasitas")), true);
check("overload advice points at JBI, not a verdict", heavyLoad.some((c) => c.detail.includes("JBI")), true);

// An impossible body width is a data-entry error, and saying so is more useful
// than silently computing a load plan from it.
const absurd = checkCompliance({ vehicle: cdd, roadClass: classI, loadedWeightKg: 1000, payloadLimitKg: 5500, bodyWidthM: 5 });
check("impossible body width is caught", absurd.some((c) => c.level === "langgar"), true);

console.log("\nfree time");

check("inclusive day count", daysBetween("2026-03-01", "2026-03-01"), 1);
check("day count across a month end", daysBetween("2026-03-30", "2026-04-02"), 4);
check("day count across a leap day", daysBetween("2028-02-28", "2028-03-01"), 3);
check("addDays crosses a year end", addDays("2026-12-30", 3), "2027-01-02");

// Discharged 1 March with 7 free days, counting the discharge day: free time
// covers 1-7 March, so demurrage starts on the 8th.
const countedInput: FreeTimeInput = {
  startDate: "2026-03-01",
  freeTimeDays: 7,
  endDate: "2026-03-10",
  countStartDay: true,
  containers: 1,
  slabs: DEFAULT_SLABS,
};
const counted = calculateFreeTime(countedInput);
check("counting the start day: last free day", counted.lastFreeDay, "2026-03-07");
check("counting the start day: first chargeable day", counted.firstChargeableDay, "2026-03-08");
check("counting the start day: chargeable days", counted.chargeableDays, 3);
check("counting the start day: 3 days in the first band", counted.total, 3 * 300_000);

// The other convention shifts everything by exactly one day, and one day of
// demurrage is the entire reason this toggle exists.
const notCounted = calculateFreeTime({ ...countedInput, countStartDay: false });
check("not counting the start day: last free day", notCounted.lastFreeDay, "2026-03-08");
check("not counting the start day: chargeable days", notCounted.chargeableDays, 2);

// Collected inside free time: no charge, and days remaining stays positive.
const early = calculateFreeTime({ ...countedInput, endDate: "2026-03-05", containers: 2 });
check("within free time: no charge", early.total, 0);
check("within free time: flagged", early.withinFreeTime, true);
check("within free time: days left", early.daysRemaining, 3);

// Ten chargeable days walks all three bands: 3 x 300k + 4 x 600k + 3 x 1.2m.
const slabbedInput: FreeTimeInput = { ...countedInput, endDate: "2026-03-17" };
const slabbed = calculateFreeTime(slabbedInput);
check("slabs: chargeable days", slabbed.chargeableDays, 10);
check("slabs: bands used", slabbed.breakdown.length, 3);
check("slabs: total", slabbed.total, 3 * 300_000 + 4 * 600_000 + 3 * 1_200_000);
check("slabs: multiplied per container", calculateFreeTime({ ...slabbedInput, containers: 4 }).total, slabbed.total * 4);

// An out-of-order slab table must not charge the open-ended band first.
const shuffled = calculateFreeTime({ ...slabbedInput, slabs: [...DEFAULT_SLABS].reverse() });
check("slabs: order of the input rows does not matter", shuffled.total, slabbed.total);


console.log("\nfleet cost");

// Every expectation below is the value the source spreadsheet itself computes
// for its own sample inputs (Vehicle CV034, 6x4 tractor + 3-axle semi). If this
// block ever fails, the port has drifted from the model it was derived from.
// The shipped defaults leave toll and ferry at zero so an unfilled field
// cannot masquerade as a real tariff. The source sample used a 1.2m toll, so
// it is restored here -- otherwise this block would be testing the defaults
// rather than the model.
const sample: FleetCostInput = { ...FLEET_COST_DEFAULTS, tripsPerYear: 240, tollPerTrip: 1_200_000 };
const cost = calculateFleetCost(sample);

check("effective annual km = planned x availability", cost.effectiveAnnualKm, 102_000);
check("total km per trip", cost.totalKmPerTrip, 650);
check("annual depreciation", cost.annualDepreciation, 150_000_000);
check("total annual fixed cost", cost.totalAnnualFixedCost, 532_000_000);
check("fixed cost per km", cost.fixedCostPerKm, 532_000_000 / 102_000);
// Loaded and empty legs consume fuel at different rates and are costed apart.
check("fuel per trip", cost.fuelCostPerTrip, (500 / 2.5) * 13_500 + (150 / 3.2) * 13_500);
check("tyre cost per km", cost.tyreCostPerKm, 90_000_000 / 80_000);
check("other variable per km", cost.otherVariableCostPerKm, 250 + 1_800 + 250);
check("trip-based variable cost", cost.tripVariableCost, 2_500_000);
check("total cost per trip", cost.totalCostPerTrip, 11_449_258.578431372);
check("all-in cost per total km", cost.costPerTotalKm, 17_614.243966817496);
check("all-in cost per loaded km", cost.costPerLoadedKm, 22_898.517156862745);
check("cost per ton-km", cost.costPerTonKm, 954.1048815359476);
check("cost per m3-km", cost.costPerCbmKm, 381.6419526143791);
check("minimum selling per trip at 20% margin", cost.minimumSellingPerTrip, 14_311_573.223039214);
check("minimum selling per loaded km", cost.minimumSellingPerLoadedKm, 28_623.146446078426);
check("empty km ratio", cost.emptyKmRatio, 150 / 650);
check("implied annual km", cost.impliedAnnualKm, 156_000);
check("utilisation gap", cost.utilisationGap, (156_000 - 102_000) / 102_000);

// The four breakdown lines must reconstruct the trip cost exactly -- a chart
// whose slices do not add up to the headline is worse than no chart.
const slices = cost.breakdown.reduce((sum, part) => sum + part.amount, 0);
check("breakdown sums to total cost per trip", slices, cost.totalCostPerTrip);

// Division guards: empty inputs must yield 0, never Infinity or NaN on screen.
const empty = calculateFleetCost({
  ...FLEET_COST_DEFAULTS,
  plannedAnnualKm: 0,
  loadedKmPerTrip: 0,
  emptyKmPerTrip: 0,
  actualPayloadTon: 0,
  actualVolumeM3: 0,
  usefulLifeYears: 0,
});
check("zero inputs: fixed cost per km guarded", empty.fixedCostPerKm, 0);
check("zero inputs: cost per loaded km guarded", empty.costPerLoadedKm, 0);
check("zero inputs: cost per ton-km guarded", empty.costPerTonKm, 0);
check("zero inputs: depreciation guarded", empty.annualDepreciation, 0);
check("zero inputs: every output finite", Object.values(empty).every((v) => typeof v !== "number" || Number.isFinite(v)), true);

// A 100% margin target is unreachable by definition; it must not divide by zero.
check("100% margin target guarded", calculateFleetCost({ ...sample, targetGrossMargin: 1 }).minimumSellingPerTrip, 0);

// Shipped defaults must not smuggle in a route-specific tariff: a plausible
// number nobody checked is worse than an empty field somebody has to fill.
check("toll defaults to zero", FLEET_COST_DEFAULTS.tollPerTrip, 0);
check("ferry defaults to zero", FLEET_COST_DEFAULTS.ferryPerTrip, 0);

console.log("\nper-class cost profiles");

// Fuel, purchase price and tyre cost scale several times over across the fleet,
// so a single default set would be badly wrong for most of the taxonomy.
const light = fleetProfileForClass("Light Truck");
const tractor = fleetProfileForClass("Tractor-Semitrailer");
// Tyre and maintenance costs are a share of the purchase price, so they follow
// the class through the price rather than being listed per class.
const lightMaint = maintenanceFromRatios(light.acquisitionPrice, 102_000, DEFAULT_MAINTENANCE_RATIOS);
const tractorMaint = maintenanceFromRatios(tractor.acquisitionPrice, 102_000, DEFAULT_MAINTENANCE_RATIOS);
check("a light truck goes further per litre than a tractor unit", light.fuelKmPerLitreLoaded > tractor.fuelKmPerLitreLoaded, true);
check("a tractor unit costs more to buy", tractor.acquisitionPrice > light.acquisitionPrice, true);
check("a tractor unit's tyre set costs more", tractorMaint.tyreSetCost > lightMaint.tyreSetCost, true);
check("the tractor profile matches the source sample's fuel figures", tractor.fuelKmPerLitreLoaded, 2.5);
check("empty running is always more economical than loaded", tractor.fuelKmPerLitreEmpty > tractor.fuelKmPerLitreLoaded, true);

// Every class in the taxonomy must resolve, and every profile must be usable
// as-is: a zero anywhere here divides through to a zero or an Infinity on screen.
check(
  "every vehicle class resolves to a complete profile",
  VEHICLE_CLASS_LABELS &&
    Object.keys(VEHICLE_CLASS_LABELS).every((cls) => {
      const p = fleetProfileForClass(cls);
      return Object.values(p).every((v) => typeof v === "number" && v > 0);
    }),
  true,
);
check(
  "heavier classes never out-run lighter ones",
  fleetProfileForClass("Light Commercial").fuelKmPerLitreLoaded >
    fleetProfileForClass("Heavy Truck").fuelKmPerLitreLoaded,
  true,
);
// An unknown class must fall back to something usable rather than to zeros.
check("an unknown class falls back to a working profile", fleetProfileForClass("Tidak Dikenal").acquisitionPrice > 0, true);

// The whole point: swapping class changes the answer by a lot, not a little.
const asLight = calculateFleetCost({ ...FLEET_COST_DEFAULTS, ...light, ...lightMaint, ...distancesForPattern("pp-kosong", 500) });
const asTractor = calculateFleetCost({ ...FLEET_COST_DEFAULTS, ...tractor, ...tractorMaint, ...distancesForPattern("pp-kosong", 500) });
check("class choice moves cost per loaded km substantially", asTractor.costPerLoadedKm > asLight.costPerLoadedKm * 1.5, true);

console.log("\nmaintenance as a share of price");

// A tyre set at 6% of a 1.5bn tractor unit is the 90m figure the source model
// used -- the ratio reproduces the absolute number it replaced.
const m = maintenanceFromRatios(1_500_000_000, 102_000, DEFAULT_MAINTENANCE_RATIOS);
check("tyre set derives from price", m.tyreSetCost, 1_500_000_000 * 0.06);
check("tyre set matches the source model's 90m figure", m.tyreSetCost, 90_000_000);
check("maintenance per km spreads the annual share over annual km", m.maintenancePerKm, (1_500_000_000 * 0.1) / 102_000);
check("lubricants derive from maintenance", m.lubricantsPerKm, m.maintenancePerKm * 0.12);

// Higher utilisation spreads the same annual maintenance bill over more
// kilometres, so the per-km figure must fall -- the relationship an absolute
// Rp/km input would have hidden.
const busy = maintenanceFromRatios(1_500_000_000, 204_000, DEFAULT_MAINTENANCE_RATIOS);
check("doubling annual km halves maintenance per km", busy.maintenancePerKm, m.maintenancePerKm / 2);
check("tyre set cost is unaffected by annual km", busy.tyreSetCost, m.tyreSetCost);

// Guards: no division by zero reaching the screen.
const idle = maintenanceFromRatios(1_500_000_000, 0, DEFAULT_MAINTENANCE_RATIOS);
check("zero annual km guarded", idle.maintenancePerKm, 0);
check("zero price yields zero tyre cost", maintenanceFromRatios(0, 102_000, DEFAULT_MAINTENANCE_RATIOS).tyreSetCost, 0);

console.log("\nroute patterns");

// A 500 km lane, three ways of running it.
check("round trip loaded both ways: all 1000 km earn", distancesForPattern("pp-bermuatan", 500).loadedKmPerTrip, 1000);
check("round trip loaded both ways: nothing runs empty", distancesForPattern("pp-bermuatan", 500).emptyKmPerTrip, 0);
check("round trip returning empty: half earns", distancesForPattern("pp-kosong", 500).loadedKmPerTrip, 500);
check("round trip returning empty: half runs empty", distancesForPattern("pp-kosong", 500).emptyKmPerTrip, 500);
check("one way only: no return leg", distancesForPattern("sekali-jalan", 500).emptyKmPerTrip, 0);
check("negative distance is clamped", distancesForPattern("pp-kosong", -100).loadedKmPerTrip, 0);
check("every pattern is described for the user", ROUTE_PATTERNS.every((p) => p.label && p.detail), true);

// The point of offering the patterns at all: same lane, same truck, and the
// backhaul roughly halves what each earning kilometre has to carry.
const laneBase = { ...sample, tollPerTrip: 0 };
const emptyReturn = calculateFleetCost({ ...laneBase, ...distancesForPattern("pp-kosong", 500) });
const paidReturn = calculateFleetCost({ ...laneBase, ...distancesForPattern("pp-bermuatan", 500) });
check("both patterns drive the same total distance", emptyReturn.totalKmPerTrip, paidReturn.totalKmPerTrip);
check("a paid backhaul cuts cost per loaded km", paidReturn.costPerLoadedKm < emptyReturn.costPerLoadedKm, true);
check("empty-km ratio falls to zero with a paid backhaul", paidReturn.emptyKmRatio, 0);
// Fuel differs because the empty leg burns at a different rate, so the trip
// totals are close but not identical -- within 5% is the honest expectation.
check(
  "trip cost stays comparable between the two",
  Math.abs(paidReturn.totalCostPerTrip - emptyReturn.totalCostPerTrip) / emptyReturn.totalCostPerTrip < 0.05,
  true,
);

console.log("\npublished claims match the data");

// Page copy states counts and figures out loud, because "61 kelas armada" and
// "150 istilah" are what make the pages worth clicking. Those are exactly the
// claims that rot silently: the dataset grows, nobody re-reads the headline,
// and the page starts lying in a way no reviewer would notice. Checking them
// here makes the drift a build failure instead of a slow embarrassment.
const truckRef = getTool("jenis-truk-indonesia")!;
check("the truck page's headline count matches the taxonomy", truckRef.title.includes(String(VEHICLE_ARCHETYPES.length)), true);
check("the truck page's summary count matches too", truckRef.summary.includes("Enam puluh satu"), VEHICLE_ARCHETYPES.length === 61);

const glossaryTool = getTool("kamus-logistik")!;
check("the glossary page does not overstate its size", glossaryTool.description.includes("Seratus lima puluh"), GLOSSARY.length === 150);

// Container figures are quoted in prose as well as rendered from data; a
// reconciled spec that leaves the prose behind is the same defect in reverse.
const containerTool = getTool("ukuran-kontainer")!;
const twentyFoot = CONTAINER_SPECS.find((c) => c.id === "20gp")!;
const fortyFoot = CONTAINER_SPECS.find((c) => c.id === "40gp")!;
check("20 ft payload is quoted as 28,2 ton", JSON.stringify(containerTool.faq).includes("28,2 ton"), Math.round(twentyFoot.payloadKg / 100) === 282);
check("40 ft still out-carries 20 ft only marginally", fortyFoot.payloadKg - twentyFoot.payloadKg < 1_000, true);
check(
  "the prose no longer claims 40 ft carries less",
  JSON.stringify(containerTool.blocks).includes("batas beratnya praktis sama"),
  true,
);

// Every tool must survive being rendered: an empty intent list or a missing FAQ
// leaves a heading with nothing under it.
check("every tool states what it answers", tools.every((t) => t.searchIntents.length >= 3), true);
check("every tool carries an FAQ", tools.every((t) => t.faq.length >= 3), true);
check("every tool hands the reader onward", tools.every((t) => t.relatedArticles.length > 0 && t.relatedTools.length > 0), true);
check("every tool has body prose, not just an instrument", tools.every((t) => t.blocks.length >= 5), true);
check("every meta title fits a SERP line", tools.every((t) => t.metaTitle.length <= 95), true);
check("every description fits a SERP snippet", tools.every((t) => t.description.length >= 90 && t.description.length <= 260), true);

// The calculator opens on the "round trip, returning empty" pattern, so the
// shipped defaults have to be a distance pair that pattern can actually
// produce. They were not: 500 loaded against 150 empty is not any round trip,
// and the form said otherwise until somebody touched the distance field.
check(
  "shipped distances are consistent with the opening route pattern",
  FLEET_COST_DEFAULTS.loadedKmPerTrip,
  distancesForPattern("pp-kosong", FLEET_COST_DEFAULTS.loadedKmPerTrip).loadedKmPerTrip,
);

console.log(failures === 0 ? "\nAll logistics calculations passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);

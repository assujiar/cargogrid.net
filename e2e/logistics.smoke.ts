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
import type { LoadPlanInput } from "../src/lib/logistics/truckLoad";
import { checkCompliance, planLoad } from "../src/lib/logistics/truckLoad";
import { cargoVolume, loadableArchetypes, VEHICLE_ARCHETYPES, VEHICLE_CLASS_LABELS } from "../src/content/reference/vehicles";
import { DIMENSION_LIMITS, ferryClassForLength, ROAD_CLASSES, tollClassForAxles } from "../src/content/reference/regulations";
import type { FreeTimeInput } from "../src/lib/logistics/freeTime";
import { addDays, calculateFreeTime, daysBetween, DEFAULT_SLABS } from "../src/lib/logistics/freeTime";
import type { FleetCostInput } from "../src/lib/logistics/costPerKm";
import { calculateFleetCost, FLEET_COST_DEFAULTS } from "../src/lib/logistics/costPerKm";

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
const sample: FleetCostInput = { ...FLEET_COST_DEFAULTS, tripsPerYear: 240 };
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

console.log(failures === 0 ? "\nAll logistics calculations passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);

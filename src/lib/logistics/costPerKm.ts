/**
 * Model biaya operasional armada: cost per km, per rit, per ton-km.
 *
 * Diterjemahkan langsung dari model spreadsheet pada riset armada 5 Agustus
 * 2026, sel demi sel, dan diverifikasi ulang terhadap contoh angka yang
 * tersimpan di dalamnya. Struktur perhitungannya dipertahankan apa adanya
 * karena urutan itulah yang membuat hasilnya bisa diaudit:
 *
 *   penyusutan tahunan   = (harga - nilai sisa) / umur ekonomis
 *   biaya tetap tahunan  = penyusutan + seluruh pos tetap tahunan
 *   biaya tetap per km   = biaya tetap tahunan / km efektif setahun
 *   biaya bbm per rit    = (km isi / konsumsi isi + km kosong / konsumsi kosong) x harga
 *   biaya ban per km     = harga satu set / umur ban
 *   biaya variabel/km    = aditif + perawatan + pelumas
 *   biaya per rit        = (tetap/km x km total) + bbm + (variabel/km x km total) + pos per rit
 *
 * Dua hal dalam susunan itu yang mudah salah bila dibangun ulang dari nol, dan
 * karena itu ditulis eksplisit di sini:
 *
 * 1. **Biaya tetap dibebankan ke seluruh km, termasuk km kosong.** Truk yang
 *    pulang kosong tetap menyusut, tetap dibayar cicilannya, tetap digaji
 *    sopirnya. Membebankan biaya tetap hanya pada km bermuatan akan membuat
 *    tarif terlihat lebih murah daripada kenyataannya.
 *
 * 2. **Konsumsi bahan bakar isi dan kosong dihitung terpisah.** Selisihnya
 *    nyata -- pada contoh sumber, 2,5 berbanding 3,2 km per liter -- dan
 *    memakai satu angka rata-rata menggeser hasilnya beberapa persen pada pos
 *    biaya yang justru paling besar.
 *
 * Tidak ada satu pun tarif yang ditanam di sini. Harga solar, tarif tol, dan
 * tarif penyeberangan berbeda per rute dan per tanggal; seluruhnya masuk
 * sebagai isian pengguna.
 */

export interface FleetCostInput {
  // Kepemilikan
  acquisitionPrice: number;
  /** Nilai sisa sebagai pecahan harga perolehan, misal 0,2 untuk 20%. */
  residualRatio: number;
  usefulLifeYears: number;

  // Pemanfaatan
  plannedAnnualKm: number;
  /** Faktor ketersediaan, misal 0,85. km efektif = km rencana x faktor ini. */
  availabilityFactor: number;
  tripsPerYear: number;
  loadedKmPerTrip: number;
  emptyKmPerTrip: number;

  // Muatan sesungguhnya, bukan kapasitas brosur
  actualPayloadTon: number;
  actualVolumeM3: number;

  // Biaya tetap tahunan
  financingPerYear: number;
  insurancePerYear: number;
  taxPermitsPerYear: number;
  crewFixedPerYear: number;
  trackingSubscriptionPerYear: number;
  overheadPerYear: number;

  // Biaya variabel per km
  fuelPricePerLitre: number;
  fuelKmPerLitreLoaded: number;
  fuelKmPerLitreEmpty: number;
  additivePerKm: number;
  tyreSetCost: number;
  tyreLifeKm: number;
  maintenancePerKm: number;
  lubricantsPerKm: number;

  // Biaya per rit
  tollPerTrip: number;
  ferryPerTrip: number;
  handlingPerTrip: number;
  parkingPerTrip: number;
  crewAllowancePerTrip: number;
  permitEscortPerTrip: number;

  /** Margin kotor yang dituju, sebagai pecahan. Harga jual = biaya / (1 - margin). */
  targetGrossMargin: number;
}

export interface FleetCostResult {
  effectiveAnnualKm: number;
  totalKmPerTrip: number;
  annualDepreciation: number;
  totalAnnualFixedCost: number;
  fixedCostPerKm: number;
  fuelCostPerTrip: number;
  tyreCostPerKm: number;
  otherVariableCostPerKm: number;
  tripVariableCost: number;
  totalCostPerTrip: number;
  costPerTotalKm: number;
  costPerLoadedKm: number;
  costPerTonKm: number;
  costPerCbmKm: number;
  minimumSellingPerTrip: number;
  minimumSellingPerLoadedKm: number;
  emptyKmRatio: number;
  /** Komposisi biaya per rit, untuk menunjukkan ke mana uangnya sebenarnya pergi. */
  breakdown: { label: string; amount: number }[];
  /** km setahun yang tersirat dari jumlah rit, untuk diperiksa silang. */
  impliedAnnualKm: number;
  /** Selisih relatif antara km tersirat dan km efektif. Mendekati nol berarti konsisten. */
  utilisationGap: number;
}

/** Pembagian yang mengembalikan 0 alih-alih Infinity, meniru IFERROR pada model asal. */
function safeDivide(numerator: number, denominator: number): number {
  if (!Number.isFinite(denominator) || denominator === 0) return 0;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : 0;
}

export function calculateFleetCost(input: FleetCostInput): FleetCostResult {
  const effectiveAnnualKm = input.plannedAnnualKm * input.availabilityFactor;
  const totalKmPerTrip = input.loadedKmPerTrip + input.emptyKmPerTrip;

  const annualDepreciation = safeDivide(
    input.acquisitionPrice - input.acquisitionPrice * input.residualRatio,
    input.usefulLifeYears,
  );

  const annualFixedLines =
    input.financingPerYear +
    input.insurancePerYear +
    input.taxPermitsPerYear +
    input.crewFixedPerYear +
    input.trackingSubscriptionPerYear +
    input.overheadPerYear;

  const totalAnnualFixedCost = annualDepreciation + annualFixedLines;
  const fixedCostPerKm = safeDivide(totalAnnualFixedCost, effectiveAnnualKm);

  const fuelCostPerTrip =
    safeDivide(input.loadedKmPerTrip, input.fuelKmPerLitreLoaded) * input.fuelPricePerLitre +
    safeDivide(input.emptyKmPerTrip, input.fuelKmPerLitreEmpty) * input.fuelPricePerLitre;

  const tyreCostPerKm = safeDivide(input.tyreSetCost, input.tyreLifeKm);
  const otherVariableCostPerKm = input.additivePerKm + input.maintenancePerKm + input.lubricantsPerKm;

  const tripVariableCost =
    input.tollPerTrip +
    input.ferryPerTrip +
    input.handlingPerTrip +
    input.parkingPerTrip +
    input.crewAllowancePerTrip +
    input.permitEscortPerTrip;

  const fixedShare = fixedCostPerKm * totalKmPerTrip;
  const runningShare = (tyreCostPerKm + otherVariableCostPerKm) * totalKmPerTrip;
  const totalCostPerTrip = fixedShare + fuelCostPerTrip + runningShare + tripVariableCost;

  const impliedAnnualKm = totalKmPerTrip * input.tripsPerYear;

  return {
    effectiveAnnualKm,
    totalKmPerTrip,
    annualDepreciation,
    totalAnnualFixedCost,
    fixedCostPerKm,
    fuelCostPerTrip,
    tyreCostPerKm,
    otherVariableCostPerKm,
    tripVariableCost,
    totalCostPerTrip,
    costPerTotalKm: safeDivide(totalCostPerTrip, totalKmPerTrip),
    costPerLoadedKm: safeDivide(totalCostPerTrip, input.loadedKmPerTrip),
    costPerTonKm: safeDivide(totalCostPerTrip, input.actualPayloadTon * input.loadedKmPerTrip),
    costPerCbmKm: safeDivide(totalCostPerTrip, input.actualVolumeM3 * input.loadedKmPerTrip),
    minimumSellingPerTrip:
      input.targetGrossMargin >= 1 ? 0 : safeDivide(totalCostPerTrip, 1 - input.targetGrossMargin),
    minimumSellingPerLoadedKm:
      input.targetGrossMargin >= 1
        ? 0
        : safeDivide(safeDivide(totalCostPerTrip, 1 - input.targetGrossMargin), input.loadedKmPerTrip),
    emptyKmRatio: safeDivide(input.emptyKmPerTrip, totalKmPerTrip),
    breakdown: [
      { label: "Biaya tetap (penyusutan, cicilan, gaji, overhead)", amount: fixedShare },
      { label: "Bahan bakar", amount: fuelCostPerTrip },
      { label: "Ban, perawatan, dan pelumas", amount: runningShare },
      { label: "Tol, penyeberangan, bongkar muat, uang jalan", amount: tripVariableCost },
    ],
    impliedAnnualKm,
    utilisationGap: safeDivide(impliedAnnualKm - effectiveAnnualKm, effectiveAnnualKm),
  };
}

/**
 * Angka awal yang wajar untuk sebuah rangkaian tractor head dengan trailer
 * tiga gandar pada rute lintas provinsi.
 *
 * Ini titik mulai supaya kolom tidak kosong, bukan patokan pasar. Setiap
 * armada punya struktur biaya sendiri, dan angka yang benar hanya datang dari
 * pembukuan sendiri.
 */
export const FLEET_COST_DEFAULTS: FleetCostInput = {
  acquisitionPrice: 1_500_000_000,
  residualRatio: 0.2,
  usefulLifeYears: 8,
  plannedAnnualKm: 120_000,
  availabilityFactor: 0.85,
  tripsPerYear: 160,
  loadedKmPerTrip: 500,
  emptyKmPerTrip: 150,
  actualPayloadTon: 24,
  actualVolumeM3: 60,
  financingPerYear: 120_000_000,
  insurancePerYear: 25_000_000,
  taxPermitsPerYear: 15_000_000,
  crewFixedPerYear: 120_000_000,
  trackingSubscriptionPerYear: 12_000_000,
  overheadPerYear: 90_000_000,
  fuelPricePerLitre: 13_500,
  fuelKmPerLitreLoaded: 2.5,
  fuelKmPerLitreEmpty: 3.2,
  additivePerKm: 250,
  tyreSetCost: 90_000_000,
  tyreLifeKm: 80_000,
  maintenancePerKm: 1_800,
  lubricantsPerKm: 250,
  tollPerTrip: 1_200_000,
  ferryPerTrip: 0,
  handlingPerTrip: 500_000,
  parkingPerTrip: 200_000,
  crewAllowancePerTrip: 600_000,
  permitEscortPerTrip: 0,
  targetGrossMargin: 0.2,
};

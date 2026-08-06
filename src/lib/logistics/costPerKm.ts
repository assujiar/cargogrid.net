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

export type RoutePattern = "pp-bermuatan" | "pp-kosong" | "sekali-jalan" | "manual";

export interface RoutePatternOption {
  id: RoutePattern;
  label: string;
  labelEn: string;
  detail: string;
  detailEn: string;
}

/**
 * Pola rute, sebagai cara mengisi jarak tanpa harus memodelkannya sendiri.
 *
 * Model biayanya bekerja dengan km bermuatan dan km kosong, dan itu memang
 * pembagian yang benar. Persoalannya, orang tidak menyimpan rutenya dalam
 * bentuk itu -- yang mereka tahu adalah "Jakarta-Surabaya, pulang kosong".
 * Menuntut mereka menerjemahkannya sendiri adalah menaruh satu langkah yang
 * gampang keliru tepat di depan angka yang paling menentukan hasil.
 *
 * Kekeliruan yang paling mahal di antaranya: mengisi jarak sekali jalan lalu
 * lupa rit baliknya sama sekali. Biaya per rit langsung terlihat separuh dari
 * yang sebenarnya, dan tarif yang lahir dari situ merugi pada setiap rit tanpa
 * ada satu pos pun yang kelihatan janggal.
 */
export const ROUTE_PATTERNS: RoutePatternOption[] = [
  {
    id: "pp-kosong",
    label: "Pulang pergi, balik kosong",
    labelEn: "Round trip, empty return",
    detail:
      "Berangkat bermuatan, kembali tanpa muatan. Pola paling umum, sekaligus yang paling mahal: separuh jarak tidak menghasilkan pendapatan tetapi tetap memakan solar, ban, dan waktu sopir.",
    detailEn:
      "Departs loaded, returns empty. The most common pattern, and also the most expensive: half the distance earns no revenue but still burns fuel, tyres, and driver time.",
  },
  {
    id: "pp-bermuatan",
    label: "Pulang pergi, dua arah bermuatan",
    labelEn: "Round trip, loaded both ways",
    detail:
      "Ada muatan balik yang membayar. Jarak tempuhnya sama dengan pola balik kosong, tetapi seluruh jarak itu kini menghasilkan pendapatan, sehingga biaya per kilometer bermuatan turun mendekati separuhnya. Inilah yang membuat rit balik layak dikejar.",
    detailEn:
      "There's a paying return load. The distance is the same as the empty-return pattern, but now every kilometre earns revenue, so the cost per loaded kilometre drops to roughly half. This is what makes chasing a return load worthwhile.",
  },
  {
    id: "sekali-jalan",
    label: "Sekali jalan saja",
    labelEn: "One way only",
    detail:
      "Kendaraan tidak kembali, atau perjalanan baliknya sudah dibebankan ke pekerjaan lain. Pastikan biaya baliknya benar-benar ditanggung pihak lain sebelum memilih ini.",
    detailEn:
      "The vehicle doesn't return, or the return trip is already billed to another job. Make sure the return cost is genuinely covered elsewhere before choosing this.",
  },
  {
    id: "manual",
    label: "Atur sendiri",
    labelEn: "Set manually",
    detail:
      "Untuk rute dengan muatan balik sebagian, jarak posisi awal, atau pola singgah beberapa titik. Isi km bermuatan dan km kosong secara terpisah.",
    detailEn:
      "For routes with a partial return load, a positioning leg, or a multi-stop pattern. Enter loaded and empty kilometres separately.",
  },
];

/** Menerjemahkan pola rute dan jarak satu arah menjadi km bermuatan dan km kosong. */
export function distancesForPattern(
  pattern: RoutePattern,
  oneWayKm: number,
): { loadedKmPerTrip: number; emptyKmPerTrip: number } {
  const distance = Math.max(0, oneWayKm);
  switch (pattern) {
    case "pp-bermuatan":
      return { loadedKmPerTrip: distance * 2, emptyKmPerTrip: 0 };
    case "pp-kosong":
      return { loadedKmPerTrip: distance, emptyKmPerTrip: distance };
    case "sekali-jalan":
      return { loadedKmPerTrip: distance, emptyKmPerTrip: 0 };
    case "manual":
      return { loadedKmPerTrip: distance, emptyKmPerTrip: 0 };
  }
}

/**
 * Angka awal yang ikut berubah ketika kelas armada diganti.
 *
 * Konsumsi bahan bakar, harga kendaraan, dan biaya ban tidak sedikit berbeda
 * antar kelas, melainkan berbeda berkali-kali lipat. Tractor head menempuh
 * sekitar 2,5 km per liter; CDD bisa tiga kali lipat itu. Satu set ban trailer
 * berharga belasan kali set ban truk ringan. Membiarkan satu angka bawaan
 * berlaku untuk seluruh kelas berarti kalkulator yang menampilkan hasil sangat
 * meleset segera setelah orang memilih armada selain yang kebetulan menjadi
 * dasar angka bawaan itu.
 *
 * Rentangnya di sini kasar dan memang begitu adanya. Konsumsi bahan bakar
 * ditentukan medan, gaya mengemudi, umur mesin, dan bobot muatan, dan tidak ada
 * angka terbitan yang berlaku untuk semua. Karena itu profil ini disebut titik
 * awal, bukan patokan, dan kolomnya tetap bisa ditimpa. Angka yang benar datang
 * dari catatan pengisian solar armada sendiri, dan itu dinyatakan terang-terangan
 * di halamannya.
 *
 * Yang membenarkan keberadaannya: profil kasar yang sesuai kelas jauh lebih
 * mendekati kebenaran daripada angka tractor head yang dipakaikan ke pickup.
 */
export interface FleetProfile {
  fuelKmPerLitreLoaded: number;
  fuelKmPerLitreEmpty: number;
  acquisitionPrice: number;
  /** Umur pakai satu set ban, dalam km. Besaran teknis, bukan uang. */
  tyreLifeKm: number;
  crewFixedPerYear: number;
}

const PROFILE_BY_CLASS: Record<string, FleetProfile> = {
  "Light Commercial": {
    fuelKmPerLitreLoaded: 11,
    fuelKmPerLitreEmpty: 13,
    acquisitionPrice: 200_000_000,
    tyreLifeKm: 50_000,
    crewFixedPerYear: 60_000_000,
  },
  "Light Truck": {
    fuelKmPerLitreLoaded: 8,
    fuelKmPerLitreEmpty: 10,
    acquisitionPrice: 400_000_000,
    tyreLifeKm: 60_000,
    crewFixedPerYear: 80_000_000,
  },
  "Medium Truck": {
    fuelKmPerLitreLoaded: 5.5,
    fuelKmPerLitreEmpty: 7,
    acquisitionPrice: 700_000_000,
    tyreLifeKm: 70_000,
    crewFixedPerYear: 96_000_000,
  },
  "Medium/Heavy Truck": {
    fuelKmPerLitreLoaded: 4.5,
    fuelKmPerLitreEmpty: 6,
    acquisitionPrice: 900_000_000,
    tyreLifeKm: 70_000,
    crewFixedPerYear: 108_000_000,
  },
  "Heavy Truck": {
    fuelKmPerLitreLoaded: 3.5,
    fuelKmPerLitreEmpty: 4.5,
    acquisitionPrice: 1_100_000_000,
    tyreLifeKm: 75_000,
    crewFixedPerYear: 120_000_000,
  },
  "Heavy/Special Truck": {
    fuelKmPerLitreLoaded: 3,
    fuelKmPerLitreEmpty: 4,
    acquisitionPrice: 1_400_000_000,
    tyreLifeKm: 75_000,
    crewFixedPerYear: 120_000_000,
  },
  "Specialized Rigid": {
    fuelKmPerLitreLoaded: 4,
    fuelKmPerLitreEmpty: 5,
    acquisitionPrice: 1_200_000_000,
    tyreLifeKm: 70_000,
    crewFixedPerYear: 120_000_000,
  },
  "Tractor-Semitrailer": {
    fuelKmPerLitreLoaded: 2.5,
    fuelKmPerLitreEmpty: 3.2,
    acquisitionPrice: 1_500_000_000,
    tyreLifeKm: 80_000,
    crewFixedPerYear: 120_000_000,
  },
  "Container Chassis": {
    fuelKmPerLitreLoaded: 2.5,
    fuelKmPerLitreEmpty: 3.2,
    acquisitionPrice: 1_500_000_000,
    tyreLifeKm: 80_000,
    crewFixedPerYear: 120_000_000,
  },
  "Semi-trailer Body": {
    fuelKmPerLitreLoaded: 2.5,
    fuelKmPerLitreEmpty: 3.2,
    acquisitionPrice: 1_600_000_000,
    tyreLifeKm: 80_000,
    crewFixedPerYear: 120_000_000,
  },
  "Special Trailer": {
    fuelKmPerLitreLoaded: 2,
    fuelKmPerLitreEmpty: 2.8,
    acquisitionPrice: 2_200_000_000,
    tyreLifeKm: 70_000,
    crewFixedPerYear: 144_000_000,
  },
  "Special Combination": {
    fuelKmPerLitreLoaded: 2,
    fuelKmPerLitreEmpty: 2.8,
    acquisitionPrice: 2_400_000_000,
    tyreLifeKm: 70_000,
    crewFixedPerYear: 144_000_000,
  },
  "Heavy Haul": {
    fuelKmPerLitreLoaded: 1.5,
    fuelKmPerLitreEmpty: 2.2,
    acquisitionPrice: 5_000_000_000,
    tyreLifeKm: 50_000,
    crewFixedPerYear: 200_000_000,
  },
  "Off-Highway": {
    fuelKmPerLitreLoaded: 1.2,
    fuelKmPerLitreEmpty: 1.8,
    acquisitionPrice: 6_000_000_000,
    tyreLifeKm: 40_000,
    crewFixedPerYear: 200_000_000,
  },
};

/**
 * Profil awal untuk sebuah kelas armada.
 *
 * Kelas yang tidak dikenal jatuh ke profil truk medium, bukan ke nol. Kolom
 * kosong pada harga kendaraan dan konsumsi bahan bakar akan membuat seluruh
 * hasil menjadi nol dan halamannya terlihat rusak; profil menengah setidaknya
 * menghasilkan angka yang bisa dikoreksi.
 */
export function fleetProfileForClass(mainClass: string): FleetProfile {
  return PROFILE_BY_CLASS[mainClass] || PROFILE_BY_CLASS["Medium Truck"];
}

/**
 * Pos perawatan sebagai porsi harga kendaraan.
 *
 * Ini cara yang lazim dipakai dalam analisis biaya armada, dan alasannya
 * praktis: biaya ban dan perawatan pada dasarnya memang mengikuti harga
 * kendaraan. Truk yang lebih mahal memakai ban yang lebih besar, suku cadang
 * yang lebih mahal, dan interval servis yang lebih menuntut. Menyimpannya
 * sebagai nominal rupiah berarti setiap kelas armada butuh angkanya sendiri,
 * dan setiap angka itu menjadi usang sendiri-sendiri; menyimpannya sebagai
 * persentase membuatnya ikut berskala begitu harga kendaraan diganti.
 *
 * Rasio di bawah ini adalah rasio perencanaan yang lazim, bukan standar
 * terbitan. Armada dengan disiplin perawatan yang baik dan rute yang ringan
 * berada di bawahnya; armada tua di medan berat berada jauh di atasnya.
 * Ketiganya bisa ditimpa di halaman.
 */
export interface MaintenanceRatios {
  /** Harga satu set ban sebagai porsi harga perolehan kendaraan. */
  tyreSetOfPrice: number;
  /** Biaya perawatan dan perbaikan setahun sebagai porsi harga perolehan. */
  maintenanceOfPricePerYear: number;
  /** Pelumas dan bahan habis pakai sebagai porsi biaya perawatan. */
  lubricantsOfMaintenance: number;
}

export const DEFAULT_MAINTENANCE_RATIOS: MaintenanceRatios = {
  tyreSetOfPrice: 0.06,
  maintenanceOfPricePerYear: 0.1,
  lubricantsOfMaintenance: 0.12,
};

/**
 * Menerjemahkan rasio perawatan menjadi nominal yang dipakai model biaya.
 *
 * Perawatan dinyatakan sebagai porsi harga per **tahun**, lalu dibagi kilometer
 * efektif setahun untuk menjadi biaya per kilometer. Pembagian itu yang membuat
 * rasio ini jujur: armada yang menempuh 150.000 km setahun menanggung biaya
 * perawatan tahunan yang sama seperti armada yang menempuh 60.000 km, sehingga
 * biaya per kilometernya memang lebih rendah. Menyatakannya langsung sebagai
 * rupiah per kilometer akan menyembunyikan hubungan itu.
 */
export function maintenanceFromRatios(
  acquisitionPrice: number,
  effectiveAnnualKm: number,
  ratios: MaintenanceRatios,
): { tyreSetCost: number; maintenancePerKm: number; lubricantsPerKm: number } {
  const tyreSetCost = acquisitionPrice * ratios.tyreSetOfPrice;
  const maintenancePerKm = safeDivide(acquisitionPrice * ratios.maintenanceOfPricePerYear, effectiveAnnualKm);
  return {
    tyreSetCost,
    maintenancePerKm,
    lubricantsPerKm: maintenancePerKm * ratios.lubricantsOfMaintenance,
  };
}

/** Pembagian yang mengembalikan 0 alih-alih Infinity, meniru IFERROR pada model asal. */
function safeDivide(numerator: number, denominator: number): number {
  if (!Number.isFinite(denominator) || denominator === 0) return 0;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : 0;
}

export function calculateFleetCost(input: FleetCostInput, isEn = false): FleetCostResult {
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
    breakdown: isEn
      ? [
          { label: "Fixed costs (depreciation, financing, salaries, overhead)", amount: fixedShare },
          { label: "Fuel", amount: fuelCostPerTrip },
          { label: "Tyres, maintenance, and lubricants", amount: runningShare },
          { label: "Toll, ferry, handling, crew allowance", amount: tripVariableCost },
        ]
      : [
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
  // Tol dan penyeberangan sengaja nol, bukan sekadar belum diisi. Angka bawaan
  // yang terlihat seperti tarif sungguhan akan ikut terbawa ke hasil oleh
  // sebagian orang tanpa pernah diperiksa, dan tarif jual yang lahir dari situ
  // salah tanpa satu pun kolom terlihat janggal. Kolom kosong menuntut
  // perhatian; angka yang meyakinkan justru menghindarinya.
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
  tollPerTrip: 0,
  ferryPerTrip: 0,
  handlingPerTrip: 500_000,
  parkingPerTrip: 200_000,
  crewAllowancePerTrip: 600_000,
  permitEscortPerTrip: 0,
  targetGrossMargin: 0.2,
};

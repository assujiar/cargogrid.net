/**
 * Berapa yang muat di satu kendaraan, dan aturan apa yang lebih dulu membatasi.
 *
 * Tiga hal membatasi setiap muatan, dan hampir semua perdebatan di halaman muat
 * sebenarnya adalah ketidaksepakatan tentang yang mana di antara ketiganya yang
 * sedang mengikat. Petugas muat melihat masih ada celah dan yakin satu palet
 * lagi masuk. Sopir yang nanti berhadapan dengan jembatan timbang melihat
 * persoalan yang sama sekali berbeda. Dan keduanya bisa sama-sama benar tentang
 * ruang dan berat, lalu sama-sama keliru soal kelas jalan yang dilewati.
 *
 * Karena itu modul ini tidak pernah mengembalikan satu angka "muat sekian". Ia
 * mengembalikan ketiga batas dan menyebut mana yang mengikat, sebab justru itu
 * fakta yang menentukan tindakan berikutnya.
 *
 * Geometrinya sengaja yang paling sederhana: coba enam cara mendirikan kardus,
 * ambil `floor(P/p) x floor(L/l) x floor(T/t)` terbaik. Kru muat berpengalaman
 * mencampur arah dan mengalahkan angka ini. Itu disengaja -- menampilkan
 * susunan yang lebih pintar daripada yang sanggup dibangun halaman gudang akan
 * memasukkan angka yang tidak bisa ditepati ke dalam penawaran.
 */

import type { Dimensions } from "./volume";
import { cbmPerPiece, dimsInMetres } from "./volume";
import type { VehicleArchetype } from "../../content/reference/vehicles";
import { DIMENSION_LIMITS, ROAD_CLASSES, type RoadClass } from "../../content/reference/regulations";

export interface LoadPlanInput {
  carton: Dimensions;
  weightPerCarton: number;
  /** Ruang muat bagian dalam, dalam meter. */
  body: { length: number; width: number; height: number };
  /** Batas berat muatan yang dipakai, dalam kg. */
  payloadKg: number;
  /** Jumlah kardus yang benar-benar ingin dikirim. Opsional. */
  desiredQuantity?: number;
  /** Boleh direbahkan? Matikan untuk barang bertanda this way up. */
  allowRotation: boolean;
}

export interface LoadPlan {
  /** Jumlah terbaik dari geometri saja, mengabaikan berat. */
  fitByVolume: number;
  /** Jumlah terbaik dari batas berat saja, mengabaikan bentuk. */
  fitByWeight: number;
  /** Yang benar-benar bisa dimuat. */
  maxCartons: number;
  limitedBy: "volume" | "weight" | "both" | "none";
  perLayer: number;
  layers: number;
  cartonCbm: number;
  usedCbm: number;
  bodyCbm: number;
  volumeUtilisation: number;
  loadedWeight: number;
  weightUtilisation: number;
  /** Unit yang dibutuhkan untuk mengangkut `desiredQuantity`. */
  trucksNeeded: number | null;
  /** Kardus yang naik ke unit terakhir. */
  remainderCartons: number | null;
}

/** Enam cara sebuah kardus persegi bisa berdiri. */
function orientations(l: number, w: number, h: number): Array<[number, number, number]> {
  return [
    [l, w, h],
    [w, l, h],
    [l, h, w],
    [h, l, w],
    [w, h, l],
    [h, w, l],
  ];
}

export function planLoad(input: LoadPlanInput): LoadPlan {
  const cartonCbm = cbmPerPiece(input.carton);
  const bodyCbm = input.body.length * input.body.width * input.body.height;

  // Ruang muat selalu dinyatakan dalam meter, jadi kardus dikonversi lebih dulu
  // sebelum satu perbandingan pun dilakukan. Pengguna mengetik ukuran kardus
  // dalam sentimeter dan ruang muat dalam meter tanpa sadar berpindah satuan,
  // dan ketidakcocokan itu tidak memunculkan error -- ia diam-diam melaporkan
  // bahwa seratus palet muat.
  const { length: cl, width: cw, height: ch } = dimsInMetres(input.carton);

  const candidates = input.allowRotation ? orientations(cl, cw, ch) : [[cl, cw, ch] as [number, number, number]];

  let best = { perLayer: 0, layers: 0, total: 0 };
  for (const [a, b, c] of candidates) {
    if (a <= 0 || b <= 0 || c <= 0) continue;
    const alongLength = Math.floor(input.body.length / a);
    const alongWidth = Math.floor(input.body.width / b);
    const stacked = Math.floor(input.body.height / c);
    const perLayer = alongLength * alongWidth;
    const total = perLayer * stacked;
    if (total > best.total) best = { perLayer, layers: stacked, total };
  }

  const fitByVolume = best.total;
  const fitByWeight =
    input.weightPerCarton > 0 ? Math.floor(input.payloadKg / input.weightPerCarton) : Number.POSITIVE_INFINITY;

  const maxCartons = Math.max(0, Math.min(fitByVolume, fitByWeight));

  let limitedBy: LoadPlan["limitedBy"] = "none";
  if (maxCartons === 0) limitedBy = "none";
  else if (fitByVolume === fitByWeight) limitedBy = "both";
  else if (fitByVolume < fitByWeight) limitedBy = "volume";
  else limitedBy = "weight";

  const usedCbm = maxCartons * cartonCbm;
  const loadedWeight = maxCartons * input.weightPerCarton;

  let trucksNeeded: number | null = null;
  let remainderCartons: number | null = null;
  if (input.desiredQuantity && input.desiredQuantity > 0 && maxCartons > 0) {
    trucksNeeded = Math.ceil(input.desiredQuantity / maxCartons);
    const onLast = input.desiredQuantity % maxCartons;
    remainderCartons = onLast === 0 ? maxCartons : onLast;
  }

  return {
    fitByVolume,
    fitByWeight: Number.isFinite(fitByWeight) ? fitByWeight : 0,
    maxCartons,
    limitedBy,
    perLayer: best.perLayer,
    layers: best.layers,
    cartonCbm,
    usedCbm,
    bodyCbm,
    volumeUtilisation: bodyCbm > 0 ? usedCbm / bodyCbm : 0,
    loadedWeight,
    weightUtilisation: input.payloadKg > 0 ? loadedWeight / input.payloadKg : 0,
    trucksNeeded,
    remainderCartons,
  };
}

export type ComplianceLevel = "ok" | "periksa" | "langgar";

export interface ComplianceCheck {
  level: ComplianceLevel;
  title: string;
  detail: string;
}

export interface ComplianceInput {
  vehicle: VehicleArchetype;
  /** Kelas jalan pada rute yang dilalui. */
  roadClass: RoadClass;
  /** Berat muatan yang direncanakan, kg. */
  loadedWeightKg: number;
  /** Batas berat muatan yang dipakai pengguna, kg. */
  payloadLimitKg: number;
  bodyWidthM: number;
}

/**
 * Pemeriksaan terhadap batas yang berlaku di jalan, bukan di halaman gudang.
 *
 * Ini bagian yang membuat kalkulator berhenti menjadi kalkulator ruang belaka.
 * Menghitung berapa kardus yang muat itu aritmetika; menjawab apakah muatan itu
 * boleh berjalan di rute tersebut adalah pertanyaan yang sebenarnya.
 *
 * Nadanya sengaja tidak menghakimi. Alat ini tidak tahu STNK unit yang dipakai,
 * tidak tahu berat kosongnya setelah karoseri, dan tidak tahu izin rutenya --
 * jadi ia menyebut apa yang perlu diperiksa dan ke mana angka pastinya harus
 * dicari, alih-alih menyatakan sesuatu sah atau tidak sah.
 */
export function checkCompliance(input: ComplianceInput): ComplianceCheck[] {
  const checks: ComplianceCheck[] = [];
  const { vehicle, roadClass } = input;

  const payloadMaxKg = vehicle.planningPayload.max * 1000;
  if (input.loadedWeightKg > payloadMaxKg) {
    checks.push({
      level: "periksa",
      title: "Muatan melampaui perkiraan kapasitas kelas ini",
      detail: `Rencana muat ${Math.round(input.loadedWeightKg).toLocaleString("id-ID")} kg berada di atas perkiraan batas atas kelas ini, sekitar ${payloadMaxKg.toLocaleString("id-ID")} kg. Perkiraan ini bukan angka legal — yang mengikat adalah JBI pada dokumen kendaraan dikurangi berat kosongnya setelah karoseri. Pastikan ke STNK dan hasil uji berkala unit yang dipakai.`,
    });
  }

  if (input.bodyWidthM > DIMENSION_LIMITS.widthM) {
    checks.push({
      level: "langgar",
      title: "Lebar ruang muat melebihi batas kendaraan",
      detail: `Lebar maksimum kendaraan bermotor adalah ${DIMENSION_LIMITS.widthM} meter. Ruang muat bagian dalam tidak mungkin lebih lebar daripada kendaraannya sendiri, jadi angka ${input.bodyWidthM} meter kemungkinan besar salah ketik atau salah satuan.`,
    });
  } else if (input.bodyWidthM > roadClass.maxWidthM) {
    checks.push({
      level: "langgar",
      title: `Terlalu lebar untuk jalan ${roadClass.code}`,
      detail: `${roadClass.code} membatasi lebar kendaraan sampai ${roadClass.maxWidthM} meter, sedangkan ruang muat yang dipilih sudah ${input.bodyWidthM} meter sebelum menghitung tebal dinding bodi. Bodi standar 2,4 sampai 2,5 meter tidak bisa melewati ruas jalan kelas ini.`,
    });
  }

  if (vehicle.overallLengthM && vehicle.overallLengthM > roadClass.maxLengthM) {
    checks.push({
      level: "langgar",
      title: `Terlalu panjang untuk jalan ${roadClass.code}`,
      detail: `Panjang keseluruhan kelas armada ini sekitar ${vehicle.overallLengthM} meter, sementara ${roadClass.code} membatasi sampai ${roadClass.maxLengthM} meter. Pilih armada lain, atau pastikan rutenya melewati kelas jalan yang lebih tinggi.`,
    });
  }

  // MST membatasi berat per sumbu, bukan berat total, jadi yang bisa dilakukan
  // di sini hanyalah menunjukkan batas kasar dan menyebut apa yang menentukan
  // sesungguhnya. Menampilkan angka lolos/tidak lolos yang seolah pasti akan
  // lebih berbahaya daripada tidak memeriksa sama sekali.
  const axles = Number(vehicle.totalAxles);
  if (Number.isFinite(axles) && axles > 0) {
    const roughAxleLimitKg = axles * roadClass.mstTon * 1000;
    checks.push({
      level: input.loadedWeightKg > roughAxleLimitKg ? "periksa" : "ok",
      title: `Muatan sumbu terberat di jalan ${roadClass.code}`,
      detail: `${roadClass.code} membatasi muatan sumbu terberat ${roadClass.mstTon} ton. Dengan ${axles} sumbu, batas kasar berat totalnya sekitar ${roughAxleLimitKg.toLocaleString("id-ID")} kg — tetapi MST membatasi per sumbu, bukan total, dan distribusi muatan di atas bak yang menentukan. Muatan yang menumpuk di belakang bisa melanggar meski berat totalnya masih aman.`,
    });
  }

  checks.push({
    level: "ok",
    title: "Golongan tol dan penyeberangan",
    detail: `Kelas armada ini umumnya masuk golongan tol ${vehicle.tollClass} dan golongan penyeberangan ${vehicle.ferryClass}. Golongan tol mengikuti jumlah gandar, golongan penyeberangan mengikuti panjang keseluruhan — dua logika yang berbeda, dan keduanya perlu masuk perhitungan biaya rute.`,
  });

  return checks;
}

export function defaultRoadClass(): RoadClass {
  return ROAD_CLASSES[0];
}

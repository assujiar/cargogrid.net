/**
 * ISO container specifications.
 *
 * Every figure below is *typical*, and the distinction is not a disclaimer , 
 * it is the single most useful thing this page can teach. Tare weight varies by
 * several hundred kilograms between builds of the same nominal box, and maximum
 * payload is therefore not a property of "a 20 ft container" at all; it is a
 * property of the individual unit, printed on the CSC plate riveted to its right
 * door. People plan a 28-tonne load from a table like this one, and discover the
 * discrepancy at the weighbridge.
 *
 * So the table exists to answer the question it is genuinely good for, will
 * this cargo physically go in, and roughly what class of box do I need, and
 * says plainly where the authoritative number lives.
 */

export interface ContainerSpec {
  id: string;
  /** Already the international container name ("40 ft High Cube (40' HC)"); no English twin needed. */
  name: string;
  /** ISO size/type code, e.g. 22G1. Useful when reading a bayplan or an EDI message. */
  isoCode: string;
  /** Internal usable dimensions in metres. */
  inner: { length: number; width: number; height: number };
  /** Door aperture in metres. The constraint that actually stops oversized cargo. */
  door: { width: number; height: number } | null;
  /** Nominal internal capacity in m3. */
  capacityCbm: number;
  /**
   * Whether cubic capacity is the right way to think about this box.
   *
   * False for open top and flat rack: both carry cargo that is loaded from
   * above or overhangs the envelope, and is planned by footprint, height and
   * lashing rather than by cube. Printing a tidy m3 figure and an "85%
   * realistic" stowage number beside it invents a planning basis nobody uses.
   */
  volumeIsPlanningBasis: boolean;
  /**
   * Berat kosong dan berat kotor maksimum, bila operatornya menerbitkan keduanya.
   *
   * `null` untuk reefer, open top, dan flat rack, dan itu bukan kelalaian
   * pengisian data: spesifikasi resminya memang menyebut kedua angka ini
   * berbeda per unit dan hanya menerbitkan payload-nya. Mengarang berat kosong
   * agar kolomnya terisi akan menghasilkan tabel yang terlihat lebih lengkap
   * dan justru lebih menyesatkan -- persis kesalahan yang pemeriksaan di bawah
   * ini temukan ketika angka reefer pertama kali dimasukkan.
   */
  tareKg: number | null;
  maxGrossKg: number | null;
  /**
   * Payload sebagaimana diterbitkan operator, bukan hasil hitungan sendiri.
   *
   * Awalnya angka ini diturunkan dari berat kotor dikurangi berat kosong,
   * dengan alasan yang masuk akal: turunan tidak bisa berselisih dengan
   * sumbernya. Alasan itu gugur begitu spesifikasi resmi tersedia untuk reefer
   * dan open top, yang menerbitkan payload tanpa menerbitkan berat kosongnya.
   * Menyimpan angka terbitan lalu memeriksanya terhadap turunan pada saat build
   * memberi keduanya sekaligus -- lihat assertContainerIntegrity di bawah.
   */
  payloadKg: number;
  useFor: string;
  useForEn: string;
  caution: string;
  cautionEn: string;
}

export const CONTAINER_SPECS: ContainerSpec[] = [
  {
    id: "20gp",
    volumeIsPlanningBasis: true,
    name: "20 ft General Purpose (20' DC)",
    isoCode: "22G1",
    inner: { length: 5.896, width: 2.35, height: 2.393 },
    door: { width: 2.34, height: 2.28 },
    capacityCbm: 33,
    tareKg: 2280,
    maxGrossKg: 30480,
    payloadKg: 28200,
    useFor:
      "Kargo padat: keramik, bahan kimia dalam drum, suku cadang logam, kertas. Barang yang lebih dulu habis batas beratnya sebelum habis ruangnya.",
    useForEn:
      "Dense cargo: ceramics, chemicals in drums, metal parts, paper. Freight that maxes out on weight before it maxes out on space.",
    caution:
      "Ruangnya jarang terpakai penuh untuk barang berat. Banyak pelayaran juga membatasi berat kotor di bawah 30.480 kg mengikuti aturan jalan negara tujuan.",
    cautionEn:
      "The cube is rarely filled for heavy cargo. Many carriers also cap gross weight below 30,480 kg to comply with the destination country's road regulations.",
  },
  {
    id: "40gp",
    volumeIsPlanningBasis: true,
    name: "40 ft General Purpose (40' DC)",
    isoCode: "42G1",
    inner: { length: 12.032, width: 2.35, height: 2.393 },
    door: { width: 2.34, height: 2.28 },
    capacityCbm: 67,
    tareKg: 3700,
    maxGrossKg: 32500,
    payloadKg: 28800,
    useFor: "Kargo bervolume dengan berat sedang: barang jadi berkardus, furnitur, komponen otomotif.",
    useForEn: "Voluminous cargo of moderate weight: cartoned finished goods, furniture, automotive components.",
    caution:
      "Ruangnya dua kali lipat 20 kaki, batas beratnya praktis sama. Untuk barang padat, dua unit 20 kaki mengangkut sekitar dua kali lipat tonase satu unit 40 kaki.",
    cautionEn:
      "The cube is double that of a 20 ft box, but the weight limit is practically the same. For dense cargo, two 20 ft units carry roughly twice the tonnage of one 40 ft unit.",
  },
  {
    id: "40hc",
    volumeIsPlanningBasis: true,
    name: "40 ft High Cube (40' HC)",
    isoCode: "45G1",
    inner: { length: 12.032, width: 2.35, height: 2.697 },
    door: { width: 2.34, height: 2.58 },
    capacityCbm: 76,
    tareKg: 3880,
    maxGrossKg: 32500,
    payloadKg: 28620,
    useFor:
      "Barang ringan bervolume besar: tekstil, kemasan plastik, foam, produk konsumen. Tambahan 30 cm tinggi memberi sekitar 9 m3 ekstra tanpa tambahan berat.",
    useForEn:
      "Light, high-volume goods: textiles, plastic packaging, foam, consumer products. The extra 30 cm of height adds roughly 9 m3 of capacity at no weight penalty.",
    caution:
      "Tinggi totalnya 2,90 m. Periksa batas tinggi rute darat, jembatan, dan pintu gudang tujuan sebelum memesan, terutama untuk pengiriman ke area industri lama.",
    cautionEn:
      "Overall height is 2.90 m. Check road route height clearances, bridges, and destination warehouse door heights before booking, especially for deliveries into older industrial areas.",
  },
  {
    id: "45hc",
    volumeIsPlanningBasis: true,
    name: "45 ft High Cube (45' HC)",
    isoCode: "L5G1",
    inner: { length: 13.556, width: 2.352, height: 2.698 },
    door: { width: 2.34, height: 2.58 },
    capacityCbm: 85,
    tareKg: 4900,
    maxGrossKg: 32500,
    payloadKg: 27600,
    useFor: "Muatan bervolume sangat besar pada rute yang menyediakannya.",
    useForEn: "Very high-volume cargo on routes where the equipment is available.",
    caution:
      "Ketersediaan terbatas di banyak rute Indonesia, dan tidak semua chassis trailer bisa membawanya. Pastikan ketersediaan armada darat sebelum membooking.",
    cautionEn:
      "Availability is limited on many Indonesian routes, and not every trailer chassis can carry it. Confirm inland haulage equipment availability before booking.",
  },
  {
    id: "20rf",
    volumeIsPlanningBasis: true,
    name: "20 ft Reefer",
    isoCode: "22R1",
    inner: { length: 5.44, width: 2.29, height: 2.27 },
    door: { width: 2.29, height: 2.26 },
    capacityCbm: 28.3,
    tareKg: null,
    maxGrossKg: null,
    payloadKg: 27770,
    useFor: "Barang berpendingin dan beku: hasil laut, hortikultura, farmasi, produk susu.",
    useForEn: "Chilled and frozen cargo: seafood, horticultural produce, pharmaceuticals, dairy products.",
    caution:
      "Ruang dalamnya jauh lebih kecil daripada 20 ft biasa karena unit pendingin dan insulasi memakan tempat. Jangan menghitung kubikasi memakai angka dry container.",
    cautionEn:
      "Internal volume is significantly smaller than a standard 20 ft box, since the refrigeration unit and insulation take up space. Do not calculate cube using dry container figures.",
  },
  {
    id: "40rf",
    volumeIsPlanningBasis: true,
    name: "40 ft Reefer High Cube",
    isoCode: "45R1",
    inner: { length: 11.58, width: 2.29, height: 2.5 },
    door: { width: 2.29, height: 2.49 },
    capacityCbm: 67.5,
    tareKg: null,
    maxGrossKg: null,
    payloadKg: 29670,
    useFor: "Ekspor rantai dingin bervolume: udang, tuna, buah, produk olahan beku.",
    useForEn: "High-volume cold chain exports: shrimp, tuna, fruit, frozen processed products.",
    caution:
      "Butuh pasokan listrik atau genset selama seluruh perjalanan darat. Biaya genset dan monitoring suhu sering terlupa dari costing dan langsung menggerus margin.",
    cautionEn:
      "Requires a power supply or genset for the entire inland journey. Genset costs and temperature monitoring are frequently left out of costing and go straight to eroding margin.",
  },
  {
    id: "20ot",
    volumeIsPlanningBasis: false,
    name: "20 ft Open Top",
    isoCode: "22U1",
    inner: { length: 5.9, width: 2.35, height: 2.35 },
    door: { width: 2.34, height: 2.28 },
    capacityCbm: 32.0,
    tareKg: null,
    maxGrossKg: null,
    payloadKg: 28400,
    useFor: "Barang yang harus dimuat dari atas dengan crane: mesin, marmer, pipa panjang.",
    useForEn: "Cargo that must be top-loaded by crane: machinery, marble, long pipes.",
    caution:
      "Atapnya hanya terpal dan palang. Muatan yang menonjol di atas garis atap kena biaya out of gauge, dan tarifnya tidak sebanding dengan tarif kontainer biasa.",
    cautionEn:
      "The roof is only a tarpaulin over removable bows. Cargo protruding above the roofline is charged as out of gauge, and the rate is not comparable to standard container rates.",
  },
  {
    id: "40fr",
    volumeIsPlanningBasis: false,
    name: "40 ft Flat Rack",
    isoCode: "45P1",
    inner: { length: 12.06, width: 2.4, height: 2.14 },
    door: null,
    capacityCbm: 62.0,
    tareKg: null,
    maxGrossKg: null,
    payloadKg: 40000,
    useFor: "Alat berat, transformator, boat, mesin produksi yang melebihi lebar atau tinggi kontainer biasa.",
    useForEn:
      "Heavy machinery, transformers, boats, production equipment exceeding the width or height of a standard container.",
    caution:
      "Tarifnya dihitung sebagai proyek, bukan per kontainer. Lashing dan surveyor wajib, dan slot kapal harus dipesan jauh lebih awal.",
    cautionEn:
      "Rates are quoted as a project, not per container. Lashing and a surveyor are mandatory, and vessel space must be booked well in advance.",
  },
];

export function payloadKg(spec: ContainerSpec): number {
  return spec.payloadKg;
}

/**
 * Setiap payload yang diterbitkan harus cocok dengan berat kotor dikurangi
 * berat kosong, dalam toleransi pembulatan 100 kg.
 *
 * Ini menangkap satu kelas kesalahan yang tidak akan terlihat saat dibaca:
 * memperbarui berat kotor sebuah tipe kontainer tanpa memperbarui payload-nya.
 * Halaman tetap tampil rapi, tabelnya tetap terbaca masuk akal, dan angkanya
 * salah beberapa ratus kilogram -- persis pada kolom yang orang pakai untuk
 * memutuskan berapa ton yang akan mereka muat.
 */
function assertContainerIntegrity(): void {
  for (const spec of CONTAINER_SPECS) {
    if (spec.capacityCbm <= 0) throw new Error(`Container ${spec.id} has a non-positive capacity`);
    if (!spec.useForEn.trim()) throw new Error(`Container ${spec.id}: useForEn is empty`);
    if (!spec.cautionEn.trim()) throw new Error(`Container ${spec.id}: cautionEn is empty`);
    if (spec.tareKg === null || spec.maxGrossKg === null) continue;

    const derived = spec.maxGrossKg - spec.tareKg;
    if (Math.abs(derived - spec.payloadKg) > 100) {
      throw new Error(
        `Container ${spec.id}: payload ${spec.payloadKg} kg disagrees with maxGross - tare (${derived} kg)`,
      );
    }
  }
}

assertContainerIntegrity();

/**
 * Loadable volume after stowage losses.
 *
 * Nobody achieves nominal capacity. Cartons do not tile a box perfectly, pallets
 * waste the gaps between footprints, and dunnage takes its share. Quoting 33,2
 * CBM to a customer and then fitting 27 is a routine way to lose money on an
 * LCL consolidation, so the realistic figure is shown next to the nominal one
 * rather than left as folklore.
 */
export function practicalCbm(spec: ContainerSpec, utilisation = 0.85): number {
  return spec.capacityCbm * utilisation;
}

/**
 * Aturan dimensi, kelas jalan, golongan tol, dan golongan penyeberangan.
 *
 * Berkas ini adalah bagian yang membuat kalkulator muatan berhenti menjadi
 * kalkulator ruang belaka. Menghitung berapa kardus yang muat itu aritmetika;
 * menjawab apakah muatan itu boleh berjalan di rute tersebut adalah pertanyaan
 * yang sebenarnya, dan jawabannya ada pada empat aturan berikut.
 *
 * Yang membedakan sumber-sumber ini dari kebanyakan tabel di internet: tarifnya
 * tidak ada di sini. Golongan tol dan golongan penyeberangan adalah klasifikasi
 * permanen; tarifnya berubah per ruas jalan, per lintasan, dan per tanggal
 * berlaku. Menanam satu tarif nasional ke dalam kode berarti menerbitkan angka
 * yang salah dan tidak akan ada yang tahu kapan mulai salahnya. Jadi yang
 * disimpan hanya klasifikasinya, dan tarif dibiarkan menjadi masukan pengguna.
 */

export interface RegulationRule {
  topic: string;
  parameter: string;
  rule: string;
  basis: string;
}

/** Kategori kendaraan barang dan kereta menurut PP 55/2012. */
export const VEHICLE_CATEGORIES: RegulationRule[] = [
  { topic: "Kendaraan barang", parameter: "N1", rule: "Kendaraan barang dengan JBB sampai dengan 3.500 kg.", basis: "PP 55/2012" },
  { topic: "Kendaraan barang", parameter: "N2", rule: "Kendaraan barang dengan JBB di atas 3.500 kg sampai dengan 12.000 kg.", basis: "PP 55/2012" },
  { topic: "Kendaraan barang", parameter: "N3", rule: "Kendaraan barang dengan JBB di atas 12.000 kg.", basis: "PP 55/2012" },
  { topic: "Kereta gandengan/tempelan", parameter: "O1", rule: "JBKB sampai dengan 750 kg.", basis: "PP 55/2012" },
  { topic: "Kereta gandengan/tempelan", parameter: "O2", rule: "JBKB di atas 750 kg sampai dengan 3.500 kg.", basis: "PP 55/2012" },
  { topic: "Kereta gandengan/tempelan", parameter: "O3", rule: "JBKB di atas 3.500 kg sampai dengan 10.000 kg.", basis: "PP 55/2012" },
  { topic: "Kereta gandengan/tempelan", parameter: "O4", rule: "JBKB di atas 10.000 kg.", basis: "PP 55/2012" },
];

/**
 * Batas dimensi kendaraan bermotor.
 *
 * Angka-angka ini yang membuat kalkulator bisa menolak sebuah rencana muat,
 * bukan sekadar menghitungnya.
 */
export const DIMENSION_LIMITS = {
  rigidLengthM: 12.0,
  combinationLengthM: 18.0,
  widthM: 2.5,
  heightM: 4.2,
  /** Tinggi juga dibatasi 1,7 kali lebar kendaraan, mana yang lebih rendah. */
  heightWidthRatio: 1.7,
  rearOverhangOfWheelbase: 0.625,
  frontOverhangOfWheelbase: 0.475,
} as const;

export const DIMENSION_RULES: RegulationRule[] = [
  { topic: "Dimensi", parameter: "Panjang kendaraan tunggal", rule: "Maksimum 12,0 meter.", basis: "PP 55/2012 Pasal 54" },
  { topic: "Dimensi", parameter: "Panjang rangkaian", rule: "Maksimum 18,0 meter untuk kendaraan dengan kereta gandengan atau tempelan.", basis: "PP 55/2012 Pasal 54" },
  { topic: "Dimensi", parameter: "Lebar", rule: "Maksimum 2,5 meter.", basis: "PP 55/2012 Pasal 54" },
  {
    topic: "Dimensi",
    parameter: "Tinggi",
    rule: "Maksimum 4,2 meter dan tidak lebih dari 1,7 kali lebar kendaraan. Truk berbadan sempit karena itu punya batas tinggi lebih rendah daripada 4,2 meter.",
    basis: "PP 55/2012 Pasal 54",
  },
  { topic: "Julur", parameter: "Julur belakang", rule: "Maksimum 62,5% dari jarak sumbu.", basis: "PP 55/2012 Pasal 55" },
  { topic: "Julur", parameter: "Julur depan", rule: "Maksimum 47,5% dari jarak sumbu.", basis: "PP 55/2012 Pasal 55" },
];

export const WEIGHT_CONCEPTS: RegulationRule[] = [
  {
    topic: "Konsep berat",
    parameter: "JBB / JBKB",
    rule: "Batas berat menurut rancangan pabrikan. Ini rating teknis, dan tidak dengan sendirinya menjadi berat operasional yang sah di jalan.",
    basis: "PP 55/2012",
  },
  {
    topic: "Konsep berat",
    parameter: "JBI / JBKI",
    rule: "Berat operasional yang diizinkan, dengan memperhitungkan berat kosong, rating rancangan, dimensi dan bodi, kelas jalan, serta beban sumbu. JBI selalu lebih kecil atau sama dengan JBB.",
    basis: "PP 55/2012",
  },
  {
    topic: "Payload legal",
    parameter: "Cara menghitungnya",
    rule: "Payload legal adalah JBI atau JBKI yang berlaku dikurangi berat kosong kendaraan setelah karoseri terpasang, dikurangi awak, bahan bakar, dan perlengkapan. Bukan angka payload di brosur.",
    basis: "PP 55/2012",
  },
];

export interface RoadClass {
  code: string;
  /** `null` pada kelas khusus, yang batasnya ditetapkan per izin. */
  maxWidthM: number | null;
  maxLengthM: number | null;
  maxHeightM: number | null;
  /** Muatan Sumbu Terberat, dalam ton. `null` bila ditetapkan per izin. */
  mstTon: number | null;
  note: string;
}

/**
 * Kelas jalan.
 *
 * Ini penjelasan dari fakta yang membingungkan banyak orang: truk yang sama
 * bisa sah membawa satu tonase di satu rute dan melanggar di rute lain. Yang
 * membatasi bukan truknya, melainkan jalannya.
 */
export const ROAD_CLASSES: RoadClass[] = [
  {
    code: "Kelas I",
    maxWidthM: 2.5,
    maxLengthM: 18,
    maxHeightM: 4.2,
    mstTon: 10,
    note: "Jalan arteri dan kolektor tertentu. Satu-satunya kelas yang menampung rangkaian penuh 18 meter.",
  },
  {
    code: "Kelas II",
    maxWidthM: 2.5,
    maxLengthM: 12,
    maxHeightM: 4.2,
    mstTon: 8,
    note: "Panjang terbatas pada kendaraan tunggal. Rangkaian trailer tidak masuk kelas ini.",
  },
  {
    code: "Kelas III",
    maxWidthM: 2.1,
    maxLengthM: 9,
    maxHeightM: 3.5,
    mstTon: 8,
    note: "Batas lebar 2,1 meter menyingkirkan hampir semua bodi standar 2,4-2,5 meter. Periksa sebelum menjanjikan pengantaran ke lokasi yang dilayani jalan kelas ini.",
  },
  {
    // Deliberately without numbers. This class exists precisely for vehicles
    // whose dimensions or axle loads exceed the ordinary classes, so copying
    // Kelas I's figures into it stated the opposite of what it means, and
    // contradicted the note sitting in the very next cell.
    code: "Kelas khusus",
    maxWidthM: null,
    maxLengthM: null,
    maxHeightM: null,
    mstTon: null,
    note: "Untuk kendaraan yang dimensi atau beban sumbunya melampaui kelas biasa, hanya pada ruas jalan yang ditetapkan dan dengan izin tersendiri. Batasnya ditetapkan per izin, bukan lewat satu angka umum.",
  },
];

export interface TollClass {
  golongan: string;
  description: string;
  rule: string;
  note: string;
}

/**
 * Golongan tol menurut Kepmen PUPR 176/KPTS/M/2025.
 *
 * Yang perlu diingat: golongan menentukan kendaraan masuk kelompok tarif mana,
 * bukan berapa tarifnya. Tarif berbeda per ruas jalan tol dan per tanggal
 * berlaku, sehingga harus disimpan sebagai tabel tersendiri, bukan ditanam.
 */
export const TOLL_CLASSES: TollClass[] = [
  {
    golongan: "Golongan I",
    description: "Sedan, jip, pickup, truk kecil, dan bus.",
    rule: "Ditentukan jenis kendaraan. Pickup dan truk kecil tetap Golongan I.",
    note: "Untuk truk ringan yang berada di batas, periksa klasifikasi pada STNK dan penetapan operator.",
  },
  {
    golongan: "Golongan II",
    description: "Truk dengan 2 gandar.",
    rule: "Jumlah gandar total 2.",
    note: "Truk rigid medium dan berat berkonfigurasi 4x2 umumnya di sini. Perhatikan: jumlah roda bukan jumlah gandar, CDD berroda enam tetap bergandar dua.",
  },
  {
    golongan: "Golongan III",
    description: "Truk dengan 3 gandar.",
    rule: "Jumlah gandar total 3.",
    note: "Truk rigid 6x2 dan 6x4 umumnya di sini.",
  },
  {
    golongan: "Golongan IV",
    description: "Truk dengan 4 gandar.",
    rule: "Jumlah gandar total 4.",
    note: "Rigid 8x2 dan 8x4, atau rangkaian bergandar empat.",
  },
  {
    golongan: "Golongan V",
    description: "Truk dengan 5 gandar atau lebih.",
    rule: "Jumlah gandar total 5 ke atas.",
    note: "Sebagian besar rangkaian tractor head dengan semi-trailer bergandar tiga.",
  },
];

export interface FerryClass {
  golongan: string;
  vehicleType: string;
  lengthBand: string;
  note: string;
}

/**
 * Golongan penyeberangan.
 *
 * Logikanya sama sekali berbeda dari golongan tol, dan ini sumber kesalahan
 * costing yang lumayan sering: penyeberangan menggolongkan berdasarkan
 * **panjang keseluruhan** kendaraan serta fungsinya, bukan jumlah gandar. Truk
 * bergandar dua yang panjang bisa masuk golongan lebih tinggi daripada truk
 * bergandar tiga yang pendek.
 */
export const FERRY_CLASSES: FerryClass[] = [
  { golongan: "Golongan I", vehicleType: "Sepeda", lengthBand: ", ", note: "Tidak bermotor." },
  { golongan: "Golongan II", vehicleType: "Gerobak dan sepeda motor di bawah 500 cc", lengthBand: "Umumnya di bawah 5 m", note: "Kendaraan kecil." },
  { golongan: "Golongan III", vehicleType: "Kendaraan roda tiga dan sepeda motor 500 cc ke atas", lengthBand: "Umumnya di bawah 5 m", note: "Bermotor." },
  { golongan: "Golongan IV-A", vehicleType: "Kendaraan penumpang", lengthBand: "Sampai dengan 5 m", note: "Fungsi penumpang." },
  { golongan: "Golongan IV-B", vehicleType: "Kendaraan barang", lengthBand: "Sampai dengan 5 m", note: "Pickup dan blind van umumnya di sini." },
  { golongan: "Golongan V-A", vehicleType: "Kendaraan penumpang", lengthBand: "Di atas 5 m sampai 7 m", note: "Fungsi penumpang." },
  { golongan: "Golongan V-B", vehicleType: "Kendaraan barang", lengthBand: "Di atas 5 m sampai 7 m", note: "Truk ringan seperti CDE dan CDD standar umumnya di sini." },
  { golongan: "Golongan VI-A", vehicleType: "Kendaraan penumpang", lengthBand: "Di atas 7 m sampai 10 m", note: "Bus." },
  { golongan: "Golongan VI-B", vehicleType: "Kendaraan barang", lengthBand: "Di atas 7 m sampai 10 m", note: "Truk medium dan CDD long umumnya di sini." },
  { golongan: "Golongan VII", vehicleType: "Kendaraan barang termasuk rangkaian", lengthBand: "Di atas 10 m sampai 12 m", note: "Tronton dan rigid panjang." },
  { golongan: "Golongan VIII", vehicleType: "Kendaraan barang termasuk rangkaian dan alat berat", lengthBand: "Di atas 12 m sampai 16 m", note: "Rangkaian trailer pendek." },
  { golongan: "Golongan IX", vehicleType: "Kendaraan barang termasuk rangkaian dan alat berat", lengthBand: "Di atas 16 m", note: "Rangkaian tractor head dengan semi-trailer 40 kaki dan sejenisnya." },
];

/** Menggolongkan panjang keseluruhan ke golongan penyeberangan kendaraan barang. */
export function ferryClassForLength(lengthM: number): FerryClass {
  if (lengthM <= 5) return FERRY_CLASSES.find((f) => f.golongan === "Golongan IV-B")!;
  if (lengthM <= 7) return FERRY_CLASSES.find((f) => f.golongan === "Golongan V-B")!;
  if (lengthM <= 10) return FERRY_CLASSES.find((f) => f.golongan === "Golongan VI-B")!;
  if (lengthM <= 12) return FERRY_CLASSES.find((f) => f.golongan === "Golongan VII")!;
  if (lengthM <= 16) return FERRY_CLASSES.find((f) => f.golongan === "Golongan VIII")!;
  return FERRY_CLASSES.find((f) => f.golongan === "Golongan IX")!;
}

/** Menggolongkan jumlah gandar ke golongan tol untuk kendaraan barang. */
export function tollClassForAxles(axles: number): TollClass {
  if (axles <= 2) return TOLL_CLASSES[1];
  if (axles === 3) return TOLL_CLASSES[2];
  if (axles === 4) return TOLL_CLASSES[3];
  return TOLL_CLASSES[4];
}

export interface BodyCapacityLogic {
  body: string;
  formula: string;
  unit: string;
  cargo: string;
  volumeRelevance: "Tinggi" | "Sedang" | "Rendah" | "Tidak relevan";
  variables: string;
}

/**
 * Satuan kapasitas yang benar per jenis bodi.
 *
 * Ada satu kesalahan yang berulang di hampir semua kalkulator muatan yang
 * beredar: memaksa setiap kendaraan dinyatakan dalam meter kubik. Tangki diukur
 * dengan liter dan kerapatan cairan. Flatbed diukur dengan loading meter dan
 * titik beban. Car carrier diukur dengan jumlah unit. Memberi angka m3 untuk
 * bodi-bodi itu bukan sekadar tidak berguna; ia mengajarkan satuan yang salah.
 */
export const BODY_CAPACITY_LOGIC: BodyCapacityLogic[] = [
  { body: "Bak terbuka / pickup", formula: "Panjang × lebar × tinggi papan samping", unit: "m³ selubung + kg", cargo: "Barang umum ringan bervolume", volumeRelevance: "Rendah", variables: "Pengikatan muatan, paparan cuaca, tinggi papan samping" },
  { body: "Box / dry van", formula: "Panjang × lebar × tinggi bagian dalam", unit: "m³ + payload ton", cargo: "Kardus, FMCG, barang umum", volumeRelevance: "Tinggi", variables: "Rumah roda, tebal dinding, bukaan pintu" },
  { body: "Wingbox", formula: "Dimensi dalam dikurangi ruang mekanisme sayap", unit: "m³ + payload ton", cargo: "Barang berpalet, muat bongkar frekuensi tinggi", volumeRelevance: "Tinggi", variables: "Mekanisme atap dan samping, berat kosong struktur" },
  { body: "Curtainsider", formula: "Panjang × lebar × tinggi bagian dalam", unit: "m³ + payload ton", cargo: "Barang berpalet", volumeRelevance: "Tinggi", variables: "Keamanan tirai dan penahan samping" },
  { body: "Reefer", formula: "Dimensi dalam ruang berinsulasi", unit: "m³ + payload ton + suhu", cargo: "Barang segar dan farmasi", volumeRelevance: "Tinggi", variables: "Insulasi, evaporator, ruang sirkulasi udara" },
  { body: "Flatbed", formula: "Panjang × lebar dek; loading meter", unit: "m² / loading meter + ton", cargo: "Baja, mesin, barang proyek", volumeRelevance: "Tidak relevan", variables: "Beban titik, lashing, julur muatan" },
  { body: "Tangki cairan", formula: "Kapasitas nominal tangki bersertifikat", unit: "liter atau m³ + ton", cargo: "Cairan", volumeRelevance: "Tidak relevan", variables: "Kerapatan cairan, kompartemen, ullage, barang berbahaya" },
  { body: "Silo / dry bulk", formula: "Kapasitas nominal bejana bersertifikat", unit: "m³ + ton", cargo: "Serbuk, semen, tepung", volumeRelevance: "Tidak relevan", variables: "Kerapatan curah, berat perlengkapan pneumatik" },
  { body: "Dump / tipper", formula: "Panjang × lebar × tinggi sisi bagian dalam", unit: "m³ + ton", cargo: "Agregat, tanah, batubara", volumeRelevance: "Sedang", variables: "Kerapatan material, stabilitas saat menumpah, pintu belakang" },
  { body: "Car carrier", formula: "Geometri dek dan jumlah unit", unit: "unit kendaraan", cargo: "Mobil dan kendaraan ringan", volumeRelevance: "Tidak relevan", variables: "Dimensi kendaraan, sudut ramp, tinggi total" },
  { body: "Angkutan ternak", formula: "Luas dek dan jumlah tingkat", unit: "ekor / m² + ton", cargo: "Hewan hidup", volumeRelevance: "Tidak relevan", variables: "Kesejahteraan hewan, ventilasi, pergerakan muatan hidup" },
  { body: "Skeletal kontainer", formula: "Spesifikasi equipment kontainer", unit: "TEU/FEU + berat kotor kontainer", cargo: "Kontainer ISO", volumeRelevance: "Tidak relevan", variables: "Pelat CSC, twist lock, JBI jalan" },
  { body: "Lowbed", formula: "Panjang × lebar dek + tinggi dek", unit: "m² + ton", cargo: "Alat berat", volumeRelevance: "Tidak relevan", variables: "Jarak ke tanah, jumlah baris sumbu, selubung rute" },
  { body: "Modular / SPMT", formula: "Geometri modul + rating per baris sumbu", unit: "baris sumbu + ton", cargo: "Muatan sangat berat", volumeRelevance: "Tidak relevan", variables: "Daya dukung tanah, ekualisasi hidrolik, kajian teknik" },
];

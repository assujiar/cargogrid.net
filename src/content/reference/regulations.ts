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
  topicEn: string;
  parameter: string;
  parameterEn: string;
  rule: string;
  ruleEn: string;
  /** Statute citation ("PP 55/2012 Pasal 54"); a legal reference, not prose, so no English twin. */
  basis: string;
}

/** Kategori kendaraan barang dan kereta menurut PP 55/2012. */
export const VEHICLE_CATEGORIES: RegulationRule[] = [
  { topic: "Kendaraan barang", topicEn: "Goods vehicle", parameter: "N1", parameterEn: "N1", rule: "Kendaraan barang dengan JBB sampai dengan 3.500 kg.", ruleEn: "Goods vehicle with JBB up to 3,500 kg.", basis: "PP 55/2012" },
  { topic: "Kendaraan barang", topicEn: "Goods vehicle", parameter: "N2", parameterEn: "N2", rule: "Kendaraan barang dengan JBB di atas 3.500 kg sampai dengan 12.000 kg.", ruleEn: "Goods vehicle with JBB over 3,500 kg up to 12,000 kg.", basis: "PP 55/2012" },
  { topic: "Kendaraan barang", topicEn: "Goods vehicle", parameter: "N3", parameterEn: "N3", rule: "Kendaraan barang dengan JBB di atas 12.000 kg.", ruleEn: "Goods vehicle with JBB over 12,000 kg.", basis: "PP 55/2012" },
  { topic: "Kereta gandengan/tempelan", topicEn: "Trailer/semi-trailer", parameter: "O1", parameterEn: "O1", rule: "JBKB sampai dengan 750 kg.", ruleEn: "JBKB up to 750 kg.", basis: "PP 55/2012" },
  { topic: "Kereta gandengan/tempelan", topicEn: "Trailer/semi-trailer", parameter: "O2", parameterEn: "O2", rule: "JBKB di atas 750 kg sampai dengan 3.500 kg.", ruleEn: "JBKB over 750 kg up to 3,500 kg.", basis: "PP 55/2012" },
  { topic: "Kereta gandengan/tempelan", topicEn: "Trailer/semi-trailer", parameter: "O3", parameterEn: "O3", rule: "JBKB di atas 3.500 kg sampai dengan 10.000 kg.", ruleEn: "JBKB over 3,500 kg up to 10,000 kg.", basis: "PP 55/2012" },
  { topic: "Kereta gandengan/tempelan", topicEn: "Trailer/semi-trailer", parameter: "O4", parameterEn: "O4", rule: "JBKB di atas 10.000 kg.", ruleEn: "JBKB over 10,000 kg.", basis: "PP 55/2012" },
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
  { topic: "Dimensi", topicEn: "Dimensions", parameter: "Panjang kendaraan tunggal", parameterEn: "Single-vehicle length", rule: "Maksimum 12,0 meter.", ruleEn: "Maximum 12.0 meters.", basis: "PP 55/2012 Pasal 54" },
  { topic: "Dimensi", topicEn: "Dimensions", parameter: "Panjang rangkaian", parameterEn: "Combination length", rule: "Maksimum 18,0 meter untuk kendaraan dengan kereta gandengan atau tempelan.", ruleEn: "Maximum 18.0 meters for vehicles with a drawbar trailer or semi-trailer.", basis: "PP 55/2012 Pasal 54" },
  { topic: "Dimensi", topicEn: "Dimensions", parameter: "Lebar", parameterEn: "Width", rule: "Maksimum 2,5 meter.", ruleEn: "Maximum 2.5 meters.", basis: "PP 55/2012 Pasal 54" },
  {
    topic: "Dimensi",
    topicEn: "Dimensions",
    parameter: "Tinggi",
    parameterEn: "Height",
    rule: "Maksimum 4,2 meter dan tidak lebih dari 1,7 kali lebar kendaraan. Truk berbadan sempit karena itu punya batas tinggi lebih rendah daripada 4,2 meter.",
    ruleEn: "Maximum 4.2 meters and no more than 1.7 times the vehicle's width. Narrow-bodied trucks therefore have a lower height limit than 4.2 meters.",
    basis: "PP 55/2012 Pasal 54",
  },
  { topic: "Julur", topicEn: "Overhang", parameter: "Julur belakang", parameterEn: "Rear overhang", rule: "Maksimum 62,5% dari jarak sumbu.", ruleEn: "Maximum 62.5% of the wheelbase.", basis: "PP 55/2012 Pasal 55" },
  { topic: "Julur", topicEn: "Overhang", parameter: "Julur depan", parameterEn: "Front overhang", rule: "Maksimum 47,5% dari jarak sumbu.", ruleEn: "Maximum 47.5% of the wheelbase.", basis: "PP 55/2012 Pasal 55" },
];

export const WEIGHT_CONCEPTS: RegulationRule[] = [
  {
    topic: "Konsep berat",
    topicEn: "Weight concepts",
    parameter: "JBB / JBKB",
    parameterEn: "JBB / JBKB",
    rule: "Batas berat menurut rancangan pabrikan. Ini rating teknis, dan tidak dengan sendirinya menjadi berat operasional yang sah di jalan.",
    ruleEn: "Weight limit per the manufacturer's design. This is a technical rating, and does not by itself constitute a legally permitted operating weight on the road.",
    basis: "PP 55/2012",
  },
  {
    topic: "Konsep berat",
    topicEn: "Weight concepts",
    parameter: "JBI / JBKI",
    parameterEn: "JBI / JBKI",
    rule: "Berat operasional yang diizinkan, dengan memperhitungkan berat kosong, rating rancangan, dimensi dan bodi, kelas jalan, serta beban sumbu. JBI selalu lebih kecil atau sama dengan JBB.",
    ruleEn: "The legally permitted operating weight, accounting for curb weight, design rating, dimensions and body, road class, and axle load. JBI is always less than or equal to JBB.",
    basis: "PP 55/2012",
  },
  {
    topic: "Payload legal",
    topicEn: "Legal payload",
    parameter: "Cara menghitungnya",
    parameterEn: "How to calculate it",
    rule: "Payload legal adalah JBI atau JBKI yang berlaku dikurangi berat kosong kendaraan setelah karoseri terpasang, dikurangi awak, bahan bakar, dan perlengkapan. Bukan angka payload di brosur.",
    ruleEn: "Legal payload is the applicable JBI or JBKI minus the vehicle's curb weight with the body fitted, minus crew, fuel, and equipment. Not the payload figure quoted in a brochure.",
    basis: "PP 55/2012",
  },
];

export interface RoadClass {
  code: string;
  codeEn: string;
  /** `null` pada kelas khusus, yang batasnya ditetapkan per izin. */
  maxWidthM: number | null;
  maxLengthM: number | null;
  maxHeightM: number | null;
  /** Muatan Sumbu Terberat, dalam ton. `null` bila ditetapkan per izin. */
  mstTon: number | null;
  note: string;
  noteEn: string;
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
    codeEn: "Class I",
    maxWidthM: 2.5,
    maxLengthM: 18,
    maxHeightM: 4.2,
    mstTon: 10,
    note: "Jalan arteri dan kolektor tertentu. Satu-satunya kelas yang menampung rangkaian penuh 18 meter.",
    noteEn: "Arterial roads and certain collector roads. The only class that accommodates a full 18-meter combination.",
  },
  {
    code: "Kelas II",
    codeEn: "Class II",
    maxWidthM: 2.5,
    maxLengthM: 12,
    maxHeightM: 4.2,
    mstTon: 8,
    note: "Panjang terbatas pada kendaraan tunggal. Rangkaian trailer tidak masuk kelas ini.",
    noteEn: "Length limited to single vehicles. Trailer combinations do not fit within this class.",
  },
  {
    code: "Kelas III",
    codeEn: "Class III",
    maxWidthM: 2.1,
    maxLengthM: 9,
    maxHeightM: 3.5,
    mstTon: 8,
    note: "Batas lebar 2,1 meter menyingkirkan hampir semua bodi standar 2,4-2,5 meter. Periksa sebelum menjanjikan pengantaran ke lokasi yang dilayani jalan kelas ini.",
    noteEn: "The 2.1-meter width limit rules out nearly every standard 2.4-2.5 meter body. Check before committing to delivery at a location served by this road class.",
  },
  {
    // Deliberately without numbers. This class exists precisely for vehicles
    // whose dimensions or axle loads exceed the ordinary classes, so copying
    // Kelas I's figures into it stated the opposite of what it means, and
    // contradicted the note sitting in the very next cell.
    code: "Kelas khusus",
    codeEn: "Special class",
    maxWidthM: null,
    maxLengthM: null,
    maxHeightM: null,
    mstTon: null,
    note: "Untuk kendaraan yang dimensi atau beban sumbunya melampaui kelas biasa, hanya pada ruas jalan yang ditetapkan dan dengan izin tersendiri. Batasnya ditetapkan per izin, bukan lewat satu angka umum.",
    noteEn: "For vehicles whose dimensions or axle load exceed the ordinary classes, only on designated road sections and under a separate permit. Limits are set per permit, not by one general figure.",
  },
];

export interface TollClass {
  golongan: string;
  golonganEn: string;
  description: string;
  descriptionEn: string;
  rule: string;
  ruleEn: string;
  note: string;
  noteEn: string;
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
    golonganEn: "Class I",
    description: "Sedan, jip, pickup, truk kecil, dan bus.",
    descriptionEn: "Sedans, jeeps, pickups, small trucks, and buses.",
    rule: "Ditentukan jenis kendaraan. Pickup dan truk kecil tetap Golongan I.",
    ruleEn: "Determined by vehicle type. Pickups and small trucks remain Class I.",
    note: "Untuk truk ringan yang berada di batas, periksa klasifikasi pada STNK dan penetapan operator.",
    noteEn: "For light trucks near the boundary, check the classification on the STNK and the operator's determination.",
  },
  {
    golongan: "Golongan II",
    golonganEn: "Class II",
    description: "Truk dengan 2 gandar.",
    descriptionEn: "Trucks with 2 axles.",
    rule: "Jumlah gandar total 2.",
    ruleEn: "Total axle count of 2.",
    note: "Truk rigid medium dan berat berkonfigurasi 4x2 umumnya di sini. Perhatikan: jumlah roda bukan jumlah gandar, CDD berroda enam tetap bergandar dua.",
    noteEn: "Medium and heavy rigid trucks configured 4x2 generally fall here. Note: wheel count is not axle count -- a six-wheel CDD is still a two-axle vehicle.",
  },
  {
    golongan: "Golongan III",
    golonganEn: "Class III",
    description: "Truk dengan 3 gandar.",
    descriptionEn: "Trucks with 3 axles.",
    rule: "Jumlah gandar total 3.",
    ruleEn: "Total axle count of 3.",
    note: "Truk rigid 6x2 dan 6x4 umumnya di sini.",
    noteEn: "Rigid 6x2 and 6x4 trucks generally fall here.",
  },
  {
    golongan: "Golongan IV",
    golonganEn: "Class IV",
    description: "Truk dengan 4 gandar.",
    descriptionEn: "Trucks with 4 axles.",
    rule: "Jumlah gandar total 4.",
    ruleEn: "Total axle count of 4.",
    note: "Rigid 8x2 dan 8x4, atau rangkaian bergandar empat.",
    noteEn: "Rigid 8x2 and 8x4, or four-axle combinations.",
  },
  {
    golongan: "Golongan V",
    golonganEn: "Class V",
    description: "Truk dengan 5 gandar atau lebih.",
    descriptionEn: "Trucks with 5 or more axles.",
    rule: "Jumlah gandar total 5 ke atas.",
    ruleEn: "Total axle count of 5 or more.",
    note: "Sebagian besar rangkaian tractor head dengan semi-trailer bergandar tiga.",
    noteEn: "Mostly tractor-head combinations with a three-axle semi-trailer.",
  },
];

export interface FerryClass {
  golongan: string;
  golonganEn: string;
  vehicleType: string;
  vehicleTypeEn: string;
  lengthBand: string;
  lengthBandEn: string;
  note: string;
  noteEn: string;
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
  { golongan: "Golongan I", golonganEn: "Class I", vehicleType: "Sepeda", vehicleTypeEn: "Bicycle", lengthBand: ", ", lengthBandEn: ", ", note: "Tidak bermotor.", noteEn: "Non-motorized." },
  { golongan: "Golongan II", golonganEn: "Class II", vehicleType: "Gerobak dan sepeda motor di bawah 500 cc", vehicleTypeEn: "Carts and motorcycles under 500cc", lengthBand: "Umumnya di bawah 5 m", lengthBandEn: "Generally under 5 m", note: "Kendaraan kecil.", noteEn: "Small vehicles." },
  { golongan: "Golongan III", golonganEn: "Class III", vehicleType: "Kendaraan roda tiga dan sepeda motor 500 cc ke atas", vehicleTypeEn: "Three-wheeled vehicles and motorcycles 500cc and above", lengthBand: "Umumnya di bawah 5 m", lengthBandEn: "Generally under 5 m", note: "Bermotor.", noteEn: "Motorized." },
  { golongan: "Golongan IV-A", golonganEn: "Class IV-A", vehicleType: "Kendaraan penumpang", vehicleTypeEn: "Passenger vehicles", lengthBand: "Sampai dengan 5 m", lengthBandEn: "Up to 5 m", note: "Fungsi penumpang.", noteEn: "Passenger function." },
  { golongan: "Golongan IV-B", golonganEn: "Class IV-B", vehicleType: "Kendaraan barang", vehicleTypeEn: "Goods vehicles", lengthBand: "Sampai dengan 5 m", lengthBandEn: "Up to 5 m", note: "Pickup dan blind van umumnya di sini.", noteEn: "Pickups and blind vans generally fall here." },
  { golongan: "Golongan V-A", golonganEn: "Class V-A", vehicleType: "Kendaraan penumpang", vehicleTypeEn: "Passenger vehicles", lengthBand: "Di atas 5 m sampai 7 m", lengthBandEn: "Over 5 m up to 7 m", note: "Fungsi penumpang.", noteEn: "Passenger function." },
  { golongan: "Golongan V-B", golonganEn: "Class V-B", vehicleType: "Kendaraan barang", vehicleTypeEn: "Goods vehicles", lengthBand: "Di atas 5 m sampai 7 m", lengthBandEn: "Over 5 m up to 7 m", note: "Truk ringan seperti CDE dan CDD standar umumnya di sini.", noteEn: "Light trucks such as standard CDE and CDD generally fall here." },
  { golongan: "Golongan VI-A", golonganEn: "Class VI-A", vehicleType: "Kendaraan penumpang", vehicleTypeEn: "Passenger vehicles", lengthBand: "Di atas 7 m sampai 10 m", lengthBandEn: "Over 7 m up to 10 m", note: "Bus.", noteEn: "Buses." },
  { golongan: "Golongan VI-B", golonganEn: "Class VI-B", vehicleType: "Kendaraan barang", vehicleTypeEn: "Goods vehicles", lengthBand: "Di atas 7 m sampai 10 m", lengthBandEn: "Over 7 m up to 10 m", note: "Truk medium dan CDD long umumnya di sini.", noteEn: "Medium trucks and CDD long generally fall here." },
  { golongan: "Golongan VII", golonganEn: "Class VII", vehicleType: "Kendaraan barang termasuk rangkaian", vehicleTypeEn: "Goods vehicles including combinations", lengthBand: "Di atas 10 m sampai 12 m", lengthBandEn: "Over 10 m up to 12 m", note: "Tronton dan rigid panjang.", noteEn: "Tronton and long rigid trucks." },
  { golongan: "Golongan VIII", golonganEn: "Class VIII", vehicleType: "Kendaraan barang termasuk rangkaian dan alat berat", vehicleTypeEn: "Goods vehicles including combinations and heavy equipment", lengthBand: "Di atas 12 m sampai 16 m", lengthBandEn: "Over 12 m up to 16 m", note: "Rangkaian trailer pendek.", noteEn: "Short trailer combinations." },
  { golongan: "Golongan IX", golonganEn: "Class IX", vehicleType: "Kendaraan barang termasuk rangkaian dan alat berat", vehicleTypeEn: "Goods vehicles including combinations and heavy equipment", lengthBand: "Di atas 16 m", lengthBandEn: "Over 16 m", note: "Rangkaian tractor head dengan semi-trailer 40 kaki dan sejenisnya.", noteEn: "Tractor-head combinations with a 40-foot semi-trailer and similar." },
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
  bodyEn: string;
  formula: string;
  formulaEn: string;
  unit: string;
  unitEn: string;
  cargo: string;
  cargoEn: string;
  /** Only four values ever occur; translated via a lookup in ReferenceViews.tsx rather than a stored twin. */
  volumeRelevance: "Tinggi" | "Sedang" | "Rendah" | "Tidak relevan";
  variables: string;
  variablesEn: string;
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
  { body: "Bak terbuka / pickup", bodyEn: "Open deck/pickup", formula: "Panjang × lebar × tinggi papan samping", formulaEn: "Length × width × side-board height", unit: "m³ selubung + kg", unitEn: "m³ envelope + kg", cargo: "Barang umum ringan bervolume", cargoEn: "Light, bulky general cargo", volumeRelevance: "Rendah", variables: "Pengikatan muatan, paparan cuaca, tinggi papan samping", variablesEn: "Load securing, weather exposure, side-board height" },
  { body: "Box / dry van", bodyEn: "Box/dry van", formula: "Panjang × lebar × tinggi bagian dalam", formulaEn: "Length × width × interior height", unit: "m³ + payload ton", unitEn: "m³ + payload tons", cargo: "Kardus, FMCG, barang umum", cargoEn: "Cartons, FMCG, general cargo", volumeRelevance: "Tinggi", variables: "Rumah roda, tebal dinding, bukaan pintu", variablesEn: "Wheel housings, wall thickness, door opening" },
  { body: "Wingbox", bodyEn: "Wingbox", formula: "Dimensi dalam dikurangi ruang mekanisme sayap", formulaEn: "Interior dimensions minus wing-mechanism space", unit: "m³ + payload ton", unitEn: "m³ + payload tons", cargo: "Barang berpalet, muat bongkar frekuensi tinggi", cargoEn: "Palletized cargo, high-frequency loading/unloading", volumeRelevance: "Tinggi", variables: "Mekanisme atap dan samping, berat kosong struktur", variablesEn: "Roof and side mechanisms, structural curb weight" },
  { body: "Curtainsider", bodyEn: "Curtainsider", formula: "Panjang × lebar × tinggi bagian dalam", formulaEn: "Length × width × interior height", unit: "m³ + payload ton", unitEn: "m³ + payload tons", cargo: "Barang berpalet", cargoEn: "Palletized cargo", volumeRelevance: "Tinggi", variables: "Keamanan tirai dan penahan samping", variablesEn: "Curtain security and side restraints" },
  { body: "Reefer", bodyEn: "Reefer", formula: "Dimensi dalam ruang berinsulasi", formulaEn: "Interior dimensions of the insulated compartment", unit: "m³ + payload ton + suhu", unitEn: "m³ + payload tons + temperature", cargo: "Barang segar dan farmasi", cargoEn: "Fresh goods and pharmaceuticals", volumeRelevance: "Tinggi", variables: "Insulasi, evaporator, ruang sirkulasi udara", variablesEn: "Insulation, evaporator, air circulation space" },
  { body: "Flatbed", bodyEn: "Flatbed", formula: "Panjang × lebar dek; loading meter", formulaEn: "Deck length × width; loading meters", unit: "m² / loading meter + ton", unitEn: "m² / loading meter + tons", cargo: "Baja, mesin, barang proyek", cargoEn: "Steel, machinery, project cargo", volumeRelevance: "Tidak relevan", variables: "Beban titik, lashing, julur muatan", variablesEn: "Point loads, lashing, cargo overhang" },
  { body: "Tangki cairan", bodyEn: "Liquid tanker", formula: "Kapasitas nominal tangki bersertifikat", formulaEn: "Certified nominal tank capacity", unit: "liter atau m³ + ton", unitEn: "liters or m³ + tons", cargo: "Cairan", cargoEn: "Liquids", volumeRelevance: "Tidak relevan", variables: "Kerapatan cairan, kompartemen, ullage, barang berbahaya", variablesEn: "Liquid density, compartments, ullage, dangerous goods" },
  { body: "Silo / dry bulk", bodyEn: "Silo/dry bulk", formula: "Kapasitas nominal bejana bersertifikat", formulaEn: "Certified nominal vessel capacity", unit: "m³ + ton", unitEn: "m³ + tons", cargo: "Serbuk, semen, tepung", cargoEn: "Powders, cement, flour", volumeRelevance: "Tidak relevan", variables: "Kerapatan curah, berat perlengkapan pneumatik", variablesEn: "Bulk density, weight of pneumatic equipment" },
  { body: "Dump / tipper", bodyEn: "Dump/tipper", formula: "Panjang × lebar × tinggi sisi bagian dalam", formulaEn: "Length × width × interior side height", unit: "m³ + ton", unitEn: "m³ + tons", cargo: "Agregat, tanah, batubara", cargoEn: "Aggregate, soil, coal", volumeRelevance: "Sedang", variables: "Kerapatan material, stabilitas saat menumpah, pintu belakang", variablesEn: "Material density, tipping stability, tailgate" },
  { body: "Car carrier", bodyEn: "Car carrier", formula: "Geometri dek dan jumlah unit", formulaEn: "Deck geometry and unit count", unit: "unit kendaraan", unitEn: "vehicle units", cargo: "Mobil dan kendaraan ringan", cargoEn: "Cars and light vehicles", volumeRelevance: "Tidak relevan", variables: "Dimensi kendaraan, sudut ramp, tinggi total", variablesEn: "Vehicle dimensions, ramp angle, overall height" },
  { body: "Angkutan ternak", bodyEn: "Livestock carrier", formula: "Luas dek dan jumlah tingkat", formulaEn: "Deck area and number of tiers", unit: "ekor / m² + ton", unitEn: "head / m² + tons", cargo: "Hewan hidup", cargoEn: "Live animals", volumeRelevance: "Tidak relevan", variables: "Kesejahteraan hewan, ventilasi, pergerakan muatan hidup", variablesEn: "Animal welfare, ventilation, live-load movement" },
  { body: "Skeletal kontainer", bodyEn: "Skeletal container chassis", formula: "Spesifikasi equipment kontainer", formulaEn: "Container equipment specification", unit: "TEU/FEU + berat kotor kontainer", unitEn: "TEU/FEU + container gross weight", cargo: "Kontainer ISO", cargoEn: "ISO containers", volumeRelevance: "Tidak relevan", variables: "Pelat CSC, twist lock, JBI jalan", variablesEn: "CSC plate, twist locks, road JBI" },
  { body: "Lowbed", bodyEn: "Lowbed", formula: "Panjang × lebar dek + tinggi dek", formulaEn: "Deck length × width + deck height", unit: "m² + ton", unitEn: "m² + tons", cargo: "Alat berat", cargoEn: "Heavy equipment", volumeRelevance: "Tidak relevan", variables: "Jarak ke tanah, jumlah baris sumbu, selubung rute", variablesEn: "Ground clearance, number of axle rows, route envelope" },
  { body: "Modular / SPMT", bodyEn: "Modular/SPMT", formula: "Geometri modul + rating per baris sumbu", formulaEn: "Module geometry + rating per axle row", unit: "baris sumbu + ton", unitEn: "axle rows + tons", cargo: "Muatan sangat berat", cargoEn: "Extremely heavy cargo", volumeRelevance: "Tidak relevan", variables: "Daya dukung tanah, ekualisasi hidrolik, kajian teknik", variablesEn: "Ground bearing capacity, hydraulic equalization, engineering study" },
];

/**
 * Every table on this page is small enough to review by eye, but there are
 * five of them across three shapes, and TypeScript's required `xxxEn` fields
 * catch "missing" without catching "empty string" -- the gap a rushed
 * translation pass falls into first.
 */
function assertRegulationsIntegrity(): void {
  const nonEmpty = (label: string, value: string) => {
    if (!value.trim()) throw new Error(`regulations.ts: ${label} is empty`);
  };

  for (const rule of [...VEHICLE_CATEGORIES, ...DIMENSION_RULES, ...WEIGHT_CONCEPTS]) {
    nonEmpty(`RegulationRule "${rule.parameter}".topicEn`, rule.topicEn);
    nonEmpty(`RegulationRule "${rule.parameter}".parameterEn`, rule.parameterEn);
    nonEmpty(`RegulationRule "${rule.parameter}".ruleEn`, rule.ruleEn);
  }
  for (const rc of ROAD_CLASSES) {
    nonEmpty(`RoadClass "${rc.code}".codeEn`, rc.codeEn);
    nonEmpty(`RoadClass "${rc.code}".noteEn`, rc.noteEn);
  }
  for (const tc of TOLL_CLASSES) {
    nonEmpty(`TollClass "${tc.golongan}".golonganEn`, tc.golonganEn);
    nonEmpty(`TollClass "${tc.golongan}".descriptionEn`, tc.descriptionEn);
    nonEmpty(`TollClass "${tc.golongan}".ruleEn`, tc.ruleEn);
    nonEmpty(`TollClass "${tc.golongan}".noteEn`, tc.noteEn);
  }
  for (const fc of FERRY_CLASSES) {
    nonEmpty(`FerryClass "${fc.golongan}".golonganEn`, fc.golonganEn);
    nonEmpty(`FerryClass "${fc.golongan}".vehicleTypeEn`, fc.vehicleTypeEn);
    nonEmpty(`FerryClass "${fc.golongan}".lengthBandEn`, fc.lengthBandEn);
    nonEmpty(`FerryClass "${fc.golongan}".noteEn`, fc.noteEn);
  }
  for (const bc of BODY_CAPACITY_LOGIC) {
    nonEmpty(`BodyCapacityLogic "${bc.body}".bodyEn`, bc.bodyEn);
    nonEmpty(`BodyCapacityLogic "${bc.body}".formulaEn`, bc.formulaEn);
    nonEmpty(`BodyCapacityLogic "${bc.body}".unitEn`, bc.unitEn);
    nonEmpty(`BodyCapacityLogic "${bc.body}".cargoEn`, bc.cargoEn);
    nonEmpty(`BodyCapacityLogic "${bc.body}".variablesEn`, bc.variablesEn);
  }
}

assertRegulationsIntegrity();

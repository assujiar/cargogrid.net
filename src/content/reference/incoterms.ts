/**
 * Incoterms 2020 — the eleven rules of the ICC.
 *
 * The reason a reference table is worth building rather than linking: almost
 * every summary online answers "who pays for what", and almost nobody's actual
 * dispute is about who pays. Disputes are about where risk passed, which is a
 * different line on the map and frequently a different place entirely. Under
 * CFR and CIF the seller pays freight all the way to the destination port, yet
 * risk left them at the origin port — so cargo damaged mid-ocean is the buyer's
 * loss on a shipment the seller is still paying for.
 *
 * Each entry therefore separates cost transfer from risk transfer and states
 * both, because conflating them is the single most expensive misunderstanding
 * in Indonesian export documentation.
 */

export type IncotermMode = "semua-moda" | "laut";

export interface Incoterm {
  code: string;
  name: string;
  nameId: string;
  mode: IncotermMode;
  /** Where risk moves from seller to buyer. */
  riskTransfer: string;
  /** How far the seller's cost obligation runs. */
  costTransfer: string;
  exportClearance: "Penjual" | "Pembeli";
  importClearance: "Penjual" | "Pembeli";
  /** Who must buy cargo insurance, and to what standard. */
  insurance: string;
  /** When this rule is the right choice. */
  bestFor: string;
  /** The failure mode this rule actually produces in practice. */
  watchOut: string;
}

export const INCOTERMS: Incoterm[] = [
  {
    code: "EXW",
    name: "Ex Works",
    nameId: "Serah di tempat penjual",
    mode: "semua-moda",
    riskTransfer: "Di gudang atau pabrik penjual, begitu barang disediakan untuk diambil. Pemuatan ke truk pembeli sudah menjadi risiko pembeli.",
    costTransfer: "Berhenti di pintu pabrik penjual. Seluruh biaya sesudahnya ditanggung pembeli.",
    exportClearance: "Pembeli",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan bagi siapa pun. Pembeli yang menanggung risiko sejak awal, jadi pembeli yang perlu menutupnya.",
    bestFor: "Transaksi domestik, atau penjual yang benar-benar tidak punya kapasitas ekspor sama sekali.",
    watchOut:
      "Untuk ekspor, aturan ini bermasalah: pembeli asing harus mengurus PEB atas nama eksportir yang bukan dirinya, sesuatu yang sering tidak bisa dilakukan secara administratif. FCA hampir selalu pilihan yang lebih tepat.",
  },
  {
    code: "FCA",
    name: "Free Carrier",
    nameId: "Serah ke pengangkut",
    mode: "semua-moda",
    riskTransfer:
      "Saat barang diserahkan ke pengangkut yang ditunjuk pembeli, di tempat yang disepakati. Kalau tempatnya adalah lokasi penjual, risiko pindah setelah barang dimuat ke sarana angkut.",
    costTransfer: "Sampai titik penyerahan yang disebut dalam kontrak, termasuk pengurusan ekspor.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan. Pembeli menanggung risiko sejak titik serah, jadi pembeli yang berkepentingan menutupnya.",
    bestFor:
      "Kargo kontainer. Untuk barang yang diserahkan di terminal atau depo, ini pengganti FOB yang benar secara teknis.",
    watchOut:
      "Titik serahnya wajib ditulis eksplisit. \"FCA Jakarta\" tanpa alamat menyisakan pertanyaan apakah maksudnya gudang penjual atau terminal — dan jawabannya menentukan siapa menanggung ongkos trucking ke pelabuhan.",
  },
  {
    code: "CPT",
    name: "Carriage Paid To",
    nameId: "Ongkos angkut dibayar sampai",
    mode: "semua-moda",
    riskTransfer: "Saat barang diserahkan ke pengangkut pertama di negara asal — jauh sebelum barang tiba di tujuan.",
    costTransfer: "Sampai tempat tujuan yang disebutkan. Penjual membayar seluruh ongkos angkut utama.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan. Ini celah paling sering terlewat: barang berjalan atas biaya penjual tapi atas risiko pembeli, tanpa polis wajib.",
    bestFor: "Pengiriman multimoda ketika penjual punya tarif angkut yang lebih baik daripada pembeli.",
    watchOut:
      "Dua titik yang berbeda: biaya berhenti di tujuan, risiko berhenti di asal. Kalau kontainer rusak di tengah laut, itu kerugian pembeli meski penjual yang membayar freight-nya.",
  },
  {
    code: "CIP",
    name: "Carriage and Insurance Paid To",
    nameId: "Ongkos angkut dan asuransi dibayar sampai",
    mode: "semua-moda",
    riskTransfer: "Sama seperti CPT: saat barang diserahkan ke pengangkut pertama di negara asal.",
    costTransfer: "Sampai tempat tujuan yang disebutkan, ditambah premi asuransi.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance:
      "Wajib, dan sejak Incoterms 2020 standarnya naik ke Institute Cargo Clauses (A) — perlindungan luas. Ini salah satu perubahan paling penting dari edisi 2010.",
    bestFor: "Barang bernilai tinggi lewat jalur multimoda, ketika pembeli ingin perlindungan luas tanpa mengurus polisnya sendiri.",
    watchOut:
      "Tingkat perlindungannya berbeda dari CIF, yang masih memakai ICC (C). Menyamakan keduanya membuat pembeli mengira dirinya terlindungi padahal tidak.",
  },
  {
    code: "DAP",
    name: "Delivered at Place",
    nameId: "Serah di tempat tujuan",
    mode: "semua-moda",
    riskTransfer: "Di tempat tujuan yang disepakati, saat barang siap dibongkar di atas sarana angkut. Pembongkarannya sendiri urusan pembeli.",
    costTransfer: "Sampai tempat tujuan, tidak termasuk bea masuk dan pajak impor.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan, tetapi penjual menanggung risiko sepanjang jalan, jadi penjual yang berkepentingan menutupnya.",
    bestFor: "Penjual yang ingin mengendalikan pengalaman pengiriman sampai ke gudang pembeli tanpa mengurus kepabeanan impor.",
    watchOut:
      "Bila barang tertahan di bea cukai karena pembeli lambat mengurus impor, biaya demurrage dan storage selama penahanan tetap menjadi tanggungan pembeli — tetapi yang ditelepon terminal biasanya penjual.",
  },
  {
    code: "DPU",
    name: "Delivered at Place Unloaded",
    nameId: "Serah di tempat tujuan, sudah dibongkar",
    mode: "semua-moda",
    riskTransfer: "Di tempat tujuan, setelah barang selesai dibongkar dari sarana angkut.",
    costTransfer: "Sampai tempat tujuan termasuk biaya bongkar, tidak termasuk bea masuk dan pajak impor.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan; risiko ada pada penjual sampai barang dibongkar.",
    bestFor: "Pengiriman ke tempat yang punya alat bongkar dan penjual sanggup mengatur prosesnya.",
    watchOut:
      "Satu-satunya aturan yang mewajibkan penjual membongkar. Menggantikan DAT sejak edisi 2020 dan diperluas — tujuannya kini bisa di mana saja, tidak harus terminal. Pastikan alat bongkar benar-benar tersedia di lokasi.",
  },
  {
    code: "DDP",
    name: "Delivered Duty Paid",
    nameId: "Serah di tujuan, bea dan pajak dibayar",
    mode: "semua-moda",
    riskTransfer: "Di tempat tujuan yang disepakati, siap dibongkar.",
    costTransfer: "Semuanya, termasuk bea masuk, PPN impor, dan seluruh pungutan di negara tujuan.",
    exportClearance: "Penjual",
    importClearance: "Penjual",
    insurance: "Tidak diwajibkan; penjual menanggung risiko sepanjang jalan.",
    bestFor: "Sampel, suku cadang jaminan, dan e-commerce lintas negara dengan nilai kecil.",
    watchOut:
      "Beban maksimum bagi penjual. Di banyak negara importir wajib punya identitas pajak setempat untuk menebus barang, sehingga DDP kadang mustahil dijalankan meski sudah tertulis di kontrak.",
  },
  {
    code: "FAS",
    name: "Free Alongside Ship",
    nameId: "Serah di samping kapal",
    mode: "laut",
    riskTransfer: "Saat barang ditempatkan di samping kapal di pelabuhan muat.",
    costTransfer: "Sampai barang berada di samping kapal, termasuk pengurusan ekspor.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan.",
    bestFor: "Kargo curah dan barang berat yang dimuat langsung dengan crane dermaga.",
    watchOut: "Tidak cocok untuk kontainer. Kontainer diserahkan ke terminal, bukan ke sisi lambung kapal — pakai FCA.",
  },
  {
    code: "FOB",
    name: "Free On Board",
    nameId: "Serah di atas kapal",
    mode: "laut",
    riskTransfer: "Saat barang berada di atas kapal di pelabuhan muat.",
    costTransfer: "Sampai barang di atas kapal, termasuk pengurusan ekspor dan biaya terminal di asal.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan.",
    bestFor: "Kargo curah, kendaraan, alat berat — barang yang benar-benar dimuat satu per satu ke atas kapal.",
    watchOut:
      "Istilah yang paling sering salah pakai di Indonesia. Untuk kargo kontainer, barang diserahkan ke terminal berhari-hari sebelum naik kapal; menuliskan FOB berarti penjual menanggung risiko atas barang yang sudah tidak dikuasainya. FCA yang benar secara teknis.",
  },
  {
    code: "CFR",
    name: "Cost and Freight",
    nameId: "Ongkos dan angkutan",
    mode: "laut",
    riskTransfer: "Saat barang berada di atas kapal di pelabuhan muat — sama seperti FOB.",
    costTransfer: "Sampai pelabuhan tujuan. Penjual membayar freight laut.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan. Sama seperti CPT, barang berjalan atas biaya penjual tapi atas risiko pembeli.",
    bestFor: "Kargo curah ketika penjual punya kontrak pelayaran yang lebih baik.",
    watchOut: "Biaya bongkar di pelabuhan tujuan sering menjadi sengketa. Sebutkan secara eksplisit siapa menanggung THC di tujuan.",
  },
  {
    code: "CIF",
    name: "Cost, Insurance and Freight",
    nameId: "Ongkos, asuransi, dan angkutan",
    mode: "laut",
    riskTransfer: "Saat barang berada di atas kapal di pelabuhan muat.",
    costTransfer: "Sampai pelabuhan tujuan, ditambah premi asuransi.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance:
      "Wajib, minimum Institute Cargo Clauses (C) — perlindungan terbatas yang hanya menanggung kejadian besar seperti kapal kandas, terbakar, atau tenggelam.",
    bestFor: "Kargo curah, dan transaksi berbasis letter of credit yang mensyaratkan polis dari penjual.",
    watchOut:
      "ICC (C) tidak menanggung pencurian, basah, maupun penyok. Pembeli yang butuh perlindungan sungguhan harus membeli polis tambahan sendiri, atau menegosiasikan naik ke ICC (A).",
  },
];

export function getIncoterm(code: string): Incoterm | undefined {
  return INCOTERMS.find((term) => term.code.toLowerCase() === code.toLowerCase());
}

/**
 * What changed in the 2020 edition.
 *
 * Kept as data rather than prose because the most common practical question is
 * not "what is FOB" but "does my 2010 template still say the right thing".
 */
export const INCOTERMS_2020_CHANGES = [
  {
    title: "DAT berganti nama menjadi DPU",
    body: "Bukan sekadar ganti nama. DAT dulu mengharuskan tujuan berupa terminal; DPU membolehkan tempat mana pun, sepanjang barang dibongkar di sana. Kontrak yang masih menulis DAT tetap sah, tetapi merujuk edisi yang sudah digantikan.",
  },
  {
    title: "CIP naik ke Institute Cargo Clauses (A)",
    body: "Sebelumnya CIP dan CIF sama-sama hanya mewajibkan ICC (C). Sejak 2020 CIP menuntut perlindungan luas, sementara CIF tetap di ICC (C). Dua aturan yang dulu setara kini berbeda tingkat.",
  },
  {
    title: "FCA bisa meminta bill of lading dengan catatan on-board",
    body: "Menjawab masalah nyata: bank penerbit letter of credit menuntut on-board bill of lading, sesuatu yang secara struktur tidak dihasilkan FCA. Ketentuan baru memungkinkan para pihak menyepakatinya, sehingga eksportir kontainer tidak lagi terpaksa memakai FOB hanya demi memuaskan bank.",
  },
  {
    title: "Daftar biaya dikumpulkan pada satu pasal",
    body: "Seluruh alokasi biaya kini terkumpul di pasal A9/B9 tiap aturan. Perubahan tata letak, bukan perubahan aturan — tetapi membuat sengketa biaya jauh lebih cepat diselesaikan karena semua ada di satu tempat.",
  },
  {
    title: "Kewajiban keamanan dinyatakan lebih tegas",
    body: "Persyaratan terkait keamanan pengangkutan dan biayanya kini disebut eksplisit di pasal A4 dan A7, mengikuti pengetatan aturan keamanan rantai pasok internasional.",
  },
];

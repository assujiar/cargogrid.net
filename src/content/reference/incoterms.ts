/**
 * Incoterms 2020, the eleven rules of the ICC.
 *
 * The reason a reference table is worth building rather than linking: almost
 * every summary online answers "who pays for what", and almost nobody's actual
 * dispute is about who pays. Disputes are about where risk passed, which is a
 * different line on the map and frequently a different place entirely. Under
 * CFR and CIF the seller pays freight all the way to the destination port, yet
 * risk left them at the origin port, so cargo damaged mid-ocean is the buyer's
 * loss on a shipment the seller is still paying for.
 *
 * Each entry therefore separates cost transfer from risk transfer and states
 * both, because conflating them is the single most expensive misunderstanding
 * in Indonesian export documentation.
 */

export type IncotermMode = "semua-moda" | "laut";

export interface Incoterm {
  code: string;
  /** Already the ICC's own English name ("Ex Works"); no English twin needed. */
  name: string;
  nameId: string;
  mode: IncotermMode;
  /** Where risk moves from seller to buyer. */
  riskTransfer: string;
  riskTransferEn: string;
  /** How far the seller's cost obligation runs. */
  costTransfer: string;
  costTransferEn: string;
  /**
   * "Penjual"/"Pembeli" rather than a fourth free-text pair: only two values
   * ever occur, so the English form is a lookup (see `CLEARANCE_LABELS` in
   * ReferenceViews.tsx) instead of a field every entry has to carry and keep
   * in sync.
   */
  exportClearance: "Penjual" | "Pembeli";
  importClearance: "Penjual" | "Pembeli";
  /** Who must buy cargo insurance, and to what standard. */
  insurance: string;
  insuranceEn: string;
  /** When this rule is the right choice. */
  bestFor: string;
  bestForEn: string;
  /** The failure mode this rule actually produces in practice. */
  watchOut: string;
  watchOutEn: string;
}

export const INCOTERMS: Incoterm[] = [
  {
    code: "EXW",
    name: "Ex Works",
    nameId: "Serah di tempat penjual",
    mode: "semua-moda",
    riskTransfer: "Di gudang atau pabrik penjual, begitu barang disediakan untuk diambil. Pemuatan ke truk pembeli sudah menjadi risiko pembeli.",
    riskTransferEn:
      "At the seller's warehouse or factory, once the goods are made available for collection. Loading onto the buyer's truck is already at the buyer's risk.",
    costTransfer: "Berhenti di pintu pabrik penjual. Seluruh biaya sesudahnya ditanggung pembeli.",
    costTransferEn: "Stops at the seller's factory gate. All costs from that point on are the buyer's responsibility.",
    exportClearance: "Pembeli",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan bagi siapa pun. Pembeli yang menanggung risiko sejak awal, jadi pembeli yang perlu menutupnya.",
    insuranceEn: "Not mandatory for either party. The buyer bears risk from the outset, so it is the buyer who needs cover.",
    bestFor: "Transaksi domestik, atau penjual yang benar-benar tidak punya kapasitas ekspor sama sekali.",
    bestForEn: "Domestic transactions, or sellers with no export capability whatsoever.",
    watchOut:
      "Untuk ekspor, aturan ini bermasalah: pembeli asing harus mengurus PEB atas nama eksportir yang bukan dirinya, sesuatu yang sering tidak bisa dilakukan secara administratif. FCA hampir selalu pilihan yang lebih tepat.",
    watchOutEn:
      "Problematic for export: the foreign buyer would have to file the PEB (Indonesia's export declaration) in the name of an exporter that isn't them, something that is often administratively impossible. FCA is almost always the better choice.",
  },
  {
    code: "FCA",
    name: "Free Carrier",
    nameId: "Serah ke pengangkut",
    mode: "semua-moda",
    riskTransfer:
      "Saat barang diserahkan ke pengangkut yang ditunjuk pembeli, di tempat yang disepakati. Kalau tempatnya adalah lokasi penjual, risiko pindah setelah barang dimuat ke sarana angkut.",
    riskTransferEn:
      "When the goods are handed to the carrier nominated by the buyer, at the agreed place. If that place is the seller's premises, risk transfers once the goods are loaded onto the collecting vehicle.",
    costTransfer: "Sampai titik penyerahan yang disebut dalam kontrak, termasuk pengurusan ekspor.",
    costTransferEn: "Up to the delivery point named in the contract, including export clearance.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan. Pembeli menanggung risiko sejak titik serah, jadi pembeli yang berkepentingan menutupnya.",
    insuranceEn: "Not mandatory. The buyer bears risk from the delivery point, so it is the buyer who has an interest in covering it.",
    bestFor:
      "Kargo kontainer. Untuk barang yang diserahkan di terminal atau depo, ini pengganti FOB yang benar secara teknis.",
    bestForEn: "Containerized cargo. For goods delivered at a terminal or depot, this is the technically correct substitute for FOB.",
    watchOut:
      "Titik serahnya wajib ditulis eksplisit. \"FCA Jakarta\" tanpa alamat menyisakan pertanyaan apakah maksudnya gudang penjual atau terminal, dan jawabannya menentukan siapa menanggung ongkos trucking ke pelabuhan.",
    watchOutEn:
      "The delivery point must be stated explicitly. \"FCA Jakarta\" without an address leaves open whether it means the seller's warehouse or the terminal, and the answer determines who bears the trucking cost to the port.",
  },
  {
    code: "CPT",
    name: "Carriage Paid To",
    nameId: "Ongkos angkut dibayar sampai",
    mode: "semua-moda",
    riskTransfer: "Saat barang diserahkan ke pengangkut pertama di negara asal, jauh sebelum barang tiba di tujuan.",
    riskTransferEn: "When the goods are handed to the first carrier in the country of origin, well before they arrive at destination.",
    costTransfer: "Sampai tempat tujuan yang disebutkan. Penjual membayar seluruh ongkos angkut utama.",
    costTransferEn: "Up to the named place of destination. The seller pays the entire main carriage cost.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan. Ini celah paling sering terlewat: barang berjalan atas biaya penjual tapi atas risiko pembeli, tanpa polis wajib.",
    insuranceEn:
      "Not mandatory. This is the gap most often missed: the goods move at the seller's expense but at the buyer's risk, with no mandatory policy in place.",
    bestFor: "Pengiriman multimoda ketika penjual punya tarif angkut yang lebih baik daripada pembeli.",
    bestForEn: "Multimodal shipments where the seller has better freight rates than the buyer.",
    watchOut:
      "Dua titik yang berbeda: biaya berhenti di tujuan, risiko berhenti di asal. Kalau kontainer rusak di tengah laut, itu kerugian pembeli meski penjual yang membayar freight-nya.",
    watchOutEn:
      "Two different points: cost stops at destination, risk stops at origin. If the container is damaged mid-ocean, that loss falls on the buyer even though the seller is paying the freight.",
  },
  {
    code: "CIP",
    name: "Carriage and Insurance Paid To",
    nameId: "Ongkos angkut dan asuransi dibayar sampai",
    mode: "semua-moda",
    riskTransfer: "Sama seperti CPT: saat barang diserahkan ke pengangkut pertama di negara asal.",
    riskTransferEn: "Same as CPT: when the goods are handed to the first carrier in the country of origin.",
    costTransfer: "Sampai tempat tujuan yang disebutkan, ditambah premi asuransi.",
    costTransferEn: "Up to the named place of destination, plus the insurance premium.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance:
      "Wajib, dan sejak Incoterms 2020 standarnya naik ke Institute Cargo Clauses (A), perlindungan luas. Ini salah satu perubahan paling penting dari edisi 2010.",
    insuranceEn:
      "Mandatory, and since Incoterms 2020 the standard has risen to Institute Cargo Clauses (A), broad cover. This is one of the most significant changes from the 2010 edition.",
    bestFor: "Barang bernilai tinggi lewat jalur multimoda, ketika pembeli ingin perlindungan luas tanpa mengurus polisnya sendiri.",
    bestForEn: "High-value goods moving multimodally, when the buyer wants broad cover without arranging the policy themselves.",
    watchOut:
      "Tingkat perlindungannya berbeda dari CIF, yang masih memakai ICC (C). Menyamakan keduanya membuat pembeli mengira dirinya terlindungi padahal tidak.",
    watchOutEn:
      "The level of cover differs from CIF, which still uses ICC (C). Treating the two as equivalent leaves the buyer believing they are covered when they are not.",
  },
  {
    code: "DAP",
    name: "Delivered at Place",
    nameId: "Serah di tempat tujuan",
    mode: "semua-moda",
    riskTransfer: "Di tempat tujuan yang disepakati, saat barang siap dibongkar di atas sarana angkut. Pembongkarannya sendiri urusan pembeli.",
    riskTransferEn:
      "At the agreed place of destination, when the goods are ready for unloading from the arriving vehicle. Unloading itself is the buyer's responsibility.",
    costTransfer: "Sampai tempat tujuan, tidak termasuk bea masuk dan pajak impor.",
    costTransferEn: "Up to the place of destination, excluding import duty and import taxes.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan, tetapi penjual menanggung risiko sepanjang jalan, jadi penjual yang berkepentingan menutupnya.",
    insuranceEn: "Not mandatory, but the seller bears risk the whole way, so it is the seller who has an interest in covering it.",
    bestFor: "Penjual yang ingin mengendalikan pengalaman pengiriman sampai ke gudang pembeli tanpa mengurus kepabeanan impor.",
    bestForEn: "Sellers who want to control the delivery experience all the way to the buyer's warehouse without handling import customs.",
    watchOut:
      "Bila barang tertahan di bea cukai karena pembeli lambat mengurus impor, biaya demurrage dan storage selama penahanan tetap menjadi tanggungan pembeli, tetapi yang ditelepon terminal biasanya penjual.",
    watchOutEn:
      "If the goods are held at customs because the buyer is slow to clear the import, demurrage and storage charges during the hold remain the buyer's cost, but the terminal usually calls the seller first.",
  },
  {
    code: "DPU",
    name: "Delivered at Place Unloaded",
    nameId: "Serah di tempat tujuan, sudah dibongkar",
    mode: "semua-moda",
    riskTransfer: "Di tempat tujuan, setelah barang selesai dibongkar dari sarana angkut.",
    riskTransferEn: "At the place of destination, once the goods have been unloaded from the arriving vehicle.",
    costTransfer: "Sampai tempat tujuan termasuk biaya bongkar, tidak termasuk bea masuk dan pajak impor.",
    costTransferEn: "Up to the place of destination including unloading costs, excluding import duty and import taxes.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan; risiko ada pada penjual sampai barang dibongkar.",
    insuranceEn: "Not mandatory; risk stays with the seller until the goods are unloaded.",
    bestFor: "Pengiriman ke tempat yang punya alat bongkar dan penjual sanggup mengatur prosesnya.",
    bestForEn: "Shipments to a place with unloading equipment on site, where the seller is able to arrange the process.",
    watchOut:
      "Satu-satunya aturan yang mewajibkan penjual membongkar. Menggantikan DAT sejak edisi 2020 dan diperluas, tujuannya kini bisa di mana saja, tidak harus terminal. Pastikan alat bongkar benar-benar tersedia di lokasi.",
    watchOutEn:
      "The only rule that requires the seller to unload. Replaced DAT as of the 2020 edition and was broadened so the destination can now be anywhere, not just a terminal. Confirm that unloading equipment is actually available on site.",
  },
  {
    code: "DDP",
    name: "Delivered Duty Paid",
    nameId: "Serah di tujuan, bea dan pajak dibayar",
    mode: "semua-moda",
    riskTransfer: "Di tempat tujuan yang disepakati, siap dibongkar.",
    riskTransferEn: "At the agreed place of destination, ready for unloading.",
    costTransfer: "Semuanya, termasuk bea masuk, PPN impor, dan seluruh pungutan di negara tujuan.",
    costTransferEn: "Everything, including import duty, import VAT, and all levies in the destination country.",
    exportClearance: "Penjual",
    importClearance: "Penjual",
    insurance: "Tidak diwajibkan; penjual menanggung risiko sepanjang jalan.",
    insuranceEn: "Not mandatory; the seller bears risk the whole way.",
    bestFor: "Sampel, suku cadang jaminan, dan e-commerce lintas negara dengan nilai kecil.",
    bestForEn: "Samples, warranty spare parts, and low-value cross-border e-commerce.",
    watchOut:
      "Beban maksimum bagi penjual. Di banyak negara importir wajib punya identitas pajak setempat untuk menebus barang, sehingga DDP kadang mustahil dijalankan meski sudah tertulis di kontrak.",
    watchOutEn:
      "Maximum burden on the seller. In many countries the importer must hold a local tax identity to release the goods, which can make DDP impossible to execute in practice even when it is written into the contract.",
  },
  {
    code: "FAS",
    name: "Free Alongside Ship",
    nameId: "Serah di samping kapal",
    mode: "laut",
    riskTransfer: "Saat barang ditempatkan di samping kapal di pelabuhan muat.",
    riskTransferEn: "When the goods are placed alongside the vessel at the port of loading.",
    costTransfer: "Sampai barang berada di samping kapal, termasuk pengurusan ekspor.",
    costTransferEn: "Up to the goods being alongside the vessel, including export clearance.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan.",
    insuranceEn: "Not mandatory.",
    bestFor: "Kargo curah dan barang berat yang dimuat langsung dengan crane dermaga.",
    bestForEn: "Bulk cargo and heavy items loaded directly by quay crane.",
    watchOut: "Tidak cocok untuk kontainer. Kontainer diserahkan ke terminal, bukan ke sisi lambung kapal, pakai FCA.",
    watchOutEn: "Not suited to containers. Containers are delivered to the terminal, not to the ship's side — use FCA instead.",
  },
  {
    code: "FOB",
    name: "Free On Board",
    nameId: "Serah di atas kapal",
    mode: "laut",
    riskTransfer: "Saat barang berada di atas kapal di pelabuhan muat.",
    riskTransferEn: "When the goods are on board the vessel at the port of loading.",
    costTransfer: "Sampai barang di atas kapal, termasuk pengurusan ekspor dan biaya terminal di asal.",
    costTransferEn: "Up to the goods being on board, including export clearance and origin terminal charges.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan.",
    insuranceEn: "Not mandatory.",
    bestFor: "Kargo curah, kendaraan, alat berat, barang yang benar-benar dimuat satu per satu ke atas kapal.",
    bestForEn: "Bulk cargo, vehicles, heavy equipment — goods that are genuinely loaded piece by piece onto the vessel.",
    watchOut:
      "Istilah yang paling sering salah pakai di Indonesia. Untuk kargo kontainer, barang diserahkan ke terminal berhari-hari sebelum naik kapal; menuliskan FOB berarti penjual menanggung risiko atas barang yang sudah tidak dikuasainya. FCA yang benar secara teknis.",
    watchOutEn:
      "The most commonly misused term in Indonesia. For containerized cargo, the goods are delivered to the terminal days before loading; writing FOB means the seller carries risk on cargo it no longer controls. FCA is the technically correct term.",
  },
  {
    code: "CFR",
    name: "Cost and Freight",
    nameId: "Ongkos dan angkutan",
    mode: "laut",
    riskTransfer: "Saat barang berada di atas kapal di pelabuhan muat, sama seperti FOB.",
    riskTransferEn: "When the goods are on board the vessel at the port of loading, same as FOB.",
    costTransfer: "Sampai pelabuhan tujuan. Penjual membayar freight laut.",
    costTransferEn: "Up to the port of destination. The seller pays the ocean freight.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance: "Tidak diwajibkan. Sama seperti CPT, barang berjalan atas biaya penjual tapi atas risiko pembeli.",
    insuranceEn: "Not mandatory. As with CPT, the goods move at the seller's expense but at the buyer's risk.",
    bestFor: "Kargo curah ketika penjual punya kontrak pelayaran yang lebih baik.",
    bestForEn: "Bulk cargo where the seller holds better shipping line contracts.",
    watchOut: "Biaya bongkar di pelabuhan tujuan sering menjadi sengketa. Sebutkan secara eksplisit siapa menanggung THC di tujuan.",
    watchOutEn:
      "Discharge costs at the destination port are a frequent source of dispute. State explicitly who bears destination THC (terminal handling charges).",
  },
  {
    code: "CIF",
    name: "Cost, Insurance and Freight",
    nameId: "Ongkos, asuransi, dan angkutan",
    mode: "laut",
    riskTransfer: "Saat barang berada di atas kapal di pelabuhan muat.",
    riskTransferEn: "When the goods are on board the vessel at the port of loading.",
    costTransfer: "Sampai pelabuhan tujuan, ditambah premi asuransi.",
    costTransferEn: "Up to the port of destination, plus the insurance premium.",
    exportClearance: "Penjual",
    importClearance: "Pembeli",
    insurance:
      "Wajib, minimum Institute Cargo Clauses (C), perlindungan terbatas yang hanya menanggung kejadian besar seperti kapal kandas, terbakar, atau tenggelam.",
    insuranceEn:
      "Mandatory, minimum Institute Cargo Clauses (C), limited cover that responds only to major events such as the vessel running aground, catching fire, or sinking.",
    bestFor: "Kargo curah, dan transaksi berbasis letter of credit yang mensyaratkan polis dari penjual.",
    bestForEn: "Bulk cargo, and letter-of-credit transactions that require a policy from the seller.",
    watchOut:
      "ICC (C) tidak menanggung pencurian, basah, maupun penyok. Pembeli yang butuh perlindungan sungguhan harus membeli polis tambahan sendiri, atau menegosiasikan naik ke ICC (A).",
    watchOutEn:
      "ICC (C) does not cover theft, wetting, or denting. Buyers who need real protection must buy additional cover themselves, or negotiate up to ICC (A).",
  },
];

export function getIncoterm(code: string): Incoterm | undefined {
  return INCOTERMS.find((term) => term.code.toLowerCase() === code.toLowerCase());
}

function assertIncotermIntegrity(): void {
  for (const term of INCOTERMS) {
    for (const [field, value] of Object.entries({
      riskTransferEn: term.riskTransferEn,
      costTransferEn: term.costTransferEn,
      insuranceEn: term.insuranceEn,
      bestForEn: term.bestForEn,
      watchOutEn: term.watchOutEn,
    })) {
      if (!value.trim()) throw new Error(`Incoterm ${term.code}: ${field} is empty`);
    }
  }
  for (const change of INCOTERMS_2020_CHANGES) {
    if (!change.titleEn.trim() || !change.bodyEn.trim()) {
      throw new Error(`Incoterm change "${change.title}": English fields incomplete`);
    }
  }
}

export interface IncotermChange {
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
}

/**
 * What changed in the 2020 edition.
 *
 * Kept as data rather than prose because the most common practical question is
 * not "what is FOB" but "does my 2010 template still say the right thing".
 */
export const INCOTERMS_2020_CHANGES: IncotermChange[] = [
  {
    title: "DAT berganti nama menjadi DPU",
    titleEn: "DAT was renamed DPU",
    body: "Bukan sekadar ganti nama. DAT dulu mengharuskan tujuan berupa terminal; DPU membolehkan tempat mana pun, sepanjang barang dibongkar di sana. Kontrak yang masih menulis DAT tetap sah, tetapi merujuk edisi yang sudah digantikan.",
    bodyEn:
      "Not just a name change. DAT required the destination to be a terminal; DPU allows any place, as long as the goods are unloaded there. Contracts that still say DAT remain valid, but reference a superseded edition.",
  },
  {
    title: "CIP naik ke Institute Cargo Clauses (A)",
    titleEn: "CIP moves up to Institute Cargo Clauses (A)",
    body: "Sebelumnya CIP dan CIF sama-sama hanya mewajibkan ICC (C). Sejak 2020 CIP menuntut perlindungan luas, sementara CIF tetap di ICC (C). Dua aturan yang dulu setara kini berbeda tingkat.",
    bodyEn:
      "Previously CIP and CIF both only required ICC (C). Since 2020, CIP demands broad cover while CIF stays at ICC (C). Two rules that used to be equivalent are now at different levels.",
  },
  {
    title: "FCA bisa meminta bill of lading dengan catatan on-board",
    titleEn: "FCA can now require an on-board bill of lading",
    body: "Menjawab masalah nyata: bank penerbit letter of credit menuntut on-board bill of lading, sesuatu yang secara struktur tidak dihasilkan FCA. Ketentuan baru memungkinkan para pihak menyepakatinya, sehingga eksportir kontainer tidak lagi terpaksa memakai FOB hanya demi memuaskan bank.",
    bodyEn:
      "Answers a real problem: the bank issuing a letter of credit demands an on-board bill of lading, something FCA does not structurally produce. The new provision lets the parties agree to it, so container exporters are no longer forced into FOB just to satisfy the bank.",
  },
  {
    title: "Daftar biaya dikumpulkan pada satu pasal",
    titleEn: "Cost allocation is consolidated into a single article",
    body: "Seluruh alokasi biaya kini terkumpul di pasal A9/B9 tiap aturan. Perubahan tata letak, bukan perubahan aturan, tetapi membuat sengketa biaya jauh lebih cepat diselesaikan karena semua ada di satu tempat.",
    bodyEn:
      "Every cost allocation is now gathered in article A9/B9 of each rule. A layout change, not a rule change, but it settles cost disputes far faster because everything sits in one place.",
  },
  {
    title: "Kewajiban keamanan dinyatakan lebih tegas",
    titleEn: "Security obligations are stated more explicitly",
    body: "Persyaratan terkait keamanan pengangkutan dan biayanya kini disebut eksplisit di pasal A4 dan A7, mengikuti pengetatan aturan keamanan rantai pasok internasional.",
    bodyEn:
      "Requirements related to transport security and its costs are now stated explicitly in articles A4 and A7, following the tightening of international supply-chain security rules.",
  },
];

assertIncotermIntegrity();

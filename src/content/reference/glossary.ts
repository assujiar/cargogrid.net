/**
 * Kamus istilah logistik Indonesia.
 *
 * A glossary is the least glamorous page a logistics company can publish and
 * frequently the most used. New staff meet forty abbreviations in their first
 * week (SPPB, NPE, VGM, THC, LSS) and every one of them is a thing somebody
 * is expected to already know, which is precisely why nobody asks. The gap gets
 * filled by whichever search result answers first.
 *
 * Two deliberate constraints on the entries below:
 *
 * 1. No rates, thresholds, or tariff figures. Those move, and a glossary that
 *    quotes a number becomes wrong without anyone noticing. Definitions here
 *    describe what a thing *is* and where its authoritative value lives.
 * 2. Every entry says why it matters operationally, not just what it expands
 *    to. "PIB = Pemberitahuan Impor Barang" is a decoding; knowing that the
 *    document is what starts the customs channel assignment is the part that
 *    changes what somebody does next.
 */

export type GlossaryCategory = "ekspor-impor" | "pelayaran" | "gudang" | "darat" | "komersial" | "sistem";

export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, string> = {
  "ekspor-impor": "Ekspor, Impor & Kepabeanan",
  pelayaran: "Pelayaran & Kontainer",
  gudang: "Pergudangan & Inventori",
  darat: "Angkutan Darat & Armada",
  komersial: "Komersial, Tarif & Dokumen Komersial",
  sistem: "Sistem, Data & Indikator Kinerja",
};

export const GLOSSARY_CATEGORIES_EN: Record<GlossaryCategory, string> = {
  "ekspor-impor": "Export, Import & Customs",
  pelayaran: "Shipping & Containers",
  gudang: "Warehousing & Inventory",
  darat: "Land Transport & Fleet",
  komersial: "Commercial, Rates & Trade Documents",
  sistem: "Systems, Data & KPIs",
};

export interface GlossaryEntry {
  term: string;
  /**
   * English form of `term`, only when it differs from the Indonesian one.
   * Most entries here are already the term an English reader would search
   * for -- official document names, ISO/carrier abbreviations, industry
   * jargon that never got translated in practice (PIB, B/L, THC). Filling in
   * a stiff literal English gloss for those would teach a phrase nobody
   * outside this glossary uses. Omitted, the UI falls back to `term`.
   */
  termEn?: string;
  /** Expansion, where the term is an abbreviation. */
  expansion?: string;
  /** English form of `expansion`, same omit-if-unchanged rule as `termEn`. */
  expansionEn?: string;
  category: GlossaryCategory;
  definition: string;
  definitionEn: string;
  /** Other terms a reader will need next. Validated at module load. */
  seeAlso?: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  // ---- Ekspor, impor & kepabeanan -----------------------------------------
  {
    term: "PIB",
    expansion: "Pemberitahuan Impor Barang",
    expansionEn: "Customs Import Declaration",
    category: "ekspor-impor",
    definition:
      "Dokumen pemberitahuan pabean yang diajukan importir untuk memasukkan barang ke daerah pabean. Pengajuan PIB inilah yang memicu penetapan jalur pemeriksaan, sehingga keterlambatan menyiapkannya langsung menjadi hari demurrage.",
    definitionEn:
      "The customs declaration filed by an importer to bring goods into customs territory. Filing the PIB is what triggers the inspection-lane assignment, so any delay in preparing it turns directly into demurrage days.",
    seeAlso: ["SPPB", "Jalur Hijau", "Jalur Merah"],
  },
  {
    term: "PEB",
    expansion: "Pemberitahuan Ekspor Barang",
    expansionEn: "Customs Export Declaration",
    category: "ekspor-impor",
    definition:
      "Dokumen pemberitahuan pabean untuk mengeluarkan barang dari daerah pabean. Nomor pendaftaran PEB dibutuhkan sebelum kontainer bisa masuk ke terminal ekspor.",
    definitionEn:
      "The customs declaration for taking goods out of customs territory. A registered PEB number is required before a container can enter the export terminal.",
    seeAlso: ["NPE", "Closing Time"],
  },
  {
    term: "NPE",
    expansion: "Nota Pelayanan Ekspor",
    expansionEn: "Export Service Note",
    category: "ekspor-impor",
    definition:
      "Persetujuan yang terbit setelah PEB diproses dan menjadi izin barang ekspor masuk kawasan pabean untuk dimuat. Tanpa NPE, kontainer akan ditolak di gerbang terminal.",
    definitionEn:
      "The clearance issued once a PEB has been processed, authorizing export goods to enter the customs area for loading. Without an NPE, a container will be turned away at the terminal gate.",
    seeAlso: ["PEB"],
  },
  {
    term: "SPPB",
    expansion: "Surat Persetujuan Pengeluaran Barang",
    expansionEn: "Goods Release Approval Letter",
    category: "ekspor-impor",
    definition:
      "Persetujuan pengeluaran barang impor dari kawasan pabean. Ini tonggak yang paling menentukan dalam perlombaan melawan free time, karena sebelum SPPB terbit truk tidak boleh mengambil kontainer sama sekali.",
    definitionEn:
      "The approval releasing imported goods from the customs area. This is the single most decisive milestone in the race against free time, because no truck may collect a container before the SPPB is issued.",
    seeAlso: ["PIB", "Demurrage"],
  },
  {
    term: "Jalur Hijau",
    termEn: "Green Lane",
    category: "ekspor-impor",
    definition:
      "Penetapan jalur pemeriksaan pabean tanpa pemeriksaan fisik maupun dokumen mendalam, sehingga barang dapat segera dikeluarkan. Jalur ditetapkan berdasarkan profil risiko importir dan komoditasnya.",
    definitionEn:
      "A customs inspection-lane assignment with no physical inspection or in-depth document review, allowing goods to be released immediately. The lane is assigned based on the importer's and commodity's risk profile.",
    seeAlso: ["Jalur Merah", "Jalur Kuning"],
  },
  {
    term: "Jalur Kuning",
    termEn: "Yellow Lane",
    category: "ekspor-impor",
    definition: "Penetapan jalur dengan pemeriksaan dokumen, tanpa pemeriksaan fisik barang.",
    definitionEn: "A lane assignment with document review but no physical inspection of the goods.",
    seeAlso: ["Jalur Hijau", "Jalur Merah"],
  },
  {
    term: "Jalur Merah",
    termEn: "Red Lane",
    category: "ekspor-impor",
    definition:
      "Penetapan jalur dengan pemeriksaan fisik barang. Menambah beberapa hari pada proses pengeluaran, dan biaya behandle serta demurrage yang menyertainya jarang masuk perhitungan awal.",
    definitionEn:
      "A lane assignment involving physical inspection of the goods. It adds several days to the release process, and the behandle and demurrage costs that come with it are rarely in the initial estimate.",
    seeAlso: ["Behandle", "Demurrage"],
  },
  {
    term: "Behandle",
    category: "ekspor-impor",
    definition:
      "Kegiatan membongkar isi kontainer di lokasi pemeriksaan agar petugas dapat memeriksa fisik barang, lalu memuatnya kembali. Biayanya ditanggung importir dan naik seiring jumlah kemasan.",
    definitionEn:
      "The activity of unstuffing a container at the inspection site so officers can physically examine the goods, then restuffing it. The cost is borne by the importer and rises with the number of packages.",
    seeAlso: ["Jalur Merah"],
  },
  {
    term: "HS Code",
    expansion: "Harmonized System Code",
    category: "ekspor-impor",
    definition:
      "Kode klasifikasi barang internasional yang menentukan tarif bea masuk dan persyaratan larangan/pembatasan. Kesalahan klasifikasi adalah salah satu penyebab sengketa kepabeanan yang paling mahal karena bisa ditagih surut.",
    definitionEn:
      "The international goods classification code that determines import duty rates and prohibition/restriction requirements. Misclassification is one of the most expensive causes of customs disputes because it can be reassessed retroactively.",
    seeAlso: ["LARTAS", "BTKI"],
  },
  {
    term: "BTKI",
    expansion: "Buku Tarif Kepabeanan Indonesia",
    expansionEn: "Indonesian Customs Tariff Book",
    category: "ekspor-impor",
    definition: "Daftar resmi klasifikasi barang dan tarifnya di Indonesia, menjadi rujukan penetapan HS Code.",
    definitionEn: "Indonesia's official list of goods classifications and their tariffs, the reference used to assign HS Codes.",
    seeAlso: ["HS Code"],
  },
  {
    term: "LARTAS",
    expansion: "Larangan dan Pembatasan",
    expansionEn: "Prohibitions and Restrictions",
    category: "ekspor-impor",
    definition:
      "Ketentuan yang melarang atau membatasi impor/ekspor komoditas tertentu tanpa izin instansi terkait. Barang LARTAS yang tiba tanpa izin lengkap akan tertahan sementara free time terus berjalan.",
    definitionEn:
      "Rules that prohibit or restrict the import/export of certain commodities without clearance from the relevant agency. LARTAS-flagged goods that arrive without complete permits get held up while free time keeps running.",
    seeAlso: ["HS Code", "INSW"],
  },
  {
    term: "INSW",
    expansion: "Indonesia National Single Window",
    category: "ekspor-impor",
    definition: "Sistem elektronik nasional yang mengintegrasikan perizinan dan kepabeanan lintas kementerian dalam satu pintu.",
    definitionEn: "The national electronic system that integrates licensing and customs processes across ministries into a single gateway.",
    seeAlso: ["CEISA", "LARTAS"],
  },
  {
    term: "CEISA",
    expansion: "Customs-Excise Information System and Automation",
    category: "ekspor-impor",
    definition: "Sistem informasi kepabeanan dan cukai yang memproses dokumen seperti PIB dan PEB secara elektronik.",
    definitionEn: "The customs and excise information system that processes documents such as the PIB and PEB electronically.",
    seeAlso: ["PIB", "PEB", "INSW"],
  },
  {
    term: "PPJK",
    expansion: "Pengusaha Pengurusan Jasa Kepabeanan",
    expansionEn: "Licensed Customs Brokerage",
    category: "ekspor-impor",
    definition:
      "Badan usaha berizin yang mengurus pemenuhan kewajiban pabean untuk kepentingan pemilik barang. Banyak forwarder beroperasi sekaligus sebagai PPJK.",
    definitionEn:
      "A licensed business entity that handles customs obligations on behalf of the goods owner. Many forwarders also operate as a PPJK.",
    seeAlso: ["EMKL", "Freight Forwarder"],
  },
  {
    term: "NIB",
    expansion: "Nomor Induk Berusaha",
    expansionEn: "Business Identification Number",
    category: "ekspor-impor",
    definition: "Identitas pelaku usaha yang sekaligus berlaku sebagai angka pengenal impor bagi perusahaan yang memenuhi syarat.",
    definitionEn: "The business identity number that also serves as the importer identification number for companies that qualify.",
    seeAlso: ["API-U", "API-P"],
  },
  {
    term: "API-U",
    expansion: "Angka Pengenal Importir Umum",
    expansionEn: "General Importer Identification Number",
    category: "ekspor-impor",
    definition: "Identitas importir yang memasukkan barang untuk diperdagangkan kembali.",
    definitionEn: "The importer identification number for an importer bringing in goods to resell.",
    seeAlso: ["API-P", "NIB"],
  },
  {
    term: "API-P",
    expansion: "Angka Pengenal Importir Produsen",
    expansionEn: "Producer Importer Identification Number",
    category: "ekspor-impor",
    definition:
      "Identitas importir yang memasukkan barang untuk keperluan produksinya sendiri. Barangnya pada dasarnya tidak untuk diperdagangkan langsung.",
    definitionEn:
      "The importer identification number for an importer bringing in goods for its own production use. The goods are essentially not meant for direct resale.",
    seeAlso: ["API-U", "NIB"],
  },
  {
    term: "COO / SKA",
    expansion: "Certificate of Origin / Surat Keterangan Asal",
    category: "ekspor-impor",
    definition:
      "Dokumen yang menyatakan negara asal barang dan menjadi dasar klaim tarif preferensi dalam perjanjian dagang. Formulir spesifiknya berbeda per perjanjian.",
    definitionEn:
      "The document declaring a good's country of origin and forming the basis for claiming preferential tariff treatment under a trade agreement. The specific form varies by agreement.",
    seeAlso: ["Form E", "Form D"],
  },
  {
    term: "Form D",
    category: "ekspor-impor",
    definition: "Surat keterangan asal untuk perdagangan intra-ASEAN dalam skema ATIGA.",
    definitionEn: "The certificate of origin used for intra-ASEAN trade under the ATIGA scheme.",
    seeAlso: ["COO / SKA", "Form E"],
  },
  {
    term: "Form E",
    category: "ekspor-impor",
    definition: "Surat keterangan asal untuk skema perdagangan bebas ASEAN dengan Tiongkok.",
    definitionEn: "The certificate of origin used under the ASEAN-China free trade scheme.",
    seeAlso: ["COO / SKA", "Form D"],
  },
  {
    term: "Karantina",
    termEn: "Quarantine",
    category: "ekspor-impor",
    definition:
      "Pemeriksaan dan sertifikasi kesehatan untuk komoditas hewan, tumbuhan, dan produk turunannya. Prosesnya berjalan paralel dengan kepabeanan dan punya tenggatnya sendiri.",
    definitionEn:
      "Health inspection and certification for animal, plant, and derived-product commodities. The process runs in parallel with customs clearance and has its own deadlines.",
    seeAlso: ["Phytosanitary Certificate"],
  },
  {
    term: "Phytosanitary Certificate",
    category: "ekspor-impor",
    definition: "Sertifikat kesehatan tumbuhan yang diterbitkan otoritas karantina, disyaratkan banyak negara tujuan untuk produk nabati.",
    definitionEn: "The plant health certificate issued by the quarantine authority, required by many destination countries for plant-based products.",
    seeAlso: ["Karantina"],
  },
  {
    term: "Fumigasi",
    termEn: "Fumigation",
    category: "ekspor-impor",
    definition:
      "Perlakuan pembasmian organisme pengganggu pada kemasan kayu atau muatan. Butuh waktu tunggu tersendiri yang harus diperhitungkan sebelum closing time.",
    definitionEn:
      "A pest-eradication treatment applied to wood packaging or cargo. It requires its own lead time, which must be factored in ahead of closing time.",
    seeAlso: ["ISPM 15", "Closing Time"],
  },
  {
    term: "ISPM 15",
    category: "ekspor-impor",
    definition:
      "Standar internasional untuk perlakuan kemasan kayu dalam perdagangan. Palet kayu tanpa tanda ISPM 15 dapat ditolak di pelabuhan tujuan meski isinya tidak bermasalah.",
    definitionEn:
      "The international standard for treating wood packaging in trade. Wooden pallets without the ISPM 15 mark can be rejected at the destination port even when the contents are otherwise fine.",
    seeAlso: ["Fumigasi"],
  },

  // ---- Pelayaran & kontainer ----------------------------------------------
  {
    term: "B/L",
    expansion: "Bill of Lading",
    category: "pelayaran",
    definition:
      "Dokumen pengangkutan laut yang sekaligus berfungsi sebagai bukti kontrak, tanda terima barang, dan dokumen kepemilikan yang bisa dialihkan. Sifat terakhir inilah yang membuat B/L asli harus dijaga sebagai surat berharga.",
    definitionEn:
      "The ocean transport document that doubles as evidence of the contract of carriage, a receipt for the goods, and a negotiable document of title. That last property is why an original B/L must be safeguarded like a security.",
    seeAlso: ["HBL", "MBL", "Telex Release", "Sea Waybill"],
  },
  {
    term: "MBL",
    expansion: "Master Bill of Lading",
    category: "pelayaran",
    definition: "Bill of lading yang diterbitkan pelayaran kepada forwarder atau NVOCC sebagai pemesan ruang.",
    definitionEn: "The bill of lading issued by the carrier to the forwarder or NVOCC that booked the space.",
    seeAlso: ["HBL", "B/L"],
  },
  {
    term: "HBL",
    expansion: "House Bill of Lading",
    category: "pelayaran",
    definition: "Bill of lading yang diterbitkan forwarder kepada pemilik barang, berada di bawah payung satu MBL.",
    definitionEn: "The bill of lading issued by the forwarder to the cargo owner, sitting under the umbrella of one MBL.",
    seeAlso: ["MBL", "B/L"],
  },
  {
    term: "Telex Release",
    category: "pelayaran",
    definition:
      "Pelepasan barang tanpa penyerahan B/L asli, setelah pengirim menyerahkan seluruh set asli di pelabuhan muat. Mempercepat pengeluaran barang dan menghilangkan risiko dokumen asli terlambat sampai.",
    definitionEn:
      "Release of goods without surrendering the original B/L, after the shipper has surrendered the full original set at the load port. It speeds up cargo release and removes the risk of the original documents arriving late.",
    seeAlso: ["B/L", "Sea Waybill"],
  },
  {
    term: "Sea Waybill",
    category: "pelayaran",
    definition:
      "Dokumen pengangkutan yang tidak dapat dialihkan. Barang diserahkan kepada consignee yang tercantum tanpa perlu menunjukkan dokumen asli, cocok untuk pengiriman antar afiliasi.",
    definitionEn:
      "A non-negotiable transport document. Goods are released to the named consignee without needing to present an original document, which suits shipments between affiliated companies.",
    seeAlso: ["B/L", "Telex Release"],
  },
  {
    term: "AWB",
    expansion: "Air Waybill",
    category: "pelayaran",
    definition: "Dokumen pengangkutan udara. Berbeda dari B/L laut, AWB tidak pernah menjadi dokumen kepemilikan yang dapat dialihkan.",
    definitionEn: "The air transport document. Unlike an ocean B/L, an AWB is never a negotiable document of title.",
    seeAlso: ["HAWB", "MAWB"],
  },
  {
    term: "MAWB",
    expansion: "Master Air Waybill",
    category: "pelayaran",
    definition: "Air waybill yang diterbitkan maskapai kepada agen kargo.",
    definitionEn: "The air waybill issued by the airline to the cargo agent.",
    seeAlso: ["HAWB", "AWB"],
  },
  {
    term: "HAWB",
    expansion: "House Air Waybill",
    category: "pelayaran",
    definition: "Air waybill yang diterbitkan agen kargo kepada pengirim, berada di bawah satu MAWB.",
    definitionEn: "The air waybill issued by the cargo agent to the shipper, sitting under one MAWB.",
    seeAlso: ["MAWB", "AWB"],
  },
  {
    term: "SI",
    expansion: "Shipping Instruction",
    category: "pelayaran",
    definition:
      "Instruksi tertulis dari pengirim ke pelayaran atau forwarder berisi data yang akan dicetak di B/L. Kesalahan di SI akan mengalir ke seluruh dokumen berikutnya, dan koreksi setelah B/L terbit dikenakan biaya amendemen.",
    definitionEn:
      "The shipper's written instruction to the carrier or forwarder containing the data to be printed on the B/L. Errors in the SI flow through to every downstream document, and corrections after the B/L is issued incur an amendment fee.",
    seeAlso: ["B/L", "Closing Time"],
  },
  {
    term: "DO",
    expansion: "Delivery Order",
    category: "pelayaran",
    definition:
      "Perintah penyerahan barang dari pelayaran atau agen kepada pemegang yang berhak. Jumlah hari free time biasanya tercantum di sini, sehingga DO adalah tempat pertama untuk menghitung tenggat demurrage.",
    definitionEn:
      "The order to release goods, issued by the carrier or agent to the rightful holder. The free time allowance is usually stated here, so the DO is the first place to work out the demurrage deadline.",
    seeAlso: ["Free Time", "Demurrage"],
  },
  {
    term: "VGM",
    expansion: "Verified Gross Mass",
    category: "pelayaran",
    definition:
      "Berat kotor kontainer terverifikasi yang wajib dilaporkan pengirim sebelum pemuatan, sesuai konvensi SOLAS. Kontainer tanpa VGM tidak boleh dimuat ke kapal.",
    definitionEn:
      "The verified gross mass of a container that the shipper must declare before loading, under the SOLAS convention. A container without a VGM may not be loaded onto the vessel.",
    seeAlso: ["Closing Time"],
  },
  {
    term: "Free Time",
    category: "pelayaran",
    definition:
      "Jumlah hari kontainer boleh berada di terminal atau dikuasai pemakai tanpa dikenai denda. Dihitung dalam hari kalender, sehingga akhir pekan dan libur nasional tetap memakannya.",
    definitionEn:
      "The number of days a container may sit at the terminal or stay in the user's possession without incurring a penalty. It is counted in calendar days, so weekends and national holidays still eat into it.",
    seeAlso: ["Demurrage", "Detention", "DO"],
  },
  {
    term: "Demurrage",
    category: "pelayaran",
    definition:
      "Denda karena kontainer masih berada di dalam terminal melewati free time. Pemicunya paling sering ada di meja dokumen, bukan di armada truk.",
    definitionEn:
      "The penalty charged when a container remains inside the terminal beyond free time. The trigger most often sits at the documentation desk, not with the truck fleet.",
    seeAlso: ["Detention", "Free Time", "Storage"],
  },
  {
    term: "Detention",
    category: "pelayaran",
    definition:
      "Denda karena kontainer sudah keluar terminal tetapi belum dikembalikan ke depo melewati batas waktu. Pemicunya biasanya bongkar yang molor di gudang atau antrean depo.",
    definitionEn:
      "The penalty charged when a container has left the terminal but is not returned to the depot within the time limit. It is usually triggered by unloading that runs late at the warehouse or by a queue at the depot.",
    seeAlso: ["Demurrage", "Free Time"],
  },
  {
    term: "Storage",
    category: "pelayaran",
    definition:
      "Biaya penumpukan yang ditagih terminal atas ruang yang dipakai kontainer. Berbeda dari demurrage yang ditagih pelayaran, sehingga satu kontainer terlambat bisa memicu dua tagihan dari dua pihak.",
    definitionEn:
      "The stacking fee the terminal charges for the space a container occupies. It is distinct from demurrage, which the carrier charges, so a single late container can trigger two separate invoices from two parties.",
    seeAlso: ["Demurrage"],
  },
  {
    term: "THC",
    expansion: "Terminal Handling Charge",
    category: "pelayaran",
    definition: "Biaya penanganan kontainer di terminal, ditagih di pelabuhan muat maupun bongkar. Siapa yang menanggungnya di tujuan sering menjadi sengketa jika tidak disebut eksplisit dalam kontrak.",
    definitionEn: "The container handling fee charged at the terminal, at both the load and discharge port. Who bears it at destination is often disputed if the contract does not state it explicitly.",
    seeAlso: ["Incoterms"],
  },
  {
    term: "LSS",
    expansion: "Low Sulphur Surcharge",
    category: "pelayaran",
    definition: "Biaya tambahan atas penggunaan bahan bakar rendah sulfur sesuai aturan emisi maritim.",
    definitionEn: "A surcharge for the use of low-sulphur fuel under maritime emissions regulations.",
    seeAlso: ["BAF"],
  },
  {
    term: "BAF",
    expansion: "Bunker Adjustment Factor",
    category: "pelayaran",
    definition: "Penyesuaian tarif mengikuti pergerakan harga bahan bakar kapal.",
    definitionEn: "A rate adjustment tracking movements in vessel bunker fuel prices.",
    seeAlso: ["LSS", "CAF"],
  },
  {
    term: "CAF",
    expansion: "Currency Adjustment Factor",
    category: "pelayaran",
    definition: "Penyesuaian tarif mengikuti pergerakan nilai tukar.",
    definitionEn: "A rate adjustment tracking movements in the exchange rate.",
    seeAlso: ["BAF"],
  },
  {
    term: "FCL",
    expansion: "Full Container Load",
    category: "pelayaran",
    definition: "Pengiriman yang memakai satu kontainer penuh untuk satu pengirim. Tarifnya per kontainer, bukan per CBM.",
    definitionEn: "A shipment that uses one full container for a single shipper. It is rated per container, not per CBM.",
    seeAlso: ["LCL", "CY"],
  },
  {
    term: "LCL",
    expansion: "Less than Container Load",
    category: "pelayaran",
    definition:
      "Pengiriman yang berbagi kontainer dengan muatan pengirim lain. Ditagih berdasarkan CBM atau berat, mana yang lebih besar, dan menambah waktu untuk konsolidasi serta dekonsolidasi.",
    definitionEn:
      "A shipment that shares a container with other shippers' cargo. It is rated on CBM or weight, whichever is greater, and adds time for consolidation and deconsolidation.",
    seeAlso: ["FCL", "CFS", "CBM"],
  },
  {
    term: "CY",
    expansion: "Container Yard",
    category: "pelayaran",
    definition: "Area penumpukan kontainer di terminal. Istilah CY/CY menandakan serah terima berlangsung antar container yard.",
    definitionEn: "The container stacking area at a terminal. The term CY/CY signifies that handover takes place between container yards.",
    seeAlso: ["CFS", "FCL"],
  },
  {
    term: "CFS",
    expansion: "Container Freight Station",
    category: "pelayaran",
    definition: "Gudang tempat muatan LCL dikonsolidasi dan dipecah kembali.",
    definitionEn: "The warehouse where LCL cargo is consolidated and later broken back down.",
    seeAlso: ["LCL", "CY"],
  },
  {
    term: "Stuffing",
    category: "pelayaran",
    definition: "Kegiatan memasukkan barang ke dalam kontainer.",
    definitionEn: "The activity of loading goods into a container.",
    seeAlso: ["Stripping"],
  },
  {
    term: "Stripping",
    category: "pelayaran",
    definition: "Kegiatan mengeluarkan barang dari kontainer. Disebut juga unstuffing atau devanning.",
    definitionEn: "The activity of unloading goods from a container. Also called unstuffing or devanning.",
    seeAlso: ["Stuffing"],
  },
  {
    term: "Closing Time",
    category: "pelayaran",
    definition:
      "Batas akhir kontainer atau dokumen diterima sebelum kapal berangkat. Terlewat satu jam berarti menunggu jadwal kapal berikutnya, yang di banyak rute berarti satu minggu penuh.",
    definitionEn:
      "The deadline for containers or documents to be received before the vessel departs. Missing it by even an hour means waiting for the next sailing, which on many routes means a full week.",
    seeAlso: ["SI", "VGM", "ETD"],
  },
  {
    term: "Transhipment",
    category: "pelayaran",
    definition:
      "Pemindahan muatan antar kapal di pelabuhan perantara. Menambah titik risiko dan hari transit, serta menjadi penyebab umum ketertinggalan kontainer.",
    definitionEn:
      "The transfer of cargo between vessels at an intermediate port. It adds a risk point and transit days, and is a common cause of a container missing its connection.",
    seeAlso: ["ETA"],
  },
  {
    term: "Depo",
    termEn: "Depot",
    category: "pelayaran",
    definition: "Tempat penyimpanan, pembersihan, dan perbaikan kontainer kosong. Antrean depo saat pengembalian adalah pemicu detention yang paling sering diremehkan.",
    definitionEn: "The site where empty containers are stored, cleaned, and repaired. Queuing at the depot on return is the most commonly underestimated trigger of detention.",
    seeAlso: ["Detention"],
  },
  {
    term: "Reefer",
    category: "pelayaran",
    definition: "Kontainer berpendingin dengan unit refrigerasi terpasang. Membutuhkan pasokan listrik atau genset di sepanjang perjalanan darat.",
    definitionEn: "A refrigerated container with a built-in refrigeration unit. It needs a power supply or genset for the entire inland journey.",
    seeAlso: ["Genset"],
  },
  {
    term: "Genset",
    category: "pelayaran",
    definition: "Generator portabel yang menyuplai listrik ke reefer selama diangkut truk. Biayanya kerap terlewat dari costing.",
    definitionEn: "The portable generator that supplies power to a reefer while it is being trucked. Its cost is often left out of costing.",
    seeAlso: ["Reefer"],
  },
  {
    term: "ETA",
    expansion: "Estimated Time of Arrival",
    category: "pelayaran",
    definition: "Perkiraan waktu tiba. Angka rencana, bukan janji, dan selisihnya dengan ATA adalah data paling berguna untuk menilai keandalan operator.",
    definitionEn: "The estimated arrival time. It is a planning figure, not a promise, and its variance against ATA is the single most useful data point for judging an operator's reliability.",
    seeAlso: ["ATA", "ETD"],
  },
  {
    term: "ETD",
    expansion: "Estimated Time of Departure",
    category: "pelayaran",
    definition: "Perkiraan waktu berangkat.",
    definitionEn: "The estimated departure time.",
    seeAlso: ["ATD", "ETA"],
  },
  {
    term: "ATA",
    expansion: "Actual Time of Arrival",
    category: "pelayaran",
    definition: "Waktu tiba sesungguhnya.",
    definitionEn: "The actual arrival time.",
    seeAlso: ["ETA"],
  },
  {
    term: "ATD",
    expansion: "Actual Time of Departure",
    category: "pelayaran",
    definition: "Waktu berangkat sesungguhnya.",
    definitionEn: "The actual departure time.",
    seeAlso: ["ETD"],
  },
  {
    term: "Dwelling Time",
    category: "pelayaran",
    definition:
      "Lama barang impor berada di pelabuhan sejak dibongkar sampai keluar. Dipakai sebagai indikator nasional efisiensi pelabuhan, dan berbanding lurus dengan risiko demurrage.",
    definitionEn:
      "The length of time imported goods stay at the port, from discharge to gate-out. It is used as a national indicator of port efficiency and correlates directly with demurrage risk.",
    seeAlso: ["Demurrage", "SPPB"],
  },
  {
    term: "NVOCC",
    expansion: "Non-Vessel Operating Common Carrier",
    category: "pelayaran",
    definition: "Pengangkut yang menerbitkan bill of lading sendiri tanpa mengoperasikan kapal, dengan membeli ruang dari pelayaran.",
    definitionEn: "A carrier that issues its own bills of lading without operating vessels, buying space from the shipping line instead.",
    seeAlso: ["Freight Forwarder", "HBL"],
  },
  {
    term: "EMKL",
    expansion: "Ekspedisi Muatan Kapal Laut",
    expansionEn: "Sea Cargo Forwarding Agent",
    category: "pelayaran",
    definition: "Perusahaan yang mengurus muatan kapal laut, termasuk dokumen dan pengangkutan dari dan ke pelabuhan.",
    definitionEn: "A company that handles ocean cargo, including documentation and transport to and from the port.",
    seeAlso: ["PPJK", "Freight Forwarder"],
  },
  {
    term: "Manifest",
    category: "pelayaran",
    definition: "Daftar seluruh muatan di atas satu sarana angkut. Menjadi dasar pencocokan data oleh otoritas pelabuhan dan pabean.",
    definitionEn: "The list of all cargo carried on a single conveyance. It is the baseline that port and customs authorities reconcile their data against.",
    seeAlso: ["B/L"],
  },
  {
    term: "Shipper",
    category: "pelayaran",
    definition: "Pihak pengirim barang yang tercantum pada dokumen pengangkutan.",
    definitionEn: "The party named as sender of the goods on the transport document.",
    seeAlso: ["Consignee", "Notify Party"],
  },
  {
    term: "Consignee",
    category: "pelayaran",
    definition: "Pihak penerima barang yang berhak menebusnya di tujuan.",
    definitionEn: "The party named as receiver of the goods, entitled to claim them at destination.",
    seeAlso: ["Shipper", "Notify Party"],
  },
  {
    term: "Notify Party",
    category: "pelayaran",
    definition: "Pihak yang diberi tahu saat barang tiba. Sering berupa forwarder di tujuan, bukan penerima barangnya sendiri.",
    definitionEn: "The party notified when the goods arrive. It is often the forwarder at destination rather than the consignee itself.",
    seeAlso: ["Consignee"],
  },

  // ---- Pergudangan & inventori --------------------------------------------
  {
    term: "WMS",
    expansion: "Warehouse Management System",
    category: "gudang",
    definition:
      "Sistem yang mengelola lokasi, pergerakan, dan status stok di dalam gudang sampai tingkat bin. Bedanya dengan modul inventori akuntansi: WMS tahu barang ada di rak mana, bukan hanya berapa jumlahnya.",
    definitionEn:
      "A system that manages the location, movement, and status of stock inside a warehouse down to bin level. The difference from an accounting inventory module: a WMS knows which rack the goods are on, not just how many there are.",
    seeAlso: ["Bin", "Putaway", "TMS"],
  },
  {
    term: "Bin",
    category: "gudang",
    definition: "Satuan lokasi terkecil di gudang, biasanya satu kotak rak. Akurasi tingkat bin adalah yang memungkinkan picking tanpa mencari.",
    definitionEn:
      "The smallest location unit in a warehouse, typically a single rack compartment. Bin-level accuracy is what makes picking possible without searching.",
    seeAlso: ["WMS", "Slotting"],
  },
  {
    term: "Putaway",
    category: "gudang",
    definition: "Proses menempatkan barang yang baru diterima ke lokasi penyimpanannya.",
    definitionEn: "The process of moving newly received goods to their storage location.",
    seeAlso: ["Picking", "Bin"],
  },
  {
    term: "Picking",
    category: "gudang",
    definition: "Proses mengambil barang dari lokasi penyimpanan untuk memenuhi pesanan. Umumnya penyumbang biaya tenaga kerja terbesar di gudang.",
    definitionEn:
      "The process of retrieving goods from their storage location to fulfill an order. Typically the largest single contributor to labor cost in a warehouse.",
    seeAlso: ["Slotting", "Putaway"],
  },
  {
    term: "Slotting",
    category: "gudang",
    definition:
      "Penataan posisi SKU di gudang berdasarkan frekuensi pengambilan agar jarak jalan pemetik menjadi sependek mungkin.",
    definitionEn:
      "Arranging SKU positions in a warehouse based on pick frequency so that picker travel distance is as short as possible.",
    seeAlso: ["Picking", "ABC Analysis"],
  },
  {
    term: "ABC Analysis",
    category: "gudang",
    definition: "Pengelompokan SKU berdasarkan kontribusinya terhadap pergerakan atau nilai, dipakai untuk menentukan prioritas slotting dan penghitungan stok.",
    definitionEn:
      "Grouping SKUs by their contribution to movement or value, used to set priorities for slotting and stock counting.",
    seeAlso: ["Slotting", "Cycle Count"],
  },
  {
    term: "Cycle Count",
    category: "gudang",
    definition:
      "Penghitungan stok sebagian secara berkala tanpa menghentikan operasi. Umumnya menemukan selisih lebih cepat daripada stock opname tahunan.",
    definitionEn:
      "A periodic partial stock count carried out without stopping operations. It typically surfaces discrepancies faster than an annual stock opname.",
    seeAlso: ["Stock Opname", "ABC Analysis"],
  },
  {
    term: "Stock Opname",
    termEn: "Physical Inventory Count",
    category: "gudang",
    definition: "Penghitungan fisik seluruh stok, biasanya dengan menghentikan operasional gudang.",
    definitionEn: "A physical count of the entire stock, usually done by halting warehouse operations.",
    seeAlso: ["Cycle Count"],
  },
  {
    term: "SKU",
    expansion: "Stock Keeping Unit",
    category: "gudang",
    definition: "Kode unik untuk satu jenis barang dengan varian tertentu, menjadi satuan dasar pencatatan stok.",
    definitionEn: "A unique code for one item type with a specific variant, forming the base unit for stock records.",
    seeAlso: ["Bin"],
  },
  {
    term: "FIFO",
    expansion: "First In First Out",
    category: "gudang",
    definition: "Aturan pengeluaran barang yang masuk lebih dulu keluar lebih dulu.",
    definitionEn: "The rule that goods received first are issued first.",
    seeAlso: ["FEFO", "LIFO"],
  },
  {
    term: "FEFO",
    expansion: "First Expired First Out",
    category: "gudang",
    definition:
      "Aturan pengeluaran berdasarkan tanggal kedaluwarsa terdekat, bukan tanggal masuk. Wajib untuk pangan dan farmasi, dan tidak selalu sama hasilnya dengan FIFO.",
    definitionEn:
      "The rule that issues goods by nearest expiry date rather than receipt date. Mandatory for food and pharmaceuticals, and does not always produce the same result as FIFO.",
    seeAlso: ["FIFO"],
  },
  {
    term: "LIFO",
    expansion: "Last In First Out",
    category: "gudang",
    definition: "Aturan pengeluaran barang yang masuk terakhir keluar lebih dulu. Jarang dipakai untuk barang bertanggal kedaluwarsa.",
    definitionEn: "The rule that goods received last are issued first. Rarely used for goods with an expiry date.",
    seeAlso: ["FIFO"],
  },
  {
    term: "Cross Docking",
    category: "gudang",
    definition:
      "Memindahkan barang dari kendaraan masuk langsung ke kendaraan keluar tanpa disimpan. Menghemat biaya penyimpanan tetapi menuntut jadwal yang jauh lebih presisi.",
    definitionEn:
      "Moving goods directly from an inbound vehicle to an outbound vehicle without putting them into storage. It saves on storage cost but demands a far more precise schedule.",
    seeAlso: ["Putaway"],
  },
  {
    term: "Safety Stock",
    category: "gudang",
    definition: "Persediaan penyangga untuk meredam ketidakpastian permintaan dan waktu tunggu pasokan.",
    definitionEn: "Buffer inventory held to absorb uncertainty in demand and supply lead time.",
    seeAlso: ["Lead Time", "Reorder Point"],
  },
  {
    term: "Reorder Point",
    category: "gudang",
    definition: "Tingkat stok yang memicu pemesanan ulang, dihitung dari pemakaian selama lead time ditambah safety stock.",
    definitionEn: "The stock level that triggers a reorder, calculated from usage during lead time plus safety stock.",
    seeAlso: ["Safety Stock", "Lead Time"],
  },
  {
    term: "Lead Time",
    category: "gudang",
    definition: "Selang waktu antara pemesanan dan penerimaan barang.",
    definitionEn: "The interval between placing an order and receiving the goods.",
    seeAlso: ["Reorder Point"],
  },
  {
    term: "Reverse Logistics",
    category: "gudang",
    definition:
      "Rangkaian proses menangani barang yang mengalir balik dari pelanggan: retur, penukaran, penarikan, dan pemulihan nilai barangnya.",
    definitionEn:
      "The set of processes for handling goods flowing back from customers: returns, exchanges, recalls, and recovering their value.",
    seeAlso: ["Value Recovery"],
  },
  {
    term: "Value Recovery",
    category: "gudang",
    definition: "Porsi nilai barang retur yang berhasil diselamatkan lewat penjualan ulang, perbaikan, atau daur ulang.",
    definitionEn: "The portion of a returned item's value salvaged through resale, repair, or recycling.",
    seeAlso: ["Reverse Logistics"],
  },
  {
    term: "3PL",
    expansion: "Third Party Logistics",
    category: "gudang",
    definition: "Penyedia jasa logistik yang menjalankan pergudangan dan distribusi atas nama pemilik barang.",
    definitionEn: "A logistics service provider that runs warehousing and distribution on behalf of the goods owner.",
    seeAlso: ["4PL", "WMS"],
  },
  {
    term: "4PL",
    expansion: "Fourth Party Logistics",
    category: "gudang",
    definition: "Pihak yang merancang dan mengelola seluruh rantai pasok pelanggan, termasuk mengoordinasi beberapa 3PL sekaligus.",
    definitionEn:
      "A party that designs and manages a customer's entire supply chain, including coordinating multiple 3PLs at once.",
    seeAlso: ["3PL"],
  },

  // ---- Angkutan darat & armada --------------------------------------------
  {
    term: "ODOL",
    expansion: "Over Dimension Over Loading",
    category: "darat",
    definition:
      "Kendaraan yang dimensinya melebihi ketentuan atau bermuatan melebihi batas yang diizinkan. Menjadi sasaran penindakan di jembatan timbang dan menaikkan biaya perawatan maupun risiko kecelakaan.",
    definitionEn:
      "A vehicle whose dimensions exceed regulation or whose load exceeds the permitted limit. It is a target for enforcement at weighbridges and drives up both maintenance costs and accident risk.",
    seeAlso: ["JBI", "JBB", "Jembatan Timbang"],
  },
  {
    term: "JBB",
    expansion: "Jumlah Berat yang Diperbolehkan",
    expansionEn: "Permitted Gross Weight",
    category: "darat",
    definition: "Batas berat total kendaraan beserta muatannya menurut rancangan pabrikan, tercantum pada dokumen kendaraan.",
    definitionEn:
      "The maximum total weight of a vehicle plus its load as set by the manufacturer's design, stated in the vehicle's registration documents.",
    seeAlso: ["JBI", "ODOL"],
  },
  {
    term: "JBI",
    expansion: "Jumlah Berat yang Diizinkan",
    expansionEn: "Allowable Gross Weight",
    category: "darat",
    definition:
      "Batas berat total yang diizinkan untuk kendaraan pada kelas jalan tertentu. Bisa lebih rendah daripada JBB, karena yang membatasi adalah jalannya, bukan truknya.",
    definitionEn:
      "The maximum total weight permitted for a vehicle on a given road class. It can be lower than the JBB, because the limiting factor is the road, not the truck.",
    seeAlso: ["JBB", "ODOL"],
  },
  {
    term: "Jembatan Timbang",
    termEn: "Weighbridge",
    category: "darat",
    definition: "Fasilitas penimbangan kendaraan angkutan barang di ruas jalan tertentu, tempat pelanggaran muatan ditindak.",
    definitionEn:
      "A vehicle-weighing facility located on specific road sections, where cargo overload violations are enforced.",
    seeAlso: ["ODOL", "JBI"],
  },
  {
    term: "KIR",
    category: "darat",
    definition: "Pengujian berkala kelaikan jalan kendaraan angkutan. Masa berlakunya terbatas dan perlu dijadwalkan seperti perawatan lainnya.",
    definitionEn:
      "The periodic roadworthiness test for commercial vehicles. Its validity period is limited and needs to be scheduled like any other maintenance item.",
    seeAlso: ["Preventive Maintenance"],
  },
  {
    term: "Preventive Maintenance",
    category: "darat",
    definition:
      "Perawatan terjadwal berdasarkan jarak tempuh atau waktu, dilakukan sebelum kerusakan terjadi. Lawan dari perbaikan reaktif yang biayanya jauh lebih tinggi karena mencakup kendaraan yang tidak beroperasi.",
    definitionEn:
      "Maintenance scheduled by distance traveled or elapsed time, performed before a failure occurs. The opposite of reactive repair, which costs far more because it includes the revenue lost while the vehicle sits idle.",
    seeAlso: ["Downtime", "KIR"],
  },
  {
    term: "Downtime",
    category: "darat",
    definition: "Waktu kendaraan tidak dapat beroperasi karena rusak atau diperbaiki. Biaya sesungguhnya mencakup pendapatan yang hilang, bukan hanya ongkos bengkel.",
    definitionEn:
      "Time during which a vehicle cannot operate because it is broken down or under repair. The real cost includes lost revenue, not just the workshop bill.",
    seeAlso: ["Preventive Maintenance"],
  },
  {
    term: "Uang Jalan",
    termEn: "Trip Allowance",
    category: "darat",
    definition:
      "Dana yang diberikan di muka kepada sopir untuk bahan bakar, tol, retribusi, dan makan selama perjalanan. Pertanggungjawabannya adalah salah satu titik rekonsiliasi kas tersulit di perusahaan trucking.",
    definitionEn:
      "Funds advanced to a driver for fuel, tolls, local levies, and meals during a trip. Accounting for how it was spent is one of the hardest cash-reconciliation points in a trucking company.",
    seeAlso: ["POD"],
  },
  {
    term: "Surat Jalan",
    termEn: "Waybill",
    category: "darat",
    definition:
      "Dokumen yang menyertai barang selama pengiriman, memuat rincian muatan, asal, dan tujuan. Lembar yang ditandatangani penerima menjadi bukti serah terima.",
    definitionEn:
      "The document that accompanies goods in transit, recording load details, origin, and destination. The copy signed by the consignee serves as proof of handover.",
    seeAlso: ["POD", "BAST"],
  },
  {
    term: "POD",
    expansion: "Proof of Delivery",
    category: "darat",
    definition:
      "Bukti bahwa barang telah diterima. Dalam bentuk kertas, POD adalah dokumen yang paling sering menghambat penagihan karena harus kembali secara fisik ke kantor sebelum invoice bisa dibuat.",
    definitionEn:
      "Evidence that goods have been received. In paper form, the POD is the document most likely to hold up billing, since it must physically make its way back to the office before an invoice can be issued.",
    seeAlso: ["ePOD", "Surat Jalan", "DSO"],
  },
  {
    term: "ePOD",
    expansion: "Electronic Proof of Delivery",
    category: "darat",
    definition:
      "Bukti terima digital berupa tanda tangan, foto, dan koordinat lokasi yang terkirim seketika. Memutus jeda antara barang diterima dan invoice bisa diterbitkan.",
    definitionEn:
      "A digital proof of receipt — signature, photo, and location coordinates — transmitted instantly. It closes the gap between goods being received and the invoice being issued.",
    seeAlso: ["POD", "DSO"],
  },
  {
    term: "BAST",
    expansion: "Berita Acara Serah Terima",
    expansionEn: "Handover Certificate",
    category: "darat",
    definition: "Dokumen formal serah terima barang atau pekerjaan, umum disyaratkan pada kontrak korporat dan proyek.",
    definitionEn:
      "The formal document recording the handover of goods or completed work, commonly required in corporate and project contracts.",
    seeAlso: ["Surat Jalan", "POD"],
  },
  {
    term: "Last Mile",
    category: "darat",
    definition: "Tahap akhir pengiriman sampai ke penerima. Segmen dengan biaya per kilogram tertinggi di sepanjang rantai.",
    definitionEn:
      "The final leg of delivery to the recipient. The segment with the highest cost per kilogram along the entire chain.",
    seeAlso: ["First Mile"],
  },
  {
    term: "First Mile",
    category: "darat",
    definition: "Tahap awal pengiriman dari pemilik barang ke titik konsolidasi pertama.",
    definitionEn: "The initial leg of a shipment, from the goods owner to the first consolidation point.",
    seeAlso: ["Last Mile"],
  },
  {
    term: "Backhaul",
    category: "darat",
    definition:
      "Muatan untuk perjalanan pulang setelah pengantaran. Mengisi rit balik adalah cara paling langsung menurunkan biaya per lane karena solar dan sopir tetap dibayar apa pun isinya.",
    definitionEn:
      "Cargo carried on the return trip after a delivery. Filling the return leg is the most direct way to cut cost per lane, since fuel and the driver are paid regardless of what the truck is carrying.",
    seeAlso: ["Utilisasi Armada"],
  },
  {
    term: "Utilisasi Armada",
    termEn: "Fleet Utilization",
    category: "darat",
    definition: "Proporsi kapasitas armada yang benar-benar menghasilkan pendapatan, diukur dari waktu, jarak, atau muatan.",
    definitionEn:
      "The proportion of fleet capacity that actually generates revenue, measured by time, distance, or load.",
    seeAlso: ["Backhaul", "Downtime"],
  },
  {
    term: "Karoseri",
    termEn: "Coachbuilder",
    category: "darat",
    definition:
      "Pembuat bodi kendaraan yang memasang bak, box, atau peralatan di atas sasis. Karoseri inilah yang menentukan dimensi ruang muat dan berat kosong akhir kendaraan, sehingga dua truk dengan sasis identik bisa berbeda kapasitasnya.",
    definitionEn:
      "A vehicle body builder that fits the flatbed, box, or other equipment onto a chassis. It is the coachbuilder that determines the final load-space dimensions and curb weight, so two trucks with identical chassis can end up with different capacities.",
    seeAlso: ["JBI", "Wingbox"],
  },
  {
    term: "CDE",
    expansion: "Colt Diesel Engkel",
    expansionEn: "Colt Diesel Single",
    category: "darat",
    definition:
      "Sebutan pasar untuk truk ringan bergandar dua dengan roda belakang tunggal. Bukan kelas hukum, dan tidak punya angka kapasitas baku.",
    definitionEn:
      "A market name for a light two-axle truck with single rear wheels. Not a legal vehicle class, and it carries no standardized capacity figure.",
    seeAlso: ["CDD", "Karoseri", "JBI"],
  },
  {
    term: "CDD",
    expansion: "Colt Diesel Double",
    category: "darat",
    definition:
      "Sebutan pasar untuk truk ringan bergandar dua dengan roda belakang ganda. Berroda enam tetapi tetap dua gandar, perbedaan yang penting karena golongan tol menghitung gandar, bukan roda.",
    definitionEn:
      "A market name for a light two-axle truck with dual rear wheels. It has six wheels but still only two axles — a distinction that matters because toll classification counts axles, not wheels.",
    seeAlso: ["CDE", "Golongan Tol"],
  },
  {
    term: "Tronton",
    category: "darat",
    definition:
      "Sebutan pasar untuk truk rigid bergandar tiga. Kapasitasnya berbeda antara konfigurasi 6x2 dan 6x4 serta menurut bodinya, sehingga sebutan ini tidak menentukan payload.",
    definitionEn:
      "A market name for a three-axle rigid truck. Capacity differs between 6x2 and 6x4 configurations and by body type, so the name alone does not determine payload.",
    seeAlso: ["Trintin", "Golongan Tol"],
  },
  {
    term: "Trintin",
    category: "darat",
    definition: "Sebutan pasar untuk truk rigid bergandar empat. Bukan istilah dalam peraturan.",
    definitionEn: "A market name for a four-axle rigid truck. Not a term defined in regulation.",
    seeAlso: ["Tronton"],
  },
  {
    term: "Wingbox",
    category: "darat",
    definition:
      "Bodi box yang dinding sampingnya membuka ke atas, sehingga forklift bisa memuat dari sisi. Menghemat waktu muat pada barang berpalet; volumenya bergantung pada mekanisme sayap yang memakan ruang.",
    definitionEn:
      "A box body whose side walls open upward like wings, letting a forklift load from the side. It saves loading time for palletized goods; usable volume is reduced by the space the wing mechanism itself takes up.",
    seeAlso: ["Curtainsider", "Karoseri"],
  },
  {
    term: "Curtainsider",
    category: "darat",
    definition:
      "Bodi bersisi tirai. Lebih ringan daripada wingbox berdinding keras sehingga menyisakan lebih banyak jatah berat untuk muatan, tetapi keamanan muatannya berbeda.",
    definitionEn:
      "A curtain-sided body. It is lighter than a hard-walled wingbox, leaving more weight allowance for cargo, but cargo security differs.",
    seeAlso: ["Wingbox"],
  },
  {
    term: "Tractor Head",
    category: "darat",
    definition:
      "Unit penarik yang membawa semi-trailer. Biaya dan penggolongannya harus dihitung sebagai satu rangkaian utuh dengan trailernya, bukan sebagai kendaraan terpisah.",
    definitionEn:
      "The towing unit that hauls a semi-trailer. Its cost and classification must be calculated as one complete combination with its trailer, not as a separate vehicle.",
    seeAlso: ["Skeletal", "Lowbed", "Golongan Tol"],
  },
  {
    term: "Skeletal",
    category: "darat",
    definition:
      "Chassis trailer dengan twist lock untuk membawa kontainer. Payload kontainer bukan payload jalan, yang berlaku adalah yang terendah di antara rating kontainer, rating chassis, dan JBKI yang diizinkan.",
    definitionEn:
      "A trailer chassis fitted with twist locks for carrying containers. Container payload is not the same as road payload — what applies is whichever is lowest among the container's rating, the chassis rating, and the permitted JBKI.",
    seeAlso: ["Tractor Head", "JBI"],
  },
  {
    term: "Lowbed",
    category: "darat",
    definition:
      "Semi-trailer berdek rendah untuk alat berat. Dek yang rendah menurunkan tinggi total muatan, tetapi tidak dengan sendirinya membuat muatan berdimensi lebih menjadi sah.",
    definitionEn:
      "A low-deck semi-trailer for heavy equipment. The low deck reduces overall load height, but it does not by itself make an over-dimension load legal.",
    seeAlso: ["Tractor Head", "OOG"],
  },
  {
    term: "Dolly",
    category: "darat",
    definition: "Modul sumbu tanpa penggerak yang menyambung atau menopang muatan panjang dan berat. Perlu kajian teknik dan penilaian rute.",
    definitionEn:
      "An unpowered axle module that connects to or supports long, heavy loads. It requires engineering study and route assessment.",
    seeAlso: ["Lowbed", "SPMT"],
  },
  {
    term: "SPMT",
    expansion: "Self-Propelled Modular Transporter",
    category: "darat",
    definition:
      "Platform bersumbu banyak yang bergerak sendiri untuk muatan sangat berat. Biayanya biasanya dimodelkan per jam atau per shift proyek, bukan per kilometer seperti armada jalan raya.",
    definitionEn:
      "A multi-axle, self-propelled platform for extremely heavy loads. Its cost is typically modeled per hour or per project shift, not per kilometer like a standard road fleet.",
    seeAlso: ["Dolly", "Lowbed"],
  },
  {
    term: "OOG",
    expansion: "Out of Gauge",
    category: "darat",
    definition:
      "Muatan yang melebihi selubung peralatan standar. Berbeda dari kendaraan yang dimodifikasi melampaui ketentuan: muatan OOG tetap bisa diangkut secara sah dengan peralatan yang sesuai, kajian rute, dan izin.",
    definitionEn:
      "A load that exceeds the standard equipment envelope. This differs from a vehicle illegally modified beyond regulation: an OOG load can still be transported lawfully with the right equipment, route survey, and permits.",
    seeAlso: ["ODOL", "Lowbed"],
  },
  {
    term: "MST",
    expansion: "Muatan Sumbu Terberat",
    expansionEn: "Maximum Axle Load",
    category: "darat",
    definition:
      "Batas berat yang boleh ditanggung satu sumbu pada kelas jalan tertentu. Membatasi per sumbu, bukan berat total, sehingga muatan yang menumpuk di belakang bisa melanggar meski berat totalnya masih aman.",
    definitionEn:
      "The maximum weight a single axle may bear on a given road class. It limits weight per axle, not total weight, so a load stacked toward the rear can violate the limit even while the overall weight stays within bounds.",
    seeAlso: ["Kelas Jalan", "JBI", "ODOL"],
  },
  {
    term: "Kelas Jalan",
    termEn: "Road Class",
    category: "darat",
    definition:
      "Penggolongan ruas jalan yang menetapkan batas lebar, panjang, tinggi, dan muatan sumbu terberat. Inilah sebabnya truk yang sama bisa sah di satu rute dan melanggar di rute lain.",
    definitionEn:
      "The classification of road sections that sets limits on width, length, height, and maximum axle load. This is why the same truck can be legal on one route and in violation on another.",
    seeAlso: ["MST", "JBI"],
  },
  {
    term: "Golongan Tol",
    termEn: "Toll Class",
    category: "darat",
    definition:
      "Penggolongan kendaraan di jalan tol menurut jenis dan jumlah gandar, dari Golongan I sampai V. Menentukan kelompok tarif, bukan besaran tarifnya, tarif berbeda per ruas dan per tanggal berlaku.",
    definitionEn:
      "The classification of vehicles on toll roads by type and number of axles, from Class I to Class V. It determines the tariff group, not the tariff amount — rates differ by road section and by effective date.",
    seeAlso: ["Golongan Penyeberangan", "CDD"],
  },
  {
    term: "Golongan Penyeberangan",
    termEn: "Ferry Class",
    category: "darat",
    definition:
      "Penggolongan kendaraan di kapal penyeberangan menurut fungsi dan panjang keseluruhan, dari Golongan I sampai IX. Dasarnya berbeda dari golongan tol, sehingga keduanya tidak bisa saling menggantikan dalam perhitungan biaya rute.",
    definitionEn:
      "The classification of vehicles on ferry crossings by function and overall length, from Class I to Class IX. Its basis differs from the toll classification, so the two cannot substitute for each other when calculating route costs.",
    seeAlso: ["Golongan Tol"],
  },
  {
    term: "Cost per KM",
    category: "darat",
    definition:
      "Biaya menjalankan satu unit per kilometer, mencakup biaya tetap dan biaya jalan. Angka per kilometer bermuatan selalu lebih tinggi daripada per kilometer total, karena rit kosong tidak menghasilkan pendapatan tetapi tetap memakan biaya.",
    definitionEn:
      "The cost of running one unit per kilometer, including fixed costs and running costs. Cost per loaded kilometer is always higher than cost per total kilometer, because an empty leg generates no revenue but still consumes cost.",
    seeAlso: ["Backhaul", "Cost per Lane", "Utilisasi Armada"],
  },
  {
    term: "Loading Meter",
    category: "darat",
    definition:
      "Satuan kapasitas untuk bodi datar: panjang lantai muat yang terpakai selebar bak. Dipakai menggantikan meter kubik pada flatbed, karena muatan proyek tidak bertumpuk ke atas seperti kardus.",
    definitionEn:
      "A capacity unit for flat bodies: the length of load floor occupied, at the full width of the bed. It replaces cubic meters on flatbeds, because project cargo does not stack upward the way cartons do.",
    seeAlso: ["Karoseri"],
  },

  // ---- Komersial, tarif & dokumen komersial -------------------------------
  {
    term: "RFQ",
    expansion: "Request for Quotation",
    category: "komersial",
    definition:
      "Permintaan penawaran harga dari calon pelanggan. Kecepatan menjawabnya adalah salah satu penentu tingkat kemenangan yang paling langsung terlihat.",
    definitionEn:
      "A price-quote request from a prospective customer. Response speed is one of the most directly visible drivers of win rate.",
    seeAlso: ["Quotation", "Rate Card"],
  },
  {
    term: "Quotation",
    category: "komersial",
    definition: "Penawaran harga resmi berikut cakupan layanan, masa berlaku, dan syaratnya.",
    definitionEn: "A formal price offer, including scope of service, validity period, and terms.",
    seeAlso: ["RFQ", "Rate Card"],
  },
  {
    term: "Rate Card",
    category: "komersial",
    definition:
      "Daftar tarif per lane, per layanan, atau per jenis muatan. Tarif beli dan tarif jual yang tersebar di banyak berkas Excel adalah sumber kebocoran margin yang paling umum.",
    definitionEn:
      "A list of rates by lane, by service, or by cargo type. Buying and selling rates scattered across numerous spreadsheets are the most common source of margin leakage.",
    seeAlso: ["Buying Rate", "Selling Rate"],
  },
  {
    term: "Buying Rate",
    category: "komersial",
    definition: "Tarif yang dibayarkan kepada vendor atau subkontraktor.",
    definitionEn: "The rate paid to a vendor or subcontractor.",
    seeAlso: ["Selling Rate", "Margin per Job"],
  },
  {
    term: "Selling Rate",
    category: "komersial",
    definition: "Tarif yang ditagihkan kepada pelanggan.",
    definitionEn: "The rate billed to the customer.",
    seeAlso: ["Buying Rate", "Margin per Job"],
  },
  {
    term: "Margin per Job",
    category: "komersial",
    definition:
      "Selisih tarif jual dan seluruh biaya yang melekat pada satu pengiriman. Hanya bermakna bila semua biaya susulan sudah masuk, termasuk yang invoicenya baru datang berminggu-minggu kemudian.",
    definitionEn:
      "The difference between the selling rate and every cost attached to a single shipment. It's only meaningful once all trailing costs have landed, including invoices that arrive weeks later.",
    seeAlso: ["Buying Rate", "Selling Rate"],
  },
  {
    term: "Commercial Invoice",
    category: "komersial",
    definition: "Faktur perdagangan antara penjual dan pembeli, menjadi dasar penetapan nilai pabean.",
    definitionEn: "The trade invoice between seller and buyer, forming the basis for customs valuation.",
    seeAlso: ["Packing List", "PIB"],
  },
  {
    term: "Packing List",
    category: "komersial",
    definition:
      "Rincian isi tiap kemasan berikut dimensi dan beratnya. Dokumen inilah yang dipakai memverifikasi muatan saat pemeriksaan fisik.",
    definitionEn:
      "An itemized breakdown of each package's contents, dimensions, and weight. This is the document used to verify cargo during a physical inspection.",
    seeAlso: ["Commercial Invoice", "CBM"],
  },
  {
    term: "CBM",
    expansion: "Cubic Meter",
    category: "komersial",
    definition:
      "Satuan volume muatan, dihitung dari panjang kali lebar kali tinggi dalam meter. Menjadi dasar penagihan LCL dan penentu apakah muatan ditagih berdasarkan berat atau volume.",
    definitionEn:
      "The unit of cargo volume, calculated as length times width times height in meters. It underpins LCL billing and determines whether cargo is charged by weight or by volume.",
    seeAlso: ["Chargeable Weight", "LCL"],
  },
  {
    term: "Chargeable Weight",
    category: "komersial",
    definition:
      "Berat yang dipakai menagih, yaitu yang lebih besar antara berat sesungguhnya dan berat volumetrik. Barang ringan bervolume besar hampir selalu ditagih berdasarkan volumenya.",
    definitionEn:
      "The weight used for billing: whichever is greater between actual weight and volumetric weight. Light, bulky cargo is almost always billed on its volume.",
    seeAlso: ["CBM", "Volumetric Weight"],
  },
  {
    term: "Volumetric Weight",
    category: "komersial",
    definition:
      "Berat setara volume: hasil kali panjang, lebar, dan tinggi dalam sentimeter, dibagi divisor moda yang berlaku. Kargo udara umumnya memakai divisor 6.000 dan kurir internasional 5.000. Dinyatakan dalam meter kubik, keduanya sama dengan mengalikan CBM dengan 166,67 dan 200 kg.",
    definitionEn:
      "The volume-equivalent weight: length times width times height in centimeters, divided by the applicable mode divisor. Air cargo typically uses a divisor of 6,000 and international couriers use 5,000. Expressed in cubic meters, these are the same as multiplying CBM by 166.67 kg and 200 kg respectively.",
    seeAlso: ["Chargeable Weight", "CBM"],
  },
  {
    term: "Incoterms",
    category: "komersial",
    definition:
      "Sebelas aturan ICC yang membagi biaya, risiko, dan kewajiban antara penjual dan pembeli. Titik pindah biaya dan titik pindah risiko bisa berada di tempat yang berbeda, dan di situlah sengketa biasanya bermula.",
    definitionEn:
      "The eleven ICC rules that divide cost, risk, and obligation between seller and buyer. The point where cost transfers and the point where risk transfers can sit in different places, and that is usually where disputes start.",
    seeAlso: ["FOB", "CIF"],
  },
  {
    term: "FOB",
    category: "komersial",
    definition: "Aturan Incoterms untuk moda laut. Risiko pindah ke pembeli saat barang berada di atas kapal di pelabuhan muat.",
    definitionEn: "An Incoterms rule for sea freight. Risk passes to the buyer once the goods are on board the vessel at the port of loading.",
    seeAlso: ["Incoterms", "CIF"],
  },
  {
    term: "CIF",
    category: "komersial",
    definition:
      "Aturan Incoterms moda laut. Penjual membayar ongkos angkut dan asuransi sampai pelabuhan tujuan, tetapi risiko sudah pindah ke pembeli sejak pelabuhan muat.",
    definitionEn:
      "A sea-freight Incoterms rule. The seller pays freight and insurance through to the destination port, but risk has already transferred to the buyer at the port of loading.",
    seeAlso: ["Incoterms", "FOB"],
  },
  {
    term: "Freight Forwarder",
    category: "komersial",
    definition: "Penyedia jasa yang mengatur pengangkutan barang atas nama pemilik barang, umumnya tanpa memiliki sarana angkut sendiri.",
    definitionEn: "A service provider that arranges the carriage of goods on behalf of the cargo owner, generally without owning its own transport assets.",
    seeAlso: ["NVOCC", "PPJK", "3PL"],
  },
  {
    term: "SLA",
    expansion: "Service Level Agreement",
    category: "komersial",
    definition:
      "Kesepakatan tingkat layanan berikut ukuran dan konsekuensinya. SLA tanpa data pengukuran yang disepakati bersama pada praktiknya tidak bisa ditegakkan.",
    definitionEn:
      "A service-level agreement together with its metrics and consequences. In practice, an SLA without jointly agreed measurement data cannot be enforced.",
    seeAlso: ["OTD", "OTIF"],
  },

  // ---- Sistem, data & indikator kinerja -----------------------------------
  {
    term: "TMS",
    expansion: "Transportation Management System",
    category: "sistem",
    definition:
      "Sistem yang mengelola perencanaan, penugasan, pelacakan, dan penagihan pengiriman. Bersama WMS menjadi dua tulang punggung operasional penyedia jasa logistik.",
    definitionEn:
      "The system that manages planning, assignment, tracking, and billing for shipments. Together with the WMS, it forms the two operational backbones of a logistics service provider.",
    seeAlso: ["WMS", "ERP"],
  },
  {
    term: "ERP",
    expansion: "Enterprise Resource Planning",
    category: "sistem",
    definition:
      "Sistem terpadu yang menyatukan proses lintas fungsi dalam satu basis data. Dalam konteks logistik, nilainya muncul saat operasional dan keuangan berbagi satu angka yang sama, bukan dua versi yang direkonsiliasi tiap bulan.",
    definitionEn:
      "An integrated system that unifies cross-functional processes in a single database. In a logistics context, its value shows up when operations and finance share the same figure, instead of reconciling two versions every month.",
    seeAlso: ["TMS", "WMS"],
  },
  {
    term: "OTD",
    expansion: "On Time Delivery",
    category: "sistem",
    definition: "Persentase pengiriman yang tiba sesuai jadwal yang dijanjikan.",
    definitionEn: "The percentage of shipments that arrive on the promised schedule.",
    seeAlso: ["OTIF", "SLA"],
  },
  {
    term: "OTIF",
    expansion: "On Time In Full",
    category: "sistem",
    definition:
      "Persentase pesanan yang tiba tepat waktu sekaligus lengkap jumlahnya. Ukuran yang lebih jujur daripada OTD, karena pengiriman tepat waktu yang kurang barang tetap dihitung gagal.",
    definitionEn:
      "The percentage of orders that arrive both on time and complete in quantity. A more honest measure than OTD, since an on-time delivery that is short on goods still counts as a failure.",
    seeAlso: ["OTD", "Fill Rate"],
  },
  {
    term: "Fill Rate",
    category: "sistem",
    definition: "Persentase permintaan yang dapat dipenuhi dari stok yang ada tanpa kekurangan.",
    definitionEn: "The percentage of demand that can be filled from existing stock without a shortfall.",
    seeAlso: ["OTIF", "Safety Stock"],
  },
  {
    term: "DSO",
    expansion: "Days Sales Outstanding",
    category: "sistem",
    definition:
      "Rata-rata jumlah hari sejak jasa diberikan sampai uangnya diterima. Di perusahaan logistik, DSO sering lebih ditentukan oleh kecepatan POD kembali daripada oleh perilaku bayar pelanggan.",
    definitionEn:
      "The average number of days between a service being rendered and payment being received. At a logistics company, DSO is often driven more by how fast the POD comes back than by customer payment behavior.",
    seeAlso: ["POD", "ePOD"],
  },
  {
    term: "Cost per Lane",
    category: "sistem",
    definition: "Biaya sesungguhnya untuk melayani satu rute, mencakup rit balik kosong, tunggu muat, dan denda.",
    definitionEn:
      "The true cost of serving a single route, including empty backhaul runs, loading wait time, and penalties.",
    seeAlso: ["Backhaul", "Margin per Job"],
  },
  {
    term: "Track and Trace",
    category: "sistem",
    definition:
      "Kemampuan menampilkan posisi dan status kiriman sepanjang perjalanan. Nilainya bukan pada peta, melainkan pada berkurangnya panggilan telepon menanyakan posisi barang.",
    definitionEn:
      "The ability to display a shipment's position and status throughout its journey. The value is not the map itself, but the drop in phone calls asking where the goods are.",
    seeAlso: ["Customer Portal", "Milestone"],
  },
  {
    term: "Milestone",
    category: "sistem",
    definition: "Titik status yang dicatat sepanjang perjalanan kiriman, misalnya muat, berangkat, tiba, bongkar, dan serah terima.",
    definitionEn:
      "A status point recorded along a shipment's journey, such as loaded, departed, arrived, unloaded, and handed over.",
    seeAlso: ["Track and Trace"],
  },
  {
    term: "Customer Portal",
    category: "sistem",
    definition:
      "Kanal mandiri tempat pelanggan memeriksa status, dokumen, dan tagihannya sendiri. Memindahkan beban pertanyaan rutin dari tim operasional ke sistem.",
    definitionEn:
      "A self-service channel where customers check their own status, documents, and invoices. It shifts the load of routine inquiries from the operations team onto the system.",
    seeAlso: ["Track and Trace"],
  },
  {
    term: "API",
    expansion: "Application Programming Interface",
    category: "sistem",
    definition:
      "Antarmuka yang memungkinkan dua sistem bertukar data secara otomatis, misalnya agar status kiriman langsung masuk ke sistem pelanggan tanpa entri ulang.",
    definitionEn:
      "An interface that lets two systems exchange data automatically, for example so shipment status flows straight into a customer's system without re-entry.",
    seeAlso: ["EDI"],
  },
  {
    term: "EDI",
    expansion: "Electronic Data Interchange",
    category: "sistem",
    definition: "Pertukaran dokumen bisnis antar sistem dalam format baku. Masih menjadi tulang punggung integrasi dengan pelayaran dan pelanggan korporat besar.",
    definitionEn:
      "The exchange of business documents between systems in a standardized format. Still the backbone of integration with shipping lines and large corporate customers.",
    seeAlso: ["API"],
  },
  {
    term: "RBAC",
    expansion: "Role-Based Access Control",
    category: "sistem",
    definition:
      "Pengaturan hak akses berdasarkan peran, bukan per orang. Membuat pencabutan akses saat karyawan keluar menjadi satu tindakan, bukan penelusuran ke banyak sistem.",
    definitionEn:
      "Access rights configured by role rather than by individual. It turns revoking access when an employee leaves into a single action, instead of a hunt across many systems.",
    seeAlso: ["Audit Trail"],
  },
  {
    term: "Audit Trail",
    category: "sistem",
    definition: "Catatan tak terhapus tentang siapa mengubah apa dan kapan. Menjadi dasar penyelesaian sengketa data dan syarat sebagian besar audit.",
    definitionEn:
      "An immutable record of who changed what and when. It forms the basis for resolving data disputes and is a requirement for most audits.",
    seeAlso: ["RBAC"],
  },
];

export function glossaryByCategory(category: GlossaryCategory): GlossaryEntry[] {
  return GLOSSARY.filter((entry) => entry.category === category);
}

export function findGlossaryEntry(term: string): GlossaryEntry | undefined {
  const needle = term.toLowerCase();
  return GLOSSARY.find((entry) => entry.term.toLowerCase() === needle);
}

/** Stable anchor for deep links, so `#istilah-hs-code` survives reordering. */
export function glossaryAnchor(entry: GlossaryEntry): string {
  return `istilah-${entry.term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

/**
 * A dangling `seeAlso` renders as plain text where a link was intended, which
 * looks like an oversight and is invisible in review. Failing the build is the
 * cheaper outcome, the same reasoning the article registry applies to its own
 * cross-links.
 */
function assertGlossaryIntegrity(): void {
  const terms = new Set<string>();
  const anchors = new Set<string>();

  for (const entry of GLOSSARY) {
    const key = entry.term.toLowerCase();
    if (terms.has(key)) throw new Error(`Duplicate glossary term: ${entry.term}`);
    terms.add(key);

    const anchor = glossaryAnchor(entry);
    if (anchors.has(anchor)) throw new Error(`Duplicate glossary anchor "${anchor}" from term ${entry.term}`);
    anchors.add(anchor);
  }

  for (const entry of GLOSSARY) {
    for (const reference of entry.seeAlso || []) {
      if (!terms.has(reference.toLowerCase())) {
        throw new Error(`Glossary entry "${entry.term}" points at unknown term: ${reference}`);
      }
    }
  }

  for (const entry of GLOSSARY) {
    if (!entry.definitionEn.trim()) throw new Error(`Glossary entry "${entry.term}": definitionEn is empty`);
    if (entry.termEn !== undefined && !entry.termEn.trim()) {
      throw new Error(`Glossary entry "${entry.term}": termEn is present but empty -- omit the field instead`);
    }
    if (entry.expansionEn !== undefined && !entry.expansionEn.trim()) {
      throw new Error(`Glossary entry "${entry.term}": expansionEn is present but empty -- omit the field instead`);
    }
  }
}

assertGlossaryIntegrity();

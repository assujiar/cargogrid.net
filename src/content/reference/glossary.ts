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

export interface GlossaryEntry {
  term: string;
  /** Expansion, where the term is an abbreviation. */
  expansion?: string;
  category: GlossaryCategory;
  definition: string;
  /** Other terms a reader will need next. Validated at module load. */
  seeAlso?: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  // ---- Ekspor, impor & kepabeanan -----------------------------------------
  {
    term: "PIB",
    expansion: "Pemberitahuan Impor Barang",
    category: "ekspor-impor",
    definition:
      "Dokumen pemberitahuan pabean yang diajukan importir untuk memasukkan barang ke daerah pabean. Pengajuan PIB inilah yang memicu penetapan jalur pemeriksaan, sehingga keterlambatan menyiapkannya langsung menjadi hari demurrage.",
    seeAlso: ["SPPB", "Jalur Hijau", "Jalur Merah"],
  },
  {
    term: "PEB",
    expansion: "Pemberitahuan Ekspor Barang",
    category: "ekspor-impor",
    definition:
      "Dokumen pemberitahuan pabean untuk mengeluarkan barang dari daerah pabean. Nomor pendaftaran PEB dibutuhkan sebelum kontainer bisa masuk ke terminal ekspor.",
    seeAlso: ["NPE", "Closing Time"],
  },
  {
    term: "NPE",
    expansion: "Nota Pelayanan Ekspor",
    category: "ekspor-impor",
    definition:
      "Persetujuan yang terbit setelah PEB diproses dan menjadi izin barang ekspor masuk kawasan pabean untuk dimuat. Tanpa NPE, kontainer akan ditolak di gerbang terminal.",
    seeAlso: ["PEB"],
  },
  {
    term: "SPPB",
    expansion: "Surat Persetujuan Pengeluaran Barang",
    category: "ekspor-impor",
    definition:
      "Persetujuan pengeluaran barang impor dari kawasan pabean. Ini tonggak yang paling menentukan dalam perlombaan melawan free time, karena sebelum SPPB terbit truk tidak boleh mengambil kontainer sama sekali.",
    seeAlso: ["PIB", "Demurrage"],
  },
  {
    term: "Jalur Hijau",
    category: "ekspor-impor",
    definition:
      "Penetapan jalur pemeriksaan pabean tanpa pemeriksaan fisik maupun dokumen mendalam, sehingga barang dapat segera dikeluarkan. Jalur ditetapkan berdasarkan profil risiko importir dan komoditasnya.",
    seeAlso: ["Jalur Merah", "Jalur Kuning"],
  },
  {
    term: "Jalur Kuning",
    category: "ekspor-impor",
    definition: "Penetapan jalur dengan pemeriksaan dokumen, tanpa pemeriksaan fisik barang.",
    seeAlso: ["Jalur Hijau", "Jalur Merah"],
  },
  {
    term: "Jalur Merah",
    category: "ekspor-impor",
    definition:
      "Penetapan jalur dengan pemeriksaan fisik barang. Menambah beberapa hari pada proses pengeluaran, dan biaya behandle serta demurrage yang menyertainya jarang masuk perhitungan awal.",
    seeAlso: ["Behandle", "Demurrage"],
  },
  {
    term: "Behandle",
    category: "ekspor-impor",
    definition:
      "Kegiatan membongkar isi kontainer di lokasi pemeriksaan agar petugas dapat memeriksa fisik barang, lalu memuatnya kembali. Biayanya ditanggung importir dan naik seiring jumlah kemasan.",
    seeAlso: ["Jalur Merah"],
  },
  {
    term: "HS Code",
    expansion: "Harmonized System Code",
    category: "ekspor-impor",
    definition:
      "Kode klasifikasi barang internasional yang menentukan tarif bea masuk dan persyaratan larangan/pembatasan. Kesalahan klasifikasi adalah salah satu penyebab sengketa kepabeanan yang paling mahal karena bisa ditagih surut.",
    seeAlso: ["LARTAS", "BTKI"],
  },
  {
    term: "BTKI",
    expansion: "Buku Tarif Kepabeanan Indonesia",
    category: "ekspor-impor",
    definition: "Daftar resmi klasifikasi barang dan tarifnya di Indonesia, menjadi rujukan penetapan HS Code.",
    seeAlso: ["HS Code"],
  },
  {
    term: "LARTAS",
    expansion: "Larangan dan Pembatasan",
    category: "ekspor-impor",
    definition:
      "Ketentuan yang melarang atau membatasi impor/ekspor komoditas tertentu tanpa izin instansi terkait. Barang LARTAS yang tiba tanpa izin lengkap akan tertahan sementara free time terus berjalan.",
    seeAlso: ["HS Code", "INSW"],
  },
  {
    term: "INSW",
    expansion: "Indonesia National Single Window",
    category: "ekspor-impor",
    definition: "Sistem elektronik nasional yang mengintegrasikan perizinan dan kepabeanan lintas kementerian dalam satu pintu.",
    seeAlso: ["CEISA", "LARTAS"],
  },
  {
    term: "CEISA",
    expansion: "Customs-Excise Information System and Automation",
    category: "ekspor-impor",
    definition: "Sistem informasi kepabeanan dan cukai yang memproses dokumen seperti PIB dan PEB secara elektronik.",
    seeAlso: ["PIB", "PEB", "INSW"],
  },
  {
    term: "PPJK",
    expansion: "Pengusaha Pengurusan Jasa Kepabeanan",
    category: "ekspor-impor",
    definition:
      "Badan usaha berizin yang mengurus pemenuhan kewajiban pabean untuk kepentingan pemilik barang. Banyak forwarder beroperasi sekaligus sebagai PPJK.",
    seeAlso: ["EMKL", "Freight Forwarder"],
  },
  {
    term: "NIB",
    expansion: "Nomor Induk Berusaha",
    category: "ekspor-impor",
    definition: "Identitas pelaku usaha yang sekaligus berlaku sebagai angka pengenal impor bagi perusahaan yang memenuhi syarat.",
    seeAlso: ["API-U", "API-P"],
  },
  {
    term: "API-U",
    expansion: "Angka Pengenal Importir Umum",
    category: "ekspor-impor",
    definition: "Identitas importir yang memasukkan barang untuk diperdagangkan kembali.",
    seeAlso: ["API-P", "NIB"],
  },
  {
    term: "API-P",
    expansion: "Angka Pengenal Importir Produsen",
    category: "ekspor-impor",
    definition:
      "Identitas importir yang memasukkan barang untuk keperluan produksinya sendiri. Barangnya pada dasarnya tidak untuk diperdagangkan langsung.",
    seeAlso: ["API-U", "NIB"],
  },
  {
    term: "COO / SKA",
    expansion: "Certificate of Origin / Surat Keterangan Asal",
    category: "ekspor-impor",
    definition:
      "Dokumen yang menyatakan negara asal barang dan menjadi dasar klaim tarif preferensi dalam perjanjian dagang. Formulir spesifiknya berbeda per perjanjian.",
    seeAlso: ["Form E", "Form D"],
  },
  {
    term: "Form D",
    category: "ekspor-impor",
    definition: "Surat keterangan asal untuk perdagangan intra-ASEAN dalam skema ATIGA.",
    seeAlso: ["COO / SKA", "Form E"],
  },
  {
    term: "Form E",
    category: "ekspor-impor",
    definition: "Surat keterangan asal untuk skema perdagangan bebas ASEAN dengan Tiongkok.",
    seeAlso: ["COO / SKA", "Form D"],
  },
  {
    term: "Karantina",
    category: "ekspor-impor",
    definition:
      "Pemeriksaan dan sertifikasi kesehatan untuk komoditas hewan, tumbuhan, dan produk turunannya. Prosesnya berjalan paralel dengan kepabeanan dan punya tenggatnya sendiri.",
    seeAlso: ["Phytosanitary Certificate"],
  },
  {
    term: "Phytosanitary Certificate",
    category: "ekspor-impor",
    definition: "Sertifikat kesehatan tumbuhan yang diterbitkan otoritas karantina, disyaratkan banyak negara tujuan untuk produk nabati.",
    seeAlso: ["Karantina"],
  },
  {
    term: "Fumigasi",
    category: "ekspor-impor",
    definition:
      "Perlakuan pembasmian organisme pengganggu pada kemasan kayu atau muatan. Butuh waktu tunggu tersendiri yang harus diperhitungkan sebelum closing time.",
    seeAlso: ["ISPM 15", "Closing Time"],
  },
  {
    term: "ISPM 15",
    category: "ekspor-impor",
    definition:
      "Standar internasional untuk perlakuan kemasan kayu dalam perdagangan. Palet kayu tanpa tanda ISPM 15 dapat ditolak di pelabuhan tujuan meski isinya tidak bermasalah.",
    seeAlso: ["Fumigasi"],
  },

  // ---- Pelayaran & kontainer ----------------------------------------------
  {
    term: "B/L",
    expansion: "Bill of Lading",
    category: "pelayaran",
    definition:
      "Dokumen pengangkutan laut yang sekaligus berfungsi sebagai bukti kontrak, tanda terima barang, dan dokumen kepemilikan yang bisa dialihkan. Sifat terakhir inilah yang membuat B/L asli harus dijaga sebagai surat berharga.",
    seeAlso: ["HBL", "MBL", "Telex Release", "Sea Waybill"],
  },
  {
    term: "MBL",
    expansion: "Master Bill of Lading",
    category: "pelayaran",
    definition: "Bill of lading yang diterbitkan pelayaran kepada forwarder atau NVOCC sebagai pemesan ruang.",
    seeAlso: ["HBL", "B/L"],
  },
  {
    term: "HBL",
    expansion: "House Bill of Lading",
    category: "pelayaran",
    definition: "Bill of lading yang diterbitkan forwarder kepada pemilik barang, berada di bawah payung satu MBL.",
    seeAlso: ["MBL", "B/L"],
  },
  {
    term: "Telex Release",
    category: "pelayaran",
    definition:
      "Pelepasan barang tanpa penyerahan B/L asli, setelah pengirim menyerahkan seluruh set asli di pelabuhan muat. Mempercepat pengeluaran barang dan menghilangkan risiko dokumen asli terlambat sampai.",
    seeAlso: ["B/L", "Sea Waybill"],
  },
  {
    term: "Sea Waybill",
    category: "pelayaran",
    definition:
      "Dokumen pengangkutan yang tidak dapat dialihkan. Barang diserahkan kepada consignee yang tercantum tanpa perlu menunjukkan dokumen asli, cocok untuk pengiriman antar afiliasi.",
    seeAlso: ["B/L", "Telex Release"],
  },
  {
    term: "AWB",
    expansion: "Air Waybill",
    category: "pelayaran",
    definition: "Dokumen pengangkutan udara. Berbeda dari B/L laut, AWB tidak pernah menjadi dokumen kepemilikan yang dapat dialihkan.",
    seeAlso: ["HAWB", "MAWB"],
  },
  {
    term: "MAWB",
    expansion: "Master Air Waybill",
    category: "pelayaran",
    definition: "Air waybill yang diterbitkan maskapai kepada agen kargo.",
    seeAlso: ["HAWB", "AWB"],
  },
  {
    term: "HAWB",
    expansion: "House Air Waybill",
    category: "pelayaran",
    definition: "Air waybill yang diterbitkan agen kargo kepada pengirim, berada di bawah satu MAWB.",
    seeAlso: ["MAWB", "AWB"],
  },
  {
    term: "SI",
    expansion: "Shipping Instruction",
    category: "pelayaran",
    definition:
      "Instruksi tertulis dari pengirim ke pelayaran atau forwarder berisi data yang akan dicetak di B/L. Kesalahan di SI akan mengalir ke seluruh dokumen berikutnya, dan koreksi setelah B/L terbit dikenakan biaya amendemen.",
    seeAlso: ["B/L", "Closing Time"],
  },
  {
    term: "DO",
    expansion: "Delivery Order",
    category: "pelayaran",
    definition:
      "Perintah penyerahan barang dari pelayaran atau agen kepada pemegang yang berhak. Jumlah hari free time biasanya tercantum di sini, sehingga DO adalah tempat pertama untuk menghitung tenggat demurrage.",
    seeAlso: ["Free Time", "Demurrage"],
  },
  {
    term: "VGM",
    expansion: "Verified Gross Mass",
    category: "pelayaran",
    definition:
      "Berat kotor kontainer terverifikasi yang wajib dilaporkan pengirim sebelum pemuatan, sesuai konvensi SOLAS. Kontainer tanpa VGM tidak boleh dimuat ke kapal.",
    seeAlso: ["Closing Time"],
  },
  {
    term: "Free Time",
    category: "pelayaran",
    definition:
      "Jumlah hari kontainer boleh berada di terminal atau dikuasai pemakai tanpa dikenai denda. Dihitung dalam hari kalender, sehingga akhir pekan dan libur nasional tetap memakannya.",
    seeAlso: ["Demurrage", "Detention", "DO"],
  },
  {
    term: "Demurrage",
    category: "pelayaran",
    definition:
      "Denda karena kontainer masih berada di dalam terminal melewati free time. Pemicunya paling sering ada di meja dokumen, bukan di armada truk.",
    seeAlso: ["Detention", "Free Time", "Storage"],
  },
  {
    term: "Detention",
    category: "pelayaran",
    definition:
      "Denda karena kontainer sudah keluar terminal tetapi belum dikembalikan ke depo melewati batas waktu. Pemicunya biasanya bongkar yang molor di gudang atau antrean depo.",
    seeAlso: ["Demurrage", "Free Time"],
  },
  {
    term: "Storage",
    category: "pelayaran",
    definition:
      "Biaya penumpukan yang ditagih terminal atas ruang yang dipakai kontainer. Berbeda dari demurrage yang ditagih pelayaran, sehingga satu kontainer terlambat bisa memicu dua tagihan dari dua pihak.",
    seeAlso: ["Demurrage"],
  },
  {
    term: "THC",
    expansion: "Terminal Handling Charge",
    category: "pelayaran",
    definition: "Biaya penanganan kontainer di terminal, ditagih di pelabuhan muat maupun bongkar. Siapa yang menanggungnya di tujuan sering menjadi sengketa jika tidak disebut eksplisit dalam kontrak.",
    seeAlso: ["Incoterms"],
  },
  {
    term: "LSS",
    expansion: "Low Sulphur Surcharge",
    category: "pelayaran",
    definition: "Biaya tambahan atas penggunaan bahan bakar rendah sulfur sesuai aturan emisi maritim.",
    seeAlso: ["BAF"],
  },
  {
    term: "BAF",
    expansion: "Bunker Adjustment Factor",
    category: "pelayaran",
    definition: "Penyesuaian tarif mengikuti pergerakan harga bahan bakar kapal.",
    seeAlso: ["LSS", "CAF"],
  },
  {
    term: "CAF",
    expansion: "Currency Adjustment Factor",
    category: "pelayaran",
    definition: "Penyesuaian tarif mengikuti pergerakan nilai tukar.",
    seeAlso: ["BAF"],
  },
  {
    term: "FCL",
    expansion: "Full Container Load",
    category: "pelayaran",
    definition: "Pengiriman yang memakai satu kontainer penuh untuk satu pengirim. Tarifnya per kontainer, bukan per CBM.",
    seeAlso: ["LCL", "CY"],
  },
  {
    term: "LCL",
    expansion: "Less than Container Load",
    category: "pelayaran",
    definition:
      "Pengiriman yang berbagi kontainer dengan muatan pengirim lain. Ditagih berdasarkan CBM atau berat, mana yang lebih besar, dan menambah waktu untuk konsolidasi serta dekonsolidasi.",
    seeAlso: ["FCL", "CFS", "CBM"],
  },
  {
    term: "CY",
    expansion: "Container Yard",
    category: "pelayaran",
    definition: "Area penumpukan kontainer di terminal. Istilah CY/CY menandakan serah terima berlangsung antar container yard.",
    seeAlso: ["CFS", "FCL"],
  },
  {
    term: "CFS",
    expansion: "Container Freight Station",
    category: "pelayaran",
    definition: "Gudang tempat muatan LCL dikonsolidasi dan dipecah kembali.",
    seeAlso: ["LCL", "CY"],
  },
  {
    term: "Stuffing",
    category: "pelayaran",
    definition: "Kegiatan memasukkan barang ke dalam kontainer.",
    seeAlso: ["Stripping"],
  },
  {
    term: "Stripping",
    category: "pelayaran",
    definition: "Kegiatan mengeluarkan barang dari kontainer. Disebut juga unstuffing atau devanning.",
    seeAlso: ["Stuffing"],
  },
  {
    term: "Closing Time",
    category: "pelayaran",
    definition:
      "Batas akhir kontainer atau dokumen diterima sebelum kapal berangkat. Terlewat satu jam berarti menunggu jadwal kapal berikutnya, yang di banyak rute berarti satu minggu penuh.",
    seeAlso: ["SI", "VGM", "ETD"],
  },
  {
    term: "Transhipment",
    category: "pelayaran",
    definition:
      "Pemindahan muatan antar kapal di pelabuhan perantara. Menambah titik risiko dan hari transit, serta menjadi penyebab umum ketertinggalan kontainer.",
    seeAlso: ["ETA"],
  },
  {
    term: "Depo",
    category: "pelayaran",
    definition: "Tempat penyimpanan, pembersihan, dan perbaikan kontainer kosong. Antrean depo saat pengembalian adalah pemicu detention yang paling sering diremehkan.",
    seeAlso: ["Detention"],
  },
  {
    term: "Reefer",
    category: "pelayaran",
    definition: "Kontainer berpendingin dengan unit refrigerasi terpasang. Membutuhkan pasokan listrik atau genset di sepanjang perjalanan darat.",
    seeAlso: ["Genset"],
  },
  {
    term: "Genset",
    category: "pelayaran",
    definition: "Generator portabel yang menyuplai listrik ke reefer selama diangkut truk. Biayanya kerap terlewat dari costing.",
    seeAlso: ["Reefer"],
  },
  {
    term: "ETA",
    expansion: "Estimated Time of Arrival",
    category: "pelayaran",
    definition: "Perkiraan waktu tiba. Angka rencana, bukan janji, dan selisihnya dengan ATA adalah data paling berguna untuk menilai keandalan operator.",
    seeAlso: ["ATA", "ETD"],
  },
  {
    term: "ETD",
    expansion: "Estimated Time of Departure",
    category: "pelayaran",
    definition: "Perkiraan waktu berangkat.",
    seeAlso: ["ATD", "ETA"],
  },
  {
    term: "ATA",
    expansion: "Actual Time of Arrival",
    category: "pelayaran",
    definition: "Waktu tiba sesungguhnya.",
    seeAlso: ["ETA"],
  },
  {
    term: "ATD",
    expansion: "Actual Time of Departure",
    category: "pelayaran",
    definition: "Waktu berangkat sesungguhnya.",
    seeAlso: ["ETD"],
  },
  {
    term: "Dwelling Time",
    category: "pelayaran",
    definition:
      "Lama barang impor berada di pelabuhan sejak dibongkar sampai keluar. Dipakai sebagai indikator nasional efisiensi pelabuhan, dan berbanding lurus dengan risiko demurrage.",
    seeAlso: ["Demurrage", "SPPB"],
  },
  {
    term: "NVOCC",
    expansion: "Non-Vessel Operating Common Carrier",
    category: "pelayaran",
    definition: "Pengangkut yang menerbitkan bill of lading sendiri tanpa mengoperasikan kapal, dengan membeli ruang dari pelayaran.",
    seeAlso: ["Freight Forwarder", "HBL"],
  },
  {
    term: "EMKL",
    expansion: "Ekspedisi Muatan Kapal Laut",
    category: "pelayaran",
    definition: "Perusahaan yang mengurus muatan kapal laut, termasuk dokumen dan pengangkutan dari dan ke pelabuhan.",
    seeAlso: ["PPJK", "Freight Forwarder"],
  },
  {
    term: "Manifest",
    category: "pelayaran",
    definition: "Daftar seluruh muatan di atas satu sarana angkut. Menjadi dasar pencocokan data oleh otoritas pelabuhan dan pabean.",
    seeAlso: ["B/L"],
  },
  {
    term: "Shipper",
    category: "pelayaran",
    definition: "Pihak pengirim barang yang tercantum pada dokumen pengangkutan.",
    seeAlso: ["Consignee", "Notify Party"],
  },
  {
    term: "Consignee",
    category: "pelayaran",
    definition: "Pihak penerima barang yang berhak menebusnya di tujuan.",
    seeAlso: ["Shipper", "Notify Party"],
  },
  {
    term: "Notify Party",
    category: "pelayaran",
    definition: "Pihak yang diberi tahu saat barang tiba. Sering berupa forwarder di tujuan, bukan penerima barangnya sendiri.",
    seeAlso: ["Consignee"],
  },

  // ---- Pergudangan & inventori --------------------------------------------
  {
    term: "WMS",
    expansion: "Warehouse Management System",
    category: "gudang",
    definition:
      "Sistem yang mengelola lokasi, pergerakan, dan status stok di dalam gudang sampai tingkat bin. Bedanya dengan modul inventori akuntansi: WMS tahu barang ada di rak mana, bukan hanya berapa jumlahnya.",
    seeAlso: ["Bin", "Putaway", "TMS"],
  },
  {
    term: "Bin",
    category: "gudang",
    definition: "Satuan lokasi terkecil di gudang, biasanya satu kotak rak. Akurasi tingkat bin adalah yang memungkinkan picking tanpa mencari.",
    seeAlso: ["WMS", "Slotting"],
  },
  {
    term: "Putaway",
    category: "gudang",
    definition: "Proses menempatkan barang yang baru diterima ke lokasi penyimpanannya.",
    seeAlso: ["Picking", "Bin"],
  },
  {
    term: "Picking",
    category: "gudang",
    definition: "Proses mengambil barang dari lokasi penyimpanan untuk memenuhi pesanan. Umumnya penyumbang biaya tenaga kerja terbesar di gudang.",
    seeAlso: ["Slotting", "Putaway"],
  },
  {
    term: "Slotting",
    category: "gudang",
    definition:
      "Penataan posisi SKU di gudang berdasarkan frekuensi pengambilan agar jarak jalan pemetik menjadi sependek mungkin.",
    seeAlso: ["Picking", "ABC Analysis"],
  },
  {
    term: "ABC Analysis",
    category: "gudang",
    definition: "Pengelompokan SKU berdasarkan kontribusinya terhadap pergerakan atau nilai, dipakai untuk menentukan prioritas slotting dan penghitungan stok.",
    seeAlso: ["Slotting", "Cycle Count"],
  },
  {
    term: "Cycle Count",
    category: "gudang",
    definition:
      "Penghitungan stok sebagian secara berkala tanpa menghentikan operasi. Umumnya menemukan selisih lebih cepat daripada stock opname tahunan.",
    seeAlso: ["Stock Opname", "ABC Analysis"],
  },
  {
    term: "Stock Opname",
    category: "gudang",
    definition: "Penghitungan fisik seluruh stok, biasanya dengan menghentikan operasional gudang.",
    seeAlso: ["Cycle Count"],
  },
  {
    term: "SKU",
    expansion: "Stock Keeping Unit",
    category: "gudang",
    definition: "Kode unik untuk satu jenis barang dengan varian tertentu, menjadi satuan dasar pencatatan stok.",
    seeAlso: ["Bin"],
  },
  {
    term: "FIFO",
    expansion: "First In First Out",
    category: "gudang",
    definition: "Aturan pengeluaran barang yang masuk lebih dulu keluar lebih dulu.",
    seeAlso: ["FEFO", "LIFO"],
  },
  {
    term: "FEFO",
    expansion: "First Expired First Out",
    category: "gudang",
    definition:
      "Aturan pengeluaran berdasarkan tanggal kedaluwarsa terdekat, bukan tanggal masuk. Wajib untuk pangan dan farmasi, dan tidak selalu sama hasilnya dengan FIFO.",
    seeAlso: ["FIFO"],
  },
  {
    term: "LIFO",
    expansion: "Last In First Out",
    category: "gudang",
    definition: "Aturan pengeluaran barang yang masuk terakhir keluar lebih dulu. Jarang dipakai untuk barang bertanggal kedaluwarsa.",
    seeAlso: ["FIFO"],
  },
  {
    term: "Cross Docking",
    category: "gudang",
    definition:
      "Memindahkan barang dari kendaraan masuk langsung ke kendaraan keluar tanpa disimpan. Menghemat biaya penyimpanan tetapi menuntut jadwal yang jauh lebih presisi.",
    seeAlso: ["Putaway"],
  },
  {
    term: "Safety Stock",
    category: "gudang",
    definition: "Persediaan penyangga untuk meredam ketidakpastian permintaan dan waktu tunggu pasokan.",
    seeAlso: ["Lead Time", "Reorder Point"],
  },
  {
    term: "Reorder Point",
    category: "gudang",
    definition: "Tingkat stok yang memicu pemesanan ulang, dihitung dari pemakaian selama lead time ditambah safety stock.",
    seeAlso: ["Safety Stock", "Lead Time"],
  },
  {
    term: "Lead Time",
    category: "gudang",
    definition: "Selang waktu antara pemesanan dan penerimaan barang.",
    seeAlso: ["Reorder Point"],
  },
  {
    term: "Reverse Logistics",
    category: "gudang",
    definition:
      "Rangkaian proses menangani barang yang mengalir balik dari pelanggan: retur, penukaran, penarikan, dan pemulihan nilai barangnya.",
    seeAlso: ["Value Recovery"],
  },
  {
    term: "Value Recovery",
    category: "gudang",
    definition: "Porsi nilai barang retur yang berhasil diselamatkan lewat penjualan ulang, perbaikan, atau daur ulang.",
    seeAlso: ["Reverse Logistics"],
  },
  {
    term: "3PL",
    expansion: "Third Party Logistics",
    category: "gudang",
    definition: "Penyedia jasa logistik yang menjalankan pergudangan dan distribusi atas nama pemilik barang.",
    seeAlso: ["4PL", "WMS"],
  },
  {
    term: "4PL",
    expansion: "Fourth Party Logistics",
    category: "gudang",
    definition: "Pihak yang merancang dan mengelola seluruh rantai pasok pelanggan, termasuk mengoordinasi beberapa 3PL sekaligus.",
    seeAlso: ["3PL"],
  },

  // ---- Angkutan darat & armada --------------------------------------------
  {
    term: "ODOL",
    expansion: "Over Dimension Over Loading",
    category: "darat",
    definition:
      "Kendaraan yang dimensinya melebihi ketentuan atau bermuatan melebihi batas yang diizinkan. Menjadi sasaran penindakan di jembatan timbang dan menaikkan biaya perawatan maupun risiko kecelakaan.",
    seeAlso: ["JBI", "JBB", "Jembatan Timbang"],
  },
  {
    term: "JBB",
    expansion: "Jumlah Berat yang Diperbolehkan",
    category: "darat",
    definition: "Batas berat total kendaraan beserta muatannya menurut rancangan pabrikan, tercantum pada dokumen kendaraan.",
    seeAlso: ["JBI", "ODOL"],
  },
  {
    term: "JBI",
    expansion: "Jumlah Berat yang Diizinkan",
    category: "darat",
    definition:
      "Batas berat total yang diizinkan untuk kendaraan pada kelas jalan tertentu. Bisa lebih rendah daripada JBB, karena yang membatasi adalah jalannya, bukan truknya.",
    seeAlso: ["JBB", "ODOL"],
  },
  {
    term: "Jembatan Timbang",
    category: "darat",
    definition: "Fasilitas penimbangan kendaraan angkutan barang di ruas jalan tertentu, tempat pelanggaran muatan ditindak.",
    seeAlso: ["ODOL", "JBI"],
  },
  {
    term: "KIR",
    category: "darat",
    definition: "Pengujian berkala kelaikan jalan kendaraan angkutan. Masa berlakunya terbatas dan perlu dijadwalkan seperti perawatan lainnya.",
    seeAlso: ["Preventive Maintenance"],
  },
  {
    term: "Preventive Maintenance",
    category: "darat",
    definition:
      "Perawatan terjadwal berdasarkan jarak tempuh atau waktu, dilakukan sebelum kerusakan terjadi. Lawan dari perbaikan reaktif yang biayanya jauh lebih tinggi karena mencakup kendaraan yang tidak beroperasi.",
    seeAlso: ["Downtime", "KIR"],
  },
  {
    term: "Downtime",
    category: "darat",
    definition: "Waktu kendaraan tidak dapat beroperasi karena rusak atau diperbaiki. Biaya sesungguhnya mencakup pendapatan yang hilang, bukan hanya ongkos bengkel.",
    seeAlso: ["Preventive Maintenance"],
  },
  {
    term: "Uang Jalan",
    category: "darat",
    definition:
      "Dana yang diberikan di muka kepada sopir untuk bahan bakar, tol, retribusi, dan makan selama perjalanan. Pertanggungjawabannya adalah salah satu titik rekonsiliasi kas tersulit di perusahaan trucking.",
    seeAlso: ["POD"],
  },
  {
    term: "Surat Jalan",
    category: "darat",
    definition:
      "Dokumen yang menyertai barang selama pengiriman, memuat rincian muatan, asal, dan tujuan. Lembar yang ditandatangani penerima menjadi bukti serah terima.",
    seeAlso: ["POD", "BAST"],
  },
  {
    term: "POD",
    expansion: "Proof of Delivery",
    category: "darat",
    definition:
      "Bukti bahwa barang telah diterima. Dalam bentuk kertas, POD adalah dokumen yang paling sering menghambat penagihan karena harus kembali secara fisik ke kantor sebelum invoice bisa dibuat.",
    seeAlso: ["ePOD", "Surat Jalan", "DSO"],
  },
  {
    term: "ePOD",
    expansion: "Electronic Proof of Delivery",
    category: "darat",
    definition:
      "Bukti terima digital berupa tanda tangan, foto, dan koordinat lokasi yang terkirim seketika. Memutus jeda antara barang diterima dan invoice bisa diterbitkan.",
    seeAlso: ["POD", "DSO"],
  },
  {
    term: "BAST",
    expansion: "Berita Acara Serah Terima",
    category: "darat",
    definition: "Dokumen formal serah terima barang atau pekerjaan, umum disyaratkan pada kontrak korporat dan proyek.",
    seeAlso: ["Surat Jalan", "POD"],
  },
  {
    term: "Last Mile",
    category: "darat",
    definition: "Tahap akhir pengiriman sampai ke penerima. Segmen dengan biaya per kilogram tertinggi di sepanjang rantai.",
    seeAlso: ["First Mile"],
  },
  {
    term: "First Mile",
    category: "darat",
    definition: "Tahap awal pengiriman dari pemilik barang ke titik konsolidasi pertama.",
    seeAlso: ["Last Mile"],
  },
  {
    term: "Backhaul",
    category: "darat",
    definition:
      "Muatan untuk perjalanan pulang setelah pengantaran. Mengisi rit balik adalah cara paling langsung menurunkan biaya per lane karena solar dan sopir tetap dibayar apa pun isinya.",
    seeAlso: ["Utilisasi Armada"],
  },
  {
    term: "Utilisasi Armada",
    category: "darat",
    definition: "Proporsi kapasitas armada yang benar-benar menghasilkan pendapatan, diukur dari waktu, jarak, atau muatan.",
    seeAlso: ["Backhaul", "Downtime"],
  },
  {
    term: "Karoseri",
    category: "darat",
    definition:
      "Pembuat bodi kendaraan yang memasang bak, box, atau peralatan di atas sasis. Karoseri inilah yang menentukan dimensi ruang muat dan berat kosong akhir kendaraan, sehingga dua truk dengan sasis identik bisa berbeda kapasitasnya.",
    seeAlso: ["JBI", "Wingbox"],
  },
  {
    term: "CDE",
    expansion: "Colt Diesel Engkel",
    category: "darat",
    definition:
      "Sebutan pasar untuk truk ringan bergandar dua dengan roda belakang tunggal. Bukan kelas hukum, dan tidak punya angka kapasitas baku.",
    seeAlso: ["CDD", "Karoseri", "JBI"],
  },
  {
    term: "CDD",
    expansion: "Colt Diesel Double",
    category: "darat",
    definition:
      "Sebutan pasar untuk truk ringan bergandar dua dengan roda belakang ganda. Berroda enam tetapi tetap dua gandar, perbedaan yang penting karena golongan tol menghitung gandar, bukan roda.",
    seeAlso: ["CDE", "Golongan Tol"],
  },
  {
    term: "Tronton",
    category: "darat",
    definition:
      "Sebutan pasar untuk truk rigid bergandar tiga. Kapasitasnya berbeda antara konfigurasi 6x2 dan 6x4 serta menurut bodinya, sehingga sebutan ini tidak menentukan payload.",
    seeAlso: ["Trintin", "Golongan Tol"],
  },
  {
    term: "Trintin",
    category: "darat",
    definition: "Sebutan pasar untuk truk rigid bergandar empat. Bukan istilah dalam peraturan.",
    seeAlso: ["Tronton"],
  },
  {
    term: "Wingbox",
    category: "darat",
    definition:
      "Bodi box yang dinding sampingnya membuka ke atas, sehingga forklift bisa memuat dari sisi. Menghemat waktu muat pada barang berpalet; volumenya bergantung pada mekanisme sayap yang memakan ruang.",
    seeAlso: ["Curtainsider", "Karoseri"],
  },
  {
    term: "Curtainsider",
    category: "darat",
    definition:
      "Bodi bersisi tirai. Lebih ringan daripada wingbox berdinding keras sehingga menyisakan lebih banyak jatah berat untuk muatan, tetapi keamanan muatannya berbeda.",
    seeAlso: ["Wingbox"],
  },
  {
    term: "Tractor Head",
    category: "darat",
    definition:
      "Unit penarik yang membawa semi-trailer. Biaya dan penggolongannya harus dihitung sebagai satu rangkaian utuh dengan trailernya, bukan sebagai kendaraan terpisah.",
    seeAlso: ["Skeletal", "Lowbed", "Golongan Tol"],
  },
  {
    term: "Skeletal",
    category: "darat",
    definition:
      "Chassis trailer dengan twist lock untuk membawa kontainer. Payload kontainer bukan payload jalan, yang berlaku adalah yang terendah di antara rating kontainer, rating chassis, dan JBKI yang diizinkan.",
    seeAlso: ["Tractor Head", "JBI"],
  },
  {
    term: "Lowbed",
    category: "darat",
    definition:
      "Semi-trailer berdek rendah untuk alat berat. Dek yang rendah menurunkan tinggi total muatan, tetapi tidak dengan sendirinya membuat muatan berdimensi lebih menjadi sah.",
    seeAlso: ["Tractor Head", "OOG"],
  },
  {
    term: "Dolly",
    category: "darat",
    definition: "Modul sumbu tanpa penggerak yang menyambung atau menopang muatan panjang dan berat. Perlu kajian teknik dan penilaian rute.",
    seeAlso: ["Lowbed", "SPMT"],
  },
  {
    term: "SPMT",
    expansion: "Self-Propelled Modular Transporter",
    category: "darat",
    definition:
      "Platform bersumbu banyak yang bergerak sendiri untuk muatan sangat berat. Biayanya biasanya dimodelkan per jam atau per shift proyek, bukan per kilometer seperti armada jalan raya.",
    seeAlso: ["Dolly", "Lowbed"],
  },
  {
    term: "OOG",
    expansion: "Out of Gauge",
    category: "darat",
    definition:
      "Muatan yang melebihi selubung peralatan standar. Berbeda dari kendaraan yang dimodifikasi melampaui ketentuan: muatan OOG tetap bisa diangkut secara sah dengan peralatan yang sesuai, kajian rute, dan izin.",
    seeAlso: ["ODOL", "Lowbed"],
  },
  {
    term: "MST",
    expansion: "Muatan Sumbu Terberat",
    category: "darat",
    definition:
      "Batas berat yang boleh ditanggung satu sumbu pada kelas jalan tertentu. Membatasi per sumbu, bukan berat total, sehingga muatan yang menumpuk di belakang bisa melanggar meski berat totalnya masih aman.",
    seeAlso: ["Kelas Jalan", "JBI", "ODOL"],
  },
  {
    term: "Kelas Jalan",
    category: "darat",
    definition:
      "Penggolongan ruas jalan yang menetapkan batas lebar, panjang, tinggi, dan muatan sumbu terberat. Inilah sebabnya truk yang sama bisa sah di satu rute dan melanggar di rute lain.",
    seeAlso: ["MST", "JBI"],
  },
  {
    term: "Golongan Tol",
    category: "darat",
    definition:
      "Penggolongan kendaraan di jalan tol menurut jenis dan jumlah gandar, dari Golongan I sampai V. Menentukan kelompok tarif, bukan besaran tarifnya, tarif berbeda per ruas dan per tanggal berlaku.",
    seeAlso: ["Golongan Penyeberangan", "CDD"],
  },
  {
    term: "Golongan Penyeberangan",
    category: "darat",
    definition:
      "Penggolongan kendaraan di kapal penyeberangan menurut fungsi dan panjang keseluruhan, dari Golongan I sampai IX. Dasarnya berbeda dari golongan tol, sehingga keduanya tidak bisa saling menggantikan dalam perhitungan biaya rute.",
    seeAlso: ["Golongan Tol"],
  },
  {
    term: "Cost per KM",
    category: "darat",
    definition:
      "Biaya menjalankan satu unit per kilometer, mencakup biaya tetap dan biaya jalan. Angka per kilometer bermuatan selalu lebih tinggi daripada per kilometer total, karena rit kosong tidak menghasilkan pendapatan tetapi tetap memakan biaya.",
    seeAlso: ["Backhaul", "Cost per Lane", "Utilisasi Armada"],
  },
  {
    term: "Loading Meter",
    category: "darat",
    definition:
      "Satuan kapasitas untuk bodi datar: panjang lantai muat yang terpakai selebar bak. Dipakai menggantikan meter kubik pada flatbed, karena muatan proyek tidak bertumpuk ke atas seperti kardus.",
    seeAlso: ["Karoseri"],
  },

  // ---- Komersial, tarif & dokumen komersial -------------------------------
  {
    term: "RFQ",
    expansion: "Request for Quotation",
    category: "komersial",
    definition:
      "Permintaan penawaran harga dari calon pelanggan. Kecepatan menjawabnya adalah salah satu penentu tingkat kemenangan yang paling langsung terlihat.",
    seeAlso: ["Quotation", "Rate Card"],
  },
  {
    term: "Quotation",
    category: "komersial",
    definition: "Penawaran harga resmi berikut cakupan layanan, masa berlaku, dan syaratnya.",
    seeAlso: ["RFQ", "Rate Card"],
  },
  {
    term: "Rate Card",
    category: "komersial",
    definition:
      "Daftar tarif per lane, per layanan, atau per jenis muatan. Tarif beli dan tarif jual yang tersebar di banyak berkas Excel adalah sumber kebocoran margin yang paling umum.",
    seeAlso: ["Buying Rate", "Selling Rate"],
  },
  {
    term: "Buying Rate",
    category: "komersial",
    definition: "Tarif yang dibayarkan kepada vendor atau subkontraktor.",
    seeAlso: ["Selling Rate", "Margin per Job"],
  },
  {
    term: "Selling Rate",
    category: "komersial",
    definition: "Tarif yang ditagihkan kepada pelanggan.",
    seeAlso: ["Buying Rate", "Margin per Job"],
  },
  {
    term: "Margin per Job",
    category: "komersial",
    definition:
      "Selisih tarif jual dan seluruh biaya yang melekat pada satu pengiriman. Hanya bermakna bila semua biaya susulan sudah masuk, termasuk yang invoicenya baru datang berminggu-minggu kemudian.",
    seeAlso: ["Buying Rate", "Selling Rate"],
  },
  {
    term: "Commercial Invoice",
    category: "komersial",
    definition: "Faktur perdagangan antara penjual dan pembeli, menjadi dasar penetapan nilai pabean.",
    seeAlso: ["Packing List", "PIB"],
  },
  {
    term: "Packing List",
    category: "komersial",
    definition:
      "Rincian isi tiap kemasan berikut dimensi dan beratnya. Dokumen inilah yang dipakai memverifikasi muatan saat pemeriksaan fisik.",
    seeAlso: ["Commercial Invoice", "CBM"],
  },
  {
    term: "CBM",
    expansion: "Cubic Meter",
    category: "komersial",
    definition:
      "Satuan volume muatan, dihitung dari panjang kali lebar kali tinggi dalam meter. Menjadi dasar penagihan LCL dan penentu apakah muatan ditagih berdasarkan berat atau volume.",
    seeAlso: ["Chargeable Weight", "LCL"],
  },
  {
    term: "Chargeable Weight",
    category: "komersial",
    definition:
      "Berat yang dipakai menagih, yaitu yang lebih besar antara berat sesungguhnya dan berat volumetrik. Barang ringan bervolume besar hampir selalu ditagih berdasarkan volumenya.",
    seeAlso: ["CBM", "Volumetric Weight"],
  },
  {
    term: "Volumetric Weight",
    category: "komersial",
    definition:
      "Berat setara volume: hasil kali panjang, lebar, dan tinggi dalam sentimeter, dibagi divisor moda yang berlaku. Kargo udara umumnya memakai divisor 6.000 dan kurir internasional 5.000. Dinyatakan dalam meter kubik, keduanya sama dengan mengalikan CBM dengan 166,67 dan 200 kg.",
    seeAlso: ["Chargeable Weight", "CBM"],
  },
  {
    term: "Incoterms",
    category: "komersial",
    definition:
      "Sebelas aturan ICC yang membagi biaya, risiko, dan kewajiban antara penjual dan pembeli. Titik pindah biaya dan titik pindah risiko bisa berada di tempat yang berbeda, dan di situlah sengketa biasanya bermula.",
    seeAlso: ["FOB", "CIF"],
  },
  {
    term: "FOB",
    category: "komersial",
    definition: "Aturan Incoterms untuk moda laut. Risiko pindah ke pembeli saat barang berada di atas kapal di pelabuhan muat.",
    seeAlso: ["Incoterms", "CIF"],
  },
  {
    term: "CIF",
    category: "komersial",
    definition:
      "Aturan Incoterms moda laut. Penjual membayar ongkos angkut dan asuransi sampai pelabuhan tujuan, tetapi risiko sudah pindah ke pembeli sejak pelabuhan muat.",
    seeAlso: ["Incoterms", "FOB"],
  },
  {
    term: "Freight Forwarder",
    category: "komersial",
    definition: "Penyedia jasa yang mengatur pengangkutan barang atas nama pemilik barang, umumnya tanpa memiliki sarana angkut sendiri.",
    seeAlso: ["NVOCC", "PPJK", "3PL"],
  },
  {
    term: "SLA",
    expansion: "Service Level Agreement",
    category: "komersial",
    definition:
      "Kesepakatan tingkat layanan berikut ukuran dan konsekuensinya. SLA tanpa data pengukuran yang disepakati bersama pada praktiknya tidak bisa ditegakkan.",
    seeAlso: ["OTD", "OTIF"],
  },

  // ---- Sistem, data & indikator kinerja -----------------------------------
  {
    term: "TMS",
    expansion: "Transportation Management System",
    category: "sistem",
    definition:
      "Sistem yang mengelola perencanaan, penugasan, pelacakan, dan penagihan pengiriman. Bersama WMS menjadi dua tulang punggung operasional penyedia jasa logistik.",
    seeAlso: ["WMS", "ERP"],
  },
  {
    term: "ERP",
    expansion: "Enterprise Resource Planning",
    category: "sistem",
    definition:
      "Sistem terpadu yang menyatukan proses lintas fungsi dalam satu basis data. Dalam konteks logistik, nilainya muncul saat operasional dan keuangan berbagi satu angka yang sama, bukan dua versi yang direkonsiliasi tiap bulan.",
    seeAlso: ["TMS", "WMS"],
  },
  {
    term: "OTD",
    expansion: "On Time Delivery",
    category: "sistem",
    definition: "Persentase pengiriman yang tiba sesuai jadwal yang dijanjikan.",
    seeAlso: ["OTIF", "SLA"],
  },
  {
    term: "OTIF",
    expansion: "On Time In Full",
    category: "sistem",
    definition:
      "Persentase pesanan yang tiba tepat waktu sekaligus lengkap jumlahnya. Ukuran yang lebih jujur daripada OTD, karena pengiriman tepat waktu yang kurang barang tetap dihitung gagal.",
    seeAlso: ["OTD", "Fill Rate"],
  },
  {
    term: "Fill Rate",
    category: "sistem",
    definition: "Persentase permintaan yang dapat dipenuhi dari stok yang ada tanpa kekurangan.",
    seeAlso: ["OTIF", "Safety Stock"],
  },
  {
    term: "DSO",
    expansion: "Days Sales Outstanding",
    category: "sistem",
    definition:
      "Rata-rata jumlah hari sejak jasa diberikan sampai uangnya diterima. Di perusahaan logistik, DSO sering lebih ditentukan oleh kecepatan POD kembali daripada oleh perilaku bayar pelanggan.",
    seeAlso: ["POD", "ePOD"],
  },
  {
    term: "Cost per Lane",
    category: "sistem",
    definition: "Biaya sesungguhnya untuk melayani satu rute, mencakup rit balik kosong, tunggu muat, dan denda.",
    seeAlso: ["Backhaul", "Margin per Job"],
  },
  {
    term: "Track and Trace",
    category: "sistem",
    definition:
      "Kemampuan menampilkan posisi dan status kiriman sepanjang perjalanan. Nilainya bukan pada peta, melainkan pada berkurangnya panggilan telepon menanyakan posisi barang.",
    seeAlso: ["Customer Portal", "Milestone"],
  },
  {
    term: "Milestone",
    category: "sistem",
    definition: "Titik status yang dicatat sepanjang perjalanan kiriman, misalnya muat, berangkat, tiba, bongkar, dan serah terima.",
    seeAlso: ["Track and Trace"],
  },
  {
    term: "Customer Portal",
    category: "sistem",
    definition:
      "Kanal mandiri tempat pelanggan memeriksa status, dokumen, dan tagihannya sendiri. Memindahkan beban pertanyaan rutin dari tim operasional ke sistem.",
    seeAlso: ["Track and Trace"],
  },
  {
    term: "API",
    expansion: "Application Programming Interface",
    category: "sistem",
    definition:
      "Antarmuka yang memungkinkan dua sistem bertukar data secara otomatis, misalnya agar status kiriman langsung masuk ke sistem pelanggan tanpa entri ulang.",
    seeAlso: ["EDI"],
  },
  {
    term: "EDI",
    expansion: "Electronic Data Interchange",
    category: "sistem",
    definition: "Pertukaran dokumen bisnis antar sistem dalam format baku. Masih menjadi tulang punggung integrasi dengan pelayaran dan pelanggan korporat besar.",
    seeAlso: ["API"],
  },
  {
    term: "RBAC",
    expansion: "Role-Based Access Control",
    category: "sistem",
    definition:
      "Pengaturan hak akses berdasarkan peran, bukan per orang. Membuat pencabutan akses saat karyawan keluar menjadi satu tindakan, bukan penelusuran ke banyak sistem.",
    seeAlso: ["Audit Trail"],
  },
  {
    term: "Audit Trail",
    category: "sistem",
    definition: "Catatan tak terhapus tentang siapa mengubah apa dan kapan. Menjadi dasar penyelesaian sengketa data dan syarat sebagian besar audit.",
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
}

assertGlossaryIntegrity();

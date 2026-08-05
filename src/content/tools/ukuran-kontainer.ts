import type { Tool } from "./types";

export const tool: Tool = {
  slug: "ukuran-kontainer",
  kind: "referensi",
  title: "Ukuran dan Kapasitas Kontainer: 20 ft, 40 ft, High Cube, Reefer",
  metaTitle: "Ukuran Kontainer 20 & 40 Feet — Dimensi, Kubikasi, Payload | CargoGrid",
  description:
    "Tabel dimensi dalam, bukaan pintu, kubikasi, tare, dan payload untuk kontainer 20 ft, 40 ft, 40 HC, 45 HC, reefer, open top, dan flat rack — berikut catatan kapan masing-masing dipakai.",
  keywords: [
    "ukuran kontainer 20 feet",
    "ukuran kontainer 40 feet",
    "kapasitas kontainer CBM",
    "dimensi container high cube",
    "payload kontainer 20 ft",
    "ukuran container reefer",
  ],
  summary:
    "Dimensi dalam, kubikasi, dan batas berat untuk delapan tipe kontainer yang beredar di rute Indonesia — beserta satu hal yang tidak bisa diberikan tabel mana pun, dan di mana angka sesungguhnya harus dicari.",
  searchIntents: [
    "Ukuran dalam kontainer 20 feet dan 40 feet",
    "Berapa CBM muat dalam satu kontainer",
    "Payload maksimum kontainer 20 ft",
    "Beda 40 ft standar dan 40 ft high cube",
    "Dimensi kontainer reefer dibanding dry container",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "angka-yang-mengikat",
      text: "Satu peringatan sebelum angka mana pun dipakai",
    },
    {
      type: "p",
      text: "Berat kosong kontainer berbeda beberapa ratus kilogram antar unit, bahkan untuk kotak dengan ukuran nominal yang sama. Artinya payload maksimum bukanlah sifat dari \"kontainer 20 kaki\" sama sekali — melainkan sifat dari unit tertentu, dan angkanya tercetak pada pelat CSC yang terpasang di daun pintu kanan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Pelat CSC adalah satu-satunya angka yang mengikat",
      body: "Orang merencanakan muatan 28 ton dari tabel seperti ini, lalu mengetahui selisihnya di jembatan timbang. Pakai tabel ini untuk menjawab \"muat atau tidak\" dan \"kelas kotak mana yang saya butuhkan\". Untuk angka berat yang akan dipertanggungjawabkan, baca pelat pada unit yang benar-benar dialokasikan ke Anda.",
    },
    {
      type: "h2",
      id: "kubikasi-nyata",
      text: "Kubikasi nominal dan kubikasi yang benar-benar terpakai",
    },
    {
      type: "p",
      text: "Tidak ada yang pernah mencapai kapasitas nominal. Kardus tidak menyusun diri secara sempurna, palet menyisakan celah antar tapak, dan dunnage mengambil bagiannya sendiri. Menawarkan 33 CBM kepada pelanggan lalu hanya memuat 27 adalah cara rutin kehilangan uang pada konsolidasi LCL.",
    },
    {
      type: "p",
      text: "Karena itu tabel di atas menampilkan angka realistis pada tingkat pemanfaatan 85 persen di samping angka nominalnya. Untuk barang berpalet dengan ukuran seragam, pemanfaatan bisa lebih tinggi. Untuk campuran kardus berbagai ukuran, sering lebih rendah.",
    },
    {
      type: "h2",
      id: "dua-puluh-vs-empat-puluh",
      text: "Kenapa dua unit 20 kaki kerap lebih baik daripada satu 40 kaki",
    },
    {
      type: "p",
      text: "Kontainer 40 kaki punya ruang dua kali lipat 20 kaki, tetapi batas beratnya praktis sama saja — sekitar 28,8 ton berbanding 28,2 ton. Ruang berlipat dua, kapasitas berat tidak. Untuk barang padat seperti keramik, bahan kimia dalam drum, atau suku cadang logam, dua unit 20 kaki mengangkut kira-kira dua kali lipat tonase satu unit 40 kaki, meski totalnya kelihatan lebih mahal di rate sheet.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Cara cepat memutuskan",
      body: "Bagi berat total muatan dengan volume totalnya. Di bawah sekitar 430 kg per meter kubik, ruang akan habis lebih dulu dan 40 kaki atau high cube yang tepat. Di atas itu, berat yang habis lebih dulu, dan yang Anda butuhkan adalah jumlah kontainer 20 kaki — bukan kotak yang lebih besar.",
    },
    {
      type: "p",
      text: "Kesalahan yang sebaliknya juga umum: memesan 40 kaki standar untuk barang ringan bervolume, padahal high cube memberi tambahan sekitar sembilan meter kubik tanpa tambahan berat sedikit pun. Yang perlu diperiksa pada high cube hanyalah tinggi totalnya, yang mencapai 2,90 meter — periksa jembatan, portal, dan pintu gudang tujuan sebelum membooking.",
    },
    {
      type: "h2",
      id: "reefer",
      text: "Reefer: jangan memakai angka dry container",
    },
    {
      type: "p",
      text: "Ruang dalam reefer jauh lebih kecil daripada kontainer kering dengan panjang yang sama, karena unit pendingin dan lapisan insulasi memakan tempat. Reefer 20 kaki hanya sekitar 28 CBM dibanding 33 CBM milik dry container. Menghitung kubikasi ekspor hasil laut memakai angka dry adalah kesalahan yang baru ketahuan saat stuffing.",
    },
    {
      type: "p",
      text: "Satu biaya lagi yang rutin terlupa dari costing: reefer membutuhkan pasokan listrik atau genset selama seluruh perjalanan darat, dan sewa genset beserta pemantauan suhunya langsung menggerus margin bila tidak dimasukkan sejak penawaran.",
    },
  ],
  faq: [
    {
      q: "Berapa ukuran dalam kontainer 20 feet?",
      a: "Sekitar 5,90 x 2,35 x 2,39 meter, dengan kapasitas nominal sekitar 33 meter kubik. Bukaan pintunya lebih sempit dari lebar dalamnya, sekitar 2,34 x 2,28 meter, dan bukaan itulah yang sering menjadi kendala sebenarnya untuk barang besar.",
    },
    {
      q: "Berapa CBM yang muat dalam kontainer 40 ft?",
      a: "Kapasitas nominalnya sekitar 67 meter kubik untuk tipe standar dan sekitar 76 meter kubik untuk high cube. Secara praktis, rencanakan sekitar 85 persen dari angka itu — kira-kira 57 dan 65 meter kubik — karena penyusunan kardus tidak pernah sempurna.",
    },
    {
      q: "Berapa payload maksimum kontainer 20 ft?",
      a: "Sekitar 28,2 ton, dari berat kotor maksimum 30.480 kg dikurangi berat kosong sekitar 2,28 ton. Angka pastinya berbeda per unit dan tercetak pada pelat CSC di daun pintu. Perlu diingat juga bahwa payload kontainer bukan izin muat di jalan — yang berlaku adalah yang terendah di antara rating kontainer, rating chassis, dan JBKI yang diizinkan.",
    },
    {
      q: "Apa beda 40 ft standar dan 40 ft high cube?",
      a: "High cube lebih tinggi sekitar 30 sentimeter, memberi tambahan sekitar sembilan meter kubik dengan batas berat yang praktis sama. Tinggi totalnya menjadi 2,90 meter, sehingga perlu dipastikan rute darat dan pintu gudang tujuan memungkinkan.",
    },
    {
      q: "Kenapa kontainer reefer lebih kecil dari kontainer biasa?",
      a: "Karena unit refrigerasi dan insulasi dinding memakan ruang dalam. Reefer 20 kaki hanya sekitar 28 meter kubik dibanding 33 meter kubik pada dry container dengan panjang luar yang sama.",
    },
  ],
  sources: [
    { label: "Spesifikasi equipment operator pelayaran", detail: "Dimensi dalam, kubikasi, berat kosong, dan payload untuk kontainer 20 dan 40 kaki, high cube, reefer, open top, serta flat rack." },
    { label: "Konvensi CSC", detail: "Pelat pada daun pintu kontainer yang memuat berat kotor maksimum unit tersebut — satu-satunya angka berat yang mengikat." },
  ],
  relatedArticles: ["demurrage-detention-pelabuhan", "margin-per-job-forwarder", "dokumen-kepabeanan-arsip-digital"],
  relatedTools: ["kalkulator-cbm", "kalkulator-demurrage", "kamus-logistik"],
};

import type { Tool } from "./types";

export const tool: Tool = {
  slug: "jenis-truk-indonesia",
  kind: "referensi",
  title: "Jenis Truk di Indonesia dan Kapasitasnya: 61 Kelas Armada dari Pickup sampai Trailer",
  metaTitle: "Jenis Truk & Kapasitas Muatan Indonesia — CDE, CDD, Fuso, Tronton | CargoGrid",
  description:
    "Tabel ukuran bak, kubikasi, kapasitas berat, golongan tol, dan golongan penyeberangan untuk 61 kelas armada di Indonesia — dari pickup dan CDD sampai wingbox, trailer, lowbed, dan angkutan alat berat.",
  keywords: [
    "jenis truk di indonesia",
    "kapasitas truk CDD",
    "ukuran bak truk CDE",
    "perbedaan CDD dan fuso",
    "kapasitas tronton",
    "ukuran truk wingbox",
  ],
  summary:
    "Enam puluh satu kelas armada yang beroperasi di Indonesia — dari pickup, CDE, CDD, fuso, dan tronton sampai rangkaian trailer, lowbed, dan angkutan alat berat — lengkap dengan ukuran ruang muat, perkiraan kapasitas, serta golongan tol dan penyeberangannya.",
  searchIntents: [
    "Jenis truk di Indonesia dan kapasitas angkutnya",
    "Ukuran bak dalam truk CDE, CDD, dan Fuso",
    "Perbedaan CDD dan CDD long",
    "Truk apa yang cocok untuk muatan sekian ton",
    "Kapasitas kubikasi tronton dan wingbox",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "kenapa-rentang",
      text: "Kenapa angkanya rentang, bukan spesifikasi",
    },
    {
      type: "p",
      text: "Dimensi bak berasal dari karoseri, bukan dari pabrik sasis. Dua truk dengan lambang identik bisa berbeda tinggi bak dua puluh sentimeter, dan dua puluh sentimeter adalah satu tumpukan kardus utuh. Kapasitas beratnya pun bergantung pada berat kosong kendaraan itu sendiri, yang berbeda antar bodi.",
    },
    {
      type: "p",
      text: "Tabel ini karena itu berguna untuk memilih kelas armada, bukan untuk merencanakan muatan sampai ke kardus terakhir. Untuk armada tetap, mengukur sendiri bak setiap unit adalah pekerjaan setengah hari yang manfaatnya bertahan bertahun-tahun.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Sebutan pasar bukan kelas kapasitas",
      body: "CDE, CDD, fuso, tronton, trintin, dan wingbox adalah nama dagang yang tumbuh di lapangan, bukan kategori dalam peraturan. Tidak ada satu pun angka payload yang melekat padanya. Dua truk yang sama-sama disebut CDD bisa berbeda payload legalnya lebih dari satu ton karena berbeda karoseri dan berbeda penetapan JBI. Setiap angka di halaman ini adalah perkiraan perencanaan; angka yang mengikat hanya ada di STNK, hasil uji berkala, dan JBI unit yang bersangkutan.",
    },
    {
      type: "h2",
      id: "golongan",
      text: "Kolom golongan tol dan golongan kapal",
    },
    {
      type: "p",
      text: "Dua kolom terakhir pada setiap tabel sering menjadi alasan halaman ini dibuka, karena keduanya langsung masuk ke perhitungan biaya rute. Yang perlu diingat: keduanya memakai dasar yang berbeda. Golongan tol mengikuti jumlah gandar, golongan penyeberangan mengikuti panjang keseluruhan kendaraan.",
    },
    {
      type: "p",
      text: "Akibatnya, truk bergandar dua yang berbadan panjang bisa masuk golongan penyeberangan lebih tinggi daripada truk bergandar tiga yang pendek — sekalipun golongan tolnya justru lebih rendah. Menghitung biaya kapal memakai golongan tol akan meleset, dan biasanya ke arah yang merugikan.",
    },
    {
      type: "h2",
      id: "dua-batas",
      text: "Volume dan berat: hampir tidak pernah habis bersamaan",
    },
    {
      type: "p",
      text: "Perhatikan kolom perkiraan volume dan kolom perkiraan muatan secara berpasangan. CDE long menawarkan sekitar 14 meter kubik berbanding 8 meter kubik pada CDE pendek, dengan perkiraan muatan yang praktis sama — pilihan tepat untuk barang ringan bervolume seperti kemasan plastik, foam, atau tekstil, dan pilihan yang sia-sia untuk barang padat.",
    },
    {
      type: "p",
      text: "Pola yang sama berulang di seluruh tabel, dan puncaknya pada trailer: satu unit 40 kaki punya ruang dua kali lipat 20 kaki tetapi tidak dua kali lipat kapasitas beratnya. Untuk muatan padat, dua unit 20 kaki kerap mengangkut tonase lebih banyak.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Kapasitas bak bukan izin mengangkut",
      body: "Yang menentukan sah atau tidaknya sebuah muatan adalah JBI, yaitu batas berat yang diizinkan untuk kelas jalan yang dilewati — dan angkanya bisa lebih rendah daripada JBB pabrikan. Truk yang sama bisa sah membawa satu tonase di satu rute dan melanggar di rute lain, dengan bak yang sama sekali tidak berubah.",
    },
    {
      type: "h2",
      id: "wingbox",
      text: "Wingbox: yang dibeli sebenarnya waktu, bukan ruang",
    },
    {
      type: "p",
      text: "Dinding samping yang membuka penuh memungkinkan forklift memuat dari sisi, bukan mendorong barang menyusuri lorong bak dari pintu belakang. Untuk muatan berpalet, ini memangkas waktu muat secara drastis.",
    },
    {
      type: "p",
      text: "Penghematannya jarang muncul dalam perbandingan tarif sewa, karena yang berkurang adalah waktu tunggu di halaman gudang — biaya yang ditanggung tetapi tidak pernah ditagihkan sebagai satu baris. Pada operasi dengan rit padat, waktu muat yang lebih pendek berarti satu rit tambahan per hari, dan itu jauh melampaui selisih tarifnya.",
    },
    {
      type: "h2",
      id: "memilih",
      text: "Cara cepat memilih kelas armada",
    },
    {
      type: "ol",
      items: [
        "Hitung dulu total kubikasi dan total berat muatan. Keduanya, bukan salah satunya.",
        "Bagi berat dengan kubikasi untuk mendapat kepadatan muatan dalam kg per meter kubik.",
        "Muatan di bawah sekitar 250 kg per meter kubik akan menghabiskan ruang lebih dulu — cari bak yang besar, bukan sumbu yang banyak.",
        "Muatan di atas sekitar 400 kg per meter kubik akan menghabiskan berat lebih dulu — cari kapasitas berat, dan abaikan sisa ruang yang menganggur.",
        "Periksa golongan tol dan golongan penyeberangan pada tabel. Keduanya masuk ke biaya rute, dan keduanya memakai dasar penggolongan yang berbeda.",
        "Periksa akses di lokasi bongkar sebelum memesan. Tronton yang tidak bisa masuk gang jauh lebih mahal daripada dua CDD yang bisa.",
      ],
    },
  ],
  faq: [
    {
      q: "Kenapa tidak ada angka payload pasti untuk CDD atau tronton?",
      a: "Karena keduanya sebutan pasar, bukan kategori hukum. Payload legal sebuah unit adalah JBI yang berlaku dikurangi berat kosongnya setelah karoseri terpasang, dan keduanya berbeda antar unit. Tabel yang memberi satu angka pasti untuk sebutan pasar sedang menjanjikan kepastian yang tidak dimilikinya.",
    },
    {
      q: "Apa beda CDE dan CDD?",
      a: "CDE adalah truk ringan dengan roda belakang tunggal, bak sekitar 3 x 1,7 x 1,7 meter atau kira-kira 8 meter kubik, dengan perkiraan muatan 1,8 sampai 2,8 ton. CDD berroda belakang ganda pada sumbu yang sama, bak sekitar 4,5 x 2,0 x 2,0 meter atau kira-kira 18 meter kubik, dengan perkiraan muatan 3,5 sampai 5,5 ton. Keduanya sama-sama bergandar dua — yang berbeda jumlah rodanya, bukan jumlah sumbunya.",
    },
    {
      q: "Berapa kapasitas truk kelas fuso?",
      a: "Truk medium bergandar dua yang lazim disebut fuso umumnya berbak sekitar 6,0 x 2,3 x 2,3 meter, kira-kira 30 sampai 34 meter kubik, dengan perkiraan muatan 6 sampai 10 ton. Fuso adalah nama yang berasal dari merek, bukan kelas kapasitas, sehingga angka pastinya bergantung pada karoseri dan penetapan JBI unitnya.",
    },
    {
      q: "Berapa kubikasi tronton dan wingbox?",
      a: "Tronton bergandar tiga berbak sekitar 8,5 x 2,4 x 2,5 meter, kira-kira 48 sampai 55 meter kubik, dengan perkiraan muatan 10 sampai 16 ton. Wingbox bergandar dua lebih kecil, sekitar 40 sampai 45 meter kubik. Wingbox pada rangkaian trailer jauh lebih besar lagi, sekitar 75 sampai 90 meter kubik dengan muatan 18 sampai 28 ton.",
    },
    {
      q: "Truk apa yang paling cocok untuk barang ringan bervolume besar?",
      a: "Yang perlu dicari adalah ruang, bukan kapasitas berat. CDE long, CDD long, dan wingbox memberi kubikasi jauh lebih besar tanpa kenaikan biaya yang sebanding — CDE long misalnya menawarkan sekitar 14 meter kubik berbanding 8 meter kubik pada CDE pendek, dengan perkiraan muatan yang praktis sama. Batas beratnya memang tidak akan tersentuh oleh barang seringan itu.",
    },
    {
      q: "Apakah kapasitas pada tabel ini boleh dipakai sebagai batas muat?",
      a: "Tidak. Angka pada tabel adalah kapasitas khas untuk memilih kelas armada. Batas yang mengikat secara hukum adalah JBI kendaraan pada rute yang dilalui, dan itu harus dibaca dari dokumen kendaraan serta ketentuan kelas jalan setempat.",
    },
  ],
  sources: [
    { label: "PP 55/2012", detail: "Kategori kendaraan barang N1/N2/N3, kategori kereta gandengan, batas dimensi, serta konsep JBB dan JBI." },
    { label: "Kepmen PUPR 176/KPTS/M/2025", detail: "Penggolongan kendaraan di jalan tol, Golongan I sampai V." },
    { label: "Ketentuan penyeberangan ASDP", detail: "Penggolongan kendaraan penyeberangan Golongan I sampai IX berdasarkan fungsi dan panjang keseluruhan." },
    { label: "Spesifikasi resmi pabrikan", detail: "Rentang GVW dan GCW dari Mitsubishi Fuso, Isuzu, Hino, UD Trucks, Suzuki, Toyota, dan pabrikan trailer khusus." },
  ],
  relatedArticles: ["odol-timbangan-jembatan-muatan-lebih", "perawatan-armada-preventif-vs-reaktif", "manajemen-vendor-subkontraktor"],
  relatedTools: ["kalkulator-muatan-truk", "kalkulator-cbm", "kamus-logistik"],
};

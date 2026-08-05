import type { Tool } from "./types";

export const tool: Tool = {
  slug: "golongan-tol-penyeberangan",
  kind: "referensi",
  title: "Golongan Tol, Golongan Penyeberangan, Kelas Jalan, dan Batas Dimensi",
  metaTitle: "Golongan Tol & Penyeberangan Truk: Kelas Jalan dan Batas Dimensi | CargoGrid",
  description:
    "Golongan tol I sampai V menurut jumlah gandar, golongan penyeberangan I sampai IX menurut panjang kendaraan, kelas jalan berikut batas MST, serta batas dimensi dan konsep JBB/JBI.",
  keywords: [
    "golongan tol truk",
    "golongan penyeberangan kendaraan",
    "kelas jalan MST",
    "batas dimensi truk",
    "arti JBB dan JBI",
    "aturan panjang lebar tinggi truk",
  ],
  summary:
    "Empat aturan yang menentukan boleh atau tidaknya sebuah muatan berjalan, dan berapa biaya rutenya. Semuanya sering dicampuradukkan, padahal masing-masing memakai dasar penggolongan yang sama sekali berbeda.",
  searchIntents: [
    "Truk saya masuk golongan tol berapa",
    "Golongan penyeberangan untuk trailer 40 kaki",
    "Batas lebar, panjang, dan tinggi truk yang diizinkan",
    "Beda JBB dan JBI",
    "Kelas jalan dan batas muatan sumbu terberat",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "tiga-logika",
      text: "Tiga penggolongan, tiga dasar yang berbeda",
    },
    {
      type: "p",
      text: "Sumber kekeliruan yang paling sering muncul dalam menghitung biaya rute adalah menyamakan ketiganya. Padahal masing-masing melihat kendaraan yang sama dari sudut yang berbeda.",
    },
    {
      type: "table",
      caption: "Satu kendaraan, tiga cara menggolongkannya",
      head: ["Penggolongan", "Dasarnya", "Yang menentukan"],
      rows: [
        ["Golongan tol", "Jenis kendaraan dan jumlah gandar", "Berapa gandar yang menyentuh jalan"],
        ["Golongan penyeberangan", "Fungsi kendaraan dan panjang keseluruhan", "Berapa meter dek kapal yang dipakai"],
        ["Kelas jalan", "Dimensi kendaraan dan muatan sumbu terberat", "Ruas jalan mana yang boleh dilewati"],
      ],
    },
    {
      type: "p",
      text: "Akibat praktisnya nyata. Truk bergandar dua yang berbadan panjang bisa masuk golongan penyeberangan lebih tinggi daripada truk bergandar tiga yang pendek, sekalipun golongan tolnya justru lebih rendah. Menghitung biaya kapal memakai golongan tol akan meleset, dan biasanya meleset ke arah yang merugikan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Jumlah roda bukan jumlah gandar",
      body: "CDD berroda enam tetapi bergandar dua, karena roda belakangnya ganda pada satu sumbu. Golongan tol menghitung gandar, bukan roda. Kekeliruan ini rutin membuat anggaran tol satu golongan lebih tinggi daripada yang sebenarnya dibayar.",
    },
    {
      type: "h2",
      id: "tarif-tidak-di-sini",
      text: "Kenapa tarifnya tidak ada di halaman ini",
    },
    {
      type: "p",
      text: "Golongan adalah klasifikasi yang bertahan lama. Tarif tidak. Tarif tol berbeda per ruas jalan dan berubah menurut tanggal berlaku; tarif penyeberangan berbeda per lintasan dan disesuaikan berkala.",
    },
    {
      type: "p",
      text: "Menuliskan satu angka tarif nasional di sini berarti menerbitkan angka yang akan salah dalam hitungan bulan, dan tidak akan ada yang tahu kapan mulai salahnya. Yang kami sediakan adalah penggolongannya; tarif ambil dari ruas dan lintasan yang benar-benar dilewati, lalu masukkan sebagai isian pada kalkulator biaya operasional.",
    },
    {
      type: "h2",
      id: "jbb-jbi",
      text: "JBB dan JBI: dua angka yang sering dianggap sama",
    },
    {
      type: "p",
      text: "JBB adalah batas berat menurut rancangan pabrikan. Ini rating teknis, yaitu apa yang sanggup ditanggung kendaraan itu. JBI adalah berat operasional yang diizinkan, yang memperhitungkan berat kosong, dimensi dan bodi terpasang, kelas jalan, serta beban sumbu. JBI selalu lebih kecil atau sama dengan JBB.",
    },
    {
      type: "p",
      text: "Yang menentukan pelanggaran di jembatan timbang adalah JBI, bukan JBB, dan bukan pula angka payload di brosur. Payload legal sesungguhnya adalah JBI dikurangi berat kosong kendaraan setelah karoseri terpasang, dikurangi awak, bahan bakar, dan perlengkapan.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Karena itu tidak ada angka payload universal untuk CDD atau tronton",
      body: "Sebutan pasar seperti CDE, CDD, fuso, tronton, dan wingbox adalah nama dagang, bukan kategori hukum, dan tidak ada satu pun angka kapasitas yang melekat padanya. Dua truk dengan sebutan sama bisa berbeda payload legalnya beberapa ton, karena berbeda karoseri dan berbeda penetapan JBI. Tabel mana pun yang memberi satu angka pasti untuk sebutan pasar sedang menjanjikan kepastian yang tidak dimilikinya.",
    },
    {
      type: "h2",
      id: "mst",
      text: "MST membatasi per sumbu, bukan berat total",
    },
    {
      type: "p",
      text: "Muatan sumbu terberat menetapkan berapa ton yang boleh ditanggung satu sumbu, dan inilah yang paling sering luput. Sebuah truk bisa lolos batas berat total tetapi tetap melanggar karena muatannya menumpuk di bagian belakang, sehingga satu sumbu memikul lebih dari jatahnya.",
    },
    {
      type: "p",
      text: "Artinya penataan muatan di atas bak bukan sekadar urusan kerapian. Distribusi berat sepanjang bak menentukan sah atau tidaknya kendaraan yang sama dengan tonase yang sama persis.",
    },
    {
      type: "h2",
      id: "odol",
      text: "Kendaraan yang dimodifikasi berlebih bukan kategori armada",
    },
    {
      type: "p",
      text: "Ada perbedaan penting yang layak dinyatakan terang-terangan. Kendaraan yang dimodifikasi melampaui ketentuan atau dimuati melebihi batas adalah persoalan ketidakpatuhan, bukan pilihan kelas armada. Ia tidak pantas diperlakukan sebagai opsi yang lebih murah dalam perencanaan.",
    },
    {
      type: "p",
      text: "Berbeda halnya dengan muatan yang memang berdimensi atau berbobot melebihi standar seperti alat berat, transformator, dan mesin produksi. Muatan seperti itu bisa diangkut secara sah dengan peralatan yang sesuai, kajian rute, izin, dan pengawalan bila disyaratkan. Yang pertama adalah pelanggaran; yang kedua adalah pekerjaan proyek dengan biaya dan persiapannya sendiri.",
    },
  ],
  faq: [
    {
      q: "Truk CDD masuk golongan tol berapa?",
      a: "Umumnya Golongan II, karena bergandar dua. Roda belakangnya ganda pada satu sumbu, sehingga berroda enam tetapi tetap dua gandar. Golongan tol menghitung gandar, bukan roda.",
    },
    {
      q: "Rangkaian tractor head dengan trailer 40 kaki masuk golongan apa?",
      a: "Golongan tol V karena bergandar lima atau lebih, dan golongan penyeberangan IX karena panjang keseluruhannya di atas 16 meter. Dua penggolongan yang berbeda dasarnya, dan keduanya perlu masuk perhitungan biaya rute.",
    },
    {
      q: "Apa beda JBB dan JBI?",
      a: "JBB adalah batas berat menurut rancangan pabrikan. JBI adalah berat operasional yang diizinkan dengan memperhitungkan berat kosong, bodi terpasang, kelas jalan, dan beban sumbu. JBI selalu lebih kecil atau sama dengan JBB, dan JBI yang menentukan pelanggaran.",
    },
    {
      q: "Berapa batas lebar dan tinggi kendaraan barang?",
      a: "Lebar maksimum 2,5 meter dan tinggi maksimum 4,2 meter, dengan syarat tambahan bahwa tinggi tidak lebih dari 1,7 kali lebar kendaraan. Yang berlaku adalah yang lebih rendah di antara keduanya, sehingga kendaraan berbadan sempit punya batas tinggi di bawah 4,2 meter.",
    },
    {
      q: "Kenapa truk yang sama bisa melanggar di satu rute dan tidak di rute lain?",
      a: "Karena yang membatasi adalah kelas jalannya. Jalan kelas I mengizinkan muatan sumbu terberat 10 ton dan panjang sampai 18 meter, sementara kelas III membatasi lebar 2,1 meter, panjang 9 meter, dan tinggi 3,5 meter. Kendaraannya tidak berubah; ruas jalan yang dilewatinya yang berbeda.",
    },
  ],
  sources: [
    { label: "PP 55/2012", detail: "Batas panjang, lebar, tinggi, dan julur kendaraan, kategori kendaraan, serta konsep JBB dan JBI." },
    { label: "UU 22/2009", detail: "Kerangka kelas jalan dan angkutan barang khusus." },
    { label: "PP 79/2013 dan Permen PUPR 13/2024", detail: "Parameter kelas jalan dan muatan sumbu terberat, berikut mekanisme penetapannya." },
    { label: "Kepmen PUPR 176/KPTS/M/2025", detail: "Penggolongan kendaraan di jalan tol." },
    { label: "Permenhub 60/2019", detail: "Kerangka pengangkutan barang berdimensi atau berbobot khusus." },
  ],
  relatedArticles: ["odol-timbangan-jembatan-muatan-lebih", "manajemen-vendor-subkontraktor", "kpi-operasional-logistik"],
  relatedTools: ["jenis-truk-indonesia", "biaya-operasional-truk", "kalkulator-muatan-truk"],
};

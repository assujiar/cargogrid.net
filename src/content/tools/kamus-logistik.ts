import type { Tool } from "./types";

export const tool: Tool = {
  slug: "kamus-logistik",
  kind: "referensi",
  title: "Kamus Istilah Logistik Indonesia",
  metaTitle: "Kamus Istilah Logistik — Arti SPPB, NPE, VGM, THC, Demurrage | CargoGrid",
  description:
    "Lebih dari 150 istilah dan singkatan logistik Indonesia dengan penjelasan operasionalnya: kepabeanan, pelayaran, pergudangan, angkutan darat dan armada, tarif, serta indikator kinerja.",
  keywords: [
    "istilah logistik",
    "singkatan logistik indonesia",
    "arti SPPB",
    "kamus ekspor impor",
    "istilah freight forwarding",
    "glosarium logistik",
  ],
  summary:
    "Staf baru bertemu empat puluh singkatan dalam minggu pertamanya, dan setiap satunya adalah hal yang dianggap sudah semestinya diketahui — justru karena itu tidak ada yang bertanya. Kamus ini menjelaskan apa artinya sekaligus kenapa itu penting.",
  searchIntents: [
    "Arti SPPB, NPE, PIB, dan PEB",
    "Kepanjangan VGM, THC, LSS, dan BAF",
    "Beda demurrage, detention, dan storage",
    "Arti FIFO, FEFO, dan cross docking",
    "Singkatan dan istilah dalam dokumen ekspor impor",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "cara-pakai",
      text: "Cara memakai kamus ini",
    },
    {
      type: "p",
      text: "Ketik di kotak pencarian untuk menyaring seluruh daftar, atau lompat lewat kategori. Setiap entri punya tautan permanen sendiri, sehingga satu istilah bisa dikirim langsung ke rekan lewat pesan tanpa membuatnya mencari sendiri.",
    },
    {
      type: "p",
      text: "Dua hal yang sengaja tidak ada di sini. Pertama, tidak ada tarif, ambang, maupun besaran pungutan — angka semacam itu berubah, dan kamus yang mengutipnya menjadi salah tanpa ada yang menyadari. Kedua, tidak ada definisi yang berhenti pada kepanjangannya. Mengetahui bahwa PIB adalah Pemberitahuan Impor Barang tidak mengubah apa pun; mengetahui bahwa pengajuannyalah yang memicu penetapan jalur pemeriksaan mengubah urutan pekerjaan hari itu.",
    },
    {
      type: "h2",
      id: "kenapa-penting",
      text: "Kenapa kosakata operasional bukan hal sepele",
    },
    {
      type: "p",
      text: "Istilah yang tertukar berujung pada biaya yang salah dibebankan. Demurrage dan detention dipakai bergantian dalam percakapan sehari-hari, padahal pemicunya berbeda dan tim yang bisa memperbaikinya pun berbeda. Begitu keduanya ditumpuk ke satu akun bernama biaya pelabuhan, jejak akar masalahnya hilang — dan yang hilang bersamanya adalah kemungkinan memperbaikinya.",
    },
    {
      type: "p",
      text: "Pola yang sama berulang di banyak tempat. JBB dan JBI terdengar mirip tetapi hanya satu yang menentukan pelanggaran di jembatan timbang. FIFO dan FEFO memberi hasil berbeda untuk barang bertanggal kedaluwarsa. Berat volumetrik dan chargeable weight bukan hal yang sama. Setiap pasangan itu adalah tempat uang berpindah tanpa ada yang memutuskannya.",
    },
  ],
  faq: [
    {
      q: "Apa itu SPPB dalam proses impor?",
      a: "Surat Persetujuan Pengeluaran Barang, yaitu persetujuan yang memperbolehkan barang impor keluar dari kawasan pabean. Ini tonggak paling menentukan dalam perlombaan melawan free time, karena sebelum SPPB terbit truk sama sekali tidak boleh mengambil kontainer.",
    },
    {
      q: "Apa beda demurrage, detention, dan storage?",
      a: "Demurrage adalah denda pelayaran karena kontainer masih di dalam terminal melewati free time. Detention adalah denda pelayaran karena kontainer sudah keluar tetapi belum dikembalikan ke depo. Storage adalah biaya terminal atas ruang penumpukan. Satu kontainer terlambat bisa memicu tagihan dari dua pihak sekaligus.",
    },
    {
      q: "Apa itu VGM dan kenapa wajib?",
      a: "Verified Gross Mass, berat kotor kontainer terverifikasi yang wajib dilaporkan pengirim sebelum pemuatan sesuai konvensi SOLAS. Kontainer tanpa VGM tidak boleh dimuat ke kapal.",
    },
    {
      q: "Apa beda FIFO dan FEFO?",
      a: "FIFO mengeluarkan barang yang masuk lebih dulu. FEFO mengeluarkan barang yang kedaluwarsanya paling dekat, tanpa memandang kapan masuknya. Untuk pangan dan farmasi, keduanya bisa memberi hasil yang berbeda, dan FEFO yang benar.",
    },
    {
      q: "Apa beda JBB dan JBI?",
      a: "JBB adalah batas berat total menurut rancangan pabrikan kendaraan. JBI adalah batas yang diizinkan pada kelas jalan tertentu dan bisa lebih rendah. Yang menentukan pelanggaran muatan adalah JBI, bukan JBB.",
    },
  ],
  relatedArticles: ["dokumen-kepabeanan-arsip-digital", "demurrage-detention-pelabuhan", "kpi-operasional-logistik"],
  relatedTools: ["incoterms-2020", "ukuran-kontainer", "kalkulator-cbm"],
};

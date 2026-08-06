import type { Tool } from "./types";

export const tool: Tool = {
  slug: "incoterms-2020",
  kind: "referensi",
  title: "Incoterms 2020: Sebelas Aturan, Titik Risiko, dan Kesalahan yang Paling Mahal",
  metaTitle: "Incoterms 2020 Lengkap: EXW, FOB, CIF, DAP, DDP | CargoGrid",
  description:
    "FOB atau CIF, di titik mana risiko sebenarnya berpindah ke pembeli? Bukan soal siapa bayar apa: sebelas aturan Incoterms 2020 di sini disusun berdasarkan titik pindah risikonya.",
  keywords: [
    "incoterms 2020",
    "perbedaan FOB dan CIF",
    "arti EXW FCA DAP DDP",
    "incoterms 2020 lengkap",
    "titik pindah risiko incoterms",
    "incoterms untuk kontainer",
  ],
  summary:
    "Titik yang menentukan dalam Incoterms bukan siapa membayar, melainkan di mana risiko berpindah, dan titik itu sering berada di tempat berbeda dari titik biaya berhenti.",
  searchIntents: [
    "Arti FOB, CIF, CFR, EXW, DAP, DDP",
    "Perbedaan FOB dan CIF",
    "Incoterms mana yang tepat untuk kargo kontainer",
    "Siapa menanggung asuransi pada CIF dan CIP",
    "Apa yang berubah pada Incoterms 2020 dibanding 2010",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "biaya-bukan-risiko",
      text: "Biaya dan risiko berpindah di tempat yang berbeda",
    },
    {
      type: "p",
      text: "Pada CFR dan CIF, penjual membayar ongkos angkut sampai pelabuhan tujuan, tetapi risiko sudah berpindah ke pembeli sejak pelabuhan muat. Kontainer yang rusak di tengah laut jadi kerugian pembeli, meski ongkos pengirimannya masih dibayar penjual. Perbedaan dua titik inilah yang paling sering luput dibaca dalam kontrak.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Pertanyaan yang benar bukan \"siapa bayar\"",
      body: "Kalau kargo hilang atau rusak di titik tertentu, siapa yang menanggung kerugiannya, dan apakah pihak itu punya polis yang menutupnya? Sebagian besar Incoterms tidak mewajibkan siapa pun berasuransi. Artinya ada aturan-aturan yang menciptakan celah: barang berjalan atas biaya satu pihak, atas risiko pihak lain, tanpa polis wajib dari keduanya.",
    },
    {
      type: "h2",
      id: "fob-untuk-kontainer",
      text: "FOB untuk kargo kontainer: kesalahan paling umum di Indonesia",
    },
    {
      type: "p",
      text: "FOB berarti risiko berpindah saat barang berada di atas kapal. Rumusan itu masuk akal untuk kargo curah yang benar-benar diangkat satu per satu ke atas kapal. Untuk kontainer, tidak.",
    },
    {
      type: "p",
      text: "Kontainer diserahkan ke terminal berhari-hari sebelum kapal berangkat. Sepanjang hari-hari itu barang sudah tidak dikuasai penjual sama sekali, tetapi di bawah FOB risikonya masih miliknya. Kontainer yang rusak, terbakar, atau tercuri di tumpukan terminal adalah kerugian penjual, atas barang yang tidak lagi bisa dijaganya.",
    },
    {
      type: "p",
      text: "FCA adalah aturan yang benar secara teknis untuk kontainer: risiko berpindah saat barang diserahkan ke pengangkut di tempat yang disepakati. Alasan historis orang tetap memakai FOB adalah bank penerbit letter of credit yang menuntut on-board bill of lading, dan justru itu yang dijawab edisi 2020, dengan membolehkan para pihak menyepakati B/L bercatatan on-board di bawah FCA.",
    },
    {
      type: "h2",
      id: "asuransi",
      text: "CIP dan CIF tidak lagi setara sejak 2020",
    },
    {
      type: "p",
      text: "Pada edisi 2010, keduanya hanya mewajibkan Institute Cargo Clauses (C), perlindungan terbatas yang pada dasarnya hanya menanggung kejadian besar seperti kapal kandas, terbakar, atau tenggelam. Sejak edisi 2020, CIP naik ke ICC (A) yang berperlindungan luas, sementara CIF tetap di ICC (C).",
    },
    {
      type: "p",
      text: "Konsekuensinya nyata: pembeli di bawah CIF yang mengira dirinya \"sudah diasuransikan penjual\" tidak tertutup untuk pencurian, basah, maupun penyok, tiga penyebab klaim yang paling sering terjadi. Bila perlindungan sungguhan yang dibutuhkan, naikkan ke ICC (A) secara eksplisit dalam kontrak, atau beli polis sendiri.",
    },
    {
      type: "h2",
      id: "exw-untuk-ekspor",
      text: "EXW dan ekspor: kombinasi yang sering tidak bisa dijalankan",
    },
    {
      type: "p",
      text: "Di bawah EXW, pengurusan ekspor menjadi kewajiban pembeli. Untuk transaksi lintas negara, itu berarti pembeli asing harus mengajukan pemberitahuan ekspor atas nama eksportir yang bukan dirinya, sesuatu yang secara administratif sering tidak mungkin dilakukan.",
    },
    {
      type: "p",
      text: "Yang biasanya terjadi di lapangan: penjual tetap mengurus ekspornya sendiri \"sebagai bantuan\", di luar kontrak, sehingga tidak ada kejelasan siapa menanggung bila ada dokumen yang keliru. Ganjalan ini hilang di bawah FCA, karena ekspor memang tetap jadi kewajiban penjual sejak awal, tanpa perlu fiksi administratif.",
    },
  ],
  faq: [
    {
      q: "Apa perbedaan FOB dan CIF?",
      a: "Titik pindah risikonya sama: saat barang berada di atas kapal di pelabuhan muat. Yang berbeda adalah biaya. Di bawah FOB, pembeli membayar ongkos angkut laut. Di bawah CIF, penjual membayar ongkos angkut laut sekaligus premi asuransi minimum, meski risikonya sudah bukan miliknya lagi.",
    },
    {
      q: "Incoterms mana yang benar untuk kargo kontainer?",
      a: "FCA untuk penyerahan di asal, CPT atau CIP untuk pengiriman sampai tujuan. Aturan khusus laut seperti FOB, CFR, dan CIF dirancang untuk kargo yang benar-benar dimuat satu per satu ke atas kapal, bukan untuk kontainer yang diserahkan ke terminal berhari-hari sebelumnya.",
    },
    {
      q: "Apa yang berubah pada Incoterms 2020?",
      a: "DAT berganti menjadi DPU dengan tujuan yang tidak lagi harus berupa terminal; CIP naik ke Institute Cargo Clauses (A) sementara CIF tetap di ICC (C); FCA kini bisa disepakati dengan bill of lading bercatatan on-board; alokasi biaya dikumpulkan pada satu pasal; dan kewajiban keamanan dinyatakan lebih tegas.",
    },
    {
      q: "Apakah asuransi wajib pada semua Incoterms?",
      a: "Tidak. Hanya CIF dan CIP yang mewajibkan penjual berasuransi. Sembilan aturan lainnya tidak mewajibkan siapa pun, sehingga pihak yang menanggung risiko perlu menutupnya sendiri.",
    },
    {
      q: "Apakah kontrak yang masih menulis DAT tetap sah?",
      a: "Tetap sah, tetapi merujuk pada edisi yang sudah digantikan. DAT mengharuskan tujuan berupa terminal, sedangkan penggantinya DPU membolehkan tempat mana pun sepanjang barang dibongkar di sana. Sebutkan edisi yang dipakai secara eksplisit dalam kontrak.",
    },
  ],
  relatedArticles: ["asuransi-cargo-klaim-kerusakan-barang", "dokumen-kepabeanan-arsip-digital", "alur-rfq-freight-forwarding"],
  relatedTools: ["kamus-logistik", "ukuran-kontainer", "kalkulator-demurrage"],
};

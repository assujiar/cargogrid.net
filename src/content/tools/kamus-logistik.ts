import type { Tool } from "./types";

export const tool: Tool = {
  slug: "kamus-logistik",
  kind: "referensi",
  title: "Kamus Istilah Logistik Indonesia",
  titleEn: "Indonesian Logistics Terms Dictionary",
  metaTitle: "Kamus Istilah Logistik: Arti SPPB, NPE, VGM, THC, Demurrage | CargoGrid",
  description:
    "Ketemu singkatan seperti SPPB atau VGM di dokumen dan tidak yakin artinya? Kamus ini menjelaskan seratus lima puluh istilah logistik Indonesia, sekaligus kenapa masing-masing penting di lapangan.",
  descriptionEn:
    "Come across an abbreviation like SPPB or VGM in a document and aren't sure what it means? This dictionary explains one hundred fifty Indonesian logistics terms, and why each one matters on the ground.",
  keywords: [
    "istilah logistik",
    "singkatan logistik indonesia",
    "arti SPPB",
    "kamus ekspor impor",
    "istilah freight forwarding",
    "glosarium logistik",
  ],
  summary:
    "Seratus lima puluh istilah logistik Indonesia, disusun per kategori dan bisa disaring lewat pencarian. Tiap entri menjelaskan bukan cuma kepanjangannya, tapi kenapa istilah itu mengubah keputusan operasional sehari-hari.",
  summaryEn:
    "One hundred fifty Indonesian logistics terms, organized by category and searchable. Each entry explains not just what the acronym stands for, but why the term changes day-to-day operational decisions.",
  searchIntents: [
    "Arti SPPB, NPE, PIB, dan PEB",
    "Kepanjangan VGM, THC, LSS, dan BAF",
    "Beda demurrage, detention, dan storage",
    "Arti FIFO, FEFO, dan cross docking",
    "Singkatan dan istilah dalam dokumen ekspor impor",
  ],
  searchIntentsEn: [
    "What SPPB, NPE, PIB, and PEB mean",
    "What VGM, THC, LSS, and BAF stand for",
    "Difference between demurrage, detention, and storage",
    "What FIFO, FEFO, and cross docking mean",
    "Abbreviations and terms in export-import documents",
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
      text: "Dua hal yang sengaja tidak ada di sini. Pertama, tidak ada tarif, ambang, maupun besaran pungutan, angka semacam itu berubah, dan kamus yang mengutipnya menjadi salah tanpa ada yang menyadari. Kedua, tidak ada definisi yang berhenti pada kepanjangannya. Mengetahui bahwa PIB adalah Pemberitahuan Impor Barang tidak mengubah apa pun; mengetahui bahwa pengajuannyalah yang memicu penetapan jalur pemeriksaan mengubah urutan pekerjaan hari itu.",
    },
    {
      type: "h2",
      id: "kenapa-penting",
      text: "Kenapa kosakata operasional bukan hal sepele",
    },
    {
      type: "p",
      text: "Istilah yang tertukar bisa berujung pada biaya yang salah dibebankan. Demurrage dan detention dipakai bergantian dalam percakapan sehari-hari, padahal pemicunya berbeda dan tim yang bisa memperbaikinya pun berbeda. Begitu keduanya ditumpuk ke satu akun bernama biaya pelabuhan, jejak akar masalahnya gampang hilang, dan kemungkinan memperbaikinya ikut menyempit.",
    },
    {
      type: "p",
      text: "Pola yang sama berulang di banyak tempat. JBB dan JBI terdengar mirip tetapi hanya satu yang menentukan pelanggaran di jembatan timbang. FIFO dan FEFO memberi hasil berbeda untuk barang bertanggal kedaluwarsa. Berat volumetrik dan chargeable weight bukan hal yang sama. Setiap pasangan itu berpotensi jadi tempat uang berpindah tanpa ada yang benar-benar memutuskannya.",
    },
  ],
  blocksEn: [
    {
      type: "h2",
      id: "cara-pakai",
      text: "How to use this dictionary",
    },
    {
      type: "p",
      text: "Type in the search box to filter the full list, or jump straight to a category. Every entry has its own permanent link, so a single term can be sent straight to a colleague in a message without making them look it up themselves.",
    },
    {
      type: "p",
      text: "Two things are deliberately left out. First, there are no tariffs, thresholds, or levy amounts — figures like that change, and a dictionary that quotes them goes wrong without anyone noticing. Second, no definition stops at what the acronym stands for. Knowing that PIB is Pemberitahuan Impor Barang (Import Goods Declaration) changes nothing; knowing that filing it is what triggers the inspection-lane assignment changes the order of that day's work.",
    },
    {
      type: "h2",
      id: "kenapa-penting",
      text: "Why operational vocabulary isn't a minor detail",
    },
    {
      type: "p",
      text: "Mixed-up terms can lead to costs being charged to the wrong account. Demurrage and detention are used interchangeably in everyday conversation, even though their triggers differ and so do the teams who can fix them. Once both get lumped into one line item called port charges, the root-cause trail is easy to lose, and the chance of fixing it narrows along with it.",
    },
    {
      type: "p",
      text: "The same pattern repeats in many places. JBB and JBI sound alike, but only one of them determines a violation at the weighbridge. FIFO and FEFO produce different outcomes for goods with expiry dates. Volumetric weight and chargeable weight are not the same thing. Each of those pairs is a place where money can change hands without anyone actually deciding it should.",
    },
  ],
  faq: [
    {
      q: "Apa itu SPPB dalam proses impor?",
      a: "Surat Persetujuan Pengeluaran Barang, yaitu persetujuan yang memperbolehkan barang impor keluar dari kawasan pabean. Ini salah satu tonggak paling menentukan dalam perlombaan melawan free time, karena sebelum SPPB terbit truk sama sekali tidak boleh mengambil kontainer.",
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
  faqEn: [
    {
      q: "What is SPPB in the import process?",
      a: "Surat Persetujuan Pengeluaran Barang (Goods Release Approval Letter) — the approval that allows imported goods to leave the customs area. It's one of the most decisive milestones in the race against free time, because no truck can pick up the container until SPPB is issued.",
    },
    {
      q: "What is the difference between demurrage, detention, and storage?",
      a: "Demurrage is a shipping line penalty for a container still sitting inside the terminal past free time. Detention is a shipping line penalty for a container that has left the terminal but hasn't been returned to the depot yet. Storage is a terminal charge for stacking space. One late container can trigger invoices from both parties at once.",
    },
    {
      q: "What is VGM and why is it mandatory?",
      a: "Verified Gross Mass — the container's verified gross weight, which shippers are required to declare before loading under the SOLAS convention. A container without a VGM cannot be loaded onto the vessel.",
    },
    {
      q: "What is the difference between FIFO and FEFO?",
      a: "FIFO releases the goods that arrived first. FEFO releases the goods with the nearest expiry date, regardless of when they arrived. For food and pharmaceuticals the two can produce different outcomes, and FEFO is the correct one.",
    },
    {
      q: "What is the difference between JBB and JBI?",
      a: "JBB is the total weight limit under the vehicle manufacturer's design. JBI is the limit permitted on a given road class, and it can be lower. What determines a load violation is JBI, not JBB.",
    },
  ],
  relatedArticles: ["dokumen-kepabeanan-arsip-digital", "demurrage-detention-pelabuhan", "kpi-operasional-logistik"],
  relatedTools: ["incoterms-2020", "ukuran-kontainer", "kalkulator-cbm"],
};

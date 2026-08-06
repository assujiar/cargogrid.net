import type { Tool } from "./types";

export const tool: Tool = {
  slug: "incoterms-2020",
  kind: "referensi",
  title: "Incoterms 2020: Sebelas Aturan, Titik Risiko, dan Kesalahan yang Paling Mahal",
  titleEn: "Incoterms 2020: Eleven Rules, Risk Transfer Points, and the Costliest Mistakes",
  metaTitle: "Incoterms 2020 Lengkap: EXW, FOB, CIF, DAP, DDP | CargoGrid",
  description:
    "FOB atau CIF, di titik mana risiko sebenarnya berpindah ke pembeli? Bukan soal siapa bayar apa: sebelas aturan Incoterms 2020 di sini disusun berdasarkan titik pindah risikonya.",
  descriptionEn:
    "FOB or CIF, at what point does risk actually pass to the buyer? This isn't about who pays for what: the eleven Incoterms 2020 rules here are organized by where risk transfers.",
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
  summaryEn:
    "The point that matters in Incoterms isn't who pays, it's where risk transfers, and that point is often different from where cost liability stops.",
  searchIntents: [
    "Arti FOB, CIF, CFR, EXW, DAP, DDP",
    "Perbedaan FOB dan CIF",
    "Incoterms mana yang tepat untuk kargo kontainer",
    "Siapa menanggung asuransi pada CIF dan CIP",
    "Apa yang berubah pada Incoterms 2020 dibanding 2010",
  ],
  searchIntentsEn: [
    "What FOB, CIF, CFR, EXW, DAP, DDP mean",
    "Difference between FOB and CIF",
    "Which Incoterms rule is right for container cargo",
    "Who is responsible for insurance under CIF and CIP",
    "What changed in Incoterms 2020 compared to 2010",
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
  blocksEn: [
    {
      type: "h2",
      id: "biaya-bukan-risiko",
      text: "Cost and risk transfer at different points",
    },
    {
      type: "p",
      text: "Under CFR and CIF, the seller pays freight to the destination port, but risk has already transferred to the buyer at the port of loading. A container damaged mid-voyage is the buyer's loss, even though the seller is still paying for the shipping. This gap between the two points is what gets missed most often when reading a contract.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "The right question isn't \"who pays\"",
      body: "If cargo is lost or damaged at a given point, who bears the loss, and does that party actually hold a policy covering it? Most Incoterms rules don't require anyone to insure. That means some rules create a gap: goods move at one party's cost, at another party's risk, with no mandatory coverage from either side.",
    },
    {
      type: "h2",
      id: "fob-untuk-kontainer",
      text: "FOB for container cargo: the most common mistake in Indonesia",
    },
    {
      type: "p",
      text: "FOB means risk transfers once the goods are on board the vessel. That formulation makes sense for bulk cargo that is actually loaded piece by piece onto the ship. For containers, it doesn't.",
    },
    {
      type: "p",
      text: "Containers are handed over to the terminal days before the vessel departs. Throughout those days the seller no longer has any control over the goods at all, but under FOB the risk is still theirs. A container that is damaged, catches fire, or is stolen in the terminal stack is the seller's loss, over goods they can no longer safeguard.",
    },
    {
      type: "p",
      text: "FCA is the technically correct rule for containers: risk transfers when the goods are handed over to the carrier at the agreed place. The historical reason people kept using FOB was issuing banks under letters of credit demanding an on-board bill of lading, and that is exactly what the 2020 edition addresses, by allowing the parties to agree on a B/L with an on-board notation under FCA.",
    },
    {
      type: "h2",
      id: "asuransi",
      text: "CIP and CIF are no longer equivalent since 2020",
    },
    {
      type: "p",
      text: "In the 2010 edition, both only required Institute Cargo Clauses (C), limited coverage that essentially only insures major events like the vessel running aground, catching fire, or sinking. Since the 2020 edition, CIP has moved up to ICC (A), which provides broad coverage, while CIF stays at ICC (C).",
    },
    {
      type: "p",
      text: "The consequence is real: a buyer under CIF who assumes they're \"already insured by the seller\" is not covered for theft, wetting, or denting, the three most common causes of claims. If genuine protection is needed, upgrade to ICC (A) explicitly in the contract, or buy your own policy.",
    },
    {
      type: "h2",
      id: "exw-untuk-ekspor",
      text: "EXW and export: a combination that often can't be executed",
    },
    {
      type: "p",
      text: "Under EXW, handling export clearance becomes the buyer's obligation. For cross-border transactions, that means the foreign buyer has to file an export declaration on behalf of an exporter that isn't them, something that is often administratively impossible.",
    },
    {
      type: "p",
      text: "What usually happens in practice: the seller still handles the export themselves \"as a favor\", outside the contract, so there's no clarity on who is liable if a document is wrong. This snag disappears under FCA, because export clearance stays the seller's obligation from the start, with no administrative fiction required.",
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
  faqEn: [
    {
      q: "What is the difference between FOB and CIF?",
      a: "The risk transfer point is the same: when the goods are on board the vessel at the port of loading. What differs is cost. Under FOB, the buyer pays ocean freight. Under CIF, the seller pays ocean freight plus the minimum insurance premium, even though the risk is no longer theirs.",
    },
    {
      q: "Which Incoterms rule is correct for container cargo?",
      a: "FCA for handover at origin, CPT or CIP for delivery to destination. Sea-specific rules like FOB, CFR, and CIF are designed for cargo that is actually loaded piece by piece onto the ship, not for containers handed over to the terminal days beforehand.",
    },
    {
      q: "What changed in Incoterms 2020?",
      a: "DAT was renamed DPU, with the destination no longer required to be a terminal; CIP moved up to Institute Cargo Clauses (A) while CIF stays at ICC (C); FCA can now be agreed with an on-board notation bill of lading; cost allocation was consolidated into a single article; and security obligations are stated more explicitly.",
    },
    {
      q: "Is insurance mandatory under all Incoterms rules?",
      a: "No. Only CIF and CIP require the seller to insure. The other nine rules don't require anyone to, so whichever party bears the risk needs to cover it themselves.",
    },
    {
      q: "Is a contract that still references DAT still valid?",
      a: "Still valid, but it refers to an edition that has been superseded. DAT required the destination to be a terminal, while its replacement DPU allows any place as long as the goods are unloaded there. State the edition being used explicitly in the contract.",
    },
  ],
  relatedArticles: ["asuransi-cargo-klaim-kerusakan-barang", "dokumen-kepabeanan-arsip-digital", "alur-rfq-freight-forwarding"],
  relatedTools: ["kamus-logistik", "ukuran-kontainer", "kalkulator-demurrage"],
};

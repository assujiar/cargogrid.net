import type { Tool } from "./types";

export const tool: Tool = {
  slug: "ukuran-kontainer",
  kind: "referensi",
  title: "Ukuran dan Kapasitas Kontainer: 20 ft, 40 ft, High Cube, Reefer",
  titleEn: "Container Sizes and Capacities: 20 ft, 40 ft, High Cube, Reefer",
  metaTitle: "Ukuran Kontainer 20 & 40 Feet: Dimensi, Kubikasi, Payload | CargoGrid",
  description:
    "Berapa CBM dan payload maksimum kontainer 20 kaki dibanding 40 kaki? Delapan tipe kontainer yang beredar di rute Indonesia ada di tabel ini, lengkap dengan dimensi dalam dan batas beratnya.",
  descriptionEn:
    "How many CBM and what's the maximum payload of a 20-foot container versus a 40-foot? Eight container types running Indonesian routes are laid out in this table, complete with internal dimensions and weight limits.",
  keywords: [
    "ukuran kontainer 20 feet",
    "ukuran kontainer 40 feet",
    "kapasitas kontainer CBM",
    "dimensi container high cube",
    "payload kontainer 20 ft",
    "ukuran container reefer",
  ],
  summary:
    "Dimensi dalam, kubikasi, dan batas berat untuk delapan tipe kontainer yang beredar di rute Indonesia, beserta satu hal yang tidak bisa diberikan tabel mana pun, dan di mana angka sesungguhnya harus dicari.",
  summaryEn:
    "Internal dimensions, cubic capacity, and weight limits for eight container types running Indonesian routes, plus the one thing no table can give you, and where to find the real numbers.",
  searchIntents: [
    "Ukuran dalam kontainer 20 feet dan 40 feet",
    "Berapa CBM muat dalam satu kontainer",
    "Payload maksimum kontainer 20 ft",
    "Beda 40 ft standar dan 40 ft high cube",
    "Dimensi kontainer reefer dibanding dry container",
  ],
  searchIntentsEn: [
    "Internal dimensions of 20-foot and 40-foot containers",
    "How many CBM fit in one container",
    "Maximum payload of a 20 ft container",
    "Difference between standard 40 ft and 40 ft high cube",
    "Reefer container dimensions compared to dry container",
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
      text: "Berat kosong kontainer berbeda beberapa ratus kilogram antar unit, bahkan untuk kotak dengan ukuran nominal yang sama, dan bukaan pintu maupun kubikasi ikut bergeser tergantung pabrikan serta usia unit. Artinya payload maksimum bukanlah sifat dari \"kontainer 20 kaki\" sama sekali, melainkan sifat dari unit tertentu, dan angkanya tercetak pada pelat CSC yang terpasang di daun pintu kanan. Angka-angka di tabel ini adalah acuan umum; untuk unit yang benar-benar akan dipakai, cocokkan dengan equipment interchange receipt atau spesifikasi resmi dari operator pelayaran maupun depo kontainernya sebelum merencanakan muatan final.",
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
      text: "Hampir tidak ada muatan yang mencapai kapasitas nominal. Kardus tidak menyusun diri secara sempurna, palet menyisakan celah antar tapak, dan dunnage mengambil bagiannya sendiri. Menawarkan 33 CBM kepada pelanggan lalu hanya memuat 27 adalah cara rutin kehilangan uang pada konsolidasi LCL.",
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
      text: "Kontainer 40 kaki punya ruang dua kali lipat 20 kaki, tetapi batas beratnya praktis sama saja, sekitar 28,8 ton berbanding 28,2 ton. Ruang berlipat dua, kapasitas berat tidak. Untuk barang padat seperti keramik, bahan kimia dalam drum, atau suku cadang logam, dua unit 20 kaki mengangkut kira-kira dua kali lipat tonase satu unit 40 kaki, meski totalnya kelihatan lebih mahal di rate sheet.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Cara cepat memutuskan",
      body: "Bagi berat total muatan dengan volume totalnya. Di bawah sekitar 430 kg per meter kubik, ruang akan habis lebih dulu dan 40 kaki atau high cube yang tepat. Di atas itu, berat yang habis lebih dulu, dan yang Anda butuhkan adalah jumlah kontainer 20 kaki, bukan kotak yang lebih besar.",
    },
    {
      type: "p",
      text: "Kesalahan yang sebaliknya juga umum: memesan 40 kaki standar untuk barang ringan bervolume, padahal high cube memberi tambahan sekitar sembilan meter kubik tanpa tambahan berat sedikit pun. Yang perlu diperiksa pada high cube terutama tinggi totalnya, yang berkisar sekitar 2,90 meter tergantung unit, periksa jembatan, portal, dan pintu gudang tujuan sebelum membooking.",
    },
    {
      type: "h2",
      id: "reefer",
      text: "Reefer: jangan memakai angka dry container",
    },
    {
      type: "p",
      text: "Ruang dalam reefer jauh lebih kecil daripada kontainer kering dengan panjang yang sama, karena unit pendingin dan lapisan insulasi memakan tempat. Reefer 20 kaki hanya sekitar 28 CBM dibanding sekitar 33 CBM milik dry container. Menghitung kubikasi ekspor hasil laut memakai angka dry adalah kesalahan yang baru ketahuan saat stuffing.",
    },
    {
      type: "p",
      text: "Satu biaya lagi yang rutin terlupa dari costing: reefer membutuhkan pasokan listrik atau genset selama seluruh perjalanan darat, dan sewa genset beserta pemantauan suhunya langsung menggerus margin bila tidak dimasukkan sejak penawaran.",
    },
  ],
  blocksEn: [
    {
      type: "h2",
      id: "angka-yang-mengikat",
      text: "One warning before using any of these numbers",
    },
    {
      type: "p",
      text: "Tare weight varies by several hundred kilograms between units, even for boxes of the same nominal size, and door opening as well as cubic capacity shift depending on the manufacturer and the unit's age. That means maximum payload is not a property of a \"20-foot container\" at all — it is a property of that specific unit, and the figure is stamped on the CSC plate mounted on the right-hand door leaf. The numbers in this table are general reference points; for the unit that will actually be used, verify them against the equipment interchange receipt or the official specification from the shipping line or container depot before finalizing your load plan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "The CSC plate is the only binding number",
      body: "People plan a 28-ton load off a table like this one, then find out the difference at the weighbridge. Use this table to answer \"does it fit\" and \"which box class do I need.\" For the weight figure you'll be held to, read the plate on the unit actually allocated to you.",
    },
    {
      type: "h2",
      id: "kubikasi-nyata",
      text: "Nominal cubic capacity versus cubic capacity actually used",
    },
    {
      type: "p",
      text: "Almost no load ever reaches nominal capacity. Cartons don't stack themselves perfectly, pallets leave gaps between footprints, and dunnage takes its own share. Quoting a customer 33 CBM and then only loading 27 is a routine way to lose money on LCL consolidation.",
    },
    {
      type: "p",
      text: "That's why the table above shows a realistic figure at 85 percent utilization alongside the nominal figure. For palletized goods of uniform size, utilization can run higher. For a mix of cartons in different sizes, it's often lower.",
    },
    {
      type: "h2",
      id: "dua-puluh-vs-empat-puluh",
      text: "Why two 20-foot units often beat one 40-foot",
    },
    {
      type: "p",
      text: "A 40-foot container has twice the space of a 20-foot, but its weight limit is practically the same, around 28.8 tons versus 28.2 tons. Space doubles; weight capacity doesn't. For dense cargo such as ceramics, chemicals in drums, or metal parts, two 20-foot units carry roughly twice the tonnage of one 40-foot unit, even though the total looks more expensive on the rate sheet.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "A quick way to decide",
      body: "Divide the total cargo weight by its total volume. Below roughly 430 kg per cubic meter, space runs out first, and a 40-foot or high cube is the right call. Above that, weight runs out first, and what you need is more 20-foot containers, not a bigger box.",
    },
    {
      type: "p",
      text: "The reverse mistake is just as common: booking a standard 40-foot for light, bulky cargo, when a high cube gives roughly nine more cubic meters at no extra weight allowance. What to check on a high cube is mainly its overall height, which runs around 2.90 meters depending on the unit — check bridges, gantries, and the destination warehouse door before booking.",
    },
    {
      type: "h2",
      id: "reefer",
      text: "Reefer: don't use dry container figures",
    },
    {
      type: "p",
      text: "Internal space in a reefer is considerably smaller than a dry container of the same length, because the refrigeration unit and insulation lining eat into it. A 20-foot reefer holds only around 28 CBM against roughly 33 CBM for a dry container. Calculating cubic capacity for seafood exports using dry container figures is a mistake that only surfaces at stuffing.",
    },
    {
      type: "p",
      text: "One more cost routinely left out of costing: a reefer needs a power supply or genset for the entire inland journey, and genset rental plus temperature monitoring eats straight into margin if it isn't built into the quote from the start.",
    },
  ],
  faq: [
    {
      q: "Berapa ukuran dalam kontainer 20 feet?",
      a: "Sekitar 5,90 x 2,35 x 2,39 meter, dengan kapasitas nominal sekitar 33 meter kubik. Bukaan pintunya lebih sempit dari lebar dalamnya, sekitar 2,34 x 2,28 meter, dan bukaan itulah yang sering menjadi kendala sebenarnya untuk barang besar.",
    },
    {
      q: "Berapa CBM yang muat dalam kontainer 40 ft?",
      a: "Kapasitas nominalnya sekitar 67 meter kubik untuk tipe standar dan sekitar 76 meter kubik untuk high cube. Secara praktis, rencanakan sekitar 85 persen dari angka itu, kira-kira 57 dan 65 meter kubik, karena penyusunan kardus nyaris tidak pernah sepadat itu.",
    },
    {
      q: "Berapa payload maksimum kontainer 20 ft?",
      a: "Sekitar 28,2 ton, dari berat kotor maksimum 30.480 kg dikurangi berat kosong sekitar 2,28 ton. Angka pastinya berbeda per unit dan tercetak pada pelat CSC di daun pintu. Perlu diingat juga bahwa payload kontainer bukan izin muat di jalan, yang berlaku adalah yang terendah di antara rating kontainer, rating chassis, dan JBKI yang diizinkan.",
    },
    {
      q: "Apa beda 40 ft standar dan 40 ft high cube?",
      a: "High cube lebih tinggi sekitar 30 sentimeter, memberi tambahan sekitar sembilan meter kubik dengan batas berat yang praktis sama. Tinggi totalnya menjadi sekitar 2,90 meter tergantung unit, sehingga perlu dipastikan rute darat dan pintu gudang tujuan memungkinkan.",
    },
    {
      q: "Kenapa kontainer reefer lebih kecil dari kontainer biasa?",
      a: "Karena unit refrigerasi dan insulasi dinding memakan ruang dalam. Reefer 20 kaki hanya sekitar 28 meter kubik dibanding sekitar 33 meter kubik pada dry container dengan panjang luar yang sama.",
    },
  ],
  faqEn: [
    {
      q: "What are the internal dimensions of a 20-foot container?",
      a: "Around 5.90 x 2.35 x 2.39 meters, with a nominal capacity of roughly 33 cubic meters. The door opening is narrower than the internal width, around 2.34 x 2.28 meters, and that opening is often the real constraint for oversized cargo.",
    },
    {
      q: "How many CBM fit in a 40 ft container?",
      a: "Nominal capacity is around 67 cubic meters for the standard type and around 76 cubic meters for high cube. In practice, plan on roughly 85 percent of that figure — about 57 and 65 cubic meters — because carton stacking almost never gets that tight.",
    },
    {
      q: "What is the maximum payload of a 20 ft container?",
      a: "Around 28.2 tons, from a maximum gross weight of 30,480 kg minus a tare weight of roughly 2.28 tons. The exact figure differs per unit and is stamped on the CSC plate on the door leaf. It's also worth remembering that container payload is not the same as the road load permit — what applies is whichever is lowest among the container rating, the chassis rating, and the permitted JBKI.",
    },
    {
      q: "What's the difference between a standard 40 ft and a 40 ft high cube?",
      a: "High cube is about 30 centimeters taller, adding roughly nine cubic meters at practically the same weight limit. Overall height comes to around 2.90 meters depending on the unit, so the inland route and the destination warehouse door need to be confirmed as clear before booking.",
    },
    {
      q: "Why is a reefer container smaller than a standard container?",
      a: "Because the refrigeration unit and wall insulation eat into internal space. A 20-foot reefer holds only around 28 cubic meters against roughly 33 cubic meters for a dry container of the same external length.",
    },
  ],
  sources: [
    { label: "Spesifikasi equipment operator pelayaran", detail: "Dimensi dalam, kubikasi, berat kosong, dan payload untuk kontainer 20 dan 40 kaki, high cube, reefer, open top, serta flat rack." },
    { label: "Konvensi CSC", detail: "Pelat pada daun pintu kontainer yang memuat berat kotor maksimum unit tersebut, satu-satunya angka berat yang mengikat." },
  ],
  sourcesEn: [
    { label: "Shipping line equipment specifications", detail: "Internal dimensions, cubic capacity, tare weight, and payload for 20- and 40-foot containers, high cube, reefer, open top, and flat rack." },
    { label: "CSC Convention", detail: "The plate on the container door leaf listing the unit's maximum gross weight, the only binding weight figure." },
  ],
  relatedArticles: ["demurrage-detention-pelabuhan", "margin-per-job-forwarder", "dokumen-kepabeanan-arsip-digital"],
  relatedTools: ["kalkulator-cbm", "kalkulator-demurrage", "kamus-logistik"],
};

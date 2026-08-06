import type { Tool } from "./types";

export const tool: Tool = {
  slug: "jenis-truk-indonesia",
  kind: "referensi",
  title: "Jenis Truk di Indonesia dan Kapasitasnya: 61 Kelas Armada dari Pickup sampai Trailer",
  titleEn: "Types of Trucks in Indonesia and Their Capacity: 61 Fleet Classes from Pickup to Trailer",
  metaTitle: "Jenis Truk & Kapasitas Muatan Indonesia: CDE, CDD, Fuso, Tronton | CargoGrid",
  description:
    "Truk apa yang cocok untuk muatan Anda, CDD, fuso, atau tronton? Referensi ini membandingkan ukuran bak dan kapasitas berat dari 61 kelas armada yang beroperasi di Indonesia, lengkap dengan ilustrasinya.",
  descriptionEn:
    "Which truck fits your cargo, CDD, Fuso, or Tronton? This reference compares cargo bed dimensions and weight capacity across 61 fleet classes operating in Indonesia, with an illustration for each.",
  keywords: [
    "jenis truk di indonesia",
    "kapasitas truk CDD",
    "ukuran bak truk CDE",
    "perbedaan CDD dan fuso",
    "kapasitas tronton",
    "ukuran truk wingbox",
  ],
  summary:
    "Enam puluh satu kelas armada yang beroperasi di Indonesia, dari pickup, CDE, CDD, fuso, dan tronton sampai rangkaian trailer, lowbed, dan angkutan alat berat, lengkap dengan ukuran ruang muat, perkiraan kapasitas, serta golongan tol dan penyeberangannya.",
  summaryEn:
    "Sixty-one fleet classes operating in Indonesia, from pickup, CDE, CDD, Fuso, and Tronton through trailer combinations, lowbeds, and heavy-equipment carriers, with cargo bed dimensions, estimated capacity, and toll and ferry classification for each.",
  searchIntents: [
    "Jenis truk di Indonesia dan kapasitas angkutnya",
    "Ukuran bak dalam truk CDE, CDD, dan Fuso",
    "Perbedaan CDD dan CDD long",
    "Truk apa yang cocok untuk muatan sekian ton",
    "Kapasitas kubikasi tronton dan wingbox",
  ],
  searchIntentsEn: [
    "Types of trucks in Indonesia and their load capacity",
    "Interior cargo bed dimensions of CDE, CDD, and Fuso trucks",
    "Difference between CDD and CDD long",
    "Which truck fits a given tonnage of cargo",
    "Cubic capacity of Tronton and wingbox trucks",
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
      text: "Daftar di halaman ini adalah referensi praktis untuk menyortir kelas armada dengan cepat, bukan standar resmi dan bukan pengganti spesifikasi unit yang sebenarnya. Sebelum memesan satu unit tertentu, cocokkan dulu dimensi bak, JBI, dan foto kendaraannya dengan operator atau vendor karoseri terkait. Untuk armada tetap, mengukur sendiri bak setiap unit adalah pekerjaan setengah hari yang manfaatnya bertahan bertahun-tahun.",
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
      text: "Dua angka golongan pada tiap kelas armada biasanya yang paling menentukan saat menghitung biaya rute, karena keduanya langsung memengaruhi tarif tol dan tarif penyeberangan. Yang perlu diingat: keduanya memakai dasar yang berbeda. Golongan tol mengikuti jumlah gandar, golongan penyeberangan mengikuti panjang keseluruhan kendaraan.",
    },
    {
      type: "p",
      text: "Akibatnya, truk bergandar dua yang berbadan panjang bisa masuk golongan penyeberangan lebih tinggi daripada truk bergandar tiga yang pendek, sekalipun golongan tolnya justru lebih rendah. Menghitung biaya kapal memakai golongan tol akan meleset, dan biasanya ke arah yang merugikan.",
    },
    {
      type: "h2",
      id: "dua-batas",
      text: "Volume dan berat: hampir tidak pernah habis bersamaan",
    },
    {
      type: "p",
      text: "Perhatikan kolom perkiraan volume dan kolom perkiraan muatan secara berpasangan. CDE long menawarkan sekitar 14 meter kubik berbanding 8 meter kubik pada CDE pendek, dengan perkiraan muatan yang praktis sama, pilihan tepat untuk barang ringan bervolume seperti kemasan plastik, foam, atau tekstil, dan pilihan yang sia-sia untuk barang padat.",
    },
    {
      type: "p",
      text: "Pola yang sama berulang di seluruh daftar, dan puncaknya pada trailer: satu unit 40 kaki punya ruang dua kali lipat 20 kaki tetapi tidak dua kali lipat kapasitas beratnya. Untuk muatan padat, dua unit 20 kaki kerap mengangkut tonase lebih banyak.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Kapasitas bak bukan izin mengangkut",
      body: "Yang menentukan sah atau tidaknya sebuah muatan adalah JBI, yaitu batas berat yang diizinkan untuk kelas jalan yang dilewati, dan angkanya bisa lebih rendah daripada JBB pabrikan. Truk yang sama bisa sah membawa satu tonase di satu rute dan melanggar di rute lain, dengan bak yang sama sekali tidak berubah.",
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
      text: "Penghematannya jarang muncul dalam perbandingan tarif sewa, karena yang berkurang adalah waktu tunggu di halaman gudang, yaitu biaya yang ditanggung tetapi tidak pernah ditagihkan sebagai satu baris. Pada operasi dengan rit padat, waktu muat yang lebih pendek berarti satu rit tambahan per hari, dan itu jauh melampaui selisih tarifnya.",
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
        "Muatan di bawah sekitar 250 kg per meter kubik akan menghabiskan ruang lebih dulu, jadi cari bak yang besar, bukan sumbu yang banyak.",
        "Muatan di atas sekitar 400 kg per meter kubik akan menghabiskan berat lebih dulu, jadi cari kapasitas berat, dan abaikan sisa ruang yang menganggur.",
        "Periksa golongan tol dan golongan penyeberangan pada tiap kelas armada. Keduanya masuk ke biaya rute, dan keduanya memakai dasar penggolongan yang berbeda.",
        "Periksa akses di lokasi bongkar sebelum memesan. Tronton yang tidak bisa masuk gang jauh lebih mahal daripada dua CDD yang bisa.",
      ],
    },
  ],
  blocksEn: [
    {
      type: "h2",
      id: "kenapa-rentang",
      text: "Why the Figures Are Ranges, Not Specifications",
    },
    {
      type: "p",
      text: "Cargo bed dimensions come from the body builder (karoseri), not the chassis manufacturer. Two trucks with an identical badge can differ in bed height by twenty centimeters, and twenty centimeters is one full stack of cartons. Weight capacity likewise depends on the vehicle's own tare weight, which varies from body to body.",
    },
    {
      type: "p",
      text: "The list on this page is a practical reference for sorting fleet classes quickly, not an official standard and not a substitute for an actual unit specification. Before booking a specific unit, verify the bed dimensions, JBI, and vehicle photos with the operator or the relevant body-builder. For a permanent fleet, measuring each unit's bed yourself is half a day's work whose payoff lasts for years.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Market Names Are Not Capacity Classes",
      body: "CDE, CDD, Fuso, Tronton, Trintin, and wingbox are trade names that grew up in the field, not categories defined in regulation. No single payload figure attaches to any of them. Two trucks both called CDD can differ in legal payload by more than one ton because of different bodies and different JBI ratings. Every figure on this page is a planning estimate; the binding figures exist only in the STNK, the periodic inspection (uji berkala) result, and the JBI of the specific unit.",
    },
    {
      type: "h2",
      id: "golongan",
      text: "The Toll Class and Ferry Class Columns",
    },
    {
      type: "p",
      text: "The two classification figures for each fleet class are usually what matters most when costing a route, because both directly affect toll fares and ferry fares. What's worth remembering: the two use different bases. Toll class follows the number of axles; ferry class follows the vehicle's overall length.",
    },
    {
      type: "p",
      text: "As a result, a long-bodied two-axle truck can fall into a higher ferry class than a short three-axle truck, even though its toll class is actually lower. Costing ferry fares using the toll class will produce the wrong figure, usually to your disadvantage.",
    },
    {
      type: "h2",
      id: "dua-batas",
      text: "Volume and Weight: Almost Never Exhausted Together",
    },
    {
      type: "p",
      text: "Read the estimated volume column and the estimated payload column as a pair. CDE long offers about 14 cubic meters against 8 cubic meters for the short CDE, with practically the same estimated payload -- the right choice for light, bulky goods such as plastic packaging, foam, or textiles, and a wasted choice for dense cargo.",
    },
    {
      type: "p",
      text: "The same pattern repeats throughout the list, peaking with trailers: a single 40-foot unit has twice the space of a 20-foot unit but not twice the weight capacity. For dense cargo, two 20-foot units often carry more tonnage.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Bed Capacity Is Not a Carrying Permit",
      body: "What determines whether a load is legal is the JBI, the permitted weight limit for the road class being used, and this figure can be lower than the manufacturer's JBB. The same truck can legally carry a given tonnage on one route and be in violation on another, with the bed itself completely unchanged.",
    },
    {
      type: "h2",
      id: "wingbox",
      text: "Wingbox: What You're Actually Buying Is Time, Not Space",
    },
    {
      type: "p",
      text: "Side walls that open fully let a forklift load from the side, instead of pushing cargo down the bed from the rear door. For palletized cargo, this cuts loading time drastically.",
    },
    {
      type: "p",
      text: "The savings rarely show up in a rental-rate comparison, because what's reduced is dwell time in the warehouse yard, a cost that is borne but never billed as its own line item. On operations running tight trip schedules, shorter loading time means one additional trip per day, which far outweighs the difference in rate.",
    },
    {
      type: "h2",
      id: "memilih",
      text: "A Quick Way to Choose a Fleet Class",
    },
    {
      type: "ol",
      items: [
        "Calculate total cubic volume and total cargo weight first. Both, not just one.",
        "Divide weight by cubic volume to get cargo density in kg per cubic meter.",
        "Cargo below roughly 250 kg per cubic meter will run out of space before weight, so look for a large bed, not more axles.",
        "Cargo above roughly 400 kg per cubic meter will run out of weight before space, so look for weight capacity, and disregard the unused remaining space.",
        "Check the toll class and the ferry class for each fleet class. Both feed into route cost, and both use a different classification basis.",
        "Check access at the unloading site before booking. A Tronton that can't fit into the alley costs far more than two CDDs that can.",
      ],
    },
  ],
  faq: [
    {
      q: "Kenapa tidak ada angka payload pasti untuk CDD atau tronton?",
      a: "Karena keduanya sebutan pasar, bukan kategori hukum. Payload legal sebuah unit adalah JBI yang berlaku dikurangi berat kosongnya setelah karoseri terpasang, dan keduanya berbeda antar unit. Referensi yang memberi satu angka pasti untuk sebutan pasar sedang menjanjikan kepastian yang tidak dimilikinya.",
    },
    {
      q: "Apa beda CDE dan CDD?",
      a: "CDE adalah truk ringan dengan roda belakang tunggal, bak sekitar 3 x 1,7 x 1,7 meter atau kira-kira 8 meter kubik, dengan perkiraan muatan 1,8 sampai 2,8 ton. CDD berroda belakang ganda pada sumbu yang sama, bak sekitar 4,5 x 2,0 x 2,0 meter atau kira-kira 18 meter kubik, dengan perkiraan muatan 3,5 sampai 5,5 ton. Keduanya sama-sama bergandar dua, yang berbeda jumlah rodanya, bukan jumlah sumbunya.",
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
      a: "Yang perlu dicari adalah ruang, bukan kapasitas berat. CDE long, CDD long, dan wingbox memberi kubikasi jauh lebih besar tanpa kenaikan biaya yang sebanding, CDE long misalnya menawarkan sekitar 14 meter kubik berbanding 8 meter kubik pada CDE pendek, dengan perkiraan muatan yang praktis sama. Batas beratnya memang tidak akan tersentuh oleh barang seringan itu.",
    },
    {
      q: "Apakah kapasitas pada halaman ini boleh dipakai sebagai batas muat?",
      a: "Tidak. Angka di halaman ini adalah kapasitas khas untuk memilih kelas armada. Batas yang mengikat secara hukum adalah JBI kendaraan pada rute yang dilalui, dan itu harus dibaca dari dokumen kendaraan serta ketentuan kelas jalan setempat.",
    },
  ],
  faqEn: [
    {
      q: "Why isn't there a fixed payload figure for CDD or Tronton?",
      a: "Because both are market names, not legal categories. A unit's legal payload is its applicable JBI minus its tare weight once the body is fitted, and both figures vary from unit to unit. A reference that gives one fixed figure for a market name is promising a certainty it doesn't have.",
    },
    {
      q: "What is the difference between CDE and CDD?",
      a: "CDE is a light truck with single rear wheels, a bed of roughly 3 x 1.7 x 1.7 meters or about 8 cubic meters, and an estimated payload of 1.8 to 2.8 tons. CDD has dual rear wheels on the same axle, a bed of roughly 4.5 x 2.0 x 2.0 meters or about 18 cubic meters, and an estimated payload of 3.5 to 5.5 tons. Both are two-axle trucks; what differs is the wheel count, not the axle count.",
    },
    {
      q: "What is the capacity of a Fuso-class truck?",
      a: "The two-axle medium truck commonly called Fuso typically has a bed of roughly 6.0 x 2.3 x 2.3 meters, about 30 to 34 cubic meters, with an estimated payload of 6 to 10 tons. Fuso is a name derived from a brand, not a capacity class, so the exact figures depend on the body and the unit's JBI rating.",
    },
    {
      q: "What is the cubic capacity of Tronton and wingbox trucks?",
      a: "The three-axle Tronton has a bed of roughly 8.5 x 2.4 x 2.5 meters, about 48 to 55 cubic meters, with an estimated payload of 10 to 16 tons. The two-axle wingbox is smaller, around 40 to 45 cubic meters. A wingbox on a trailer combination is far larger still, around 75 to 90 cubic meters with a payload of 18 to 28 tons.",
    },
    {
      q: "Which truck is best suited for light, high-volume cargo?",
      a: "What you need is space, not weight capacity. CDE long, CDD long, and wingbox offer far greater cubic volume without a proportional increase in cost -- CDE long, for example, offers about 14 cubic meters against 8 cubic meters for the short CDE, with practically the same estimated payload. The weight limit simply won't be reached by cargo that light.",
    },
    {
      q: "Can the capacities on this page be used as loading limits?",
      a: "No. The figures on this page are typical capacities for choosing a fleet class. The legally binding limit is the vehicle's JBI on the route being used, and that must be read from the vehicle's documents and the applicable local road-class regulations.",
    },
  ],
  sources: [
    { label: "PP 55/2012", detail: "Kategori kendaraan barang N1/N2/N3, kategori kereta gandengan, batas dimensi, serta konsep JBB dan JBI." },
    { label: "Kepmen PUPR 176/KPTS/M/2025", detail: "Penggolongan kendaraan di jalan tol, Golongan I sampai V." },
    { label: "Ketentuan penyeberangan ASDP", detail: "Penggolongan kendaraan penyeberangan Golongan I sampai IX berdasarkan fungsi dan panjang keseluruhan." },
    { label: "Spesifikasi resmi pabrikan", detail: "Rentang GVW dan GCW dari Mitsubishi Fuso, Isuzu, Hino, UD Trucks, Suzuki, Toyota, dan pabrikan trailer khusus." },
  ],
  sourcesEn: [
    { label: "PP 55/2012", detail: "Goods vehicle categories N1/N2/N3, trailer-combination categories, dimension limits, and the JBB and JBI concepts." },
    { label: "Kepmen PUPR 176/KPTS/M/2025", detail: "Toll road vehicle classification, Class I through V." },
    { label: "ASDP Ferry Crossing Regulations", detail: "Ferry vehicle classification, Class I through IX, based on function and overall length." },
    { label: "Official Manufacturer Specifications", detail: "GVW and GCW ranges from Mitsubishi Fuso, Isuzu, Hino, UD Trucks, Suzuki, Toyota, and specialized trailer manufacturers." },
  ],
  relatedArticles: ["odol-timbangan-jembatan-muatan-lebih", "perawatan-armada-preventif-vs-reaktif", "manajemen-vendor-subkontraktor"],
  relatedTools: ["kalkulator-muatan-truk", "kalkulator-cbm", "kamus-logistik"],
};

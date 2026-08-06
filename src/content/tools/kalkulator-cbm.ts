import type { Tool } from "./types";

export const tool: Tool = {
  slug: "kalkulator-cbm",
  kind: "kalkulator",
  title: "Kalkulator CBM, Berat Volumetrik, dan Chargeable Weight",
  titleEn: "CBM, Volumetric Weight, and Chargeable Weight Calculator",
  metaTitle: "Kalkulator CBM & Berat Volumetrik: Hitung Chargeable Weight | CargoGrid",
  description:
    "Berat aktual atau berat volumetrik yang menentukan tagihan kiriman Anda? Dari panjang, lebar, dan tinggi kardus, kalkulator ini menghitung CBM lalu menunjukkan mana yang lebih besar.",
  descriptionEn:
    "Does actual weight or volumetric weight determine your shipment's freight charge? From the length, width, and height of your cartons, this calculator computes CBM and then shows you which one is greater.",
  keywords: [
    "kalkulator CBM",
    "cara hitung CBM",
    "rumus CBM",
    "berat volumetrik",
    "chargeable weight",
    "hitung kubikasi barang",
    "konversi CBM ke kg",
  ],
  summary:
    "Masukkan panjang, lebar, tinggi, dan jumlah kardus. Kalkulator ini menghitung kubikasinya, mengubahnya menjadi berat volumetrik sesuai moda yang dipakai, lalu menunjukkan berat mana yang biasanya dipakai untuk menagih, berikut alasannya.",
  summaryEn:
    "Enter the length, width, height, and number of cartons. This calculator computes the cubic volume, converts it to volumetric weight for the mode you're using, then shows which weight is typically used for billing, and why.",
  searchIntents: [
    "Cara menghitung CBM dari ukuran kardus",
    "Rumus berat volumetrik untuk kargo udara",
    "1 CBM berapa kg untuk pengiriman laut LCL",
    "Kenapa tagihan memakai berat volumetrik, bukan berat timbangan",
    "Konversi CBM ke kilogram",
  ],
  searchIntentsEn: [
    "How to calculate CBM from carton dimensions",
    "Volumetric weight formula for air cargo",
    "1 CBM equals how many kg for LCL sea freight",
    "Why freight is billed on volumetric weight instead of actual weight",
    "Converting CBM to kilograms",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "rumus",
      text: "Rumusnya, dan kenapa jawabannya bisa berbeda-beda",
    },
    {
      type: "p",
      text: "CBM adalah volume dalam meter kubik: **panjang x lebar x tinggi**, semuanya dalam meter. Kardus berukuran 100 x 50 x 40 sentimeter berarti 1 x 0,5 x 0,4 meter, atau 0,2 CBM. Sampai di sini tidak ada yang membingungkan, dan bukan bagian ini yang membuat orang mencari kalkulator.",
    },
    {
      type: "p",
      text: "Yang membingungkan adalah langkah berikutnya. Volume itu harus diubah menjadi berat sebelum bisa dipakai menagih, dan angka penukarnya berbeda-beda menurut moda. Laut LCL menyetarakan 1 CBM dengan 1.000 kg. Kargo udara memakai rumus yang tampak sama sekali lain: panjang kali lebar kali tinggi dalam sentimeter, dibagi 6.000, angka pembagi yang paling umum dipakai (gaya IATA) meski bukan satu-satunya yang berlaku di lapangan.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Keduanya sebenarnya rumus yang sama",
      body: "Satu meter kubik adalah 1.000.000 sentimeter kubik. Membaginya dengan 6.000 sama saja dengan mengalikannya dengan 166,67 kg per CBM. Jadi divisor 6.000 dan aturan 1 CBM = 1.000 kg bukan dua sistem yang berbeda; keduanya menyatakan hal yang persis sama, hanya dengan angka penukar yang berbeda. Laut menghargai volume enam kali lebih longgar daripada udara.",
    },
    {
      type: "table",
      caption: "Angka penukar volume ke berat yang umum dipakai menurut moda",
      head: ["Moda", "Ditulis sebagai", "Setara dengan"],
      rows: [
        ["Laut LCL", "1 CBM = 1.000 kg", "1.000 kg per CBM"],
        ["Udara (IATA)", "P x L x T (cm) / 6.000", "166,67 kg per CBM"],
        ["Kurir internasional", "P x L x T (cm) / 5.000", "200 kg per CBM"],
        ["Darat domestik", "Bervariasi per operator", "Umumnya 250-333 kg per CBM"],
      ],
    },
    {
      type: "p",
      text: "Divisor 6.000 di atas pun bukan angka baku yang berlaku di semua tempat: sejumlah maskapai dan forwarder membulatkan dimensi atau memakai divisor lain untuk servis tertentu, jadi anggap itu titik awal, bukan kepastian. Angka darat malah tidak punya konvensi tunggal sama sekali: selisih antara 250 dan 333 kg per CBM adalah 33 persen pada kardus yang sama persis. Kalkulator ini memberi 250 sebagai titik awal, tetapi yang benar-benar mengikat hanyalah tarif sheet atau kontrak dari operator yang Anda pakai.",
    },
    {
      type: "h2",
      id: "chargeable-weight",
      text: "Chargeable weight: yang lebih besar antara dua berat",
    },
    {
      type: "p",
      text: "Setelah berat volumetrik didapat, penagihan memakai yang lebih besar antara berat itu dan berat timbangan sesungguhnya. Logikanya bukan kesewenangan: ruang di dalam kapal dan pesawat terbatas, dan kardus styrofoam yang ringan tetap memakan tempat yang bisa diisi barang lain.",
    },
    {
      type: "p",
      text: "Konsekuensi praktisnya, ada satu angka kepadatan yang menentukan nasib setiap kiriman. Untuk kargo udara angkanya 166,67 kg per CBM. Muatan yang lebih padat dari itu ditagih menurut timbangan; yang lebih ringan ditagih menurut volumenya. Kalkulator di atas menampilkan kepadatan muatan Anda tepat di sebelah angka ambang itu, karena begitu Anda tahu berada di sisi mana, Anda tahu apa yang perlu diperbaiki.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Contoh: kapan mengganti kemasan itu terbayar",
      body: "Sepuluh kardus 100 x 50 x 40 cm berisi barang seberat 15 kg masing-masing. Volumenya 2 CBM, beratnya 150 kg. Lewat udara, berat volumetriknya 333 kg, lebih dari dua kali berat aslinya, dan itulah yang ditagih. Memadatkan isi yang sama ke dalam kardus 80 x 45 x 35 cm menurunkan volume ke 1,26 CBM dan berat tertagih ke 210 kg. Berat barangnya tidak berubah sedikit pun; yang berubah cuma udara yang ikut dikirim.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Contoh lain: kiriman yang sama, angka tertagih beda-beda tiap moda",
      body: "Ambil kiriman 5 CBM dengan berat aktual 800 kg. Lewat laut LCL, volumetriknya 5.000 kg, jauh di atas berat aktual, jadi itu yang tertagih. Lewat udara (divisor 6.000), volumetriknya cuma 833 kg, menang tipis atas berat aktual. Lewat kurir internasional (divisor 5.000), naik lagi ke 1.000 kg. Lewat darat, tergantung rate card operator, bisa 1.250 sampai 1.665 kg. Fisik kirimannya sama persis dari awal sampai akhir; yang berubah cuma angka penukar yang dipakai tiap moda. Karena itu tarif antarmoda tidak bisa dibandingkan langsung dari harga per kg begitu saja. Hitung dulu berat tertagihnya masing-masing, dan cocokkan divisor yang dipakai kalkulator ini dengan tarif sheet operator Anda.",
    },
    {
      type: "h2",
      id: "kesalahan-umum",
      text: "Tiga kesalahan yang paling sering muncul",
    },
    {
      type: "ol",
      items: [
        "**Menjumlahkan chargeable weight per baris.** Pengangkut menagih satu kiriman, bukan satu kardus. Kardus padat dan kardus ringan dalam satu booking saling menutupi, sehingga perbandingan berat aktual dan volumetrik dilakukan sekali pada totalnya. Menghitung per baris lalu menjumlahkannya menghasilkan tagihan yang lebih besar dari yang sebenarnya. Ini kesalahan spreadsheet yang paling sering ditemukan dalam penawaran.",
        "**Memakai ukuran barang, bukan ukuran kemasan luar.** Yang diukur adalah kardus terluar, termasuk palet bila barang dipaletkan. Palet menambah sekitar 15 sentimeter tinggi yang ikut ditagih.",
        "**Mencampur satuan.** Dimensi dalam sentimeter dimasukkan ke rumus yang mengharapkan meter menghasilkan angka yang meleset sejuta kali lipat, dan anehnya kesalahan ini sering lolos karena hasilnya jelas-jelas salah sehingga orang mengoreksinya secara naluriah, sampai suatu hari tidak.",
      ],
    },
    {
      type: "h2",
      id: "setelah-angkanya-dapat",
      text: "Setelah angkanya dapat, ke mana perginya",
    },
    {
      type: "p",
      text: "Menghitung CBM adalah pekerjaan sepuluh detik. Yang memakan waktu adalah apa yang terjadi sesudahnya: angka itu disalin ke penawaran, penawaran disalin ke booking, booking disalin ke shipping instruction, dan setiap penyalinan adalah kesempatan baru untuk keliru. Ketika volume yang dipesan berbeda dari volume yang dimuat, selisihnya baru muncul pada invoice pengangkut berminggu-minggu kemudian, saat tidak ada lagi yang ingat kiriman mana yang dimaksud.",
    },
    {
      type: "p",
      text: "Itu persoalan pencatatan, bukan persoalan aritmetika, dan tidak ada kalkulator yang bisa menyelesaikannya. Yang menyelesaikannya adalah satu tempat penyimpanan dimensi kiriman yang dipakai bersama oleh penawaran, operasional, dan penagihan.",
    },
  ],
  blocksEn: [
    {
      type: "h2",
      id: "rumus",
      text: "The formula, and why the answer can vary",
    },
    {
      type: "p",
      text: "CBM is volume in cubic meters: **length x width x height**, all in meters. A carton measuring 100 x 50 x 40 centimeters is 1 x 0.5 x 0.4 meters, or 0.2 CBM. Nothing confusing here, and this isn't the part that sends people looking for a calculator.",
    },
    {
      type: "p",
      text: "The confusing part is the next step. That volume has to be converted to weight before it can be used for billing, and the conversion factor varies by mode. LCL sea freight equates 1 CBM to 1,000 kg. Air cargo uses a formula that looks completely different: length times width times height in centimeters, divided by 6,000, the divisor most commonly used (IATA-style), though not the only one applied in practice.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Both are actually the same formula",
      body: "One cubic meter is 1,000,000 cubic centimeters. Dividing by 6,000 is the same as multiplying by 166.67 kg per CBM. So the 6,000 divisor and the 1 CBM = 1,000 kg rule aren't two different systems; they express exactly the same thing, just with different conversion factors. Sea freight values volume six times more generously than air.",
    },
    {
      type: "table",
      caption: "Common volume-to-weight conversion factors by mode",
      head: ["Mode", "Written as", "Equivalent to"],
      rows: [
        ["Sea LCL", "1 CBM = 1,000 kg", "1,000 kg per CBM"],
        ["Air (IATA)", "L x W x H (cm) / 6,000", "166.67 kg per CBM"],
        ["International courier", "L x W x H (cm) / 5,000", "200 kg per CBM"],
        ["Domestic road", "Varies by operator", "Typically 250-333 kg per CBM"],
      ],
    },
    {
      type: "p",
      text: "That 6,000 divisor isn't a universal standard either: some airlines and forwarders round dimensions or use a different divisor for certain services, so treat it as a starting point, not a certainty. The road figure has no single convention at all: the difference between 250 and 333 kg per CBM is 33 percent on the exact same carton. This calculator uses 250 as a starting point, but what actually binds you is the rate sheet or contract from the operator you're using.",
    },
    {
      type: "h2",
      id: "chargeable-weight",
      text: "Chargeable weight: whichever of the two weights is greater",
    },
    {
      type: "p",
      text: "Once volumetric weight is calculated, billing uses whichever is greater: that weight or the actual scale weight. The logic isn't arbitrary: space on ships and aircraft is limited, and a light styrofoam carton still takes up room that could hold something else.",
    },
    {
      type: "p",
      text: "In practice, one density figure decides every shipment's fate. For air cargo that figure is 166.67 kg per CBM. Cargo denser than that is billed on actual weight; lighter cargo is billed on volume. The calculator above shows your cargo's density right next to that threshold, because once you know which side you're on, you know what needs fixing.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Example: when repacking pays off",
      body: "Ten cartons, 100 x 50 x 40 cm each, holding goods weighing 15 kg each. That's 2 CBM in volume and 150 kg in weight. By air, the volumetric weight is 333 kg, more than double the actual weight, and that's what gets billed. Repacking the same contents into 80 x 45 x 35 cm cartons brings the volume down to 1.26 CBM and the billed weight down to 210 kg. The weight of the goods hasn't changed at all; what changed is how much air is being shipped along with them.",
    },
    {
      type: "callout",
      tone: "example",
      title: "Another example: same shipment, different billed weight per mode",
      body: "Take a 5 CBM shipment with an actual weight of 800 kg. By sea LCL, the volumetric weight is 5,000 kg, far above the actual weight, so that's what gets billed. By air (6,000 divisor), the volumetric weight is only 833 kg, edging out the actual weight by a small margin. By international courier (5,000 divisor), it rises further to 1,000 kg. By road, depending on the operator's rate card, it could be 1,250 to 1,665 kg. The physical shipment is identical from start to finish; only the conversion factor applied per mode changes. That's why rates across modes can't be compared directly on a per-kg basis. Calculate the billed weight for each mode first, and match the divisor this calculator uses against your operator's rate sheet.",
    },
    {
      type: "h2",
      id: "kesalahan-umum",
      text: "The three most common mistakes",
    },
    {
      type: "ol",
      items: [
        "**Summing chargeable weight line by line.** The carrier bills one shipment, not one carton. Dense cartons and light cartons within a single booking offset each other, so the actual-versus-volumetric comparison is done once on the total, not per line. Calculating per line and then adding them up produces a higher bill than what's actually owed. This is the most common spreadsheet mistake found in quotations.",
        "**Using the goods' dimensions instead of the outer packaging's.** What gets measured is the outermost carton, including the pallet if the goods are palletized. A pallet adds roughly 15 centimeters of height that gets billed along with it.",
        "**Mixing units.** Entering centimeter dimensions into a formula that expects meters produces a result off by a factor of a million, and oddly enough this mistake often slips through because the result is so obviously wrong that people correct it instinctively, until the day they don't.",
      ],
    },
    {
      type: "h2",
      id: "setelah-angkanya-dapat",
      text: "After you have the number, where it goes",
    },
    {
      type: "p",
      text: "Calculating CBM is a ten-second task. What takes time is what happens after: the number gets copied into a quotation, the quotation gets copied into a booking, the booking gets copied into a shipping instruction, and each copy is a fresh chance to get it wrong. When the volume booked differs from the volume loaded, the discrepancy only surfaces on the carrier's invoice weeks later, by which point nobody remembers which shipment it was.",
    },
    {
      type: "p",
      text: "That's a record-keeping problem, not an arithmetic problem, and no calculator can solve it. What solves it is a single source of shipment dimensions shared across quotation, operations, and billing.",
    },
  ],
  faq: [
    {
      q: "1 CBM berapa kg?",
      a: "Tergantung modanya. Laut LCL menyetarakan 1 CBM dengan 1.000 kg, kargo udara umumnya dengan 166,67 kg (divisor 6.000, gaya IATA), kurir internasional dengan 200 kg (divisor 5.000), dan angkutan darat domestik umumnya 250 sampai 333 kg tergantung operator. Angka-angka ini bukan konversi fisika, melainkan konvensi penagihan yang bisa berbeda antaroperator; yang mengikat tetap tarif resmi dari carrier yang Anda pakai.",
    },
    {
      q: "Bagaimana rumus menghitung CBM?",
      a: "Panjang x lebar x tinggi, ketiganya dalam meter, dikali jumlah kemasan. Bila dimensinya dalam sentimeter, bagi hasilnya dengan 1.000.000. Contoh: kardus 100 x 50 x 40 cm adalah 0,2 CBM per kardus.",
    },
    {
      q: "Apa bedanya berat volumetrik dan chargeable weight?",
      a: "Berat volumetrik adalah volume yang sudah diubah menjadi setara berat. Chargeable weight adalah yang benar-benar dipakai menagih, yaitu mana yang lebih besar antara berat volumetrik dan berat timbangan sesungguhnya.",
    },
    {
      q: "Kenapa tagihan saya memakai berat yang jauh lebih besar dari timbangan?",
      a: "Karena muatan Anda lebih ringan daripada ambang kepadatan moda tersebut, sehingga ditagih berdasarkan ruang yang dipakainya. Untuk kargo udara, ambang yang umum dipakai adalah 166,67 kg per meter kubik, tergantung divisor yang berlaku di operator Anda. Barang di bawah kepadatan itu biasanya ditagih berdasarkan volume.",
    },
    {
      q: "Apakah palet ikut dihitung dalam CBM?",
      a: "Ya. Yang diukur adalah dimensi terluar kemasan sebagaimana diserahkan ke pengangkut. Bila barang dipaletkan, tinggi palet dan bagian yang menonjol ikut terhitung.",
    },
  ],
  faqEn: [
    {
      q: "1 CBM equals how many kg?",
      a: "It depends on the mode. LCL sea freight equates 1 CBM to 1,000 kg, air cargo generally to 166.67 kg (6,000 divisor, IATA-style), international courier to 200 kg (5,000 divisor), and domestic road transport generally 250 to 333 kg depending on the operator. These figures aren't physics conversions but billing conventions that can differ between operators; what's binding is always the official tariff from the carrier you're using.",
    },
    {
      q: "What is the formula for calculating CBM?",
      a: "Length x width x height, all three in meters, multiplied by the number of packages. If the dimensions are in centimeters, divide the result by 1,000,000. Example: a 100 x 50 x 40 cm carton is 0.2 CBM per carton.",
    },
    {
      q: "What's the difference between volumetric weight and chargeable weight?",
      a: "Volumetric weight is volume converted into a weight equivalent. Chargeable weight is what's actually used for billing, meaning whichever is greater between the volumetric weight and the actual scale weight.",
    },
    {
      q: "Why is my bill using a weight far higher than the scale weight?",
      a: "Because your cargo is lighter than that mode's density threshold, so it's billed based on the space it occupies. For air cargo, the commonly used threshold is 166.67 kg per cubic meter, depending on the divisor your operator applies. Goods below that density are typically billed on volume.",
    },
    {
      q: "Is the pallet included in the CBM calculation?",
      a: "Yes. What's measured is the outer dimensions of the packaging as handed over to the carrier. If the goods are palletized, the pallet's height and any protruding parts are included.",
    },
  ],
  relatedArticles: ["margin-per-job-forwarder", "alur-rfq-freight-forwarding", "rekonsiliasi-invoice-forwarder-terlambat"],
  relatedTools: ["ukuran-kontainer", "kalkulator-muatan-truk", "kamus-logistik"],
};

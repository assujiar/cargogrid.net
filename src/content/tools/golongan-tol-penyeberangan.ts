import type { Tool } from "./types";

export const tool: Tool = {
  slug: "golongan-tol-penyeberangan",
  kind: "referensi",
  title: "Golongan Tol, Golongan Penyeberangan, Kelas Jalan, dan Batas Dimensi",
  titleEn: "Toll Class, Ferry Class, Road Class, and Dimension Limits",
  metaTitle: "Golongan Tol & Penyeberangan Truk: Kelas Jalan dan Batas Dimensi | CargoGrid",
  description:
    "Truk Anda golongan tol berapa, dan golongan penyeberangan berapa? Referensi ini menjelaskan kenapa jawabannya bisa berbeda, sebab dasar penggolongan keduanya memang tidak sama.",
  descriptionEn:
    "What toll class is your truck, and what ferry class? This reference explains why the two answers can differ, because the classification basis behind each is not the same at all.",
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
  summaryEn:
    "Four rules that determine whether a load is allowed to move at all, and what the route will cost. All four are routinely conflated, even though each uses a completely different classification basis.",
  searchIntents: [
    "Truk saya masuk golongan tol berapa",
    "Golongan penyeberangan untuk trailer 40 kaki",
    "Batas lebar, panjang, dan tinggi truk yang diizinkan",
    "Beda JBB dan JBI",
    "Kelas jalan dan batas muatan sumbu terberat",
  ],
  searchIntentsEn: [
    "What toll class is my truck in",
    "Ferry class for a 40-foot trailer",
    "Permitted width, length, and height limits for trucks",
    "Difference between JBB and JBI",
    "Road class and maximum axle load limits",
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
      body: "CDD berroda enam tetapi bergandar dua, karena roda belakangnya ganda pada satu sumbu. Golongan tol menghitung gandar, bukan roda. Kekeliruan ini rutin membuat anggaran tol satu golongan lebih tinggi daripada yang sebenarnya dibayar. Yang menggolongkan di gerbang tol adalah konfigurasi gandar yang benar-benar terpasang pada kendaraan, bukan sebutan pasarnya seperti CDD atau tronton: dua truk dengan sebutan sama bisa digolongkan beda kalau sumbunya beda. Untuk unit yang konfigurasinya berada di dekat batas dua golongan, penilaian di lapangan bisa berbeda antar gerbang, jadi cocokkan dulu jumlah gandar dan data di STNK sebelum berasumsi soal golongannya.",
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
      text: "Kendaraan yang dimodifikasi melampaui ketentuan atau dimuati melebihi batas adalah persoalan ketidakpatuhan, bukan pilihan kelas armada. Ia tidak pantas diperlakukan sebagai opsi yang lebih murah dalam perencanaan.",
    },
    {
      type: "p",
      text: "Berbeda halnya dengan muatan yang memang berdimensi atau berbobot melebihi standar seperti alat berat, transformator, dan mesin produksi. Muatan seperti itu bisa diangkut secara sah dengan peralatan yang sesuai, kajian rute, izin, dan pengawalan bila disyaratkan. Yang pertama adalah pelanggaran; yang kedua adalah pekerjaan proyek dengan biaya dan persiapannya sendiri.",
    },
  ],
  blocksEn: [
    {
      type: "h2",
      id: "tiga-logika",
      text: "Three Classifications, Three Different Bases",
    },
    {
      type: "p",
      text: "The most common source of error in costing a route is treating all three as the same thing. Yet each one looks at the identical vehicle from a different angle.",
    },
    {
      type: "table",
      caption: "One vehicle, three ways to classify it",
      head: ["Classification", "Its basis", "What it determines"],
      rows: [
        ["Toll class", "Vehicle type and number of axles", "How many axles touch the road"],
        ["Ferry class", "Vehicle function and overall length", "How many meters of deck space it occupies"],
        ["Road class", "Vehicle dimensions and maximum axle load", "Which road sections it may use"],
      ],
    },
    {
      type: "p",
      text: "The practical consequence is real. A long-bodied two-axle truck can fall into a higher ferry class than a short three-axle truck, even though its toll class is actually lower. Costing ferry fares using the toll class will produce the wrong figure, and usually the wrong direction, to your disadvantage.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Number of Wheels Is Not Number of Axles",
      body: "A CDD has six wheels but only two axles, because its rear wheels are dual-mounted on a single axle. Toll class counts axles, not wheels. This mistake routinely inflates a toll budget by one class higher than what's actually paid. What classifies a vehicle at the toll gate is the axle configuration actually fitted to it, not its market name such as CDD or Tronton: two trucks with the same name can be classified differently if their axles differ. For a unit whose configuration sits close to the boundary between two classes, the assessment at the gate can vary between operators, so verify the axle count against the STNK before assuming its classification.",
    },
    {
      type: "h2",
      id: "tarif-tidak-di-sini",
      text: "Why the Fares Aren't on This Page",
    },
    {
      type: "p",
      text: "Classification is a durable category. Fares are not. Toll fares differ by road section and change on their effective dates; ferry fares differ by crossing and are adjusted periodically.",
    },
    {
      type: "p",
      text: "Publishing a single national fare figure here would mean publishing a number that goes wrong within months, and no one would know exactly when it started being wrong. What we provide here is the classification; pull the fare from the actual section and crossing being used, then enter it as an input in the operating cost calculator.",
    },
    {
      type: "h2",
      id: "jbb-jbi",
      text: "JBB and JBI: Two Figures Often Treated as the Same",
    },
    {
      type: "p",
      text: "JBB is the weight limit per the manufacturer's design. It's a technical rating: what the vehicle is engineered to bear. JBI is the permitted operating weight, which accounts for tare weight, dimensions and the fitted body, road class, and axle load. JBI is always less than or equal to JBB.",
    },
    {
      type: "p",
      text: "What determines a violation at the weighbridge is JBI, not JBB, and not the payload figure in a brochure either. The true legal payload is JBI minus the vehicle's tare weight once the body is fitted, minus crew, fuel, and equipment.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Which Is Why There's No Universal Payload Figure for CDD or Tronton",
      body: "Market names such as CDE, CDD, Fuso, Tronton, and wingbox are trade names, not legal categories, and no single capacity figure attaches to any of them. Two trucks with the same name can differ in legal payload by several tons, because of different bodies and different JBI ratings. Any table that gives one fixed figure for a market name is promising a certainty it doesn't have.",
    },
    {
      type: "h2",
      id: "mst",
      text: "MST Limits Per Axle, Not Total Weight",
    },
    {
      type: "p",
      text: "Maximum axle load (MST) sets how many tons a single axle may bear, and this is what gets missed most often. A truck can pass the total weight limit and still be in violation because its load is concentrated toward the rear, so one axle carries more than its share.",
    },
    {
      type: "p",
      text: "This means arranging cargo on the bed isn't just a matter of tidiness. Weight distribution along the bed determines whether the same vehicle with the exact same tonnage is legal or not.",
    },
    {
      type: "h2",
      id: "odol",
      text: "An Over-Modified Vehicle Is Not a Fleet Category",
    },
    {
      type: "p",
      text: "A vehicle modified beyond the regulations or loaded beyond its limit is a non-compliance problem, not a fleet-class choice. It doesn't deserve to be treated as a cheaper option in planning.",
    },
    {
      type: "p",
      text: "This is different from cargo that is genuinely oversized or overweight relative to the standard, such as heavy equipment, transformers, and production machinery. Cargo like that can be transported legally with the right equipment, a route survey, permits, and an escort where required. The first is a violation; the second is project work with its own cost and preparation.",
    },
  ],
  faq: [
    {
      q: "Truk CDD masuk golongan tol berapa?",
      a: "Umumnya Golongan II, karena bergandar dua. Roda belakangnya ganda pada satu sumbu, sehingga berroda enam tetapi tetap dua gandar. Tapi golongan tol menghitung gandar yang benar-benar terpasang, bukan sebutan CDD-nya: untuk unit modifikasi atau varian sumbu tiga, cocokkan dulu jumlah gandar dan data STNK sebelum menetapkan golongannya, karena gerbang tol yang memutuskan berdasarkan konfigurasi di lokasi.",
    },
    {
      q: "Rangkaian tractor head dengan trailer 40 kaki masuk golongan apa?",
      a: "Golongan tol V karena bergandar lima atau lebih, dan golongan penyeberangan IX karena panjang keseluruhannya di atas 16 meter. Itu untuk konfigurasi umum; dua penggolongan ini punya dasar berbeda dan keduanya perlu masuk perhitungan biaya rute. Untuk rangkaian dengan jumlah gandar atau panjang yang mepet ke batas golongan, cek ulang di STNK karena penilaian di gerbang atau dermaga bisa berbeda antar petugas.",
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
  faqEn: [
    {
      q: "What toll class is a CDD truck in?",
      a: "Generally Class II, because it has two axles. Its rear wheels are dual-mounted on a single axle, so it has six wheels but still only two axles. But toll class counts the axles actually fitted, not the CDD name: for a modified unit or a three-axle variant, verify the axle count and the STNK data before settling on a class, because the toll gate decides based on the configuration on site.",
    },
    {
      q: "What class is a tractor-head combination with a 40-foot trailer?",
      a: "Toll Class V because it has five or more axles, and Ferry Class IX because its overall length exceeds 16 meters. That's for the common configuration; the two classifications use different bases and both need to enter the route cost calculation. For a combination whose axle count or length sits close to a class boundary, verify against the STNK, because the assessment at the gate or the dock can vary between officers.",
    },
    {
      q: "What's the difference between JBB and JBI?",
      a: "JBB is the weight limit per the manufacturer's design. JBI is the permitted operating weight, accounting for tare weight, the fitted body, road class, and axle load. JBI is always less than or equal to JBB, and JBI is what determines a violation.",
    },
    {
      q: "What are the width and height limits for a goods vehicle?",
      a: "Maximum width of 2.5 meters and maximum height of 4.2 meters, with the added condition that height must not exceed 1.7 times the vehicle's width. Whichever figure is lower applies, so a narrow-bodied vehicle has a height limit below 4.2 meters.",
    },
    {
      q: "Why can the same truck be in violation on one route but not on another?",
      a: "Because what limits it is the road class. A Class I road permits a maximum axle load of 10 tons and a length of up to 18 meters, while Class III restricts width to 2.1 meters, length to 9 meters, and height to 3.5 meters. The vehicle itself doesn't change; the road section it travels on does.",
    },
  ],
  sources: [
    { label: "PP 55/2012", detail: "Batas panjang, lebar, tinggi, dan julur kendaraan, kategori kendaraan, serta konsep JBB dan JBI." },
    { label: "UU 22/2009", detail: "Kerangka kelas jalan dan angkutan barang khusus." },
    { label: "PP 79/2013 dan Permen PUPR 13/2024", detail: "Parameter kelas jalan dan muatan sumbu terberat, berikut mekanisme penetapannya." },
    { label: "Kepmen PUPR 176/KPTS/M/2025", detail: "Penggolongan kendaraan di jalan tol." },
    { label: "Permenhub 60/2019", detail: "Kerangka pengangkutan barang berdimensi atau berbobot khusus." },
  ],
  sourcesEn: [
    { label: "PP 55/2012", detail: "Length, width, height, and overhang limits, vehicle categories, and the JBB and JBI concepts." },
    { label: "UU 22/2009", detail: "Framework for road class and special-cargo transport." },
    { label: "PP 79/2013 and Permen PUPR 13/2024", detail: "Road class and maximum axle load parameters, along with the mechanism for setting them." },
    { label: "Kepmen PUPR 176/KPTS/M/2025", detail: "Vehicle classification on toll roads." },
    { label: "Permenhub 60/2019", detail: "Framework for transporting oversized or overweight cargo." },
  ],
  relatedArticles: ["odol-timbangan-jembatan-muatan-lebih", "manajemen-vendor-subkontraktor", "kpi-operasional-logistik"],
  relatedTools: ["jenis-truk-indonesia", "biaya-operasional-truk", "kalkulator-muatan-truk"],
};

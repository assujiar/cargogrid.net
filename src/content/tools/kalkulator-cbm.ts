import type { Tool } from "./types";

export const tool: Tool = {
  slug: "kalkulator-cbm",
  kind: "kalkulator",
  title: "Kalkulator CBM, Berat Volumetrik, dan Chargeable Weight",
  metaTitle: "Kalkulator CBM & Berat Volumetrik — Hitung Chargeable Weight | CargoGrid",
  description:
    "Hitung CBM dari dimensi kardus, lalu bandingkan berat aktual dengan berat volumetrik untuk laut LCL, udara, kurir, dan darat. Gratis, tanpa daftar, hasil bisa disalin ke penawaran.",
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
    "Masukkan panjang, lebar, tinggi, dan jumlah kardus. Kalkulator ini menghitung kubikasinya, mengubahnya menjadi berat volumetrik sesuai moda yang dipakai, lalu memberi tahu berat mana yang akan ditagih — beserta alasannya.",
  searchIntents: [
    "Cara menghitung CBM dari ukuran kardus",
    "Rumus berat volumetrik untuk kargo udara",
    "1 CBM berapa kg untuk pengiriman laut LCL",
    "Kenapa tagihan memakai berat volumetrik, bukan berat timbangan",
    "Konversi CBM ke kilogram",
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
      text: "Yang membingungkan adalah langkah berikutnya. Volume itu harus diubah menjadi berat sebelum bisa dipakai menagih, dan angka penukarnya berbeda-beda menurut moda. Laut LCL menyetarakan 1 CBM dengan 1.000 kg. Kargo udara memakai rumus yang tampak sama sekali lain: panjang kali lebar kali tinggi dalam sentimeter, dibagi 6.000.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Keduanya sebenarnya rumus yang sama",
      body: "Satu meter kubik adalah 1.000.000 sentimeter kubik. Membaginya dengan 6.000 sama saja dengan mengalikannya dengan 166,67 kg per CBM. Jadi divisor 6.000 dan aturan 1 CBM = 1.000 kg bukan dua sistem yang berbeda — keduanya menyatakan hal yang persis sama, hanya dengan angka penukar yang berbeda. Laut menghargai volume enam kali lebih longgar daripada udara.",
    },
    {
      type: "table",
      caption: "Angka penukar volume ke berat menurut moda",
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
      text: "Angka darat sengaja ditulis sebagai rentang. Angkutan darat domestik tidak punya konvensi tunggal, dan selisih antara 250 dan 333 kg per CBM adalah selisih 33 persen pada kardus yang sama persis. Kalkulator ini memberi 250 sebagai titik awal, tetapi angka yang mengikat hanyalah angka di rate card operator Anda.",
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
      body: "Sepuluh kardus 100 x 50 x 40 cm berisi barang seberat 15 kg masing-masing. Volumenya 2 CBM, beratnya 150 kg. Lewat udara, berat volumetriknya 333 kg — lebih dari dua kali berat aslinya, dan itulah yang ditagih. Memadatkan isi yang sama ke dalam kardus 80 x 45 x 35 cm menurunkan volume ke 1,26 CBM dan berat tertagih ke 210 kg. Berat barangnya tidak berubah sedikit pun; yang berubah cuma udara yang ikut dikirim.",
    },
    {
      type: "h2",
      id: "kesalahan-umum",
      text: "Tiga kesalahan yang paling sering muncul",
    },
    {
      type: "ol",
      items: [
        "**Menjumlahkan chargeable weight per baris.** Pengangkut menagih satu kiriman, bukan satu kardus. Kardus padat dan kardus ringan dalam satu booking saling menutupi, sehingga perbandingan berat aktual dan volumetrik dilakukan sekali pada totalnya. Menghitung per baris lalu menjumlahkannya menghasilkan tagihan yang lebih besar dari yang sebenarnya — kesalahan spreadsheet yang paling sering ditemukan dalam penawaran.",
        "**Memakai ukuran barang, bukan ukuran kemasan luar.** Yang diukur adalah kardus terluar, termasuk palet bila barang dipaletkan. Palet menambah sekitar 15 sentimeter tinggi yang ikut ditagih.",
        "**Mencampur satuan.** Dimensi dalam sentimeter dimasukkan ke rumus yang mengharapkan meter menghasilkan angka yang meleset sejuta kali lipat, dan anehnya kesalahan ini sering lolos karena hasilnya jelas-jelas salah sehingga orang mengoreksinya secara naluriah — sampai suatu hari tidak.",
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
  faq: [
    {
      q: "1 CBM berapa kg?",
      a: "Tergantung modanya. Laut LCL menyetarakan 1 CBM dengan 1.000 kg, kargo udara dengan 166,67 kg (divisor 6.000), kurir internasional dengan 200 kg (divisor 5.000), dan angkutan darat domestik umumnya 250 sampai 333 kg tergantung operator. Angka-angka ini bukan konversi fisika, melainkan konvensi penagihan.",
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
      a: "Karena muatan Anda lebih ringan daripada ambang kepadatan moda tersebut, sehingga ditagih berdasarkan ruang yang dipakainya. Untuk kargo udara, ambangnya 166,67 kg per meter kubik. Barang di bawah kepadatan itu selalu ditagih berdasarkan volume.",
    },
    {
      q: "Apakah palet ikut dihitung dalam CBM?",
      a: "Ya. Yang diukur adalah dimensi terluar kemasan sebagaimana diserahkan ke pengangkut. Bila barang dipaletkan, tinggi palet dan bagian yang menonjol ikut terhitung.",
    },
  ],
  relatedArticles: ["margin-per-job-forwarder", "alur-rfq-freight-forwarding", "rekonsiliasi-invoice-forwarder-terlambat"],
  relatedTools: ["ukuran-kontainer", "kalkulator-muatan-truk", "kamus-logistik"],
};

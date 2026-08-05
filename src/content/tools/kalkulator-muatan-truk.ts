import type { Tool } from "./types";

export const tool: Tool = {
  slug: "kalkulator-muatan-truk",
  kind: "kalkulator",
  title: "Kalkulator Muatan Truk: Berapa Kardus Muat di CDD, Fuso, atau Tronton",
  metaTitle: "Kalkulator Muatan Truk — Hitung Kapasitas CDE, CDD, Fuso, Tronton | CargoGrid",
  description:
    "Masukkan ukuran kardus dan pilih jenis truk. Hitung berapa yang muat secara ruang, berapa yang boleh menurut batas berat, dan mana dari keduanya yang lebih dulu membatasi.",
  keywords: [
    "kalkulator muatan truk",
    "kapasitas truk CDD",
    "berapa kubik truk fuso",
    "kapasitas tronton wingbox",
    "hitung muatan truk box",
    "ukuran bak CDD",
  ],
  summary:
    "Dua hal membatasi setiap muatan: ruang di dalam bak dan batas berat yang boleh dibawa. Kalkulator ini menghitung keduanya secara terpisah, menyebut mana yang lebih dulu tercapai, lalu memberi tahu berapa unit truk yang dibutuhkan untuk mengangkut seluruh kiriman.",
  searchIntents: [
    "Berapa kardus muat di truk CDD",
    "Kapasitas kubikasi truk Fuso dan tronton",
    "Ukuran bak dalam truk CDE, CDD, dan wingbox",
    "Butuh berapa truk untuk mengirim sekian kardus",
    "Muatan penuh tapi berat masih di bawah batas — normalkah",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "dua-batas",
      text: "Setiap muatan dibatasi dua hal, dan hanya satu yang terasa",
    },
    {
      type: "p",
      text: "Sebuah truk berhenti bisa dimuati karena salah satu dari dua alasan: baknya penuh, atau beratnya sudah mentok. Keduanya jarang tercapai bersamaan, dan itulah pangkal hampir semua perdebatan di halaman muat. Tim gudang melihat masih ada celah dan yakin satu palet lagi bisa masuk. Sopir yang nanti berhadapan dengan jembatan timbang melihat persoalan yang sama sekali berbeda.",
    },
    {
      type: "p",
      text: "Karena itu kalkulator ini tidak pernah mengembalikan satu angka \"muat sekian\". Ia mengembalikan dua batas berdampingan dan menyebut mana yang mengikat, sebab justru itulah fakta yang menentukan keputusan. Muatan yang dibatasi ruang butuh kemasan yang lebih rapat atau bak yang lebih besar. Muatan yang dibatasi berat butuh unit tambahan, dan tidak ada penataan sepandai apa pun yang bisa mengubahnya.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Batas berat berasal dari jalannya, bukan dari truknya",
      body: "Kapasitas yang tertera pada spesifikasi kendaraan adalah kemampuan rancangan pabrikan. Yang menentukan legal atau tidaknya adalah JBI, yaitu batas yang diizinkan untuk kelas jalan yang dilewati, dan angkanya bisa lebih rendah. Truk yang sama bisa sah membawa satu tonase di satu rute dan melanggar di rute lain.",
    },
    {
      type: "h2",
      id: "cara-menghitung",
      text: "Bagaimana angkanya dihitung",
    },
    {
      type: "p",
      text: "Perhitungan ruangnya sengaja dibuat konservatif. Kalkulator mencoba enam cara mendirikan kardus, lalu untuk masing-masing menghitung berapa yang berjajar sepanjang bak, berapa yang melintang, dan berapa tumpukan yang muat ke atas — hasilnya dibulatkan ke bawah, lalu diambil susunan terbaik.",
    },
    {
      type: "p",
      text: "Kru muat yang berpengalaman hampir selalu mengalahkan angka ini, karena mereka mencampur arah kardus dan mengisi sisa celah. Itu disengaja. Kalkulator yang mengasumsikan penataan sepintar mungkin akan menghasilkan angka yang tidak sanggup dipenuhi halaman gudang, dan angka itu sudah terlanjur masuk ke penawaran. Lebih baik menjanjikan sedikit lebih rendah lalu memuat lebih banyak, daripada sebaliknya.",
    },
    {
      type: "table",
      caption: "Apa yang harus dilakukan berdasarkan batas yang mengikat",
      head: ["Batas yang mengikat", "Artinya", "Yang biasanya berhasil"],
      rows: [
        [
          "Ruang",
          "Bak penuh, timbangan masih longgar",
          "Rapatkan kemasan, pertimbangkan bak lebih tinggi seperti wingbox, atau tinjau ulang ukuran kardus dari sisi produksi",
        ],
        [
          "Berat",
          "Timbangan mentok, bak masih lapang",
          "Tambah unit, atau pecah kiriman. Penataan ulang tidak akan menolong sama sekali",
        ],
        [
          "Keduanya bersamaan",
          "Kombinasi kardus dan truk sudah pas",
          "Tidak ada yang perlu diubah. Catat kombinasi ini sebagai acuan untuk kiriman serupa",
        ],
      ],
    },
    {
      type: "h2",
      id: "angka-spesifikasi",
      text: "Kenapa angka spesifikasi di sini berupa rentang",
    },
    {
      type: "p",
      text: "Dimensi bak datang dari karoseri, bukan dari pabrik sasis. Dua truk dengan lambang yang sama persis bisa berbeda tinggi bak dua puluh sentimeter, dan dua puluh sentimeter adalah satu tumpukan kardus utuh. Kapasitas beratnya pun bergantung pada berat kosong kendaraan itu sendiri, yang berbeda antar bodi.",
    },
    {
      type: "p",
      text: "Karena itu semua angka pada kalkulator ini bisa ditimpa. Prefill-nya adalah titik awal yang wajar untuk armada Indonesia; angka yang benar adalah yang diukur sendiri di halaman, sekali, lalu dipakai berulang. Mengukur bak armada tetap Anda adalah pekerjaan setengah hari yang manfaatnya bertahan bertahun-tahun.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Muatan berlebih adalah biaya, bukan penghematan",
      body: "Kelebihan muatan memindahkan biaya dari ongkos angkut hari ini ke perawatan, denda, dan risiko kecelakaan bulan depan. Perpindahan itu tidak pernah tercatat sebagai satu keputusan, sehingga tidak pernah tampak sebagai satu biaya. Kalkulasi yang jujur di awal jauh lebih murah daripada kalkulasi ulang di jembatan timbang.",
    },
  ],
  faq: [
    {
      q: "Berapa kubikasi truk CDD?",
      a: "Bak CDD standar biasanya sekitar 4,2 x 2,0 x 2,0 meter, atau kira-kira 17 meter kubik, dengan kapasitas berat sekitar 4 sampai 5 ton. Versi long menambah panjang bak menjadi sekitar 6,1 meter — sekitar 24 meter kubik — dengan tambahan kapasitas berat yang kecil.",
    },
    {
      q: "Berapa kapasitas truk tronton wingbox?",
      a: "Tronton wingbox umumnya berbak sekitar 9,5 x 2,4 x 2,4 meter, sekitar 55 meter kubik, dengan kapasitas berat sekitar 12 sampai 20 ton tergantung konfigurasi sumbu dan izin rutenya. Dinding samping yang membuka penuh membuat pemuatan dengan forklift jauh lebih cepat untuk barang berpalet.",
    },
    {
      q: "Kenapa bak sudah penuh tapi beratnya masih jauh di bawah kapasitas?",
      a: "Karena muatan Anda ringan relatif terhadap volumenya. Ini normal untuk tekstil, kemasan plastik, foam, dan barang jadi berkardus. Yang perlu dievaluasi adalah kepadatan kemasan, bukan pilihan truknya.",
    },
    {
      q: "Apakah hasil kalkulator ini bisa langsung dipakai di penawaran?",
      a: "Bisa sebagai dasar, dengan catatan angkanya konservatif. Perhitungan ruangnya memakai satu arah kardus yang seragam, sedangkan kru muat biasanya mencampur arah dan memuat lebih banyak. Untuk kiriman rutin, sebaiknya sesuaikan sekali dengan hasil muat sesungguhnya lalu pakai angka itu seterusnya.",
    },
    {
      q: "Apa beda JBB dan JBI?",
      a: "JBB adalah batas berat total menurut rancangan pabrikan kendaraan. JBI adalah batas yang diizinkan pada kelas jalan tertentu, dan bisa lebih rendah dari JBB. Yang menentukan pelanggaran di jembatan timbang adalah JBI.",
    },
  ],
  relatedArticles: ["odol-timbangan-jembatan-muatan-lebih", "perawatan-armada-preventif-vs-reaktif", "lonjakan-musiman-kapasitas-peak-season"],
  relatedTools: ["jenis-truk-indonesia", "kalkulator-cbm", "ukuran-kontainer"],
};

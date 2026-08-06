import type { Tool } from "./types";

export const tool: Tool = {
  slug: "kalkulator-muatan-truk",
  kind: "kalkulator",
  title: "Kalkulator Muatan Truk: Berapa Kardus Muat di CDD, Fuso, atau Tronton",
  metaTitle: "Kalkulator Muatan Truk: Hitung Kapasitas CDE, CDD, Fuso, Tronton | CargoGrid",
  description:
    "Sedang menentukan CDD atau Fuso untuk kiriman ini? Masukkan ukuran kardus, berat per kardus, dan jumlahnya, lalu kalkulator ini menyebutkan batas mana yang mengikat lebih dulu, ruang atau berat.",
  keywords: [
    "kalkulator muatan truk",
    "kapasitas truk CDD",
    "berapa kubik truk fuso",
    "kapasitas tronton wingbox",
    "hitung muatan truk box",
    "ukuran bak CDD",
  ],
  summary:
    "Tiga hal membatasi setiap muatan: ruang di dalam bak, batas berat yang boleh dibawa, dan kelas jalan yang dilewati. Kalkulator ini menghitung ketiganya secara terpisah, menyebut mana yang lebih dulu mengikat, lalu memberi tahu berapa unit truk yang dibutuhkan untuk mengangkut seluruh kiriman.",
  searchIntents: [
    "Berapa kardus muat di truk CDD",
    "Kapasitas kubikasi truk Fuso dan tronton",
    "Ukuran bak dalam truk CDE, CDD, dan wingbox",
    "Butuh berapa truk untuk mengirim sekian kardus",
    "Muatan penuh tapi berat masih di bawah batas, normalkah",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "tiga-batas",
      text: "Setiap muatan dibatasi tiga hal, dan hanya satu yang terasa",
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
      type: "p",
      text: "Batas ketiga tidak ada hubungannya dengan kardus maupun timbangan: kelas jalan yang dilewati. Ruas jalan kelas III membatasi lebar kendaraan 2,1 meter, dan bodi standar 2,4 sampai 2,5 meter tidak bisa melewatinya berapa pun isinya. Dua batas pertama menjawab berapa yang muat; batas ketiga menjawab apakah muatan itu boleh berjalan, dan hanya yang ketiga yang bisa menghentikan kendaraan di tengah rute.",
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
      text: "Perhitungan ruangnya sengaja dibuat konservatif. Kalkulator mencoba enam cara mendirikan kardus, lalu untuk masing-masing menghitung berapa yang berjajar sepanjang bak, berapa yang melintang, dan berapa tumpukan yang muat ke atas, hasilnya dibulatkan ke bawah, lalu diambil susunan terbaik.",
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
      id: "kepatuhan",
      text: "Pemeriksaan sebelum berangkat",
    },
    {
      type: "p",
      text: "Setelah rencana muatnya jadi, kalkulator memeriksanya terhadap kelas jalan yang Anda pilih dan menyebutkan apa yang perlu dipastikan: apakah lebar bodi masih lolos, apakah panjang kendaraan masih diizinkan, dan berapa batas kasar berat menurut muatan sumbu terberat pada kelas jalan itu. Golongan tol dan golongan penyeberangan kelas armadanya ikut ditampilkan, karena keduanya masuk ke biaya rute.",
    },
    {
      type: "p",
      text: "Alat ini tidak memutuskan boleh-tidaknya sebuah muatan. Ia tidak tahu STNK unit yang akan dipakai, tidak tahu berat kosongnya setelah karoseri, dan tidak tahu izin rutenya, jadi ia menyebutkan apa yang perlu diperiksa dan di mana angka pastinya berada, alih-alih menyatakan sesuatu sah atau tidak sah. Satu-satunya hal yang dinyatakan tegas adalah yang memang tidak mungkin: ruang muat yang lebih lebar daripada batas lebar kendaraan hampir selalu berarti salah ketik atau salah satuan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "MST membatasi per sumbu, bukan berat total",
      body: "Sebuah truk bisa lolos batas berat total tetapi tetap melanggar karena muatannya menumpuk di belakang, sehingga satu sumbu memikul lebih dari jatahnya. Artinya penataan muatan di atas bak bukan sekadar urusan kerapian, distribusi berat sepanjang bak menentukan sah atau tidaknya kendaraan yang sama dengan tonase yang sama persis.",
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
      text: "Semua angka pada kalkulator ini karena itu bisa ditimpa. Prefill-nya adalah titik awal yang wajar untuk armada Indonesia; angka yang benar adalah yang diukur sendiri di halaman, sekali, lalu dipakai berulang. Mengukur bak armada tetap Anda adalah pekerjaan setengah hari yang manfaatnya bertahan bertahun-tahun.",
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
      a: "Bak CDD standar sekitar 4,5 x 2,0 x 2,0 meter, kira-kira 18 meter kubik, dengan perkiraan muatan 3,5 sampai 5,5 ton. Versi long memanjangkan bak menjadi sekitar 5,8 meter, kira-kira 26 meter kubik, tanpa menambah kapasitas berat, sehingga cocok untuk barang ringan bervolume dan sia-sia untuk barang padat.",
    },
    {
      q: "Berapa kapasitas tronton dan wingbox?",
      a: "Tronton bergandar tiga berbodi boks panjang berbak sekitar 8,5 x 2,4 x 2,5 meter, kira-kira 51 meter kubik, dengan perkiraan muatan 10 sampai 16 ton. Wingbox bergandar dua lebih kecil, sekitar 42 meter kubik dengan muatan 5,5 sampai 9 ton. Wingbox pada rangkaian trailer jauh lebih besar, sekitar 76 meter kubik dengan muatan 18 sampai 28 ton. Dinding samping yang membuka penuh membuat pemuatan dengan forklift jauh lebih cepat untuk barang berpalet.",
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
      q: "Kenapa hasilnya berubah saat saya ganti kelas jalan?",
      a: "Karena kelas jalan menetapkan batas lebar, panjang, dan muatan sumbu terberat pada ruas yang dilewati, dan angkanya berbeda antar kelas. Jalan kelas I mengizinkan lebar 2,5 meter, panjang 18 meter, dan MST 10 ton; kelas III membatasi lebar 2,1 meter, panjang 9 meter, dan MST 8 ton. Kendaraannya tidak berubah; ruas jalan yang dilewatinya yang berbeda.",
    },
    {
      q: "Apa beda JBB dan JBI?",
      a: "JBB adalah batas berat total menurut rancangan pabrikan kendaraan. JBI adalah batas yang diizinkan pada kelas jalan tertentu, dan bisa lebih rendah dari JBB. Yang menentukan pelanggaran di jembatan timbang adalah JBI.",
    },
  ],
  sources: [
    { label: "PP 55/2012", detail: "Batas lebar, panjang, dan tinggi kendaraan bermotor, serta konsep JBB dan JBI yang menentukan payload legal." },
    { label: "PP 79/2013 dan Permen PUPR 13/2024", detail: "Parameter kelas jalan dan muatan sumbu terberat yang dipakai pada pemeriksaan rute." },
    { label: "Kepmen PUPR 176/KPTS/M/2025 dan ketentuan penyeberangan ASDP", detail: "Penggolongan kendaraan di jalan tol dan di kapal penyeberangan." },
  ],
  relatedArticles: ["odol-timbangan-jembatan-muatan-lebih", "perawatan-armada-preventif-vs-reaktif", "lonjakan-musiman-kapasitas-peak-season"],
  relatedTools: ["jenis-truk-indonesia", "kalkulator-cbm", "ukuran-kontainer"],
};

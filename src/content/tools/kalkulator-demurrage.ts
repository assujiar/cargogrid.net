import type { Tool } from "./types";

export const tool: Tool = {
  slug: "kalkulator-demurrage",
  kind: "kalkulator",
  title: "Kalkulator Free Time, Demurrage, dan Detention",
  metaTitle: "Kalkulator Demurrage & Free Time Kontainer: Hitung Tanggal Jatuh Tempo | CargoGrid",
  description:
    "Masukkan tanggal bongkar dan jumlah free time. Dapatkan tanggal terakhir bebas denda, jumlah hari yang tertagih, dan estimasi biayanya menurut tarif berjenjang milik Anda sendiri.",
  keywords: [
    "kalkulator demurrage",
    "cara hitung demurrage kontainer",
    "free time kontainer",
    "hitung detention kontainer",
    "denda kontainer pelabuhan",
    "tanggal jatuh tempo free time",
  ],
  summary:
    "Denda kontainer bukan kejutan. Tanggal jatuh temponya sudah bisa dihitung pada hari kontainer turun dari kapal. Kalkulator ini melakukannya dalam sepuluh detik, lengkap dengan tarif berjenjang, sehingga perhitungannya terjadi saat masih bisa mengubah keputusan.",
  searchIntents: [
    "Cara menghitung demurrage kontainer",
    "Kapan free time kontainer habis",
    "Beda demurrage dan detention",
    "Apakah hari libur ikut memakan free time",
    "Estimasi biaya keterlambatan pengambilan kontainer",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "kenapa-jarang-dihitung",
      text: "Kenapa perhitungan ini hampir selalu terlambat",
    },
    {
      type: "p",
      text: "Aritmetikanya sepele: tanggal bongkar, ditambah free time, ketemu tenggat. Namun hampir tidak ada yang menghitungnya pada hari kontainer turun, saat jawabannya masih bisa mengubah sesuatu. Semua orang menghitungnya tiga minggu kemudian ketika invoice datang, dan saat itu satu-satunya yang tersisa untuk didiskusikan adalah nominalnya.",
    },
    {
      type: "p",
      text: "Karena itu halaman ini ada. Bukan karena rumusnya sulit, tetapi karena memindahkan perhitungan ke depan adalah satu-satunya perubahan yang benar-benar menurunkan angkanya.",
    },
    {
      type: "h2",
      id: "beda-demurrage-detention",
      text: "Demurrage dan detention bukan hal yang sama",
    },
    {
      type: "table",
      caption: "Dua denda, dua pemicu, dua tim yang harus bergerak",
      head: ["", "Demurrage", "Detention"],
      rows: [
        ["Objeknya", "Kontainer masih di dalam terminal", "Kontainer sudah keluar, belum dikembalikan"],
        ["Mulai berjalan", "Setelah free time terminal habis", "Setelah free time pemakaian kontainer habis"],
        ["Penyebab tersering", "Dokumen kepabeanan belum selesai, SPPB belum terbit", "Bongkar di gudang molor, antrean panjang di depo"],
        ["Yang bisa memperbaiki", "Tim dokumen dan kepabeanan", "Tim gudang dan armada"],
      ],
    },
    {
      type: "p",
      text: "Perbedaan ini bukan sekadar peristilahan. Begitu kedua denda ditumpuk ke satu akun bernama biaya pelabuhan, jejak akar masalahnya hilang, padahal meja dokumen dan halaman gudang membutuhkan perbaikan yang sama sekali berbeda.",
    },
    {
      type: "h2",
      id: "hari-kalender",
      text: "Free time berjalan dalam hari kalender",
    },
    {
      type: "p",
      text: "Ini jebakan yang paling banyak memakan korban sekaligus paling mudah dihindari. Free time dihitung memakai hari kalender: Sabtu, Minggu, dan libur nasional ikut terhitung persis seperti hari kerja. Kontainer yang turun tiga hari sebelum libur panjang bisa kehilangan sebagian besar jatahnya sebelum satu proses pun sempat berjalan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Periode termahal tahun depan sudah bisa ditandai sekarang",
      body: "Libur Lebaran, Natal, tahun baru, dan cuti bersama semuanya sudah tertulis di kalender jauh hari. Untuk kiriman yang jadwalnya masih fleksibel, menggeser tanggal kedatangan beberapa hari jauh lebih murah daripada menanggung dendanya, dan keputusan itu paling murah diambil saat booking dibuat, bukan saat kapal sudah di tengah laut.",
    },
    {
      type: "h2",
      id: "dua-konvensi",
      text: "Dua konvensi yang perlu dipastikan ke pelayaran",
    },
    {
      type: "p",
      text: "Kalkulator ini menanyakan dua hal yang biasanya diasumsikan orang, padahal keduanya berbeda antar pelayaran dan masing-masing bernilai satu hari denda penuh.",
    },
    {
      type: "ol",
      items: [
        "**Apakah hari bongkar dihitung sebagai free time hari pertama?** Sebagian pelayaran menghitungnya, sebagian mulai menghitung keesokan harinya. Selisihnya persis satu hari, dan satu hari pada jenjang tarif tertinggi bukan angka yang bisa diabaikan.",
        "**Apakah penomoran jenjang tarif dimulai ulang dari hari tertagih pertama?** Umumnya ya, jenjang ditulis sebagai hari ke-1 sampai ke-3 setelah free time. Kalkulator ini memakai asumsi tersebut, dan tabel jenjangnya bisa diubah seluruhnya bila milik Anda berbeda.",
      ],
    },
    {
      type: "p",
      text: "Kedua jawabannya ada di Delivery Order dan di kontrak dengan pelayaran. Menanyakannya sekali, lalu mencatatnya per pelayaran, menghilangkan seluruh kelas kejutan ini secara permanen.",
    },
    {
      type: "h2",
      id: "tarif-berjenjang",
      text: "Tarif berjenjang, dan kenapa denda naik lebih cepat dari dugaan",
    },
    {
      type: "p",
      text: "Tarif demurrage hampir selalu berjenjang naik. Tarif minggu ketiga kerap tiga sampai lima kali lipat tarif minggu pertama. Akibatnya, keterlambatan yang panjangnya dua kali lipat bisa berbiaya empat kali lipat, dan intuisi orang tentang \"telat beberapa hari lagi tidak apa-apa\" hampir selalu meleset ke arah yang salah.",
    },
    {
      type: "p",
      text: "Angka jenjang bawaan pada kalkulator ini hanya berbentuk seperti tarif sungguhan; nominalnya sengaja bukan tarif siapa pun. Ganti dengan angka dari Delivery Order Anda sendiri sebelum hasilnya dipakai untuk apa pun yang serius.",
    },
    {
      type: "h2",
      id: "dari-hitungan-ke-kebiasaan",
      text: "Dari menghitung sekali menjadi memantau terus",
    },
    {
      type: "p",
      text: "Kalkulator menjawab satu kontainer. Persoalan sesungguhnya adalah tiga puluh kontainer yang free time-nya berjalan bersamaan, masing-masing dengan tenggat berbeda, dan tidak seorang pun memegang daftar urutannya. Selama tenggat itu hanya tersimpan di kepala petugas dokumen, denda akan terus terjadi sesekali tanpa pernah bisa dijelaskan.",
    },
    {
      type: "p",
      text: "Perbaikannya tidak butuh sistem baru untuk dimulai: cukup urutkan pekerjaan dokumen berdasarkan sisa free time, bukan berdasarkan tanggal kedatangan kontainer. Teori penjadwalan sudah lama menunjukkan bahwa mendahulukan tenggat terdekat menghasilkan keterlambatan total paling kecil. Yang dibutuhkan hanyalah daftar tenggat yang terlihat semua orang.",
    },
  ],
  faq: [
    {
      q: "Bagaimana cara menghitung demurrage kontainer?",
      a: "Ambil tanggal bongkar kontainer, tambahkan jumlah hari free time dari Delivery Order, dan Anda mendapat hari bebas terakhir. Setiap hari kalender setelah itu sampai kontainer diambil adalah hari tertagih, dikalikan tarif jenjang yang berlaku pada hari tersebut.",
    },
    {
      q: "Apakah hari Sabtu, Minggu, dan libur nasional ikut memakan free time?",
      a: "Ya. Free time dihitung dalam hari kalender, bukan hari kerja. Inilah sebabnya kontainer yang tiba menjelang libur panjang berisiko jauh lebih tinggi meski tidak ada satu pun proses yang tertunda.",
    },
    {
      q: "Apa beda demurrage dan detention?",
      a: "Demurrage berjalan selama kontainer masih berada di dalam terminal melewati free time. Detention berjalan setelah kontainer keluar terminal tetapi belum dikembalikan ke depo. Penyebab dan tim yang bisa memperbaikinya berbeda.",
    },
    {
      q: "Apakah hari bongkar dihitung sebagai free time hari pertama?",
      a: "Tergantung pelayaran. Sebagian menghitungnya sebagai hari pertama, sebagian mulai menghitung keesokan harinya. Selisihnya satu hari denda penuh, jadi konfirmasikan ke pelayaran dan catat jawabannya per operator.",
    },
    {
      q: "Apakah storage sama dengan demurrage?",
      a: "Tidak. Storage ditagih terminal atas ruang penumpukan yang dipakai kontainer, sementara demurrage ditagih pelayaran. Satu kontainer yang terlambat bisa menerima dua tagihan dari dua pihak berbeda untuk keterlambatan yang sama.",
    },
  ],
  relatedArticles: ["demurrage-detention-pelabuhan", "dokumen-kepabeanan-arsip-digital", "tracking-multimoda-indonesia"],
  relatedTools: ["ukuran-kontainer", "kamus-logistik", "incoterms-2020"],
};

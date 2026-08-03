import type { Article } from "./types";

export const article: Article = {
  slug: "demurrage-detention-pelabuhan",
  layout: "dossier",
  title: "Demurrage dan Detention: Denda yang Hampir Selalu Bisa Dihindari, Tapi Jarang Dihitung",
  metaTitle: "Demurrage & Detention: Anatomi Denda Kontainer di Pelabuhan | CargoGrid OS",
  description:
    "Demurrage dan detention bukan biaya tak terduga, keduanya punya tanggal jatuh tempo yang diketahui sejak hari pertama. Kami bedah kenapa tetap terjadi dan bagaimana memantaunya.",
  keywords: [
    "demurrage detention",
    "biaya demurrage kontainer",
    "free time kontainer",
    "denda pelabuhan Indonesia",
    "manajemen kontainer impor",
  ],
  category: "operasional",
  publishedAt: "2026-08-03",
  summary:
    "Tidak seperti kerusakan barang atau cuaca buruk, demurrage punya sifat yang aneh: tanggal jatuh temponya sudah diketahui sejak kontainer dibongkar. Ia bukan kejadian tak terduga, melainkan tenggat yang terlewat. Itu membuatnya jauh lebih bisa dikendalikan daripada yang diperlakukan kebanyakan perusahaan.",
  takeaways: [
    "Demurrage dikenakan atas kontainer yang menetap di terminal; detention atas kontainer yang lama di luar. Keduanya sering tertukar dan salah dibebankan.",
    "Free time berjalan dalam hari kalender, sehingga libur panjang memakan jatah tanpa ada pekerjaan yang berjalan.",
    "Penyebab paling umum bukan keterlambatan truk, melainkan dokumen kepabeanan yang belum selesai.",
    "Tanpa catatan penyebab per kejadian, denda ini akan dianggap biaya operasional biasa dan tidak pernah diperbaiki.",
  ],
  blocks: [
    {
      type: "p",
      text: "Coba tanyakan ke tim operasional Anda berapa total demurrage dan detention yang dibayar tahun lalu. Kalau jawabannya butuh waktu untuk dicari, itu sendiri sudah merupakan temuan. Biaya yang tidak dipantau tidak pernah dikelola, ia hanya dibayar.",
    },
    {
      type: "p",
      text: "Yang membuat kedua biaya ini menarik untuk dibahas: keduanya sepenuhnya dapat diprediksi. Anda tahu tanggal kontainer dibongkar. Anda tahu berapa hari free time yang diberikan. Karena itu Anda tahu, sejak hari pertama, kapan denda mulai berjalan. Tidak ada ketidakpastian sama sekali, yang ada hanya tenggat yang tidak dipantau.",
    },
    {
      type: "h2",
      id: "dasar-penjadwalan",
      text: "Dasar: aturan tenggat terdekat dalam teori penjadwalan",
    },
    {
      type: "p",
      text: "Teori penjadwalan punya satu hasil yang sederhana dan terbukti secara matematis, dikenal sebagai aturan Jackson: bila sejumlah pekerjaan harus dikerjakan satu per satu oleh satu sumber daya, mengurutkannya berdasarkan tenggat terdekat lebih dulu menghasilkan keterlambatan maksimum yang paling kecil.",
    },
    {
      type: "p",
      text: "Terjemahannya ke meja dokumen Anda langsung. Antrean kontainer yang menunggu penyelesaian dokumen adalah persoalan penjadwalan satu sumber daya, dan tenggatnya sudah diketahui sejak kontainer dibongkar. Mengurutkan pekerjaan berdasarkan sisa free time, bukan berdasarkan tanggal tiba, adalah penerapan langsung aturan itu. Perubahan ini tidak menambah orang dan tidak menambah sistem, hanya mengubah urutan.",
    },
    {
      type: "h2",
      id: "beda-demurrage-dan-detention",
      text: "Beda demurrage dan detention, dan kenapa membedakannya penting",
    },
    {
      type: "p",
      text: "Keduanya sering disebut bergantian dalam percakapan sehari-hari, padahal memicunya berbeda dan pihak yang bisa memperbaikinya juga berbeda.",
    },
    {
      type: "table",
      caption: "Dua denda, dua penyebab, dua penanggung jawab yang berbeda",
      head: ["", "Demurrage", "Detention"],
      rows: [
        ["Objeknya", "Kontainer masih di dalam terminal", "Kontainer sudah keluar, belum dikembalikan"],
        ["Jam mulai berjalan", "Setelah free time di terminal habis", "Setelah free time penggunaan kontainer habis"],
        ["Penyebab tersering", "Dokumen kepabeanan belum selesai, SPPB belum keluar", "Bongkar di gudang lambat, truk antre kembali ke depo"],
        ["Yang bisa memperbaiki", "Tim dokumen dan kepabeanan", "Tim operasional gudang dan armada"],
        ["Sering salah dibebankan ke", "Trucking, padahal truk belum boleh masuk", "Customer, padahal antrean depo di luar kendalinya"],
      ],
    },
    {
      type: "p",
      text: "Pembedaan ini bukan soal istilah. Kalau seluruh denda dicatat dalam satu akun bernama \"biaya pelabuhan\", Anda tidak akan pernah tahu apakah masalahnya ada di meja dokumen atau di pintu gudang. Dan dua masalah itu diperbaiki dengan cara yang sama sekali berbeda.",
    },
    {
      type: "h2",
      id: "free-time-berjalan-dalam-hari-kalender",
      text: "Free time berjalan dalam hari kalender, termasuk saat kantor tutup",
    },
    {
      type: "p",
      text: "Ini jebakan yang paling sering memakan korban dan paling mudah dihindari. Free time umumnya dihitung dalam hari kalender, bukan hari kerja. Kontainer yang dibongkar menjelang libur panjang kehilangan sebagian besar jatahnya sebelum ada satu pun pekerjaan yang bisa dikerjakan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Periode paling mahal dalam setahun sudah diketahui dari sekarang",
      body: "Libur Lebaran, Natal-Tahun Baru, dan cuti bersama panjang adalah tanggal yang sudah ada di kalender berbulan-bulan sebelumnya. Kontainer yang tiba tiga hari sebelum libur seminggu praktis kehilangan seluruh free time-nya. Untuk kiriman yang jadwal tibanya masih bisa digeser, menggesernya beberapa hari jauh lebih murah daripada membayar denda, dan keputusan itu harus diambil saat booking, bukan saat kontainer sudah di air.",
    },
    {
      type: "h2",
      id: "penyebab-sebenarnya",
      text: "Penyebab yang sebenarnya, diurutkan dari yang paling sering",
    },
    {
      type: "p",
      text: "Dari pengamatan pada operasional impor di Indonesia, urutannya cenderung seperti ini, dan urutan ini penting karena menentukan ke mana perbaikan diarahkan.",
    },
    {
      type: "ol",
      items: [
        "**Dokumen belum lengkap saat kontainer tiba.** Invoice, packing list, atau dokumen asal yang belum diterima dari shipper. Kontainer sudah di terminal, tapi proses kepabeanan belum bisa dimulai. Ini penyebab nomor satu, dan akarnya ada di luar negeri.",
        "**Jalur merah atau permintaan pemeriksaan.** Menambah beberapa hari yang tidak bisa dipercepat. Bisa diantisipasi kalau pola komoditas dan importir Anda dipantau.",
        "**Perizinan tambahan.** Komoditas tertentu memerlukan izin dari kementerian teknis. Kalau baru diurus setelah kontainer tiba, keterlambatannya bisa panjang.",
        "**Kapasitas gudang penerima penuh.** Kontainer sudah bisa keluar, tapi tidak ada tempat membongkarnya.",
        "**Antrean pengembalian di depo.** Truk sudah membawa kontainer kosong, tapi depo antre. Sering luput dari perhitungan karena dianggap urusan trucking.",
      ],
    },
    {
      type: "p",
      text: "Perhatikan bahwa hanya dua dari lima penyebab teratas berhubungan dengan armada. Ini menjelaskan kenapa menekan vendor trucking (reaksi yang paling umum) jarang mengubah angka tahunan.",
    },
    {
      type: "h2",
      id: "kenapa-tetap-terjadi",
      text: "Kalau tanggalnya sudah diketahui, kenapa masih kecolongan?",
    },
    {
      type: "p",
      text: "Karena tidak ada yang bertugas memantaunya. Tanggal jatuh tempo free time biasanya ada di dokumen (di Delivery Order, di email pelayaran) tapi tidak ada di tempat orang bekerja sehari-hari.",
    },
    {
      type: "p",
      text: "Tim dokumen bekerja dari antrean dokumen. Tim operasional bekerja dari jadwal truk. Tidak satu pun dari kedua antrean itu diurutkan berdasarkan \"berapa hari lagi sebelum denda mulai\". Akibatnya kontainer yang tersisa satu hari free time diperlakukan sama dengan yang tersisa enam hari.",
    },
    {
      type: "quote",
      text: "Denda ini tidak muncul karena orang tidak tahu tanggalnya. Ia muncul karena tanggal itu tidak pernah mengubah urutan pekerjaan siapa pun.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Satu perubahan yang biasanya paling besar dampaknya",
      body: "Urutkan daftar kerja harian tim dokumen berdasarkan sisa free time, bukan berdasarkan tanggal kontainer tiba. Perubahan ini tidak menambah orang, tidak menambah sistem, dan tidak menambah biaya. Ia hanya memindahkan pekerjaan yang paling mahal kalau terlambat ke urutan paling atas, dan itu bisa dikerjakan dengan spreadsheet.",
    },
    {
      type: "h2",
      id: "yang-perlu-dicatat-per-kejadian",
      text: "Empat kolom yang harus ada di setiap kejadian denda",
    },
    {
      type: "p",
      text: "Kalau Anda hanya mencatat nominal, denda ini akan selamanya terlihat seperti biaya operasional yang wajar. Yang membuatnya bisa diperbaiki adalah mencatat konteksnya:",
    },
    {
      type: "ul",
      items: [
        "**Jenis:** demurrage atau detention. Menentukan tim mana yang perlu dilibatkan.",
        "**Jumlah hari lewat**, bukan hanya rupiah. Denda Rp 10 juta dari satu kontainer lewat 20 hari adalah masalah yang berbeda dari Rp 10 juta yang tersebar di 20 kontainer lewat 1 hari. Yang pertama adalah kasus tersangkut; yang kedua adalah proses yang selalu mepet.",
        "**Penyebab utama**, dipilih dari daftar tetap. Bukan esai, lima pilihan sudah cukup.",
        "**Siapa yang menanggung.** Kalau selalu perusahaan Anda, periksa kembali kontrak dengan customer. Sebagian penyebab, seperti dokumen dari shipper yang telat, sebetulnya bukan risiko Anda.",
      ],
    },
    {
      type: "p",
      text: "Setelah tiga bulan, distribusi kolom ketiga akan memberi tahu satu hal yang tidak bisa diketahui dengan cara lain: apakah Anda punya masalah dokumen, masalah gudang, atau masalah perencanaan jadwal. Ketiganya terasa sama di laporan keuangan, dan tidak ada satu pun yang bisa diperbaiki tanpa tahu yang mana.",
    },
    {
      type: "h2",
      id: "negosiasi-free-time",
      text: "Free time bisa dinegosiasikan, dan sering terlupa",
    },
    {
      type: "p",
      text: "Untuk importir dengan volume rutin, tambahan free time adalah salah satu poin negosiasi yang paling sering dilewatkan. Perhatian biasanya tertuju penuh pada tarif angkut, padahal tambahan beberapa hari free time bisa bernilai lebih besar daripada potongan tarif yang diperjuangkan mati-matian.",
    },
    {
      type: "p",
      text: "Hitung sendiri sebelum negosiasi berikutnya: berapa total demurrage yang Anda bayar tahun lalu, dan berapa persen dari kejadian itu yang akan terhindar seandainya free time lebih panjang tiga hari. Kalau angkanya melebihi nilai potongan tarif yang biasa Anda perjuangkan, Anda tahu poin mana yang seharusnya dibawa lebih dulu ke meja.",
    },
    {
      type: "h2",
      id: "batas-yang-perlu-diterima",
      text: "Batas yang perlu diterima",
    },
    {
      type: "p",
      text: "Sebagian demurrage tidak bisa dihindari, dan mengejar angka nol justru menciptakan biaya baru. Pemeriksaan jalur merah, kepadatan pelabuhan musiman, dan kapal yang tiba lebih awal dari jadwal berada di luar kendali siapa pun di tim Anda.",
    },
    {
      type: "p",
      text: "Target yang masuk akal bukan nol, melainkan memisahkan yang tak terhindarkan dari yang terhindarkan, lalu mengecilkan kelompok kedua sampai tersisa hanya kelompok pertama. Perusahaan yang mengejar nol biasanya berakhir menahan barang lebih lama di gudang sendiri, yang biayanya nyata tapi tidak muncul sebagai denda, sehingga terasa seperti kemenangan padahal bukan.",
    },
  ],
  faq: [
    {
      q: "Berapa lama free time yang umum diberikan?",
      a: "Bervariasi menurut pelayaran, jenis kontainer, rute, dan kesepakatan volume, reefer dan special equipment hampir selalu mendapat free time lebih pendek daripada kontainer kering. Jangan mengandalkan angka umum; periksa nilai yang tertulis di kontrak atau booking confirmation Anda sendiri, karena itulah angka yang akan ditagihkan.",
    },
    {
      q: "Siapa yang seharusnya menanggung demurrage: forwarder atau customer?",
      a: "Ditentukan kontrak dan penyebabnya. Kalau keterlambatan berasal dari dokumen yang belum dikirim shipper atau izin yang belum diurus importir, umumnya bukan tanggungan forwarder. Masalahnya, tanpa catatan penyebab per kejadian, forwarder sering menanggungnya demi menjaga hubungan, dan setelah beberapa kali, itu berubah jadi kebiasaan yang sulit dinegosiasikan ulang.",
    },
    {
      q: "Apakah sistem bisa mencegah demurrage sepenuhnya?",
      a: "Tidak. Sistem tidak mempercepat pemeriksaan bea cukai maupun mengurai antrean depo. Yang bisa dilakukan sistem adalah memastikan tidak ada kontainer yang lewat tenggatnya tanpa ada yang menyadari, yaitu menghapus kategori 'kecolongan', bukan kategori 'terlambat karena sebab di luar kendali'.",
    },
    {
      q: "Kami sudah pakai spreadsheet untuk memantau free time. Apa yang kurang?",
      a: "Spreadsheet bekerja baik selama ada orang yang membukanya setiap hari. Yang biasanya gagal bukan spreadsheet-nya, melainkan kesinambungan pengisiannya saat volume naik atau saat orang yang biasa mengurus sedang cuti. Kalau pemantauan Anda bertahan melewati periode tersibuk tahun lalu, spreadsheet itu sudah memadai.",
    },
  ],
  related: ["dokumen-kepabeanan-arsip-digital", "tracking-multimoda-indonesia", "biaya-tersembunyi-pod-kertas"],
};

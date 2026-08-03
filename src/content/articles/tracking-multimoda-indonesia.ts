import type { Article } from "./types";

export const article: Article = {
  slug: "tracking-multimoda-indonesia",
  title: "Kenapa Tracking Multimoda di Indonesia Sulit Disatukan: dan Apa yang Realistis Dijanjikan ke Customer",
  metaTitle: "Tracking Multimoda Indonesia: Batas Teknis & Solusi Realistis | CargoGrid OS",
  description:
    "Tracking laut, darat, dan udara punya sumber data yang berbeda mutu dan frekuensinya. Memahami batas tiap moda mencegah Anda menjanjikan hal yang tidak bisa ditepati.",
  keywords: [
    "tracking multimoda",
    "visibility logistik indonesia",
    "tracking pengiriman laut darat",
    "milestone tracking logistik",
    "real time tracking kargo",
  ],
  category: "operasional",
  publishedAt: "2026-08-03",
  summary:
    "\"Real-time tracking\" berarti hal yang sangat berbeda di truk, di kapal, dan di gudang. Menyatukan ketiganya tanpa memahami perbedaannya menghasilkan dashboard yang terlihat lengkap tapi menyesatkan pemakainya.",
  takeaways: [
    "Tiga moda menghasilkan data dengan frekuensi berbeda: menit untuk truk, jam sampai hari untuk laut, per peristiwa untuk gudang.",
    "Menampilkan semuanya dengan gaya yang sama membuat data lama terlihat sama segarnya dengan data baru.",
    "Yang dibutuhkan customer hampir selalu perkiraan tiba, bukan titik koordinat.",
    "Tampilkan umur data di sebelah setiap status, ini perubahan kecil yang paling banyak mengurangi salah paham.",
  ],
  blocks: [
    {
      type: "p",
      text: "Setiap presentasi software logistik menampilkan peta dengan titik-titik bergerak. Tampilannya meyakinkan. Masalahnya muncul setelah dipakai: titik yang bergerak mulus itu hanya benar untuk satu dari tiga moda yang Anda layani.",
    },
    {
      type: "p",
      text: "Ini bukan kekurangan software tertentu. Ini sifat dari sumber datanya, dan tidak ada vendor yang bisa mengubahnya. Yang bisa dibedakan antar sistem adalah seberapa jujur mereka menampilkan perbedaan itu.",
    },
    {
      type: "h2",
      id: "tiga-moda-tiga-sumber-data",
      text: "Tiga moda, tiga jenis data yang sama sekali berbeda",
    },
    {
      type: "table",
      caption: "Perbedaan yang menentukan apa yang boleh Anda janjikan",
      head: ["", "Trucking darat", "Laut / kontainer", "Gudang"],
      rows: [
        ["Sumber", "GPS di perangkat driver atau kendaraan", "Pembaruan dari pelayaran & terminal", "Pemindaian di titik proses"],
        ["Frekuensi", "Menit", "Jam sampai hari", "Per peristiwa, tidak menentu"],
        ["Bentuk data", "Koordinat berkelanjutan", "Milestone diskret", "Status per unit atau lokasi"],
        ["Kalau tidak ada sinyal", "Titik berhenti bergerak", "Tidak berpengaruh, bukan data langsung", "Pemindaian tertunda sampai online"],
        ["Yang bisa dijanjikan", "Posisi terkini", "Milestone terakhir yang diketahui", "Status terakhir yang tercatat"],
      ],
    },
    {
      type: "p",
      text: "Perhatikan baris terakhir. Hanya moda darat yang bisa menjawab \"di mana barang saya sekarang\". Untuk laut, jawaban jujurnya adalah \"terakhir tercatat berangkat dari Singapura tiga hari lalu\", dan itu bukan kekurangan sistem, itu memang seluruh data yang ada.",
    },
    {
      type: "h2",
      id: "bahaya-menyeragamkan-tampilan",
      text: "Bahaya menyeragamkan tampilan",
    },
    {
      type: "p",
      text: "Godaan desain yang paling besar adalah menampilkan ketiga jenis data dengan gaya yang sama, karena hasilnya terlihat rapi. Ini justru sumber kesalahpahaman terbesar.",
    },
    {
      type: "p",
      text: "Ketika status truk yang diperbarui dua menit lalu ditampilkan dengan lencana hijau yang sama persis dengan status kapal yang diperbarui dua hari lalu, pembaca menyimpulkan keduanya sama-sama terkini. Ia lalu membuat keputusan (memberi tahu customer, menjadwalkan bongkar) berdasarkan informasi yang usia sebenarnya tidak ia ketahui.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Perubahan terkecil dengan dampak terbesar",
      body: "Tampilkan umur data di sebelah setiap status: \"Dalam perjalanan · diperbarui 4 menit lalu\" versus \"Dalam pelayaran · diperbarui 2 hari lalu\". Satu tambahan frasa ini menghilangkan sebagian besar salah paham, dan tidak memerlukan integrasi baru apa pun, datanya sudah Anda miliki, hanya belum ditampilkan.",
    },
    {
      type: "h2",
      id: "yang-sebenarnya-dibutuhkan-customer",
      text: "Yang sebenarnya ditanyakan customer",
    },
    {
      type: "p",
      text: "Ketika customer menelepon menanyakan posisi barang, ia hampir tidak pernah benar-benar ingin tahu koordinatnya. Ia sedang mencoba memutuskan sesuatu: apakah perlu menyiapkan tim bongkar besok, apakah bisa menjanjikan pengiriman ke pelanggannya sendiri, apakah perlu mencari alternatif.",
    },
    {
      type: "p",
      text: "Artinya yang bernilai baginya adalah perkiraan waktu tiba beserta tingkat keyakinannya, bukan titik di peta. Peta memuaskan rasa ingin tahu; perkiraan tiba menjawab pertanyaannya.",
    },
    {
      type: "p",
      text: "Ini juga alasan kenapa investasi pada pelacakan GPS yang lebih rapat sering memberi hasil lebih kecil dari harapan. Menaikkan frekuensi dari lima menit ke satu menit tidak mengubah satu pun keputusan customer. Memberi perkiraan tiba yang dapat dipercaya, mengubah semuanya.",
    },
    {
      type: "h2",
      id: "milestone-yang-benar-benar-berguna",
      text: "Milestone yang benar-benar berguna",
    },
    {
      type: "p",
      text: "Kalau harus memilih sedikit titik pencatatan karena keterbatasan, ini urutan yang paling banyak memberi nilai per usaha:",
    },
    {
      type: "ol",
      items: [
        "**Barang diterima dari shipper.** Menandai jam mulai tanggung jawab Anda, dan menghentikan pertanyaan \"sudah diambil belum\".",
        "**Berangkat dari titik asal.** Titik pertama yang membuat perkiraan tiba bisa dihitung sama sekali.",
        "**Tiba di titik transit atau pelabuhan.** Tempat paling sering terjadi keterlambatan yang tidak terlihat.",
        "**Keluar dari pelabuhan / selesai kepabeanan.** Perubahan status yang paling ditunggu di jalur impor.",
        "**Diterima di tujuan, dengan bukti.** Menutup siklus dan memulai penagihan.",
      ],
    },
    {
      type: "p",
      text: "Lima titik ini menjawab sebagian besar pertanyaan yang masuk ke tim customer service. Menambah titik keenam dan ketujuh memberi peningkatan yang jauh lebih kecil daripada memastikan lima yang pertama tercatat dengan disiplin.",
    },
    {
      type: "h2",
      id: "masalah-data-yang-tidak-lengkap",
      text: "Masalah yang tidak akan hilang: data yang tidak lengkap",
    },
    {
      type: "p",
      text: "Sebagian besar shipment Anda melibatkan pihak ketiga: pelayaran, agen di tujuan, subkontraktor trucking. Setiap pihak punya sistem sendiri, atau tidak punya sama sekali.",
    },
    {
      type: "p",
      text: "Integrasi otomatis dengan pelayaran besar mungkin dilakukan, meski usahanya tidak kecil. Integrasi dengan subkontraktor trucking yang armadanya lima truk dan koordinasinya lewat WhatsApp, tidak. Itu bukan soal teknologi, mereka memang tidak punya sistem untuk diintegrasikan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Jujur soal cakupan lebih baik daripada peta yang bolong",
      body: "Kalau 30% pengiriman Anda dikerjakan subkontraktor yang tidak melaporkan status, jangan tampilkan tracking untuk 100% shipment lalu biarkan sebagian tidak pernah bergerak. Customer yang melihat status membeku tiga hari akan menyimpulkan barangnya bermasalah, dan menelepon. Anda baru saja menciptakan pekerjaan yang hendak dihilangkan oleh fitur itu.",
    },
    {
      type: "p",
      text: "Pendekatan yang lebih baik: tandai dengan jelas shipment yang statusnya bergantung pada pelaporan manual, dan sepakati ritme pelaporan dengan subkontraktor, misalnya dua kali sehari lewat pesan singkat yang diteruskan admin ke sistem. Data manual dengan ritme yang dapat diandalkan lebih berguna daripada data otomatis yang cakupannya bolong.",
    },
    {
      type: "h2",
      id: "estimasi-tiba-yang-jujur",
      text: "Perkiraan tiba yang jujur lebih baik daripada yang optimis",
    },
    {
      type: "p",
      text: "Ada dorongan alami untuk memberi perkiraan yang menyenangkan. Dorongan itu merugikan dalam jangka menengah: customer yang dua kali menerima perkiraan meleset akan berhenti mempercayai seluruh sistem Anda, termasuk saat perkiraannya benar.",
    },
    {
      type: "p",
      text: "Sampaikan rentang, bukan satu titik waktu, \"tiba Kamis sampai Jumat\" lebih berguna daripada \"tiba Kamis pukul 14.00\" yang meleset. Dan ketika ada perubahan, kabarkan sebelum customer bertanya. Perkiraan yang direvisi lebih awal jauh lebih baik diterima daripada perkiraan yang dipertahankan sampai jelas salah.",
    },
    {
      type: "quote",
      text: "Customer memaafkan keterlambatan yang diberitahukan. Yang tidak dimaafkan adalah keterlambatan yang mereka temukan sendiri.",
    },
  ],
  faq: [
    {
      q: "Apakah perlu memasang GPS di semua truk, termasuk milik subkontraktor?",
      a: "Untuk armada sendiri, GPS pada perangkat driver umumnya sudah memadai dan jauh lebih murah daripada perangkat terpasang di kendaraan. Untuk subkontraktor, memaksakan pemasangan sering menemui penolakan dan biayanya tidak sepadan. Alternatif yang lebih realistis: minta mereka memakai aplikasi driver Anda untuk pencatatan milestone, tanpa pelacakan posisi terus-menerus.",
    },
    {
      q: "Bisakah tracking kontainer laut benar-benar real-time?",
      a: "Tidak dalam pengertian yang sama dengan truk. Pembaruan berasal dari sistem pelayaran dan terminal, yang bekerja per peristiwa, bukan per detik. Ada perangkat pelacak yang dipasang di kontainer dan memberi posisi lebih sering, tetapi biayanya jarang sepadan kecuali untuk kargo bernilai sangat tinggi atau yang sensitif suhu.",
    },
    {
      q: "Bagaimana menangani customer yang minta tracking sedetail marketplace?",
      a: "Ekspektasi itu terbentuk dari pengalaman kurir e-commerce, yang bekerja pada satu moda dan satu jaringan yang seluruhnya mereka kendalikan. Jelaskan perbedaannya sekali di awal kerja sama, lalu berikan yang memang bisa Anda tepati secara konsisten. Konsistensi membangun kepercayaan lebih cepat daripada kedetailan yang kadang ada kadang tidak.",
    },
    {
      q: "Apakah lebih baik menampilkan status yang belum pasti atau tidak menampilkannya sama sekali?",
      a: "Tampilkan, dengan penanda ketidakpastiannya. Ruang kosong akan diisi sendiri oleh customer dengan dugaan terburuk, lalu berubah jadi telepon. Status yang disertai keterangan 'menunggu konfirmasi mitra di tujuan' menahan pertanyaan itu, karena ia menunjukkan bahwa keadaannya diketahui dan sedang ditangani.",
    },
  ],
  related: ["customer-portal-logistik", "demurrage-detention-pelabuhan", "adopsi-aplikasi-driver"],
};

import type { Article } from "./types";

export const article: Article = {
  slug: "memilih-software-logistik-pilot-30-hari",
  layout: "feature",
  format: "Checklist Audit",
  title: "Sepuluh Hal yang Perlu Jawaban Tertulis Sebelum Pilot Software Logistik Dimulai",
  metaTitle: "Checklist Pilot Software Logistik 30 Hari",
  description:
    "Sepuluh area yang perlu punya jawaban tertulis sebelum pilot software logistik dimulai: ruang lingkup, sampel job, pengguna, angka dasar, kriteria lolos-gagal, log kendala, ketergantungan dukungan vendor, hak ekspor data, tinjauan keamanan, dan siapa yang memegang keputusan akhir.",
  keywords: [
    "checklist pilot software logistik",
    "memilih software logistik",
    "implementasi TMS",
    "evaluasi vendor logistik",
    "kriteria lolos gagal pilot",
  ],
  category: "sistem",
  publishedAt: "2026-08-03",
  updatedAt: "2026-08-06",
  summary:
    "Pilot software logistik yang longgar rancangannya biasanya berakhir dengan kesan bagus tapi tanpa kejelasan apa pun untuk dipegang. Checklist ini menata sepuluh area yang perlu jawaban tertulis sebelum hari pertama pilot dimulai, supaya hasil di akhir 30 hari benar-benar bisa dipakai untuk memutuskan, bukan sekadar dirasakan.",
  takeaways: [
    "Tulis angka lolos dan angka gagal untuk tiap metrik dasar sebelum pilot dimulai, bukan setelah hasilnya mulai terlihat.",
    "Uji di proses paling sibuk dan paling rumit yang Anda punya, bukan cabang paling tenang dengan tim paling kooperatif.",
    "Pisahkan orang yang mengusulkan pembelian dari orang yang memutuskan hasil pilot, supaya biaya yang sudah keluar tidak ikut menentukan keputusan berikutnya.",
    "Hasil pilot yang 'tidak jelas' bukan hasil netral. Itu tanda salah satu area di checklist ini belum punya jawaban tertulis sebelum pilot dimulai.",
  ],
  blocks: [
    {
      type: "p",
      text: "Pertanyaan yang perlu dijawab sebelum menyetujui pilot software logistik bukan 'vendor mana yang paling meyakinkan saat demo', melainkan pertanyaan yang lebih sempit dan lebih berguna: apakah rancangan pilot ini cukup ketat untuk menghasilkan jawaban ya atau tidak yang bisa dipertanggungjawabkan, atau hasilnya sudah bisa ditebak sejak sebelum pilot dimulai?",
    },
    {
      type: "p",
      text: "Sebagian besar pilot yang berakhir dengan 'hasilnya bagus, lanjut saja' tidak pernah benar-benar diuji ketat. Kriteria lolosnya tidak ditulis, sampel jobnya dipilih dari cabang paling tenang, dan tidak ada satu kondisi pun yang, kalau terjadi, akan membuat tim berhenti. Prinsip yang dipakai Karl Popper untuk membedah metode ilmiah berlaku sama di sini: klaim yang cocok dengan hasil apa pun tidak menjelaskan apa-apa, sebab tidak ada kejadian yang bisa membuktikannya keliru. Pilot yang tidak dirancang untuk bisa gagal berada di posisi yang sama.",
    },
    {
      type: "p",
      text: "Checklist berikut memecah rancangan pilot menjadi sepuluh area. Tiap area sebaiknya sudah punya jawaban tertulis sebelum hari pertama pilot berjalan, sebab begitu data mulai masuk, cukup mudah menggeser standar supaya cocok dengan hasil yang sudah terlihat.",
    },
    {
      type: "h2",
      id: "checklist-ringkas",
      text: "Sepuluh area yang perlu jawaban tertulis",
    },
    {
      type: "ol",
      items: [
        "**Ruang lingkup.** Cabang, rute, dan proses mana yang ikut pilot, dan yang sengaja tidak diikutkan.",
        "**Sampel job.** Jumlah dan jenis transaksi riil yang akan diproses lewat sistem baru.",
        "**Pengguna.** Peran spesifik yang ikut serta, termasuk titik serah terima antar tim, bukan cuma satu departemen.",
        "**Angka dasar.** Dua sampai tiga metrik yang diukur sebelum pilot dimulai, supaya ada pembanding di akhir.",
        "**Kriteria lolos/gagal.** Angka spesifik untuk tiap metrik dasar yang berarti pilot berhasil, dan yang berarti gagal.",
        "**Log kendala.** Tempat pusat mencatat setiap masalah yang muncul, dengan tingkat keparahan dan status.",
        "**Ketergantungan dukungan vendor.** Siapa yang menangani tim Anda selama dan sesudah pilot, dan seberapa sering mereka dibutuhkan.",
        "**Hak ekspor data.** Format dan waktu yang dibutuhkan untuk membawa data keluar kalau kerja sama tidak dilanjutkan.",
        "**Tinjauan keamanan.** Siapa yang punya akses ke data selama pilot, dan apa yang terjadi pada data itu setelah pilot berakhir.",
        "**Gerbang keputusan akhir.** Siapa yang memutuskan lanjut atau berhenti, dan berdasarkan kriteria yang mana.",
      ],
    },
    {
      type: "h2",
      id: "ruang-lingkup",
      text: "1. Ruang lingkup",
    },
    {
      type: "p",
      text: "Godaan paling wajar saat menyusun pilot adalah memilih cabang paling tenang dengan tim paling kooperatif. Hasilnya nyaris pasti terlihat bagus, tapi kesan bagus semacam itu tidak memberi tahu apa pun soal bagaimana sistem akan berperilaku begitu volume naik atau kasusnya lebih rumit dari biasanya.",
    },
    {
      type: "ul",
      items: [
        "Cabang, rute, atau tim yang ikut pilot sudah ditentukan secara tertulis, termasuk alasan kenapa dipilih — idealnya karena paling sibuk atau paling rumit, bukan paling nyaman.",
        "Proses yang diuji sudah jelas cakupannya: end-to-end dari RFQ sampai invoice, atau hanya satu modul tertentu.",
        "Ada daftar tertulis tentang apa yang sengaja tidak termasuk dalam pilot, supaya cakupannya tidak melebar diam-diam di tengah jalan.",
      ],
    },
    {
      type: "p",
      text: "Sistem yang bertahan di proses paling sibuk biasanya lebih mudah diterapkan di tempat lain. Kalau ternyata gagal di sana, hal itu diketahui dengan ongkos satu bulan, jauh lebih murah daripada mengetahuinya setelah kontrak setahun penuh berjalan.",
    },
    {
      type: "h2",
      id: "sampel-job",
      text: "2. Sampel job",
    },
    {
      type: "p",
      text: "Data demo yang dipakai vendor saat presentasi sudah dibersihkan dan dipilih supaya alurnya rapi. Pilot yang hanya memakai skenario serupa akan menghasilkan kesan yang sama rapinya, dan kesan itu tidak banyak bedanya dengan menonton demo sekali lagi.",
    },
    {
      type: "ul",
      items: [
        "Jumlah job minimum yang akan diproses lewat sistem baru selama masa pilot sudah ditetapkan di depan, bukan 'sebanyak yang sempat'.",
        "Sampel mencakup kasus yang biasanya merepotkan di lapangan — multi-drop, retur, perubahan mendadak, back-to-back job — bukan cuma yang alurnya mulus.",
        "Data yang dipakai adalah transaksi operasional riil, bukan data contoh yang sudah disiapkan vendor.",
      ],
    },
    {
      type: "h2",
      id: "pengguna-pilot",
      text: "3. Pengguna",
    },
    {
      type: "p",
      text: "Masalah terbesar dalam sistem logistik biasanya muncul di titik serah terima antar peran, saat data pindah tangan dari satu bagian ke bagian lain, bukan di dalam satu tim yang bekerja sendiri.",
    },
    {
      type: "ul",
      items: [
        "Daftar nama dan peran spesifik yang ikut pilot sudah ditulis, bukan sekadar 'tim operasional'.",
        "Peran-peran yang terlibat dalam alur kerja yang diuji ikut serta bersamaan — kalau prosesnya melibatkan sales, operasional, dan finance, ketiganya memakai sistem yang sama selama pilot, bukan cuma satu pihak yang mengetes lalu melaporkan ke yang lain.",
        "Satu orang ditunjuk sebagai penanggung jawab harian yang mencatat kendala dan memastikan sistem benar-benar dipakai, bukan cuma dicoba sekali di awal.",
      ],
    },
    {
      type: "h2",
      id: "angka-dasar",
      text: "4. Angka dasar",
    },
    {
      type: "p",
      text: "Pilot tanpa angka dasar akhirnya dinilai dari kesan, dan kesan biasanya dimenangkan oleh suara paling keras di ruang rapat. Catat angka-angka ini sebelum hari pertama pilot berjalan, bukan sesudahnya. Beberapa yang biasanya berguna:",
    },
    {
      type: "ul",
      items: [
        "Rata-rata waktu POD kembali ke kantor",
        "Jumlah hari dari job selesai sampai invoice terbit",
        "Berapa banyak pertanyaan status yang masuk per minggu",
        "Waktu respons RFQ di persentil ke-90",
        "Jumlah selisih data antara operasional dan finance setiap bulan",
      ],
    },
    {
      type: "p",
      text: "Pilih dua sampai tiga saja, yang paling dekat dengan alasan Anda mencari sistem baru ini sejak awal. Mengukur sepuluh hal sekaligus kedengarannya teliti, tapi pada praktiknya biasanya tidak ada satu pun yang sempat benar-benar dikumpulkan datanya, dan pilot pun berakhir tanpa angka apa pun untuk dipegang.",
    },
    {
      type: "h2",
      id: "kriteria-lolos-gagal",
      text: "5. Kriteria lolos/gagal",
    },
    {
      type: "p",
      text: "Untuk tiap angka dasar yang dipilih di poin sebelumnya, tuliskan dua angka: angka yang berarti pilot ini berhasil, dan angka yang berarti sebaiknya berhenti. Kalau pertanyaan ini susah dijawab, atau kalau setiap skenario buruk sudah punya alasan pemaafnya sendiri, itu tandanya pilot ini belum benar-benar dirancang untuk bisa gagal.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Pertanyaan yang wajib dijawab sebelum pilot dimulai",
      body: "Sebelum pilot berjalan, tuliskan jawaban untuk satu pertanyaan ini: hasil seperti apa yang akan membuat tim memutuskan berhenti dan tidak melanjutkan? Kriteria ini perlu ditulis sebelum data pertama masuk, sebab begitu hasil sudah terlihat, cukup mudah menggeser standar supaya cocok dengan hasil itu.",
    },
    {
      type: "ul",
      items: [
        "Angka lolos dan angka gagal sudah dituliskan untuk tiap metrik dasar, bukan disimpulkan setelah pilot selesai.",
        "Ada minimal satu skenario yang, kalau terjadi, akan membuat tim memutuskan berhenti — dituliskan secara eksplisit, bukan diandaikan begitu saja.",
        "Kriteria ini disetujui oleh orang yang tidak mengusulkan pembelian sistem ini, supaya penilaiannya tidak berat sebelah.",
      ],
    },
    {
      type: "h2",
      id: "log-kendala",
      text: "6. Log kendala",
    },
    {
      type: "p",
      text: "Kendala yang muncul selama pilot biasanya dibicarakan sekali di grup WhatsApp lalu terlupakan begitu percakapan bergeser ke topik lain. Tanpa catatan terpusat, di akhir pilot yang tersisa cuma kesan samar 'ada beberapa masalah kecil', tanpa data untuk menimbang seberapa besar masalah itu.",
    },
    {
      type: "ul",
      items: [
        "Ada satu tempat pusat mencatat tiap kendala yang muncul selama pilot, terpisah dari percakapan harian di grup chat.",
        "Setiap entri punya tingkat keparahan — misalnya: menghambat pekerjaan, atau sekadar tidak nyaman — dan status penyelesaiannya.",
        "Log ini direview setidaknya mingguan selama pilot berjalan, bukan hanya dibaca sekali di hari terakhir.",
      ],
    },
    {
      type: "h2",
      id: "ketergantungan-support",
      text: "7. Ketergantungan dukungan vendor",
    },
    {
      type: "p",
      text: "Selama pilot, tim vendor biasanya sangat responsif karena proyek ini masih baru dan masih diperhatikan. Yang perlu diperiksa bukan seberapa cepat mereka menjawab sekarang, tapi apa yang terjadi setelah masa perhatian khusus itu selesai.",
    },
    {
      type: "ul",
      items: [
        "Sudah jelas siapa dari pihak vendor yang menangani tim Anda selama pilot, dan apakah orang yang sama akan menangani setelah go-live atau berpindah ke tim support umum.",
        "Ada kejelasan tertulis soal waktu respons yang biasa berlaku untuk pertanyaan atau kendala setelah masa implementasi selesai.",
        "Dicatat berapa kali tim Anda perlu menghubungi support untuk hal yang seharusnya bisa dilakukan sendiri lewat sistem — semakin sering, semakin besar ketergantungan jangka panjangnya.",
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Dua pertanyaan yang jawabannya benar-benar membedakan vendor",
      body: "Minta vendor menceritakan satu implementasi yang sempat tidak berjalan mulus dan apa yang berubah sesudahnya, lalu tanyakan apa yang produknya tidak bisa lakukan. Vendor yang mengaku belum pernah gagal sedang mengatakan sesuatu, entah soal jumlah pelanggannya yang masih sedikit, entah soal kejujurannya. Vendor yang mengiyakan semua permintaan tanpa mempertanyakan apa pun juga bukan tanda fleksibel — itu biasanya tanda percakapan sulitnya ditunda ke fase setelah kontrak diteken.",
    },
    {
      type: "h2",
      id: "hak-ekspor-data",
      text: "8. Hak ekspor data",
    },
    {
      type: "p",
      text: "Pertanyaan ini paling sering dilewatkan karena terasa pesimistis untuk ditanyakan di awal hubungan kerja sama, padahal justru perlu dijawab tertulis sebelum data operasional apa pun masuk ke sistem baru.",
    },
    {
      type: "ul",
      items: [
        "Format ekspor untuk tiap jenis data — job, invoice, data pelanggan, dokumen — sudah dikonfirmasi tertulis, bukan dijanjikan lisan saat demo.",
        "Waktu yang dibutuhkan untuk ekspor data secara penuh sudah diuji langsung selama pilot, bukan diasumsikan dari brosur.",
        "Sudah jelas siapa pemilik data selama masa berlangganan dan setelah kerja sama berakhir, termasuk berapa lama data disimpan di sistem vendor sebelum dihapus.",
      ],
    },
    {
      type: "h2",
      id: "tinjauan-keamanan",
      text: "9. Tinjauan keamanan",
    },
    {
      type: "p",
      text: "Selama pilot, data operasional riil — termasuk data pelanggan dan tarif — sudah masuk ke sistem pihak ketiga. Tinjauan keamanan bukan langkah formalitas yang bisa ditunda sampai kontrak penuh, karena risikonya sudah berjalan sejak hari pertama pilot.",
    },
    {
      type: "ul",
      items: [
        "Daftar siapa saja yang punya akses ke data selama pilot sudah jelas, dan level aksesnya bisa diatur per peran, bukan satu akun admin dipakai bersama.",
        "Lokasi penyimpanan data dan proses backup vendor sudah dikonfirmasi, termasuk apa yang terjadi kalau layanan vendor sedang gangguan.",
        "Ada kesepakatan tertulis tentang apa yang terjadi pada akun dan data pilot setelah pilot berakhir, baik lanjut maupun tidak: akun dinonaktifkan, data dihapus atau dikembalikan sesuai kesepakatan.",
      ],
    },
    {
      type: "h2",
      id: "gerbang-keputusan",
      text: "10. Gerbang keputusan akhir",
    },
    {
      type: "p",
      text: "Ilmu ekonomi punya satu prinsip yang gampang dimengerti tapi susah dijalankan: biaya yang sudah keluar dan tidak bisa ditarik kembali seharusnya tidak ikut memengaruhi keputusan berikutnya. Yang relevan hanya biaya dan manfaat yang masih ada di depan mata. Setelah mengeluarkan waktu dan tenaga untuk pilot, menghentikannya terasa seperti mengakui kesalahan sendiri — itulah salah satu alasan kenapa keputusan akhir sebaiknya tidak diambil oleh orang yang sama yang mengusulkan pembelian ini.",
    },
    {
      type: "p",
      text: "Membeli secara bertahap pada dasarnya adalah membeli waktu untuk belajar lebih dulu, dan waktu itu punya nilai yang bisa dibandingkan lewat dua struktur risiko berikut:",
    },
    {
      type: "table",
      caption: "Membeli sistem yang sama, lewat dua struktur risiko yang berbeda",
      head: ["", "Sekaligus", "Bertahap"],
      rows: [
        ["Kapan komitmen penuh dikunci", "Di awal, saat pengetahuan Anda paling minim", "Menyebar, sebagian setelah Anda belajar lebih banyak"],
        ["Ongkos kalau keputusan ternyata salah", "Seluruh proyek", "Hanya tahap yang sudah berjalan"],
        ["Waktu sampai manfaat pertama terasa", "Lama, karena semua dikerjakan bersamaan", "Cepat, cukup satu proses saja"],
        ["Beban ke tim", "Berat, datang sekaligus", "Terbagi per tahap"],
        ["Paling cocok dipakai kalau", "Prosesnya sudah mapan dan seragam bertahun-tahun", "Masih banyak yang belum diketahui"],
      ],
    },
    {
      type: "p",
      text: "Implementasi sekaligus tetap masuk akal kalau ketidakpastiannya memang rendah, misalnya mengganti sistem lama dengan proses yang sudah berjalan bertahun-tahun tanpa banyak perdebatan. Begitu masih banyak yang belum diketahui, nilai dari opsi untuk berhenti di tengah jalan naik, dan itulah yang didapat lewat pendekatan bertahap.",
    },
    {
      type: "ul",
      items: [
        "Sudah jelas siapa yang berwenang memutuskan lanjut atau berhenti di akhir pilot, dan idealnya bukan orang yang sama yang mengusulkan sistem ini di awal.",
        "Keputusan diambil berdasarkan kriteria lolos/gagal yang ditulis di poin 5, bukan kesan umum yang terbentuk selama pilot berjalan.",
        "Total biaya tahun kedua dan ketiga — termasuk penambahan pengguna dan modul — sudah masuk pertimbangan, bukan cuma harga tahun pertama yang sering disubsidi.",
        "Tanggal keputusan sudah ditetapkan di depan dan tidak bergeser-geser. Perpanjangan pilot yang terus-menerus biasanya tanda tidak ada yang berani menyimpulkan hasilnya, bukan tanda pilotnya memang butuh waktu lebih lama.",
      ],
    },
    {
      type: "h2",
      id: "setelah-pilot",
      text: "Setelah 30 hari: memetakan hasil ke tindakan",
    },
    {
      type: "p",
      text: "Kebanyakan orang menyiapkan diri untuk dua kemungkinan saja: berhasil atau gagal. Di lapangan hampir selalu muncul kemungkinan ketiga, dan kemungkinan ketiga inilah yang paling sering ditangani secara keliru.",
    },
    {
      type: "ul",
      items: [
        "**Lolos sesuai kriteria di poin 5.** Lanjutkan ke tahap berikutnya, dan tetapkan kriteria baru untuk tahap itu — jangan bawa kriteria pilot ke tahap implementasi penuh begitu saja.",
        "**Gagal sesuai kriteria di poin 5.** Hentikan. Biaya yang sudah keluar adalah harga dari informasi yang baru saja didapat, dan itu jauh lebih murah dibanding komitmen penuh yang berhasil dihindari.",
        "**Tidak jelas, karena datanya tidak terkumpul atau tim belum sempat benar-benar memakainya.** Ini bukan hasil netral. Ini kegagalan pada rancangan pilotnya sendiri, biasanya karena salah satu dari sepuluh poin di atas belum punya jawaban tertulis sebelum pilot dimulai. Menjalankannya lagi dengan cara yang sama hanya akan menghasilkan ketidakjelasan yang sama.",
      ],
    },
    {
      type: "p",
      text: "Hasil ketiga ini paling sering muncul, dan paling sering pula disalahartikan sebagai capaian yang cukup untuk lanjut ke tahap berikutnya. Padahal ia sedang memberi tahu satu hal penting: dalam kondisi kerja sehari-hari, tim belum tentu punya kapasitas mengadopsi sistem baru sambil tetap menjalankan operasional seperti biasa. Masalah itu tidak hilang begitu saja di tahap berikutnya — cakupannya justru lebih besar.",
    },
  ],
  faq: [
    {
      q: "Sebaiknya pilot itu berbayar atau gratis?",
      a: "Pilot berbayar cenderung ditanggapi lebih serius oleh kedua pihak, dan itu menguntungkan Anda. Yang lebih menentukan daripada soal bayar-tidaknya adalah kejelasan tertulis tentang apa yang terjadi kalau pilot dinyatakan tidak berhasil: siapa menanggung apa, bagaimana data dikembalikan, dan apakah masih ada kewajiban yang tersisa — persis yang dicek di poin 8 checklist ini.",
    },
    {
      q: "Bagaimana kalau tim menolak sistem baru selama pilot berlangsung?",
      a: "Bedakan dua jenis penolakan. Keluhan yang menunjuk pada hal spesifik, misalnya sistem tidak bisa menangani kasus tertentu, adalah temuan berharga untuk log kendala di poin 6. Penolakan umum tanpa isi biasanya menandakan tujuan perubahannya belum dijelaskan dengan cara yang menjawab pertanyaan paling mendasar bagi semua orang: apa yang berubah dari pekerjaan saya sehari-hari.",
    },
    {
      q: "Perlu membandingkan beberapa vendor lewat pilot sekaligus?",
      a: "Menjalankan dua pilot bersamaan memecah perhatian tim, dan biasanya menghasilkan dua pengujian yang sama-sama terbengkalai. Saring dulu di tahap sebelumnya lewat demo dan percakapan, lalu jalankan pilot sungguhan untuk satu kandidat terkuat saja dengan checklist ini, sehingga tim tetap bisa mundur kalau kriteria di poin 5 tidak terpenuhi.",
    },
  ],
  cta: {
    title: "Hitung angka dasar Anda sebelum pilot dimulai",
    body: "Poin 4 di checklist ini butuh angka dasar yang konkret, bukan kesan. Simulator ROI CargoGrid membantu menghitung baseline biaya dan waktu operasional Anda saat ini, supaya kriteria lolos/gagal di poin 5 punya angka pembanding yang jelas sejak hari pertama pilot.",
    linkHref: "/simulator-roi",
    linkLabel: "Buka Simulator ROI",
  },
  byline: {
    author: "Tim Editorial CargoGrid",
    note: "Checklist ini disusun dari pola implementasi software logistik yang berulang kami amati di lapangan: pilot yang menghasilkan keputusan jelas biasanya punya kriteria tertulis sejak awal, dan yang berakhir tanpa kejelasan biasanya tidak punya.",
  },
  related: ["kapan-excel-berhenti-cukup", "integrasi-erp-akuntansi-logistik", "adopsi-aplikasi-driver"],
};

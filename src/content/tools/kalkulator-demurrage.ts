import type { Tool } from "./types";

export const tool: Tool = {
  slug: "kalkulator-demurrage",
  kind: "kalkulator",
  title: "Kalkulator Free Time, Demurrage, dan Detention",
  titleEn: "Free Time, Demurrage, and Detention Calculator",
  metaTitle: "Kalkulator Demurrage & Free Time Kontainer: Hitung Tanggal Jatuh Tempo | CargoGrid",
  description:
    "Kontainer ini masih berapa hari sebelum kena denda? Kalkulator ini menjawabnya dari tanggal bongkar dan jumlah free time di Delivery Order Anda, sampai ke tanggal terakhir bebas biaya.",
  descriptionEn:
    "How many days does this container have left before charges kick in? This calculator answers that from the discharge date and the free time stated on your Delivery Order, down to the last charge-free day.",
  keywords: [
    "kalkulator demurrage",
    "cara hitung demurrage kontainer",
    "free time kontainer",
    "hitung detention kontainer",
    "denda kontainer pelabuhan",
    "tanggal jatuh tempo free time",
  ],
  summary:
    "Denda kontainer jarang perlu jadi kejutan. Tanggal jatuh temponya sudah bisa diperkirakan sejak hari kontainer turun dari kapal, dengan catatan pelayaran Anda memang menghitung free time dari tanggal bongkar itu dan bukan dari titik lain. Kalkulator ini melakukannya dalam sepuluh detik, lengkap dengan tarif berjenjang, sehingga perhitungannya terjadi saat masih bisa mengubah keputusan.",
  summaryEn:
    "Container charges rarely need to be a surprise. The due date can be estimated from the day the container comes off the vessel, provided your carrier actually counts free time from that discharge date and not from some other point. This calculator does it in ten seconds, tiered tariffs included, so the calculation happens while it can still change a decision.",
  searchIntents: [
    "Cara menghitung demurrage kontainer",
    "Kapan free time kontainer habis",
    "Beda demurrage dan detention",
    "Apakah hari libur ikut memakan free time",
    "Estimasi biaya keterlambatan pengambilan kontainer",
  ],
  searchIntentsEn: [
    "How to calculate container demurrage",
    "When does container free time run out",
    "Difference between demurrage and detention",
    "Do holidays count against free time",
    "Estimating the cost of late container pickup",
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
      text: "Yang diasumsikan kalkulator ini, dan yang perlu dipastikan ke pelayaran",
    },
    {
      type: "p",
      text: "Kalkulator ini menghitung dari tanggal bongkar (hari kontainer turun dari kapal) sebagai titik mula free time. Itu konvensi paling umum dipakai di pelabuhan Indonesia, tapi bukan satu-satunya: sebagian pelayaran atau terminal menghitung mulai dari tanggal kontainer dinyatakan tersedia diambil, sebagian lain dari tanggal gate-out, dan sebagian menggabungkan free time demurrage dengan detention jadi satu pool hari alih-alih memisahkannya seperti pada tabel di atas. Kalau kontrak Anda memakai titik mula atau konvensi yang berbeda, sesuaikan tanggal yang dimasukkan ke kalkulator, jangan asumsikan tanggal bongkar selalu berlaku.",
    },
    {
      type: "p",
      text: "Di luar titik mula itu, kalkulator ini juga menanyakan dua hal lain yang biasanya diasumsikan orang begitu saja, padahal keduanya berbeda antar pelayaran dan masing-masing bernilai satu hari denda penuh.",
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
      text: "Ketiga jawaban itu ada di Delivery Order dan di kontrak dengan pelayaran. Menanyakannya sekali, lalu mencatatnya per pelayaran, menghilangkan sebagian besar kelas kejutan ini. Tapi kalau hasil kalkulator ini pernah berbeda dari yang tertulis di invoice, invoice dan kontrak pelayaranlah yang berlaku: angka di halaman ini adalah estimasi untuk perencanaan internal, bukan dokumen penagihan resmi.",
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
      text: "Angka jenjang bawaan pada kalkulator ini hanya contoh ilustrasi, bukan tarif carrier tertentu. Ganti dengan angka dari Delivery Order Anda sendiri sebelum hasilnya dipakai untuk apa pun yang serius.",
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
  blocksEn: [
    {
      type: "h2",
      id: "kenapa-jarang-dihitung",
      text: "Why this calculation is almost always done too late",
    },
    {
      type: "p",
      text: "The arithmetic is trivial: discharge date plus free time gives the deadline. Yet almost no one calculates it on the day the container comes off the vessel, when the answer could still change something. Everyone calculates it three weeks later when the invoice arrives, and by then the only thing left to discuss is the amount.",
    },
    {
      type: "p",
      text: "That is why this page exists. Not because the formula is difficult, but because moving the calculation earlier is the only change that actually brings the amount down.",
    },
    {
      type: "h2",
      id: "beda-demurrage-detention",
      text: "Demurrage and detention are not the same thing",
    },
    {
      type: "table",
      caption: "Two charges, two triggers, two teams that need to act",
      head: ["", "Demurrage", "Detention"],
      rows: [
        ["What it applies to", "Container still inside the terminal", "Container has left the terminal, not yet returned"],
        ["Starts running", "After terminal free time expires", "After container-usage free time expires"],
        ["Most common cause", "Customs documents not yet completed, SPPB not yet issued", "Unloading at the warehouse runs late, long queue at the depot"],
        ["Who can fix it", "Documentation and customs team", "Warehouse and fleet team"],
      ],
    },
    {
      type: "p",
      text: "This distinction is not just terminology. Once both charges are lumped into one line item called port costs, the trail to the root cause disappears, even though the documentation desk and the warehouse floor need entirely different fixes.",
    },
    {
      type: "h2",
      id: "hari-kalender",
      text: "Free time runs in calendar days",
    },
    {
      type: "p",
      text: "This is the trap that catches the most people, and the easiest one to avoid. Free time is counted in calendar days: Saturdays, Sundays, and national holidays count exactly like working days. A container discharged three days before a long holiday can lose most of its allowance before a single process has even started.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Next year's most expensive periods can already be marked now",
      body: "Lebaran, Christmas, New Year, and joint leave days are all on the calendar well in advance. For shipments whose schedule is still flexible, shifting the arrival date by a few days is far cheaper than absorbing the charge, and that decision is cheapest to make at booking time, not once the vessel is already at sea.",
    },
    {
      type: "h2",
      id: "dua-konvensi",
      text: "What this calculator assumes, and what to confirm with your carrier",
    },
    {
      type: "p",
      text: "This calculator counts from the discharge date (the day the container comes off the vessel) as the start of free time. That is the most common convention at Indonesian ports, but not the only one: some carriers or terminals start counting from the date the container is declared available for pickup, others from the gate-out date, and some pool demurrage and detention free time into a single day count instead of separating them as in the table above. If your contract uses a different starting point or convention, adjust the date you enter into the calculator; do not assume the discharge date always applies.",
    },
    {
      type: "p",
      text: "Beyond that starting point, this calculator also asks two other questions people usually just assume the answer to, even though both vary by carrier and each one is worth a full day's charge.",
    },
    {
      type: "ol",
      items: [
        "**Is the discharge day counted as the first day of free time?** Some carriers count it, some start counting the next day. The difference is exactly one day, and one day at the highest tariff tier is not a number you can ignore.",
        "**Does the tariff tier numbering restart from the first chargeable day?** Usually yes, tiers are written as day 1 through day 3 after free time. This calculator uses that assumption, and the tier table can be edited entirely if yours is different.",
      ],
    },
    {
      type: "p",
      text: "All three answers are in the Delivery Order and in the contract with the carrier. Asking once, then recording it per carrier, eliminates most of this class of surprise. But if this calculator's result ever differs from what is on the invoice, the invoice and the carrier contract govern: the numbers on this page are an estimate for internal planning, not an official billing document.",
    },
    {
      type: "h2",
      id: "tarif-berjenjang",
      text: "Tiered tariffs, and why charges rise faster than expected",
    },
    {
      type: "p",
      text: "Demurrage tariffs almost always step up. The third-week rate is often three to five times the first-week rate. As a result, a delay that is twice as long can cost four times as much, and the intuition that \"a few more days late is fine\" is almost always wrong in the same direction.",
    },
    {
      type: "p",
      text: "The default tier figures in this calculator are illustrative examples only, not any specific carrier's tariff. Replace them with the figures from your own Delivery Order before using the result for anything that matters.",
    },
    {
      type: "h2",
      id: "dari-hitungan-ke-kebiasaan",
      text: "From a one-off calculation to ongoing monitoring",
    },
    {
      type: "p",
      text: "The calculator answers for one container. The real problem is thirty containers with free time running simultaneously, each with a different deadline, and no one holding a ranked list of them. As long as those deadlines live only in the documentation officer's head, charges will keep happening occasionally without ever being fully explained.",
    },
    {
      type: "p",
      text: "The fix does not need a new system to get started: simply sequence documentation work by remaining free time, not by container arrival date. Scheduling theory has long shown that prioritizing the nearest deadline produces the smallest total delay. What's needed is just a deadline list everyone can see.",
    },
  ],
  faq: [
    {
      q: "Bagaimana cara menghitung demurrage kontainer?",
      a: "Ambil tanggal bongkar kontainer sebagai titik mula default, tambahkan jumlah hari free time dari Delivery Order, dan Anda mendapat perkiraan hari bebas terakhir. Konfirmasi dulu apakah pelayaran Anda memang menghitung dari tanggal bongkar, karena sebagian menghitung dari titik lain. Setiap hari kalender setelah itu sampai kontainer diambil adalah hari yang berpotensi tertagih, dikalikan tarif jenjang yang berlaku pada hari tersebut. Hasilnya estimasi untuk perencanaan; invoice resmi dari pelayaran tetap jadi acuan akhir.",
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
  faqEn: [
    {
      q: "How do you calculate container demurrage?",
      a: "Take the container's discharge date as the default starting point, add the number of free time days from the Delivery Order, and you get an estimate of the last charge-free day. Confirm first whether your carrier actually counts from the discharge date, since some count from a different point. Every calendar day after that until the container is picked up is a potentially chargeable day, multiplied by the tier rate in effect on that day. The result is an estimate for planning; the carrier's official invoice remains the final reference.",
    },
    {
      q: "Do Saturdays, Sundays, and national holidays count against free time?",
      a: "Yes. Free time is counted in calendar days, not working days. This is why a container arriving just before a long holiday carries much higher risk even if not a single process is delayed.",
    },
    {
      q: "What is the difference between demurrage and detention?",
      a: "Demurrage runs while the container is still inside the terminal past free time. Detention runs after the container has left the terminal but has not yet been returned to the depot. The causes, and the teams that can fix them, are different.",
    },
    {
      q: "Is the discharge day counted as the first day of free time?",
      a: "It depends on the carrier. Some count it as the first day, some start counting the next day. The difference is one full day's charge, so confirm with the carrier and record the answer per operator.",
    },
    {
      q: "Is storage the same as demurrage?",
      a: "No. Storage is billed by the terminal for the stacking space the container occupies, while demurrage is billed by the carrier. One late container can receive two separate invoices from two different parties for the same delay.",
    },
  ],
  relatedArticles: ["demurrage-detention-pelabuhan", "dokumen-kepabeanan-arsip-digital", "tracking-multimoda-indonesia"],
  relatedTools: ["ukuran-kontainer", "kamus-logistik", "incoterms-2020"],
};

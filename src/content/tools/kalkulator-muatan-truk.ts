import type { Tool } from "./types";

export const tool: Tool = {
  slug: "kalkulator-muatan-truk",
  kind: "kalkulator",
  title: "Kalkulator Muatan Truk: Berapa Kardus Muat di CDD, Fuso, atau Tronton",
  titleEn: "Truck Load Calculator: How Many Cartons Fit in a CDD, Fuso, or Tronton",
  metaTitle: "Kalkulator Muatan Truk: Hitung Kapasitas CDE, CDD, Fuso, Tronton | CargoGrid",
  description:
    "Sedang menentukan CDD atau Fuso untuk kiriman ini? Masukkan ukuran kardus, berat per kardus, dan jumlahnya, lalu kalkulator ini menyebutkan batas mana yang mengikat lebih dulu, ruang atau berat.",
  descriptionEn:
    "Deciding between a CDD or Fuso for this shipment? Enter the carton dimensions, weight per carton, and quantity, and this calculator tells you which limit binds first, space or weight.",
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
  summaryEn:
    "Three things limit every load: the space inside the cargo bed, the weight limit it is allowed to carry, and the road class it travels on. This calculator computes all three separately, states which one binds first, then tells you how many truck units the full shipment requires.",
  searchIntents: [
    "Berapa kardus muat di truk CDD",
    "Kapasitas kubikasi truk Fuso dan tronton",
    "Ukuran bak dalam truk CDE, CDD, dan wingbox",
    "Butuh berapa truk untuk mengirim sekian kardus",
    "Muatan penuh tapi berat masih di bawah batas, normalkah",
  ],
  searchIntentsEn: [
    "How many cartons fit in a CDD truck",
    "Cubic capacity of Fuso and Tronton trucks",
    "Internal cargo bed dimensions of CDE, CDD, and wingbox trucks",
    "How many trucks are needed to ship a given number of cartons",
    "Load is full but weight is still under the limit, is that normal",
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
  blocksEn: [
    {
      type: "h2",
      id: "tiga-batas",
      text: "Every load is limited by three things, and only one of them is felt",
    },
    {
      type: "p",
      text: "A truck stops taking on cargo for one of two reasons: the bed is full, or the weight has hit its ceiling. The two are rarely reached at the same time, and that is the root of nearly every argument on the loading dock. The warehouse crew sees a gap and is confident one more pallet will fit. The driver who will later face the weighbridge sees an entirely different problem.",
    },
    {
      type: "p",
      text: "That is why this calculator never returns a single \"fits this many\" figure. It returns two limits side by side and states which one binds, because that is the fact that actually drives the decision. A load constrained by space needs tighter packing or a larger bed. A load constrained by weight needs additional units, and no amount of clever stacking will change that.",
    },
    {
      type: "p",
      text: "The third limit has nothing to do with cartons or scales: the road class the route travels on. A Class III road restricts vehicle width to 2.1 meters, and a standard body of 2.4 to 2.5 meters cannot pass through it no matter what it carries. The first two limits answer how much fits; the third answers whether the load is allowed to move at all, and only the third one can stop a vehicle mid-route.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "The weight limit comes from the road, not the truck",
      body: "The capacity listed on a vehicle's spec sheet is the manufacturer's design capability. What determines legality is JBI, the weight permitted for the road class the route travels on, and that figure can be lower. The same truck can legally carry one tonnage on one route and violate the limit on another.",
    },
    {
      type: "h2",
      id: "cara-menghitung",
      text: "How the numbers are calculated",
    },
    {
      type: "p",
      text: "The space calculation is deliberately conservative. The calculator tries six carton orientations, and for each one computes how many fit lengthwise along the bed, how many fit across, and how many layers stack upward, rounds each result down, then takes the best arrangement.",
    },
    {
      type: "p",
      text: "An experienced loading crew will almost always beat this number, because they mix carton orientations and fill in the remaining gaps. That is deliberate. A calculator that assumes the smartest possible packing would produce a figure the warehouse floor cannot actually deliver, and by then that figure is already locked into the quote. It is better to promise slightly less and load more, than the other way around.",
    },
    {
      type: "table",
      caption: "What to do based on which limit binds",
      head: ["Binding limit", "What it means", "What usually works"],
      rows: [
        [
          "Space",
          "Bed is full, scale still has headroom",
          "Pack tighter, consider a taller body such as a wingbox, or review carton dimensions on the production side",
        ],
        [
          "Weight",
          "Scale is maxed out, bed still has room",
          "Add a unit, or split the shipment. Repacking will not help at all",
        ],
        [
          "Both at once",
          "The carton-and-truck combination is well matched",
          "Nothing needs to change. Record this combination as a reference for similar shipments",
        ],
      ],
    },
    {
      type: "h2",
      id: "kepatuhan",
      text: "Checks before dispatch",
    },
    {
      type: "p",
      text: "Once the load plan is set, the calculator checks it against the road class you select and states what needs to be confirmed: whether the body width still clears, whether the vehicle length is still permitted, and the rough weight ceiling under the maximum axle load (MST) for that road class. The toll class and the ferry-crossing class for that fleet category are also shown, because both feed into route cost.",
    },
    {
      type: "p",
      text: "This tool does not decide whether a load is permitted. It does not know the STNK (vehicle registration) of the unit that will be used, does not know its unladen weight after bodywork, and does not know the route permit, so it states what needs to be checked and where the exact figures are found, rather than declaring something legal or illegal. The only thing it states flatly is what is simply impossible: a cargo space wider than the vehicle's width limit almost always means a typo or a unit mismatch.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "MST limits per axle, not total weight",
      body: "A truck can pass the total weight limit and still violate the rule because the load is stacked toward the rear, so one axle carries more than its share. This means how cargo is arranged on the bed is not just a matter of tidiness, weight distribution along the bed determines whether the same vehicle with the exact same tonnage is legal or not.",
    },
    {
      type: "h2",
      id: "angka-spesifikasi",
      text: "Why the spec figures here are ranges",
    },
    {
      type: "p",
      text: "Bed dimensions come from the body builder (karoseri), not from the chassis manufacturer. Two trucks with the exact same badge can differ in bed height by twenty centimeters, and twenty centimeters is one full carton layer. Weight capacity likewise depends on the vehicle's own unladen weight, which varies between bodies.",
    },
    {
      type: "p",
      text: "Every figure in this calculator can therefore be overridden. The prefilled values are a reasonable starting point for the Indonesian fleet; the correct figure is the one you measure yourself on the yard, once, and then reuse. Measuring your own fleet's beds is half a day of work whose payoff lasts for years.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Overloading is a cost, not a saving",
      body: "Overloading shifts cost from today's freight charge to next month's maintenance, fines, and accident risk. That shift is never recorded as a single decision, so it never shows up as a single cost. An honest calculation up front is far cheaper than a recalculation at the weighbridge.",
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
  faqEn: [
    {
      q: "What is the cubic capacity of a CDD truck?",
      a: "A standard CDD bed measures roughly 4.5 x 2.0 x 2.0 meters, about 18 cubic meters, with an estimated payload of 3.5 to 5.5 tons. The long version extends the bed to about 5.8 meters, roughly 26 cubic meters, without adding weight capacity, so it suits light, high-volume goods and is wasted on dense cargo.",
    },
    {
      q: "What is the capacity of a Tronton and a wingbox?",
      a: "A three-axle Tronton with a long box body has a bed of about 8.5 x 2.4 x 2.5 meters, roughly 51 cubic meters, with an estimated payload of 10 to 16 tons. A two-axle wingbox is smaller, about 42 cubic meters with a payload of 5.5 to 9 tons. A wingbox on a trailer combination is much larger, about 76 cubic meters with a payload of 18 to 28 tons. Side walls that open fully make forklift loading considerably faster for palletized cargo.",
    },
    {
      q: "Why is the bed already full while the weight is still well under capacity?",
      a: "Because your cargo is light relative to its volume. This is normal for textiles, plastic packaging, foam, and boxed finished goods. What needs evaluating is packing density, not the choice of truck.",
    },
    {
      q: "Can this calculator's result be used directly in a quote?",
      a: "Yes, as a baseline, keeping in mind the figure is conservative. The space calculation uses a single uniform carton orientation, whereas loading crews usually mix orientations and fit in more. For recurring shipments, calibrate once against the actual loaded result and then use that figure going forward.",
    },
    {
      q: "Why does the result change when I switch the road class?",
      a: "Because road class sets the width, length, and maximum axle load limits for the route traveled, and these figures differ between classes. A Class I road permits a width of 2.5 meters, a length of 18 meters, and an MST of 10 tons; Class III restricts width to 2.1 meters, length to 9 meters, and MST to 8 tons. The vehicle itself does not change; the road it travels on does.",
    },
    {
      q: "What is the difference between JBB and JBI?",
      a: "JBB is the total weight limit per the vehicle manufacturer's design. JBI is the limit permitted on a given road class, and it can be lower than JBB. What determines a violation at the weighbridge is JBI.",
    },
  ],
  sources: [
    { label: "PP 55/2012", detail: "Batas lebar, panjang, dan tinggi kendaraan bermotor, serta konsep JBB dan JBI yang menentukan payload legal." },
    { label: "PP 79/2013 dan Permen PUPR 13/2024", detail: "Parameter kelas jalan dan muatan sumbu terberat yang dipakai pada pemeriksaan rute." },
    { label: "Kepmen PUPR 176/KPTS/M/2025 dan ketentuan penyeberangan ASDP", detail: "Penggolongan kendaraan di jalan tol dan di kapal penyeberangan." },
  ],
  sourcesEn: [
    { label: "PP 55/2012", detail: "Width, length, and height limits for motor vehicles, and the JBB and JBI concepts that determine legal payload." },
    { label: "PP 79/2013 dan Permen PUPR 13/2024", detail: "Road class parameters and maximum axle load (MST) used in the route check." },
    { label: "Kepmen PUPR 176/KPTS/M/2025 dan ketentuan penyeberangan ASDP", detail: "Vehicle classification on toll roads and on ferry crossings." },
  ],
  relatedArticles: ["odol-timbangan-jembatan-muatan-lebih", "perawatan-armada-preventif-vs-reaktif", "lonjakan-musiman-kapasitas-peak-season"],
  relatedTools: ["jenis-truk-indonesia", "kalkulator-cbm", "ukuran-kontainer"],
};

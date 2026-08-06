import type { Tool } from "./types";

export const tool: Tool = {
  slug: "biaya-operasional-truk",
  kind: "kalkulator",
  title: "Kalkulator Biaya Operasional Truk: Cost per KM, per Rit, dan per Ton-KM",
  titleEn: "Truck Operating Cost Calculator: Cost per KM, per Trip, and per Ton-KM",
  metaTitle: "Kalkulator Biaya Operasional Truk: Cost per KM & Harga Jual Minimum | CargoGrid",
  description:
    "Tarif yang Anda tawarkan sudah menutup biaya sebenarnya, atau baru terasa aman di atas kertas? Kalkulator ini menyusun biaya tetap, bahan bakar, dan uang jalan armada Anda menjadi satu angka pembanding: biaya per kilometer bermuatan.",
  descriptionEn:
    "Does the rate you're quoting actually cover your real cost, or does it only look safe on paper? This calculator assembles your fleet's fixed costs, fuel, and per-diem into one comparison figure: cost per loaded kilometer.",
  keywords: [
    "cost per km truk",
    "biaya operasional truk per km",
    "hitung tarif angkutan darat",
    "biaya per ton km",
    "menentukan tarif trucking",
    "harga pokok jasa angkutan",
  ],
  summary:
    "Menentukan tarif tanpa tahu biaya sendiri adalah menebak dengan langkah tambahan. Kalkulator ini menyusun komponen biaya utama satu unit, dari penyusutan sampai uang jalan, lalu mengubahnya menjadi titik awal untuk menjawab penawaran: biaya per rit, per kilometer bermuatan, per ton-km, dan harga jual minimum. Komponen yang sifatnya situasional, seperti rit kosong di luar pola yang dipilih, hari tidak beroperasi, overhead kantor, dan risiko rute, tetap perlu ditambahkan sendiri sebelum angkanya dipakai sebagai dasar penawaran.",
  summaryEn:
    "Setting a rate without knowing your own cost is guessing with an extra step. This calculator assembles a single unit's main cost components, from depreciation to per-diem, then turns them into a starting point for answering a quote: cost per trip, per loaded kilometer, per ton-km, and minimum selling price. Situational components, such as empty legs outside the selected route pattern, non-operating days, office overhead, and route risk, still need to be added separately before the figures are used as the basis for a quote.",
  searchIntents: [
    "Cara menghitung biaya operasional truk per kilometer",
    "Menentukan tarif angkutan darat yang tidak rugi",
    "Berapa biaya per ton-km armada sendiri",
    "Kenapa rit balik kosong membuat tarif jadi mahal",
    "Harga jual minimum agar margin sesuai target",
  ],
  searchIntentsEn: [
    "How to calculate truck operating cost per kilometer",
    "Setting a road freight rate that doesn't lose money",
    "What is the cost per ton-km for my own fleet",
    "Why an empty return leg makes the rate expensive",
    "Minimum selling price to hit a target margin",
  ],
  publishedAt: "2026-08-05",
  blocks: [
    {
      type: "h2",
      id: "kenapa-tarif-sering-meleset",
      text: "Kenapa tarif yang terasa aman ternyata rugi",
    },
    {
      type: "p",
      text: "Cara paling umum menghitung tarif adalah menjumlahkan solar, uang jalan, dan tol, lalu menambahkan sekian persen. Hasilnya hampir selalu terlalu rendah, dan sebabnya bukan aritmetika melainkan pos yang tidak ikut terhitung.",
    },
    {
      type: "p",
      text: "Truk tetap menyusut ketika sedang parkir. Cicilannya tetap berjalan, asuransinya tetap dibayar, sopirnya tetap digaji, dan bagian dari biaya kantor tetap melekat padanya. Semua itu tidak muncul di kuitansi mana pun sepanjang perjalanan, sehingga tidak pernah terasa sebagai biaya rit ini, padahal justru pos inilah yang biasanya terbesar.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Biaya tetap dibebankan ke seluruh kilometer, termasuk yang kosong",
      body: "Truk yang pulang tanpa muatan tetap menyusut dan tetap digaji sopirnya. Karena itu seluruh biaya perjalanan, bermuatan maupun kosong, harus ditanggung oleh kilometer yang menghasilkan pendapatan saja. Itulah sebabnya biaya per km bermuatan selalu lebih tinggi daripada biaya per km total, dan selisih keduanya adalah harga yang Anda bayar untuk rit balik kosong.",
    },
    {
      type: "h2",
      id: "cara-kerja",
      text: "Bagaimana perhitungannya disusun",
    },
    {
      type: "p",
      text: "Urutannya sengaja dipertahankan seperti model biaya armada pada umumnya, karena urutan itulah yang membuat hasilnya bisa ditelusuri kembali ketika ada yang mempertanyakan angkanya.",
    },
    {
      type: "ol",
      items: [
        "**Penyusutan tahunan** = (harga perolehan dikurangi nilai sisa) dibagi umur ekonomis.",
        "**Biaya tetap tahunan** = penyusutan ditambah cicilan, asuransi, pajak dan perizinan, gaji tetap awak, langganan sistem, serta overhead yang dibebankan.",
        "**Biaya tetap per kilometer** = biaya tetap tahunan dibagi kilometer efektif setahun, yaitu rencana kilometer dikali faktor ketersediaan armada.",
        "**Biaya bahan bakar per rit** dihitung terpisah untuk jarak bermuatan dan jarak kosong, karena konsumsinya memang berbeda dan pos ini yang paling besar.",
        "**Biaya ban per kilometer** = harga satu set dibagi umur pakainya, ditambah perawatan, pelumas, dan cairan aditif.",
        "**Biaya per rit** = biaya tetap per km dikali jarak total, ditambah bahan bakar, ditambah biaya jalan per km dikali jarak total, ditambah pos per rit seperti tol, penyeberangan, bongkar muat, dan uang jalan.",
      ],
    },
    {
      type: "p",
      text: "Dari satu angka biaya per rit itu, seluruh turunan yang dipakai bernegosiasi mengalir sendiri: biaya per kilometer bermuatan untuk membandingkan lane, biaya per ton-km untuk membandingkan efisiensi armada, dan harga jual minimum untuk memastikan margin yang dituju benar-benar tercapai.",
    },
    {
      type: "h2",
      id: "pola-rute",
      text: "Pulang pergi atau sekali jalan: pilih polanya, jangan hitung sendiri",
    },
    {
      type: "p",
      text: "Perhitungan biaya bekerja dengan dua jarak yang terpisah, kilometer bermuatan dan kilometer kosong, dan pemisahan itu memang yang benar, karena hanya kilometer bermuatan yang menghasilkan pendapatan. Persoalannya, tidak ada yang menyimpan rutenya dalam bentuk itu. Yang orang tahu adalah \"Jakarta-Surabaya, pulang kosong\".",
    },
    {
      type: "p",
      text: "Karena itu kalkulator ini menanyakan pola rutenya lebih dulu, lalu jarak sekali jalan. Sisanya dihitung sendiri.",
    },
    {
      type: "table",
      caption: "Contoh pada rute sekali jalan 500 km",
      head: ["Pola rute", "Km bermuatan", "Km kosong", "Kapan dipakai"],
      rows: [
        ["Pulang pergi, balik kosong", "500", "500", "Pola paling umum. Separuh jarak tidak menghasilkan pendapatan tetapi tetap memakan solar, ban, dan waktu sopir"],
        ["Pulang pergi, dua arah bermuatan", "1.000", "0", "Ada muatan balik yang membayar. Jarak tempuhnya sama persis, tetapi biaya per kilometer bermuatan turun tajam"],
        ["Sekali jalan saja", "500", "0", "Kendaraan tidak kembali, atau perjalanan baliknya sudah dibebankan ke pekerjaan lain"],
        ["Atur sendiri", "diisi manual", "diisi manual", "Muatan balik sebagian, jarak posisi awal, atau rute dengan beberapa titik singgah"],
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Kesalahan termahal di halaman ini",
      body: "Mengisi jarak sekali jalan lalu lupa rit baliknya sama sekali. Biaya per rit langsung terlihat separuh dari yang sebenarnya, dan tarif yang lahir dari situ merugi pada setiap rit, tanpa ada satu pos pun yang kelihatan janggal saat diperiksa ulang. Memilih pola rute lebih dulu menutup kemungkinan itu.",
    },
    {
      type: "h2",
      id: "angka-awal",
      text: "Angka awal mengikuti kelas armada, dan tetap harus Anda ganti",
    },
    {
      type: "p",
      text: "Beberapa pos tidak sedikit berbeda antar kelas armada, melainkan berbeda berkali-kali lipat. Rangkaian tractor head menempuh sekitar 2,5 kilometer per liter; truk ringan bisa tiga kali lipat itu. Karena itu mengganti pilihan armada ikut mengganti konsumsi bahan bakar, harga perolehan, umur ban, dan gaji tetap awak. Biaya ban dan perawatan ikut menyesuaikan dengan sendirinya, karena keduanya dihitung sebagai porsi harga kendaraan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Konsumsi bahan bakar tidak punya angka baku",
      body: "Kilometer per liter ditentukan medan, bobot muatan, umur mesin, gaya mengemudi, dan seberapa sering kendaraan terjebak macet. Dua unit yang persis sama pada rute yang berbeda bisa berselisih puluhan persen. Angka awal di sini hanya supaya kolomnya tidak kosong dan tidak meleset kelas. Angka yang benar ada di catatan pengisian solar armada Anda sendiri, dan karena bahan bakar adalah pos biaya terbesar, itulah yang paling layak diukur lebih dulu.",
    },
    {
      type: "p",
      text: "Prinsip yang sama berlaku untuk harga perolehan: yang ditampilkan adalah kisaran wajar untuk kelas tersebut, bukan harga yang berlaku bagi Anda. Semua kolom bisa ditimpa, dan sebaiknya memang ditimpa sebelum hasilnya dipakai menetapkan tarif.",
    },
    {
      type: "h2",
      id: "ban-dan-perawatan",
      text: "Ban dan perawatan dihitung sebagai persentase harga kendaraan",
    },
    {
      type: "p",
      text: "Tiga pos ini, harga satu set ban, biaya perawatan, dan pelumas, tidak diisi dalam rupiah, melainkan sebagai porsi harga kendaraan. Ini cara yang lazim dipakai dalam analisis biaya armada, dan alasannya praktis: biaya ban dan perawatan pada dasarnya memang mengikuti harga kendaraan. Truk yang lebih mahal memakai ban yang lebih besar, suku cadang yang lebih mahal, dan interval servis yang lebih menuntut.",
    },
    {
      type: "table",
      caption: "Rasio perencanaan yang dipakai sebagai titik awal",
      head: ["Pos", "Porsi", "Dari", "Artinya pada truk Rp 1,5 miliar"],
      rows: [
        ["Satu set ban", "6%", "Harga perolehan", "Rp 90 juta per set"],
        ["Perawatan dan perbaikan", "10% per tahun", "Harga perolehan", "Rp 150 juta setahun"],
        ["Oli dan bahan habis pakai", "12%", "Biaya perawatan", "Rp 18 juta setahun"],
      ],
    },
    {
      type: "p",
      text: "Perhatikan bahwa perawatan dinyatakan per **tahun**, lalu dibagi kilometer efektif setahun untuk menjadi biaya per kilometer. Pembagian itu yang membuat rasio ini jujur: armada yang menempuh 150.000 kilometer setahun menanggung tagihan perawatan tahunan yang kurang lebih sama dengan armada yang menempuh 60.000 kilometer, sehingga biaya per kilometernya memang lebih rendah. Menyatakannya langsung sebagai rupiah per kilometer akan menyembunyikan hubungan itu, dan hubungan itulah yang menjelaskan kenapa armada yang jarang jalan sulit bersaing harga.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Nominalnya tetap ditampilkan",
      body: "Di bawah setiap kolom persentase, kalkulator menampilkan nilai rupiahnya, per set, per tahun, dan per kilometer. Persentase yang tidak bisa dikembalikan ke rupiah adalah persentase yang tidak bisa diperiksa siapa pun, dan angka yang tidak bisa diperiksa tidak layak dipakai menetapkan harga.",
    },
    {
      type: "p",
      text: "Rasio ini rasio perencanaan, bukan standar terbitan. Armada dengan disiplin perawatan yang baik pada rute ringan berada di bawahnya; armada tua di medan berat berada jauh di atasnya. Ketiganya bisa diubah, dan armada yang sudah punya catatan biaya bengkel sendiri sebaiknya memakai angkanya sendiri.",
    },
    {
      type: "h2",
      id: "tol-dan-penyeberangan",
      text: "Kenapa tarif tol dan penyeberangan harus Anda isi sendiri",
    },
    {
      type: "p",
      text: "Dua kolom itu sengaja dikosongkan dari angka bawaan yang mengikat, dan itu keputusan yang disengaja. Tarif tol berbeda per ruas jalan; tarif penyeberangan berbeda per lintasan. Keduanya juga berubah menurut tanggal berlaku.",
    },
    {
      type: "p",
      text: "Menanam satu tarif nasional ke dalam alat ini berarti menerbitkan angka yang akan salah dalam hitungan bulan, dan tidak akan ada yang tahu kapan mulai salahnya, termasuk Anda, yang justru memakainya menetapkan tarif. Karena itu kedua kolom itu dimulai dari nol, bukan dari angka contoh. Angka contoh yang terlihat masuk akal akan ikut terbawa ke hasil oleh sebagian orang tanpa pernah diperiksa; kolom nol menuntut perhatian.",
    },
    {
      type: "ol",
      items: [
        "Pilih armada di bagian atas. Alat ini langsung menyebutkan **golongan tol** dan **golongan penyeberangan** kelas tersebut, dan mengulangnya tepat di sebelah kolom yang harus diisi.",
        "Cari tarif untuk golongan itu pada ruas tol dan lintasan penyeberangan yang benar-benar dilewati rute Anda.",
        "Masukkan totalnya per rit, jangan lupa menjumlahkan perjalanan berangkat dan pulang, karena seluruh perhitungan di halaman ini berbasis satu rit utuh.",
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Golongan tol dan golongan penyeberangan tidak sama",
      body: "Golongan tol mengikuti jumlah gandar; golongan penyeberangan mengikuti panjang keseluruhan kendaraan. Truk bergandar dua yang berbadan panjang bisa masuk golongan penyeberangan lebih tinggi daripada truk bergandar tiga yang pendek. Memakai golongan tol untuk mencari tarif kapal akan meleset, dan biasanya ke arah yang merugikan.",
    },
    {
      type: "h2",
      id: "faktor-ketersediaan",
      text: "Faktor ketersediaan: pos yang paling sering dilebih-lebihkan",
    },
    {
      type: "p",
      text: "Rencana seratus dua puluh ribu kilometer setahun terdengar wajar sampai dikurangi hari servis, hari menunggu muatan, hari sopir cuti, dan hari kendaraan rusak. Faktor ketersediaan adalah tempat kejujuran itu dimasukkan.",
    },
    {
      type: "p",
      text: "Menaikkannya dari 0,85 menjadi 0,95 akan menurunkan biaya tetap per kilometer sekitar sepuluh persen di layar, dan tidak menurunkan apa pun di dunia nyata. Yang terjadi hanyalah tarif ditetapkan berdasarkan pemanfaatan yang tidak pernah tercapai, lalu selisihnya muncul sebagai kerugian di akhir tahun tanpa ada satu rit pun yang bisa ditunjuk sebagai penyebabnya.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Dua angka pemanfaatan harus saling cocok",
      body: "Jumlah rit setahun dikali jarak per rit seharusnya mendekati rencana kilometer dikali faktor ketersediaan. Kalau keduanya berselisih jauh, salah satunya keliru, dan seluruh angka per kilometer ikut terbawa. Kalkulator ini memeriksa kecocokan itu dan memberi tahu bila selisihnya melebihi sepuluh persen.",
    },
    {
      type: "h2",
      id: "rit-kosong",
      text: "Rit balik kosong: pos biaya terbesar yang tidak pernah ditagihkan",
    },
    {
      type: "p",
      text: "Kalau dua puluh tiga persen jarak tempuh berjalan tanpa muatan, itu berarti hampir seperempat solar, hampir seperempat keausan ban, dan seperempat waktu sopir dibayar tanpa menghasilkan pendapatan. Biayanya tidak hilang; ia hanya berpindah ke rit yang bermuatan.",
    },
    {
      type: "p",
      text: "Karena itu memperbaiki muatan balik hampir selalu berdampak lebih besar daripada menawar harga solar atau memangkas biaya perawatan. Angka rasio kilometer kosong yang tampil pada hasil di atas adalah cara paling langsung melihat berapa besar peluang yang sedang menganggur di rute Anda.",
    },
    {
      type: "h2",
      id: "batas-alat-ini",
      text: "Yang bisa dan tidak bisa dijawab alat ini",
    },
    {
      type: "p",
      text: "Alat ini menghitung satu unit pada satu pola rute, berdasarkan asumsi yang Anda masukkan sendiri, bukan biaya final yang sudah menyerap setiap kondisi lapangan. Ia tidak tahu unit mana yang sebenarnya berangkat kemarin, berapa muatannya, berapa lama menunggu di gudang, dan berapa tol yang benar-benar dibayar. Angka yang dimasukkan ke sini adalah rata-rata, dan rata-rata selalu menyembunyikan lane yang merugi di balik lane yang menguntungkan.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Sebelum angkanya dipakai sebagai dasar penawaran",
      body: "Beberapa komponen biasanya belum sepenuhnya tertangkap di sini dan tetap perlu ditambahkan sendiri: kilometer kosong di luar pola rute yang dipilih, hari tidak beroperasi yang tidak tercermin di faktor ketersediaan, overhead kantor yang belum masuk sebagai biaya tetap, dan buffer risiko rute seperti cuaca, pungutan tidak resmi, atau kemacetan musiman. Perlakukan hasil kalkulator ini sebagai titik awal, bukan angka jadi yang langsung dikirim ke pelanggan.",
    },
    {
      type: "p",
      text: "Untuk mengetahui lane mana yang sesungguhnya merugi, biaya harus tercatat per pengiriman, bukan per asumsi, termasuk biaya susulan yang invoicenya baru datang berminggu-minggu kemudian. Itu persoalan pencatatan, dan tidak ada kalkulator yang bisa menyelesaikannya.",
    },
  ],
  blocksEn: [
    {
      type: "h2",
      id: "kenapa-tarif-sering-meleset",
      text: "Why a rate that feels safe still loses money",
    },
    {
      type: "p",
      text: "The most common way to set a rate is to add up diesel, per-diem, and toll, then tack on a percentage. The result is almost always too low, and the reason isn't arithmetic, it's the line items that never get counted.",
    },
    {
      type: "p",
      text: "A truck keeps depreciating while it's parked. Its installment keeps running, its insurance keeps getting paid, its driver keeps getting a salary, and a share of office overhead keeps sitting on it. None of that shows up on any receipt from the trip, so it never feels like a cost of this run, even though it's usually the largest line item of all.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "Fixed cost is charged against every kilometer, including empty ones",
      body: "A truck coming back with no load still depreciates and its driver still gets paid. Because of that, the entire trip's cost, loaded or empty, has to be recovered from revenue-generating kilometers alone. That's why cost per loaded km is always higher than cost per total km, and the gap between the two is the price you pay for the empty return leg.",
    },
    {
      type: "h2",
      id: "cara-kerja",
      text: "How the calculation is structured",
    },
    {
      type: "p",
      text: "The sequence deliberately follows the standard fleet cost model, because that sequence is what makes the result traceable when someone questions the number.",
    },
    {
      type: "ol",
      items: [
        "**Annual depreciation** = (acquisition price minus residual value) divided by economic life.",
        "**Annual fixed cost** = depreciation plus installment, insurance, tax and permits, fixed crew salary, system subscriptions, and allocated overhead.",
        "**Fixed cost per kilometer** = annual fixed cost divided by effective kilometers per year, which is planned kilometers multiplied by the fleet availability factor.",
        "**Fuel cost per trip** is calculated separately for loaded distance and empty distance, because consumption genuinely differs and this is the single largest line item.",
        "**Tire cost per kilometer** = the price of one set divided by its service life, plus maintenance, lubricants, and additive fluids.",
        "**Cost per trip** = fixed cost per km multiplied by total distance, plus fuel, plus road cost per km multiplied by total distance, plus per-trip items such as toll, ferry crossing, loading/unloading, and per-diem.",
      ],
    },
    {
      type: "p",
      text: "From that single cost-per-trip figure, every derived number used in negotiation flows on its own: cost per loaded kilometer to compare lanes, cost per ton-km to compare fleet efficiency, and minimum selling price to make sure the targeted margin is actually reached.",
    },
    {
      type: "h2",
      id: "pola-rute",
      text: "Round trip or one-way: pick the pattern, don't calculate it yourself",
    },
    {
      type: "p",
      text: "The cost calculation works with two separate distances, loaded kilometers and empty kilometers, and that split is correct, because only loaded kilometers generate revenue. The problem is nobody keeps their route in that form. What people actually know is \"Jakarta-Surabaya, empty return\".",
    },
    {
      type: "p",
      text: "That's why this calculator asks for the route pattern first, then the one-way distance. Everything else is worked out on its own.",
    },
    {
      type: "table",
      caption: "Example on a 500 km one-way route",
      head: ["Route pattern", "Loaded km", "Empty km", "When it applies"],
      rows: [
        ["Round trip, empty return", "500", "500", "The most common pattern. Half the distance generates no revenue but still burns diesel, tires, and driver time"],
        ["Round trip, loaded both ways", "1,000", "0", "There's a paying return load. The distance covered is exactly the same, but cost per loaded kilometer drops sharply"],
        ["One-way only", "500", "0", "The vehicle doesn't return, or the return trip is already charged to another job"],
        ["Custom", "entered manually", "entered manually", "Partial return load, positioning distance, or a route with multiple stops"],
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "The most expensive mistake on this page",
      body: "Entering the one-way distance and then forgetting the return leg entirely. Cost per trip immediately reads as half of what it actually is, and the rate born from that loses money on every single trip, with no single line item that looks off when you check it again. Choosing the route pattern first rules that out.",
    },
    {
      type: "h2",
      id: "angka-awal",
      text: "Default figures follow the fleet class, and you still need to replace them",
    },
    {
      type: "p",
      text: "Some line items don't just differ a little between fleet classes, they differ by multiples. A tractor-trailer combination covers about 2.5 kilometers per liter; a light truck can do three times that. So changing the fleet selection also changes fuel consumption, acquisition price, tire life, and fixed crew salary. Tire and maintenance costs adjust along with it automatically, because both are calculated as a share of vehicle price.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Fuel consumption has no fixed figure",
      body: "Kilometers per liter is shaped by terrain, cargo weight, engine age, driving style, and how often the vehicle sits in traffic. Two identical units on different routes can differ by tens of percent. The default figure here exists only so the field isn't blank and isn't off by a whole class. The correct figure is in your own fleet's fuel logs, and since fuel is the largest cost line item, it's the one most worth measuring first.",
    },
    {
      type: "p",
      text: "The same principle applies to acquisition price: what's shown is a reasonable range for that class, not the price that applies to you. Every field can be overwritten, and it should be, before the result is used to set a rate.",
    },
    {
      type: "h2",
      id: "ban-dan-perawatan",
      text: "Tires and maintenance calculated as a percentage of vehicle price",
    },
    {
      type: "p",
      text: "These three items, tire set price, maintenance cost, and lubricants, aren't entered in rupiah, but as a share of vehicle price. This is the standard approach in fleet cost analysis, and the reason is practical: tire and maintenance cost fundamentally tracks vehicle price. A more expensive truck runs bigger tires, pricier parts, and more demanding service intervals.",
    },
    {
      type: "table",
      caption: "Planning ratios used as a starting point",
      head: ["Item", "Share", "Of", "What it means on a Rp 1.5 billion truck"],
      rows: [
        ["One tire set", "6%", "Acquisition price", "Rp 90 million per set"],
        ["Maintenance and repair", "10% per year", "Acquisition price", "Rp 150 million per year"],
        ["Oil and consumables", "12%", "Maintenance cost", "Rp 18 million per year"],
      ],
    },
    {
      type: "p",
      text: "Note that maintenance is stated per **year**, then divided by effective kilometers per year to become a cost per kilometer. That division is what makes this ratio honest: a fleet covering 150,000 kilometers a year carries roughly the same annual maintenance bill as one covering 60,000 kilometers, so its cost per kilometer really is lower. Stating it directly as rupiah per kilometer would hide that relationship, and that relationship is exactly what explains why a fleet that runs infrequently struggles to compete on price.",
    },
    {
      type: "callout",
      tone: "insight",
      title: "The rupiah amount is still shown",
      body: "Below each percentage field, the calculator displays the rupiah value: per set, per year, and per kilometer. A percentage that can't be traced back to rupiah is a percentage nobody can check, and a figure nobody can check has no business setting a price.",
    },
    {
      type: "p",
      text: "These ratios are planning ratios, not published standards. A fleet with good maintenance discipline on light routes sits below them; an aging fleet on harsh terrain sits well above them. All three can be changed, and a fleet that already has its own workshop cost records should use its own figures.",
    },
    {
      type: "h2",
      id: "tol-dan-penyeberangan",
      text: "Why you have to enter toll and ferry rates yourself",
    },
    {
      type: "p",
      text: "Those two fields are deliberately left without a binding default figure, and that's a deliberate decision. Toll rates differ by road segment; ferry rates differ by crossing. Both also change by effective date.",
    },
    {
      type: "p",
      text: "Baking a single national rate into this tool means publishing a figure that will be wrong within months, and nobody would know when it started being wrong, including you, the one using it to set a rate. That's why both fields start at zero, not at a sample figure. A sample figure that looks reasonable gets carried straight into the result by some users without ever being checked; a zero field demands attention.",
    },
    {
      type: "ol",
      items: [
        "Select the fleet at the top. This tool immediately states that class's **toll category** and **ferry category**, and repeats it right next to the field you need to fill in.",
        "Look up the rate for that category on the toll segments and ferry crossings your route actually uses.",
        "Enter the total per trip, and don't forget to add both the outbound and return legs, because every calculation on this page runs on one complete trip.",
      ],
    },
    {
      type: "callout",
      tone: "warning",
      title: "Toll category and ferry category are not the same",
      body: "Toll category follows axle count; ferry category follows overall vehicle length. A two-axle truck with a long body can land in a higher ferry category than a short three-axle truck. Using the toll category to look up the ferry rate will be wrong, and usually in the direction that costs you money.",
    },
    {
      type: "h2",
      id: "faktor-ketersediaan",
      text: "Availability factor: the line item most often overstated",
    },
    {
      type: "p",
      text: "A plan of a hundred and twenty thousand kilometers a year sounds reasonable until you subtract service days, days waiting for cargo, driver leave days, and breakdown days. The availability factor is where that honesty gets entered.",
    },
    {
      type: "p",
      text: "Raising it from 0.85 to 0.95 lowers fixed cost per kilometer by about ten percent on screen, and lowers nothing at all in the real world. What actually happens is the rate gets set against a utilization level that's never reached, and the gap shows up as a loss at year end with no single trip you can point to as the cause.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Two utilization figures need to agree with each other",
      body: "Trips per year multiplied by distance per trip should come close to planned kilometers multiplied by the availability factor. If the two are far apart, one of them is wrong, and every per-kilometer figure gets carried along with the error. This calculator checks that consistency and flags it when the gap exceeds ten percent.",
    },
    {
      type: "h2",
      id: "rit-kosong",
      text: "The empty return leg: the largest cost line that never gets billed",
    },
    {
      type: "p",
      text: "If twenty-three percent of the distance runs without a load, that means nearly a quarter of the diesel, nearly a quarter of the tire wear, and a quarter of the driver's paid time produces no revenue. The cost doesn't disappear; it just shifts onto the loaded trip.",
    },
    {
      type: "p",
      text: "That's why improving the return load almost always has more impact than negotiating diesel prices or trimming maintenance cost. The empty-kilometer ratio shown in the result above is the most direct way to see how much opportunity is sitting idle on your route.",
    },
    {
      type: "h2",
      id: "batas-alat-ini",
      text: "What this tool can and can't answer",
    },
    {
      type: "p",
      text: "This tool calculates one unit on one route pattern, based on the assumptions you enter yourself, not a final cost that has already absorbed every field condition. It doesn't know which unit actually ran yesterday, how much it carried, how long it waited at the warehouse, or how much toll was actually paid. The figures entered here are averages, and averages always hide a losing lane behind a profitable one.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Before using this figure as the basis for a quote",
      body: "Several components typically aren't fully captured here and still need to be added separately: empty kilometers outside the selected route pattern, non-operating days not reflected in the availability factor, office overhead not yet folded into fixed cost, and a route-risk buffer for weather, unofficial levies, or seasonal congestion. Treat this calculator's result as a starting point, not a final figure to send straight to a customer.",
    },
    {
      type: "p",
      text: "To find out which lane is genuinely losing money, cost has to be recorded per shipment, not per assumption, including follow-on charges whose invoices arrive weeks later. That's a record-keeping problem, and no calculator can solve it.",
    },
  ],
  faq: [
    {
      q: "Bagaimana cara menghitung biaya operasional truk per kilometer?",
      a: "Jumlahkan seluruh biaya tetap tahunan termasuk penyusutan, lalu bagi dengan kilometer efektif setahun untuk mendapat biaya tetap per km. Tambahkan biaya jalan per km berupa bahan bakar, ban, perawatan, dan pelumas. Tambahkan pos per rit seperti tol, penyeberangan, bongkar muat, dan uang jalan, lalu bagi totalnya dengan jarak tempuh.",
    },
    {
      q: "Kenapa biaya per km bermuatan lebih tinggi daripada biaya per km total?",
      a: "Karena kilometer kosong tidak menghasilkan pendapatan tetapi tetap memakan solar, ban, dan waktu sopir. Seluruh biayanya harus ditanggung kilometer yang bermuatan saja. Semakin besar porsi rit kosong, semakin lebar selisih kedua angka itu.",
    },
    {
      q: "Apa itu biaya per ton-km dan kapan dipakai?",
      a: "Biaya per rit dibagi hasil kali muatan dalam ton dengan jarak bermuatan. Angka ini dipakai membandingkan efisiensi antar armada dan antar rute, karena menyetarakan pengiriman dengan muatan dan jarak yang berbeda-beda.",
    },
    {
      q: "Bagaimana menetapkan harga jual minimum dari biaya?",
      a: "Bagi biaya dengan satu dikurangi margin yang dituju, bukan mengalikannya dengan margin. Biaya sepuluh juta dengan target margin dua puluh persen menghasilkan harga jual minimum dua belas setengah juta, bukan dua belas juta.",
    },
    {
      q: "Berapa km per liter truk CDD, fuso, atau tronton?",
      a: "Sebagai titik awal yang kasar: truk ringan seperti CDE dan CDD sekitar 8 km per liter bermuatan, truk medium kelas fuso sekitar 5,5, tronton sekitar 4,5, dan rangkaian tractor head dengan trailer sekitar 2,5. Angka-angka ini bergeser jauh menurut medan, bobot muatan, umur mesin, dan gaya mengemudi, dua unit identik pada rute berbeda bisa berselisih puluhan persen. Pakai rata-rata dari catatan pengisian solar armada sendiri sebelum hasilnya dipakai menetapkan tarif.",
    },
    {
      q: "Kenapa biaya ban dan perawatan diisi dalam persen, bukan rupiah?",
      a: "Karena keduanya pada dasarnya mengikuti harga kendaraan, truk yang lebih mahal memakai ban lebih besar dan suku cadang lebih mahal. Disimpan sebagai persentase, keduanya ikut menyesuaikan begitu armada atau harganya diganti; disimpan sebagai rupiah, setiap kelas armada butuh angkanya sendiri dan masing-masing menjadi usang sendiri-sendiri. Titik awalnya 6% dari harga untuk satu set ban, 10% dari harga per tahun untuk perawatan, dan 12% dari biaya perawatan untuk pelumas. Nilai rupiahnya tetap ditampilkan di bawah tiap kolom.",
    },
    {
      q: "Kenapa angka berubah sendiri saat saya ganti pilihan armada?",
      a: "Karena konsumsi bahan bakar, harga perolehan, biaya ban, umur ban, biaya perawatan, dan gaji tetap awak semuanya berbeda berkali-kali lipat antar kelas armada. Mempertahankan satu angka untuk semua kelas akan menghasilkan perhitungan yang sangat meleset begitu Anda memilih armada selain yang menjadi dasar angka bawaan. Semua kolom tetap bisa ditimpa.",
    },
    {
      q: "Bagaimana menghitung rute pulang pergi dibanding sekali jalan?",
      a: "Pilih pola rutenya, lalu isi jarak sekali jalan, kalkulator menerjemahkannya sendiri. Pulang pergi dengan balik kosong menjadi jarak bermuatan sekali jalan ditambah jarak kosong yang sama. Pulang pergi dengan muatan dua arah menjadi dua kali jarak, seluruhnya bermuatan. Untuk muatan balik sebagian, pilih Atur sendiri dan isi keduanya terpisah.",
    },
    {
      q: "Kenapa tarif tol dan penyeberangan tidak sudah terisi otomatis?",
      a: "Karena tarif tol berbeda per ruas jalan dan tarif penyeberangan berbeda per lintasan, dan keduanya berubah menurut tanggal berlaku. Satu tarif nasional yang ditanam di dalam alat akan menjadi salah tanpa ada yang menyadarinya. Yang alat ini sediakan adalah golongan kendaraan Anda, tarifnya ambil dari ruas dan lintasan yang benar-benar dilewati, lalu masukkan sebagai isian.",
    },
    {
      q: "Bagaimana saya tahu masuk golongan berapa?",
      a: "Pilih armada di bagian atas kalkulator, dan golongan tol serta golongan penyeberangannya langsung ditampilkan, termasuk diulang tepat di sebelah kolom biaya yang harus diisi. Golongan tol mengikuti jumlah gandar, golongan penyeberangan mengikuti panjang keseluruhan kendaraan.",
    },
    {
      q: "Apakah biaya tetap boleh dibebankan hanya pada kilometer bermuatan?",
      a: "Pembebanannya ke seluruh kilometer, tetapi pemulihannya hanya bisa dari kilometer bermuatan. Itulah sebabnya perhitungan ini menghasilkan dua angka berbeda, dan yang dipakai menetapkan tarif adalah biaya per kilometer bermuatan.",
    },
  ],
  faqEn: [
    {
      q: "How do you calculate truck operating cost per kilometer?",
      a: "Add up all annual fixed costs including depreciation, then divide by effective kilometers per year to get fixed cost per km. Add road cost per km covering fuel, tires, maintenance, and lubricants. Add per-trip items such as toll, ferry crossing, loading/unloading, and per-diem, then divide the total by distance traveled.",
    },
    {
      q: "Why is cost per loaded km higher than cost per total km?",
      a: "Because empty kilometers generate no revenue but still burn diesel, tires, and driver time. The entire cost has to be recovered from loaded kilometers alone. The larger the share of empty running, the wider the gap between the two figures.",
    },
    {
      q: "What is cost per ton-km and when is it used?",
      a: "Cost per trip divided by the product of load in tons and loaded distance. This figure is used to compare efficiency across fleets and routes, because it normalizes shipments with different loads and distances.",
    },
    {
      q: "How do you set a minimum selling price from cost?",
      a: "Divide cost by one minus the targeted margin, not multiply it by the margin. A cost of ten million with a targeted margin of twenty percent gives a minimum selling price of twelve and a half million, not twelve million.",
    },
    {
      q: "How many km per liter for a CDD, fuso, or tronton truck?",
      a: "As a rough starting point: light trucks such as CDE and CDD run about 8 km per liter loaded, medium fuso-class trucks about 5.5, tronton about 4.5, and a tractor-trailer combination about 2.5. These figures shift widely with terrain, cargo weight, engine age, and driving style, two identical units on different routes can differ by tens of percent. Use the average from your own fleet's fuel logs before the result is used to set a rate.",
    },
    {
      q: "Why are tire and maintenance costs entered as a percentage, not rupiah?",
      a: "Because both fundamentally track vehicle price, a more expensive truck runs bigger tires and pricier parts. Stored as a percentage, both adjust automatically the moment the fleet or its price changes; stored as rupiah, every fleet class needs its own figure and each one goes stale on its own schedule. The starting point is 6% of price for one tire set, 10% of price per year for maintenance, and 12% of maintenance cost for lubricants. The rupiah value is still shown below each field.",
    },
    {
      q: "Why do the figures change on their own when I switch the fleet selection?",
      a: "Because fuel consumption, acquisition price, tire cost, tire life, maintenance cost, and fixed crew salary all differ by multiples across fleet classes. Keeping one figure for every class would produce a calculation that's badly off the moment you pick a fleet other than the one the default figures are based on. Every field can still be overwritten.",
    },
    {
      q: "How do you calculate a round trip versus a one-way route?",
      a: "Pick the route pattern, then enter the one-way distance, the calculator translates it on its own. Round trip with empty return becomes the one-way loaded distance plus an equal empty distance. Round trip loaded both ways becomes twice the distance, all of it loaded. For a partial return load, choose Custom and enter both separately.",
    },
    {
      q: "Why aren't toll and ferry rates already filled in?",
      a: "Because toll rates differ by road segment and ferry rates differ by crossing, and both change by effective date. A single national rate baked into the tool would become wrong without anyone noticing. What this tool provides is your vehicle's category, take the rate from the segments and crossings your route actually uses, and enter it as an input.",
    },
    {
      q: "How do I know which category applies?",
      a: "Select the fleet at the top of the calculator, and its toll category and ferry category are shown immediately, including repeated right next to the cost field you need to fill in. Toll category follows axle count, ferry category follows overall vehicle length.",
    },
    {
      q: "Can fixed cost be charged only against loaded kilometers?",
      a: "It's charged against every kilometer, but it can only be recovered from loaded kilometers. That's why this calculation produces two different figures, and the one used to set a rate is cost per loaded kilometer.",
    },
  ],
  sources: [
    { label: "Model biaya armada", detail: "Struktur perhitungan biaya tetap, biaya jalan, dan biaya per rit mengikuti model cost per km yang lazim dipakai dalam analisis armada niaga." },
    { label: "Tarif tol dan penyeberangan", detail: "Sengaja tidak ditanam di dalam alat ini. Tarif berbeda per ruas jalan dan per lintasan serta berubah menurut tanggal berlaku, jadi seluruhnya masuk sebagai isian pengguna." },
  ],
  sourcesEn: [
    { label: "Fleet cost model", detail: "The calculation structure for fixed cost, road cost, and cost per trip follows the cost-per-km model standard in commercial fleet cost analysis." },
    { label: "Toll and ferry rates", detail: "Deliberately not baked into this tool. Rates differ by road segment and by crossing and change by effective date, so all of it is entered as a user input." },
  ],
  relatedArticles: ["margin-per-job-forwarder", "negosiasi-tarif-tahunan-kontrak-shipper", "perawatan-armada-preventif-vs-reaktif"],
  relatedTools: ["jenis-truk-indonesia", "kalkulator-muatan-truk", "golongan-tol-penyeberangan"],
};

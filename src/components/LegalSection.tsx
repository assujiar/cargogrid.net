import React, { useState } from "react";
import { ShieldCheck, Scale, ArrowLeft, Lock } from "lucide-react";
import { motion } from "motion/react";

interface LegalSectionProps {
  lang: 'id' | 'en';
  defaultTab?: 'privacy' | 'terms';
}

export default function LegalSection({ lang, defaultTab = 'privacy' }: LegalSectionProps) {
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(defaultTab);

  const handleBackToLanding = () => {
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in" id="legal-page-container">
      <div className="absolute top-0 left-0 w-full h-64 bg-navy-dark/10 pointer-events-none -z-10" />
      
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={handleBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-500 hover:text-brand-orange transition-colors mb-8 uppercase tracking-wider bg-white px-4.5 py-2.5 rounded-full shadow-sm cursor-pointer border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? "Back to Homepage" : "Kembali ke Beranda"}</span>
        </button>

        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-teal/10 rounded-full text-brand-teal text-[10px] font-mono font-black uppercase tracking-widest mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>{isEn ? "Secure Corporate Legal" : "Hukum & Privasi Korporat"}</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            {isEn ? "Legal Agreements & Policies" : "Kebijakan & Syarat Hukum Resmi"}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 font-semibold">
            {isEn 
              ? "CargoGrid Logistics OS &bull; Compliant with UU ITE, UU PDP & GDPR Guidelines" 
              : "CargoGrid Logistics OS &bull; Sesuai dengan Regulasi UU ITE, UU PDP & Standar GDPR"}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 mb-8" id="legal-tab-triggers">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 pb-4 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'privacy'
                ? "border-brand-orange text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isEn ? "Privacy Policy" : "Kebijakan Privasi"}</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 pb-4 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'terms'
                ? "border-brand-orange text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isEn ? "Terms of Service" : "Syarat & Ketentuan"}</span>
          </button>
        </div>

        {/* Document Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-left text-slate-700 leading-relaxed text-xs sm:text-sm space-y-6">
          
          {activeTab === 'privacy' ? (
            /* Privacy Policy Content (Indonesian & English side-by-side or clearly delineated) */
            <div className="space-y-8" id="privacy-policy-content">
              
              {/* ENGLISH PRIVACY POLICY */}
              <div className="prose max-w-none space-y-5">
                <h2 className="font-display font-black text-xl text-slate-900 border-b pb-2">1. CargoGrid Privacy Policy (International & Enterprise)</h2>
                <p className="text-slate-500 font-bold font-mono text-[10px]">Last Updated: July 7, 2026</p>
                
                <p className="font-semibold text-slate-600">
                  CargoGrid (“we,” “our,” or “us”) respects the privacy of our clients, logistics vendors, shippers, and users of CargoGrid OS. This Privacy Policy describes how we collect, process, use, and protect your enterprise data and personal information in compliance with the General Data Protection Regulation (GDPR) and the Indonesian Personal Data Protection Act (UU PDP).
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">A. Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Corporate Identity:</strong> Company legal names, TAX IDs (NPWP), office addresses, operational contact representatives, and corporate emails.</li>
                  <li><strong>Logistics Data:</strong> Shipment schedules, Cargo details, RFQs, vendor pricing worksheets, fleet locations, warehousing manifests, and client billing registers.</li>
                  <li><strong>Proof of Delivery (POD) Documentation:</strong> Driver-uploaded photos, digital signatures, geolocation data points at delivery sites, and metadata.</li>
                  <li><strong>Technical and Analytics Data:</strong> IP addresses, browser cookies, device fingerprints, and UTM campaign parameters used to attribute system audits.</li>
                </ul>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">B. Data Usage and Operations</h3>
                <p>We use the collected information strictly to provide, improve, and secure the CargoGrid Logistics Operating System, specifically to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Formulate detailed workflow diagnostics and automate custom ROI calculations.</li>
                  <li>Verify and approve corporate user access accounts, preventing unauthorized freight rate leakage.</li>
                  <li>Generate and deliver instant invoices triggered directly by mobile e-POD submissions.</li>
                  <li>Analyze traffic trends, optimize browser UI cache, and run targeted business development programs.</li>
                </ul>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">C. Data Isolation, Storage, and Security</h3>
                <p>
                  All corporate logistics assets are stored on highly secure, enterprise-grade cloud servers with strict **Multi-Tenant Logical Isolation**. No other CargoGrid client can access your pricing rates, client directories, or outstanding accounts receivable ledgers. We implement TLS 1.3 encryption in transit and AES-256 encryption at rest.
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">D. Data Retention and Deletion Rights</h3>
                <p>
                  You retain full ownership of your data. You may export or request complete purging of your company account details, system audit records, and uploaded POD images at any time by contacting our Security & SLA Officer at <strong>compliance@cargogrid-ops.io</strong>.
                </p>
              </div>

              {/* INDONESIAN PRIVACY POLICY */}
              <div className="prose max-w-none space-y-5 pt-8 border-t border-slate-200">
                <h2 className="font-display font-black text-xl text-slate-900 border-b pb-2">2. Kebijakan Privasi CargoGrid (Indonesia)</h2>
                <p className="text-slate-500 font-bold font-mono text-[10px]">Terakhir Diperbarui: 7 Juli 2026</p>
                
                <p className="font-semibold text-slate-600">
                  CargoGrid (“kami”) menghormati privasi klien kami, mitra vendor logistik, pengirim barang (shipper), dan seluruh pengguna CargoGrid OS. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, memproses, menggunakan, dan melindungi data perusahaan serta informasi pribadi Anda sesuai dengan Undang-Undang Pelindungan Data Pribadi (UU PDP) Republik Indonesia.
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">A. Informasi yang Kami Kumpulkan</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Identitas Perusahaan:</strong> Nama legal perusahaan, NPWP, alamat kantor pusat/cabang, detail perwakilan operasional, dan email resmi.</li>
                  <li><strong>Data Logistik Operasional:</strong> Rencana perjalanan pengiriman, rincian kargo, data RFQ, kertas kerja tarif vendor, manifest pergudangan (WMS), dan daftar tagihan klien.</li>
                  <li><strong>Dokumentasi Bukti Pengiriman (POD):</strong> Foto tanda terima surat jalan yang diunggah pengemudi, tanda tangan digital penerima, data geolokasi GPS saat bongkar muat, serta metadata lainnya.</li>
                  <li><strong>Data Teknis & Analitik:</strong> Alamat IP, data kuki (cookies) browser, sidik jari perangkat, serta parameter kampanye pemasaran UTM.</li>
                </ul>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">B. Penggunaan Data dan Keamanan</h3>
                <p>Kami menggunakan data operasional yang dikumpulkan semata-mata untuk memvalidasi, memelihara, dan mengamankan fungsionalitas sistem CargoGrid OS:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Menyusun analisis hambatan operasional dan melakukan kalkulasi efisiensi margin perusahaan.</li>
                  <li>Memvalidasi login pengguna berwenang demi mencegah kebocoran tarif internal logistik Anda ke pihak luar.</li>
                  <li>Memproses penagihan invoice instan berbasis e-POD yang diserahkan supir di lapangan.</li>
                  <li>Memantau efisiensi situs, memperbaiki error pada dashboard, dan melakukan pelacakan asal rujukan kampanye pemasaran.</li>
                </ul>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">C. Isolasi Data & Keamanan Infrastruktur</h3>
                <p>
                  Seluruh data logistik perusahaan Anda disimpan di server cloud enterprise yang memiliki sistem **Isolasi Logis Multi-Tenant** yang ketat. Perusahaan logistik lain pengguna CargoGrid tidak akan pernah bisa mengakses data tarif, daftar pelanggan, maupun tagihan piutang Anda. Seluruh transaksi dienkripsi dengan standar TLS 1.3 dan penyimpanan AES-256.
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">D. Hak Penghapusan dan Retensi Data</h3>
                <p>
                  Perusahaan Anda memegang hak milik mutlak atas seluruh data logistik. Anda berhak mengekspor file atau meminta penghapusan permanen atas seluruh profil perusahaan, data kuesioner, dan unggahan POD Anda dengan menghubungi bagian kepatuhan hukum kami di <strong>compliance@cargogrid-ops.io</strong>.
                </p>
              </div>

            </div>
          ) : (
            /* Terms & Conditions Content */
            <div className="space-y-8" id="terms-conditions-content">
              
              {/* ENGLISH TERMS */}
              <div className="prose max-w-none space-y-5">
                <h2 className="font-display font-black text-xl text-slate-900 border-b pb-2">1. CargoGrid Terms of Service (SaaS Agreement)</h2>
                <p className="text-slate-500 font-bold font-mono text-[10px]">Last Updated: July 7, 2026</p>
                
                <p className="font-semibold text-slate-600">
                  By accessing, testing, registering for a free audit, or deploying the CargoGrid OS platform, your organization (“Client”) agrees to comply with and be bound by the following Terms of Service. Please read this agreement carefully.
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">A. SaaS Scope of Service</h3>
                <p>
                  CargoGrid provides cloud-based Logistics Operating System modules including CRM, RFQ management, digital transport operations (TMS), warehouse management (WMS), driver tracking, mobile e-POD, and billing accounting ledgers. The platform is offered on a commercial subscription basis, following an approved system audit and 30-day working pilot period.
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">B. Client Responsibilities and Permitted Use</h3>
                <p>Client and its authorized operators represent that:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All registration, company profile, and shipment volume questionnaire data provided is highly accurate and truthful.</li>
                  <li>They will not utilize CargoGrid OS to coordinate transport or logistics operations of prohibited cargo, illegal substances, or smuggling operations.</li>
                  <li>They will maintain safe confidentiality of user credentials and prevent unauthorized third-party rate scrapers from accessing pricing suites.</li>
                </ul>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">C. Pilot License & Commercial SLA</h3>
                <p>
                  Approved pilot programs grant a non-transferable, non-exclusive, 30-day temporary trial license to utilize the CargoGrid OS sandbox. Any commercial conversion requires signing a formalized service level agreement (SLA) specifying active user limits, custom API endpoints, and technical billing arrangements.
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">D. Limitation of Liability</h3>
                <p>
                  CargoGrid is a digital process orchestration platform. We are not a logistics broker, freight forwarder, or transport provider. CargoGrid is not liable for physical cargo damage, sea/air shipping delays, driver vehicle breakdowns, or operational losses incurred during transit, which remain strictly governed by the Client's contracts with physical transport vendors.
                </p>
              </div>

              {/* INDONESIAN TERMS */}
              <div className="prose max-w-none space-y-5 pt-8 border-t border-slate-200">
                <h2 className="font-display font-black text-xl text-slate-900 border-b pb-2">2. Syarat & Ketentuan Penggunaan CargoGrid OS (Indonesia)</h2>
                <p className="text-slate-500 font-bold font-mono text-[10px]">Terakhir Diperbarui: 7 Juli 2026</p>
                
                <p className="font-semibold text-slate-600">
                  Dengan mengakses, mendaftarkan audit sistem gratis, menguji modul, atau menerapkan platform CargoGrid OS, organisasi Anda (“Klien”) secara hukum setuju untuk tunduk pada Syarat dan Ketentuan Penggunaan berikut ini.
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">A. Lingkup Layanan Sistem</h3>
                <p>
                  CargoGrid menyediakan perangkat lunak berbasis cloud (SaaS) yang mengintegrasikan modul CRM logistik, penawaran harga RFQ, manajemen pengiriman (TMS), pengelolaan stok gudang (WMS), aplikasi pelacakan pengemudi, e-POD instan, hingga pembukuan akuntansi logistik. Layanan ini diberikan berdasarkan skema langganan korporat setelah melewati fase audit kelayakan sistem dan pilot projek 30 hari.
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">B. Kewajiban Klien & Aturan Penggunaan</h3>
                <p>Klien menyatakan dan menjamin bahwa:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Seluruh informasi registrasi nama perusahaan, volume pengiriman bulanan, dan data kuesioner yang diserahkan adalah valid, benar, dan sah secara hukum.</li>
                  <li>Tidak akan menggunakan sistem CargoGrid OS untuk mengoordinasikan pengiriman muatan kargo ilegal, narkotika, senjata selundupan, atau muatan berbahaya yang melanggar hukum Republik Indonesia.</li>
                  <li>Wajib menjaga kerahasiaan kata sandi masuk dan dilarang keras memberikan akses akun kepada kompetitor industri logistik lainnya.</li>
                </ul>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">C. Ketentuan Pilot Projek & Kontrak Komersial</h3>
                <p>
                  Program pilot projek yang disetujui memberikan hak lisensi pengujian non-eksklusif selama 30 hari kepada Klien. Transisi ke sistem komersial berbayar wajib diatur dalam Perjanjian Kerjasama (SLA) terpisah yang mencantumkan jumlah pengguna aktif, penyesuaian integrasi API, dan skema harga berlangganan bulanan.
                </p>

                <h3 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">D. Batasan Tanggung Jawab Operasional</h3>
                <p>
                  CargoGrid adalah penyedia sistem operasi digital alur kerja. Kami bukan broker logistik, freight forwarder fisik, maupun pemilik armada. CargoGrid tidak bertanggung jawab atas kerusakan fisik barang kargo di perjalanan, keterlambatan pelayaran/penerbangan, kecelakaan truk armada, maupun kerugian finansial operasional lainnya yang timbul di lapangan. Hal tersebut merupakan tanggung jawab operasional antara Klien dan vendor pengangkutan terkait.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer info inside legal */}
        <div className="mt-8 text-center text-xs text-slate-500 font-mono font-bold pb-12">
          {isEn 
            ? "Need custom legal frameworks or enterprise cloud SLA agreements? Contact compliance@cargogrid-ops.io" 
            : "Butuh draf perjanjian legal khusus untuk korporasi Anda? Hubungi compliance@cargogrid-ops.io"}
        </div>

      </div>
    </div>
  );
}

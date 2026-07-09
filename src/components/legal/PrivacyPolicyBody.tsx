"use client";

import React from "react";
import { useLanguage } from "../shared/LanguageProvider";

export default function PrivacyPolicyBody() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-left text-slate-700 leading-relaxed text-xs sm:text-sm space-y-6">
      <div className="prose max-w-none space-y-5" id="privacy-policy-content">
        <p className="text-slate-500 font-bold font-mono text-[10px]">
          {isEn ? "Last Updated: July 7, 2026" : "Terakhir Diperbarui: 7 Juli 2026"}
        </p>

        <p className="font-semibold text-slate-600">
          {isEn ? (
            <>
              CargoGrid (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects the privacy of our clients, logistics vendors, shippers, and users of
              CargoGrid OS. This Privacy Policy describes how we collect, process, use, and protect your enterprise data and
              personal information in compliance with the General Data Protection Regulation (GDPR) and the Indonesian
              Personal Data Protection Act (UU PDP).
            </>
          ) : (
            <>
              CargoGrid (&ldquo;kami&rdquo;) menghormati privasi klien kami, mitra vendor logistik, pengirim barang (shipper), dan seluruh
              pengguna CargoGrid OS. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, memproses, menggunakan,
              dan melindungi data perusahaan serta informasi pribadi Anda sesuai dengan Undang-Undang Pelindungan Data
              Pribadi (UU PDP) Republik Indonesia.
            </>
          )}
        </p>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "A. Information We Collect" : "A. Informasi yang Kami Kumpulkan"}
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {isEn ? (
            <>
              <li>
                <strong>Corporate Identity:</strong> Company legal names, TAX IDs (NPWP), office addresses, operational
                contact representatives, and corporate emails — collected when you submit the contact, demo, or free-audit
                form.
              </li>
              <li>
                <strong>Logistics/Operational Inquiry Data:</strong> Shipment volume, biggest operational pain point, business
                sector, current systems, and other details you share through our audit questionnaire, RFQs, vendor pricing
                worksheets, fleet locations, warehousing manifests, and client billing registers.
              </li>
              <li>
                <strong>Proof of Delivery (POD) Documentation:</strong> Driver-uploaded photos, digital signatures, geolocation
                data points at delivery sites, and metadata — applicable to active pilot/production tenants.
              </li>
              <li>
                <strong>Website Analytics and Cookies:</strong> IP addresses, browser cookies, device fingerprints, and UTM
                campaign parameters used to measure marketing performance and attribute system audit requests, subject to the
                cookie consent choices you make on this website.
              </li>
            </>
          ) : (
            <>
              <li>
                <strong>Identitas Perusahaan:</strong> Nama legal perusahaan, NPWP, alamat kantor pusat/cabang, detail
                perwakilan operasional, dan email resmi — dikumpulkan saat Anda mengisi formulir kontak, permintaan demo, atau
                audit gratis.
              </li>
              <li>
                <strong>Data Operasional/Inquiry Logistik:</strong> Volume pengiriman, tantangan operasional terbesar, sektor
                bisnis, sistem yang sedang digunakan, dan detail lain yang Anda bagikan melalui kuesioner audit kami, data
                RFQ, kertas kerja tarif vendor, manifest pergudangan (WMS), dan daftar tagihan klien.
              </li>
              <li>
                <strong>Dokumentasi Bukti Pengiriman (POD):</strong> Foto tanda terima surat jalan yang diunggah pengemudi,
                tanda tangan digital penerima, data geolokasi GPS saat bongkar muat, serta metadata lainnya — berlaku untuk
                tenant pilot/produksi yang aktif.
              </li>
              <li>
                <strong>Analitik Website &amp; Cookies:</strong> Alamat IP, data kuki (cookies) browser, sidik jari perangkat,
                serta parameter kampanye pemasaran UTM yang kami gunakan untuk mengukur performa marketing dan mengaitkan
                permintaan audit sistem, sesuai dengan pilihan persetujuan cookie yang Anda pilih di situs ini.
              </li>
            </>
          )}
        </ul>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "B. Purpose and Use of Data" : "B. Tujuan dan Penggunaan Data"}
        </h2>
        <p>
          {isEn
            ? "We use the collected information strictly to provide, improve, and secure the CargoGrid Logistics Operating System and this website, specifically to:"
            : "Kami menggunakan data yang dikumpulkan semata-mata untuk menyediakan, meningkatkan, dan mengamankan CargoGrid Logistics Operating System serta situs ini, khususnya untuk:"}
        </p>
        <ul className="list-disc pl-5 space-y-2">
          {isEn ? (
            <>
              <li>Formulate detailed workflow diagnostics and automate custom ROI/cost-leakage calculations.</li>
              <li>Verify and approve corporate user access accounts, preventing unauthorized freight rate leakage.</li>
              <li>Follow up on demo, audit, and consultation requests, and schedule meetings with our team.</li>
              <li>Generate and deliver instant invoices triggered directly by mobile e-POD submissions.</li>
              <li>Analyze website traffic trends, improve page performance, and evaluate marketing campaign effectiveness.</li>
            </>
          ) : (
            <>
              <li>Menyusun analisis hambatan operasional dan melakukan kalkulasi ROI/kebocoran biaya secara otomatis.</li>
              <li>Memvalidasi login pengguna berwenang demi mencegah kebocoran tarif internal logistik Anda ke pihak luar.</li>
              <li>Menindaklanjuti permintaan demo, audit, dan konsultasi, serta menjadwalkan pertemuan dengan tim kami.</li>
              <li>Memproses penagihan invoice instan berbasis e-POD yang diserahkan supir di lapangan.</li>
              <li>Menganalisis tren lalu lintas situs, memperbaiki performa halaman, dan mengevaluasi efektivitas kampanye pemasaran.</li>
            </>
          )}
        </ul>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "C. Data Isolation, Storage, and Security" : "C. Isolasi Data, Penyimpanan, dan Keamanan"}
        </h2>
        <p>
          {isEn ? (
            <>
              All corporate logistics assets are stored on secure, enterprise-grade cloud infrastructure with strict{" "}
              <strong>multi-tenant logical isolation</strong>. No other CargoGrid client can access your pricing rates, client
              directories, or outstanding accounts receivable ledgers. We implement TLS 1.3 encryption in transit and AES-256
              encryption at rest.
            </>
          ) : (
            <>
              Seluruh data logistik perusahaan Anda disimpan di infrastruktur cloud enterprise yang aman dengan sistem{" "}
              <strong>isolasi logis multi-tenant</strong> yang ketat. Perusahaan logistik lain pengguna CargoGrid tidak akan
              pernah bisa mengakses data tarif, daftar pelanggan, maupun tagihan piutang Anda. Seluruh transaksi dienkripsi
              dengan standar TLS 1.3 saat transit dan AES-256 saat tersimpan.
            </>
          )}
        </p>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "D. Data Sharing with Third Parties" : "D. Pembagian Data dengan Pihak Ketiga"}
        </h2>
        <p>
          {isEn ? (
            <>
              We do not sell your data. We only share information with sub-processors strictly necessary to operate our
              services — for example, our email delivery provider (to send audit/questionnaire notifications) and our cloud
              database provider (to host your operational data securely). Every sub-processor is bound by confidentiality and
              data-protection obligations at least as strict as this Policy.
            </>
          ) : (
            <>
              Kami tidak menjual data Anda. Kami hanya membagikan informasi kepada sub-pemroses yang secara ketat diperlukan
              untuk mengoperasikan layanan kami — misalnya, penyedia pengiriman email (untuk mengirim notifikasi
              audit/kuesioner) dan penyedia basis data cloud (untuk menyimpan data operasional Anda secara aman). Setiap
              sub-pemroses terikat kewajiban kerahasiaan dan pelindungan data yang setidaknya sama ketatnya dengan Kebijakan
              ini.
            </>
          )}
        </p>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "E. Data Retention and Your Rights" : "E. Retensi Data dan Hak Anda"}
        </h2>
        <p>
          {isEn ? (
            <>
              You retain full ownership of your data. You may request access, correction, export, or complete deletion of your
              company account details, audit/questionnaire records, and uploaded POD images at any time by contacting our
              Security &amp; SLA Officer at <strong>service@cargogrid.net</strong>. We retain website inquiry data only for as
              long as reasonably necessary to follow up on your request, or as required by applicable law.
            </>
          ) : (
            <>
              Perusahaan Anda memegang hak milik mutlak atas seluruh data. Anda berhak meminta akses, koreksi, ekspor, atau
              penghapusan permanen atas seluruh profil perusahaan, data audit/kuesioner, dan unggahan POD Anda dengan
              menghubungi bagian kepatuhan hukum kami di <strong>service@cargogrid.net</strong>. Kami menyimpan data inquiry
              website hanya selama diperlukan secara wajar untuk menindaklanjuti permintaan Anda, atau sesuai ketentuan
              hukum yang berlaku.
            </>
          )}
        </p>

        <div className="nm-deboss-sm bg-slate-50 rounded-2xl p-4 mt-6 border border-slate-200/70">
          <h3 className="font-display font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
            {isEn ? "Scope of This Policy" : "Ruang Lingkup Kebijakan Ini"}
          </h3>
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
            {isEn
              ? "This Privacy Policy governs our public website, the free system audit, demo requests, and the operational-readiness questionnaire only. Data processing terms for a live production tenant (once you become a paying customer) are governed by the formal Service Level Agreement (SLA) signed at that stage, which may include additional or more specific data-processing commitments."
              : "Kebijakan Privasi ini berlaku untuk situs publik kami, audit sistem gratis, permintaan demo, dan kuesioner kesiapan operasional. Ketentuan pemrosesan data untuk tenant produksi aktif (setelah Anda menjadi pelanggan berbayar) diatur dalam Perjanjian Tingkat Layanan (SLA) formal yang ditandatangani pada tahap tersebut, yang dapat mencakup komitmen pemrosesan data tambahan atau lebih spesifik."}
          </p>
        </div>

        <p className="text-slate-500 font-semibold text-xs pt-4 border-t border-slate-200">
          {isEn ? (
            <>
              CargoGrid OS Indonesia &bull; Sudirman Central Business District (SCBD), South Jakarta, Indonesia &bull; Contact:{" "}
              <a href="mailto:service@cargogrid.net" className="text-brand-teal font-bold hover:underline">
                service@cargogrid.net
              </a>
            </>
          ) : (
            <>
              CargoGrid OS Indonesia &bull; Sudirman Central Business District (SCBD), Jakarta Selatan &bull; Kontak:{" "}
              <a href="mailto:service@cargogrid.net" className="text-brand-teal font-bold hover:underline">
                service@cargogrid.net
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

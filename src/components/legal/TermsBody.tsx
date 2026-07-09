"use client";

import React from "react";
import { useLanguage } from "../shared/LanguageProvider";

export default function TermsBody() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-left text-slate-700 leading-relaxed text-xs sm:text-sm space-y-6">
      <div className="prose max-w-none space-y-5" id="terms-conditions-content">
        <p className="text-slate-500 font-bold font-mono text-[10px]">
          {isEn ? "Last Updated: July 7, 2026" : "Terakhir Diperbarui: 7 Juli 2026"}
        </p>

        <p className="font-semibold text-slate-600">
          {isEn
            ? "By accessing this website, testing the ROI simulator, registering for a free audit, requesting a demo, or deploying the CargoGrid OS platform, your organization (“Client”) agrees to comply with and be bound by the following Terms & Conditions. Please read this agreement carefully. These Terms are governed by Indonesian law and written primarily for an Indonesian business context."
            : "Dengan mengakses situs ini, menguji simulator ROI, mendaftarkan audit sistem gratis, meminta demo, atau menerapkan platform CargoGrid OS, organisasi Anda (“Klien”) secara hukum setuju untuk tunduk pada Syarat dan Ketentuan berikut ini. Ketentuan ini diatur berdasarkan hukum Republik Indonesia dan disusun terutama untuk konteks bisnis Indonesia."}
        </p>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "A. Website Use, Demo & Audit Requests" : "A. Penggunaan Situs, Permintaan Demo & Audit"}
        </h2>
        <p>
          {isEn ? (
            <>
              CargoGrid provides cloud-based Logistics Operating System modules including CRM, RFQ management, digital
              transport operations (TMS), warehouse management (WMS), driver tracking, mobile e-POD, and billing/accounting
              ledgers. Information on this website, including the ROI simulator, pricing pages, and product previews, is
              provided for general informational purposes. Submitting a demo, audit, or consultation request does not by
              itself create a commercial subscription — commercial service is offered following an approved system audit and
              a 30-day working pilot period.
            </>
          ) : (
            <>
              CargoGrid menyediakan perangkat lunak berbasis cloud (SaaS) yang mencakup modul CRM logistik, penawaran harga
              RFQ, manajemen pengiriman (TMS), pengelolaan stok gudang (WMS), aplikasi pelacakan pengemudi, e-POD instan,
              hingga pembukuan akuntansi logistik. Informasi di situs ini, termasuk simulator ROI, halaman paket harga, dan
              preview produk, disediakan untuk tujuan informasi umum. Mengirimkan permintaan demo, audit, atau konsultasi
              tidak dengan sendirinya menciptakan langganan komersial — layanan komersial ditawarkan setelah melewati fase
              audit kelayakan sistem dan pilot projek berjalan selama 30 hari.
            </>
          )}
        </p>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "B. Client Responsibilities & Data Accuracy" : "B. Kewajiban Klien & Akurasi Data"}
        </h2>
        <p>{isEn ? "Client and its authorized operators represent that:" : "Klien menyatakan dan menjamin bahwa:"}</p>
        <ul className="list-disc pl-5 space-y-2">
          {isEn ? (
            <>
              <li>
                All registration, company profile, shipment-volume questionnaire, and audit-request data submitted is
                accurate, complete, and truthful — CargoGrid relies on this data to prepare audit results, ROI estimates, and
                proposals, and is not responsible for conclusions based on inaccurate information supplied by the Client.
              </li>
              <li>
                They will not use CargoGrid OS or this website to coordinate transport or logistics of prohibited cargo,
                illegal substances, or smuggling operations.
              </li>
              <li>
                They will keep user credentials confidential and prevent unauthorized third parties from scraping or
                accessing pricing suites.
              </li>
            </>
          ) : (
            <>
              <li>
                Seluruh informasi registrasi, profil perusahaan, kuesioner volume pengiriman, dan data permintaan audit yang
                diserahkan adalah akurat, lengkap, dan benar — CargoGrid menggunakan data tersebut untuk menyusun hasil audit,
                estimasi ROI, dan proposal, dan tidak bertanggung jawab atas kesimpulan yang didasarkan pada informasi tidak
                akurat yang diberikan Klien.
              </li>
              <li>
                Tidak akan menggunakan CargoGrid OS atau situs ini untuk mengoordinasikan pengiriman muatan kargo ilegal,
                narkotika, senjata selundupan, atau muatan berbahaya yang melanggar hukum Republik Indonesia.
              </li>
              <li>
                Wajib menjaga kerahasiaan kata sandi masuk dan mencegah pihak ketiga yang tidak berwenang mengakses atau
                mengambil data paket harga.
              </li>
            </>
          )}
        </ul>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "C. Pilot License & No Guarantee Until Commercial SLA" : "C. Lisensi Pilot & Tidak Ada Jaminan Sebelum SLA Komersial"}
        </h2>
        <p>
          {isEn ? (
            <>
              Approved pilot programs grant a non-transferable, non-exclusive, 30-day temporary trial license to use the
              CargoGrid OS sandbox. No commercial commitment, uptime guarantee, or service level is implied during the audit
              or pilot stage. Any commercial conversion requires signing a formal Service Level Agreement (SLA) specifying
              active user limits, custom API endpoints, uptime commitments, and billing arrangements.
            </>
          ) : (
            <>
              Program pilot projek yang disetujui memberikan hak lisensi pengujian non-eksklusif dan tidak dapat dialihkan
              selama 30 hari kepada Klien untuk menggunakan sandbox CargoGrid OS. Tidak ada komitmen komersial, jaminan
              uptime, atau service level yang tersirat selama tahap audit atau pilot. Transisi ke sistem komersial wajib
              diatur dalam Perjanjian Tingkat Layanan (SLA) formal terpisah yang mencantumkan batas pengguna aktif,
              penyesuaian integrasi API, komitmen uptime, dan skema penagihan.
            </>
          )}
        </p>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "D. Limitation of Liability" : "D. Batasan Tanggung Jawab"}
        </h2>
        <p>
          {isEn ? (
            <>
              CargoGrid is a digital process orchestration platform. We are not a logistics broker, freight forwarder, or
              transport provider. CargoGrid is not liable for physical cargo damage, sea/air shipping delays, vehicle
              breakdowns, or operational losses incurred during transit, which remain governed by the Client&apos;s own
              contracts with its physical transport vendors. ROI and cost-leakage figures shown in the simulator are
              illustrative estimates based on Client-provided inputs, not a guaranteed financial outcome.
            </>
          ) : (
            <>
              CargoGrid adalah penyedia sistem operasi digital alur kerja. Kami bukan broker logistik, freight forwarder
              fisik, maupun pemilik armada. CargoGrid tidak bertanggung jawab atas kerusakan fisik barang kargo di
              perjalanan, keterlambatan pelayaran/penerbangan, kerusakan kendaraan, maupun kerugian operasional lainnya yang
              timbul selama pengiriman — hal tersebut tetap menjadi tanggung jawab Klien dengan vendor pengangkutan fisiknya
              masing-masing. Angka ROI dan kebocoran biaya pada simulator bersifat estimasi ilustratif berdasarkan input dari
              Klien, bukan jaminan hasil finansial.
            </>
          )}
        </p>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "E. Intellectual Property" : "E. Hak Kekayaan Intelektual"}
        </h2>
        <p>
          {isEn ? (
            <>
              The CargoGrid name, logo, software, user interface, and documentation are the intellectual property of
              CargoGrid and may not be copied, reverse-engineered, or redistributed without written permission. Data and
              content the Client submits or generates through the platform (shipment data, pricing, customer records) remain
              the Client&apos;s property.
            </>
          ) : (
            <>
              Nama, logo, perangkat lunak, antarmuka pengguna, dan dokumentasi CargoGrid adalah kekayaan intelektual
              CargoGrid dan tidak boleh disalin, direkayasa balik, atau disebarluaskan tanpa izin tertulis. Data dan konten
              yang diserahkan atau dihasilkan Klien melalui platform (data pengiriman, harga, data pelanggan) tetap menjadi
              milik Klien.
            </>
          )}
        </p>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "F. External Links & Third-Party Tools" : "F. Tautan Eksternal & Alat Pihak Ketiga"}
        </h2>
        <p>
          {isEn ? (
            <>
              This website and the CargoGrid platform may reference or integrate with third-party tools we do not control
              (e.g. payment gateways, WhatsApp Business API, accounting software). CargoGrid is not responsible for the
              availability, content, or practices of such third-party services.
            </>
          ) : (
            <>
              Situs ini dan platform CargoGrid dapat merujuk atau berintegrasi dengan alat pihak ketiga yang tidak kami
              kendalikan (misalnya payment gateway, WhatsApp Business API, perangkat lunak akuntansi). CargoGrid tidak
              bertanggung jawab atas ketersediaan, konten, atau praktik dari layanan pihak ketiga tersebut.
            </>
          )}
        </p>

        <h2 className="font-display font-extrabold text-slate-900 mt-4 uppercase tracking-wider text-xs">
          {isEn ? "G. Changes to These Terms" : "G. Perubahan Ketentuan"}
        </h2>
        <p>
          {isEn
            ? "We may update these Terms & Conditions from time to time to reflect changes to our services or applicable law. Material changes will be indicated by an updated “Last Updated” date at the top of this page. Continued use of the website after changes take effect constitutes acceptance of the revised Terms."
            : "Kami dapat memperbarui Syarat & Ketentuan ini dari waktu ke waktu untuk mencerminkan perubahan layanan kami atau ketentuan hukum yang berlaku. Perubahan material akan ditandai dengan pembaruan tanggal “Terakhir Diperbarui” di bagian atas halaman ini. Penggunaan situs yang berkelanjutan setelah perubahan berlaku dianggap sebagai persetujuan atas ketentuan yang direvisi."}
        </p>

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

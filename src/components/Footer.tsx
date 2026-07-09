import React from "react";
import Logo from "./Logo";
import { Mail, Phone, MapPin, Shield } from "lucide-react";

export default function Footer({ lang = 'id' }: { lang?: 'id' | 'en' }) {
  const isEn = lang === 'en';

  return (
    <footer className="bg-[#eef2f6] border-t border-slate-200 text-slate-600 font-semibold py-12" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-300">
          
          {/* Logo & positioning */}
          <div className="md:col-span-5 flex flex-col gap-4 text-left">
            <Logo size="md" />
            <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-sm mt-2">
              {isEn ? (
                "CargoGrid is a logistics operating system connecting CRM, RFQs, quotes, shipment operations, warehousing, PODs, billing, and accounting ledgers into a single unified workspace."
              ) : (
                "CargoGrid adalah operating grid system logistik yang menghubungkan CRM, RFQ, quotation, shipment operations, warehouse, POD, billing, harian hingga General Ledger akuntansi dalam satu alur kerja tunggal."
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-3 text-left">
            <h4 className="font-display font-extrabold text-slate-900 text-xs uppercase tracking-widest">
              {isEn ? "Page Navigation" : "Navigasi Halaman"}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#challenges" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Core Bottlenecks" : "Penyebab Masalah"}
              </a>
              <a href="#system" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Unified Workflow" : "Satu Alur Kerja"}
              </a>
              <a href="#system" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Grid Modules" : "Modul Grid"}
              </a>
              <a href="#system" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Business Sectors" : "Sektor Bisnis"}
              </a>
              <a href="#simulator" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "ROI Calculator" : "Kalkulator ROI"}
              </a>
              <a href="#simulator" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Portal Demo" : "Eksplor Portal"}
              </a>
              <a href="#plans" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Pricing Suites" : "Paket Harga"}
              </a>
              <a href="#plans" className="hover:text-brand-orange transition-colors font-bold">
                FAQ
              </a>
            </div>
          </div>

          {/* Contacts info */}
          <div className="md:col-span-4 flex flex-col gap-3 text-left">
            <h4 className="font-display font-extrabold text-slate-900 text-xs uppercase tracking-widest">
              {isEn ? "Contact & Support" : "Kontak & Dukungan"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="font-bold text-slate-700">service@cargogrid.net</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="font-bold text-slate-700">+62877 8898 0088</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="font-bold text-slate-700">
                  {isEn ? "Sudirman Central Business District (SCBD), South Jakarta, Indonesia" : "Sudirman Central Business District (SCBD), Jakarta Selatan"}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-[11px] text-slate-500 font-mono font-bold border-t border-slate-300">
          <div>
            &copy; {new Date().getFullYear()} CargoGrid. All Rights Reserved &bull; Configurable Logistics ERP.
          </div>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 justify-center">
            <a href="#privacy" className="hover:text-brand-orange transition-colors font-extrabold">
              {isEn ? "Privacy Policy" : "Kebijakan Privasi"}
            </a>
            <span>&bull;</span>
            <a href="#terms" className="hover:text-brand-orange transition-colors font-extrabold">
              {isEn ? "Terms & Conditions" : "Syarat & Ketentuan"}
            </a>
            <span>&bull;</span>
            <span className="text-slate-500 font-extrabold">{isEn ? "SLA Guaranteed" : "Layanan SLA Terjamin"}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { pricingPackages } from "../data";
import type { PackageItem } from "../types";
import { useLanguage } from "./shared/LanguageProvider";
import PricingCard from "./pricing/PricingCard";
import PricingDetailDialog from "./pricing/PricingDetailDialog";
import Reveal from "./shared/Reveal";

export default function PricingSection() {
  const { lang } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const isEn = lang === "en";

  // Mencegah scroll body saat modal terbuka
  useEffect(() => {
    if (selectedPkg) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPkg]);

  const handleOpenDetail = (pkg: PackageItem) => {
    setSelectedPkg(pkg);
    setIsClosing(false);
  };

  const handleCloseDetail = () => {
    setIsClosing(true);
    // Tunggu animasi selesai baru hilangkan komponen dari DOM (0.5s match dgn CSS)
    setTimeout(() => {
      setSelectedPkg(null);
      setIsClosing(false);
    }, 500);
  };

  return (
    <section className="py-20 md:py-28 bg-[#eef2f6] relative" id="pricing">
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-slate-300/60 text-left">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-orange uppercase">
              {isEn ? "Product Pricing Packages" : "Paket Harga Produk"}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              {isEn ? (
                <>
                  Logistics System Investment <span className="text-brand-orange font-extrabold">Fitted to Your Scale</span>
                </>
              ) : (
                <>
                  Investasi Sistem Logistik <span className="text-brand-orange font-extrabold">Sesuai Kebutuhan Anda</span>
                </>
              )}
            </h1>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-slate-300 lg:pl-8">
            <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed font-sans">
              {isEn
                ? "Select the package that best fits your company scale, from essential tracking visibility to a complete daily operations platform. Tap any card to see the full feature list, implementation notes, and add-ons."
                : "Pilih paket sistem yang paling sesuai dengan skala dan tantangan bisnis Anda saat ini, mulai dari pelacakan dasar hingga platform operasional harian yang lengkap. Klik kartu mana pun untuk melihat fitur lengkap, catatan implementasi, dan add-on."}
            </p>
          </div>
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center gap-4 mt-10 mb-16">
          <span className={`text-xs font-mono font-black uppercase tracking-wider ${!isAnnual ? "text-slate-900" : "text-slate-400"}`}>
            {isEn ? "Monthly" : "Bulanan"}
          </span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            role="switch"
            aria-checked={isAnnual}
            aria-label={isEn ? "Toggle annual billing" : "Ubah ke tagihan tahunan"}
            className="relative w-14 h-8 nm-deboss bg-slate-200 rounded-full transition-all duration-200 cursor-pointer p-1 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`w-5.5 h-5.5 rounded-full bg-brand-orange shadow transition-transform ${isAnnual ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
          <span className={`text-xs font-mono flex items-center gap-1.5 font-black uppercase tracking-wider ${isAnnual ? "text-slate-900" : "text-slate-400"}`}>
            <span>{isEn ? "Annual (Save 20%)" : "Tahunan (Hemat 20%)"}</span>
            <span className="bg-emerald-500/10 text-emerald-700 font-sans font-black text-[9px] px-2.5 py-0.5 rounded-full tracking-wider">
              {isEn ? "SAVE 20%" : "HEMAT 20%"}
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16" id="pricing-packages-grid">
          {pricingPackages.map((pkg, idx) => (
            <PricingCard key={pkg.id} pkg={pkg} isAnnual={isAnnual} index={idx} onOpenDetail={handleOpenDetail} />
          ))}
        </div>

        <PricingDetailDialog pkg={selectedPkg} isClosing={isClosing} isAnnual={isAnnual} isEn={isEn} onClose={handleCloseDetail} />

        {/* Addons List Prompt */}
        <Reveal
          className="mt-20 nm-emboss bg-white/40 p-6 md:p-9 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-6 border-0 text-left"
          id="pricing-addons-prompt"
        >
          <div className="flex-1">
            <h4 className="font-display font-black text-xl text-slate-900">
              {isEn ? "Need Custom Add-Ons or Integrations?" : "Butuh Add-On atau Integrasi Kustom Tambahan?"}
            </h4>
            <p className="text-slate-600 text-xs font-semibold leading-relaxed mt-2">
              {isEn
                ? "Extend your operations with branded customer portals, barcode scanning, accounting connections, verified WhatsApp notifications, white-label domains, or historical spreadsheet migration."
                : "Tingkatkan kapabilitas operasional Anda dengan portal customer berlogo brand, barcode scanning, koneksi akuntansi, notifikasi WhatsApp terverifikasi, domain white-label, hingga migrasi data spreadsheet lama."}
            </p>
          </div>
          <div className="transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] will-change-transform">
            <Link
              href="/kontak"
              className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full text-xs font-black nm-btn bg-[#eef2f6] text-slate-700 hover:text-slate-900 transition-colors cursor-pointer border-0 uppercase tracking-wider whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            >
              <span>{isEn ? "Inquire Custom Add-Ons" : "Tanya Add-On Khusus"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-teal" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

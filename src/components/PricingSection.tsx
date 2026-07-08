import React, { useState } from "react";
import { pricingPackages } from "../data";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function PricingSection({ lang = 'id' }: { lang?: 'id' | 'en' }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const isEn = lang === 'en';

  // Helper to format currency to IDR millions/jt or custom
  const formatIDRPrice = (price: number) => {
    const million = price / 1000000;
    return `${million.toFixed(1).replace(".0", "")} Juta`;
  };

  return (
    <section
      className="py-20 md:py-28 bg-[#eef2f6] relative"
      id="pricing"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-slate-300/60 text-left">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-orange uppercase">
              {isEn ? "Product Pricing Packages" : "Product Pricing Packages"}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              {isEn ? (
                <>Logistics System Investment <span className="text-brand-orange font-extrabold">Fitted to Your Scale</span></>
              ) : (
                <>Investasi Sistem Logistik <span className="text-brand-orange font-extrabold">Sesuai Kebutuhan Anda</span></>
              )}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-slate-300 lg:pl-8">
            <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed font-sans">
              {isEn ? (
                "Select the logistics suite package that best aligns with your company scale. Ranging from essential tracking capabilities to a complete, end-to-end operational ERP."
              ) : (
                "Pilih paket sistem yang paling sesuai dengan skala dan tantangan bisnis Anda saat ini. Mulai dari pelacakan dasar hingga modul ERP logistik hulu ke hilir yang komprehensif harian."
              )}
            </p>
          </div>
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center gap-4 mt-10 mb-16">
          <span className={`text-xs font-mono font-black uppercase tracking-wider ${!isAnnual ? "text-slate-900" : "text-slate-400"}`}>
            {isEn ? "Monthly" : "Bulanan"}
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-8 nm-deboss bg-slate-200 rounded-full transition-all duration-200 cursor-pointer p-1 border-0"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`w-5.5 h-5.5 rounded-full bg-brand-orange shadow transition-transform ${
                isAnnual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-mono flex items-center gap-1.5 font-black uppercase tracking-wider ${isAnnual ? "text-slate-900" : "text-slate-400"}`}>
            <span>{isEn ? "Annual (Save 20%)" : "Tahunan (Hemat 20%)"}</span>
            <span className="bg-emerald-500/10 text-emerald-700 font-sans font-black text-[9px] px-2.5 py-0.5 rounded-full tracking-wider">
              SAVE 20%
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid - Clean, Well-Aligned Grid with Elegant Hover Emphasis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16" id="pricing-packages-grid">
          {pricingPackages.map((pkg, idx) => {
            const price = isAnnual ? pkg.priceAnnually : pkg.priceMonthly;
            const isEnterprise = pkg.id === "enterprise";
            
            const premiumBorder = pkg.isPopular 
              ? "nm-emboss ring-2 ring-brand-teal bg-white/75 shadow-xl" 
              : "nm-emboss bg-white/30";

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className={`relative flex flex-col justify-between p-7 sm:p-9 rounded-3xl border-0 transition-all duration-200 text-left ${premiumBorder}`}
              >
                {/* Popular Ribbon / Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-teal text-slate-950 font-mono text-[9px] font-black tracking-widest px-5 py-2 rounded-full uppercase shadow-md">
                    {isEn ? "MOST POPULAR CHOICE" : "REKOMENDASI UTAMA"}
                  </div>
                )}

                {/* Card Top */}
                <div className="flex flex-col gap-5">
                  <div>
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block font-black">
                      {isEn ? "BEST FIT FOR:" : "COCOK UNTUK:"} {isEn ? (pkg.fitEn || pkg.fit) : pkg.fit}
                    </span>
                    <h3 className="font-display font-black text-2xl text-slate-900 mt-1">{pkg.name}</h3>
                  </div>

                  <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[44px]">
                    {isEn ? (pkg.descEn || pkg.desc) : pkg.desc}
                  </p>

                  {/* Pricing Number Row */}
                  <div className="py-4.5 border-t border-b border-slate-200/80">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-black">
                      {isEn ? "STARTING AT:" : "HARGA MULAI DARI:"}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1 font-mono">
                      <span className="text-xs text-slate-500 font-extrabold">Rp</span>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        {formatIDRPrice(price)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase pl-1">/{isEn ? "month" : "bulan"}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 block mt-1.5 font-mono font-black tracking-wider uppercase">
                      {isAnnual ? (isEn ? "*Billed annually" : "*Ditagih tahunan") : (isEn ? "*Billed monthly" : "*Ditagih bulanan")}
                    </span>
                  </div>

                  {/* Target Positioning */}
                  <div className="nm-deboss bg-white/60 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed font-semibold">
                    &quot;{isEn ? (pkg.positioningEn || pkg.positioning) : pkg.positioning}&quot;
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 pt-2">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-black">
                      {isEn ? "Key Features Included:" : "Fitur Unggulan Termasuk:"}
                    </span>
                    <ul className="space-y-3 text-xs">
                      {(isEn ? (pkg.featuresEn || pkg.features) : pkg.features).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-slate-700 font-semibold leading-relaxed">
                          <Check className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Button */}
                <div className="pt-8 border-t border-slate-200/80 mt-8">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="#audit-form"
                    className={`inline-flex items-center justify-center gap-1.5 w-full py-3.5 rounded-full text-xs font-black transition-all duration-150 cursor-pointer border-0 uppercase tracking-wider ${
                      pkg.isPopular
                        ? "nm-btn-accent text-white shadow-md font-black"
                        : "nm-btn text-slate-700 hover:text-slate-900 font-black"
                    }`}
                  >
                    <span>{isEnterprise ? (isEn ? "Contact Enterprise Sales" : "Hubungi Enterprise Sales") : (isEn ? "Start 30-Day Paid Pilot" : "Mulai 30 Hari Pilot Kerja")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.a>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Addons List Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 nm-emboss bg-white/40 p-6 md:p-9 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-6 border-0 text-left"
          id="pricing-addons-prompt"
        >
          <div className="flex-1">
            <h4 className="font-display font-black text-xl text-slate-900">
              {isEn ? "Need Custom Add-Ons or API Integrations?" : "Butuh Add-On atau Integrasi Kustom Tambahan?"}
            </h4>
            <p className="text-slate-600 text-xs font-semibold leading-relaxed mt-2">
              {isEn ? (
                "Supercharge your operational workflow with Customer Portal Pro, advanced barcode scanning, General Ledger integration, verified WhatsApp notifications, complete White-Label domains, or historical Excel database migrations."
              ) : (
                "Tingkatkan kapabilitas sistem Anda dengan Customer Portal Pro, WMS Advanced barcode scanning, modul Akuntansi General Ledger, notifikasi otomatis WhatsApp terverifikasi, White-Labeling domain penuh, hingga prioritas migrasi data Excel lama."
              )}
            </p>
          </div>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#audit-form"
            className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full text-xs font-black nm-btn bg-[#eef2f6] text-slate-700 hover:text-slate-900 transition-colors cursor-pointer border-0 uppercase tracking-wider whitespace-nowrap"
          >
            <span>{isEn ? "Inquire Custom Add-Ons" : "Tanya Add-On Khusus"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-teal" />
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}

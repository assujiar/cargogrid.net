"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ChevronDown, Info, AlertTriangle, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import type { PackageItem } from "../../types";
import { useLanguage } from "../shared/LanguageProvider";

interface PricingCardProps {
  pkg: PackageItem;
  isAnnual: boolean;
  index: number;
}

const HEADLINE_FEATURE_COUNT = 4;

export default function PricingCard({ pkg, isAnnual, index }: PricingCardProps) {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const [isExpanded, setIsExpanded] = useState(false);

  const price = isAnnual ? pkg.priceAnnually : pkg.priceMonthly;
  const isEnterprise = pkg.id === "enterprise";

  const formatIDRPrice = (value: number) => {
    const million = value / 1000000;
    return `${million.toFixed(1).replace(".0", "")} Juta`;
  };

  const allFeatures = isEn ? pkg.featuresEn || pkg.features : pkg.features;
  const headlineFeatures = allFeatures.slice(0, HEADLINE_FEATURE_COUNT);
  const remainingFeatures = allFeatures.slice(HEADLINE_FEATURE_COUNT);

  const implementationNotes = isEn ? pkg.implementationNotesEn || pkg.implementationNotes : pkg.implementationNotes;
  const limitations = isEn ? pkg.limitationsEn || pkg.limitations : pkg.limitations;
  const addOns = isEn ? pkg.addOnsEn || pkg.addOns : pkg.addOns;

  const premiumBorder = pkg.isPopular ? "nm-emboss ring-2 ring-brand-teal bg-white/75 shadow-xl" : "nm-emboss bg-white/30";
  const panelId = `pricing-panel-${pkg.id}`;

  const ctaLabel = isEnterprise
    ? isEn
      ? "Contact Enterprise Sales"
      : "Hubungi Enterprise Sales"
    : isEn
      ? "Start 30-Day Paid Pilot"
      : "Mulai 30 Hari Pilot Kerja";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`relative flex flex-col justify-between p-7 sm:p-9 rounded-3xl border-0 transition-all duration-200 text-left ${premiumBorder}`}
    >
      {pkg.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-teal text-slate-950 font-mono text-[9px] font-black tracking-widest px-5 py-2 rounded-full uppercase shadow-md">
          {isEn ? "MOST POPULAR CHOICE" : "REKOMENDASI UTAMA"}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block font-black">
            {isEn ? "BEST FIT FOR:" : "COCOK UNTUK:"} {isEn ? pkg.fitEn || pkg.fit : pkg.fit}
          </span>
          <h3 className="font-display font-black text-2xl text-slate-900 mt-1">{pkg.name}</h3>
        </div>

        <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[44px]">{isEn ? pkg.descEn || pkg.desc : pkg.desc}</p>

        <div className="py-4.5 border-t border-b border-slate-200/80">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-black">
            {isEn ? "STARTING AT:" : "HARGA MULAI DARI:"}
          </span>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-xs text-slate-500 font-extrabold">Rp</span>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{formatIDRPrice(price)}</span>
            <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase pl-1">
              /{isAnnual ? (isEn ? "month, billed yearly" : "bulan, ditagih tahunan") : isEn ? "month" : "bulan"}
            </span>
          </div>
        </div>

        <div className="nm-deboss bg-white/60 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed font-semibold">
          &quot;{isEn ? pkg.positioningEn || pkg.positioning : pkg.positioning}&quot;
        </div>

        <div className="space-y-4 pt-2">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-black">
            {isEn ? "Key Features Included:" : "Fitur Unggulan Termasuk:"}
          </span>
          <ul className="space-y-3 text-xs">
            {headlineFeatures.map((feat, fIdx) => (
              <li key={fIdx} className="flex items-start gap-2.5 text-slate-700 font-semibold leading-relaxed">
                <Check className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expand trigger */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          className="inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-full text-[11px] font-black uppercase tracking-wider text-brand-teal hover:text-brand-teal-hover transition-colors cursor-pointer border border-brand-teal/30 hover:border-brand-teal/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          <span>{isExpanded ? (isEn ? "Show less" : "Sembunyikan detail") : isEn ? "See full details" : "Lihat detail lengkap"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>

        {/* Expanded content — always in the DOM, only visually clipped, never
            hidden from assistive tech */}
        <div id={panelId} role="region" aria-label={`${pkg.name} ${isEn ? "full details" : "detail lengkap"}`} className="cg-disclosure-panel" data-open={isExpanded}>
          <div className="flex flex-col gap-5 pt-1">
            {remainingFeatures.length > 0 && (
              <div className="space-y-3">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-black">
                  {isEn ? "More Included Features:" : "Fitur Lengkap Lainnya:"}
                </span>
                <ul className="space-y-3 text-xs">
                  {remainingFeatures.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-slate-700 font-semibold leading-relaxed">
                      <Check className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {implementationNotes && (
              <div className="nm-deboss-sm bg-white/50 p-4 rounded-2xl">
                <h4 className="flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest text-brand-teal mb-1.5">
                  <Info className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? "Implementation Notes" : "Catatan Implementasi"}</span>
                </h4>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">{implementationNotes}</p>
              </div>
            )}

            {limitations && limitations.length > 0 && (
              <div className="nm-deboss-sm bg-amber-50/60 p-4 rounded-2xl">
                <h4 className="flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest text-brand-orange mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? "Limitations" : "Batasan Paket"}</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 font-semibold leading-relaxed list-disc pl-4">
                  {limitations.map((lim, lIdx) => (
                    <li key={lIdx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}

            {addOns && addOns.length > 0 && (
              <div className="nm-deboss-sm bg-white/50 p-4 rounded-2xl">
                <h4 className="flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest text-slate-500 mb-1.5">
                  <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isEn ? "Add-On Availability" : "Add-On Tersedia"}</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 font-semibold leading-relaxed list-disc pl-4">
                  {addOns.map((addon, aIdx) => (
                    <li key={aIdx}>{addon}</li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/kontak"
              className={`inline-flex items-center justify-center gap-1.5 w-full py-3.5 rounded-full text-xs font-black transition-all duration-150 cursor-pointer uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                pkg.isPopular ? "nm-btn-accent text-white shadow-md" : "nm-btn text-slate-700 hover:text-slate-900"
              }`}
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary CTA (always visible) */}
      <div className="pt-8 border-t border-slate-200/80 mt-8">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/kontak"
            className={`inline-flex items-center justify-center gap-1.5 w-full py-3.5 rounded-full text-xs font-black transition-all duration-150 cursor-pointer border-0 uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
              pkg.isPopular ? "nm-btn-accent text-white shadow-md font-black" : "nm-btn text-slate-700 hover:text-slate-900 font-black"
            }`}
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

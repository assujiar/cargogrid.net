"use client";

import React from "react";
import type { PackageItem } from "../../types";
import { useLanguage } from "../shared/LanguageProvider";
import Reveal from "../shared/Reveal";
import { formatIDRPrice } from "../../lib/pricing";

interface PricingCardProps {
  pkg: PackageItem;
  isAnnual: boolean;
  index: number;
  onOpenDetail: (pkg: PackageItem) => void;
}

export default function PricingCard({ pkg, isAnnual, index, onOpenDetail }: PricingCardProps) {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const price = isAnnual ? pkg.priceAnnually : pkg.priceMonthly;

  const premiumBorder = pkg.isPopular ? "nm-emboss ring-2 ring-brand-teal bg-white/75 shadow-xl" : "nm-emboss bg-white/30";

  return (
    <Reveal delayMs={index * 100} className="relative h-full">
      {pkg.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 bg-brand-teal text-slate-950 font-mono text-[9px] font-black tracking-widest px-5 py-2 rounded-full uppercase shadow-md">
          {isEn ? "MOST POPULAR CHOICE" : "REKOMENDASI UTAMA"}
        </div>
      )}

      {/* Whole card is the single interactive control — opens the detail dialog */}
      <button
        type="button"
        onClick={() => onOpenDetail(pkg)}
        aria-haspopup="dialog"
        className={`flex flex-col gap-5 p-7 sm:p-9 rounded-3xl border-0 h-full w-full text-left cursor-pointer transition-transform duration-200 hover:-translate-y-2 hover:scale-[1.01] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${premiumBorder}`}
      >
        <div>
          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block font-black">
            {isEn ? "BEST FIT FOR:" : "COCOK UNTUK:"} {isEn ? pkg.fitEn || pkg.fit : pkg.fit}
          </span>
          <h3 className="font-display font-black text-2xl text-slate-900 mt-1">{pkg.name}</h3>
        </div>

        <p className="text-slate-600 text-xs font-semibold leading-relaxed min-h-[44px]">{isEn ? pkg.descEn || pkg.desc : pkg.desc}</p>

        <div className="py-4.5 border-t border-slate-200/80 mt-auto">
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
      </button>
    </Reveal>
  );
}

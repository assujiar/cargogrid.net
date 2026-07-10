"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { PackageItem } from "../../types";
import { useLanguage } from "../shared/LanguageProvider";
import Reveal from "../shared/Reveal";
import { formatIDRPrice, getPricingCtaLabel } from "../../lib/pricing";

interface PricingCardProps {
  pkg: PackageItem;
  isAnnual: boolean;
  index: number;
  onOpenDetail: (pkg: PackageItem) => void;
}

const HEADLINE_FEATURE_COUNT = 4;

export default function PricingCard({ pkg, isAnnual, index, onOpenDetail }: PricingCardProps) {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const price = isAnnual ? pkg.priceAnnually : pkg.priceMonthly;

  const allFeatures = isEn ? pkg.featuresEn || pkg.features : pkg.features;
  const headlineFeatures = allFeatures.slice(0, HEADLINE_FEATURE_COUNT);
  const remainingFeatureCount = allFeatures.length - headlineFeatures.length;

  const premiumBorder = pkg.isPopular ? "nm-emboss ring-2 ring-brand-teal bg-white/75 shadow-xl" : "nm-emboss bg-white/30";

  const ctaLabel = getPricingCtaLabel(pkg, isEn);

  return (
    <Reveal
      delayMs={index * 100}
      className={`relative flex flex-col justify-between p-7 sm:p-9 rounded-3xl border-0 h-full transition-transform duration-200 hover:-translate-y-2 hover:scale-[1.01] will-change-transform text-left ${premiumBorder}`}
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

        {/* Detail trigger — opens the shared PricingDetailDialog */}
        <button
          type="button"
          onClick={() => onOpenDetail(pkg)}
          className="inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-full text-[11px] font-black uppercase tracking-wider text-brand-teal hover:text-brand-teal-hover transition-colors cursor-pointer border border-brand-teal/30 hover:border-brand-teal/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          <span>
            {isEn ? "See full details" : "Lihat detail lengkap"}
            {remainingFeatureCount > 0 ? ` (+${remainingFeatureCount})` : ""}
          </span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Primary CTA (always visible) */}
      <div className="pt-8 border-t border-slate-200/80 mt-8">
        <div className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] will-change-transform">
          <Link
            href="/kontak"
            className={`inline-flex items-center justify-center gap-1.5 w-full py-3.5 rounded-full text-xs font-black transition-colors duration-150 cursor-pointer border-0 uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
              pkg.isPopular ? "nm-btn-accent text-white shadow-md font-black" : "nm-btn text-slate-700 hover:text-slate-900 font-black"
            }`}
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

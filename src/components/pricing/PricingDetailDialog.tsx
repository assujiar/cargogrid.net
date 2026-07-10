"use client";

import React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Check, Info, AlertTriangle, PlusCircle, X, ArrowRight } from "lucide-react";
import type { PackageItem } from "../../types";
import { formatIDRPrice, getPricingCtaLabel } from "../../lib/pricing";

interface PricingDetailDialogProps {
  pkg: PackageItem | null;
  isClosing: boolean;
  isAnnual: boolean;
  isEn: boolean;
  onClose: () => void;
}

export default function PricingDetailDialog({ pkg, isClosing, isAnnual, isEn, onClose }: PricingDetailDialogProps) {
  if (!pkg) return null;

  const price = isAnnual ? pkg.priceAnnually : pkg.priceMonthly;
  const fit = isEn ? pkg.fitEn || pkg.fit : pkg.fit;
  const desc = isEn ? pkg.descEn || pkg.desc : pkg.desc;
  const positioning = isEn ? pkg.positioningEn || pkg.positioning : pkg.positioning;
  const features = isEn ? pkg.featuresEn || pkg.features : pkg.features;
  const implementationNotes = isEn ? pkg.implementationNotesEn || pkg.implementationNotes : pkg.implementationNotes;
  const limitations = isEn ? pkg.limitationsEn || pkg.limitations : pkg.limitations;
  const addOns = isEn ? pkg.addOnsEn || pkg.addOns : pkg.addOns;
  const ctaLabel = getPricingCtaLabel(pkg, isEn);

  // Rendered via a portal so the dialog escapes the <main> stacking context
  // (SiteShell's <main> is `relative z-10`, which caps any fixed-position
  // descendant below the Navbar wrapper's `z-20`, regardless of its own
  // z-index) and always paints above the rest of the page.
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" id="pricing-detail-dialog">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-navy-dark/85 ${isClosing ? "backdrop-animate-out" : "backdrop-animate-in"}`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] nm-emboss-lg bg-white/75 rounded-3xl overflow-hidden flex flex-col ${
          isClosing ? "modal-animate-out" : "modal-animate-in"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/50">
          <h3 className="font-display font-black text-xl text-slate-900">{isEn ? "Package Detail Information" : "Informasi Detail Paket"}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? "Close" : "Tutup"}
            className="p-2 text-slate-400 hover:text-red-500 hover:shadow-[inset_4px_4px_10px_#cdd4db,inset_-4px_-4px_10px_#ffffff] rounded-full transition-all cursor-pointer border-0"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Info & Harga */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 stagger-1">
            <div className="flex-1 nm-emboss bg-white/60 rounded-2xl p-6">
              <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-2">
                {isEn ? "BEST FIT FOR:" : "COCOK UNTUK:"} {fit}
              </p>
              <h2 className="font-display font-black text-3xl text-slate-900 mb-2">{pkg.name}</h2>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed">{desc}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col justify-center nm-deboss bg-white/60 rounded-2xl p-6 md:min-w-[200px]">
              <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-2">
                {isEn ? "STARTING AT:" : "HARGA MULAI DARI:"}
              </p>
              <div className="flex items-baseline text-slate-900 font-mono">
                <span className="text-lg font-extrabold mr-1">Rp</span>
                <span className="text-4xl font-black tracking-tighter">{formatIDRPrice(price)}</span>
                <span className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-wider">/{isEn ? "Mo" : "Bln"}</span>
              </div>
            </div>
          </div>

          {/* Quote Banner */}
          <div className="nm-deboss bg-white/60 rounded-xl p-5 mb-8 stagger-2">
            <p className="text-sm text-slate-600 font-semibold italic border-l-4 border-brand-teal pl-4">&quot;{positioning}&quot;</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Kolom Kiri: Features */}
            <div className="space-y-3 stagger-3">
              <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-white/50 pb-2">
                {isEn ? "Features Included:" : "Fitur Lengkap Termasuk:"}
              </p>
              <ul className="space-y-3.5 text-xs">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-700 font-semibold leading-relaxed">
                    <Check className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom Kanan: Notes, Limitations, Addons */}
            <div className="space-y-5 stagger-4">
              {implementationNotes && (
                <div className="nm-deboss-sm bg-white/50 rounded-xl p-5">
                  <p className="flex items-center gap-1.5 text-[10px] font-mono font-black text-brand-teal uppercase tracking-widest mb-2.5">
                    <Info className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isEn ? "Implementation Notes" : "Catatan Implementasi"}</span>
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{implementationNotes}</p>
                </div>
              )}

              {limitations && limitations.length > 0 && (
                <div className="nm-deboss-sm bg-amber-50/60 rounded-xl p-5">
                  <p className="flex items-center gap-1.5 text-[10px] font-mono font-black text-brand-orange uppercase tracking-widest mb-2.5">
                    <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isEn ? "Limitations" : "Batasan Paket"}</span>
                  </p>
                  <ul className="text-xs text-slate-500 font-medium list-disc pl-4 space-y-2 marker:text-slate-300">
                    {limitations.map((limit, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        {limit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {addOns && addOns.length > 0 && (
                <div className="nm-deboss-sm bg-white/50 rounded-xl p-5">
                  <p className="flex items-center gap-1.5 text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mb-2.5">
                    <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isEn ? "Add-On Availability" : "Add-On Tersedia"}</span>
                  </p>
                  <ul className="text-xs text-slate-500 font-medium list-disc pl-4 space-y-2 marker:text-slate-300">
                    {addOns.map((addon, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        {addon}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 border-t border-white/50 stagger-5">
          <Link
            href="/kontak"
            className="w-full md:w-auto md:float-right py-4 px-8 rounded-full nm-btn-accent text-white font-black text-sm tracking-wider uppercase transition-all flex justify-center items-center gap-2"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <div className="clear-both" />
        </div>
      </div>
    </div>,
    document.body
  );
}

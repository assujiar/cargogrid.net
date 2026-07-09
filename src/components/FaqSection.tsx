"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareCode } from "lucide-react";
import { useLanguage } from "./shared/LanguageProvider";
import FaqAccordion from "./faq/FaqAccordion";

export default function FaqSection() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <section className="py-20 md:py-28 bg-[#eef2f6] relative" id="faq">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4 text-left sm:text-center">
          <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-teal uppercase">Questions &amp; Answers</span>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
            Frequently Asked <span className="text-brand-teal font-extrabold">Questions (FAQ)</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed mt-2">
            {isEn
              ? "Most common questions from business owners, operations managers, and finance teams regarding CargoGrid system implementation."
              : "Pertanyaan paling umum dari pemilik perusahaan, manajer operasional, dan divisi keuangan terkait implementasi sistem logistik CargoGrid."}
          </p>
        </div>

        <FaqAccordion />

        {/* Related pages */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5" id="faq-related-links">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 mr-1">
            {isEn ? "Related:" : "Terkait:"}
          </span>
          <Link href="/solusi" className="text-[11px] font-bold px-3 py-1.5 rounded-full nm-btn bg-white/50 text-slate-600 hover:text-brand-teal transition-colors">
            {isEn ? "System & Modules" : "Sistem & Modul"}
          </Link>
          <Link href="/paket" className="text-[11px] font-bold px-3 py-1.5 rounded-full nm-btn bg-white/50 text-slate-600 hover:text-brand-teal transition-colors">
            {isEn ? "Pricing Packages" : "Paket Harga"}
          </Link>
          <Link href="/simulator-roi" className="text-[11px] font-bold px-3 py-1.5 rounded-full nm-btn bg-white/50 text-slate-600 hover:text-brand-teal transition-colors">
            {isEn ? "ROI Simulator" : "Simulator ROI"}
          </Link>
        </div>

        {/* Dynamic objection handler */}
        <div className="mt-12 text-center nm-deboss bg-white/40 p-6 rounded-2xl border-0">
          <p className="text-slate-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 flex-wrap">
            <MessageSquareCode className="w-5 h-5 text-brand-teal" aria-hidden="true" />
            <span>{isEn ? "Have specific operational questions not answered above?" : "Punya pertanyaan operasional khusus yang belum terjawab di atas?"}</span>
            <Link href="/kontak" className="text-brand-teal hover:text-brand-orange font-black underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded">
              {isEn ? "Consult with Our Expert Team →" : "Diskusi dengan Tim Ahli Kami →"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

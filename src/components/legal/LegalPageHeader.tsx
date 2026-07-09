"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, Scale } from "lucide-react";
import { useLanguage } from "../shared/LanguageProvider";

interface LegalPageHeaderProps {
  doc: "privacy" | "terms";
}

export default function LegalPageHeader({ doc }: LegalPageHeaderProps) {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-black text-slate-500 hover:text-brand-orange transition-colors mb-8 uppercase tracking-wider bg-white px-4.5 py-2.5 rounded-full shadow-sm cursor-pointer border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>{isEn ? "Back to Homepage" : "Kembali ke Beranda"}</span>
      </Link>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-teal/10 rounded-full text-brand-teal text-[10px] font-mono font-black uppercase tracking-widest mb-3">
          <Lock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isEn ? "Secure Corporate Legal" : "Hukum & Privasi Korporat"}</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
          {doc === "privacy"
            ? isEn
              ? "Privacy Policy"
              : "Kebijakan Privasi"
            : isEn
              ? "Terms & Conditions"
              : "Syarat & Ketentuan"}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-2 font-semibold">
          {isEn
            ? "CargoGrid Logistics OS • Compliant with UU ITE, UU PDP & GDPR Guidelines"
            : "CargoGrid Logistics OS • Sesuai dengan Regulasi UU ITE, UU PDP & Standar GDPR"}
        </p>
        <div className="flex justify-center gap-3 mt-5">
          <Link
            href="/kebijakan-privasi"
            aria-current={doc === "privacy" ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
              doc === "privacy" ? "bg-brand-orange text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? "Privacy Policy" : "Kebijakan Privasi"}</span>
          </Link>
          <Link
            href="/syarat-ketentuan"
            aria-current={doc === "terms" ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
              doc === "terms" ? "bg-brand-orange text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:text-slate-800"
            }`}
          >
            <Scale className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? "Terms of Service" : "Syarat & Ketentuan"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

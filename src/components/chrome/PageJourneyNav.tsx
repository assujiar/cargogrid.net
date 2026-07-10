"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "../shared/LanguageProvider";

export type PublicJourneyView = "landing" | "challenges" | "system" | "simulator" | "plans" | "contact";

interface PageJourneyNavProps {
  view: PublicJourneyView;
}

const journeySteps = [
  {
    view: "landing",
    href: "/",
    labelId: "Home",
    labelEn: "Home",
    nextCtaId: "Ketahui Masalah yang Biasa Dihadapi",
    nextCtaEn: "See the Problems You're Facing",
  },
  {
    view: "challenges",
    href: "/tantangan",
    labelId: "Tantangan",
    labelEn: "Challenges",
    nextCtaId: "Lihat Sistem & Modul yang Tersedia",
    nextCtaEn: "See the Available System & Modules",
  },
  {
    view: "system",
    href: "/solusi",
    labelId: "Sistem & Modul",
    labelEn: "System & Modules",
    nextCtaId: "Hitung Simulasi ROI Anda",
    nextCtaEn: "Calculate Your ROI",
  },
  {
    view: "simulator",
    href: "/simulator-roi",
    labelId: "Simulator & ROI",
    labelEn: "Simulator & ROI",
    nextCtaId: "Lihat Paket & Harga",
    nextCtaEn: "View Plans & Pricing",
  },
  {
    view: "plans",
    href: "/paket",
    labelId: "Paket & FAQ",
    labelEn: "Plans & FAQ",
    nextCtaId: "Mulai Konsultasi & Audit Gratis",
    nextCtaEn: "Start Your Free Consultation",
  },
  {
    view: "contact",
    href: "/kontak",
    labelId: "Kontak/Form",
    labelEn: "Contact/Form",
    nextCtaId: "",
    nextCtaEn: "",
  },
] as const;

export default function PageJourneyNav({ view }: PageJourneyNavProps) {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const activeIndex = Math.max(journeySteps.findIndex((step) => step.view === view), 0);
  const currentStep = journeySteps[activeIndex];
  const previousStep = activeIndex > 0 ? journeySteps[activeIndex - 1] : undefined;
  const nextStep = activeIndex < journeySteps.length - 1 ? journeySteps[activeIndex + 1] : undefined;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 sm:pb-14" id="page-prev-next-nav">
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${previousStep ? "sm:justify-between" : "sm:justify-end"}`}>
        {previousStep && (
          <Link
            href={previousStep.href}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl nm-btn text-slate-700 text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? previousStep.labelEn : previousStep.labelId}</span>
          </Link>
        )}
        {nextStep && (
          <Link
            href={nextStep.href}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl nm-btn-accent text-white text-xs font-black shadow-md text-center"
          >
            <span>{isEn ? currentStep.nextCtaEn : currentStep.nextCtaId}</span>
            <ArrowRight className="w-4 h-4 text-white shrink-0" />
          </Link>
        )}
      </div>
    </section>
  );
}

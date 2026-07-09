"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
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
    titleId: "Mulai transformasi operasional Anda",
    titleEn: "Start transforming your operations",
    descId: "Semua alur kerja logistik Anda, dari permintaan customer sampai laporan keuangan, terhubung dalam satu sistem.",
    descEn: "Every workflow in your logistics operation, from customer request to financial reporting, connected in one system.",
  },
  {
    view: "challenges",
    href: "/tantangan",
    labelId: "Tantangan",
    labelEn: "Challenges",
    titleId: "Petakan hambatan yang menahan pertumbuhan",
    titleEn: "Map the bottlenecks holding growth back",
    descId: "Sebelum bicara sistem, kita lihat dulu bocornya di mana: RFQ yang hilang, rate vendor yang tercecer, POD yang telat, dan invoice yang mundur.",
    descEn: "Before we talk systems, let's see where the leaks actually are: lost RFQs, scattered vendor rates, late PODs, and invoices that keep slipping.",
  },
  {
    view: "system",
    href: "/solusi",
    labelId: "Sistem & Modul",
    labelEn: "System & Modules",
    titleId: "Bangun operating system yang saling terhubung",
    titleEn: "Build a connected operating system",
    descId: "Setelah problem-nya jelas, CargoGrid menyambungkan alur kerja dari inquiry sampai billing dalam satu sistem yang bisa dikonfigurasi.",
    descEn: "Once the problems are clear, CargoGrid connects your workflow from inquiry to billing in one configurable system.",
  },
  {
    view: "simulator",
    href: "/simulator-roi",
    labelId: "Simulator & ROI",
    labelEn: "Simulator & ROI",
    titleId: "Ukur dampak dan potensi ROI",
    titleEn: "Measure impact and ROI potential",
    descId: "Masukkan angka operasional Anda. Dari situ kita bisa lihat berapa biaya yang bocor karena POD telat, update manual, dan invoice yang mundur.",
    descEn: "Enter your operational numbers. From there we can see how much is leaking from late PODs, manual updates, and delayed invoices.",
  },
  {
    view: "plans",
    href: "/paket",
    labelId: "Paket & FAQ",
    labelEn: "Plans & FAQ",
    titleId: "Pilih jalur implementasi yang tepat",
    titleEn: "Choose the right implementation path",
    descId: "Pilih paket berdasarkan tahap bisnis Anda. Mulai dari tim yang baru merapikan workflow sampai operator multi-cabang yang butuh kontrol penuh.",
    descEn: "Pick a package based on where your business is at. From teams just tidying up their workflow to multi-branch operators needing full control.",
  },
  {
    view: "contact",
    href: "/kontak",
    labelId: "Kontak/Form",
    labelEn: "Contact/Form",
    titleId: "Mulai audit dan rencana transformasi",
    titleEn: "Start your audit and transformation plan",
    descId: "Ceritakan kondisi operasional Anda. Tim CargoGrid bisa bantu mapping workflow, pain point, dan opsi implementasi yang paling masuk akal.",
    descEn: "Tell us about your operations. The CargoGrid team can help map your workflow, pain points, and the implementation option that makes the most sense.",
  },
] as const;

export default function PageJourneyNav({ view }: PageJourneyNavProps) {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const activeIndex = Math.max(journeySteps.findIndex((step) => step.view === view), 0);
  const currentStep = journeySteps[activeIndex];
  const previousStep = activeIndex > 0 ? journeySteps[activeIndex - 1] : undefined;
  const nextStep = activeIndex < journeySteps.length - 1 ? journeySteps[activeIndex + 1] : undefined;
  const progress = ((activeIndex + 1) / journeySteps.length) * 100;

  return (
    <section className="relative bg-[#eef2f6] px-4 sm:px-6 lg:px-8 pb-5 sm:pb-7 md:sticky md:top-20 md:z-10" id="journey-step-navigation">
      {/* Mobile: purpose-built compact journey card, not just a scaled-down desktop nav */}
      <div className="md:hidden mx-auto max-w-md nm-emboss bg-white/70 rounded-3xl p-4 border-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-mono font-black uppercase tracking-[0.22em] text-brand-orange">
              {isEn ? "Your Rollout Path" : "Jalur Implementasi Anda"}
            </p>
            {/* Wayfinding label, not a document heading — see desktop variant note below. */}
            <p className="font-display font-black text-lg text-slate-900 leading-tight mt-1">{isEn ? currentStep.titleEn : currentStep.titleId}</p>
          </div>
          <span className="shrink-0 rounded-2xl bg-brand-teal text-white px-3 py-2 text-xs font-black shadow-md">
            {activeIndex + 1}/{journeySteps.length}
          </span>
        </div>

        <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-teal transition-all" style={{ width: `${progress}%` }} />
        </div>

        {/* Compact "X of N" summary instead of a horizontally-scrolling chip
            row — avoids clipped/cut-off step labels at narrow (~360px)
            mobile widths with no visible scroll affordance. */}
        <p className="mt-3 text-[11px] text-slate-500 font-bold">
          {isEn ? `Step ${activeIndex + 1} of ${journeySteps.length}` : `Langkah ${activeIndex + 1} dari ${journeySteps.length}`}
          {nextStep && (
            <>
              {" "}
              &bull; {isEn ? "Next:" : "Berikutnya:"} <span className="text-slate-700">{isEn ? nextStep.labelEn : nextStep.labelId}</span>
            </>
          )}
        </p>

        <div className={`mt-4 grid gap-2 ${nextStep ? "grid-cols-2" : "grid-cols-1"}`}>
          <Link
            href={previousStep?.href || "/"}
            aria-disabled={!previousStep}
            className={`inline-flex items-center justify-center gap-1.5 rounded-2xl px-3 py-3 text-[11px] font-black ${
              previousStep ? "nm-btn text-slate-700" : "bg-slate-100 text-slate-400 pointer-events-none"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isEn ? "Previous" : "Sebelumnya"}
          </Link>
          {nextStep && (
            <Link
              href={nextStep.href}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl px-3 py-3 text-[11px] font-black nm-btn-accent text-white"
            >
              {isEn ? "Next" : "Lanjut"}
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          )}
        </div>
      </div>

      {/* Tablet/Desktop: full journey map */}
      <div className="hidden md:block max-w-7xl mx-auto nm-emboss bg-white/60 rounded-3xl p-5 lg:p-6 border-0">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3 text-left min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {journeySteps.map((step, index) => {
                const isCompleted = index < activeIndex;
                const isActive = index === activeIndex;
                return (
                  <Link
                    key={step.view}
                    href={step.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] lg:text-xs font-black transition-all ${
                      isActive
                        ? "bg-brand-teal text-white shadow-md"
                        : isCompleted
                          ? "bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/15"
                          : "bg-slate-200/70 text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{index + 1}. {isEn ? step.labelEn : step.labelId}</span>
                  </Link>
                );
              })}
            </div>
            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-brand-orange">
                {isEn ? "Your Rollout Path" : "Jalur Implementasi Anda"}
              </p>
              {/* Wayfinding label, not a document heading — the page's own <h1> owns
                  the heading hierarchy, so this stays a styled paragraph. */}
              <p className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-1">
                {isEn ? currentStep.titleEn : currentStep.titleId}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 max-w-2xl leading-relaxed">
                {isEn ? currentStep.descEn : currentStep.descId}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 xl:flex-shrink-0">
            {previousStep && (
              <Link href={previousStep.href} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl nm-btn text-slate-700 text-xs font-black">
                <ArrowLeft className="w-4 h-4" />
                <span>{isEn ? previousStep.labelEn : previousStep.labelId}</span>
              </Link>
            )}
            {nextStep && (
              <Link href={nextStep.href} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl nm-btn-accent text-white text-xs font-black shadow-md">
                <span>{`${isEn ? "Next:" : "Lanjut:"} ${isEn ? nextStep.labelEn : nextStep.labelId}`}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

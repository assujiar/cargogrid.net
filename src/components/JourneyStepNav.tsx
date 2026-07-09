import React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

type PublicJourneyView = "landing" | "challenges" | "system" | "simulator" | "plans" | "contact";

interface JourneyStepNavProps {
  view: PublicJourneyView;
  lang: "id" | "en";
}

const journeySteps = [
  { view: "landing", href: "#", labelId: "Home", labelEn: "Home", titleId: "Mulai transformasi operasional Anda", titleEn: "Start transforming your operations" },
  { view: "challenges", href: "#challenges", labelId: "Tantangan", labelEn: "Challenges", titleId: "Petakan hambatan yang menahan pertumbuhan", titleEn: "Map the bottlenecks holding growth back" },
  { view: "system", href: "#system", labelId: "Sistem & Modul", labelEn: "System & Modules", titleId: "Bangun alur kerja yang saling terhubung", titleEn: "Build a connected workflow" },
  { view: "simulator", href: "#simulator", labelId: "Simulator & ROI", labelEn: "Simulator & ROI", titleId: "Ukur dampak dan potensi ROI", titleEn: "Measure impact and ROI potential" },
  { view: "plans", href: "#plans", labelId: "Paket & FAQ", labelEn: "Plans & FAQ", titleId: "Pilih jalur implementasi yang tepat", titleEn: "Choose the right implementation path" },
  { view: "contact", href: "#contact", labelId: "Kontak/Form", labelEn: "Contact/Form", titleId: "Mulai audit dan rencana transformasi", titleEn: "Start your audit and transformation plan" },
] as const;

export default function JourneyStepNav({ view, lang }: JourneyStepNavProps) {
  const isEn = lang === "en";
  const activeIndex = Math.max(journeySteps.findIndex((step) => step.view === view), 0);
  const currentStep = journeySteps[activeIndex];
  const previousStep = activeIndex > 0 ? journeySteps[activeIndex - 1] : undefined;
  const nextStep = activeIndex < journeySteps.length - 1 ? journeySteps[activeIndex + 1] : undefined;
  const progress = ((activeIndex + 1) / journeySteps.length) * 100;

  return (
    <section className="relative bg-[#eef2f6] px-4 sm:px-6 lg:px-8 pb-5 sm:pb-7" id="journey-step-navigation">
      {/* Mobile: purpose-built compact journey card, not just a scaled-down desktop nav */}
      <div className="md:hidden mx-auto max-w-md nm-emboss bg-white/70 rounded-3xl p-4 border-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-mono font-black uppercase tracking-[0.22em] text-brand-orange">Your Transformation Journey</p>
            <h2 className="font-display font-black text-lg text-slate-900 leading-tight mt-1">{isEn ? currentStep.titleEn : currentStep.titleId}</h2>
          </div>
          <span className="shrink-0 rounded-2xl bg-brand-teal text-white px-3 py-2 text-xs font-black shadow-md">
            {activeIndex + 1}/{journeySteps.length}
          </span>
        </div>

        <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-teal transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 snap-x">
          {journeySteps.map((step, index) => {
            const isActive = index === activeIndex;
            return (
              <a
                key={step.view}
                href={step.href}
                className={`snap-start shrink-0 rounded-2xl px-3 py-2 text-[10px] font-black transition-all ${
                  isActive ? "bg-brand-teal text-white shadow-md" : "bg-slate-100 text-slate-500"
                }`}
              >
                {index + 1}. {isEn ? step.labelEn : step.labelId}
              </a>
            );
          })}
        </div>

        <div className={`mt-4 grid gap-2 ${nextStep ? "grid-cols-2" : "grid-cols-1"}`}>
          <a
            href={previousStep?.href || "#"}
            className={`inline-flex items-center justify-center gap-1.5 rounded-2xl px-3 py-3 text-[11px] font-black ${
              previousStep ? "nm-btn text-slate-700" : "bg-slate-100 text-slate-400 pointer-events-none"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isEn ? "Previous" : "Sebelumnya"}
          </a>
          {nextStep && (
            <a
              href={nextStep.href}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl px-3 py-3 text-[11px] font-black nm-btn-accent text-white"
            >
              {isEn ? "Next" : "Lanjut"}
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </a>
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
                  <a
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
                  </a>
                );
              })}
            </div>
            <div>
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-brand-orange">Your Transformation Journey</p>
              <h2 className="font-display font-black text-xl lg:text-2xl text-slate-900 mt-1">{isEn ? currentStep.titleEn : currentStep.titleId}</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 max-w-3xl leading-relaxed">
                {isEn
                  ? "Follow the transformation journey from operational friction to connected systems, measurable ROI, implementation options, and an consultation-ready action plan."
                  : "Ikuti journey transformasi dari friksi operasional menuju sistem terhubung, ROI terukur, pilihan implementasi, dan rencana konsultasi yang siap dijalankan."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 xl:flex-shrink-0">
            {previousStep && (
              <a href={previousStep.href} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl nm-btn text-slate-700 text-xs font-black">
                <ArrowLeft className="w-4 h-4" />
                <span>{isEn ? previousStep.labelEn : previousStep.labelId}</span>
              </a>
            )}
            {nextStep && (
              <a href={nextStep.href} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl nm-btn-accent text-white text-xs font-black shadow-md">
                <span>{`${isEn ? "Next:" : "Lanjut:"} ${isEn ? nextStep.labelEn : nextStep.labelId}`}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

type PublicJourneyView = "landing" | "challenges" | "system" | "simulator" | "plans" | "contact";

interface JourneyStepNavProps {
  view: PublicJourneyView;
  lang: "id" | "en";
}

const journeySteps = [
  {
    view: "landing",
    href: "#",
    labelId: "Home",
    labelEn: "Home",
    titleId: "Mulai transformasi operasional Anda",
    titleEn: "Start transforming your operations",
  },
  {
    view: "challenges",
    href: "#challenges",
    labelId: "Tantangan",
    labelEn: "Challenges",
    titleId: "Petakan hambatan yang menahan pertumbuhan",
    titleEn: "Map the bottlenecks holding growth back",
  },
  {
    view: "system",
    href: "#system",
    labelId: "Sistem & Modul",
    labelEn: "System & Modules",
    titleId: "Bangun operating system yang saling terhubung",
    titleEn: "Build a connected operating system",
  },
  {
    view: "simulator",
    href: "#simulator",
    labelId: "Simulator & ROI",
    labelEn: "Simulator & ROI",
    titleId: "Ukur dampak dan potensi ROI",
    titleEn: "Measure impact and ROI potential",
  },
  {
    view: "plans",
    href: "#plans",
    labelId: "Paket & FAQ",
    labelEn: "Plans & FAQ",
    titleId: "Pilih jalur implementasi yang tepat",
    titleEn: "Choose the right implementation path",
  },
  {
    view: "contact",
    href: "#contact",
    labelId: "Kontak/Form",
    labelEn: "Contact/Form",
    titleId: "Mulai audit dan rencana transformasi",
    titleEn: "Start your audit and transformation plan",
  },
] as const;

export default function JourneyStepNav({ view, lang }: JourneyStepNavProps) {
  const isEn = lang === "en";
  const activeIndex = journeySteps.findIndex((step) => step.view === view);
  const currentStep = journeySteps[activeIndex] ?? journeySteps[0];
  const previousStep = activeIndex > 0 ? journeySteps[activeIndex - 1] : undefined;
  const nextStep = activeIndex < journeySteps.length - 1 ? journeySteps[activeIndex + 1] : undefined;

  return (
    <section className="relative bg-[#eef2f6] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6" id="journey-step-navigation">
      <div className="max-w-7xl mx-auto nm-emboss bg-white/55 rounded-3xl p-5 sm:p-6 border-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 text-left">
            <div className="flex flex-wrap items-center gap-2">
              {journeySteps.map((step, index) => {
                const isCompleted = index < activeIndex;
                const isActive = index === activeIndex;

                return (
                  <a
                    key={step.view}
                    href={step.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black transition-all ${
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
              <p className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-brand-orange">
                Your Transformation Journey
              </p>
              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-1">
                {isEn ? currentStep.titleEn : currentStep.titleId}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 max-w-2xl leading-relaxed">
                {isEn
                  ? "Follow the transformation journey from operational friction to connected systems, measurable ROI, implementation options, and an audit-ready action plan."
                  : "Ikuti journey transformasi dari friksi operasional menuju sistem terhubung, ROI terukur, pilihan implementasi, dan rencana audit yang siap dijalankan."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-shrink-0">
            {previousStep && (
              <a
                href={previousStep.href}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl nm-btn text-slate-700 text-xs font-black"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isEn ? previousStep.labelEn : previousStep.labelId}</span>
              </a>
            )}

            {nextStep ? (
              <a
                href={nextStep.href}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl nm-btn-accent text-white text-xs font-black shadow-md"
              >
                <span>
                  {isEn ? "Next:" : "Lanjut:"} {isEn ? nextStep.labelEn : nextStep.labelId}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
            ) : (
              <a
                href="#lead-form-area"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl nm-btn-accent text-white text-xs font-black shadow-md"
              >
                <span>{isEn ? "Share your needs" : "Ceritakan kebutuhan Anda"}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

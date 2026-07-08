import React, { useState } from "react";
import { connectedFlowSteps } from "../data";
import { ArrowRight, Database, ExternalLink, Play, Sparkles, RefreshCw, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ConnectedFlowVisualizer({ lang = 'id' }: { lang?: 'id' | 'en' }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const isEn = lang === 'en';
  const activeStep = connectedFlowSteps[activeStepIndex];

  return (
    <section
      className="py-20 md:py-28 bg-navy-dark relative"
      id="flow"
    >
      <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-slate-300/60 text-left">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-teal uppercase">
              {isEn ? "Integrated Flow: Lead to Billing (Ledger)" : "Alur Terintegrasi: Lead ke Billing (Ledger)"}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              {isEn ? (
                <>Single Input, <span className="text-brand-teal font-extrabold">Flows to the Entire System</span></>
              ) : (
                <>Satu Input, <span className="text-brand-teal font-extrabold">Mengalir ke Seluruh Sistem</span></>
              )}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-slate-300 lg:pl-8">
            <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed font-sans">
              {isEn ? (
                "CargoGrid is designed so you only input data once at the start (Lead/RFQ). That information automatically flows to operations, warehousing, customer tracking, and finance for invoicing and ledger posting."
              ) : (
                "CargoGrid dirancang agar Anda cukup memasukkan data sekali di awal (Lead/RFQ). Informasi tersebut otomatis mengalir ke tim operasional, pergudangan, pelacakan customer, hingga divisi keuangan untuk invoice dan pembukuan (ledger)."
              )}
            </p>
          </div>
        </div>

        {/* Stepper Grid Navigation with Mobile-Friendly Snap Horizontal Scroll */}
        <div className="relative mb-10 group/stepper">
          <div 
            className="flex overflow-x-auto lg:grid lg:grid-cols-8 gap-3 lg:gap-5 pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory" 
            id="flow-stepper-navigation"
          >
            {connectedFlowSteps.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <div 
                  key={step.id} 
                  className="relative flex-shrink-0 w-[135px] sm:w-[150px] lg:w-auto snap-align-center flex items-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`w-full flex flex-col items-center justify-center p-4 rounded-2xl text-center transition-all duration-200 group cursor-pointer border-0 min-h-[105px] lg:min-h-0 ${
                      isSelected
                        ? "nm-btn-accent bg-gradient-to-br from-brand-teal via-brand-teal to-emerald-500 text-white font-extrabold shadow-md"
                        : "nm-btn bg-white/40 text-slate-600 font-semibold"
                    }`}
                  >
                    {/* Step Number Badge */}
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-black mb-2 transition-colors duration-150 ${
                        isSelected
                          ? "bg-white text-brand-teal"
                          : "nm-deboss-sm bg-[#eef2f6] text-slate-500"
                      }`}
                    >
                      {step.number}
                    </span>
                    
                    {/* Step Title - Dynamic word wrap, no truncation */}
                    <span
                      className={`font-display text-[11px] sm:text-xs font-bold tracking-tight leading-tight break-words max-w-full px-0.5 ${
                        isSelected ? "text-white font-extrabold" : "text-slate-700"
                      }`}
                    >
                      {isEn ? (step.titleEn || step.title) : step.title}
                    </span>
                  </motion.button>
                  
                  {/* Arrow Connector for Desktop Grid - Placed outside the motion button so it remains perfectly aligned and stationary */}
                  {idx < 7 && (
                    <div className="hidden lg:flex absolute left-full ml-[2px] top-1/2 -translate-y-1/2 z-20 text-slate-400 pointer-events-none items-center justify-center">
                      <ArrowRight className="w-4 h-4 opacity-70" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Subtle horizontal scroll fading hint on mobile */}
          <div className="absolute right-0 top-0 h-[calc(100%-16px)] w-8 bg-gradient-to-l from-[#eaf0f6] to-transparent pointer-events-none lg:hidden" />
        </div>

        {/* Selected Step Detail Panel (Asymmetrical & Layered Dashboard Model) */}
        <div className="nm-emboss bg-white/30 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
          
          {/* Huge Translucent Watermark on Background */}
          <div className="absolute right-8 bottom-6 font-display font-black text-[12rem] text-slate-400/4 select-none pointer-events-none tracking-tighter leading-none hidden md:block z-0">
            0{activeStep.number}
          </div>

          {/* Left Description Column (Asymmetrical offsets) */}
          <div className="p-6 sm:p-8 lg:p-12 lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 relative z-10 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIndex}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] font-black px-3 py-1.5 rounded-full bg-white/70 text-brand-teal nm-emboss-sm border-0 uppercase tracking-widest">
                    {isEn ? `STAGE #0${activeStep.number}` : `TAHAPAN #0${activeStep.number}`}
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  {isEn ? (activeStep.titleEn || activeStep.title) : activeStep.title}
                </h3>

                <p className="text-slate-600 text-sm font-semibold leading-relaxed">
                  {isEn ? (activeStep.longDescEn || activeStep.longDesc) : activeStep.longDesc}
                </p>

                {/* Benefit Highlight (Slightly offset asymmetrically) */}
                <div className="nm-deboss bg-emerald-500/[0.03] p-4.5 rounded-2xl mt-4 flex items-start gap-3 border-0">
                  <div className="p-1 rounded-lg nm-emboss-sm text-emerald-600 mt-0.5 flex-shrink-0 bg-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 tracking-wide uppercase">
                      {isEn ? "Advantage:" : "Dampak Bisnis:"}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-semibold mt-1 leading-relaxed">
                      {isEn ? (activeStep.benefitEn || activeStep.benefit) : activeStep.benefit}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-bold">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{isEn ? "Unified Data Stream" : "Alur Data Tersinkronisasi"}</span>
              <span className="text-slate-400 font-bold text-[10px] font-mono">CargoGrid OS v2</span>
            </div>
          </div>

          {/* Right Pipeline Simulation Column (Staggered Layout) */}
          <div className="p-6 sm:p-8 lg:p-12 lg:col-span-7 bg-white/10 flex flex-col gap-6 relative z-10 text-left">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block font-black">
              {isEn ? "Automated Division Sync (Zero Redundant Data-Entry)" : "Sistem Sinkronisasi Lintas Divisi (Satu Kali Input)"}
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                
                {/* Box 1: Inputs (Slightly elevated on hover) */}
                <div className="nm-emboss bg-[#f8fafc]/60 rounded-3xl p-5 relative border-0 hover:scale-[1.015] transition-transform duration-200">
                  <div className="absolute top-4 right-4 text-slate-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="font-mono text-[10px] font-black text-brand-teal uppercase tracking-widest mb-3">
                    {isEn ? "Single Input (Upstream Source):" : "Input Tunggal (Hulu Utama):"}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {(isEn ? (activeStep.inputsEn || activeStep.inputs) : activeStep.inputs).map((inp, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700 font-semibold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                        <span>{inp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Box 2: Outputs (Slightly staggered downwards on hover) */}
                <div className="nm-emboss bg-[#fbf9f6]/60 rounded-3xl p-5 relative border-0 hover:scale-[1.015] transition-transform duration-200">
                  <div className="absolute top-4 right-4 text-slate-400">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <h4 className="font-mono text-[10px] font-black text-brand-orange uppercase tracking-widest mb-3">
                    {isEn ? "Auto-synced Outflow Downstream:" : "Sinkronisasi Hilir Otomatis:"}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {(isEn ? (activeStep.outputsEn || activeStep.outputs) : activeStep.outputs).map((out, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700 font-semibold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Visual Pipeline Arrow Flow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="nm-deboss bg-white/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl nm-emboss-sm bg-[#eef2f6] text-brand-teal flex-shrink-0 flex items-center justify-center font-mono font-black text-sm">
                    {activeStep.number}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800">{isEn ? "Current Transaction Status:" : "Status Transaksi Saat Ini:"}</p>
                    <p className="text-[11px] text-slate-500 font-semibold font-mono mt-0.5">
                      {isEn ? (activeStep.titleEn || activeStep.title) : activeStep.title} &rarr; {isEn ? "Successfully Triggered" : "Berhasil Diaktifkan"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{isEn ? "Next Stage:" : "Divisi Berikutnya:"}</span>
                  <span className="text-xs font-black text-brand-teal font-mono nm-emboss-sm bg-white/60 px-3 py-1.5 rounded-xl">
                    {activeStepIndex === 7 ? "Cycle Complete!" : (isEn ? (connectedFlowSteps[activeStepIndex + 1].titleEn || connectedFlowSteps[activeStepIndex + 1].title) : connectedFlowSteps[activeStepIndex + 1].title)}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Next Step Interaction Call */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-slate-400 font-bold font-mono">
                {isEn ? "Click step cards above to explore other stages of the workflow." : "Klik nomor menu di atas untuk menelusuri modul selanjutnya."}
              </p>
              {activeStepIndex < 7 && (
                <button
                  onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold nm-btn bg-white text-slate-700 hover:text-brand-teal cursor-pointer border-0 group"
                >
                  <span>{isEn ? "Next Stage" : "Langkah Berikutnya"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

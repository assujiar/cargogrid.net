import React, { useState } from "react";
import { icpList } from "../data";
import { ArrowRight, XCircle, ShieldCheck, Quote, Building2, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function IcpSelector({ lang = 'id' }: { lang?: 'id' | 'en' }) {
  const [activeIcpId, setActiveIcpId] = useState<string>("forwarder");
  const isEn = lang === 'en';
  const activeIcp = icpList.find((icp) => icp.id === activeIcpId) || icpList[0];

  return (
    <section
      className="py-20 md:py-28 bg-navy-dark relative"
      id="use-cases"
    >
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-slate-300/60 text-left">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-orange uppercase">
              {isEn ? "Target Business Sectors" : "Target Sektor Bisnis"}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              {isEn ? (
                <>Specific Solutions for <span className="text-brand-orange font-extrabold">Your Business Sector</span></>
              ) : (
                <>Solusi Spesifik untuk <span className="text-brand-orange font-extrabold">Sektor Bisnis Anda</span></>
              )}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-slate-300 lg:pl-8">
            <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed font-sans">
              {isEn ? (
                "Every logistics niche has its own unique bottlenecks. Select your business segment below to see how CargoGrid specifically resolves your daily operational leakages."
              ) : (
                "Setiap industri logistik memiliki tantangan tersendiri. Pilih segmen bisnis Anda di bawah ini untuk melihat bagaimana CargoGrid menyelesaikan masalah harian Anda secara khusus."
              )}
            </p>
          </div>
        </div>

        {/* Vertical/Horizontal Sector Toggle Tabs - Perfectly Aligned and Aesthetic */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12" id="icp-sector-tabs">
          {icpList.map((icp, idx) => {
            const isSelected = activeIcpId === icp.id;
            return (
              <motion.button
                key={icp.id}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveIcpId(icp.id)}
                className={`flex flex-col items-start p-5 rounded-2xl border-0 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "nm-btn-accent bg-gradient-to-br from-brand-orange via-brand-orange to-amber-500 text-white shadow-md font-extrabold"
                    : "nm-btn bg-white/40 text-slate-600 hover:text-slate-800"
                }`}
              >
                <span className={`font-mono text-[9px] tracking-widest uppercase font-black mb-1.5 ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                  {isEn ? (icp.badgeEn || icp.badge) : icp.badge}
                </span>
                <span className={`font-display text-base font-extrabold flex items-center gap-1.5 ${isSelected ? "text-white" : "text-slate-800"}`}>
                  <Building2 className={`w-4 h-4 ${isSelected ? "text-white" : "text-brand-orange"}`} />
                  <span>{isEn ? (icp.titleEn || icp.title) : icp.title}</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Selected ICP Content Breakdown Grid (Asymmetrical layouts) */}
        <div className="nm-emboss bg-white/30 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border-0 mt-8" id="icp-content-breakdown">
          
          {/* Left Column: Pains & Pitch (Slightly larger area, asymmetric) */}
          <div className="p-6 sm:p-8 lg:p-12 lg:col-span-7 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col gap-6 text-left relative z-10 animate-fade-in">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIcpId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                {/* Header Description */}
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-400 font-black tracking-widest mb-2 uppercase">
                    <span>{isEn ? "INDUSTRY FOCUS:" : "FOKUS INDUSTRI:"}</span>
                    <span className="font-black text-brand-orange">{isEn ? (activeIcp.titleEn || activeIcp.title) : activeIcp.title} &bull; {isEn ? (activeIcp.badgeEn || activeIcp.badge) : activeIcp.badge}</span>
                  </div>
                  <p className="text-slate-600 text-sm font-semibold leading-relaxed">
                    {isEn ? (activeIcp.descEn || activeIcp.desc) : activeIcp.desc}
                  </p>
                </div>

                {/* Pain Points Section */}
                <div className="space-y-3.5">
                  <h4 className="font-display text-xs font-black tracking-widest text-rose-600 uppercase flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>{isEn ? "Critical Industry Pain Points:" : "Masalah Utama di Lapangan (Pain Points):"}</span>
                  </h4>
                  <ul className="space-y-3 text-xs">
                    {(isEn ? (activeIcp.painsEn || activeIcp.pains) : activeIcp.pains).map((pain, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 nm-emboss-sm bg-white/50 p-3.5 rounded-2xl border-l-4 border-rose-500 text-slate-700 font-semibold leading-relaxed hover:translate-x-1 transition-transform">
                        <XCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pitch Section (Offset visual block) */}
                <div className="nm-deboss bg-brand-orange/[0.02] p-5 rounded-2xl mt-2 flex items-start gap-3 border-0">
                  <div className="p-1.5 rounded-xl bg-white text-brand-orange mt-0.5 flex-shrink-0 nm-emboss-sm">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest">{isEn ? "CargoGrid Unified Solution:" : "Solusi CargoGrid Connected:"}</h4>
                    <p className="text-xs text-slate-600 font-semibold mt-1 leading-relaxed">{isEn ? (activeIcp.pitchEn || activeIcp.pitch) : activeIcp.pitch}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Right Column: Buyer Persona Card (Asymmetrical layout, card visual contrast) */}
          <div className="p-6 sm:p-8 lg:p-12 lg:col-span-5 bg-gradient-to-br from-slate-100/40 via-slate-50/10 to-transparent flex flex-col justify-between text-left relative z-10">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIcpId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5"
              >
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block font-black">
                  {isEn ? "TARGET BUYER PERSONA" : "TARGET BUYER PERSONA"}
                </span>

                {/* Persona Profile Header */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full nm-emboss-sm bg-white text-brand-orange font-black border-2 border-brand-orange/40 flex items-center justify-center font-display font-extrabold text-lg">
                    {activeIcp.personaName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-display font-black text-base text-slate-900">{activeIcp.personaName}</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{isEn ? (activeIcp.personaRoleEn || activeIcp.personaRole) : activeIcp.personaRole}</p>
                  </div>
                </div>

                {/* Key KPI/Focus indicator */}
                <div className="nm-deboss bg-white/70 p-3.5 rounded-2xl text-xs font-mono border-0">
                  <span className="text-slate-400 block text-[9px] uppercase tracking-widest font-black">KPI / {isEn ? "PRIMARY FOCUS" : "FOKUS UTAMA"}:</span>
                  <span className="text-brand-orange font-black mt-1.5 block">{isEn ? (activeIcp.personaFocusEn || activeIcp.personaFocus) : activeIcp.personaFocus}</span>
                </div>

                {/* Quote Block Quote Style without italic */}
                <div className="relative mt-2">
                  <Quote className="absolute -top-3 -left-2 w-8 h-8 text-slate-200 -z-10" />
                  <p className="text-slate-600 text-xs font-semibold leading-relaxed pl-5 relative z-10">
                    &quot;{isEn ? (activeIcp.personaQuoteEn || activeIcp.personaQuote) : activeIcp.personaQuote}&quot;
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Quick Action Button */}
            <div className="pt-6 border-t border-slate-200 mt-8 flex justify-between items-center">
              <span className="text-[9px] font-mono text-slate-400 font-black uppercase tracking-widest">{isEn ? "Segment Demo Available" : "Demo khusus tersedia"}</span>
              <a
                href="#audit-form"
                className="inline-flex items-center gap-1.5 text-xs font-black text-brand-orange hover:text-brand-orange/80 transition-all group cursor-pointer"
              >
                <span>{isEn ? `Learn ${activeIcp.titleEn || activeIcp.title} Suite` : `Pelajari Paket ${activeIcp.title}`}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

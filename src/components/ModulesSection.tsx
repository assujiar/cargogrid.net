import React, { useState } from "react";
import { productModules } from "../data";
import { Layers, Briefcase, Truck, Home, Users, CircleDollarSign, ShieldCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ModulesSection({ lang = 'id' }: { lang?: 'id' | 'en' }) {
  const [selectedLayer, setSelectedLayer] = useState<string>("All");
  const isEn = lang === 'en';

  const layers = [
    { id: "All", labelId: "Semua Modul", labelEn: "All Modules" },
    { id: "Commercial Layer", labelId: "Fase Komersial", labelEn: "Commercial Layer" },
    { id: "Operations Layer", labelId: "Fase Operasional", labelEn: "Operations Layer" },
    { id: "Warehouse Layer", labelId: "Fase Pergudangan", labelEn: "Warehouse Layer" },
    { id: "Customer Experience Layer", labelId: "Fase Portal Customer", labelEn: "Customer Experience Layer" },
    { id: "Finance & Accounting Layer", labelId: "Fase Keuangan & Akuntansi", labelEn: "Finance & Accounting Layer" },
    { id: "Platform Layer", labelId: "Konfigurasi Sistem", labelEn: "Platform Layer" },
  ];

  const filteredModules = selectedLayer === "All"
    ? productModules
    : productModules.filter(mod => mod.layerEn === selectedLayer || mod.layer === selectedLayer);

  // Reorder productModules to fit a 3-column grid perfectly without gaps when "All" is active
  const displayModules = selectedLayer === "All"
    ? [
        productModules.find(m => m.id === "crm"),
        productModules.find(m => m.id === "procurement"),
        productModules.find(m => m.id === "wms"),
        productModules.find(m => m.id === "operations"),
        productModules.find(m => m.id === "platform"),
        productModules.find(m => m.id === "finance"),
        productModules.find(m => m.id === "portal"),
      ].filter(Boolean) as typeof productModules
    : filteredModules;

  // Helper to map layer name to matching icons
  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case "Commercial Layer":
      case "Fase Komersial":
        return <Briefcase className="w-4 h-4" />;
      case "Operations Layer":
      case "Fase Operasional":
        return <Truck className="w-4 h-4" />;
      case "Warehouse Layer":
      case "Fase Pergudangan":
        return <Home className="w-4 h-4" />;
      case "Customer Experience Layer":
      case "Fase Portal Customer":
        return <Users className="w-4 h-4" />;
      case "Finance & Accounting Layer":
      case "Fase Keuangan & Akuntansi":
        return <CircleDollarSign className="w-4 h-4" />;
      case "Platform Layer":
      case "Konfigurasi Sistem":
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <section
      className="py-20 md:py-28 bg-[#eef2f6] relative"
      id="modules"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-slate-300/60 text-left">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-teal uppercase">
              {isEn ? "Operational Grid Layers" : "Layer Operasional"}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              {isEn ? (
                <>7 CargoGrid System Modules <span className="text-brand-teal font-extrabold font-display">Ready to Use</span></>
              ) : (
                <>7 Modul Sistem CargoGrid <span className="text-brand-teal font-extrabold font-display">Siap Pakai</span></>
              )}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-slate-300 lg:pl-8">
            <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed font-sans">
              {isEn ? (
                "Each module works synchronously within a single database. You are free to choose and activate modules that best fit your daily logistics company operations."
              ) : (
                "Setiap modul bekerja sinkron di dalam satu database tunggal. Anda bebas memilih dan mengaktifkan modul yang sesuai dengan kebutuhan operasional perusahaan logistik Anda."
              )}
            </p>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 pb-6 mb-10 border-b border-slate-200/80 overflow-x-auto scrollbar-none" id="modules-filter-bar">
          {layers.map((layer) => {
            const isSelected = selectedLayer === layer.id;
            const label = isEn ? layer.labelEn : layer.labelId;
            return (
              <motion.button
                key={layer.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLayer(layer.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold border-0 transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "nm-btn-accent bg-gradient-to-r from-brand-teal to-emerald-500 text-white shadow-sm"
                    : "nm-btn bg-white/40 text-slate-600 hover:text-slate-800"
                }`}
              >
                {getLayerIcon(layer.id)}
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Modules Responsive Grid - Asymmetrical Bento Grid Model */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          id="modules-grid-list"
        >
          <AnimatePresence mode="popLayout">
            {displayModules.map((mod) => {
              const isProminent = mod.id === "operations" || mod.id === "portal";
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.015, y: -4 }}
                  key={mod.id}
                  className={`relative nm-emboss rounded-3xl p-7 shadow-md transition-all duration-200 flex flex-col justify-between group border-0 text-left ${
                    isProminent
                      ? "lg:col-span-2 bg-white/60 ring-1 ring-brand-teal/20"
                      : "bg-white/30"
                  }`}
                >
                  <div className="flex flex-col gap-1.5 w-full">
                    {/* Module Layer Tag */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-brand-teal text-xs">{getLayerIcon(mod.layerEn)}</span>
                      <span className="font-mono text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {isEn ? (mod.layerEn || mod.layer) : mod.layer}
                      </span>
                    </div>

                    {/* Module Title */}
                    <h3 className="font-display font-black text-xl text-slate-900 mb-2">
                      {isEn ? (mod.titleEn || mod.title) : mod.title}
                    </h3>

                    {/* Module Description & Optional Bento Content */}
                    <div className={isProminent ? "grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full" : "w-full"}>
                      <div className={isProminent ? "md:col-span-7" : "w-full"}>
                        <p className="text-slate-600 text-xs font-semibold leading-relaxed mb-6">
                          {isEn ? (mod.descEn || mod.desc) : mod.desc}
                        </p>
                      </div>

                      {/* Prominent Card Extra Visual Element (Senior Dev Craftsmanship) */}
                      {isProminent && (
                        <div className="md:col-span-5 nm-deboss bg-slate-100/50 p-4 rounded-2xl flex flex-col gap-2 font-mono text-[10px] text-slate-500 mb-4 md:mb-0">
                          {mod.id === "operations" ? (
                            <>
                              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                                <span className="font-bold text-slate-700">{isEn ? "Digital Dispatch List" : "Manifes Keberangkatan"}</span>
                                <span className="text-emerald-600 font-extrabold uppercase text-[8px]">{isEn ? "AUTO-ASSIGN" : "OTOMATIS"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <span className="w-2 h-2 rounded-full bg-brand-teal" />
                                <span>Truck 10-Tonne CDD &bull; JKT-SBY</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <span className="w-2 h-2 rounded-full bg-brand-orange" />
                                <span>Driver Assigned: Joko Susilo</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                                <span className="font-bold text-slate-700">{isEn ? "Customer Brand Setup" : "Branding Kustom"}</span>
                                <span className="text-brand-teal font-extrabold uppercase text-[8px]">ACTIVE</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Logo File:</span>
                                <span className="text-slate-800 font-extrabold">logo_perusahaan.png</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tracking CNAME:</span>
                                <span className="text-slate-800 font-extrabold">track.mycompany.com</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags / Sub-Features Pill List */}
                  <div className="border-t border-slate-200/80 pt-5 mt-4 w-full">
                    <div className="flex flex-wrap gap-2">
                      {(isEn ? (mod.tagsEn || mod.tags) : mod.tags).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black tracking-wider text-slate-700 nm-emboss-sm bg-[#eef2f6]/60 px-2.5 py-1.5 rounded-lg border-0"
                        >
                          <CheckCircle className="w-3 h-3 text-brand-teal" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

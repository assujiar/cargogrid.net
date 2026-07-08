import React, { useState } from "react";
import { problemPoints } from "../data";
import { AlertCircle, AlertTriangle, FileSpreadsheet, Send, Search, CheckCircle, Smartphone, ArrowRight, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ProblemSection({ lang = 'id' }: { lang?: 'id' | 'en' }) {
  const [activeCompareTab, setActiveCompareTab] = useState<"rfq" | "pod" | "customer">("rfq");
  const isEn = lang === 'en';

  return (
    <section
      className="py-20 md:py-28 bg-navy-dark relative"
      id="problem"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-slate-300/60 text-left">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-orange uppercase">
              {isEn ? "Operational Efficiency Evaluation" : "Evaluasi Efisiensi Operasional"}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              {isEn ? (
                <>Logistics operations look busy, but <span className="text-brand-orange font-extrabold">are they efficient?</span></>
              ) : (
                <>Operasional logistik terlihat sibuk, tapi <span className="text-brand-orange font-extrabold">apakah efisien?</span></>
              )}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-slate-300 lg:pl-8">
            <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed font-sans">
              {isEn ? (
                "Relying on Excel, WhatsApp, and stacks of paper delays coordination among Sales, Warehouse, Ops, and Finance. Here are the real leaks draining your daily profit margins."
              ) : (
                "Mengandalkan Excel, WhatsApp, dan tumpukan kertas membuat koordinasi divisi Sales, Gudang, Ops, dan Finance terhambat. Berikut adalah kebocoran nyata yang memakan profit margin Anda harian."
              )}
            </p>
          </div>
        </div>

        {/* Problem Cards Grid - Perfectly Aligned, Elegant Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 items-stretch" id="problem-cards-grid">
          {problemPoints.map((point, idx) => {
            // Set uniform background styling with high-quality alignment
            const cardStyle = idx === 0
              ? "border-t-2 border-brand-orange bg-white/70 shadow-md"
              : "border-t-2 border-slate-300 bg-white/40";
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -6 }}
                className={`relative nm-emboss rounded-3xl p-6.5 transition-all duration-200 group text-left ${cardStyle}`}
              >
                {/* Metric Accent Bubble */}
                <div className="flex justify-between items-start mb-5">
                  <span className="font-mono text-[9px] font-black tracking-widest text-slate-400 uppercase">{isEn ? `CASE #0${idx + 1}` : `KASUS #0${idx + 1}`}</span>
                  <span className="font-mono text-[10px] font-black text-brand-orange nm-deboss-sm px-3 py-1.5 rounded-xl bg-white/50">
                    {point.metric}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-brand-orange flex-shrink-0" />
                  <span>{isEn ? (point.titleEn || point.title) : point.title}</span>
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-xs font-semibold leading-relaxed mb-5 min-h-[50px]">
                  {isEn ? (point.descEn || point.desc) : point.desc}
                </p>

                {/* Impact Tag */}
                <div className="pt-3 border-t border-slate-200/60 flex items-center gap-1.5 font-mono text-[9px] text-slate-400 font-black uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  <span>Impact: {isEn ? (point.metricLabelEn || point.metricLabel) : point.metricLabel}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Campaign Banner: Stop Chasing POD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="nm-emboss bg-gradient-to-r from-rose-50/[0.04] to-[#eef2f6] rounded-3xl p-6 md:p-8 mb-20 flex flex-col lg:flex-row items-center gap-8 shadow-md"
        >
          <div className="flex-1 flex flex-col gap-3">
            <span className="inline-flex self-start nm-emboss-sm text-brand-orange font-mono text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase">
              {isEn ? "Document Obstacle Solution" : "Solusi Hambatan Dokumen"}
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
              {isEn ? "Speed Up Billing: Instant Proof of Delivery (e-POD)" : "Percepat Penagihan: Bukti Tanda Terima (POD) Instan"}
            </h3>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">
              {isEn ? (
                <>Did you know? Late physical POD submission by drivers = delayed invoicing = <span className="text-brand-orange font-extrabold">AR tied up for weeks</span>. CargoGrid treats POD as an automatic cashflow trigger. e-POD is logged the second cargo is received on-site.</>
              ) : (
                <>Tahukah Anda? POD fisik terlambat diserahkan supir = pembuatan invoice tertunda = <span className="text-brand-orange font-extrabold">AR tertahan berminggu-minggu</span>. CargoGrid memperlakukan POD sebagai pemicu cashflow otomatis. e-POD langsung tercatat begitu barang diterima di lokasi.</>
              )}
            </p>
          </div>
          <div className="nm-deboss bg-[#f5f8fc]/40 rounded-2xl p-5 w-full lg:max-w-xs flex flex-col gap-2 font-mono text-xs">
            <div className="text-slate-600 font-bold flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <AlertTriangle className="w-4 h-4 text-brand-orange" />
              <span>{isEn ? "POD Delay Domino Effect:" : "Efek Domino POD Telat:"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-semibold">{isEn ? "Slow POD" : "POD Lambat"}</span>
              <span className="text-brand-orange font-black">{isEn ? "+14 Days" : "+14 Hari"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-semibold">{isEn ? "Invoice Delay" : "Invoice Delay"}</span>
              <span className="text-brand-orange font-black">{isEn ? "+10 Days" : "+10 Hari"}</span>
            </div>
            <div className="flex justify-between py-1 border-t border-slate-200 pt-2 font-black text-slate-900">
              <span>{isEn ? "Frozen Funds (DSO)" : "Dana Macet (DSO)"}</span>
              <span className="text-red-600 font-black">{isEn ? "24+ Days" : "24+ Hari"}</span>
            </div>
          </div>
        </motion.div>

        {/* Interactive Comparison Widget */}
        <div className="nm-emboss bg-white/40 rounded-3xl overflow-hidden" id="interactive-comparison">
          
          {/* Header & Tabs */}
          <div className="border-b border-slate-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f0f4f8]/40">
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                {isEn ? "Compare Operational Workflows" : "Bandingkan Proses Kerja Operasional"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {isEn ? "See the real differences in CargoGrid data flow efficiency." : "Lihat perbedaan nyata efisiensi alur data CargoGrid."}
              </p>
            </div>
            
            {/* Quick Toggle Tabs */}
            <div className="flex nm-deboss p-1 rounded-2xl bg-white/40">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCompareTab("rfq")}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  activeCompareTab === "rfq"
                    ? "bg-brand-orange text-white shadow-sm font-extrabold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Inquiry & RFQ
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCompareTab("pod")}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  activeCompareTab === "pod"
                    ? "bg-brand-orange text-white shadow-sm font-extrabold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {isEn ? "POD & Receipts" : "POD & Tanda Terima"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCompareTab("customer")}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  activeCompareTab === "customer"
                    ? "bg-brand-orange text-white shadow-sm font-extrabold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {isEn ? "CS Status Updates" : "Update Status CS"}
              </motion.button>
            </div>
          </div>

          {/* Comparison Content Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white/20">
            
            {/* The Old Siloed Way */}
            <div className="p-6 md:p-8 bg-rose-50/[0.12] flex flex-col gap-5">
              <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-rose-600 uppercase">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>{isEn ? "Traditional Way (Excel + WhatsApp Chaos)" : "Cara Lama (Excel + WhatsApp Chaos)"}</span>
              </div>

              {activeCompareTab === "rfq" && (
                <div className="flex flex-col gap-4 text-xs text-slate-700">
                  <div className="flex gap-3 nm-emboss-sm bg-white/50 p-3.5 rounded-2xl border-l-4 border-rose-500">
                    <Send className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Sales receives RFQ via WhatsApp" : "Sales terima RFQ di chat WA"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Must be manually typed into personal Excel files. Often forgotten without follow-up." : "Harus dicatat manual ke Excel personal. Seringkali lupa di-follow up."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 nm-emboss-sm bg-white/50 p-3.5 rounded-2xl border-l-4 border-rose-500">
                    <Search className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Searching for old vendor rates" : "Mencari Rate Vendor lama"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Opening hundreds of old Excel files, calling vendors one-by-one to get updated prices." : "Buka ratusan sheet Excel lama, nelpon vendor satu per satu untuk update harga."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 nm-emboss-sm bg-white/50 p-3.5 rounded-2xl border-l-4 border-rose-500">
                    <FileSpreadsheet className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Retyping data into Job Orders" : "Ulang mengetik data ke Job Order"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Operations team retypes customer, route, and cargo data from sales emails or Excel files." : "Divisi Ops mengetik ulang data customer, rute, dan cargo dari Excel penawaran harga sales."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeCompareTab === "pod" && (
                <div className="flex flex-col gap-4 text-xs text-slate-700">
                  <div className="flex gap-3 nm-emboss-sm bg-white/50 p-3.5 rounded-2xl border-l-4 border-rose-500">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Driver keeps physical receipt papers in cabin" : "Sopir mengantongi kertas tanda terima"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Drivers travel for days. Receipts get crumpled, torn, or lost on the road." : "Supir berangkat berhari-hari. Kertas lecek, sobek, atau hilang dijalan."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 nm-emboss-sm bg-white/50 p-3.5 rounded-2xl border-l-4 border-rose-500">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Operations waits for physical POD delivery" : "Ops menunggu kertas POD kembali"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Finance team delays billing because they cannot issue invoices without physical PODs in hand." : "Finance tidak berani membuat invoice tanpa lampiran POD fisik di kantor."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeCompareTab === "customer" && (
                <div className="flex flex-col gap-4 text-xs text-slate-700">
                  <div className="flex gap-3 nm-emboss-sm bg-white/50 p-3.5 rounded-2xl border-l-4 border-rose-500">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "CS is bombarded with customer calls every hour" : "CS dihubungi customer setiap jam"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "\"Where is my container?\" CS is forced to call drivers while they are on the road." : "\"Container saya sudah di mana?\" CS terpaksa menelpon supir yang sedang mengemudi."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 nm-emboss-sm bg-white/50 p-3.5 rounded-2xl border-l-4 border-rose-500">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Driver replies on WhatsApp" : "Supir membalas di WhatsApp"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Inaccurate updates. Drivers might misrepresent progress to avoid delay penalties." : "Update tidak akurat, supir seringkali berbohong demi menghindari sanksi ketelatan."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-slate-200 flex items-center gap-2 font-mono text-[10px] text-rose-600 font-extrabold uppercase">
                <span>{isEn ? "Average Response: 12 - 24 hours" : "Rata-rata Respon: 12 - 24 jam"}</span>
              </div>
            </div>

            {/* The Connected CargoGrid Way */}
            <div className="p-6 md:p-8 bg-emerald-50/[0.04] flex flex-col gap-5">
              <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-brand-teal uppercase">
                <CheckCircle className="w-4 h-4 text-brand-teal" />
                <span>{isEn ? "CargoGrid Integrated System" : "Sistem Terintegrasi CargoGrid"}</span>
              </div>

              {activeCompareTab === "rfq" && (
                <div className="flex flex-col gap-4 text-xs text-slate-700">
                  <div className="flex gap-3 nm-emboss-sm bg-white/60 p-3.5 rounded-2xl border-l-4 border-brand-teal">
                    <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Automated centralized inquiries" : "Inquiry tersentralisasi otomatis"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Portal RFQs instantly land on the sales dashboard with active SLA alarms." : "RFQ dari portal langsung masuk dashboard sales dengan alarm SLA aktif."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 nm-emboss-sm bg-white/60 p-3.5 rounded-2xl border-l-4 border-brand-teal">
                    <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "One-click vendor rate comparison" : "Satu klik bandingkan Rate Vendor"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "System automatically pulls the cheapest contract rates & calculates safe profit margins." : "Sistem mencari otomatis rate kontrak vendor termurah & menghitung margin aman harian."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 nm-emboss-sm bg-white/60 p-3.5 rounded-2xl border-l-4 border-brand-teal">
                    <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Auto-convert Quote to Job Order" : "Auto-Convert Quote ke Job Order"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Client approves the quote online; routing and cargo data flow directly to Job Orders." : "Customer menyetujui quote online, data rute dan cargo otomatis mengalir ke Job Order Ops."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeCompareTab === "pod" && (
                <div className="flex flex-col gap-4 text-xs text-slate-700">
                  <div className="flex gap-3 nm-emboss-sm bg-white/60 p-3.5 rounded-2xl border-l-4 border-brand-teal">
                    <Smartphone className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "PWA Driver Portal & ePOD upload" : "Driver Portal PWA & Upload ePOD"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Drivers photograph receipts on their phones. Digital receiver signatures are captured instantly." : "Supir memfoto bukti serah terima di HP. Tanda tangan digital penerima terekam instan."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 nm-emboss-sm bg-white/60 p-3.5 rounded-2xl border-l-4 border-brand-teal">
                    <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Active billing-ready triggers" : "Billing-Ready Trigger Aktif"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Incoming ePODs instantly trigger 'Ready to Bill' status. Draft invoice is generated on the spot." : "ePOD yang masuk langsung memicu status \"Siap Tagih\". Invoice draf terbit detik itu juga."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeCompareTab === "customer" && (
                <div className="flex flex-col gap-4 text-xs text-slate-700">
                  <div className="flex gap-3 nm-emboss-sm bg-white/60 p-3.5 rounded-2xl border-l-4 border-brand-teal">
                    <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Self-service customer portal" : "Self-Service Customer Portal"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Clients log in to your white-labeled branded portal. Track shipments & download PODs independently." : "Customer login ke portal branded berlogo Anda. Melacak rute & mengunduh POD secara mandiri."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 nm-emboss-sm bg-white/60 p-3.5 rounded-2xl border-l-4 border-brand-teal">
                    <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{isEn ? "Automated WhatsApp & Email alerts" : "Notifikasi Otomatis WhatsApp/Email"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        {isEn ? "Every time cargo moves or ePOD is uploaded, your client instantly receives tracking links." : "Setiap barang bergeser atau POD terunggah, customer Anda langsung menerima link update."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                <span className="text-brand-teal font-extrabold uppercase">{isEn ? "Average Response: < 5 Minutes" : "Rata-rata Respon: < 5 Menit"}</span>
                <span className="text-emerald-600 nm-emboss-sm px-3 py-1 rounded-xl font-extrabold">{isEn ? "SEAMLESS" : "LANCAR"}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

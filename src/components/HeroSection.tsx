import React, { useState, useEffect } from "react";
import { ArrowRight, Play, ShieldCheck, Activity, Users, Truck, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection({ lang = 'id' }: { lang?: 'id' | 'en' }) {
  const [shipmentsCount, setShipmentsCount] = useState(14820);
  const [activeTrucks, setActiveTrucks] = useState(142);
  const [podProgress, setPodProgress] = useState(99.6);

  const isEn = lang === 'en';

  // Dynamic simulation of real-time logistics activities
  useEffect(() => {
    const interval = setInterval(() => {
      setShipmentsCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setActiveTrucks((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next > 120 && next < 180 ? next : prev;
      });
      setPodProgress((prev) => {
        const delta = (Math.random() * 0.1 - 0.05);
        const next = parseFloat((prev + delta).toFixed(2));
        return next > 99.1 && next < 99.9 ? next : prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-navy-dark"
      id="hero-section"
    >
      {/* Decorative Grid Mesh (Clean and subtle light grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(163,177,198,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(163,177,198,0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Dynamic Ambient Background Blobs for soft color refraction */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-teal/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-brand-orange/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6 text-left" 
            id="hero-left-col"
          >
            
            {/* Status Tag */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full nm-emboss-sm text-brand-teal text-xs font-extrabold uppercase tracking-widest cursor-default" 
              id="hero-status-tag"
            >
              <span className="w-2.5 h-2.5 rounded-full nm-led-teal"></span>
              <span>{isEn ? "Logistics Integration: Request to Payment" : "Integrasi Logistik: Permintaan ke Pembayaran"}</span>
            </motion.div>

            {/* Main Headline (Editorial / Magazine Style - NO ITALIC) */}
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-slate-900">
              {isEn ? (
                <>Modern <span className="text-brand-teal font-extrabold">Logistics</span> Platform.</>
              ) : (
                <>Platform <span className="text-brand-teal font-extrabold">Logistik</span> Modern.</>
              )}
            </h1>

            {/* Subheadline (Medium Slate - NO ITALIC) */}
            <p className="text-base sm:text-lg text-slate-600 font-semibold leading-relaxed max-w-2xl font-sans">
              {isEn ? (
                <>Manage the full operational flow from customer requests, pricing quotes, fleet execution, to billing and business reporting in one connected platform. <span className="text-brand-orange font-extrabold">Stop wasting hours</span> on manual tasks in Excel and WhatsApp.</>
              ) : (
                <>Kelola seluruh alur operasional mulai dari permintaan customer, penawaran harga, eksekusi armada, hingga tagihan dan laporan bisnis dalam satu platform terhubung. <span className="text-brand-orange font-extrabold">Hentikan pekerjaan manual</span> yang memakan waktu di Excel dan WhatsApp.</>
              )}
            </p>

            {/* Call to Actions (Tactile Outsets) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 mt-2">
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#challenges"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 nm-btn-accent text-white font-extrabold rounded-2xl text-base shadow-md cursor-pointer border-0"
              >
                <span>{isEn ? "Explore the Challenges" : "Lihat Tantangan Operasional"}</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="#sandbox"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 nm-btn text-slate-700 font-extrabold rounded-2xl text-base cursor-pointer border-0"
              >
                <Play className="w-3.5 h-3.5 fill-current text-brand-teal" />
                <span>{isEn ? "Try Live Simulator" : "Uji Coba Sistem"}</span>
              </motion.a>
            </div>

            {/* Trust badging (Tactile indicators) */}
            <div className="flex flex-wrap items-center gap-y-3.5 gap-x-6 pt-5 border-t border-slate-200 mt-4 text-slate-500 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-teal" />
                <span className="text-slate-600 font-bold">{isEn ? "Single Input, Multi-Functional" : "Input Tunggal, Multi-Fungsi"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-teal" />
                <span className="text-slate-600 font-bold">{isEn ? "Custom Company Domains" : "Kustomisasi Domain Perusahaan"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-teal" />
                <span className="text-slate-600 font-bold">{isEn ? "Flexible Workflow Setup" : "Setup Workflow Fleksibel"}</span>
              </div>
            </div>

          </motion.div>

          {/* Right Visual Column (Neumorphic Dashboard Panel - Asymmetrically Elevated) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative lg:border-l lg:border-slate-300 lg:pl-12 lg:-translate-y-6 lg:mt-4 z-10" 
            id="hero-right-col"
          >
            
            {/* High-fidelity Asymmetric Floating micro-widget - Elite Developer Design */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              className="absolute -bottom-8 -left-8 hidden xl:flex flex-col p-4.5 rounded-2xl nm-emboss bg-white/95 border-0 max-w-[210px] z-30 shadow-md text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
                </span>
                <span className="font-mono text-[9px] font-black text-brand-teal tracking-widest uppercase">
                  {isEn ? "FLEET EN-ROUTE" : "ARMADA BERJALAN"}
                </span>
              </div>
              <div className="font-sans text-xs font-black text-slate-800">
                Truk-09 (Surabaya)
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-normal">
                {isEn ? "Speed: 68 km/h • ETA: 12:45" : "Kecepatan: 68 km/j • ETA: 12:45"}
              </p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-brand-teal h-full w-4/5 animate-pulse" />
              </div>
            </motion.div>

            {/* Interactive Grid Card (Raised tactile surface) */}
            <div className="relative nm-emboss rounded-3xl p-6 sm:p-7 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-teal" />
              
              {/* Header Grid Line (Tactile Browser top bar) */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400 block nm-deboss-sm"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400 block nm-deboss-sm"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 block nm-deboss-sm"></span>
                  </div>
                  <span className="text-slate-400 font-bold text-[10px] nm-deboss-sm px-4 py-1 rounded-full text-center w-36 overflow-hidden">cargogrid-system</span>
                </div>
                <span className="px-3 py-1 nm-emboss-sm rounded-full text-[9px] font-extrabold text-brand-teal tracking-wider uppercase">
                  {isEn ? "System Active" : "Sistem Aktif"}
                </span>
              </div>

              {/* Dynamic Metrics Grid (Debossed sunken cards) */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200/80">
                <div className="nm-deboss rounded-2xl p-4 flex flex-col justify-between bg-[#f5f8fc]/40">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-extrabold">{isEn ? "Total Transactions" : "Total Transaksi"}</span>
                  <div className="text-2xl font-mono font-black text-slate-900 mt-1">
                    {shipmentsCount.toLocaleString()}
                  </div>
                  <span className="text-[9px] text-emerald-600 font-mono font-bold flex items-center gap-1 mt-1">
                    <span>&bull; {isEn ? "Live Update" : "Update Terkini"}</span>
                  </span>
                </div>
                <div className="nm-deboss rounded-2xl p-4 flex flex-col justify-between bg-[#f5f8fc]/40">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-extrabold">{isEn ? "Active Fleets" : "Armada Berjalan"}</span>
                  <div className="text-2xl font-mono font-black text-brand-teal mt-1">
                    {activeTrucks} {isEn ? "Units" : "Unit"}
                  </div>
                  <span className="text-[9px] text-emerald-600 font-mono font-bold flex items-center gap-1 mt-1">
                    <span>&bull; {isEn ? "On Schedule" : "Sesuai Jadwal"}</span>
                  </span>
                </div>
              </div>

              {/* Real-time Logistics Stream */}
              <div className="py-4 space-y-3.5 text-xs text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-extrabold">{isEn ? "Recent System Activities" : "Aktivitas Sistem Terkini"}</span>
                
                {/* Event 1 (Tactile Outset Card) */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="flex items-start gap-3 nm-emboss-sm p-3.5 rounded-2xl bg-white/40"
                >
                  <div className="p-2 rounded-xl nm-deboss text-brand-teal flex-shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">Request #2026-90412</span>
                      <span className="text-[9px] font-mono text-brand-teal font-extrabold uppercase nm-emboss-sm px-2 py-0.5 rounded-full">{isEn ? "New" : "Baru"}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {isEn ? "Quotation generated automatically based on vendor contract rates." : "Quotation dikirimkan otomatis berdasarkan rate kontrak vendor."}
                    </p>
                  </div>
                </motion.div>

                {/* Event 2 (Tactile Outset Card) */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="flex items-start gap-3 nm-emboss-sm p-3.5 rounded-2xl bg-white/40"
                >
                  <div className="p-2 rounded-xl nm-deboss text-brand-orange flex-shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{isEn ? "Delivery Note #CG-9104" : "Surat Jalan #CG-9104"}</span>
                      <span className="text-[9px] font-mono text-brand-orange font-extrabold uppercase nm-emboss-sm px-2 py-0.5 rounded-full">{isEn ? "In Transit" : "Dalam Perjalanan"}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {isEn ? "Truck in transit on Jakarta to Surabaya route via Trans-Java Toll." : "Truk dalam perjalanan rute Jakarta ke Surabaya via Tol Trans Jawa."}
                    </p>
                  </div>
                </motion.div>

                {/* Event 3 (Tactile Outset Card) */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="flex items-start gap-3 nm-emboss-sm p-3.5 rounded-2xl bg-white/40"
                >
                  <div className="p-2 rounded-xl nm-deboss text-emerald-600 flex-shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{isEn ? "Billing & Invoicing" : "Billing / Tagihan"}</span>
                      <span className="text-[9px] font-mono text-emerald-600 font-extrabold uppercase nm-emboss-sm px-2 py-0.5 rounded-full">{isEn ? "Invoice Ready" : "Siap Invoice"}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {isEn ? "ePOD successfully validated, invoice draft posted to daily ledger." : "ePOD berhasil divalidasi, draft invoice otomatis masuk ke buku besar harian."}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Progress Tracker (Sunken container) */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 flex items-center gap-2 font-bold">
                  <span className="inline-block w-2.5 h-2.5 rounded-full nm-led-teal" />
                  <span>{isEn ? "POD Turnaround Speed:" : "Kecepatan Penyelesaian POD:"}</span>
                </span>
                <span className="text-slate-900 font-extrabold">{podProgress}%</span>
              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

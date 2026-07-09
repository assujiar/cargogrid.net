"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, AlertCircle, TrendingDown } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "./shared/LanguageProvider";

export default function DelayCalculator() {
  const { lang } = useLanguage();
  const [shipments, setShipments] = useState(1200);
  const [hoursWasted, setHoursWasted] = useState(4);
  const [laborRate, setLaborRate] = useState(50000);

  const isEn = lang === 'en';

  // Constants for estimation
  const AVERAGE_INVOICE_VALUE = 3000000; // Rp 3.000.000 average shipment value

  // Calculated variables
  const monthlyHoursWasted = shipments * hoursWasted;
  const monthlyCostWasted = monthlyHoursWasted * laborRate;
  const annualCostWasted = monthlyCostWasted * 12;

  // Capital frozen in DSO (Assuming average POD delay is 14 days)
  const frozenCapital = shipments * AVERAGE_INVOICE_VALUE * (14 / 30);

  // CargoGrid savings (90% recovery of operational leakage)
  const potentialSavings = annualCostWasted * 0.9;

  // Helper to format currency to IDR
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section
      className="py-20 md:py-28 bg-navy-dark relative"
      id="roi-calculator"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-slate-300/60 text-left">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-teal uppercase">
              {isEn ? "Margin Recovery Estimation" : "Estimasi Pemulihan Margin"}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              POD Delay & <span className="text-brand-teal font-extrabold">Cost Leakage Calculator</span>
            </h1>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-slate-300 lg:pl-8">
            <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed font-sans">
              {isEn ? (
                "How much of your profit margin and company cash flow is trapped due to slow paper POD circulation and manual re-keying? Calculate your leakage now."
              ) : (
                "Berapa banyak profit margin dan arus kas perusahaan Anda yang tersangkut karena lambatnya sirkulasi bukti POD fisik dan input ganda? Hitung kebocorannya sekarang harian."
              )}
            </p>
          </div>
        </div>

        {/* Sliders vs Outputs Grid - Asymmetrical Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Interactive Inputs (Sliders) (Slightly narrower for asymmetric look) */}
          <div className="lg:col-span-5 nm-emboss rounded-3xl p-6 sm:p-8 flex flex-col gap-8 bg-[#eef2f6]/40 text-left">
            <h3 className="font-display font-black text-lg text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-teal" />
              <span>{isEn ? "Your Operational Parameters" : "Masukan Parameter Operasional Anda"}</span>
            </h3>

            {/* Slider 1: Shipments volume */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-500 font-bold">{isEn ? "Monthly Shipment Volume:" : "Volume Pengiriman Bulanan:"}</span>
                <span className="text-brand-teal font-black nm-deboss-sm px-3 py-1.5 rounded-xl bg-white/40">
                  {shipments.toLocaleString()} {isEn ? "Jobs" : "Job"} / {isEn ? "Month" : "Bulan"}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                id="monthly-shipments"
                name="monthly-shipments"
                aria-label={isEn ? "Monthly shipment volume" : "Volume pengiriman bulanan"}
                value={shipments}
                onChange={(e) => setShipments(parseInt(e.target.value))}
                className="w-full h-2.5 rounded-lg cursor-pointer accent-brand-teal border-0"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold">
                <span>100</span>
                <span>5.000</span>
                <span>10.000 {isEn ? "Jobs" : "Job"}</span>
              </div>
            </div>

            {/* Slider 2: Hours wasted */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-500 font-bold">{isEn ? "Avg Hours Wasted per Shipment:" : "Rata-rata Jam Terbuang per Pengiriman:"}</span>
                <span className="text-brand-teal font-black nm-deboss-sm px-3 py-1.5 rounded-xl bg-white/40">
                  {hoursWasted} {isEn ? "Hours" : "Jam"} / Shipment
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                id="hours-wasted"
                name="hours-wasted"
                aria-label={isEn ? "Average hours wasted per shipment" : "Rata-rata jam terbuang per pengiriman"}
                value={hoursWasted}
                onChange={(e) => setHoursWasted(parseInt(e.target.value))}
                className="w-full h-2.5 rounded-lg cursor-pointer accent-brand-teal border-0"
              />
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                {isEn ? (
                  "*Includes driver POD collection, invoice matching, transit phone calls, and manual double entries."
                ) : (
                  "*Mengumumkan POD supir, mencocokkan data invoice, telpon update posisi, input manual ganda."
                )}
              </p>
            </div>

            {/* Slider 3: Labor cost */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-500 font-bold">{isEn ? "Est. Staff Cost (per Hour):" : "Estimasi Biaya Staff (per Jam):"}</span>
                <span className="text-brand-teal font-black nm-deboss-sm px-3 py-1.5 rounded-xl bg-white/40">
                  {formatIDR(laborRate)} / {isEn ? "Hr" : "Jam"}
                </span>
              </div>
              <input
                type="range"
                min="25000"
                max="150000"
                step="5000"
                id="labor-rate"
                name="labor-rate"
                aria-label={isEn ? "Estimated staff cost per hour" : "Estimasi biaya staf per jam"}
                value={laborRate}
                onChange={(e) => setLaborRate(parseInt(e.target.value))}
                className="w-full h-2.5 rounded-lg cursor-pointer accent-brand-teal border-0"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold">
                <span>Rp 25k</span>
                <span>Rp 75k</span>
                <span>Rp 150k</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visualized Financial Results (Slightly wider for asymmetric look) */}
          <div className="lg:col-span-7 nm-emboss rounded-3xl p-6 sm:p-9 flex flex-col justify-between relative overflow-hidden bg-[#eef2f6]/50 text-left">
            
            {/* Top row */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <span className="font-mono text-xs font-extrabold text-rose-600 uppercase flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span>{isEn ? "TOTAL OPERATIONAL LEAKAGE (LOSS)" : "TOTAL OPERATIONAL LEAKAGE (KERUGIAN)"}</span>
                </span>
                <span className="text-slate-500 font-mono text-[9px] font-black uppercase tracking-wider">Estimated &bull; Annual</span>
              </div>

              {/* Main Financial Leakage Output */}
              <motion.div
                key={annualCostWasted}
                initial={{ scale: 0.98, opacity: 0.9 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-xs text-slate-500 font-black tracking-wider uppercase font-mono block">
                  {isEn ? "Wasted Labor Cost (Per Year):" : "Biaya Tenaga Kerja Terbuang (Per Tahun):"}
                </span>
                <div className="text-3xl sm:text-4xl font-mono font-black text-rose-600 mt-1.5 tracking-tight">
                  {formatIDR(annualCostWasted)}
                </div>
                <p className="text-xs text-slate-600 font-semibold mt-2 leading-relaxed">
                  {isEn ? (
                    <>Represents {monthlyHoursWasted.toLocaleString()} hours wasted per month on paper chase bureaucracy and manual entries.</>
                  ) : (
                    <>Mewakili total <strong className="text-slate-800">{monthlyHoursWasted.toLocaleString()} jam kerja</strong> staff Anda sebulan yang habis sia-sia mengurusi birokrasi kertas POD dan invoice dispute.</>
                  )}
                </p>
              </motion.div>

              {/* Frozen capital under DSO bottleneck */}
              <motion.div 
                key={frozenCapital}
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="nm-deboss p-4.5 rounded-2xl bg-white/40"
              >
                <div className="flex justify-between font-mono text-[10px] text-slate-500 font-bold mb-1.5">
                  <span>{isEn ? "POTENTIAL ACTIVE CASH FLOW TRAPPED (DSO):" : "POTENSI CASHFLOW MACET DI JALAN (DSO):"}</span>
                  <span className="text-rose-600 font-black uppercase tracking-wider">&plusmn; 14 {isEn ? "Days Delay" : "Hari Delay"}</span>
                </div>
                <div className="text-xl font-mono font-black text-slate-800">
                  {formatIDR(frozenCapital)}
                </div>
                <p className="text-[10px] text-slate-500 font-semibold mt-1.5 leading-relaxed">
                  {isEn ? (
                    "Active working capital stuck on the road that could have been billed instantly had ePODs been scanned on delivery day."
                  ) : (
                    "Modal kerja aktif yang mandek di jalan yang seharusnya bisa segera ditagihkan jika dokumen bukti kirim POD diserahkan instan di hari yang sama."
                  )}
                </p>
              </motion.div>
            </div>

            {/* Bottom Row - CargoGrid potential savings */}
            <div className="pt-6 border-t border-slate-200 mt-6 bg-brand-teal/[0.04] -mx-6 -mb-6 p-6 sm:p-9 rounded-b-3xl">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl nm-emboss-sm text-brand-teal mt-0.5 bg-white">
                  <TrendingDown className="w-5 h-5 text-brand-teal" />
                </div>
                <motion.div
                  key={potentialSavings}
                  initial={{ y: 2, opacity: 0.9 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-[10px] font-mono text-brand-teal font-black uppercase tracking-widest block">
                    {isEn ? "POTENTIAL SAVINGS WITH CARGOGRID" : "POTENSI SAVINGS DENGAN CARGOGRID"}
                  </span>
                  <div className="text-2xl font-mono font-black text-emerald-600 mt-0.5">
                    {formatIDR(potentialSavings)} / {isEn ? "Year" : "Tahun"}
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold mt-1.5 leading-relaxed">
                    {isEn ? (
                      "CargoGrid recovers up to 90% of administrative overhead by eliminating redundant data entry and triggering automated invoice sequences upon ePOD submission."
                    ) : (
                      "CargoGrid memulihkan hingga 90% jam kerja administratif dengan mengalirkan data tanpa ketik ulang dan memicu penagihan invoice otomatis begitu ePOD terupload."
                    )}
                  </p>
                </motion.div>
              </div>
            </div>

          </div>

        </div>

        {/* Lead Magnet Download Incentive CTA - Asymmetric Banner */}
        <div className="mt-12 nm-emboss p-6 rounded-3xl bg-white/40 flex flex-col sm:flex-row items-center justify-between gap-5 text-left border-0">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl nm-deboss flex items-center justify-center text-brand-teal font-black font-mono bg-white">
              PDF
            </span>
            <div>
              <p className="font-extrabold text-sm text-slate-800">
                {isEn ? "Need a practical logistics software buying guide?" : "Butuh panduan praktis memilih software logistik?"}
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {isEn ? 'Download our free logistics software guide for Indonesian businesses.' : 'Unduh panduan software logistik gratis untuk bisnis Indonesia.'}
              </p>
            </div>
          </div>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl text-xs font-black nm-btn-accent shadow uppercase tracking-wider cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>{isEn ? "Download Free Buyer Guide" : "Unduh Buyer Guide Gratis"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}

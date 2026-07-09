import React, { useState } from "react";
import { Check, ClipboardList, Truck, Search, FileCheck, Download, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LiveDemoSandbox({ lang = 'id' }: { lang?: 'id' | 'en' }) {
  const [activeTab, setActiveTab] = useState<"commercial" | "ops" | "tracking" | "finance" | "dashboard">("commercial");
  const isEn = lang === 'en';

  // State managers for interactive sandbox behaviors
  const [quoteCalculated, setQuoteCalculated] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("Sinar Logistics");
  const [sellingPrice, setSellingPrice] = useState(12000000);

  // Operations State
  const [isDispatched, setIsDispatched] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("Joko Susilo");

  // Tracking State
  const [trackingNumberInput, setTrackingNumberInput] = useState("CG-9104");
  const [hasSearched, setHasSearched] = useState(true);

  // Finance State
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);

  return (
    <section
      className="py-20 md:py-28 bg-[#eef2f6] relative"
      id="sandbox"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#beccd920_1px,transparent_1px),linear-gradient(to_bottom,#beccd920_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header - Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-slate-300/60 text-left">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-teal uppercase animate-pulse">
              {isEn ? "Interactive System Sandbox" : "Simulasi Alur Kerja Sistem"}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              {isEn ? (
                <>Explore the <span className="text-brand-teal font-extrabold font-display">CargoGrid Demo</span> Suite</>
              ) : (
                <>Eksplorasi Portal <span className="text-brand-teal font-extrabold font-display">CargoGrid Demo</span></>
              )}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-slate-300 lg:pl-8">
            <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed font-sans">
              {isEn ? (
                "Experience the CargoGrid logistics operating system firsthand. Click the interactive tabs and buttons below to observe real-time database synchronization."
              ) : (
                "Rasakan langsung pengalaman menggunakan modul operasional logistik CargoGrid. Klik tombol interaktif di bawah untuk melihat bagaimana sistem merespon secara real-time."
              )}
            </p>
          </div>
        </div>

        {/* Tab Selection Row (Tactile layout, asymmetrical border highlights) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12" id="sandbox-tabs-row">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("commercial")}
            className={`px-5 py-3.5 rounded-xl font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 border-0 transition-all cursor-pointer ${
              activeTab === "commercial"
                ? "nm-btn-accent bg-gradient-to-r from-brand-teal to-emerald-500 text-white shadow-md font-extrabold"
                : "nm-btn bg-white/50 text-slate-600 hover:text-slate-800"
            }`}
          >
            <ClipboardList className="w-4 h-4 text-brand-teal" />
            <span>Commercial (RFQ)</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("ops")}
            className={`px-5 py-3.5 rounded-xl font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 border-0 transition-all cursor-pointer ${
              activeTab === "ops"
                ? "nm-btn-accent bg-gradient-to-r from-brand-teal to-emerald-500 text-white shadow-md font-extrabold"
                : "nm-btn bg-white/50 text-slate-600 hover:text-slate-800"
            }`}
          >
            <Truck className="w-4 h-4 text-brand-teal" />
            <span>Operations Dispatch</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("tracking")}
            className={`px-5 py-3.5 rounded-xl font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 border-0 transition-all cursor-pointer ${
              activeTab === "tracking"
                ? "nm-btn-accent bg-gradient-to-r from-brand-teal to-emerald-500 text-white shadow-md font-extrabold"
                : "nm-btn bg-white/50 text-slate-600 hover:text-slate-800"
            }`}
          >
            <Search className="w-4 h-4 text-brand-teal" />
            <span>Client Tracking</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("finance")}
            className={`px-5 py-3.5 rounded-xl font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 border-0 transition-all cursor-pointer ${
              activeTab === "finance"
                ? "nm-btn-accent bg-gradient-to-r from-brand-teal to-emerald-500 text-white shadow-md font-extrabold"
                : "nm-btn bg-white/50 text-slate-600 hover:text-slate-800"
            }`}
          >
            <FileCheck className="w-4 h-4 text-brand-teal" />
            <span>Finance Billing</span>
          </motion.button>
        </div>

        {/* Sandbox Content Screen (The App Frame Mockup) */}
        <div className="nm-emboss bg-[#eef2f6]/95 rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto border-0" id="sandbox-frame-box">
          
          {/* Top Frame Control Bar */}
          <div className="bg-slate-100 border-b border-slate-200/60 px-6 py-4 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 block" />
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-brand-teal font-black uppercase tracking-wider text-[10px]">CargoGrid Live Core Workspace v4.5</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-200/50 border border-slate-300/40 px-3 py-1 rounded-lg text-[9px] text-slate-600 font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse mr-1" />
              <span>Database Sync: {isEn ? "ACTIVE" : "REAL-TIME"}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Tab 1: Commercial (RFQ Costing) Screen */}
            {activeTab === "commercial" && (
              <motion.div
                key="commercial"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-9 flex flex-col gap-6"
                id="sandbox-commercial-view"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 text-left">
                  <div>
                    <h4 className="font-display font-black text-xl text-slate-900">{isEn ? "Commercial Pricing Costing" : "Commercial Pricing Calculator"}</h4>
                    <p className="text-xs text-slate-400 font-mono font-black mt-1">RFQ-2026-90412: Jakarta (Tanjung Priok) &rarr; Surabaya (Tanjung Perak)</p>
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-extrabold bg-slate-200/60 px-3 py-1.5 rounded-xl">Cargo: FCL 1x40&apos; Dry Container</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
                  {/* Inputs card left */}
                  <div className="md:col-span-7 nm-deboss bg-[#eef2f6]/40 rounded-2xl p-6 flex flex-col gap-5 border-0">
                    <span className="font-mono text-[9px] text-brand-teal uppercase tracking-widest block font-black">{isEn ? "STEP 1: SELECT CARRIER & ADJUST PRICE" : "Langkah 1: Pilih Vendor & Estimasi Margin"}</span>
                    
                    {/* Vendor Selection List */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs text-slate-600 font-black tracking-wide">{isEn ? "Select Vendor Contract Rate (Procurement):" : "Pilih Vendor Terdaftar (Procurement Rate):"}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { name: "Sinar Logistics", cost: 7800000 },
                          { name: "Majujaya Carrier", cost: 8200000 },
                          { name: "Samudra Lines", cost: 8500000 },
                        ].map((vend) => (
                          <button
                            key={vend.name}
                            onClick={() => {
                              setSelectedVendor(vend.name);
                              setQuoteCalculated(false);
                            }}
                            className={`p-3.5 rounded-xl border-0 text-left cursor-pointer transition-all ${
                              selectedVendor === vend.name
                                ? "nm-btn-accent bg-brand-teal text-white shadow-md"
                                : "nm-btn bg-white/60 text-slate-600 hover:text-slate-800"
                            }`}
                          >
                            <p className={`font-black text-xs line-clamp-1 ${selectedVendor === vend.name ? "text-white" : "text-slate-800"}`}>{vend.name}</p>
                            <p className={`text-[10px] font-mono mt-1 font-black ${selectedVendor === vend.name ? "text-white/90" : "text-brand-teal"}`}>Rp {vend.cost.toLocaleString()}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Markup Value */}
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex justify-between text-xs text-slate-600 font-black tracking-wide">
                        <span>{isEn ? "Configure Offer Selling Price:" : "Kalkulasi Selling Price Penawaran:"}</span>
                        <span className="text-slate-900 font-mono font-black">Rp {sellingPrice.toLocaleString()}</span>
                      </div>
                      <input
                        id="selling-price"
                        name="sellingPrice"
                        aria-label={isEn ? "Configure offer selling price" : "Kalkulasi selling price penawaran"}
                        type="range"
                        min="9000000"
                        max="15000000"
                        step="500000"
                        value={sellingPrice}
                        onChange={(e) => {
                          setSellingPrice(parseInt(e.target.value));
                          setQuoteCalculated(false);
                        }}
                        className="w-full accent-brand-teal h-2 bg-slate-200 rounded-lg cursor-pointer border-0"
                      />
                    </div>

                    {/* Trigger Action */}
                    <button
                      onClick={() => setQuoteCalculated(true)}
                      className="mt-2 w-full py-3.5 rounded-xl nm-btn-accent bg-gradient-to-r from-brand-teal to-emerald-500 text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-md"
                    >
                      <span>{isEn ? "Run Win-Margin Guardrail Assessment" : "Kalkulasi Win-Margin Guardrail \u2192"}</span>
                    </button>
                  </div>

                  {/* Pricing Guardrail right */}
                  <div className="md:col-span-5 nm-emboss bg-[#fbfbfb]/80 rounded-2xl p-6 flex flex-col justify-between min-h-[310px] border-0">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block font-black">{isEn ? "AUTOMATED COMPLIANCE VERIFICATION:" : "Kalkulasi Otomatis Margin:"}</span>
                    
                    {quoteCalculated ? (
                      <div className="flex flex-col gap-4 py-2">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <span className="text-slate-500 font-semibold text-xs">{isEn ? "Buying Cost" : "Buying Cost"} ({selectedVendor}):</span>
                          <span className="font-mono text-xs text-slate-900 font-black">
                            Rp {(selectedVendor === "Sinar Logistics" ? 7800000 : selectedVendor === "Majujaya Carrier" ? 8200000 : 8500000).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <span className="text-slate-500 font-semibold text-xs">{isEn ? "Selling Price" : "Selling Price"} ({isEn ? "Offered" : "Penawaran"}):</span>
                          <span className="font-mono text-xs text-slate-900 font-black">Rp {sellingPrice.toLocaleString()}</span>
                        </div>

                        {/* Profit Margin Calculations */}
                        <div>
                          <span className="text-slate-400 text-[9px] font-mono block font-black uppercase tracking-wider">{isEn ? "ESTIMATED PROFIT MARGIN:" : "ESTIMASI MARGIN KEUNTUNGAN:"}</span>
                          <div className="text-2xl font-mono font-black text-emerald-600 mt-1">
                            Rp {(sellingPrice - (selectedVendor === "Sinar Logistics" ? 7800000 : selectedVendor === "Majujaya Carrier" ? 8200000 : 8500000)).toLocaleString()}
                          </div>
                          <span className="inline-block mt-1.5 text-[9px] font-mono font-black text-emerald-700 bg-emerald-500/10 px-3 py-1 rounded-md tracking-wider uppercase">
                            Margin: {Math.round(((sellingPrice - (selectedVendor === "Sinar Logistics" ? 7800000 : selectedVendor === "Majujaya Carrier" ? 8200000 : 8500000)) / sellingPrice) * 100)}% &bull; {isEn ? "COMPLIANT" : "AMAN"}
                          </span>
                        </div>

                        <div className="nm-deboss bg-emerald-50/70 p-3.5 rounded-xl text-[11px] text-emerald-800 flex items-start gap-1.5 mt-2 border-0 font-bold leading-relaxed">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{isEn ? "Profit margin satisfies company rule set (> 15%). 'Publish Digital PDF Quotation' action enabled!" : 'Sistem mendeteksi margin di atas batas minimal 15%. Tombol "Kirim Penawaran Harga PDF" aktif!'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center flex-1 py-10 text-slate-500">
                        <ClipboardList className="w-12 h-12 text-slate-400 stroke-1 mb-2 animate-bounce" />
                        <p className="text-xs font-semibold leading-relaxed">
                          {isEn ? "Adjust operational settings on the left panel, then trigger calculation to audit the gross margins." : "Ubah parameter di kiri dan klik tombol kalkulasi untuk melihat perhitungan margin."}
                        </p>
                      </div>
                    )}

                    <div className="mt-auto border-t border-slate-200/80 pt-4 text-[9px] text-slate-400 font-black tracking-wider uppercase font-mono">
                      {isEn ? "*Enforces commercial rules to prevent loss-making agency quote dispatch." : "*Mencegah Sales mengirimkan penawaran rugi di bawah batas margin."}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Operations Dispatch Screen */}
            {activeTab === "ops" && (
              <motion.div
                key="ops"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-9 flex flex-col gap-6"
                id="sandbox-ops-view"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 text-left">
                  <div>
                    <h4 className="font-display font-black text-xl text-slate-900">{isEn ? "Operations Dispatch & Fleet Routing" : "Operations Dispatch & Driver assignment"}</h4>
                    <p className="text-xs text-slate-400 font-mono font-black mt-1">Job Order: #CG-9104 &bull; {isEn ? "North Jakarta to East Surabaya" : "Jakarta Utara Ke Surabaya Timur"}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-extrabold bg-slate-200/60 px-3 py-1.5 rounded-xl">{isEn ? "Road Trip: FTL Box Truck" : "Rute Darat: FTL Box Truck"}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
                  {/* Assignment Controls */}
                  <div className="md:col-span-6 nm-deboss bg-white/40 rounded-2xl p-6 flex flex-col gap-5 justify-between min-h-[310px] border-0">
                    <div>
                      <span className="font-mono text-[9px] text-brand-teal uppercase tracking-widest block font-black mb-3">{isEn ? "STEP 1: ASSIGN DRIVER & VEHICLE" : "Langkah 1: Assign Driver Armada"}</span>
                      
                      <div className="flex flex-col gap-2.5">
                        <label className="text-xs text-slate-600 font-black tracking-wide">{isEn ? "Select Available Driver from Fleet Pool:" : "Pilih Driver Tersedia di Pool:"}</label>
                        <div className="space-y-2.5">
                          {[
                            { name: "Joko Susilo", vehicle: "Hino Wingbox (B 9801 TX)", status: "Ready" },
                            { name: "Andi Wijaya", vehicle: "Fuso Tronton (B 9142 SF)", status: "Ready" },
                          ].map((driver) => (
                            <label
                              key={driver.name}
                              onClick={() => {
                                setSelectedDriver(driver.name);
                                setIsDispatched(false);
                              }}
                              className={`flex items-center justify-between p-3.5 rounded-xl border-0 cursor-pointer transition-all ${
                                selectedDriver === driver.name
                                  ? "nm-btn-accent bg-brand-teal text-white shadow-md"
                                  : "nm-btn bg-white/60 text-slate-600 hover:text-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="radio"
                                  name="driver"
                                  checked={selectedDriver === driver.name}
                                  onChange={() => {}}
                                  className="accent-brand-teal"
                                />
                                <div>
                                  <p className={`font-black text-xs ${selectedDriver === driver.name ? "text-white" : "text-slate-800"}`}>{driver.name}</p>
                                  <p className={`text-[10px] font-mono mt-0.5 ${selectedDriver === driver.name ? "text-white/80" : "text-slate-500"}`}>{driver.vehicle}</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono font-black text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {driver.status}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsDispatched(true)}
                      className="w-full py-3.5 rounded-xl nm-btn-accent bg-gradient-to-r from-brand-teal to-emerald-500 text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 cursor-pointer border-0 mt-4 shadow-md"
                    >
                      <span>{isEn ? "Dispatch via Mobile Driver App PWA \u2192" : "Dispatch Supir via Driver App Portal \u2192"}</span>
                    </button>
                  </div>

                  {/* Real-time map timeline */}
                  <div className="md:col-span-6 nm-emboss bg-[#fbfbfb]/80 rounded-2xl p-6 flex flex-col justify-between min-h-[310px] border-0">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block font-black mb-3">{isEn ? "LIVE TRACKING TELEMETRY (DRIVER SYNC):" : "Live Dispatch Monitor (Driver App Sync):"}</span>
                    
                    {isDispatched ? (
                      <div className="space-y-4">
                        {/* Driver Assigned Card */}
                        <div className="nm-deboss bg-white/50 p-3.5 rounded-xl flex justify-between items-center text-xs border-0">
                          <div>
                            <p className="text-slate-400 text-[9px] uppercase font-mono font-black tracking-wider">{isEn ? "ASSIGNED DRIVER:" : "SUPIR BERTUGAS:"}</p>
                            <p className="font-black text-slate-800 mt-0.5">{selectedDriver}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-400 text-[9px] uppercase font-mono font-black tracking-wider">{isEn ? "APP CONNECTED STATE:" : "STATUS DRIVER PORTAL:"}</p>
                            <p className="font-extrabold text-emerald-600 mt-0.5 flex items-center gap-1 justify-end">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>ON TRIP (LIVE)</span>
                            </p>
                          </div>
                        </div>

                        {/* Timeline steps */}
                        <div className="pl-4 border-l-2 border-slate-200 relative space-y-4 text-xs font-mono">
                          {/* Point A */}
                          <div className="relative">
                            <span className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-brand-teal" />
                            <p className="font-black text-slate-800">{isEn ? "Jakarta (Tanjung Priok)" : "Jakarta (Tanjung Priok)"}</p>
                            <p className="text-[10px] text-slate-400 font-sans font-semibold mt-0.5">{isEn ? "Dispatch manifest printed & cargo loaded" : "Pick-up Selesai & Manifest Dicetak"}</p>
                          </div>
                          {/* Point B */}
                          <div className="relative">
                            <span className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse" />
                            <p className="font-black text-slate-800">{isEn ? "Semarang (Rest Area Tol)" : "Semarang (Rest Area Tol)"}</p>
                            <p className="text-[10px] text-brand-teal font-sans font-black mt-0.5">{isEn ? "In Transit \u2022 Driver reported secure highway progress" : "In Transit \u2022 Driver melaporkan aman"}</p>
                          </div>
                          {/* Point C */}
                          <div className="relative">
                            <span className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300" />
                            <p className="font-black text-slate-400">{isEn ? "Surabaya (Tanjung Perak)" : "Surabaya (Tanjung Perak)"}</p>
                            <p className="text-[10px] text-slate-400 font-sans font-semibold mt-0.5">{isEn ? "Destination arrival pending \u2022 ePOD incomplete" : "Scheduled Arrival \u2022 ePOD pending"}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center flex-1 py-10 text-slate-500">
                        <Truck className="w-12 h-12 text-slate-400 stroke-1 mb-2 animate-pulse" />
                        <p className="text-xs font-semibold leading-relaxed">
                          {isEn ? "Select a driver and click 'Dispatch' to trigger instant notifications to their mobile phone." : "Klik 'Dispatch Supir' untuk mengirimkan order langsung to smartphone Driver."}
                        </p>
                      </div>
                    )}

                    <div className="border-t border-slate-200/80 pt-3 text-[9px] text-slate-400 font-black tracking-wider uppercase font-mono mt-4">
                      {isEn ? "*Zero manual chat check calls. Milestone updates capture location automatically." : "*Driver tidak perlu dihubungi via WA. Milestone ter-update otomatis lewat GPS HP Driver."}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Customer Portal / Tracking Screen */}
            {activeTab === "tracking" && (
              <motion.div
                key="tracking"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-9 flex flex-col gap-6"
                id="sandbox-tracking-view"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 text-left">
                  <div>
                    <h4 className="font-display font-black text-xl text-slate-900">{isEn ? "Branded Public Tracking Console" : "White-Label Customer Portal Tracking"}</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-1 font-sans">{isEn ? "White-label tracking portal showcasing your corporate logo." : "Halaman pelacakan berlogo brand logistik Anda sendiri (Branded Experience)."}</p>
                  </div>
                  <div className="sm:text-right text-left">
                    <span className="text-[9px] font-mono text-slate-400 block font-black uppercase tracking-wider">{isEn ? "CUSTOM PORTAL DOMAIN:" : "CUSTOMER PORTAL URL:"}</span>
                    <span className="text-xs font-mono text-brand-teal font-extrabold">tracking.perusahaan-anda.com</span>
                  </div>
                </div>

                {/* Simulation search bar */}
                <div className="nm-deboss bg-[#eef2f6]/40 rounded-2xl p-6 flex flex-col gap-4 border-0 text-left">
                  <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest block font-black">{isEn ? "ENTER CONTAINER NUMBER OR BOOKING CODE:" : "Masukkan Nomor Kontainer / Resi Pengiriman:"}</span>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        id="tracking-number-input"
                        name="trackingNumber"
                        aria-label={isEn ? "Container number or booking code" : "Nomor kontainer atau resi pengiriman"}
                        type="text"
                        value={trackingNumberInput}
                        onChange={(e) => setTrackingNumberInput(e.target.value)}
                        className="w-full nm-input bg-white border-0 rounded-xl pl-11 pr-4 py-3.5 text-xs text-slate-900 font-extrabold focus:outline-none focus:ring-2 focus:ring-brand-teal font-mono"
                        placeholder={isEn ? "Example: CG-9104, CG-8812" : "Contoh: CG-9104, CG-8921"}
                      />
                    </div>
                    <button
                      onClick={() => setHasSearched(true)}
                      className="px-5 py-3.5 nm-btn-accent bg-gradient-to-r from-brand-teal to-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-0 shadow-md"
                    >
                      {isEn ? "Search Code" : "Lacak Pengiriman"}
                    </button>
                  </div>
                </div>

                {/* Display Result timeline card */}
                {hasSearched && trackingNumberInput.toUpperCase() === "CG-9104" ? (
                  <div className="nm-emboss bg-[#fbfbfb]/80 rounded-2xl p-6 space-y-4 border-0 text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3.5 text-xs">
                      <div>
                        <span className="text-slate-400 text-[9px] font-mono font-black uppercase tracking-wider">{isEn ? "BOOKING CODE:" : "KODE BOOKING:"}</span>
                        <p className="font-extrabold text-slate-900 mt-0.5 font-mono">CG-9104 &bull; PT Astra Otoparts Tbk</p>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-slate-400 text-[9px] font-mono font-black uppercase tracking-wider">{isEn ? "SHIPMENT STATUS:" : "STATUS CARGO:"}</span>
                        <span className="inline-block mt-0.5 font-mono text-[10px] font-black text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded tracking-wider uppercase">
                          IN TRANSIT (ON TIME)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-1 text-xs font-semibold">
                      <div>
                        <span className="text-slate-400 block text-[9px] font-mono font-black uppercase tracking-wider">{isEn ? "ORIGIN HUB:" : "ASAL PENGIRIMAN:"}</span>
                        <p className="font-extrabold text-slate-800 mt-1">Tanjung Priok, Jakarta</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] font-mono font-black uppercase tracking-wider">{isEn ? "DESTINATION HUB:" : "TUJUAN PENGIRIMAN:"}</span>
                        <p className="font-extrabold text-slate-800 mt-1">Rungkut, Surabaya</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] font-mono font-black uppercase tracking-wider">{isEn ? "ESTIMATED ARRIVAL (ETA):" : "ESTIMASI TIBA (ETA):"}</span>
                        <p className="font-extrabold text-slate-800 mt-1">{isEn ? "July 08, 2026 \u2022 14:00 GMT+7" : "08 Juli 2026 \u2022 14:00 WIB"}</p>
                      </div>
                    </div>

                    {/* Document Download Buttons inside Portal */}
                    <div className="nm-deboss bg-white/50 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between text-xs border-0 font-bold mt-2">
                      <span className="text-slate-600">{isEn ? "Verified Digital Deliverables Available:" : "Dokumen Digital Tersedia:"}</span>
                      <div className="flex gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg nm-btn bg-white text-slate-700 hover:text-slate-900 border-0 text-[10px] font-mono font-black uppercase tracking-wider cursor-pointer">
                          <Download className="w-3.5 h-3.5 text-brand-teal" />
                          <span>{isEn ? "Delivery Order PDF" : "Download Surat Jalan"}</span>
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg nm-btn bg-white text-slate-700 hover:text-slate-900 border-0 text-[10px] font-mono font-black uppercase tracking-wider cursor-pointer">
                          <Download className="w-3.5 h-3.5 text-brand-teal" />
                          <span>{isEn ? "Signed ePOD" : "ePOD Bukti Terima"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : hasSearched ? (
                  <div className="nm-emboss bg-white/40 text-slate-500 font-semibold rounded-2xl p-8 text-center text-xs font-mono border-0">
                    {isEn ? "Shipment tracking number not found. Type 'CG-9104' above to test the tracking interface." : 'No. Resi pengiriman tidak ditemukan. Coba ketik "CG-9104" di kolom di atas untuk mensimulasikan data pelacakan yang terisi.'}
                  </div>
                ) : null}
              </motion.div>
            )}

            {/* Tab 4: Finance Billing-Ready Screen */}
            {activeTab === "finance" && (
              <motion.div
                key="finance"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-9 flex flex-col gap-6"
                id="sandbox-finance-view"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 text-left">
                  <div>
                    <h4 className="font-display font-black text-xl text-slate-900">{isEn ? "Billing Readiness Validation Dashboard" : "Finance Billing Readiness Dashboard"}</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-1 font-sans">{isEn ? "Verify complete POD documentation to instantly trigger client tax invoices." : "Verifikasi dokumen bukti pengiriman dan pemicu cetak invoice otomatis tanpa input ulang data."}</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-500/10 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider">{isEn ? "AR / AP MODULE" : "MODUL AR / AP"}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch text-left">
                  {/* Job Checklist */}
                  <div className="md:col-span-6 nm-deboss bg-white/40 rounded-2xl p-6 flex flex-col gap-5 justify-between min-h-[310px] border-0">
                    <div>
                      <span className="font-mono text-[9px] text-brand-teal uppercase tracking-widest block font-black mb-3">{isEn ? "VERIFIED OPERATIONAL PROOFS (COMPLIANCE):" : "Dokumen Bukti Operasional Terverifikasi:"}</span>
                      
                      {/* Checklist */}
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between nm-emboss bg-white/60 p-3.5 rounded-xl border-0 font-bold">
                          <span className="text-slate-500">{isEn ? "Physical Paper POD Receipt:" : "Bukti Tanda Terima POD Fisik:"}</span>
                          <span className="text-emerald-600 font-black flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>UPLOADED</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between nm-emboss bg-white/60 p-3.5 rounded-xl border-0 font-bold">
                          <span className="text-slate-500">{isEn ? "Driver Route Log Match:" : "Verifikasi Manifest Supir:"}</span>
                          <span className="text-emerald-600 font-black flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>PASSED</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between nm-emboss bg-white/60 p-3.5 rounded-xl border-0 font-bold">
                          <span className="text-slate-500">{isEn ? "Tolls & Port Surcharges:" : "Biaya Tambahan (Surcharge / Toll):"}</span>
                          <span className="text-emerald-600 font-black flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>RECONCILED</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsInvoiceGenerated(true)}
                      className="w-full py-3.5 rounded-xl nm-btn-accent bg-gradient-to-r from-brand-orange to-amber-500 text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 cursor-pointer border-0 mt-4 shadow-md"
                    >
                      <span>{isEn ? "Generate Tax E-Invoice Draft \u2192" : "Cetak Tax-Compliant E-Invoice \u2192"}</span>
                    </button>
                  </div>

                  {/* Digital Invoice Preview */}
                  <div className="md:col-span-6 nm-emboss bg-[#fbfbfb]/80 rounded-2xl p-6 flex flex-col justify-between min-h-[310px] border-0">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block font-black mb-3">{isEn ? "DIGITAL E-INVOICE DRAFT PREVIEW:" : "E-Invoice Draft Preview:"}</span>
                    
                    {isInvoiceGenerated ? (
                      <div className="nm-deboss bg-white text-slate-900 p-4 rounded-2xl text-[10px] font-mono leading-normal border-0">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                          <div>
                            <p className="font-black text-[11px] text-brand-teal uppercase">PT CARGOGRID ERP</p>
                            <p className="text-[7px] text-slate-400">Jakarta, Indonesia</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black">{isEn ? "INVOICE" : "FAKTUR TAGIHAN"}</p>
                            <p className="text-[7px] text-slate-400">No: INV-2026-90412</p>
                          </div>
                        </div>

                        <div className="my-2.5 text-[8px] font-bold text-slate-700">
                          <p><span className="text-slate-400 font-semibold">{isEn ? "Billed To:" : "Ditujukan Kepada:"}</span> PT Astra Otoparts Tbk</p>
                          <p><span className="text-slate-400 font-semibold">{isEn ? "Shipment Scope:" : "Sifat Pengiriman:"}</span> Jakarta &rarr; Surabaya FCL Dry Container</p>
                        </div>

                        <table className="w-full border-collapse my-2.5 text-[8px]">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 text-left">
                              <th className="p-1 border-b border-slate-200">{isEn ? "Service Line" : "Keterangan Layanan"}</th>
                              <th className="p-1 border-b border-slate-200 text-right">{isEn ? "Amount" : "Total Biaya"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="font-medium text-slate-700">
                              <td className="p-1">{isEn ? "Ocean Freight Fee (40ft Container)" : "Biaya Pengiriman Kontainer 40ft Dry"}</td>
                              <td className="p-1 text-right">Rp 12.000.000</td>
                            </tr>
                            <tr className="font-medium text-slate-700">
                              <td className="p-1">{isEn ? "Highway Toll Surcharge" : "Surcharge Toll & Manifest Handling"}</td>
                              <td className="p-1 text-right">Rp 450.000</td>
                            </tr>
                            <tr className="font-bold text-slate-900 border-t border-slate-200 bg-slate-50">
                              <td className="p-1">{isEn ? "Grand Total (VAT Included):" : "Grand Total Tagihan (PPN 11% inc):"}</td>
                              <td className="p-1 text-right">Rp 13.819.500</td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="bg-emerald-50 border border-emerald-100 p-1.5 rounded-lg text-[7.5px] text-emerald-800 flex items-center gap-1 font-bold leading-normal">
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>{isEn ? "Invoice compiled successfully. Accounts Receivable and General Ledger logs updated!" : "Sukses. Jurnal AR & Buku Besar Keuangan diposting otomatis!"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center flex-1 py-10 text-slate-500">
                        <FileCheck className="w-12 h-12 text-slate-400 stroke-1 mb-2 animate-bounce" />
                        <p className="text-xs font-semibold leading-relaxed">
                          {isEn ? "Click 'Generate E-Invoice' to compose the client tax invoice draft automatically from operational records." : 'Klik "Cetak E-Invoice" untuk me-review dokumen tagihan digital yang terbuat otomatis.'}
                        </p>
                      </div>
                    )}

                    <div className="border-t border-slate-200/80 pt-3 text-[9px] text-slate-400 font-black tracking-wider uppercase font-mono mt-4">
                      {isEn ? "*Eliminates invoicing delays and disputes caused by missing delivery documents." : "*Mencegah hilangnya invoice atau tagihan terlambat dikirim ke klien korporat."}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}

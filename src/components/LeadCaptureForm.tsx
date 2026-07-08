import React, { useState } from "react";
import { Check, ClipboardList, ShieldCheck, Mail, Phone, Building, Briefcase, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { addInquiry } from "../lib/storage";
import { getStoredUtmParams } from "../lib/tracking";

interface LeadCaptureFormProps {
  lang: 'id' | 'en';
}

export default function LeadCaptureForm({ lang }: LeadCaptureFormProps) {
  const isEn = lang === 'en';

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    email: "",
    phone: "",
    companyType: "forwarder",
    shipmentVolume: "500-1000",
    currentSystem: "Excel & WhatsApp",
    biggestPain: "pod",
    interestedPackage: "operations",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [qualification, setQualification] = useState<"high" | "medium" | "standard">("standard");
  const [newInquiryId, setNewInquiryId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify fields
    if (!formData.name || !formData.company || !formData.email || !formData.phone) {
      alert(isEn ? "Please complete all required fields." : "Harap lengkapi semua field yang wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    // Apply Qualification Rules from Blueprint Section 11
    let priority: "high" | "medium" | "standard" = "standard";
    if (formData.shipmentVolume === "1000+" || (formData.biggestPain === "pod" && formData.shipmentVolume === "500-1000")) {
      priority = "high";
    } else if (
      formData.biggestPain === "tracking" || 
      formData.biggestPain === "margin" || 
      formData.biggestPain === "warehouse" || 
      formData.shipmentVolume === "500-1000"
    ) {
      priority = "medium";
    }

    setQualification(priority);

    // Retrieve active UTM tracking parameters
    const utm = getStoredUtmParams();

    setTimeout(() => {
      // Save to local persistent storage database with active language context and UTM attributes
      const newInq = addInquiry({
        name: formData.name,
        company: formData.company,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        companyType: formData.companyType,
        shipmentVolume: formData.shipmentVolume,
        biggestPain: formData.biggestPain,
        lang: lang,
        utmSource: utm.utmSource || undefined,
        utmMedium: utm.utmMedium || undefined,
        utmCampaign: utm.utmCampaign || undefined,
        utmTerm: utm.utmTerm || undefined,
        utmContent: utm.utmContent || undefined
      });
      setNewInquiryId(newInq.id);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section
      className="py-20 md:py-28 bg-[#eef2f6] relative"
      id="audit-form"
    >
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col gap-5 text-left">
            <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-teal uppercase">
              {isEn ? "System Evaluation Program" : "Program Evaluasi Sistem"}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              {isEn ? (
                <>Register for a Free <span className="text-brand-teal font-extrabold">System Audit</span></>
              ) : (
                <>Daftarkan Audit Sistem <span className="text-brand-teal font-extrabold">Logistik Gratis</span></>
              )}
            </h2>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">
              {isEn ? (
                <>Get a comprehensive end-to-end workflow analysis from <strong className="text-slate-800 font-bold">RFQ to Billing</strong> (valued at Rp 5,000,000) for free with CargoGrid's Senior Logistics Consultants.</>
              ) : (
                <>Dapatkan analisis komprehensif alur kerja dari <strong className="text-slate-800 font-bold">RFQ hingga Billing</strong> gratis senilai Rp 5.000.000 bersama Konsultan Logistik Senior CargoGrid.</>
              )}
            </p>

            {/* Bullet benefits */}
            <div className="space-y-4 pt-5 border-t border-slate-200/80">
              <div className="flex items-start gap-3.5 text-xs text-slate-600 font-semibold">
                <div className="p-1.5 rounded-lg nm-emboss-sm text-brand-teal flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  {isEn 
                    ? "DSO Leakage Mapping: We pin-point which workflow stages leak your profit margins." 
                    : "Pemetaan DSO Leakage: Kami tunjukkan di modul mana margin Anda bocor."}
                </span>
              </div>
              <div className="flex items-start gap-3.5 text-xs text-slate-600 font-semibold">
                <div className="p-1.5 rounded-lg nm-emboss-sm text-brand-teal flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  {isEn 
                    ? "WMS Readiness Assessment: Evaluate your physical warehouse rack and bin layouts." 
                    : "Checklist Kesiapan WMS: Evaluasi tata letak rack/bin pergudangan Anda."}
                </span>
              </div>
              <div className="flex items-start gap-3.5 text-xs text-slate-600 font-semibold">
                <div className="p-1.5 rounded-lg nm-emboss-sm text-brand-teal flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  {isEn 
                    ? "Branded Portal Preview: Interactive mockup tracking portal built with your logo." 
                    : "Demo Branded Tracking: Mockup halaman pelacakan khusus berlogo brand Anda."}
                </span>
              </div>
            </div>

            <div className="nm-emboss p-4.5 rounded-2xl bg-white/40 font-mono text-[11px] text-slate-600 mt-2">
              <span className="font-black text-slate-800 block uppercase tracking-wider mb-1">
                {isEn ? "Fast-Track Onboarding Route:" : "Jalur Onboarding Cepat:"}
              </span>
              {isEn 
                ? "Estimated audit process and live system pilot delivered within 14 working days." 
                : "Estimasi proses audit dan live pilot dalam waktu 14 hari kerja."}
            </div>
          </div>

          {/* Right Lead Capture Form Column */}
          <div className="lg:col-span-7">
            
            <div className="nm-emboss rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-[#eef2f6]/40">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-teal to-emerald-400" />
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    id="lead-capture-form"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-black font-mono">
                          {isEn ? "Full Name*" : "Nama Lengkap*"}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isEn ? "e.g., John Doe" : "Contoh: Budi Santoso"}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full nm-input rounded-xl px-4 py-3.5 text-xs focus:outline-none transition-all bg-white"
                        />
                      </div>
                      {/* Company */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-black font-mono">
                          {isEn ? "Company Name*" : "Nama Perusahaan*"}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isEn ? "e.g., Acme Logistics" : "Contoh: PT Sinar Logistics"}
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full nm-input rounded-xl px-4 py-3.5 text-xs focus:outline-none transition-all bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Role */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-black font-mono">
                          {isEn ? "Job Title / Role*" : "Jabatan / Role*"}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isEn ? "e.g., Operations Director" : "Contoh: Operations Director"}
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full nm-input rounded-xl px-4 py-3.5 text-xs focus:outline-none transition-all bg-white"
                        />
                      </div>
                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-black font-mono">
                          {isEn ? "Work Email*" : "Email Kantor*"}
                        </label>
                        <input
                          type="email"
                          required
                          placeholder={isEn ? "e.g., john@company.com" : "Contoh: budi@company.com"}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full nm-input rounded-xl px-4 py-3.5 text-xs focus:outline-none transition-all bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone WhatsApp */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-black font-mono">
                          {isEn ? "WhatsApp Number*" : "No. WhatsApp Aktif*"}
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder={isEn ? "e.g., +62812345678" : "Contoh: 081234567890"}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full nm-input rounded-xl px-4 py-3.5 text-xs focus:outline-none transition-all font-mono bg-white"
                        />
                      </div>
                      {/* Company Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-black font-mono">
                          {isEn ? "Logistics Sector*" : "Sektor Bisnis Logistik*"}
                        </label>
                        <select
                          value={formData.companyType}
                          onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                          className="w-full nm-input rounded-xl px-4 py-3.5 text-xs focus:outline-none transition-all cursor-pointer text-slate-800 bg-white"
                        >
                          <option value="forwarder" className="text-slate-800">Freight Forwarding</option>
                          <option value="3pl" className="text-slate-800">3PL Warehouse</option>
                          <option value="trucking" className="text-slate-800">Trucking Company</option>
                          <option value="inhouse" className="text-slate-800">In-house Logistics (Shipper)</option>
                          <option value="other" className="text-slate-800">{isEn ? "Other" : "Lainnya"}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Volume */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-black font-mono">
                          {isEn ? "Monthly Shipment Volume*" : "Volume Pengiriman / Bulan*"}
                        </label>
                        <select
                          value={formData.shipmentVolume}
                          onChange={(e) => setFormData({ ...formData, shipmentVolume: e.target.value })}
                          className="w-full nm-input rounded-xl px-4 py-3.5 text-xs focus:outline-none transition-all cursor-pointer text-slate-800 bg-white"
                        >
                          <option value="<100" className="text-slate-800">{isEn ? "< 100 shipments/month" : "< 100 shipment/bulan"}</option>
                          <option value="100-500" className="text-slate-800">{isEn ? "100 - 500 shipments/month" : "100 - 500 shipment/bulan"}</option>
                          <option value="500-1000" className="text-slate-800">{isEn ? "500 - 1,000 shipments/month" : "500 - 1.000 shipment/bulan"}</option>
                          <option value="1000+" className="text-slate-800">{isEn ? "> 1,000 shipments/month" : "> 1.000 shipment/bulan"}</option>
                        </select>
                      </div>
                      {/* Pain */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-black font-mono">
                          {isEn ? "Biggest Current Pain Point*" : "Tantangan Terbesar Saat Ini*"}
                        </label>
                        <select
                          value={formData.biggestPain}
                          onChange={(e) => setFormData({ ...formData, biggestPain: e.target.value })}
                          className="w-full nm-input rounded-xl px-4 py-3.5 text-xs focus:outline-none transition-all cursor-pointer text-slate-800 bg-white"
                        >
                          <option value="rfq" className="text-slate-800">
                            {isEn ? "Slow RFQ & scattered pricing sheets" : "RFQ lambat & rate tersebar"}
                          </option>
                          <option value="tracking" className="text-slate-800">
                            {isEn ? "Incessant tracking inquiries from clients" : "Update status tracking ke customer"}
                          </option>
                          <option value="pod" className="text-slate-800">
                            {isEn ? "Delayed & misplaced Proof of Delivery (POD)" : "Bukti POD terlambat & tercecer"}
                          </option>
                          <option value="warehouse" className="text-slate-800">
                            {isEn ? "Inaccurate warehouse stock & storage bills" : "Stok gudang tidak akurat"}
                          </option>
                          <option value="billing" className="text-slate-800">
                            {isEn ? "Invoicing blockages & billing validation" : "Keuangan & Invoice bermasalah"}
                          </option>
                          <option value="margin" className="text-slate-800">
                            {isEn ? "Opaque profit margin per job (AP/AR gaps)" : "Margin keuntungan per job gelap"}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full nm-btn-accent text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2 disabled:opacity-50 border-0"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{isEn ? "Analyzing Your System Eligibility..." : "Menganalisis Kualifikasi Sistem Anda..."}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-white" />
                          <span>{isEn ? "Register Audit & Apply for Pilot" : "Daftar Audit & Ajukan Pilot Projek"}</span>
                        </>
                      )}
                    </motion.button>

                    <p className="text-[10px] text-slate-500 text-center font-bold font-mono mt-2">
                      {isEn 
                        ? "*Your data is securely encrypted. We never share your company details with third parties." 
                        : "*Data Anda dienkripsi aman. Kami tidak membagikan data Anda dengan pihak ketiga."}
                    </p>
                  </motion.form>
                ) : (
                  /* Interactive Success Qualification State output based on Section 11 Rules */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-8 text-center flex flex-col items-center gap-5"
                    id="lead-qualification-results"
                  >
                    <div className="w-16 h-16 rounded-full nm-emboss text-emerald-600 flex items-center justify-center bg-[#eef2f6]">
                      <ShieldCheck className="w-8 h-8" />
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-xl text-slate-900">
                        {isEn ? "Audit Registration Submitted!" : "Daftar Audit Terkirim Sukses!"}
                      </h3>
                      
                      {/* Live calculated qualification notice */}
                      {qualification === "high" ? (
                        <div className="mt-4 nm-emboss bg-emerald-500/[0.04] p-4.5 rounded-2xl max-w-lg mx-auto text-xs text-left">
                          <span className="font-mono font-black text-emerald-600 block uppercase tracking-wider mb-1.5">
                            {isEn ? "Status: High Priority Queue" : "Status: Antrean Prioritas Utama"}
                          </span>
                          <p className="text-slate-700 font-semibold leading-relaxed">
                            {isEn ? (
                              <>Our system has detected your high monthly shipment volume (<strong className="text-slate-900 font-extrabold">{formData.shipmentVolume} shipments/month</strong>) with critical challenge focus on <strong className="text-slate-900 font-extrabold">POD or RFQ</strong>.</>
                            ) : (
                              <>Sistem mendeteksi volume pengiriman Anda yang tinggi (<strong className="text-slate-900 font-extrabold">{formData.shipmentVolume} shipment/bulan</strong>) dengan keluhan utama di bagian <strong className="text-slate-900 font-extrabold">POD atau RFQ</strong>.</>
                            )}
                          </p>
                          <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                            {isEn ? (
                              <>Our senior logistics consultant team will contact you via WhatsApp to <strong className="text-slate-900 font-bold">{formData.phone}</strong> within 15 minutes to confirm your audit consultation schedule.</>
                            ) : (
                              <>Tim konsultan logistik senior kami akan menghubungi Anda via WhatsApp ke nomor <strong className="text-slate-900 font-bold">{formData.phone}</strong> dalam kurun waktu 15 menit untuk konfirmasi jadwal konsultasi.</>
                            )}
                          </p>
                        </div>
                      ) : qualification === "medium" ? (
                        <div className="mt-4 nm-emboss bg-brand-teal/[0.04] p-4.5 rounded-2xl max-w-lg mx-auto text-xs text-left">
                          <span className="font-mono font-black text-brand-teal block uppercase tracking-wider mb-1.5">
                            {isEn ? "Status: Scheduled Queue" : "Status: Antrean Terjadwal"}
                          </span>
                          <p className="text-slate-700 font-semibold leading-relaxed">
                            {isEn ? (
                              <>Thank you. We have allocated your qualification profile data. We will dispatch our custom &quot;Logistics System Checklist&quot; guide tailored to your specific logistics sector.</>
                            ) : (
                              <>Terima kasih. Kami telah mengalokasikan data kualifikasi Anda. Kami akan mengirimkan draf panduan &quot;Checklist Kebutuhan Sistem Logistik&quot; sesuai sektor logistik perusahaan Anda.</>
                            )}
                          </p>
                          <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                            {isEn ? (
                              <>We will confirm our consultation schedule availability in 2 business hours via email to <strong className="text-slate-900 font-bold">{formData.email}</strong>.</>
                            ) : (
                              <>Kami akan mengonfirmasi ketersediaan jadwal konsultasi sistem dalam 2 jam kerja via email ke <strong className="text-slate-900 font-bold">{formData.email}</strong>.</>
                            )}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 nm-emboss bg-white/40 p-4.5 rounded-2xl max-w-lg mx-auto text-xs text-left">
                          <span className="font-mono font-black text-slate-500 block uppercase tracking-wider mb-1.5">
                            {isEn ? "Status: Application Received" : "Status: Pengajuan Diterima"}
                          </span>
                          <p className="text-slate-700 font-semibold leading-relaxed">
                            {isEn ? (
                              <>Thank you for your interest in CargoGrid. Our onboarding partner team has successfully received your system registration form.</>
                            ) : (
                              <>Terima kasih atas minat Anda pada CargoGrid. Tim spesialis onboarding kami telah menerima formulir registrasi sistem Anda.</>
                            )}
                          </p>
                          <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                            {isEn ? (
                              <>A digital guidebook and a custom operational audit calendar link will be sent to your email at <strong className="text-slate-900 font-bold">{formData.email}</strong> within 12 business hours.</>
                            ) : (
                              <>Buku panduan digital dan tautan kalender audit operasional akan dikirimkan ke email <strong className="text-slate-900 font-bold">{formData.email}</strong> dalam waktu 12 jam kerja.</>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-center w-full mt-4">
                      <a
                        href={`#questionnaire?id=${newInquiryId}`}
                        className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-teal text-white font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition-all text-center flex items-center gap-1.5"
                      >
                        <ClipboardList className="w-4 h-4 text-white" />
                        <span>{isEn ? "Complete Detailed Questionnaire &rarr;" : "Lengkapi Kuesioner Detail & Jadwal &rarr;"}</span>
                      </a>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-5 py-3 nm-btn text-slate-600 font-bold rounded-xl text-xs cursor-pointer border-0"
                      >
                        {isEn ? "Input New Data" : "Input Data Baru"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

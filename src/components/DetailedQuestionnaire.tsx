"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getInquiry,
  findInquiryByEmail,
  getQuestionnaireByInquiryId,
  saveQuestionnaireDraft,
  submitQuestionnaire,
  Inquiry,
  Questionnaire
} from "../lib/storage";
import {
  ClipboardList,
  Check,
  Save,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Building2,
  Activity,
  Layers,
  Info,
  Sparkles,
  User,
  ChevronRight,
  RefreshCw
} from "lucide-react";

interface DetailedQuestionnaireProps {
  initialInquiryId?: string;
  onNavigateToAdmin?: () => void;
  lang?: string;
}

export default function DetailedQuestionnaire({ initialInquiryId, onNavigateToAdmin, lang = "id" }: DetailedQuestionnaireProps) {
  // Parse inquiry ID from URL hash or props
  const [inquiryId, setInquiryId] = useState<string>("");
  const [inquiry, setInquiry] = useState<Inquiry | undefined>(undefined);
  const [step, setStep] = useState<number>(1);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Check language dynamically
  const isEn = lang === "en";

  // Questionnaire form states
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [cargoTypes, setCargoTypes] = useState<string[]>([]);
  const [operationScope, setOperationScope] = useState<string>("");
  const [primaryRoutes, setPrimaryRoutes] = useState<string>("");
  const [fleetSize, setFleetSize] = useState<string>("");
  const [vendorCount, setVendorCount] = useState<string>("");

  const [painRfqDetails, setPainRfqDetails] = useState<string>("");
  const [painDispatchDetails, setPainDispatchDetails] = useState<string>("");
  const [painTrackingDetails, setPainTrackingDetails] = useState<string>("");
  const [painBillingDetails, setPainBillingDetails] = useState<string>("");

  const [desiredModules, setDesiredModules] = useState<string[]>([]);
  const [erpSystem, setErpSystem] = useState<string>("None");
  const [customRequirements, setCustomRequirements] = useState<string>("");

  const [preferredSlots, setPreferredSlots] = useState<string[]>([]);
  const [contactNotes, setContactNotes] = useState<string>("");
  const [isInvalidToken, setIsInvalidToken] = useState<boolean>(false);
  const [lookupEmail, setLookupEmail] = useState<string>("");
  const [lookupError, setLookupError] = useState<string>("");

  // New detailed business flow, expected users, and specific request fields
  const [existingCustomerFlow, setExistingCustomerFlow] = useState<string>("");
  const [businessProcessSop, setBusinessProcessSop] = useState<string>("");
  const [totalExpectedUsers, setTotalExpectedUsers] = useState<string>("");
  const [rolesInvolved, setRolesInvolved] = useState<string[]>([]);
  const [topProblemImpact, setTopProblemImpact] = useState<string>("");
  const [specificRequests, setSpecificRequests] = useState<string>("");

  // Resolve which inquiry this page is scoped to (from URL hash or props)
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const hash = window.location.hash;
        let id = initialInquiryId || "";
        if (hash.includes("?id=")) {
          id = hash.split("?id=")[1];
        }

        if (id) {
          setInquiryId(id);
          const inq = await getInquiry(id);
          if (!isMounted) return;
          if (inq) {
            setInquiry(inq);
            setIsInvalidToken(false);
          } else {
            setIsInvalidToken(true);
          }
        } else {
          setIsInvalidToken(true);
        }
      } catch (error) {
        console.error("Failed to load questionnaire access data", error);
        if (isMounted) setIsInvalidToken(true);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [initialInquiryId]);

  // Load existing questionnaire data if draft exists
  useEffect(() => {
    if (inquiryId) {
      const loadQuestionnaire = async () => {
        const q = await getQuestionnaireByInquiryId(inquiryId);
        if (q) {
        setServiceTypes(q.serviceTypes || []);
        setCargoTypes(q.cargoTypes || []);
        setOperationScope(q.operationScope || "");
        setPrimaryRoutes(q.primaryRoutes || "");
        setFleetSize(q.fleetSize || "");
        setVendorCount(q.vendorCount || "");
        setPainRfqDetails(q.painRfqDetails || "");
        setPainDispatchDetails(q.painDispatchDetails || "");
        setPainTrackingDetails(q.painTrackingDetails || "");
        setPainBillingDetails(q.painBillingDetails || "");
        setDesiredModules(q.desiredModules || []);
        setErpSystem(q.erpSystem || "None");
        setCustomRequirements(q.customRequirements || "");
        setPreferredSlots(q.preferredSlots || []);
        setContactNotes(q.contactNotes || "");

        // Load new fields
        setExistingCustomerFlow(q.existingCustomerFlow || "");
        setBusinessProcessSop(q.businessProcessSop || "");
        setTotalExpectedUsers(q.totalExpectedUsers || "");
        setRolesInvolved(q.rolesInvolved || []);
        setTopProblemImpact(q.topProblemImpact || "");
        setSpecificRequests(q.specificRequests || "");

        setStep(q.currentStep || 1);
        setIsDone(!q.isDraft);
      } else {
        // Reset to default
        setServiceTypes([]);
        setCargoTypes([]);
        setOperationScope("");
        setPrimaryRoutes("");
        setFleetSize("");
        setVendorCount("");
        setPainRfqDetails("");
        setPainDispatchDetails("");
        setPainTrackingDetails("");
        setPainBillingDetails("");
        setDesiredModules([]);
        setErpSystem("None");
        setCustomRequirements("");
        setPreferredSlots([]);
        setContactNotes("");

        // Reset new fields
        setExistingCustomerFlow("");
        setBusinessProcessSop("");
        setTotalExpectedUsers("");
        setRolesInvolved([]);
        setTopProblemImpact("");
        setSpecificRequests("");

        setStep(1);
        setIsDone(false);
      }
      };
      loadQuestionnaire().catch((error) => console.error("Failed to load questionnaire", error));
    }
  }, [inquiryId]);

  const handleLookupEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    const trimmed = lookupEmail.trim().toLowerCase();
    try {
      const matched = await findInquiryByEmail(trimmed);
      if (matched) {
        // Update state directly instead of relying on the mount-only id-resolution
        // effect, which never re-runs since the hash already starts with
        // "#questionnaire" and HomeRouter doesn't remount this component.
        setInquiryId(matched.id);
        setInquiry(matched);
        setIsInvalidToken(false);
        window.location.hash = `#questionnaire?id=${matched.id}`;
      } else {
        setLookupError(
          isEn
            ? "This email is not registered as an active CargoGrid partner. Please complete initial registration on the homepage first."
            : "Email tidak terdaftar sebagai mitra aktif CargoGrid. Silakan lengkapi pendaftaran awal pada halaman utama terlebih dahulu."
        );
      }
    } catch (error) {
      console.error("Failed to look up inquiry by email", error);
      setLookupError(
        isEn
          ? "Something went wrong while verifying your email. Please try again."
          : "Terjadi kesalahan saat memverifikasi email Anda. Silakan coba lagi."
      );
    }
  };

  // Build payload
  const getPayload = (): Partial<Questionnaire> => {
    return {
      inquiryId,
      serviceTypes,
      cargoTypes,
      operationScope,
      primaryRoutes,
      fleetSize,
      vendorCount,
      painRfqDetails,
      painDispatchDetails,
      painTrackingDetails,
      painBillingDetails,
      desiredModules,
      erpSystem,
      customRequirements,
      preferredSlots,
      contactNotes,
      // New fields
      existingCustomerFlow,
      businessProcessSop,
      totalExpectedUsers,
      rolesInvolved,
      topProblemImpact,
      specificRequests
    };
  };

  // Handle auto-save / manual draft save
  const handleSaveDraft = async (stepOverride?: number) => {
    if (!inquiryId) return;
    const currentStepNum = stepOverride !== undefined ? stepOverride : step;

    await saveQuestionnaireDraft(inquiryId, {
      ...getPayload(),
      currentStep: currentStepNum
    });

    const now = new Date();
    const timeStr = now.toLocaleTimeString(isEn ? "en-US" : "id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSaveStatus(
      isEn
        ? `Draft automatically saved at ${timeStr}`
        : `Draft otomatis tersimpan pkl ${timeStr}`
    );

    // Clear status toast after 3s
    setTimeout(() => {
      setSaveStatus("");
    }, 4000);
  };

  // Perform draft save when step changes
  const handleNextStep = () => {
    if (step < 4) {
      const next = step + 1;
      setStep(next);
      handleSaveDraft(next);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      const prev = step - 1;
      setStep(prev);
      handleSaveDraft(prev);
    }
  };

  // Final Submit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryId) return;

    setIsSubmitting(true);

    try {
      await submitQuestionnaire(inquiryId, getPayload());
      setIsDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to submit questionnaire", error);
      alert(isEn ? "Unable to submit questionnaire. Please try again." : "Gagal mengirim kuesioner. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper toggle arrays
  const toggleCargo = (type: string) => {
    if (cargoTypes.includes(type)) {
      setCargoTypes(cargoTypes.filter(c => c !== type));
    } else {
      setCargoTypes([...cargoTypes, type]);
    }
  };

  const toggleService = (type: string) => {
    if (serviceTypes.includes(type)) {
      setServiceTypes(serviceTypes.filter(s => s !== type));
    } else {
      setServiceTypes([...serviceTypes, type]);
    }
  };

  const toggleModule = (modId: string) => {
    if (desiredModules.includes(modId)) {
      setDesiredModules(desiredModules.filter(m => m !== modId));
    } else {
      setDesiredModules([...desiredModules, modId]);
    }
  };

  const toggleRole = (roleId: string) => {
    if (rolesInvolved.includes(roleId)) {
      setRolesInvolved(rolesInvolved.filter(r => r !== roleId));
    } else {
      setRolesInvolved([...rolesInvolved, roleId]);
    }
  };

  const toggleSlot = (slot: string) => {
    if (preferredSlots.includes(slot)) {
      setPreferredSlots(preferredSlots.filter(s => s !== slot));
    } else {
      if (preferredSlots.length < 3) {
        setPreferredSlots([...preferredSlots, slot]);
      } else {
        // limit to max 3 slots
        alert(isEn ? "You can select up to 3 preferred time slots." : "Anda dapat memilih maksimal 3 slot waktu preferensi.");
      }
    }
  };

  // Predefined calendar availability slots with bilingual versions
  const AVAILABLE_MEETING_SLOTS = [
    { id: "Senin, 13 Juli 2026 - Pagi (09:00 - 11:00 WIB)", en: "Monday, July 13, 2026 - Morning (09:00 - 11:00 GMT+7)" },
    { id: "Senin, 13 Juli 2026 - Siang (13:30 - 15:30 WIB)", en: "Monday, July 13, 2026 - Afternoon (13:30 - 15:30 GMT+7)" },
    { id: "Selasa, 14 Juli 2026 - Pagi (09:30 - 11:30 WIB)", en: "Tuesday, July 14, 2026 - Morning (09:30 - 11:30 GMT+7)" },
    { id: "Selasa, 14 Juli 2026 - Sore (15:30 - 17:00 WIB)", en: "Tuesday, July 14, 2026 - Late Afternoon (15:30 - 17:00 GMT+7)" },
    { id: "Rabu, 15 Juli 2026 - Pagi (10:00 - 12:00 WIB)", en: "Wednesday, July 15, 2026 - Morning (10:00 - 12:00 GMT+7)" },
    { id: "Rabu, 15 Juli 2026 - Siang (14:00 - 16:00 WIB)", en: "Wednesday, July 15, 2026 - Afternoon (14:00 - 16:00 GMT+7)" },
    { id: "Kamis, 16 Juli 2026 - Pagi (09:00 - 11:00 WIB)", en: "Thursday, July 16, 2026 - Morning (09:00 - 11:00 GMT+7)" },
    { id: "Kamis, 16 Juli 2026 - Siang (13:30 - 15:30 WIB)", en: "Thursday, July 16, 2026 - Afternoon (13:30 - 15:30 GMT+7)" },
    { id: "Jumat, 17 Juli 2026 - Siang (14:00 - 16:00 WIB)", en: "Friday, July 17, 2026 - Afternoon (14:00 - 16:00 GMT+7)" }
  ];

  if (isInvalidToken) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full flex-1 flex flex-col gap-8 relative z-10" id="invalid-token-page">
        <div className="nm-emboss bg-white/75 backdrop-blur-md rounded-3xl p-8 sm:p-10 border-0 flex flex-col gap-6 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-brand-teal rounded-t-3xl" />

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-6 h-6 text-brand-orange" />
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              {isEn ? "Detailed Questionnaire Access" : "Akses Kuesioner Detail"}
            </h1>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              {isEn
                ? "For data security and confidentiality of operational records, this page is only accessible via the unique link sent to your registered business email."
                : "Demi keamanan dan kerahasiaan data operasional perusahaan, halaman kuesioner detail ini hanya dapat diakses melalui tautan unik yang dikirimkan ke email resmi Anda."}
            </p>
          </div>

          <form onSubmit={handleLookupEmail} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="questionnaire-lookup-email" className="text-xs text-slate-500 font-black font-mono uppercase tracking-wider">
                {isEn ? "Verify Your Registered Email" : "Verifikasi Email Terdaftar Anda"}
              </label>
              <input
                id="questionnaire-lookup-email"
                name="lookupEmail"
                autoComplete="email"
                type="email"
                required
                placeholder="nama@perusahaan.com"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                className="w-full nm-input bg-white rounded-xl px-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all text-slate-800 border-0"
              />
            </div>

            {lookupError && (
              <p className="text-[11px] font-bold text-red-500 font-mono leading-relaxed bg-red-50 p-3 rounded-xl">
                ⚠️ {lookupError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-orange to-brand-teal text-white font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer border-0"
            >
              {isEn ? "Verify & Enter Questionnaire \u2192" : "Verifikasi & Masuk Kuesioner \u2192"}
            </button>
          </form>

          <div className="border-t border-slate-200/60 pt-4 text-center">
            <a href="#" className="text-xs text-slate-500 hover:text-brand-teal font-extrabold transition-colors">
              {isEn ? "\u2190 Back to Home Page" : "\u2190 Kembali ke Landing Page"}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex-1 flex flex-col gap-8 relative z-10" id="detailed-questionnaire-page">

      {/* Main Container */}
      <div className="nm-emboss bg-white/75 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-0 flex flex-col gap-8 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-brand-teal rounded-t-3xl" />

        {/* Top Header info */}
        {inquiry ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 gap-4">
            <div>
              <span className="text-xs font-mono font-black text-brand-orange uppercase tracking-wider block mb-1">
                {isEn ? "Needs & Solutions Detailed Questionnaire" : "Kuesioner Detail Kebutuhan & Solusi"}
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                PT {inquiry.company.replace(/^PT\s+/, "")}
              </h1>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                {isEn ? "Registration ID: " : "ID Registrasi: "}<span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">{inquiry.id}</span> • {isEn ? "System Status: " : "Status Sistem: "}<strong className="text-brand-teal">{inquiry.status}</strong>
              </p>
            </div>

            <div className="nm-deboss bg-slate-100/50 p-4 rounded-2xl flex flex-col gap-1 text-xs">
              <span className="font-mono font-black text-slate-400 text-[10px] uppercase tracking-wider">{isEn ? "INITIAL REGISTRATION RECAP" : "REKAP REGISTRASI AWAL"}</span>
              <p className="font-bold text-slate-700">{isEn ? "Contact: " : "Kontak: "}<span className="font-medium text-slate-600">{inquiry.name} ({inquiry.role})</span></p>
              <p className="font-bold text-slate-700">{isEn ? "Volume: " : "Volume: "}<span className="font-medium text-slate-600">{inquiry.shipmentVolume} {isEn ? "shipments/month" : "shipment/bulan"}</span></p>
              <p className="font-bold text-slate-700">{isEn ? "Primary Challenge: " : "Penyebab Utama: "}<span className="font-medium text-red-500 font-semibold">{inquiry.biggestPain === "rfq" ? (isEn ? "Slow RFQ" : "RFQ Lambat") : inquiry.biggestPain === "pod" ? (isEn ? "Late POD" : "POD Terlambat") : inquiry.biggestPain === "warehouse" ? (isEn ? "Stock Count" : "Stok Gudang") : inquiry.biggestPain === "tracking" ? (isEn ? "Tracking Status" : "Tracking Status") : (isEn ? "Finance & Invoicing" : "Finance & Invoicing")}</span></p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <RefreshCw className="w-8 h-8 text-brand-teal animate-spin mx-auto mb-2" />
            <p className="text-slate-500 font-bold text-sm">{isEn ? "Connecting with system registration records..." : "Menghubungkan dengan data registrasi sistem..."}</p>
          </div>
        )}

        {inquiry && !isDone && (
          <>
            {/* Step Progress Tracker */}
            <div className="grid grid-cols-4 gap-2 items-center">
              {[
                { s: 1, title: isEn ? "Operations" : "Operasional", icon: Building2 },
                { s: 2, title: isEn ? "Pain Points" : "Diagnosa Kendala", icon: Activity },
                { s: 3, title: isEn ? "Modules & Integrations" : "Integrasi & Modul", icon: Layers },
                { s: 4, title: isEn ? "Scheduling" : "Preferensi Jadwal", icon: Calendar }
              ].map((item) => {
                const ActiveIcon = item.icon;
                const isActive = step === item.s;
                const isCompleted = step > item.s;

                return (
                  <div key={item.s} className="flex flex-col gap-2">
                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden relative">
                      <div
                        className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                          isCompleted ? "w-full bg-brand-teal" : isActive ? "w-1/2 bg-brand-orange" : "w-0"
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 px-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono transition-colors ${
                        isCompleted
                          ? "bg-brand-teal text-white"
                          : isActive
                            ? "bg-brand-orange text-white ring-4 ring-brand-orange/15"
                            : "bg-slate-200 text-slate-500"
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3" /> : item.s}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold leading-none hidden md:inline truncate ${
                        isActive ? "text-slate-900 font-black" : "text-slate-400"
                      }`}>
                        {item.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Content Wrapper */}
            <form onSubmit={handleSubmitForm} className="space-y-6">

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-brand-teal" />
                        <span>{isEn ? "Category 1: Operational Profile & Logistics Scale" : "Kategori 1: Profil Operasional & Skala Logistik"}</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                        {isEn
                          ? "This information helps us prepare a trial setup that matches your active routes and shipment volume."
                          : "Informasi ini membantu kami menyiapkan konfigurasi uji coba yang sesuai dengan rute aktif dan volume pengiriman Anda."}
                      </p>
                    </div>

                    {/* Service Types Checklist */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                        {isEn ? "Service Type (mode of transport/handling)*" : "Jenis Layanan (moda transportasi/penanganan)*"}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: "Air Freight", en: "Air Freight" },
                          { id: "Sea Freight - FCL", en: "Sea Freight - FCL" },
                          { id: "Sea Freight - LCL", en: "Sea Freight - LCL" },
                          { id: "Trucking - FTL", en: "Trucking - FTL" },
                          { id: "Trucking - LTL", en: "Trucking - LTL" },
                          { id: "Warehousing", en: "Warehousing" },
                          { id: "Last-Mile / Kurir", en: "Last-Mile / Courier" },
                          { id: "Multimodal / Door-to-Door", en: "Multimodal / Door-to-Door" }
                        ].map((svcObj) => {
                          const svc = svcObj.id;
                          const label = isEn ? svcObj.en : svcObj.id;
                          const checked = serviceTypes.includes(svc);
                          return (
                            <button
                              type="button"
                              key={svc}
                              onClick={() => toggleService(svc)}
                              className={`p-3 rounded-xl text-left text-xs font-bold transition-all border-0 cursor-pointer ${
                                checked
                                  ? "nm-emboss-teal"
                                  : "nm-deboss bg-slate-50 text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <div className="flex items-center gap-2 justify-between">
                                <span>{label}</span>
                                {checked && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Commodity Types Checklist */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                        {isEn ? "Commodity Type (goods being shipped)*" : "Jenis Komoditas (barang yang diangkut)*"}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: "General Cargo / Box", en: "General Cargo / Box" },
                          { id: "Bulk Cargo (Curah)", en: "Bulk Cargo (Dry Bulk)" },
                          { id: "Reefer (Suhu Dingin)", en: "Reefer (Cold Chain)" },
                          { id: "Dangerous Goods (B3)", en: "Dangerous Goods (Hazmat)" },
                          { id: "Cairan / Chemical", en: "Liquid / Chemical" },
                          { id: "Oversized / Project Cargo", en: "Oversized / Project Cargo" },
                          { id: "Perishables / FMCG", en: "Perishables / FMCG" },
                          { id: "Livestock", en: "Livestock" }
                        ].map((cargoObj) => {
                          const cargo = cargoObj.id;
                          const label = isEn ? cargoObj.en : cargoObj.id;
                          const checked = cargoTypes.includes(cargo);
                          return (
                            <button
                              type="button"
                              key={cargo}
                              onClick={() => toggleCargo(cargo)}
                              className={`p-3 rounded-xl text-left text-xs font-bold transition-all border-0 cursor-pointer ${
                                checked
                                  ? "nm-emboss-teal"
                                  : "nm-deboss bg-slate-50 text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <div className="flex items-center gap-2 justify-between">
                                <span>{label}</span>
                                {checked && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Operational Scope */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                        {isEn ? "Operational Scope*" : "Cakupan Wilayah Operasional*"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: "domestic", labelId: "Domestik Saja", labelEn: "Domestic Only" },
                          { id: "international", labelId: "Internasional Saja", labelEn: "International Only" },
                          { id: "both", labelId: "Domestik & Internasional", labelEn: "Domestic & International" }
                        ].map((scope) => {
                          const checked = operationScope === scope.id;
                          return (
                            <button
                              type="button"
                              key={scope.id}
                              onClick={() => setOperationScope(scope.id)}
                              className={`p-3 rounded-xl text-left text-xs font-bold transition-all border-0 cursor-pointer ${
                                checked
                                  ? "nm-emboss-teal"
                                  : "nm-deboss bg-slate-50 text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <div className="flex items-center gap-2 justify-between">
                                <span>{isEn ? scope.labelEn : scope.labelId}</span>
                                {checked && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Primary Routes Text */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="primary-routes" className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                        {isEn ? "Dominant Logistics Route / Core Corridors*" : "Rute Logistik Dominan / Koridor Utama*"}
                      </label>
                      <input
                        id="primary-routes"
                        name="primaryRoutes"
                        type="text"
                        required
                        placeholder={isEn ? "Example: Jabodetabek - Surabaya port, or Intra-Sumatra trans-island" : "Contoh: Jabodetabek - Surabaya port, atau Intra-Sumatera trans-island"}
                        value={primaryRoutes}
                        onChange={(e) => setPrimaryRoutes(e.target.value)}
                        className="w-full nm-input bg-white rounded-xl px-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Fleet Size */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "Estimated Active Fleet Size*" : "Perkiraan Jumlah Armada Aktif*"}
                        </label>
                        <select id="detailedquestionnaire-select-1" name="detailedquestionnaire-select-1" aria-label="detailedquestionnaire-select-1"
                          required
                          value={fleetSize}
                          onChange={(e) => setFleetSize(e.target.value)}
                          className="w-full nm-input bg-white rounded-xl px-4 py-3.5 text-xs font-bold focus:outline-none cursor-pointer text-slate-800 border-0"
                        >
                          <option value="">{isEn ? "-- Select Fleet Size --" : "-- Pilih Jumlah Truk/Fleet --"}</option>
                          <option value="<20 unit">{isEn ? "Less than 20 units" : "Kurang dari 20 unit"}</option>
                          <option value="20-50 unit">{isEn ? "20 - 50 fleet units" : "20 - 50 unit armada"}</option>
                          <option value="50-150 unit">{isEn ? "50 - 150 fleet units" : "50 - 150 unit armada"}</option>
                          <option value=">150 unit">{isEn ? "More than 150 fleet units" : "Lebih dari 150 unit armada"}</option>
                          <option value="Tidak mengelola fleet sendiri">{isEn ? "No self-owned fleet (rent from vendors only)" : "Tidak mengelola armada sendiri (hanya sewa vendor)"}</option>
                        </select>
                      </div>

                      {/* Vendor Count */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "Number of Expedition / Subcontract Vendors*" : "Jumlah Vendor Ekspedisi / Subkontrak*"}
                        </label>
                        <select id="detailedquestionnaire-select-2" name="detailedquestionnaire-select-2" aria-label="detailedquestionnaire-select-2"
                          required
                          value={vendorCount}
                          onChange={(e) => setVendorCount(e.target.value)}
                          className="w-full nm-input bg-white rounded-xl px-4 py-3.5 text-xs font-bold focus:outline-none cursor-pointer text-slate-800 border-0"
                        >
                          <option value="">{isEn ? "-- Select Number of Vendors --" : "-- Pilih Jumlah Vendor --"}</option>
                          <option value="<5 vendor">{isEn ? "Less than 5 active vendors" : "Kurang dari 5 vendor aktif"}</option>
                          <option value="5-15 vendor">{isEn ? "5 - 15 active vendors" : "5 - 15 vendor aktif"}</option>
                          <option value="15-40 vendor">{isEn ? "15 - 40 logistics vendors" : "15 - 40 vendor logistik"}</option>
                          <option value=">40 vendor">{isEn ? "More than 40 logistics vendors" : "Lebih dari 40 vendor logistik"}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* Expected Users */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "Estimated Number of Active Users*" : "Perkiraan Jumlah Pengguna Sistem (User)*"}
                        </label>
                        <select id="detailedquestionnaire-select-3" name="detailedquestionnaire-select-3" aria-label="detailedquestionnaire-select-3"
                          required
                          value={totalExpectedUsers}
                          onChange={(e) => setTotalExpectedUsers(e.target.value)}
                          className="w-full nm-input bg-white rounded-xl px-4 py-3.5 text-xs font-bold focus:outline-none cursor-pointer text-slate-800 border-0"
                        >
                          <option value="">{isEn ? "-- Select User Count --" : "-- Pilih Jumlah User --"}</option>
                          <option value="<10 users">{isEn ? "Less than 10 users" : "Kurang dari 10 pengguna"}</option>
                          <option value="10-50 users">{isEn ? "10 - 50 active users" : "10 - 50 pengguna aktif"}</option>
                          <option value="50-100 users">{isEn ? "50 - 100 active users" : "50 - 100 pengguna aktif"}</option>
                          <option value=">100 users">{isEn ? "More than 100 users" : "Lebih dari 100 pengguna"}</option>
                        </select>
                      </div>

                      {/* Expected Roles Header */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "Involved Operational Roles*" : "Role / Peran yang Akan Terlibat*"}
                        </label>
                        <span className="text-[10px] text-slate-400 font-semibold leading-normal mt-0.5">
                          {isEn ? "Select all departments that will interact with CargoGrid." : "Pilih semua departemen yang akan berinteraksi dengan CargoGrid."}
                        </span>
                      </div>
                    </div>

                    {/* Roles Multiselect Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "sales", labelId: "Tim Sales & Komersial", labelEn: "Commercial & Sales" },
                        { id: "ops", labelId: "Tim Dispatcher & Ops", labelEn: "Dispatcher & Operations" },
                        { id: "finance", labelId: "Tim Finance & Billing", labelEn: "Finance & Accounting" },
                        { id: "warehouse", labelId: "Tim Admin Gudang", labelEn: "Warehouse & Inventory" },
                        { id: "driver", labelId: "Supir & Lapangan", labelEn: "Drivers & Fleet Staff" },
                        { id: "management", labelId: "Direksi & Management", labelEn: "Executive & Management" }
                      ].map((role) => {
                        const active = rolesInvolved.includes(role.id);
                        return (
                          <button
                            type="button"
                            key={role.id}
                            onClick={() => toggleRole(role.id)}
                            className={`p-3 rounded-xl text-left text-xs font-bold transition-all border-0 cursor-pointer ${
                              active
                                ? "nm-emboss-orange"
                                : "nm-deboss bg-slate-50 text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2 justify-between">
                              <span>{isEn ? role.labelEn : role.labelId}</span>
                              {active && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-500" />
                        <span>{isEn ? "Category 2: Diagnosis & Field Pain Points Description" : "Kategori 2: Diagnosa & Deskripsi Masalah Lapangan"}</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                        {isEn
                          ? "Describe the current manual workflows that often lead to cost leaks, lack of visibility, or data discrepancies."
                          : "Jelaskan alur kerja manual saat ini yang sering menimbulkan deviasi biaya, hilangnya transparansi, atau ketidaksesuaian data."}
                      </p>
                    </div>

                    {/* RFQ Pain Details */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "1. Commercial & RFQ Pricing Workflow*" : "1. Alur RFQ & Penawaran Harga Sektor Komersial*"}
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">{isEn ? "e.g., WhatsApp, Excel" : "Contoh: WhatsApp, Excel"}</span>
                      </div>
                      <textarea id="detailedquestionnaire-textarea-1" name="detailedquestionnaire-textarea-1" aria-label="detailedquestionnaire-textarea-1"
                        required
                        rows={2}
                        placeholder={isEn ? "How does your sales team negotiate prices with clients? Where is the rate index stored to prevent oversight?" : "Bagaimana tim sales Anda melakukan tawar-menawar harga dengan customer? Di mana daftar rate disimpan agar tidak lupa?"}
                        value={painRfqDetails}
                        onChange={(e) => setPainRfqDetails(e.target.value)}
                        className="w-full nm-input bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all resize-none"
                      />
                    </div>

                    {/* Dispatch Pain Details */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "2. Delivery Order & Driver Manifest Coordination*" : "2. Koordinasi Surat Jalan & Surat Perintah Supir*"}
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">{isEn ? "e.g., manual typing" : "Contoh: Admin ngetik satu-satu"}</span>
                      </div>
                      <textarea id="detailedquestionnaire-textarea-2" name="detailedquestionnaire-textarea-2" aria-label="detailedquestionnaire-textarea-2"
                        required
                        rows={2}
                        placeholder={isEn ? "How does your dispatch admin issue delivery orders? Are there frequent discrepancies in driver travel cash advances?" : "Bagaimana admin dispatch Anda mengeluarkan surat perintah jalan? Apakah uang jalan/kasbon supir sering selisih rekap?"}
                        value={painDispatchDetails}
                        onChange={(e) => setPainDispatchDetails(e.target.value)}
                        className="w-full nm-input bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all resize-none"
                      />
                    </div>

                    {/* Tracking Pain Details */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "3. Real-time Status Updates & Client Communication*" : "3. Update Status Real-time & Komunikasi Ke Customer*"}
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">{isEn ? "e.g., constant customer phone calls" : "Contoh: Customer nanya berkali-kali"}</span>
                      </div>
                      <textarea id="detailedquestionnaire-textarea-3" name="detailedquestionnaire-textarea-3" aria-label="detailedquestionnaire-textarea-3"
                        required
                        rows={2}
                        placeholder={isEn ? "How does your team update clients on truck locations? Do you have to call drivers one by one?" : "Bagaimana tim Anda menginfokan posisi truk saat ini ke customer? Apakah harus telepon supir satu per satu?"}
                        value={painTrackingDetails}
                        onChange={(e) => setPainTrackingDetails(e.target.value)}
                        className="w-full nm-input bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all resize-none"
                      />
                    </div>

                    {/* Invoicing Pain Details */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "4. POD Retrieval & Invoicing/Billing Delays*" : "4. Kendala Serah Terima POD & Proses Invoice/Billing*"}
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">{isEn ? "e.g., lost physical documents, 2-week delays" : "Contoh: Bukti POD nyelip, telat 2 minggu"}</span>
                      </div>
                      <textarea id="detailedquestionnaire-textarea-4" name="detailedquestionnaire-textarea-4" aria-label="detailedquestionnaire-textarea-4"
                        required
                        rows={2}
                        placeholder={isEn ? "What are the primary blockages delaying invoices? How many days does it take on average to retrieve physical PODs from drivers?" : "Apa kendala utama yang membuat invoice telat ditagih? Berapa hari rata-rata surat jalan POD fisik kembali dari supir?"}
                        value={painBillingDetails}
                        onChange={(e) => setPainBillingDetails(e.target.value)}
                        className="w-full nm-input bg-[#ffffff] rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all resize-none"
                      />
                    </div>

                    <div className="border-t border-slate-200/50 pt-4 mt-4 space-y-4">
                      {/* Existing Customer Delivery Flow */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                            {isEn ? "5. Existing End-to-End Customer Delivery Flow*" : "5. Alur Pengiriman & Flow Eksisting Customer (End-to-End)*"}
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">{isEn ? "Step-by-step workflow" : "Alur langkah-demi-langkah"}</span>
                        </div>
                        <textarea id="detailedquestionnaire-textarea-5" name="detailedquestionnaire-textarea-5" aria-label="detailedquestionnaire-textarea-5"
                          required
                          rows={3}
                          placeholder={isEn ? "Explain how order comes in, how you assign trucks, how goods are dispatched, and how customers track/receive invoices." : "Jelaskan urutan proses bisnis mulai dari order masuk, cara penunjukan armada, pengiriman barang, hingga serah terima tagihan invoice."}
                          value={existingCustomerFlow}
                          onChange={(e) => setExistingCustomerFlow(e.target.value)}
                          className="w-full nm-input bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all"
                        />
                      </div>

                      {/* Internal SOP state */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "6. Current Standard Operating Procedure (SOP)*" : "6. Kondisi SOP / Prosedur Operasional Saat Ini*"}
                        </label>
                        <textarea id="detailedquestionnaire-textarea-6" name="detailedquestionnaire-textarea-6" aria-label="detailedquestionnaire-textarea-6"
                          required
                          rows={2}
                          placeholder={isEn ? "Are your operations guided by strict formal SOPs, or mostly semi-formal / spreadsheet and WhatsApp-based?" : "Apakah operasional logistik berjalan dengan SOP tertulis resmi, atau masih semi-formal (bebas menggunakan WhatsApp & Excel)?"}
                          value={businessProcessSop}
                          onChange={(e) => setBusinessProcessSop(e.target.value)}
                          className="w-full nm-input bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all"
                        />
                      </div>

                      {/* Operational or Financial Impact of Biggest Challenge */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                          {isEn ? "7. Operational & Financial Impact of Challenges*" : "7. Dampak Operasional & Finansial dari Kendala Utama*"}
                        </label>
                        <textarea id="detailedquestionnaire-textarea-7" name="detailedquestionnaire-textarea-7" aria-label="detailedquestionnaire-textarea-7"
                          required
                          rows={2}
                          placeholder={isEn ? "What are the biggest consequences of these pain points? (e.g., delayed payments, lost clients, revenue leaks)" : "Apa kerugian terbesar akibat masalah-masalah di atas? (Contoh: cash-flow macet, kehilangan customer, selisih kasbon supir)"}
                          value={topProblemImpact}
                          onChange={(e) => setTopProblemImpact(e.target.value)}
                          className="w-full nm-input bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-brand-orange" />
                        <span>{isEn ? "Category 3: Priority Solutions & Current Tools" : "Kategori 3: Prioritas Solusi & Tools Saat Ini"}</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                        {isEn
                          ? "Select the CargoGrid capabilities you want to prioritize during your trial period, plus any tools you need to connect."
                          : "Pilih kapabilitas CargoGrid yang ingin Anda prioritaskan selama masa uji coba, serta tools lain yang perlu dihubungkan."}
                      </p>
                    </div>

                    {/* Desired Modules Selection */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                        {isEn ? "Priority CargoGrid Capabilities*" : "Kapabilitas CargoGrid Yang Diprioritaskan*"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {[
                          {
                            id: "commercial",
                            title: isEn ? "Commercial (Rate Catalog, Digital RFQ & Logistics CRM)" : "Commercial (Katalog Rate, RFQ Digital & CRM Logistik)",
                            desc: isEn ? "Consolidates all tender quotes and sales deal margin history." : "Menyatukan semua penawaran tender dan histori margin deal sales."
                          },
                          {
                            id: "ops",
                            title: isEn ? "Operations (TMS, Dispatching & Driver Trip Allowances)" : "Operations (TMS, Dispatching & Kasbon Uang Jalan Supir)",
                            desc: isEn ? "Distributes digital routes, monitors vendors, and simplifies driver trip reconciliation." : "Membagikan rute digital, monitoring vendor, dan mempermudah rekap jalan supir."
                          },
                          {
                            id: "tracking",
                            title: isEn ? "Tracking & Visibility (Self-Service Client Tracking Portal)" : "Tracking & Visibility (Portal Live Tracking Mandiri untuk Client)",
                            desc: isEn ? "Dedicated tracking links so clients can verify POD status without calling CS." : "Link tracking khusus sehingga client bisa cek status POD tanpa telepon CS."
                          },
                          {
                            id: "finance",
                            title: isEn ? "Finance & Invoicing (Auto Billing, Reconciliation & Job Margin)" : "Finance & Invoicing (Auto Billing, Rekonsiliasi, Margin Profit per Job)",
                            desc: isEn ? "Automated invoice generation as soon as driver uploads POD photos." : "Penerbitan faktur invoice otomatis saat foto POD diunggah oleh supir."
                          },
                          {
                            id: "warehouse",
                            title: isEn ? "Warehouse Management (Multi-client WMS, Stock Audits & Live Racks)" : "Warehouse Management (Multi-client WMS, Stok Opname, Live Rack)",
                            desc: isEn ? "Barcode tracking, pick-and-pack management, and warehouse capacity monitoring." : "Pelacakan barcode, manajemen pick-and-pack, dan monitoring kapasitas gudang."
                          }
                        ].map((m) => {
                          const checked = desiredModules.includes(m.id);
                          return (
                            <button
                              type="button"
                              key={m.id}
                              onClick={() => toggleModule(m.id)}
                              className={`p-4 rounded-2xl text-left transition-all border-0 cursor-pointer flex flex-col gap-1.5 ${
                                checked
                                  ? "nm-emboss bg-[#eaf0f6] ring-2 ring-brand-teal"
                                  : "nm-emboss bg-white/40"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-black text-slate-900">{m.title}</span>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  checked ? "bg-brand-teal border-brand-teal text-white" : "border-slate-300"
                                }`}>
                                  {checked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{m.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ERP System Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                        {isEn ? "Current Finance / Operations Tools*" : "Tools Keuangan / Operasional Saat Ini*"}
                      </label>
                      <select id="detailedquestionnaire-select-4" name="detailedquestionnaire-select-4" aria-label="detailedquestionnaire-select-4"
                        required
                        value={erpSystem}
                        onChange={(e) => setErpSystem(e.target.value)}
                        className="w-full nm-input bg-white rounded-xl px-4 py-3.5 text-xs font-bold focus:outline-none cursor-pointer text-slate-800 border-0"
                      >
                        <option value="None">{isEn ? "Spreadsheet only" : "Hanya Menggunakan Excel"}</option>
                        <option value="SAP ERP (R3 / HANA / B1)">SAP ERP (R3 / HANA / Business One)</option>
                        <option value="Oracle NetSuite">Oracle NetSuite ERP</option>
                        <option value="Accurate Online">Accurate Online Indonesia</option>
                        <option value="ZOHO Books / Finance">ZOHO Books / Finance Suite</option>
                        <option value="Xero Accounting">Xero Accounting</option>
                        <option value="Lainnya">{isEn ? "Other (Custom ERP System)" : "Lainnya (Sistem ERP Custom)"}</option>
                      </select>
                    </div>

                    {/* Integration Requests */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                        {isEn ? "Custom Workflows or Additional Integration Needs (Optional)" : "Kebutuhan Custom Alur Kerja atau Integrasi Tambahan (Opsional)"}
                      </label>
                      <textarea id="detailedquestionnaire-textarea-8" name="detailedquestionnaire-textarea-8" aria-label="detailedquestionnaire-textarea-8"
                        rows={2}
                        placeholder={isEn ? "Example: Need automatic truck weight data sync with digital bridge scales at the factory..." : "Contoh: Butuh sinkronisasi data truk otomatis dengan timbangan digital jembatan di pabrik..."}
                        value={customRequirements}
                        onChange={(e) => setCustomRequirements(e.target.value)}
                        className="w-full nm-input bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all resize-none"
                      />
                    </div>

                    {/* Specific Custom Requests */}
                    <div className="flex flex-col gap-1.5 pt-2">
                      <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                        {isEn ? "Specific Requests & Special Feature Demands (Optional)" : "Permintaan Spesifik & Kebutuhan Fitur Khusus (Opsional)"}
                      </label>
                      <textarea id="detailedquestionnaire-textarea-9" name="detailedquestionnaire-textarea-9" aria-label="detailedquestionnaire-textarea-9"
                        rows={2}
                        placeholder={isEn ? "Are there any specific modules, hardware integrations, or tailored reports you require?" : "Apakah ada permintaan modul spesifik, integrasi hardware khusus, atau format laporan kustom tertentu yang Anda butuhkan?"}
                        value={specificRequests}
                        onChange={(e) => setSpecificRequests(e.target.value)}
                        className="w-full nm-input bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-brand-teal" />
                        <span>{isEn ? "Category 4: Meeting Preferences & Audit Confirmation" : "Kategori 4: Preferensi Jadwal Pertemuan & Konfirmasi Audit"}</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                        {isEn
                          ? "Select up to 3 available time slots for your video conference audit confirmation session with a CargoGrid Senior Solutions partner."
                          : "Pilih maksimal 3 opsi jadwal ketersediaan waktu Anda untuk agenda teleconference konfirmasi audit bersama Senior Logistics Solutions partner CargoGrid."}
                      </p>
                    </div>

                    {/* Meeting Slots Grid */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider block">
                        {isEn ? "Available Time Slot Options (Choose 1 - 3 Slots)*" : "Pilihan Slot Waktu Ketersediaan (Pilih 1 - 3 Slot)*"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {AVAILABLE_MEETING_SLOTS.map((slot) => {
                          const selected = preferredSlots.includes(slot.id);
                          return (
                            <button
                              type="button"
                              key={slot.id}
                              onClick={() => toggleSlot(slot.id)}
                              className={`p-3 rounded-2xl text-left border-0 cursor-pointer flex flex-col gap-1.5 transition-all ${
                                selected
                                  ? "nm-emboss-orange"
                                  : "nm-emboss bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-mono text-[9px] uppercase font-black text-slate-400">{isEn ? "MEETING SLOT" : "JADWAL AVAILABILITAS"}</span>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  selected ? "bg-white border-white text-brand-orange" : "border-slate-300"
                                }`}>
                                  {selected && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                                </div>
                              </div>
                              <span className="text-[11px] font-extrabold leading-snug">{isEn ? slot.en : slot.id}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact Person / Loop notes */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-700 font-black font-mono uppercase tracking-wider">
                        {isEn ? "Additional Attendance Notes (Who else from your team should be included?)" : "Catatan Kehadiran Tambahan (Siapa saja yang akan dilibatkan?)"}
                      </label>
                      <textarea id="detailedquestionnaire-textarea-10" name="detailedquestionnaire-textarea-10" aria-label="detailedquestionnaire-textarea-10"
                        rows={2}
                        placeholder={isEn ? "Example: Please copy email ryan@company.com on the invite as he manages our IT infrastructure..." : "Contoh: Pertemuan harap melampirkan email ryan@company.com karena dia selaku head of IT infrastructure..."}
                        value={contactNotes}
                        onChange={(e) => setContactNotes(e.target.value)}
                        className="w-full nm-input bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all resize-none"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-brand-teal/[0.04] border border-brand-teal/15 flex gap-3 text-xs text-slate-600 leading-relaxed font-semibold">
                      <Info className="w-5 h-5 text-brand-teal flex-shrink-0" />
                      <div>
                        <strong>{isEn ? "Service Quality Commitment:" : "Komitmen Kualitas Layanan:"}</strong> {isEn ? "Our Senior Advisory team will lock your specifications when you click \"Submit Questionnaire\". We will send a formal calendar invite with a Google Meet link directly to your work email within 1-2 business hours." : "Tim Konsultan Senior kami akan mengunci draf data Anda saat Anda klik tombol \"Kirim Kuesioner\". Kami akan mengirimkan notifikasi persetujuan waktu meeting beserta tautan Google Meet langsung ke email kantor Anda dalam kurun waktu 1-2 jam kerja."}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons Footer inside form */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8 gap-4">
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 font-bold font-mono block">{isEn ? "Draft synchronized with system:" : "Draft disinkronisasi ke sistem:"}</span>
                  <span className="text-emerald-600 text-xs font-black font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{isEn ? "Autosave Active" : "Autosave Aktif"}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-3 rounded-full nm-btn bg-[#eef2f6] text-slate-700 hover:text-slate-900 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border-0"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-500" />
                      <span>{isEn ? "Back" : "Sebelumnya"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSaveDraft()}
                    className="px-5 py-3 rounded-full nm-btn bg-[#eef2f6] text-slate-700 hover:text-slate-900 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border-0"
                    title={isEn ? "Save your temporary progress to LocalStorage" : "Simpan progress sementara Anda ke LocalStorage"}
                  >
                    <Save className="w-4 h-4 text-brand-teal" />
                    <span>{isEn ? "Save Draft" : "Simpan Draft"}</span>
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 rounded-full nm-btn-accent text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border-0"
                    >
                      <span>{isEn ? "Next Step" : "Langkah Selanjutnya"}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || preferredSlots.length === 0}
                      className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-95 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50 border-0"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{isEn ? "Submitting..." : "Mengirim Formulir..."}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isEn ? "Submit Questionnaire" : "Kirim Kuesioner Selesai"}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {saveStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-emerald-600 font-bold font-mono mt-2"
                >
                  {saveStatus}
                </motion.div>
              )}
            </form>
          </>
        )}

        {/* Success Screen */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center flex flex-col items-center gap-6 max-w-xl mx-auto"
            id="questionnaire-success-state"
          >
            <div className="w-20 h-20 rounded-full nm-emboss text-emerald-600 flex items-center justify-center bg-[#eef2f6]/40">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">{isEn ? "Questionnaire Submitted Successfully!" : "Kuesioner Sukses Terkirim!"}</h2>
              <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                {isEn
                  ? `Thank you for completing the details for PT ${inquiry?.company || ""}. The CargoGrid technical advisory team will review your operational profile prior to our scheduled call.`
                  : `Terima kasih telah mengisi kuesioner detail untuk PT ${inquiry?.company || ""}. Tim teknis CargoGrid akan segera meninjau informasi operasional Anda sebelum sesi pertemuan kualifikasi.`}
              </p>
            </div>

            <div className="nm-deboss bg-slate-50 p-5 rounded-2xl w-full text-left text-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <Calendar className="w-4 h-4 text-brand-orange" />
                <span className="font-bold text-slate-800">{isEn ? "Upcoming Meeting Details (Awaiting Confirmation):" : "Detail Pertemuan Mendatang (Menunggu Persetujuan):"}</span>
              </div>
              <p className="text-slate-700 font-semibold leading-relaxed">
                {isEn ? "Your selected slots: " : "Jadwal yang Anda pilih: "} <strong className="text-slate-950 font-black">{preferredSlots.join(isEn ? " or " : " atau ")}</strong>
              </p>
              <p className="text-slate-500 font-medium leading-relaxed">
                {isEn
                  ? "Our lead administrator will confirm your official calendar slot via email invite (with Google Meet) within a maximum of 1-2 business hours."
                  : "Tim admin utama kami akan mengonfirmasi jadwal meeting resmi via undangan email (Google Meet) dalam kurun waktu maksimal 1-2 jam kerja."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center pt-4">
              <button
                onClick={async () => {
                  setIsDone(false);
                  setStep(1);
                  if (inquiryId) {
                    await saveQuestionnaireDraft(inquiryId, { ...getPayload(), isDraft: true, currentStep: 1 });
                  }
                }}
                className="px-5 py-2.5 nm-btn text-slate-600 text-xs font-bold rounded-xl cursor-pointer border-0"
              >
                {isEn ? "Modify / Edit Questionnaire Answers" : "Ubah / Edit Ulang Data Kuesioner"}
              </button>
              {onNavigateToAdmin && (
                <button
                  onClick={onNavigateToAdmin}
                  className="px-5 py-2.5 nm-btn-accent text-white text-xs font-black rounded-xl cursor-pointer border-0 flex items-center gap-1"
                >
                  <span>{isEn ? "Open Admin Portal" : "Buka Portal Admin"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Internal labels mapping duplicate for non-import compatibility
function getSektorLabel(key: string): string {
  const map: Record<string, string> = {
    forwarder: "Freight Forwarding",
    '3pl': "3PL Warehouse",
    trucking: "Trucking Company",
    inhouse: "In-house Logistics (Shipper)",
    courier: "Kurir / Last-Mile Delivery",
    other: "Lainnya"
  };
  return map[key] || key;
}

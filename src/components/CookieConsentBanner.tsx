"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X, Settings2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { getCookieConsent, saveCookieConsent, CookieConsent } from "../lib/tracking";
import { useLanguage } from "./shared/LanguageProvider";

export default function CookieConsentBanner() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const shouldReduceMotion = useReducedMotion();
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Custom states for preferences toggle
  const [prefAnalytics, setPrefAnalytics] = useState(true);
  const [prefMarketing, setPrefMarketing] = useState(true);

  useEffect(() => {
    const savedConsent = getCookieConsent();
    setConsent(savedConsent);
    if (!savedConsent) {
      // Delay slightly for premium UX entrance
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const updated = saveCookieConsent(true, true);
    setConsent(updated);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const updated = saveCookieConsent(false, false);
    setConsent(updated);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const updated = saveCookieConsent(prefAnalytics, prefMarketing);
    setConsent(updated);
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.95 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50 text-left"
        id="cookie-consent-banner"
        role="dialog"
        aria-label={isEn ? "Cookie & Consent Preferences" : "Persetujuan Cookie & Analitik"}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-teal/10 rounded-xl text-brand-teal flex-shrink-0">
            <Cookie className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-black text-sm text-slate-900 flex items-center gap-1.5">
              <span>{isEn ? "Cookie & Consent Preferences" : "Persetujuan Cookie & Analitik"}</span>
            </h4>
            <p className="text-slate-600 text-xs font-semibold leading-relaxed mt-1.5">
              {isEn ? (
                "We use secure cookies to analyze traffic, understand marketing sources, and improve your consultation experience. Choose your privacy comfort level below."
              ) : (
                "Kami menggunakan cookies aman untuk menganalisis lalu lintas situs, memahami sumber marketing, dan mengoptimalkan pengalaman konsultasi Anda. Pilih kenyamanan privasi Anda."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRejectAll}
            aria-label={isEn ? "Dismiss and reject non-essential cookies" : "Tutup dan tolak cookie opsional"}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Toggle preferences view */}
        <AnimatePresence>
          {showPreferences && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100 space-y-3"
            >
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{isEn ? "Necessary Cookies" : "Kuki Fungsional Utama"}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{isEn ? "Required for platform security and state" : "Diperlukan untuk keamanan dan fungsionalitas"}</span>
                </div>
                <div className="px-2 py-1 bg-slate-200 text-slate-600 font-mono text-[9px] font-black rounded uppercase">
                  {isEn ? "Required" : "Wajib"}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{isEn ? "Analytics Tracking" : "Analisis Pengunjung"}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{isEn ? "Allows us to track system performance & page flows" : "Membantu kami memantau performa & alur halaman"}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefAnalytics}
                  aria-label={isEn ? "Analytics Tracking" : "Analisis Pengunjung"}
                  onClick={() => setPrefAnalytics(!prefAnalytics)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${prefAnalytics ? "bg-brand-teal" : "bg-slate-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${prefAnalytics ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{isEn ? "Marketing Source" : "Sumber Marketing"}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{isEn ? "Links marketing source to evaluation submissions" : "Menghubungkan sumber marketing dengan formulir audit"}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefMarketing}
                  aria-label={isEn ? "Marketing Source" : "Sumber Marketing"}
                  onClick={() => setPrefMarketing(!prefMarketing)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${prefMarketing ? "bg-brand-teal" : "bg-slate-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${prefMarketing ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            aria-expanded={showPreferences}
            className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? "Preferences" : "Atur"}</span>
          </button>

          {showPreferences ? (
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-4 py-2 text-xs font-extrabold text-white bg-brand-teal hover:bg-brand-teal-hover transition-all rounded-xl shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-hover"
            >
              {isEn ? "Save Choices" : "Simpan Pilihan"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              >
                {isEn ? "Reject Non-Essential" : "Tolak Opsional"}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-extrabold text-white bg-brand-teal hover:bg-brand-teal-hover transition-all rounded-xl shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-hover"
              >
                {isEn ? "Accept All" : "Setujui Semua"}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

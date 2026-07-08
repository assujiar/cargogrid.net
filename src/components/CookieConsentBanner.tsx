import React, { useState, useEffect } from "react";
import { Shield, Cookie, X, Check, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getCookieConsent, saveCookieConsent, CookieConsent } from "../lib/tracking";

interface CookieConsentBannerProps {
  lang: 'id' | 'en';
}

export default function CookieConsentBanner({ lang }: CookieConsentBannerProps) {
  const isEn = lang === 'en';
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
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50 text-left"
        id="cookie-consent-banner"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-teal/10 rounded-xl text-brand-teal flex-shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-black text-sm text-slate-900 flex items-center gap-1.5">
              <span>{isEn ? "Cookie & Consent Preferences" : "Persetujuan Cookie & Analitik"}</span>
            </h4>
            <p className="text-slate-600 text-xs font-semibold leading-relaxed mt-1.5">
              {isEn ? (
                "We use secure cookies to analyze traffic, capture UTM marketing campaigns, and optimize your system audit experience. Choose your privacy comfort level below."
              ) : (
                "Kami menggunakan cookies aman untuk menganalisis lalu lintas situs, melacak kampanye marketing UTM, dan mengoptimalkan konsultasi audit Anda. Pilih kenyamanan privasi Anda."
              )}
            </p>
          </div>
          <button 
            onClick={handleRejectAll}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle preferences view */}
        <AnimatePresence>
          {showPreferences && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
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
                  onClick={() => setPrefAnalytics(!prefAnalytics)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${prefAnalytics ? "bg-brand-teal" : "bg-slate-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${prefAnalytics ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{isEn ? "Marketing Campaigns" : "Optimasi Marketing (UTM)"}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{isEn ? "Links UTM campaign channels to evaluation submissions" : "Menghubungkan kampanye iklan UTM dengan formulir audit"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPrefMarketing(!prefMarketing)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${prefMarketing ? "bg-brand-teal" : "bg-slate-300"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${prefMarketing ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{isEn ? "Preferences" : "Atur"}</span>
          </button>
          
          {showPreferences ? (
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 text-xs font-extrabold text-white bg-brand-teal hover:bg-brand-teal-hover transition-all rounded-xl shadow-md cursor-pointer"
            >
              {isEn ? "Save Choices" : "Simpan Pilihan"}
            </button>
          ) : (
            <>
              <button
                onClick={handleRejectAll}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              >
                {isEn ? "Reject Non-Essential" : "Tolak Opsional"}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-extrabold text-white bg-brand-teal hover:bg-brand-teal-hover transition-all rounded-xl shadow-md cursor-pointer"
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

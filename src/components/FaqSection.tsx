import React, { useState } from "react";
import { faqList } from "../data";
import { ChevronDown, ChevronUp, HelpCircle, MessageSquareCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FaqSection({ lang = 'id' }: { lang?: 'id' | 'en' }) {
  const [openId, setOpenId] = useState<string | null>("faq1");
  const isEn = lang === 'en';

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      className="py-20 md:py-28 bg-[#eef2f6] relative"
      id="faq"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4 text-left sm:text-center">
          <span className="font-mono text-xs font-extrabold tracking-[0.2em] text-brand-teal uppercase">
            {isEn ? "Questions & Answers" : "Questions & Answers"}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
            Frequently Asked <span className="text-brand-teal font-extrabold">Questions (FAQ)</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed mt-2">
            {isEn ? (
              "Most common questions from business owners, operations managers, and finance teams regarding CargoGrid system implementation."
            ) : (
              "Pertanyaan paling umum dari pemilik perusahaan, manajer operasional, dan divisi keuangan terkait implementasi sistem logistik CargoGrid."
            )}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4" id="faq-accordions-list">
          {faqList.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="nm-emboss bg-white/40 rounded-2xl overflow-hidden transition-all duration-150 border-0"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left font-display font-black text-sm sm:text-base text-slate-800 hover:text-brand-teal transition-colors duration-150 gap-4 cursor-pointer border-0 bg-transparent"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 flex-shrink-0 ${isOpen ? "text-brand-teal" : "text-slate-400"}`} />
                    <span>{isEn ? (faq.questionEn || faq.question) : faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-teal flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {/* Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-slate-200"
                    >
                      <div className="p-5 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed bg-slate-100/40">
                        {isEn ? (faq.answerEn || faq.answer) : faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

        {/* Dynamic objection handler */}
        <div className="mt-12 text-center nm-deboss bg-white/40 p-6 rounded-2xl border-0">
          <p className="text-slate-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 flex-wrap">
            <MessageSquareCode className="w-5 h-5 text-brand-teal" />
            <span>{isEn ? "Have specific operational questions not answered above?" : "Punya pertanyaan operasional khusus yang belum terjawab di atas?"}</span>
            <a
              href="#contact"
              className="text-brand-teal hover:text-brand-orange font-black underline cursor-pointer"
            >
              {isEn ? "Consult with Our Expert Team \u2192" : "Diskusi dengan Tim Ahli Kami \u2192"}
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}

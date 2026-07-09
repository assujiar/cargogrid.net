"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { faqList } from "../../data";
import { useLanguage } from "../shared/LanguageProvider";

export default function FaqAccordion() {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const [openId, setOpenId] = useState<string | null>("faq1");

  const toggleAccordion = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="space-y-4" id="faq-accordions-list">
      {faqList.map((faq) => {
        const isOpen = openId === faq.id;
        const triggerId = `faq-trigger-${faq.id}`;
        const panelId = `faq-panel-${faq.id}`;
        return (
          <div key={faq.id} className="nm-emboss bg-white/40 rounded-2xl overflow-hidden transition-all duration-150 border-0">
            <h3 className="m-0">
              <button
                id={triggerId}
                type="button"
                onClick={() => toggleAccordion(faq.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center justify-between p-5 text-left font-display font-black text-sm sm:text-base text-slate-800 hover:text-brand-teal transition-colors duration-150 gap-4 cursor-pointer border-0 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-inset"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className={`w-5 h-5 flex-shrink-0 ${isOpen ? "text-brand-teal" : "text-slate-400"}`} aria-hidden="true" />
                  <span>{isEn ? faq.questionEn || faq.question : faq.question}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-brand-teal flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
            </h3>

            {/* Always rendered — the answer text lives in server-rendered HTML
                for every question, not just the one currently open. It's
                only ever visually clipped via the grid-rows disclosure
                pattern (see .cg-disclosure-panel in index.css), never
                removed from the DOM or hidden from assistive tech. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`cg-disclosure-panel ${isOpen ? "border-t border-slate-200" : ""}`}
              data-open={isOpen}
            >
              <div className="p-5 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed bg-slate-100/40">
                {isEn ? faq.answerEn || faq.answer : faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

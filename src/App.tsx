/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import ConnectedFlowVisualizer from "./components/ConnectedFlowVisualizer";
import ModulesSection from "./components/ModulesSection";
import IcpSelector from "./components/IcpSelector";
import DelayCalculator from "./components/DelayCalculator";
import LiveDemoSandbox from "./components/LiveDemoSandbox";
import PricingSection from "./components/PricingSection";
import FaqSection from "./components/FaqSection";
import LeadCaptureForm from "./components/LeadCaptureForm";
import Footer from "./components/Footer";
import DetailedQuestionnaire from "./components/DetailedQuestionnaire";
import SuperAdminPortal from "./components/SuperAdminPortal";
import LegalSection from "./components/LegalSection";
import CookieConsentBanner from "./components/CookieConsentBanner";
import { captureUtmParams } from "./lib/tracking";

export default function App() {
  const [hash, setHash] = React.useState("");
  const [lang, setLang] = React.useState<'id' | 'en'>('id');

  React.useEffect(() => {
    setHash(window.location.hash);
    setLang((localStorage.getItem("cargogrid_lang") as 'id' | 'en') || 'id');
  }, []);

  // Capture UTM campaign parameters on initial application mount
  React.useEffect(() => {
    captureUtmParams();
  }, []);

  const handleSetLang = (newLang: 'id' | 'en') => {
    setLang(newLang);
    localStorage.setItem("cargogrid_lang", newLang);
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // SEO, SEM & AI-SEO Optimizations Engine
  React.useEffect(() => {
    const isEn = lang === 'en';
    
    // 1. Set dynamic metadata
    const seoTitle = isEn 
      ? "CargoGrid OS - Integrated Enterprise Logistics Operating System & ERP Software" 
      : "CargoGrid OS - Sistem Operasi Logistik Enterprise Terintegrasi & ERP Software";
      
    const seoDesc = isEn
      ? "CargoGrid OS is an end-to-end integrated logistics operating system and ERP software for Freight Forwarders, 3PL Warehousing, Trucking fleets, and Corporate Shippers. Eliminate physical POD delays, speed up RFQ pricing cycles, and maximize corporate profit margins."
      : "CargoGrid OS adalah sistem operasi logistik terintegrasi dan software ERP end-to-end untuk Freight Forwarder, 3PL Warehouse, armada Trucking, dan Corporate Shipper. Hilangkan keterlambatan surat jalan POD fisik, percepat siklus penawaran RFQ, dan maksimalkan margin profit perusahaan Anda.";
      
    const seoKeywords = isEn
      ? "logistics operating system, enterprise logistics ERP, logistics software, freight forwarding software, warehouse management system, cloud WMS, trucking dispatch dispatcher system, fleet management, electronic proof of delivery, ePOD, logistics billing accounting, container tracking cargo workflow, supply chain management, cargo tracking system"
      : "sistem operasi logistik, ERP logistik enterprise, software logistik indonesia, software freight forwarding, warehouse management system, WMS cloud, sistem dispatch armada truk, manajemen armada, bukti pengiriman elektronik, ePOD, billing akuntansi logistik, pelacakan kontainer, workflow kargo, supply chain management, aplikasi kargo cargo";

    document.title = seoTitle;

    // Helper to update/create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaTag('description', seoDesc);
    updateMetaTag('keywords', seoKeywords);
    updateMetaTag('author', 'CargoGrid Enterprise');
    
    // OpenGraph for LinkedIn/Facebook SEM & Social Sharing
    updateMetaTag('og:title', seoTitle, true);
    updateMetaTag('og:description', seoDesc, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'CargoGrid OS', true);
    updateMetaTag('og:locale', isEn ? 'en_US' : 'id_ID', true);

    // 2. Structured JSON-LD Data for standard spiders and LLM crawlers (AI-SEO / Perplexity Grounding)
    const jsonLdSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "@id": "https://cargogrid.com/#software",
          "name": "CargoGrid OS",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web, iOS, Android, PWA",
          "offers": {
            "@type": "Offer",
            "priceCurrency": "IDR",
            "price": "0"
          },
          "description": seoDesc,
          "browserRequirements": "Requires HTML5 compatible browser"
        },
        {
          "@type": "Organization",
          "@id": "https://cargogrid.com/#organization",
          "name": "CargoGrid OS Indonesia",
          "url": window.location.origin,
          "logo": "https://cargogrid.com/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-21-5088-0000",
            "contactType": "customer service",
            "areaServed": "ID",
            "availableLanguage": ["Indonesian", "English"]
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Sopo Del Tower Lt. 18, Mega Kuningan",
            "addressLocality": "Jakarta Selatan",
            "addressRegion": "DKI Jakarta",
            "postalCode": "12950",
            "addressCountry": "ID"
          }
        },
        {
          "@type": "FAQPage",
          "@id": "https://cargogrid.com/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": isEn ? "What is CargoGrid OS?" : "Apa itu CargoGrid OS?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": isEn 
                  ? "CargoGrid is an all-in-one logistics operating system designed to run modern logistics companies, from CRM, RFQ management, job execution, billing, and accounting, to customer branded portals."
                  : "CargoGrid adalah Operating System logistik all-in-one yang dirancang untuk menjalankan perusahaan logistik modern, mulai dari CRM, pengelolaan RFQ, job execution, billing, akuntansi, hingga portal berlogo khusus."
              }
            },
            {
              "@type": "Question",
              "name": isEn ? "How does CargoGrid accelerate customer billing?" : "Bagaimana CargoGrid mempercepat penagihan?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": isEn
                  ? "By introducing instant mobile electronic Proof of Delivery (e-POD), drivers can submit delivery receipts on the spot, triggering immediate invoicing cycles and reducing outstanding AR by weeks."
                  : "Dengan memperkenalkan Bukti Tanda Terima Elektronik (e-POD) instan, pengemudi dapat langsung mengunggah tanda terima di lokasi, memicu siklus invoice otomatis dan mempercepat cashflow AR Anda."
              }
            }
          ]
        }
      ]
    };

    let schemaScript = document.getElementById('cargogrid-jsonld-schema') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'cargogrid-jsonld-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.text = JSON.stringify(jsonLdSchema);

    // Clean up
    return () => {
      // Keep metadata, but clean up temporary elements if needed
    };
  }, [lang]);

  // Parse active route view
  let view: 'landing' | 'questionnaire' | 'admin' | 'privacy' | 'terms' = 'landing';
  if (hash.startsWith("#admin")) {
    view = 'admin';
  } else if (hash.startsWith("#questionnaire")) {
    view = 'questionnaire';
  } else if (hash.startsWith("#privacy")) {
    view = 'privacy';
  } else if (hash.startsWith("#terms")) {
    view = 'terms';
  }

  return (
    <div className="min-h-screen bg-navy-dark text-slate-800 flex flex-col font-sans selection:bg-brand-teal/20 selection:text-brand-teal-hover relative overflow-hidden" id="cargogrid-root-container">
      {/* Immersive Soft Neumorphic Ambient Highlights */}
      <div className="absolute top-10 left-[10%] w-[500px] h-[500px] bg-white rounded-full blur-[120px] opacity-75 pointer-events-none z-0" />
      <div className="absolute bottom-20 right-[10%] w-[600px] h-[600px] bg-[#d3e0ec] rounded-full blur-[140px] opacity-60 pointer-events-none z-0" />

      {/* Sticky glassmorphic navbar with lang support */}
      <div className="relative z-20">
        <Navbar lang={lang} setLang={handleSetLang} />
      </div>

      {/* Conditional Layout Routing with lang support */}
      {view === 'admin' ? (
        <SuperAdminPortal 
          lang={lang}
          onNavigateToQuestionnaire={(id) => {
            window.location.hash = `#questionnaire?id=${id}`;
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} 
        />
      ) : view === 'questionnaire' ? (
        <DetailedQuestionnaire lang={lang} />
      ) : view === 'privacy' ? (
        <LegalSection lang={lang} defaultTab="privacy" />
      ) : view === 'terms' ? (
        <LegalSection lang={lang} defaultTab="terms" />
      ) : (
        /* Structured SaaS landing page content with lang support */
        <main className="flex-1 relative z-10" id="landing-page-main-flow">
          <HeroSection lang={lang} />
          
          <div id="problem-area">
            <ProblemSection lang={lang} />
          </div>

          <div id="flow-area">
            <ConnectedFlowVisualizer lang={lang} />
          </div>

          <div id="modules-area">
            <ModulesSection lang={lang} />
          </div>

          <div id="use-cases-area">
            <IcpSelector lang={lang} />
          </div>

          <div id="calculator-area">
            <DelayCalculator lang={lang} />
          </div>

          <div id="sandbox-area">
            <LiveDemoSandbox lang={lang} />
          </div>

          <div id="pricing-area">
            <PricingSection lang={lang} />
          </div>

          <div id="faq-area">
            <FaqSection lang={lang} />
          </div>

          <div id="lead-form-area">
            <LeadCaptureForm lang={lang} />
          </div>
        </main>
      )}

      {/* Corporate footer info */}
      <Footer lang={lang} />

      {/* GDPR Cookie Consent & Analytics Disclaimer */}
      <CookieConsentBanner lang={lang} />
    </div>
  );
}


"use client";

import React from "react";
import { MotionConfig } from "motion/react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import CookieConsentBanner from "../CookieConsentBanner";
import PageJourneyNav, { type PublicJourneyView } from "./PageJourneyNav";

interface SiteShellProps {
  children: React.ReactNode;
  /** Which step of the marketing journey this page represents. Omit for pages
   * (legal, admin/questionnaire) that don't participate in the step tracker. */
  view?: PublicJourneyView;
}

export default function SiteShell({ children, view }: SiteShellProps) {
  return (
    // Applies the user's OS-level prefers-reduced-motion preference to every
    // motion/react animation on the page (whileHover, whileInView, etc.)
    // without needing per-component guards.
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-screen bg-navy-dark text-slate-800 flex flex-col font-sans selection:bg-brand-teal/20 selection:text-brand-teal-hover relative overflow-hidden"
        id="cargogrid-root-container"
      >
        {/* Immersive Soft Neumorphic Ambient Highlights */}
        <div className="absolute top-10 left-[10%] w-[500px] h-[500px] bg-white rounded-full blur-[120px] opacity-75 pointer-events-none z-0" />
        <div className="absolute bottom-20 right-[10%] w-[600px] h-[600px] bg-[#d3e0ec] rounded-full blur-[140px] opacity-60 pointer-events-none z-0" />

        <div className="relative z-20">
          <Navbar />
        </div>

        <main className="flex-1 relative z-10 pt-24 sm:pt-28 lg:pt-32" id="page-main-flow">
          {view && <PageJourneyNav view={view} />}
          {children}
        </main>

        <Footer />
        <CookieConsentBanner />
      </div>
    </MotionConfig>
  );
}

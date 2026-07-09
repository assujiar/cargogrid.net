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
        {/* Immersive Soft Neumorphic Ambient Highlights.
            Rendered as radial-gradient glows rather than a CSS filter:blur()
            on a solid circle — visually the same soft, diffuse light patch,
            but the browser never runs an expensive blur convolution pass to
            paint it (a real cost on mobile GPUs at these sizes/radii).
            will-change + translate-z promote each to its own compositor
            layer so it's painted once and never touched again on scroll. */}
        <div
          aria-hidden="true"
          className="absolute top-10 left-[10%] w-[500px] h-[500px] rounded-full opacity-75 pointer-events-none z-0 will-change-transform [transform:translateZ(0)] bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.55)_35%,rgba(255,255,255,0)_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-20 right-[10%] w-[600px] h-[600px] rounded-full opacity-60 pointer-events-none z-0 will-change-transform [transform:translateZ(0)] bg-[radial-gradient(circle,rgba(211,224,236,0.9)_0%,rgba(211,224,236,0.5)_38%,rgba(211,224,236,0)_72%)]"
        />

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

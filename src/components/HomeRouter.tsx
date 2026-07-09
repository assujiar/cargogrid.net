"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import { useLanguage } from "./shared/LanguageProvider";

const SuperAdminPortal = dynamic(() => import("./SuperAdminPortal"), { ssr: false });
const DetailedQuestionnaire = dynamic(() => import("./DetailedQuestionnaire"), { ssr: false });

type HashView = "landing" | "admin" | "questionnaire";

/**
 * Preserves the two hash-based routes that are hardcoded into already-sent
 * customer emails and Supabase's password-reset redirect: `/#admin` and
 * `/#questionnaire?id=<uuid>`. Everything else renders the server-rendered
 * HeroSection that ships in the initial HTML.
 */
export default function HomeRouter() {
  const { lang } = useLanguage();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const handleHashChange = () => {
      setHash(window.location.hash);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  let view: HashView = "landing";
  if (hash.startsWith("#admin")) {
    view = "admin";
  } else if (hash.startsWith("#questionnaire")) {
    view = "questionnaire";
  }

  if (view === "admin") {
    return (
      <SuperAdminPortal
        lang={lang}
        onNavigateToQuestionnaire={(id) => {
          window.location.hash = `#questionnaire?id=${id}`;
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  if (view === "questionnaire") {
    return <DetailedQuestionnaire lang={lang} />;
  }

  return <HeroSection />;
}

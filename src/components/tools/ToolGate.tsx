"use client";

import React, { useEffect, useId, useState } from "react";
import { AlertCircle, ArrowRight, Loader2, Lock } from "lucide-react";
import {
  EMPTY_TOOL_LEAD,
  readStoredLead,
  storeLead,
  validateToolLead,
  type ToolLead,
  type ToolLeadField,
} from "../../lib/toolLead";
import { getAttributionSnapshot } from "../../lib/tracking";
import { useLanguage } from "../shared/LanguageProvider";

/**
 * Contact gate in front of the calculators.
 *
 * Three properties are load-bearing and easy to lose in a refactor:
 *
 * 1. **Only the instrument is gated.** The explanation, the worked examples,
 *    the FAQ and the source register below stay rendered and indexable. The
 *    calculators exist to be found by people searching for how to work
 *    something out, and a page whose entire body sits behind a form is a page
 *    a crawler sees as empty.
 *
 * 2. **Asked once, not once per tool.** A visitor who unlocked the CBM
 *    calculator is not asked again on the truck one. Without that, someone
 *    working through three calculators fills the same form three times and
 *    stops after the first.
 *
 * 3. **The form never blocks on the network.** If the write fails, the visitor
 *    is unlocked anyway and the failure is reported quietly. Losing a lead row
 *    is a bad afternoon; refusing to let someone calculate because our database
 *    is unreachable is a bad reputation.
 */

interface FieldSpec {
  key: ToolLeadField;
  label: string;
  labelEn: string;
  placeholder: string;
  autoComplete: string;
  inputMode?: "text" | "email" | "tel";
}

const FIELDS: FieldSpec[] = [
  {
    key: "name",
    label: "Nama lengkap",
    labelEn: "Full name",
    placeholder: "Budi Santoso",
    autoComplete: "name",
  },
  {
    key: "company",
    label: "Nama perusahaan",
    labelEn: "Company name",
    placeholder: "PT Logistik Nusantara",
    autoComplete: "organization",
  },
  {
    key: "email",
    label: "Email kerja",
    labelEn: "Work email",
    placeholder: "nama@perusahaan.co.id",
    autoComplete: "email",
    inputMode: "email",
  },
  {
    key: "phone",
    label: "Nomor HP",
    labelEn: "Phone number",
    placeholder: "0812 3456 7890",
    autoComplete: "tel",
    inputMode: "tel",
  },
];

export default function ToolGate({
  toolSlug,
  toolTitle,
  toolTitleEn,
  children,
}: {
  toolSlug: string;
  toolTitle: string;
  toolTitleEn: string;
  children: React.ReactNode;
}) {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const formId = useId();

  // Starts locked on both server and client, then unlocks on mount if this
  // browser has already been through the form. Reading localStorage during
  // render would put an unlocked tree in the client and a locked one in the
  // HTML, which React reports as a hydration mismatch.
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [lead, setLead] = useState<ToolLead>(EMPTY_TOOL_LEAD);
  const [errors, setErrors] = useState<Partial<Record<ToolLeadField, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);

  useEffect(() => {
    const stored = readStoredLead();
    if (stored) {
      setLead(stored);
      setUnlocked(true);
    }
    setReady(true);
  }, []);

  function update(key: ToolLeadField, value: string) {
    setLead((current) => ({ ...current, [key]: value }));
    // Clearing the error as they type, rather than on the next submit, means
    // the message disappears the moment it stops being true.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validateToolLead(lead, isEn);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = FIELDS.find((f) => found[f.key]);
      if (first) document.getElementById(`${formId}-${first.key}`)?.focus();
      return;
    }

    setSubmitting(true);
    setSaveWarning(null);

    try {
      const attribution = await getAttributionSnapshot().catch(() => ({}));
      const response = await fetch("/api/tool-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, ...attribution, toolSlug, lang }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { fields?: typeof found } | null;
        if (response.status === 422 && payload?.fields) {
          setErrors(payload.fields);
          setSubmitting(false);
          return;
        }
        setSaveWarning(
          isEn
            ? "Your details weren't saved in our system, but the calculator is ready to use."
            : "Data Anda belum tersimpan di sistem kami, tetapi kalkulator sudah bisa dipakai.",
        );
      }
    } catch {
      setSaveWarning(
        isEn
          ? "Your details weren't saved in our system, but the calculator is ready to use."
          : "Data Anda belum tersimpan di sistem kami, tetapi kalkulator sudah bisa dipakai.",
      );
    }

    storeLead(lead);
    setUnlocked(true);
    setSubmitting(false);
  }

  // Before the stored-lead check runs there is no honest answer to "is this
  // visitor unlocked", so the slot holds its height rather than flashing a form
  // at somebody who filled it in last week.
  if (!ready) {
    return (
      <div className="nm-emboss flex min-h-[18rem] items-center justify-center rounded-3xl bg-[#eef2f6]/60 p-8">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-hidden="true" />
        <span className="sr-only">{isEn ? "Loading" : "Memuat"}</span>
      </div>
    );
  }

  // Once the form is behind them the visitor is here to calculate, so the gate
  // gets out of the way completely: no banner naming them back at themselves,
  // no edit affordance for data they will never look at again. The calculator
  // is the page.
  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <section aria-labelledby={`${formId}-heading`} className="nm-emboss overflow-hidden rounded-3xl bg-[#eef2f6]/60">
      {/* A teal band across the top so the gate reads as a step in the tool, not
          as an error state or an interstitial ad. */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-brand-teal to-brand-teal-accent px-6 py-4 sm:px-8">
        <Lock className="h-4 w-4 flex-shrink-0 text-white/90" aria-hidden="true" />
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/95">
          {isEn ? "Enter your details to unlock the calculator" : "Isi data untuk membuka kalkulator"}
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <h2 id={`${formId}-heading`} className="font-display text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          {isEn ? toolTitleEn : toolTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-[1.75] text-slate-600">
          {isEn
            ? "This calculator is free. We only ask for your contact details once, then every calculator on the Tools page unlocks on this device. The explanation, worked examples, and reference tables below stay readable without filling in anything."
            : "Kalkulator ini gratis. Kami hanya meminta data kontak Anda sekali, lalu seluruh kalkulator di halaman Alat terbuka di perangkat ini. Penjelasan, contoh perhitungan, dan tabel rujukan di bawah tetap bisa dibaca tanpa mengisi apa pun."}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FIELDS.map((field) => {
              const id = `${formId}-${field.key}`;
              const error = errors[field.key];
              return (
                <div key={field.key} className="min-w-0">
                  <label
                    htmlFor={id}
                    className="mb-2 block font-mono text-[10px] font-black uppercase tracking-[0.12em] text-slate-500"
                  >
                    {isEn ? field.labelEn : field.label}
                    <span className="ml-1 text-brand-orange" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id={id}
                    type="text"
                    required
                    value={lead[field.key]}
                    onChange={(event) => update(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`nm-input w-full rounded-xl px-4 py-3 text-sm font-semibold ${
                      error ? "ring-2 ring-brand-orange/60" : ""
                    }`}
                  />
                  {error && (
                    <p
                      id={`${id}-error`}
                      role="alert"
                      className="mt-1.5 flex items-start gap-1.5 text-[11px] font-semibold leading-[1.5] text-brand-orange"
                    >
                      <AlertCircle className="mt-px h-3 w-3 flex-shrink-0" aria-hidden="true" />
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="nm-btn-accent inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {isEn ? "Preparing calculator" : "Menyiapkan kalkulator"}
                </>
              ) : (
                <>
                  {isEn ? "Unlock calculator" : "Buka kalkulator"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          {saveWarning && (
            <p role="status" className="text-[11px] font-semibold leading-[1.6] text-brand-orange">
              {saveWarning}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

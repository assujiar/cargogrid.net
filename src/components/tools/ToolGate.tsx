"use client";

import React, { useEffect, useId, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Lock, PencilLine, ShieldCheck } from "lucide-react";
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
  placeholder: string;
  autoComplete: string;
  inputMode?: "text" | "email" | "tel";
  hint: string;
}

const FIELDS: FieldSpec[] = [
  {
    key: "name",
    label: "Nama lengkap",
    placeholder: "Budi Santoso",
    autoComplete: "name",
    hint: "Nama Anda, supaya kami tahu harus menyapa siapa bila menindaklanjuti.",
  },
  {
    key: "company",
    label: "Nama perusahaan",
    placeholder: "PT Logistik Nusantara",
    autoComplete: "organization",
    hint: "Perusahaan tempat Anda bekerja. Tulis nama perusahaan sendiri bila Anda pemiliknya.",
  },
  {
    key: "email",
    label: "Email kerja",
    placeholder: "nama@perusahaan.co.id",
    autoComplete: "email",
    inputMode: "email",
    hint: "Alamat yang Anda pakai bekerja, bukan email pribadi.",
  },
  {
    key: "phone",
    label: "Nomor HP",
    placeholder: "0812 3456 7890",
    autoComplete: "tel",
    inputMode: "tel",
    hint: "Nomor yang bisa dihubungi lewat WhatsApp.",
  },
];

export default function ToolGate({
  toolSlug,
  toolTitle,
  children,
}: {
  toolSlug: string;
  toolTitle: string;
  children: React.ReactNode;
}) {
  const { lang } = useLanguage();
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
  const [editing, setEditing] = useState(false);

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
    const found = validateToolLead(lead);
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
        setSaveWarning("Data Anda belum tersimpan di sistem kami, tetapi kalkulator sudah bisa dipakai.");
      }
    } catch {
      setSaveWarning("Data Anda belum tersimpan di sistem kami, tetapi kalkulator sudah bisa dipakai.");
    }

    storeLead(lead);
    setUnlocked(true);
    setEditing(false);
    setSubmitting(false);
  }

  // Before the stored-lead check runs there is no honest answer to "is this
  // visitor unlocked", so the slot holds its height rather than flashing a form
  // at somebody who filled it in last week.
  if (!ready) {
    return (
      <div className="nm-emboss flex min-h-[18rem] items-center justify-center rounded-3xl bg-[#eef2f6]/60 p-8">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-hidden="true" />
        <span className="sr-only">Memuat</span>
      </div>
    );
  }

  if (unlocked && !editing) {
    return (
      <div className="flex flex-col gap-4">
        <div className="nm-deboss flex flex-col gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex min-w-0 items-start gap-2.5 text-[12px] leading-[1.6] text-slate-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" />
            <span className="min-w-0">
              Terbuka untuk <strong className="font-bold text-slate-900">{lead.name}</strong>
              {lead.company ? ` (${lead.company})` : ""}. Seluruh kalkulator lain di halaman Alat ikut terbuka.
            </span>
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex min-h-[2.25rem] flex-shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 transition-colors hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
            Ubah data
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <section aria-labelledby={`${formId}-heading`} className="nm-emboss overflow-hidden rounded-3xl bg-[#eef2f6]/60">
      {/* A teal band across the top so the gate reads as a step in the tool, not
          as an error state or an interstitial ad. */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-brand-teal to-brand-teal-accent px-6 py-4 sm:px-8">
        <Lock className="h-4 w-4 flex-shrink-0 text-white/90" aria-hidden="true" />
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/95">
          Isi data untuk membuka kalkulator
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <h2 id={`${formId}-heading`} className="font-display text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          {toolTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-[1.75] text-slate-600">
          Kalkulator ini gratis. Kami hanya meminta data kontak Anda sekali, lalu seluruh kalkulator di halaman Alat
          terbuka di perangkat ini. Penjelasan, contoh perhitungan, dan tabel rujukan di bawah tetap bisa dibaca tanpa
          mengisi apa pun.
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
                    {field.label}
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
                    aria-describedby={error ? `${id}-error` : `${id}-hint`}
                    className={`nm-input w-full rounded-xl px-4 py-3 text-sm font-semibold ${
                      error ? "ring-2 ring-brand-orange/60" : ""
                    }`}
                  />
                  {error ? (
                    <p
                      id={`${id}-error`}
                      role="alert"
                      className="mt-1.5 flex items-start gap-1.5 text-[11px] font-semibold leading-[1.5] text-brand-orange"
                    >
                      <AlertCircle className="mt-px h-3 w-3 flex-shrink-0" aria-hidden="true" />
                      {error}
                    </p>
                  ) : (
                    <p id={`${id}-hint`} className="mt-1.5 text-[11px] leading-[1.5] text-slate-500">
                      {field.hint}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-[11px] leading-[1.6] text-slate-500 sm:max-w-sm">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-teal" aria-hidden="true" />
              Data Anda dipakai untuk menghubungi Anda soal CargoGrid, tidak dijual maupun dibagikan ke pihak lain.
            </p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              {editing && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="nm-btn rounded-full px-5 py-3 text-xs font-extrabold text-slate-600 transition-colors hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="nm-btn-accent inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Menyimpan
                  </>
                ) : (
                  <>
                    Buka kalkulator
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
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

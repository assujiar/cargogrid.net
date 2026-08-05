"use client";

import React, { useId, useState } from "react";

/**
 * Form and result primitives shared by the three calculators.
 *
 * Extracted less for reuse than for consistency of behaviour: number inputs in
 * particular have one subtlety that is easy to get wrong independently three
 * times over. Binding a numeric input straight to state means a user who clears
 * the field to retype it hits an empty string, which coerces to 0, which makes
 * the results flash a garbage value mid-keystroke — and on a field like "free
 * time days" that flash is a wrong date. So the raw text is held locally and
 * only committed upward when it parses.
 */

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-[10px] font-black uppercase tracking-[0.12em] text-slate-500"
    >
      {children}
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: string;
}

export function NumberField({ label, value, onChange, min, max, step = 1, suffix, hint }: NumberFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  const shown = draft ?? String(value);

  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={shown}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            if (next.trim() === "") return;
            const parsed = Number(next);
            if (!Number.isFinite(parsed)) return;
            if (min !== undefined && parsed < min) return;
            if (max !== undefined && parsed > max) return;
            onChange(parsed);
          }}
          onBlur={() => setDraft(null)}
          className={`nm-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold ${suffix ? "pr-12" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold uppercase text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-[11px] leading-[1.5] text-slate-500">{hint}</p>}
    </div>
  );
}

export function DateField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="nm-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
      />
      {hint && <p className="mt-1.5 text-[11px] leading-[1.5] text-slate-500">{hint}</p>}
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center gap-3">
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
            checked ? "bg-brand-teal" : "bg-slate-300"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              checked ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
        <label htmlFor={id} className="cursor-pointer text-[13px] font-semibold leading-snug text-slate-700">
          {label}
        </label>
      </div>
      {hint && <p className="mt-1.5 text-[11px] leading-[1.5] text-slate-500">{hint}</p>}
    </div>
  );
}

export function ToolPanel({ children }: { children: React.ReactNode }) {
  return <section className="nm-emboss rounded-3xl bg-[#eef2f6]/60 p-6 sm:p-8">{children}</section>;
}

export function ResultGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

export function ResultCard({
  label,
  value,
  hint,
  emphasis = false,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
  tone?: "neutral" | "warning";
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        emphasis
          ? tone === "warning"
            ? "nm-emboss-orange bg-brand-orange/5"
            : "nm-emboss-teal bg-brand-teal/5"
          : "nm-deboss"
      }`}
    >
      <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p
        className={`mt-2 font-display text-xl font-black tracking-tight sm:text-2xl ${
          emphasis ? (tone === "warning" ? "text-brand-orange" : "text-brand-teal") : "text-slate-900"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1.5 text-[11px] leading-[1.5] text-slate-500">{hint}</p>}
    </div>
  );
}

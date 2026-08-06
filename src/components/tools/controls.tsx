"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { useLanguage } from "../shared/LanguageProvider";

/**
 * Form and result primitives shared by the four calculators.
 *
 * Extracted less for reuse than for consistency of behaviour. Two decisions
 * here are worth more than the code that implements them:
 *
 * 1. **Numbers are grouped as you type.** A field holding 1500000000 and a
 *    field holding 150000000 look identical at a glance, and the calculators
 *    ask for vehicle prices, annual kilometres and yearly cost lines where
 *    exactly that mistake changes the answer by a factor of ten with nothing
 *    on screen looking wrong. Showing 1.500.000.000 makes the slip visible in
 *    the instant it happens, which is the only moment it is cheap to fix.
 *
 * 2. **Every field can explain itself.** A visitor who has to guess what
 *    "faktor ketersediaan" wants will type something plausible and get a
 *    confident wrong answer. The tooltip is a button rather than a hover
 *    target because most of this traffic arrives on a phone, where hover does
 *    not exist.
 */

/* ------------------------------------------------------------------ tooltip */

/**
 * Click-to-open explanation attached to a field label.
 *
 * Deliberately not a hover tooltip. Hover is unavailable on touch, and these
 * pages are built for people looking something up mid-task, most often on a
 * phone. It closes on Escape, on outside click, and on scroll, so it can never
 * be left stranded over the form.
 */
function Tooltip({ text, label, panelId }: { text: string; label: string; panelId: string }) {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const [open, setOpen] = useState(false);
  const id = panelId;
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={isEn ? `Explanation for ${label}` : `Penjelasan kolom ${label}`}
        className={`relative inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors after:absolute after:-inset-2 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
          open ? "bg-brand-teal/15 text-brand-teal" : "text-slate-400 hover:bg-white/60 hover:text-brand-teal"
        }`}
      >
        <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open && (
        <span
          id={id}
          role="note"
          // Anchored to the left edge of the field rather than centred on the
          // icon: at 360px a centred popover runs off whichever side it opens
          // towards, and the field is always the wider, safer anchor.
          className="nm-emboss absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl bg-[#f2f6fa] p-4 text-left shadow-lg"
        >
          <span className="flex items-start gap-3">
            <span className="flex-1 text-[12px] font-medium leading-[1.7] text-slate-700">{text}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={isEn ? "Close explanation" : "Tutup penjelasan"}
              className="relative -mr-1 -mt-1 rounded-lg p-2 text-slate-400 transition-colors after:absolute after:-inset-1 after:content-[''] hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        </span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------- label */

export function FieldLabel({
  htmlFor,
  children,
  tip,
  tipId,
}: {
  htmlFor: string;
  children: React.ReactNode;
  tip?: string;
  /** Id the panel takes, so the field can point at it with aria-describedby. */
  tipId?: string;
}) {
  return (
    // `relative` sits on the whole label row, not on the icon, so the panel
    // opens flush with the field's own left and right edges and cannot run off
    // a narrow screen whichever side the icon happens to be on.
    <span className="relative mb-2 flex min-h-[1.5rem] items-center gap-1">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] font-black uppercase leading-tight tracking-[0.12em] text-slate-500"
      >
        {children}
      </label>
      {tip && tipId && <Tooltip text={tip} label={String(children)} panelId={tipId} />}
    </span>
  );
}

/* ------------------------------------------------------- number formatting */

/**
 * Indonesian grouping: `.` every three digits, `,` before the decimal tail.
 *
 * Written by hand rather than through Intl.NumberFormat because this runs on
 * every keystroke over a half-typed value. "1500000," is not a number and
 * Intl would either reject it or silently drop the comma the user just typed
 * to start the decimal part.
 */
function group(raw: string): string {
  const [whole, ...rest] = raw.split(",");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return rest.length > 0 ? `${grouped},${rest.join("")}` : grouped;
}

/** Keeps digits and at most one decimal comma; drops grouping dots and everything else. */
function sanitise(input: string): string {
  const cleaned = input.replace(/\./g, "").replace(/[^0-9,]/g, "");
  const first = cleaned.indexOf(",");
  if (first === -1) return cleaned;
  return cleaned.slice(0, first + 1) + cleaned.slice(first + 1).replace(/,/g, "");
}

function toNumber(raw: string): number | null {
  if (raw === "" || raw === ",") return null;
  const parsed = Number(raw.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function toEditable(value: number): string {
  if (!Number.isFinite(value)) return "";
  return group(String(value).replace(".", ","));
}

function countDigits(input: string): number {
  let n = 0;
  for (const char of input) if (char >= "0" && char <= "9") n += 1;
  return n;
}

/** Caret position just after the Nth digit, so grouping dots never move the cursor. */
function caretAfterDigits(formatted: string, digits: number): number {
  if (digits <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    const char = formatted[i];
    if (char >= "0" && char <= "9") {
      seen += 1;
      if (seen === digits) return i + 1;
    }
  }
  return formatted.length;
}

/* --------------------------------------------------------------- number field */

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: string;
  tip?: string;
}

export function NumberField({ label, value, onChange, min, max, step = 1, suffix, hint, tip }: NumberFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);
  const [draft, setDraft] = useState<string | null>(null);

  const shown = draft ?? toEditable(value);

  // Restoring the caret has to happen after React writes the grouped value
  // back into the DOM. Doing it inside onChange would set a position into the
  // string the user typed, which the reformat then invalidates.
  useLayoutEffect(() => {
    if (caretRef.current === null || !inputRef.current) return;
    inputRef.current.setSelectionRange(caretRef.current, caretRef.current);
    caretRef.current = null;
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const element = event.target;
    const typed = element.value;
    const caret = element.selectionStart ?? typed.length;
    const digitsBeforeCaret = countDigits(typed.slice(0, caret));

    const cleaned = sanitise(typed);
    const formatted = group(cleaned);
    caretRef.current = caretAfterDigits(formatted, digitsBeforeCaret);
    setDraft(formatted);

    const parsed = toNumber(cleaned);
    // An empty or half-typed value leaves the model alone. Coercing "" to 0
    // would flash a zeroed result mid-keystroke, and on a field like free-time
    // days that flash is a wrong date on screen.
    if (parsed !== null) onChange(parsed);
  }

  function handleBlur() {
    const parsed = toNumber(sanitise(draft ?? ""));
    setDraft(null);
    if (parsed === null) return;
    // Clamping happens here rather than on every keystroke: rejecting
    // out-of-range values while typing makes it impossible to replace "500"
    // with "20" in a field whose minimum is 100, because "2" is refused.
    let next = parsed;
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;
    if (next !== value) onChange(next);
  }

  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id} tip={tip} tipId={`${id}-tip`}>
        {label}
      </FieldLabel>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={shown}
          step={step}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={[tip ? `${id}-tip` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined}
          className={`nm-input w-full rounded-xl px-4 py-3 text-sm font-semibold tabular-nums ${suffix ? "pr-14" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 max-w-[3.25rem] -translate-y-1/2 truncate text-right font-mono text-[10px] font-bold uppercase text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[11px] leading-[1.55] text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- select */

export function SelectField({
  label,
  value,
  onChange,
  children,
  hint,
  tip,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  hint?: string;
  tip?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`min-w-0 ${className}`}>
      <FieldLabel htmlFor={id} tip={tip} tipId={`${id}-tip`}>
        {label}
      </FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={[tip ? `${id}-tip` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined}
        className="nm-input w-full rounded-xl px-4 py-3 text-sm font-semibold"
      >
        {children}
      </select>
      {hint && <p id={`${id}-hint`} className="mt-2 text-[12px] leading-[1.65] text-slate-500">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------- date */

export function DateField({
  label,
  value,
  onChange,
  hint,
  tip,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  tip?: string;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id} tip={tip} tipId={`${id}-tip`}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={[tip ? `${id}-tip` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined}
        className="nm-input w-full rounded-xl px-4 py-3 text-sm font-semibold"
      />
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-[11px] leading-[1.55] text-slate-500">{hint}</p>}
    </div>
  );
}

/* ----------------------------------------------------------------- toggle */

export function ToggleField({
  label,
  checked,
  onChange,
  hint,
  tip,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
  tip?: string;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      {/* The whole row is the hit area, not just the 44px switch. On a phone
          the label is the larger and more obvious target, and missing a toggle
          twice is enough to make a form feel broken. */}
      <div className="relative flex items-start gap-3">
        <button
          id={id}
          type="button"
          role="switch"
          aria-describedby={tip ? `${id}-tip` : undefined}
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative mt-0.5 h-8 w-14 flex-shrink-0 rounded-full transition-colors after:absolute after:-inset-1.5 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 ${
            checked ? "bg-brand-teal" : "bg-slate-300"
          }`}
        >
          {/* `left-1` is not decoration. Without an explicit left the knob is
              placed at its static position, and the static position of an
              out-of-flow child of a button is the centre of the button, because
              buttons centre their content by default. The knob then started
              28px in and the checked state pushed it clean out of the track.
              Anchoring it to the left edge makes the travel the only thing the
              translate has to express: 24px knob, 4px inset each side, 56px
              track, so a 24px slide lands it flush against the far inset. */}
          <span
            aria-hidden="true"
            className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
        <span className="flex min-w-0 flex-1 items-start gap-1">
          <label htmlFor={id} className="cursor-pointer text-[13px] font-semibold leading-snug text-slate-700">
            {label}
          </label>
          {tip && <Tooltip text={tip} label={label} panelId={`${id}-tip`} />}
        </span>
      </div>
      {hint && <p className="mt-2 text-[11px] leading-[1.55] text-slate-500">{hint}</p>}
    </div>
  );
}

/* ----------------------------------------------------------------- panels */

export function ToolPanel({ children }: { children: React.ReactNode }) {
  return (
    <section className="nm-emboss overflow-hidden rounded-3xl bg-[#eef2f6]/60 p-5 sm:p-7 lg:p-8">{children}</section>
  );
}

export function ResultGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

export function ResultCard({
  label,
  value,
  hint,
  emphasis = false,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
  tone?: "neutral" | "warning";
  icon?: React.ReactNode;
}) {
  return (
    <div
      // Emphasis is a ring plus colour on the light surface, never a solid
      // brand fill: .nm-emboss-teal and .nm-emboss-orange are unlayered rules
      // that set a solid background AND white text, so any Tailwind colour put
      // on the same element is silently discarded. Building emphasis on them
      // printed every headline figure in its own background colour.
      className={`min-w-0 rounded-2xl p-5 ${
        emphasis
          ? tone === "warning"
            ? "nm-emboss bg-white/60 ring-2 ring-brand-orange/35"
            : "nm-emboss bg-white/60 ring-2 ring-brand-teal/35"
          : "nm-deboss"
      }`}
    >
      <p className="flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
        {icon}
        <span className="min-w-0 truncate">{label}</span>
      </p>
      {/* Sized to fit rather than allowed to wrap. A rupiah figure broken
          across two lines reads as two numbers -- "Rp 14.347.1" over "20" is
          worse than a smaller but whole "Rp 14.347.120" -- so the type steps
          down at narrow widths and the value keeps its grouping intact. */}
      <p
        className={`mt-2 font-display text-[1.15rem] font-black leading-tight tracking-tight tabular-nums [overflow-wrap:normal] sm:text-[1.3rem] lg:text-[1.4rem] ${
          emphasis ? (tone === "warning" ? "text-brand-orange" : "text-brand-teal") : "text-slate-900"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1.5 text-[11px] leading-[1.5] text-slate-500">{hint}</p>}
    </div>
  );
}

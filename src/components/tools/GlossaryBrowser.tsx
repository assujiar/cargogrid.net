"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  glossaryAnchor,
  type GlossaryCategory,
  type GlossaryEntry,
} from "../../content/reference/glossary";

const CATEGORY_ORDER: GlossaryCategory[] = [
  "ekspor-impor",
  "pelayaran",
  "gudang",
  "darat",
  "komersial",
  "sistem",
];

/**
 * Filtering happens on the client over a list that is already fully rendered on
 * the server. That ordering matters more than it looks: the whole glossary is
 * in the HTML a crawler receives, so every one of the 131 entries is indexable
 * on its own terms and deep-linkable by anchor. The search box makes the page
 * usable; it is not what makes the page exist.
 */
function matches(entry: GlossaryEntry, needle: string): boolean {
  if (!needle) return true;
  const haystack = `${entry.term} ${entry.expansion || ""} ${entry.definition}`.toLowerCase();
  return haystack.includes(needle);
}

export default function GlossaryBrowser() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<GlossaryCategory | "semua">("semua");

  const needle = query.trim().toLowerCase();

  const groups = useMemo(() => {
    return CATEGORY_ORDER.filter((category) => active === "semua" || active === category)
      .map((category) => ({
        category,
        entries: GLOSSARY.filter((entry) => entry.category === category && matches(entry, needle)),
      }))
      .filter((group) => group.entries.length > 0);
  }, [needle, active]);

  const total = groups.reduce((sum, group) => sum + group.entries.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="nm-emboss rounded-3xl bg-[#eef2f6]/60 p-6 sm:p-7">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari istilah, singkatan, atau kata dalam definisinya"
            aria-label="Cari istilah logistik"
            className="nm-input w-full rounded-xl py-3 pl-11 pr-11 text-sm font-semibold"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2.5 text-slate-400 transition-colors hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("semua")}
            aria-pressed={active === "semua"}
            className={`min-h-[2.25rem] rounded-full px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
              active === "semua" ? "nm-btn-accent" : "nm-btn text-slate-600"
            }`}
          >
            Semua
          </button>
          {CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={`min-h-[2.25rem] rounded-full px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                active === category ? "nm-btn-accent" : "nm-btn text-slate-600"
              }`}
            >
              {GLOSSARY_CATEGORIES[category]}
            </button>
          ))}
        </div>

        <p aria-live="polite" className="mt-4 font-mono text-[11px] font-bold text-slate-500">
          {total} dari {GLOSSARY.length} istilah
        </p>
      </div>

      {total === 0 && (
        <div className="nm-deboss rounded-2xl p-8 text-center">
          <p className="text-[14px] leading-[1.7] text-slate-600">
            Tidak ada istilah yang cocok dengan &ldquo;{query}&rdquo;. Coba kata yang lebih pendek, atau cari lewat
            kategori.
          </p>
        </div>
      )}

      {groups.map((group) => (
        <section key={group.category} aria-labelledby={`kategori-${group.category}`}>
          <h2
            id={`kategori-${group.category}`}
            className="mb-5 flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500"
          >
            {GLOSSARY_CATEGORIES[group.category]}
            <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
            <span className="text-slate-400">{group.entries.length}</span>
          </h2>

          <dl className="grid gap-4 sm:grid-cols-2">
            {group.entries.map((entry) => (
              <div
                key={entry.term}
                id={glossaryAnchor(entry)}
                className="nm-emboss scroll-mt-32 rounded-2xl bg-[#eef2f6]/60 p-5"
              >
                <dt>
                  <a
                    href={`#${glossaryAnchor(entry)}`}
                    className="inline-flex min-h-[1.75rem] items-center font-display text-[15px] font-black text-slate-900 transition-colors hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                  >
                    {entry.term}
                  </a>
                  {entry.expansion && (
                    <span className="mt-1 block text-[12px] font-semibold italic text-slate-500">{entry.expansion}</span>
                  )}
                </dt>
                <dd className="mt-3 text-[13px] leading-[1.75] text-slate-600">{entry.definition}</dd>
                {entry.seeAlso && entry.seeAlso.length > 0 && (
                  <dd className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                      Lihat juga
                    </span>
                    {entry.seeAlso.map((reference) => {
                      const target = GLOSSARY.find((e) => e.term.toLowerCase() === reference.toLowerCase());
                      if (!target) return null;
                      return (
                        <a
                          key={reference}
                          href={`#${glossaryAnchor(target)}`}
                          onClick={() => {
                            // A deep link into a hidden entry would scroll to
                            // nothing. Clearing the filters first guarantees the
                            // target is on the page before the jump happens.
                            setQuery("");
                            setActive("semua");
                          }}
                          className="inline-flex min-h-[1.75rem] items-center rounded-md bg-brand-teal/10 px-2.5 py-1 font-mono text-[10px] font-bold text-brand-teal transition-colors hover:bg-brand-teal/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                        >
                          {reference}
                        </a>
                      );
                    })}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

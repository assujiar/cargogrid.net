import React from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import type { Tool } from "../../content/tools/types";
import { relatedTools } from "../../content/tools";
import { getArticle } from "../../content/articles";
import ArticleBody from "../articles/ArticleBody";
import { ACCENT_CLASSES, ToolBadge, ToolPattern, toolVisual } from "./toolVisuals";

/**
 * Frame shared by every tool page.
 *
 * A server component with a `children` slot for the instrument itself, which is
 * the only interactive part. The consequence is that everything a crawler needs
 *, the H1, the intent list, the explanation, the FAQ, the outbound links , 
 * arrives as server-rendered HTML, and the client bundle covers just the form.
 * That split is the whole point: these pages are built to be found, and a page
 * whose substance only appears after hydration is a page betting on the crawler
 * to run its JavaScript.
 */
export default function ToolShell({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const related = relatedTools(tool);
  const articles = tool.relatedArticles.map(getArticle).filter((a) => a !== undefined);
  const visual = toolVisual(tool.slug);
  const accent = ACCENT_CLASSES[visual.accent];

  return (
    <article className="relative py-12 sm:py-16">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <li>
              <Link href="/" className="inline-flex min-h-[2rem] items-center transition-colors hover:text-brand-teal">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">
              /
            </li>
            <li>
              <Link href="/alat" className="inline-flex min-h-[2rem] items-center transition-colors hover:text-brand-teal">
                Alat
              </Link>
            </li>
          </ol>
        </nav>

        <header className="nm-emboss relative overflow-hidden rounded-3xl bg-[#eef2f6]/70 p-6 sm:p-8 lg:p-10">
          <ToolPattern kind={visual.pattern} accent={visual.accent} className="opacity-70" />
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-4">
              <ToolBadge slug={tool.slug} size="lg" />
              <p className={`font-mono text-[11px] font-black uppercase tracking-[0.16em] ${accent.softText}`}>
                {tool.kind === "kalkulator" ? "Kalkulator gratis" : "Referensi"}
              </p>
            </div>
            <h1 className="mt-6 font-display text-[1.9rem] font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[2.6rem]">
              {tool.title}
            </h1>
            <p className="mt-5 text-[15px] leading-[1.8] text-slate-600 sm:text-lg">{tool.summary}</p>
          </div>
        </header>

        {/* Intent strip. Someone who arrived from a search needs to confirm in
            one glance that this page answers their question -- before they
            scroll past an interface they have not learned yet. */}
        <section aria-labelledby="intent-heading" className="nm-deboss mt-10 rounded-3xl p-6 sm:p-7">
          <h2
            id="intent-heading"
            className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500"
          >
            <Search className="h-3 w-3" aria-hidden="true" />
            Halaman ini menjawab
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {tool.searchIntents.map((intent) => (
              <li key={intent} className="flex items-start gap-2 text-[13px] leading-[1.7] text-slate-700">
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-teal" />
                {intent}
              </li>
            ))}
          </ul>
        </section>

        {/* The instrument. */}
        <div className="mt-10">{children}</div>

        <div className="mt-16 max-w-3xl">
          <ArticleBody blocks={tool.blocks} />
        </div>

        {tool.faq.length > 0 && (
          <section aria-labelledby="faq-heading" className="mt-16 max-w-3xl">
            <h2
              id="faq-heading"
              className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
            >
              Pertanyaan yang sering muncul
            </h2>
            <dl className="mt-8 flex flex-col gap-4">
              {tool.faq.map((item) => (
                <div key={item.q} className="nm-emboss rounded-2xl bg-[#eef2f6]/60 p-6">
                  <dt className="font-display text-base font-bold leading-snug text-slate-900">{item.q}</dt>
                  <dd className="mt-3 text-[14px] leading-[1.8] text-slate-600">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {tool.sources && tool.sources.length > 0 && (
          <section aria-labelledby="sumber-heading" className="mt-16 max-w-3xl">
            <h2
              id="sumber-heading"
              className="mb-5 flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500"
            >
              Dasar rujukan
              <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
            </h2>
            <dl className="flex flex-col gap-3">
              {tool.sources.map((source) => (
                <div key={source.label} className="nm-deboss rounded-2xl p-5">
                  <dt className="font-display text-sm font-bold text-slate-900">{source.label}</dt>
                  <dd className="mt-1.5 text-[13px] leading-[1.75] text-slate-600">{source.detail}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {(related.length > 0 || articles.length > 0) && (
          <section aria-labelledby="lanjut-heading" className="mt-16">
            <h2
              id="lanjut-heading"
              className="mb-7 flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500"
            >
              Lanjut ke
              <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/alat/${item.slug}`}
                  className="nm-emboss group flex h-full flex-col rounded-2xl bg-[#eef2f6]/60 p-5 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                >
                  <span className="mb-3 flex items-center gap-2.5">
                    <ToolBadge slug={item.slug} size="sm" />
                    <span
                      className={`font-mono text-[9px] font-black uppercase tracking-[0.14em] ${ACCENT_CLASSES[toolVisual(item.slug).accent].softText}`}
                    >
                      {item.kind === "kalkulator" ? "Kalkulator" : "Referensi"}
                    </span>
                  </span>
                  <span className="font-display text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-teal">
                    {item.title}
                  </span>
                  <span className="mt-auto pt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-brand-teal">
                    Buka
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}

              {articles.map((item) => (
                <Link
                  key={item.slug}
                  href={`/artikel/${item.slug}`}
                  className="nm-emboss group flex h-full flex-col rounded-2xl bg-[#eef2f6]/60 p-5 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                >
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                    Artikel
                  </span>
                  <span className="mt-2 font-display text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-teal">
                    {item.title}
                  </span>
                  <span className="mt-auto pt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-brand-teal">
                    Baca
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* The one piece of product copy on the page, and it is placed last on
            purpose. Somebody who came to convert centimetres into CBM is not in
            the market for an operating system; interrupting them before they
            have their answer would cost the visit and teach them not to come
            back. */}
        <aside className="nm-emboss mt-16 rounded-3xl bg-[#eef2f6]/70 p-7 sm:p-9">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-brand-teal">CargoGrid OS</p>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-slate-700">
            Alat di halaman ini menjawab satu kiriman. Kalau persoalannya adalah tiga puluh kiriman sekaligus, tenggat
            yang tersebar di kepala beberapa orang, angka yang disalin ulang dari penawaran ke booking ke invoice , 
            yang dibutuhkan bukan kalkulator, melainkan satu tempat penyimpanan yang dipakai bersama.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/solusi"
              className="nm-btn inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-extrabold text-slate-700 transition-colors hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            >
              Lihat sistem &amp; modul
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/kontak"
              className="nm-btn-accent inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Konsultasi gratis
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}

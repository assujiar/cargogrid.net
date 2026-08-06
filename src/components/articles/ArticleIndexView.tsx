"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { articles } from "../../content/articles";
import { ARTICLE_CATEGORIES, readingMinutes, type ArticleCategory } from "../../content/articles/types";
import { formatArticleDate } from "./formatArticleDate";
import ArticleCoverArt from "./ArticleCoverArt";

const CATEGORY_ORDER: ArticleCategory[] = ["operasional", "keuangan", "komersial", "gudang", "sistem"];

/**
 * Insight index.
 *
 * A client component only because of the hover choreography. MotionConfig in
 * SiteShell already respects prefers-reduced-motion, so the whole effect
 * collapses to a static card for anyone who has asked their OS to calm
 * animations down.
 */
export default function ArticleIndexView() {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: articles.filter((a) => a.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <section className="relative py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <p className="mb-4 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-brand-teal">Insight</p>
          <h1 className="font-display text-3xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[2.7rem]">
            Catatan Lapangan Logistik Indonesia
          </h1>
          <p className="mt-6 text-base leading-[1.8] text-slate-600 sm:text-lg">
            Tulisan teknis tentang hal yang jarang masuk brosur: ke mana margin bocor, kenapa POD telat pulang, dan apa
            yang benar benar berubah ketika sebuah proses didigitalkan. Bentuknya sengaja tidak seragam — Catatan
            Lapangan, Checklist Audit, Data Breakdown, Regulatory Explainer, Teardown Kasus, Tanya Jawab, sampai Opini —
            karena tiap masalah logistik punya cara paling jujur untuk dibedah, bukan satu formula yang dipaksakan ke
            semuanya.
          </p>
        </header>

        <div className="mt-16 flex flex-col gap-16">
          {grouped.map((group) => (
            <div key={group.category}>
              <h2 className="mb-7 flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                {ARTICLE_CATEGORIES[group.category]}
                <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
                <span className="text-slate-400">{group.items.length}</span>
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item, index) => (
                  <motion.div
                    key={item.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.25), ease: "easeOut" }}
                  >
                    <Link href={`/artikel/${item.slug}`} className="group block h-full focus:outline-none">
                      <motion.article
                        whileHover={{ y: -6 }}
                        whileFocus={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 320, damping: 24 }}
                        className="nm-emboss flex h-full flex-col overflow-hidden rounded-3xl bg-[#eef2f6]/60 group-focus-visible:ring-2 group-focus-visible:ring-brand-teal"
                      >
                        {/* Cover art shifts hue and scale on hover; the wrapper
                            clips it so the motion reads as a camera push-in
                            rather than the card growing. */}
                        <div className="relative overflow-hidden">
                          <motion.div
                            className="origin-center"
                            whileHover={{ scale: 1.06 }}
                            transition={{ type: "spring", stiffness: 260, damping: 26 }}
                          >
                            <ArticleCoverArt seed={item.slug} />
                          </motion.div>
                          <div className="pointer-events-none absolute inset-0 bg-brand-teal/0 transition-colors duration-300 group-hover:bg-brand-teal/10" />
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10px] font-bold text-slate-500">
                            {/* Genre tag, not another category label: the grid mixes
                                Catatan Lapangan, Checklist Audit, Data Breakdown, and
                                other formats, and the card should say so plainly rather
                                than let every piece read as the same kind of writeup. */}
                            <span className="rounded-full border border-slate-300/70 px-2.5 py-1 uppercase tracking-[0.08em]">
                              {item.format}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              {readingMinutes(item)} menit
                            </span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={item.publishedAt}>{formatArticleDate(item.publishedAt)}</time>
                          </div>

                          <h3 className="font-display text-[17px] font-bold leading-snug tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-brand-teal">
                            {item.title}
                          </h3>

                          <p className="mt-3 flex-1 text-[13px] leading-[1.75] text-slate-600">{item.description}</p>

                          <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] font-black uppercase tracking-[0.12em] text-brand-teal">
                            Baca
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                          </span>

                          {/* Underline wipes in from the left on hover. */}
                          <span
                            aria-hidden="true"
                            className="mt-4 block h-0.5 w-0 rounded-full bg-gradient-to-r from-brand-teal to-emerald-400 transition-all duration-300 ease-out group-hover:w-full"
                          />
                        </div>
                      </motion.article>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

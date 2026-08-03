import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Sparkles } from "lucide-react";
import ArticleBody from "./ArticleBody";
import { ARTICLE_CATEGORIES, readingMinutes, tableOfContents, type Article } from "../../content/articles/types";
import { relatedArticles } from "../../content/articles";
import { formatArticleDate } from "./formatArticleDate";

/**
 * Article page shell. A server component -- the whole page is static prose, so
 * none of it needs to reach the browser as JavaScript.
 *
 * Articles are Indonesian-only, unlike the marketing pages: the search demand
 * this content targets is Indonesian, and translating fifteen long pieces would
 * double the surface without widening the audience.
 */
export default function ArticleView({ article }: { article: Article }) {
  const toc = tableOfContents(article);
  const related = relatedArticles(article);
  const minutes = readingMinutes(article);

  return (
    <article className="py-16 sm:py-20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 transition-colors hover:text-brand-teal"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Semua Artikel
          </Link>
        </nav>

        <header>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
            <span className="rounded-full bg-brand-teal/10 px-3.5 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-brand-teal">
              {ARTICLE_CATEGORIES[article.category]}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {minutes} menit baca
            </span>
            <time
              dateTime={article.updatedAt || article.publishedAt}
              className="font-mono text-[11px] font-bold text-slate-500"
            >
              {formatArticleDate(article.updatedAt || article.publishedAt)}
            </time>
          </div>

          <h1 className="font-display text-3xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[2.6rem]">
            {article.title}
          </h1>

          <p className="mt-6 text-base leading-[1.8] text-slate-600 sm:text-lg">{article.summary}</p>
        </header>

        <section aria-labelledby="poin-utama" className="nm-emboss mt-10 rounded-3xl bg-[#eef2f6]/50 p-6 sm:p-8">
          <h2
            id="poin-utama"
            className="mb-4 flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-brand-teal"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Poin Utama
          </h2>
          <ul className="flex flex-col gap-3">
            {article.takeaways.map((point) => (
              <li key={point} className="flex gap-3 text-[14.5px] leading-[1.75] text-slate-700">
                <span aria-hidden="true" className="mt-[0.62em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {toc.length > 2 && (
          <nav aria-label="Daftar isi" className="mt-8 rounded-2xl border border-slate-300/50 p-6">
            <p className="mb-3.5 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              Daftar Isi
            </p>
            <ol className="flex flex-col gap-2.5">
              {toc.map((item, i) => (
                <li key={item.id} className="flex gap-3 text-sm leading-snug">
                  <span className="font-mono text-[11px] font-black text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a href={`#${item.id}`} className="text-slate-600 transition-colors hover:text-brand-teal">
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="mt-4">
          <ArticleBody blocks={article.blocks} />
        </div>

        {article.faq && article.faq.length > 0 && (
          <section aria-labelledby="tanya-jawab" className="mt-16">
            <h2
              id="tanya-jawab"
              className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl mb-6"
            >
              Pertanyaan yang Sering Muncul
            </h2>
            <div className="flex flex-col gap-4">
              {article.faq.map((item) => (
                <div key={item.q} className="nm-emboss-sm rounded-2xl bg-[#eef2f6]/40 p-6">
                  <h3 className="mb-2.5 font-display text-base font-bold text-slate-900">{item.q}</h3>
                  <p className="text-[14.5px] leading-[1.8] text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <aside className="nm-emboss mt-16 rounded-3xl bg-[#eef2f6]/50 p-8 text-center sm:p-10">
          <h2 className="font-display text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Mau tahu angka ini di operasional Anda sendiri?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[14.5px] leading-[1.75] text-slate-600">
            Audit sistem logistik gratis: kami bantu memetakan alur RFQ, dispatch, POD, dan penagihan Anda saat ini,
            lalu menunjukkan di mana waktunya hilang.
          </p>
          <Link
            href="/kontak"
            className="nm-btn-accent mt-7 inline-flex items-center gap-2 rounded-full border-0 px-8 py-3.5 text-xs font-extrabold text-white transition-all"
          >
            Ajukan Audit Gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>

        {related.length > 0 && (
          <section aria-labelledby="artikel-terkait" className="mt-16">
            <h2
              id="artikel-terkait"
              className="mb-6 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500"
            >
              Bacaan Terkait
            </h2>
            <div className="flex flex-col gap-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/artikel/${item.slug}`}
                  className="nm-emboss-sm group rounded-2xl bg-[#eef2f6]/40 p-6 transition-transform hover:scale-[1.01]"
                >
                  <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-brand-teal">
                    {ARTICLE_CATEGORIES[item.category]}
                  </p>
                  <h3 className="font-display text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-teal">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

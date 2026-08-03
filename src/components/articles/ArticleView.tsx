import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import ArticleBody from "./ArticleBody";
import ArticleCoverArt from "./ArticleCoverArt";
import { LAYOUTS, ACCENT_TEXT, ACCENT_BG } from "./articleLayouts";
import { ARTICLE_CATEGORIES, readingMinutes, tableOfContents, type Article } from "../../content/articles/types";
import { relatedArticles } from "../../content/articles";
import { formatArticleDate } from "./formatArticleDate";

/**
 * Article page shell. A server component: the whole page is static prose, so
 * none of it needs to reach the browser as JavaScript.
 *
 * The visible arrangement comes from the article's own `layout`, resolved
 * through articleLayouts.ts. Fifteen pieces poured through one identical
 * template read as a content farm no matter how good the writing is.
 *
 * Articles are Indonesian only, unlike the marketing pages: the search demand
 * this content targets is Indonesian, and translating fifteen long pieces would
 * double the surface without widening the audience.
 */
export default function ArticleView({ article }: { article: Article }) {
  const spec = LAYOUTS[article.layout];
  const toc = tableOfContents(article);
  const related = relatedArticles(article);
  const minutes = readingMinutes(article);
  const accentText = ACCENT_TEXT[spec.accent];
  const accentBg = ACCENT_BG[spec.accent];

  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className={`rounded-full bg-slate-500/10 px-3.5 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] ${accentText}`}>
        {ARTICLE_CATEGORIES[article.category]}
      </span>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-500">
        <Clock className="h-3.5 w-3.5" />
        {minutes} menit baca
      </span>
      <time dateTime={article.updatedAt || article.publishedAt} className="font-mono text-[11px] font-bold text-slate-500">
        {formatArticleDate(article.updatedAt || article.publishedAt)}
      </time>
    </div>
  );

  const headline = (
    <>
      <p className={`mb-3 font-mono text-[11px] font-black uppercase tracking-[0.18em] ${accentText}`}>{spec.kicker}</p>
      <h1 className={`font-display font-black tracking-tight text-slate-900 ${spec.title}`}>{article.title}</h1>
      <p className={`mt-6 ${spec.summary}`}>{article.summary}</p>
    </>
  );

  const takeawayItems = (
    <ul className="flex flex-col gap-3">
      {article.takeaways.map((point) => (
        <li key={point} className="flex gap-3 text-[14.5px] leading-[1.75] text-slate-700">
          <span aria-hidden="true" className={`mt-[0.62em] h-1.5 w-1.5 flex-shrink-0 rounded-full ${accentBg}`} />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <article className="relative py-14 sm:py-20">
      <div className={`relative z-10 mx-auto ${spec.column} px-4 sm:px-6 lg:px-8`}>
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 transition-colors hover:text-brand-teal"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Insight
          </Link>
        </nav>

        {/* --- Hero, five different shapes --- */}
        <header>
          {spec.hero === "banner" && (
            <div className="nm-emboss mb-9 overflow-hidden rounded-3xl">
              <ArticleCoverArt category={article.category} seed={article.slug} height={230} />
            </div>
          )}

          {spec.hero === "rule" && (
            <div className={`mb-8 h-1.5 w-24 rounded-full ${accentBg}`} />
          )}

          {spec.hero === "split" && (
            <div className="mb-9 grid items-center gap-6 sm:grid-cols-[1fr_190px]">
              <div>{meta}</div>
              <div className="nm-emboss-sm overflow-hidden rounded-2xl">
                <ArticleCoverArt category={article.category} seed={article.slug} height={110} />
              </div>
            </div>
          )}

          {spec.hero !== "split" && <div className="mb-6">{meta}</div>}

          {spec.hero === "panel" ? (
            <div className="nm-emboss rounded-3xl bg-[#eef2f6]/50 p-7 sm:p-10">{headline}</div>
          ) : (
            headline
          )}
        </header>

        {/* --- Key points, three placements --- */}
        {spec.takeaways === "panel" && (
          <section aria-label="Poin utama" className="nm-emboss mt-10 rounded-3xl bg-[#eef2f6]/50 p-6 sm:p-8">
            <p className={`mb-4 font-mono text-[11px] font-black uppercase tracking-[0.14em] ${accentText}`}>
              Poin Utama
            </p>
            {takeawayItems}
          </section>
        )}

        {spec.takeaways === "sidebar-strip" && (
          <section aria-label="Poin utama" className={`mt-10 border-l-4 pl-6 ${accentBg.replace("bg-", "border-")}`}>
            <p className="mb-3 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              Yang Perlu Diingat
            </p>
            {takeawayItems}
          </section>
        )}

        {spec.takeaways === "inline-list" && (
          <section aria-label="Poin utama" className="mt-10 border-y border-slate-300/60 py-7">
            {takeawayItems}
          </section>
        )}

        {/* --- Contents, four treatments --- */}
        {spec.toc === "boxed" && toc.length > 2 && (
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

        {spec.toc === "rail" && toc.length > 2 && (
          <nav aria-label="Daftar isi" className="mt-9 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {toc.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-baseline gap-3 border-t border-slate-300/60 py-2.5 text-sm text-slate-600 transition-colors hover:text-brand-teal"
              >
                <span className={`font-mono text-[11px] font-black ${accentText}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="leading-snug">{item.text}</span>
              </a>
            ))}
          </nav>
        )}

        {spec.toc === "inline" && toc.length > 2 && (
          <nav aria-label="Daftar isi" className="mt-8 flex flex-wrap gap-2">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-full border border-slate-300/70 px-3.5 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:border-brand-teal hover:text-brand-teal"
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}

        <div className="mt-6">
          <ArticleBody blocks={article.blocks} dropCap={spec.dropCap} />
        </div>

        {article.faq && article.faq.length > 0 && (
          <section aria-labelledby="tanya-jawab" className="mt-16">
            <h2 id="tanya-jawab" className="mb-6 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
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
            Audit sistem logistik gratis. Kami bantu memetakan alur RFQ, dispatch, POD, dan penagihan Anda saat ini,
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
            <h2 id="artikel-terkait" className="mb-6 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              Bacaan Terkait
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/artikel/${item.slug}`}
                  className="nm-emboss-sm group overflow-hidden rounded-2xl bg-[#eef2f6]/40 transition-transform hover:scale-[1.02]"
                >
                  <ArticleCoverArt category={item.category} seed={item.slug} height={74} />
                  <div className="p-5">
                    <p className="mb-1.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-brand-teal">
                      {ARTICLE_CATEGORIES[item.category]}
                    </p>
                    <h3 className="font-display text-[14px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-teal">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

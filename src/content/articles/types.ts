/**
 * Article content model.
 *
 * Articles are structured data, not HTML strings: the renderer decides how a
 * heading or a table looks, so all 15 pieces stay visually consistent with the
 * rest of the site and none of them can inject markup. Inline emphasis is the
 * one exception, handled by a deliberately tiny `**bold**` convention that the
 * renderer splits on — see ArticleBody.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; tone: "insight" | "warning" | "example"; title: string; body: string }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "quote"; text: string; attribution?: string };

export interface ArticleFaq {
  q: string;
  a: string;
}

/**
 * Editorial treatment. Fifteen pieces rendered through one template read as a
 * content farm however good the writing is, so each article declares how it
 * wants to be presented: hero shape, column width, type scale, and where the
 * table of contents sits.
 */
export type ArticleLayout = "feature" | "essay" | "brief" | "dossier" | "primer";

export interface Article {
  slug: string;
  layout: ArticleLayout;
  /** H1 and social title. */
  title: string;
  /** Browser/SERP title. Kept separate so it can carry the brand suffix without bloating the H1. */
  metaTitle: string;
  description: string;
  keywords: string[];
  category: ArticleCategory;
  /** Standfirst shown under the H1 and on the index card. */
  summary: string;
  /** Rendered as a "what you'll take away" panel above the body. */
  takeaways: string[];
  publishedAt: string;
  updatedAt?: string;
  blocks: Block[];
  /** Feeds the per-article FAQPage JSON-LD as well as an on-page section. */
  faq?: ArticleFaq[];
  /** Slugs of related pieces. Validated at module load — see index.ts. */
  related: string[];
}

export const ARTICLE_CATEGORIES = {
  operasional: "Operasional",
  keuangan: "Keuangan & Margin",
  komersial: "Komersial & RFQ",
  gudang: "Pergudangan",
  sistem: "Sistem & Implementasi",
} as const;

export type ArticleCategory = keyof typeof ARTICLE_CATEGORIES;

/**
 * Reading time is derived, never stored. A hardcoded number silently becomes a
 * lie the first time someone edits a paragraph, and "8 menit baca" on a piece
 * that takes three is the kind of small dishonesty readers do notice.
 * 200 wpm is the usual estimate for Indonesian prose of this density.
 */
export function readingMinutes(article: Article): number {
  const words = countWords(article);
  return Math.max(1, Math.round(words / 200));
}

export function countWords(article: Article): number {
  const parts: string[] = [article.summary, ...article.takeaways];

  for (const block of article.blocks) {
    switch (block.type) {
      case "p":
      case "h2":
      case "h3":
        parts.push(block.text);
        break;
      case "ul":
      case "ol":
        parts.push(...block.items);
        break;
      case "callout":
        parts.push(block.title, block.body);
        break;
      case "table":
        parts.push(...block.head, ...block.rows.flat());
        if (block.caption) parts.push(block.caption);
        break;
      case "quote":
        parts.push(block.text);
        break;
    }
  }

  for (const item of article.faq || []) parts.push(item.q, item.a);

  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

/** Section headings, used to build the in-page table of contents. */
export function tableOfContents(article: Article): { id: string; text: string }[] {
  return article.blocks
    .filter((block): block is Extract<Block, { type: "h2" }> => block.type === "h2")
    .map(({ id, text }) => ({ id, text }));
}

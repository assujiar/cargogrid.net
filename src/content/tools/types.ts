import type { Block } from "../articles/types";

/**
 * Content model for the free tools and reference pages.
 *
 * These pages exist to answer a question somebody has *while working*, which is
 * a different job from the essays under /artikel. Somebody looking up how many
 * cartons fit on a CDD has no interest in CargoGrid and is not going to read
 * 2.000 words to find out. So the model puts the instrument first and the prose
 * second, and the prose is there to make the answer trustworthy — where the
 * formula comes from, what it assumes, when it stops being true.
 *
 * `Block` is borrowed wholesale from the article model rather than reinvented.
 * The renderer, the typography and the callout treatments are already solved
 * there, and a second prose format would have drifted from the first within two
 * edits.
 */
export interface ToolFaq {
  q: string;
  a: string;
}

export type ToolKind = "kalkulator" | "referensi";

/**
 * Sumber yang mendasari angka pada sebuah halaman.
 *
 * Ada di sini karena halaman-halaman ini dipakai orang untuk memutuskan berapa
 * ton yang akan mereka muat dan berapa tarif yang akan mereka tawarkan.
 * Keputusan seperti itu pantas bisa ditelusuri. Menyebut dasarnya juga
 * menyelesaikan pertanyaan pertama pembaca yang skeptis -- "angka ini dari
 * mana" -- tanpa mereka perlu bertanya.
 */
export interface ToolSource {
  label: string;
  detail: string;
}

export interface Tool {
  slug: string;
  kind: ToolKind;
  /** H1 and card title. */
  title: string;
  /** SERP title, carrying the brand suffix the H1 does not need. */
  metaTitle: string;
  description: string;
  keywords: string[];
  /** Standfirst under the H1 and on the hub card. */
  summary: string;
  /**
   * The literal phrasings this page is built to answer.
   *
   * Rendered on-page under "Halaman ini menjawab", which is not an SEO trick —
   * it is the fastest way for someone who arrived from a search to confirm in
   * one glance that they are in the right place, before they scroll. That it
   * also states the page's topic in the words people actually use is a genuine
   * second benefit rather than the reason.
   */
  searchIntents: string[];
  /** Prose below the instrument. Rendered through the article body renderer. */
  blocks: Block[];
  faq: ToolFaq[];
  /** Dasar rujukan angka pada halaman ini, bila angkanya berasal dari luar. */
  sources?: ToolSource[];
  /** Slugs from the article registry. Validated at module load. */
  relatedArticles: string[];
  /** Slugs from this registry. Validated at module load. */
  relatedTools: string[];
  publishedAt: string;
  updatedAt?: string;
}

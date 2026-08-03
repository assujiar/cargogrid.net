import { notFound } from "next/navigation";
import SiteShell from "../../../src/components/chrome/SiteShell";
import ArticleView from "../../../src/components/articles/ArticleView";
import { articles, getArticle } from "../../../src/content/articles";
import { buildMetadata, articleJsonLd, nestedBreadcrumbJsonLd } from "../../../src/lib/seo";

/**
 * Every article is known at build time, so the whole set is prerendered.
 * `dynamicParams = false` makes an unknown slug a 404 instead of an attempted
 * on-demand render -- there is no such thing as an article the registry has not
 * heard of.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return buildMetadata({
    path: `/artikel/${article.slug}`,
    title: article.metaTitle,
    description: article.description,
    keywords: article.keywords,
  });
}

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              slug: article.slug,
              title: article.title,
              description: article.description,
              publishedAt: article.publishedAt,
              updatedAt: article.updatedAt,
              keywords: article.keywords,
              faq: article.faq,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            nestedBreadcrumbJsonLd(
              { path: "/artikel", label: "Artikel" },
              { path: `/artikel/${article.slug}`, label: article.title },
            ),
          ),
        }}
      />
      <ArticleView article={article} />
    </SiteShell>
  );
}

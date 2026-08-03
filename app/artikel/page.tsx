import SiteShell from "../../src/components/chrome/SiteShell";
import ArticleIndexView from "../../src/components/articles/ArticleIndexView";
import { buildMetadata, breadcrumbJsonLd } from "../../src/lib/seo";

export const metadata = buildMetadata({
  path: "/artikel",
  title: "Artikel & Wawasan Operasional Logistik — CargoGrid OS",
  description:
    "Tulisan teknis tentang operasional logistik Indonesia: biaya POD kertas, rekonsiliasi invoice forwarder, demurrage, margin per job, WMS 3PL, dan pemilihan sistem.",
  keywords: [
    "artikel logistik indonesia",
    "wawasan operasional freight forwarding",
    "blog software logistik",
    "manajemen operasional 3PL",
  ],
});

export default function ArtikelPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd("/artikel", "Artikel")) }}
      />
      <ArticleIndexView />
    </SiteShell>
  );
}

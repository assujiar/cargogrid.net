import type { Metadata } from "next";
import { faqList } from "../data";

export const siteUrl = "https://cargogrid.net";
export const siteName = "CargoGrid OS";
export const companyAddress = {
  streetAddress: "Sudirman Central Business District (SCBD)",
  addressLocality: "Jakarta Selatan",
  addressRegion: "DKI Jakarta",
  addressCountry: "ID",
};
export const companyPhone = "+62877 8898 0088";
export const companyEmail = "service@cargogrid.net";

interface BuildMetadataInput {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
}

export function buildMetadata({ path, title, description, keywords }: BuildMetadataInput): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName,
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "CargoGrid OS Indonesia",
    url: siteUrl,
    logo: `${siteUrl}/cargogrid_vertical.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: companyPhone,
      contactType: "customer service",
      areaServed: "ID",
      availableLanguage: ["Indonesian", "English"],
      email: companyEmail,
    },
    address: {
      "@type": "PostalAddress",
      ...companyAddress,
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#software`,
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android, PWA",
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: "0",
    },
    description:
      "CargoGrid OS adalah sistem operasi logistik terintegrasi dan software ERP end-to-end untuk Freight Forwarder, 3PL Warehouse, armada Trucking, dan Corporate Shipper.",
    browserRequirements: "Requires HTML5 compatible browser",
  };
}

export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), softwareApplicationJsonLd()],
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/faq/#faq`,
    mainEntity: faqList.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(path: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: `${siteUrl}${path}`,
      },
    ],
  };
}

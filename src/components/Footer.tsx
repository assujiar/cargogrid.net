"use client";

import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "./shared/LanguageProvider";
import { companyAddressLine } from "../lib/companyInfo";
import { navLinksByKind, type ToolNavLink } from "../content/tools/navLinks";
import { toolVisual, ACCENT_CLASSES } from "./tools/toolVisuals";
import { openCookiePreferences } from "../lib/tracking";

/**
 * One category of the footer's tool list.
 *
 * The icon carries the same mark the tool's hub card does, so the shape someone
 * learned upstairs is the shape they recognise down here. `items-start` rather
 * than centred: in the narrow phone columns the longer labels wrap to two
 * lines, and a centred icon would float against the middle of the block
 * instead of sitting beside its first line.
 *
 * Every row is held at two lines tall whether or not its label needs the
 * second. The two groups are separate grids, so nothing makes their rows line
 * up except being the same height: let a row size itself and one wrapped label
 * anywhere in the block knocks that group's remaining rows out of step with
 * the group beside it, which is exactly the ragged edge the eye picks up.
 */
const ROW_HEIGHT = "min-h-[2.0625rem]"; // two lines of text-xs at leading-snug

function ToolGroup({
  title,
  links,
  isEn,
  className,
  listClassName,
}: {
  title: string;
  links: ToolNavLink[];
  isEn: boolean;
  /** Where this group sits in the outer grid. */
  className: string;
  /** How the group splits itself into columns once there is room. */
  listClassName: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{title}</h3>
      <ul className={`mt-2.5 flex flex-col gap-x-6 gap-y-2.5 text-xs ${listClassName}`}>
        {links.map((tool) => {
          const { Icon, accent } = toolVisual(tool.slug);
          return (
            <li key={tool.slug}>
              <Link
                href={`/alat/${tool.slug}`}
                className={`group flex ${ROW_HEIGHT} items-start gap-2 font-bold leading-snug transition-colors hover:text-brand-orange`}
              >
                <Icon
                  className={`mt-px h-3.5 w-3.5 flex-shrink-0 ${ACCENT_CLASSES[accent].text} transition-colors group-hover:text-brand-orange`}
                  aria-hidden="true"
                />
                <span className="min-w-0">{isEn ? tool.labelEn : tool.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <footer className="bg-[#eef2f6] border-t border-slate-200 text-slate-600 font-semibold py-12" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-300">
          {/* Logo & positioning */}
          <div className="md:col-span-5 flex flex-col gap-4 text-left">
            <Logo size="md" />
            <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-sm mt-2">
              {isEn
                ? "CargoGrid is a logistics platform connecting customer requests, quotes, shipment operations, warehousing, delivery proof, billing, and reports into a single workspace."
                : "CargoGrid adalah platform logistik yang menghubungkan permintaan customer, penawaran, operasional pengiriman, gudang, bukti kirim, tagihan, dan laporan dalam satu ruang kerja."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-3 text-left">
            <h2 className="font-display font-extrabold text-slate-900 text-xs uppercase tracking-widest">
              {isEn ? "Page Navigation" : "Navigasi Halaman"}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/tantangan" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Core Bottlenecks" : "Penyebab Masalah"}
              </Link>
              <Link href="/solusi" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Unified Workflow" : "Satu Alur Kerja"}
              </Link>
              <Link href="/solusi" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Solutions" : "Solusi"}
              </Link>
              <Link href="/solusi" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Business Sectors" : "Sektor Bisnis"}
              </Link>
              <Link href="/simulator-roi" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "ROI Calculator" : "Kalkulator ROI"}
              </Link>
              <Link href="/simulator-roi" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Product Preview" : "Preview Produk"}
              </Link>
              <Link href="/paket" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Pricing Suites" : "Paket Harga"}
              </Link>
              <Link href="/faq" className="hover:text-brand-orange transition-colors font-bold">
                FAQ
              </Link>
              <Link href="/artikel" className="hover:text-brand-orange transition-colors font-bold">
                Insight
              </Link>
              <Link href="/alat" className="hover:text-brand-orange transition-colors font-bold">
                {isEn ? "Tools & Reference" : "Alat & Referensi"}
              </Link>
            </div>
          </div>

          {/* Contacts info */}
          <div className="md:col-span-4 flex flex-col gap-3 text-left">
            <h2 className="font-display font-extrabold text-slate-900 text-xs uppercase tracking-widest">
              {isEn ? "Contact & Support" : "Kontak & Dukungan"}
            </h2>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-teal flex-shrink-0" aria-hidden="true" />
                <a href="mailto:service@cargogrid.net" className="font-bold text-slate-700 hover:text-brand-teal transition-colors">
                  service@cargogrid.net
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-teal flex-shrink-0" aria-hidden="true" />
                <a href="tel:+6287788980088" className="font-bold text-slate-700 hover:text-brand-teal transition-colors">
                  +62877 8898 0088
                </a>
              </li>
              {/* items-start (not items-center): the address wraps to 2-3 lines
                  at every breakpoint, and centring would float the pin against
                  the middle of the block instead of its first line. */}
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-teal flex-shrink-0" aria-hidden="true" />
                <address className="not-italic font-bold text-slate-700 leading-relaxed">
                  {isEn ? companyAddressLine.en : companyAddressLine.id}
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Free tools, listed individually rather than behind the hub link
            above. Every tool page is then one hop from every page on the site,
            which is the whole point of building them: they are the entry points
            for people who have never heard of CargoGrid, and an entry point
            buried two clicks deep is an entry point nobody crawls or finds. */}
        <nav aria-label={isEn ? "Free tools" : "Alat gratis"} className="py-8 border-b border-slate-300">
          <h2 className="font-display font-extrabold text-slate-900 text-xs uppercase tracking-widest">
            {isEn ? "Free Tools & Reference" : "Alat & Referensi Gratis"}
          </h2>
          {/* Split the same way the hub splits: things that compute something
              and things you look something up in. Nine items in one flat run
              made the visitor read all nine to find out which kind they were
              looking at.

              Two columns on a phone, one category each. From `lg` the row opens
              into five: two columns of calculators and three of reference, each
              running two deep, so the whole set clears in two glances instead of
              a nine-line scroll. */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-5 lg:gap-x-8">
            <ToolGroup
              title={isEn ? "Calculators" : "Kalkulator"}
              links={navLinksByKind("kalkulator")}
              isEn={isEn}
              className="lg:col-span-2"
              listClassName="lg:grid lg:grid-cols-2"
            />
            <ToolGroup
              title={isEn ? "Reference" : "Referensi"}
              links={navLinksByKind("referensi")}
              isEn={isEn}
              className="lg:col-span-3"
              listClassName="lg:grid lg:grid-cols-3"
            />
          </div>
        </nav>

        {/* Lower footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-[11px] text-slate-600 font-mono font-bold border-t border-slate-300">
          {/* Centred on a phone so it shares an axis with the link grid below
              it. Left-aligned, its second line ended under a centred grid and
              the whole block read as two unrelated pieces of furniture.

              The positioning line is held back until `sm`, where the sentence
              fits on one line. On a phone it was the only reason this ran to
              two lines, and it says nothing the site above has not already
              said at length. */}
          <div className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} CargoGrid. All Rights Reserved
            <span className="hidden sm:inline"> &bull; Configurable Logistics Platform.</span>
          </div>
          {/* Two layouts, because a separated inline row cannot wrap cleanly at
              phone widths. Whichever element the break lands on either strands
              its bullet at the end of a line or carries one to the start of the
              next, and both read as a mistake. Below `sm` the links simply sit
              in a grid with no separators to misplace; from `sm` up, where the
              row fits on one line, the bullets come back. */}
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2 text-center sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-center sm:[&>*+*]:before:mr-4 sm:[&>*+*]:before:text-slate-400 sm:[&>*+*]:before:content-['•']">
            <Link href="/kebijakan-privasi" className="hover:text-brand-orange transition-colors font-extrabold">
              {isEn ? "Privacy Policy" : "Kebijakan Privasi"}
            </Link>
            <Link href="/syarat-ketentuan" className="hover:text-brand-orange transition-colors font-extrabold">
              {isEn ? "Terms & Conditions" : "Syarat & Ketentuan"}
            </Link>
            {/* The only way back into the consent dialog once a choice has been
                stored — without it, a visitor could grant consent but never
                withdraw it. */}
            <button
              type="button"
              onClick={openCookiePreferences}
              className="hover:text-brand-orange transition-colors font-extrabold cursor-pointer bg-transparent border-0 p-0 font-mono text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded"
            >
              {isEn ? "Cookie Preferences" : "Preferensi Cookie"}
            </button>
            <span className="text-slate-600 font-extrabold">{isEn ? "SLA Guaranteed" : "Layanan SLA Terjamin"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Wrench } from "lucide-react";
import { toolsByKind } from "../../content/tools";
import type { Tool } from "../../content/tools/types";
import { ACCENT_CLASSES, ToolBadge, ToolPattern, toolVisual } from "./toolVisuals";

function ToolCard({ tool }: { tool: Tool }) {
  const { accent } = toolVisual(tool.slug);
  const accentClasses = ACCENT_CLASSES[accent];

  return (
    <Link
      href={`/alat/${tool.slug}`}
      className="nm-emboss group relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#eef2f6]/70 p-6 transition-transform duration-200 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
    >
      {/* The pattern sits behind everything and fades up on hover, so a card at
          rest stays quiet and the one under the cursor is unmistakable. */}
      <ToolPattern
        kind={toolVisual(tool.slug).pattern}
        accent={accent}
        className="opacity-60 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <ToolBadge slug={tool.slug} />
          <span
            className={`rounded-full bg-white/70 px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-[0.12em] ${accentClasses.softText}`}
          >
            {tool.kind === "kalkulator" ? "Kalkulator" : "Referensi"}
          </span>
        </div>

        <h3
          className={`mt-5 font-display text-[17px] font-bold leading-snug tracking-tight text-slate-900 transition-colors duration-200 ${accentClasses.hoverText}`}
        >
          {tool.title}
        </h3>
        <p className="mt-3 text-[13px] leading-[1.75] text-slate-600">{tool.description}</p>

        <ul className="mt-4 flex flex-col gap-1.5">
          {tool.searchIntents.slice(0, 3).map((intent) => (
            <li key={intent} className="flex items-start gap-2 text-[12px] leading-[1.6] text-slate-500">
              <span aria-hidden="true" className={`mt-[6px] h-1 w-1 flex-shrink-0 rounded-full ${accentClasses.bar}`} />
              <span className="min-w-0">{intent}</span>
            </li>
          ))}
        </ul>

        <span
          className={`mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-[11px] font-black uppercase tracking-[0.12em] ${accentClasses.softText}`}
        >
          Buka
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>

        <span
          aria-hidden="true"
          className={`mt-4 block h-0.5 w-0 rounded-full transition-all duration-300 ease-out group-hover:w-full ${accentClasses.bar}`}
        />
      </div>
    </Link>
  );
}

function GroupHeading({
  icon,
  children,
  count,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <h2 className="mb-7 flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
      <span className="nm-deboss inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-brand-teal">
        {icon}
      </span>
      <span className="min-w-0 truncate">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
      <span className="flex-shrink-0 text-slate-400">{count}</span>
    </h2>
  );
}

export default function ToolIndexView() {
  const calculators = toolsByKind("kalkulator");
  const references = toolsByKind("referensi");

  return (
    <section className="relative py-14 sm:py-20">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="mb-4 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-brand-teal">
            Alat &amp; Referensi
          </p>
          <h1 className="font-display text-3xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[2.7rem]">
            Alat kerja harian logistik
          </h1>
          <p className="mt-6 text-base leading-[1.8] text-slate-600 sm:text-lg">
            Kalkulator dan tabel rujukan untuk pertanyaan yang muncul di tengah pekerjaan: berapa CBM-nya, muat berapa
            di CDD, berapa biaya per kilometer armada sendiri, kapan free time habis, apa arti singkatan di dokumen
            ini.
          </p>
          <p className="mt-4 max-w-2xl text-[14px] leading-[1.8] text-slate-500">
            Semuanya gratis. Kalkulator meminta data kontak sekali sebelum dipakai; tabel rujukan, penjelasan, dan
            contoh perhitungan terbuka tanpa mengisi apa pun.
          </p>
        </header>

        <div className="mt-14 flex flex-col gap-14">
          <div>
            <GroupHeading icon={<Wrench className="h-4 w-4" aria-hidden="true" />} count={calculators.length}>
              Kalkulator
            </GroupHeading>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {calculators.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>

          <div>
            <GroupHeading icon={<BookOpen className="h-4 w-4" aria-hidden="true" />} count={references.length}>
              Referensi
            </GroupHeading>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {references.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </div>

        <aside className="nm-emboss relative mt-16 overflow-hidden rounded-3xl bg-[#eef2f6]/70 p-7 sm:p-9">
          <ToolPattern kind="rings" accent="teal" className="opacity-70" />
          <div className="relative">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-brand-teal">Selanjutnya</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-slate-700">
              Kalau alat di sini menjawab pertanyaan Anda, tulisan panjang di{" "}
              <Link
                href="/artikel"
                className="font-bold text-brand-teal underline underline-offset-4 hover:text-brand-teal-hover"
              >
                Insight
              </Link>{" "}
              membahas persoalan yang ada di baliknya: ke mana margin bocor, kenapa POD telat pulang, dan apa yang
              sebenarnya berubah ketika sebuah proses didigitalkan.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowRight, Wrench, BookOpen } from "lucide-react";
import { toolsByKind } from "../../content/tools";
import type { Tool } from "../../content/tools/types";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/alat/${tool.slug}`}
      className="nm-emboss group flex h-full flex-col rounded-3xl bg-[#eef2f6]/60 p-6 transition-transform duration-200 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
    >
      <h3 className="font-display text-[17px] font-bold leading-snug tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-brand-teal">
        {tool.title}
      </h3>
      <p className="mt-3 text-[13px] leading-[1.75] text-slate-600">{tool.description}</p>

      <ul className="mt-4 flex flex-col gap-1.5">
        {tool.searchIntents.slice(0, 3).map((intent) => (
          <li key={intent} className="flex items-start gap-2 text-[12px] leading-[1.6] text-slate-500">
            <span aria-hidden="true" className="mt-[6px] h-1 w-1 flex-shrink-0 rounded-full bg-slate-400" />
            {intent}
          </li>
        ))}
      </ul>

      <span className="mt-auto pt-5 inline-flex items-center gap-1.5 font-mono text-[11px] font-black uppercase tracking-[0.12em] text-brand-teal">
        Buka
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>

      <span
        aria-hidden="true"
        className="mt-4 block h-0.5 w-0 rounded-full bg-gradient-to-r from-brand-teal to-emerald-400 transition-all duration-300 ease-out group-hover:w-full"
      />
    </Link>
  );
}

export default function ToolIndexView() {
  const calculators = toolsByKind("kalkulator");
  const references = toolsByKind("referensi");

  return (
    <section className="relative py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="mb-4 font-mono text-[11px] font-black uppercase tracking-[0.16em] text-brand-teal">
            Alat &amp; Referensi
          </p>
          <h1 className="font-display text-3xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-[2.7rem]">
            Alat kerja harian logistik, gratis dan tanpa daftar
          </h1>
          <p className="mt-6 text-base leading-[1.8] text-slate-600 sm:text-lg">
            Kalkulator dan tabel rujukan untuk pertanyaan yang muncul di tengah pekerjaan: berapa CBM-nya, muat berapa
            di CDD, kapan free time habis, apa arti singkatan di dokumen ini. Semuanya terbuka, tidak meminta email, dan
            tidak menyembunyikan hasil di balik formulir.
          </p>
          <p className="mt-4 max-w-2xl text-[14px] leading-[1.8] text-slate-500">
            Halaman-halaman ini tidak menjual apa pun. Kami membangunnya karena persoalan yang sama muncul berulang
            dalam percakapan dengan tim operasional, dan jawaban yang bisa dipakai ulang lebih berguna daripada jawaban
            yang harus diulang.
          </p>
        </header>

        <div className="mt-16 flex flex-col gap-16">
          <div>
            <h2 className="mb-7 flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
              Kalkulator
              <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
              <span className="text-slate-400">{calculators.length}</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {calculators.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-7 flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Referensi
              <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
              <span className="text-slate-400">{references.length}</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {references.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </div>

        <aside className="nm-emboss mt-20 rounded-3xl bg-[#eef2f6]/70 p-7 sm:p-9">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-brand-teal">Selanjutnya</p>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-slate-700">
            Kalau alat di sini menjawab pertanyaan Anda, tulisan panjang di{" "}
            <Link href="/artikel" className="font-bold text-brand-teal underline underline-offset-4 hover:text-brand-teal-hover">
              Insight
            </Link>{" "}
            membahas persoalan yang ada di baliknya: ke mana margin bocor, kenapa POD telat pulang, dan apa yang
            sebenarnya berubah ketika sebuah proses didigitalkan.
          </p>
        </aside>
      </div>
    </section>
  );
}

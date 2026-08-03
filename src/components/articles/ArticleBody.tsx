import React from "react";
import type { Block } from "../../content/articles/types";

/**
 * Renders the structured article blocks.
 *
 * A server component on purpose: the body is static prose with no interaction,
 * so shipping it as client JavaScript would cost every reader a download for
 * nothing.
 */

const CALLOUT_STYLES: Record<
  Extract<Block, { type: "callout" }>["tone"],
  { wrap: string; label: string; text: string }
> = {
  insight: {
    wrap: "border-l-4 border-brand-teal bg-brand-teal/5",
    label: "text-brand-teal",
    text: "text-slate-700",
  },
  warning: {
    wrap: "border-l-4 border-brand-orange bg-brand-orange/5",
    label: "text-brand-orange",
    text: "text-slate-700",
  },
  example: {
    wrap: "border-l-4 border-slate-400 bg-slate-500/5",
    label: "text-slate-600",
    text: "text-slate-700",
  },
};

/**
 * Splits on the `**bold**` convention. Deliberately not a Markdown parser:
 * the content model is structured everywhere else, and this exists only so a
 * writer can stress a term mid-sentence without dropping into raw HTML.
 * Unmatched markers are left as literal text rather than swallowed.
 */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={index}
                id={block.id}
                className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-14 mb-5 scroll-mt-28"
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3 key={index} className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-9 mb-3">
                {block.text}
              </h3>
            );

          case "p":
            return (
              <p key={index} className="text-[15px] sm:text-base leading-[1.85] text-slate-600 mb-5">
                {renderInline(block.text)}
              </p>
            );

          case "ul":
            return (
              <ul key={index} className="mb-6 flex flex-col gap-3">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-3.5 text-[15px] sm:text-base leading-[1.8] text-slate-600">
                    <span aria-hidden="true" className="mt-[0.62em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-teal" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={index} className="mb-6 flex flex-col gap-3.5">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-3.5 text-[15px] sm:text-base leading-[1.8] text-slate-600">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal/10 font-mono text-[11px] font-black text-brand-teal">
                      {i + 1}
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );

          case "callout": {
            const style = CALLOUT_STYLES[block.tone];
            return (
              <aside key={index} className={`my-8 rounded-r-2xl px-6 py-5 ${style.wrap}`}>
                <p className={`font-mono text-[11px] font-black uppercase tracking-[0.14em] mb-2.5 ${style.label}`}>
                  {block.title}
                </p>
                <p className={`text-sm sm:text-[15px] leading-[1.8] ${style.text}`}>{renderInline(block.body)}</p>
              </aside>
            );
          }

          case "table":
            return (
              <figure key={index} className="my-9">
                {/* Wide tables scroll inside their own container so the page
                    body never scrolls sideways on a phone. */}
                <div className="nm-emboss-sm overflow-x-auto rounded-2xl bg-[#eef2f6]/60 p-1.5">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <thead>
                      <tr>
                        {block.head.map((cell, i) => (
                          <th
                            key={i}
                            scope="col"
                            className="px-4 py-3.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-slate-500"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, r) => (
                        <tr key={r} className="border-t border-slate-300/40">
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`px-4 py-3.5 align-top text-[13.5px] leading-relaxed ${
                                c === 0 ? "font-bold text-slate-800" : "text-slate-600"
                              }`}
                            >
                              {renderInline(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-center text-xs font-medium text-slate-500">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "quote":
            return (
              <blockquote key={index} className="my-9 px-6 sm:px-8">
                <p className="font-display text-xl sm:text-2xl font-bold leading-snug tracking-tight text-slate-800">
                  “{block.text}”
                </p>
                {block.attribution && (
                  <footer className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {block.attribution}
                  </footer>
                )}
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

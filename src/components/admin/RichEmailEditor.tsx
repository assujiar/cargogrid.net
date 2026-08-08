"use client";

/**
 * Rich HTML editor for campaign bodies.
 *
 * Three views over one document: a WYSIWYG surface, the raw HTML, and a preview
 * rendered through the exact pipeline the dispatcher uses. Switching between
 * them never transforms the markup — what you type in HTML mode is what gets
 * sent, byte for byte.
 *
 * Built on document.execCommand, which is formally deprecated and still the
 * only rich-text primitive every browser implements. The alternative was
 * pulling in an editor framework; for an email body — where the output has to
 * be table-based HTML that Outlook's Word renderer accepts anyway — a
 * dependency-free contentEditable that emits plain inline-styled markup is
 * closer to what is actually needed than a modern editor's structured document
 * model would be.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, Pilcrow,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Indent, Outdent, Quote, Link as LinkIcon, Unlink, Image as ImageIcon, Minus,
  Table as TableIcon, Undo2, Redo2, Eraser, Code2, Eye, PanelsTopLeft,
  Type, Palette, Highlighter, Smartphone, Monitor, Blocks, Braces, X,
} from "lucide-react";
import { MERGE_TAGS, PREVIEW_MERGE, renderCampaignEmail } from "../../lib/email/render";

interface RichEmailEditorProps {
  value: string;
  onChange: (html: string) => void;
  subject?: string;
  preheader?: string;
  /** Origin used when rendering the preview's tracking and unsubscribe links. */
  baseUrl?: string;
  minHeight?: number;
}

type Mode = "visual" | "html" | "preview";

const FONT_FAMILIES = [
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
];

const FONT_SIZES = [11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 40];

const SWATCHES = [
  "#2d3b4a", "#006d80", "#0097b2", "#cb3421", "#e8890c",
  "#1a7f37", "#6f42c1", "#7a8794", "#ffffff", "#000000",
];

/**
 * Ready-made sections. Every one is table-based with inline styles, because a
 * div-and-class layout that looks perfect in the editor collapses in Outlook,
 * which renders with Word rather than a browser engine.
 */
const BLOCKS: Array<{ id: string; label: string; html: string }> = [
  {
    id: "heading",
    label: "Judul + paragraf",
    html: `<h2 style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#2d3b4a;font-weight:bold;">Judul Bagian</h2>
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5c6e;">Tulis paragraf pembuka di sini. Jelaskan satu manfaat konkret, bukan daftar fitur.</p>`,
  },
  {
    id: "button",
    label: "Tombol CTA",
    html: `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-radius:10px;background-color:#006d80;">
<a href="https://www.cargogrid.net/kontak" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">Jadwalkan Demo →</a>
</td></tr></table>`,
  },
  {
    id: "two-col",
    label: "Dua kolom",
    html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;"><tr>
<td width="50%" valign="top" style="padding-right:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#4a5c6e;"><strong style="color:#2d3b4a;">Kolom kiri</strong><br />Isi kolom pertama.</td>
<td width="50%" valign="top" style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#4a5c6e;"><strong style="color:#2d3b4a;">Kolom kanan</strong><br />Isi kolom kedua.</td>
</tr></table>`,
  },
  {
    id: "list",
    label: "Daftar bullet",
    html: `<ul style="margin:0 0 16px;padding-left:20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.8;color:#4a5c6e;">
<li>Poin pertama yang spesifik dan terukur</li>
<li>Poin kedua</li>
<li>Poin ketiga</li>
</ul>`,
  },
  {
    id: "quote",
    label: "Kutipan / testimoni",
    html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr>
<td style="padding:18px 22px;background-color:#f0f4f8;border-left:4px solid #006d80;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#4a5c6e;font-style:italic;">
"Waktu penyusunan RFQ turun dari 3 hari jadi 4 jam."<br /><span style="font-style:normal;font-size:12px;color:#7a8794;">— Ops Manager, freight forwarder Surabaya</span>
</td></tr></table>`,
  },
  {
    id: "divider",
    label: "Garis pemisah",
    html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:20px 0;"><div style="height:1px;background-color:#d8e0e8;line-height:1px;font-size:0;">&nbsp;</div></td></tr></table>`,
  },
  {
    id: "spacer",
    label: "Jarak kosong",
    html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr></table>`,
  },
  {
    id: "stat",
    label: "Baris angka",
    html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr>
<td width="33%" align="center" style="font-family:Arial,Helvetica,sans-serif;"><div style="font-size:26px;font-weight:bold;color:#006d80;">72%</div><div style="font-size:11px;color:#7a8794;">lebih cepat</div></td>
<td width="33%" align="center" style="font-family:Arial,Helvetica,sans-serif;"><div style="font-size:26px;font-weight:bold;color:#006d80;">4 jam</div><div style="font-size:11px;color:#7a8794;">siklus RFQ</div></td>
<td width="33%" align="center" style="font-family:Arial,Helvetica,sans-serif;"><div style="font-size:26px;font-weight:bold;color:#006d80;">1 layar</div><div style="font-size:11px;color:#7a8794;">seluruh operasi</div></td>
</tr></table>`,
  },
];

/**
 * Strips anything that has no business in an email body.
 *
 * Applies to pasted content, which is usually Word or a web page and arrives
 * carrying scripts, event handlers, and class names that reference stylesheets
 * the recipient will never load.
 */
function sanitizePasted(html: string): string {
  return html
    .replace(/<(script|style|meta|link|iframe|object|embed|form|input)[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|meta|link|iframe|object|embed|form|input)\b[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*(["'])[\s\S]*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/\sclass\s*=\s*(["'])[\s\S]*?\1/gi, "")
    .replace(/javascript:/gi, "");
}

export default function RichEmailEditor({
  value,
  onChange,
  subject = "",
  preheader = "",
  baseUrl,
  minHeight = 420,
}: RichEmailEditorProps) {
  const [mode, setMode] = useState<Mode>("visual");
  const [previewWidth, setPreviewWidth] = useState<"desktop" | "mobile">("desktop");
  const [linkDialog, setLinkDialog] = useState<{ url: string; text: string } | null>(null);
  const [imageDialog, setImageDialog] = useState<{ url: string; alt: string; width: string } | null>(null);
  const [showBlocks, setShowBlocks] = useState(false);
  const [showMergeTags, setShowMergeTags] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  /**
   * The HTML this component last handed upwards. Writing `value` back into the
   * contentEditable on every render would move the caret to position zero on
   * each keystroke; comparing against this lets us re-sync only when the value
   * genuinely changed elsewhere (template loaded, HTML tab edited, undo).
   */
  const lastEmitted = useRef<string>("");

  useEffect(() => {
    if (mode !== "visual") return;
    const el = editorRef.current;
    if (!el) return;
    if (value !== lastEmitted.current && value !== el.innerHTML) {
      el.innerHTML = value || "";
      lastEmitted.current = value || "";
    }
  }, [value, mode]);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    lastEmitted.current = html;
    onChange(html);
  }, [onChange]);

  /** contentEditable loses the selection the moment a toolbar button takes focus. */
  const rememberSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
      savedRange.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const range = savedRange.current;
    if (!range) return;
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  const exec = useCallback(
    (command: string, argument?: string) => {
      restoreSelection();
      try {
        document.execCommand("styleWithCSS", false, "true");
        document.execCommand(command, false, argument);
      } catch (error) {
        console.warn(`execCommand ${command} failed`, error);
      }
      emit();
    },
    [emit, restoreSelection],
  );

  const insertHtml = useCallback(
    (html: string) => {
      restoreSelection();
      try {
        document.execCommand("insertHTML", false, html);
      } catch {
        // Selection lost entirely (toolbar clicked before the editor was ever
        // focused): appending is a better outcome than dropping the block.
        if (editorRef.current) editorRef.current.innerHTML += html;
      }
      emit();
    },
    [emit, restoreSelection],
  );

  /**
   * execCommand("fontSize") only understands the legacy 1-7 scale and emits
   * <font size>. Emails need real pixel values, so the tags it just produced
   * are rewritten in place.
   */
  const applyFontSize = useCallback(
    (px: number) => {
      restoreSelection();
      document.execCommand("fontSize", false, "7");
      const el = editorRef.current;
      if (el) {
        el.querySelectorAll<HTMLElement>('font[size="7"]').forEach((node) => {
          const span = document.createElement("span");
          span.style.fontSize = `${px}px`;
          span.innerHTML = node.innerHTML;
          node.replaceWith(span);
        });
      }
      emit();
    },
    [emit, restoreSelection],
  );

  const applyFontFamily = useCallback(
    (family: string) => {
      restoreSelection();
      document.execCommand("fontName", false, family);
      emit();
    },
    [emit, restoreSelection],
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const html = event.clipboardData.getData("text/html");
      if (!html) return; // plain text: let the browser handle it
      event.preventDefault();
      document.execCommand("insertHTML", false, sanitizePasted(html));
      emit();
    },
    [emit],
  );

  const openLinkDialog = useCallback(() => {
    rememberSelection();
    const selected = window.getSelection()?.toString() || "";
    setLinkDialog({ url: "https://www.cargogrid.net/", text: selected });
  }, [rememberSelection]);

  const confirmLink = useCallback(() => {
    if (!linkDialog?.url) return setLinkDialog(null);
    const { url, text } = linkDialog;
    const safeUrl = /^(https?:|mailto:|tel:|\{\{)/i.test(url) ? url : `https://${url}`;
    if (text) {
      insertHtml(
        `<a href="${safeUrl}" style="color:#006d80;text-decoration:underline;">${text.replace(/</g, "&lt;")}</a>`,
      );
    } else {
      exec("createLink", safeUrl);
    }
    setLinkDialog(null);
  }, [exec, insertHtml, linkDialog]);

  const confirmImage = useCallback(() => {
    if (!imageDialog?.url) return setImageDialog(null);
    const width = imageDialog.width ? `width="${parseInt(imageDialog.width, 10) || 600}" ` : "";
    insertHtml(
      `<img src="${imageDialog.url}" alt="${(imageDialog.alt || "").replace(/"/g, "&quot;")}" ${width}style="max-width:100%;height:auto;display:block;border:0;" />`,
    );
    setImageDialog(null);
  }, [imageDialog, insertHtml]);

  const insertTable = useCallback(() => {
    insertHtml(
      `<table role="presentation" width="100%" cellpadding="8" cellspacing="0" style="margin:16px 0;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4a5c6e;">
<tr style="background-color:#f0f4f8;"><th align="left" style="border:1px solid #d8e0e8;padding:8px;color:#2d3b4a;">Kolom 1</th><th align="left" style="border:1px solid #d8e0e8;padding:8px;color:#2d3b4a;">Kolom 2</th></tr>
<tr><td style="border:1px solid #d8e0e8;padding:8px;">Isi</td><td style="border:1px solid #d8e0e8;padding:8px;">Isi</td></tr>
<tr><td style="border:1px solid #d8e0e8;padding:8px;">Isi</td><td style="border:1px solid #d8e0e8;padding:8px;">Isi</td></tr>
</table>`,
    );
  }, [insertHtml]);

  const previewHtml = useMemo(() => {
    if (mode !== "preview") return "";
    try {
      return renderCampaignEmail({
        html: value || "<p style=\"color:#94a3b8\">(isi email masih kosong)</p>",
        subject: subject || "(tanpa subjek)",
        preheader,
        merge: PREVIEW_MERGE,
        baseUrl: baseUrl || (typeof window !== "undefined" ? window.location.origin : "https://www.cargogrid.net"),
        preview: true,
      }).html;
    } catch (error) {
      return `<pre style="padding:16px;color:#b91c1c;font:12px monospace;">Gagal merender pratinjau: ${String(error)}</pre>`;
    }
  }, [baseUrl, mode, preheader, subject, value]);

  const wordCount = useMemo(
    () => (value || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
    [value],
  );

  const btn = "w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-brand-teal transition-all border-0 bg-transparent cursor-pointer disabled:opacity-40";
  const sep = <span className="w-px h-5 bg-slate-300/70 mx-0.5" aria-hidden="true" />;

  return (
    <div className="nm-emboss bg-white rounded-2xl border-0 overflow-hidden flex flex-col">
      {/* Mode switcher */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-100/80 border-b border-slate-200/70">
        <div className="flex gap-1 p-0.5 bg-slate-200/70 rounded-lg">
          {([
            { id: "visual", label: "Editor", icon: PanelsTopLeft },
            { id: "html", label: "HTML", icon: Code2 },
            { id: "preview", label: "Pratinjau", icon: Eye },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md border-0 cursor-pointer transition-all ${
                mode === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {mode === "preview" && (
            <div className="flex gap-1 p-0.5 bg-slate-200/70 rounded-lg">
              <button type="button" onClick={() => setPreviewWidth("desktop")}
                className={`p-1.5 rounded-md border-0 cursor-pointer ${previewWidth === "desktop" ? "bg-white text-brand-teal" : "text-slate-500"}`}
                title="Tampilan desktop">
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => setPreviewWidth("mobile")}
                className={`p-1.5 rounded-md border-0 cursor-pointer ${previewWidth === "mobile" ? "bg-white text-brand-teal" : "text-slate-500"}`}
                title="Tampilan mobile">
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <span className="text-[10px] font-mono font-bold text-slate-400">{wordCount} kata</span>
        </div>
      </div>

      {/* Toolbar */}
      {mode === "visual" && (
        <div
          className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200/70"
          onMouseDown={(e) => e.preventDefault()} /* keep the caret in the editor */
        >
          <button type="button" className={btn} onClick={() => exec("undo")} title="Urungkan"><Undo2 className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("redo")} title="Ulangi"><Redo2 className="w-4 h-4" /></button>
          {sep}

          <button type="button" className={btn} onClick={() => exec("bold")} title="Tebal (Ctrl+B)"><Bold className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("italic")} title="Miring (Ctrl+I)"><Italic className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("underline")} title="Garis bawah"><Underline className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("strikeThrough")} title="Coret"><Strikethrough className="w-4 h-4" /></button>
          {sep}

          <button type="button" className={btn} onClick={() => exec("formatBlock", "<h1>")} title="Judul 1"><Heading1 className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("formatBlock", "<h2>")} title="Judul 2"><Heading2 className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("formatBlock", "<h3>")} title="Judul 3"><Heading3 className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("formatBlock", "<p>")} title="Paragraf"><Pilcrow className="w-4 h-4" /></button>
          {sep}

          <div className="relative flex items-center" title="Jenis huruf">
            <Type className="w-3.5 h-3.5 text-slate-400 absolute left-1.5 pointer-events-none" />
            <select
              onChange={(e) => { applyFontFamily(e.target.value); e.target.selectedIndex = 0; }}
              onMouseDown={rememberSelection}
              defaultValue=""
              className="h-8 pl-6 pr-1 text-[11px] font-semibold text-slate-600 bg-transparent border-0 rounded-lg cursor-pointer hover:bg-white focus:outline-none"
            >
              <option value="" disabled>Font</option>
              {FONT_FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          <select
            onChange={(e) => { applyFontSize(Number(e.target.value)); e.target.selectedIndex = 0; }}
            onMouseDown={rememberSelection}
            defaultValue=""
            title="Ukuran huruf"
            className="h-8 px-1 text-[11px] font-semibold text-slate-600 bg-transparent border-0 rounded-lg cursor-pointer hover:bg-white focus:outline-none"
          >
            <option value="" disabled>Ukuran</option>
            {FONT_SIZES.map((s) => <option key={s} value={s}>{s}px</option>)}
          </select>

          <ColorButton icon={<Palette className="w-4 h-4" />} title="Warna teks"
            onPick={(color) => exec("foreColor", color)} onOpen={rememberSelection} className={btn} />
          <ColorButton icon={<Highlighter className="w-4 h-4" />} title="Warna latar"
            onPick={(color) => exec("hiliteColor", color)} onOpen={rememberSelection} className={btn} />
          {sep}

          <button type="button" className={btn} onClick={() => exec("justifyLeft")} title="Rata kiri"><AlignLeft className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("justifyCenter")} title="Rata tengah"><AlignCenter className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("justifyRight")} title="Rata kanan"><AlignRight className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("justifyFull")} title="Rata kiri-kanan"><AlignJustify className="w-4 h-4" /></button>
          {sep}

          <button type="button" className={btn} onClick={() => exec("insertUnorderedList")} title="Daftar bullet"><List className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("insertOrderedList")} title="Daftar bernomor"><ListOrdered className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("outdent")} title="Kurangi indentasi"><Outdent className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("indent")} title="Tambah indentasi"><Indent className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("formatBlock", "<blockquote>")} title="Kutipan"><Quote className="w-4 h-4" /></button>
          {sep}

          <button type="button" className={btn} onClick={openLinkDialog} title="Sisipkan tautan"><LinkIcon className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("unlink")} title="Hapus tautan"><Unlink className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => { rememberSelection(); setImageDialog({ url: "", alt: "", width: "600" }); }} title="Sisipkan gambar"><ImageIcon className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={insertTable} title="Sisipkan tabel"><TableIcon className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => insertHtml('<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:16px 0;"><div style="height:1px;background-color:#d8e0e8;line-height:1px;font-size:0;">&nbsp;</div></td></tr></table>')} title="Garis pemisah"><Minus className="w-4 h-4" /></button>
          <button type="button" className={btn} onClick={() => exec("removeFormat")} title="Bersihkan format"><Eraser className="w-4 h-4" /></button>
          {sep}

          <div className="relative">
            <button type="button" onClick={() => { rememberSelection(); setShowBlocks((v) => !v); setShowMergeTags(false); }}
              className="flex items-center gap-1.5 h-8 px-2.5 text-[11px] font-bold text-slate-600 hover:bg-white hover:text-brand-teal rounded-lg border-0 bg-transparent cursor-pointer transition-all">
              <Blocks className="w-3.5 h-3.5" /> Blok
            </button>
            {showBlocks && (
              <div className="absolute z-30 mt-1 left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 max-h-72 overflow-y-auto">
                {BLOCKS.map((block) => (
                  <button key={block.id} type="button"
                    onClick={() => { insertHtml(block.html); setShowBlocks(false); }}
                    className="w-full text-left px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 border-0 bg-transparent cursor-pointer">
                    {block.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button type="button" onClick={() => { rememberSelection(); setShowMergeTags((v) => !v); setShowBlocks(false); }}
              className="flex items-center gap-1.5 h-8 px-2.5 text-[11px] font-bold text-slate-600 hover:bg-white hover:text-brand-teal rounded-lg border-0 bg-transparent cursor-pointer transition-all">
              <Braces className="w-3.5 h-3.5" /> Personalisasi
            </button>
            {showMergeTags && (
              <div className="absolute z-30 mt-1 right-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5">
                <p className="px-3 py-1.5 text-[9px] font-black font-mono uppercase tracking-wider text-slate-400">
                  Diganti otomatis per penerima
                </p>
                {MERGE_TAGS.map((tag) => (
                  <button key={tag.tag} type="button"
                    onClick={() => { insertHtml(`{{${tag.tag}}}`); setShowMergeTags(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 border-0 bg-transparent cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-700">{tag.label}</span>
                    <span className="block text-[10px] font-mono text-brand-teal">{`{{${tag.tag}}}`}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Surfaces */}
      {mode === "visual" && (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={() => { rememberSelection(); emit(); }}
          onKeyUp={rememberSelection}
          onMouseUp={rememberSelection}
          onPaste={handlePaste}
          role="textbox"
          aria-multiline="true"
          aria-label="Isi email"
          className="cg-email-editor px-6 py-5 outline-none overflow-y-auto text-[15px] leading-relaxed text-slate-700"
          style={{ minHeight, maxHeight: 640, fontFamily: "Arial, Helvetica, sans-serif" }}
        />
      )}

      {mode === "html" && (
        <textarea
          value={value}
          onChange={(e) => { lastEmitted.current = e.target.value; onChange(e.target.value); }}
          spellCheck={false}
          aria-label="Sumber HTML email"
          className="w-full px-4 py-4 font-mono text-[12px] leading-relaxed text-slate-700 bg-slate-50 border-0 outline-none resize-y"
          style={{ minHeight, maxHeight: 640 }}
          placeholder="<p>Tulis HTML email di sini…</p>"
        />
      )}

      {mode === "preview" && (
        <div className="bg-slate-200/50 p-4 overflow-y-auto flex justify-center" style={{ minHeight, maxHeight: 640 }}>
          <iframe
            title="Pratinjau email"
            srcDoc={previewHtml}
            // Rendering campaign HTML that may have been pasted from anywhere:
            // the sandbox keeps it from running scripts or navigating the portal.
            sandbox=""
            className="bg-white rounded-xl shadow-lg border-0 transition-all"
            style={{ width: previewWidth === "desktop" ? 680 : 380, height: 620, maxWidth: "100%" }}
          />
        </div>
      )}

      {/* Link dialog */}
      {linkDialog && (
        <DialogShell title="Sisipkan Tautan" onClose={() => setLinkDialog(null)} onConfirm={confirmLink}>
          <Field label="URL Tujuan">
            <input autoFocus value={linkDialog.url} onChange={(e) => setLinkDialog({ ...linkDialog, url: e.target.value })}
              placeholder="https://www.cargogrid.net/paket"
              className="w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal" />
          </Field>
          <Field label="Teks Tautan (kosongkan untuk memakai teks terpilih)">
            <input value={linkDialog.text} onChange={(e) => setLinkDialog({ ...linkDialog, text: e.target.value })}
              placeholder="Lihat paket harga"
              className="w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal" />
          </Field>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
            Hanya tautan ke domain cargogrid.net yang akan dilacak dan diteruskan. Tautan ke domain lain
            diblokir oleh pelacak klik demi mencegah penyalahgunaan domain pengirim.
          </p>
        </DialogShell>
      )}

      {/* Image dialog */}
      {imageDialog && (
        <DialogShell title="Sisipkan Gambar" onClose={() => setImageDialog(null)} onConfirm={confirmImage}>
          <Field label="URL Gambar">
            <input autoFocus value={imageDialog.url} onChange={(e) => setImageDialog({ ...imageDialog, url: e.target.value })}
              placeholder="https://www.cargogrid.net/banner.png"
              className="w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Teks Alt">
              <input value={imageDialog.alt} onChange={(e) => setImageDialog({ ...imageDialog, alt: e.target.value })}
                placeholder="Dashboard CargoGrid"
                className="w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal" />
            </Field>
            <Field label="Lebar (px)">
              <input value={imageDialog.width} onChange={(e) => setImageDialog({ ...imageDialog, width: e.target.value })}
                placeholder="600" inputMode="numeric"
                className="w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal" />
            </Field>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
            Gambar harus di-host pada URL publik — lampiran atau data URI besar akan menaikkan skor spam.
            Selalu isi teks alt: sebagian besar klien email memblokir gambar secara default.
          </p>
        </DialogShell>
      )}

      {/* The editable surface's own typography lives in src/index.css under
          .cg-email-editor, alongside the other global classes this app uses. */}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Small local pieces
// -----------------------------------------------------------------------------

function ColorButton({
  icon, title, onPick, onOpen, className,
}: {
  icon: React.ReactNode;
  title: string;
  onPick: (color: string) => void;
  onOpen: () => void;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" className={className} title={title}
        onClick={() => { onOpen(); setOpen((v) => !v); }}>
        {icon}
      </button>
      {open && (
        <div className="absolute z-30 mt-1 left-0 p-2 bg-white rounded-xl shadow-xl border border-slate-200">
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {SWATCHES.map((color) => (
              <button key={color} type="button" title={color}
                onClick={() => { onPick(color); setOpen(false); }}
                className="w-6 h-6 rounded-md border border-slate-200 cursor-pointer"
                style={{ backgroundColor: color }} />
            ))}
          </div>
          <input type="color" onChange={(e) => { onPick(e.target.value); setOpen(false); }}
            className="w-full h-7 rounded cursor-pointer border-0 bg-transparent" aria-label={`${title} kustom`} />
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

function DialogShell({
  title, children, onClose, onConfirm,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="w-full max-w-md nm-emboss bg-[#eaf0f6] rounded-2xl p-6 border-0 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h4 className="font-display font-black text-sm text-slate-900">{title}</h4>
          <button type="button" onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 border-0 bg-transparent cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all">
            Batal
          </button>
          <button type="button" onClick={onConfirm}
            className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover transition-all">
            Sisipkan
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * Reusable campaign bodies.
 *
 * A template here is just a name, a subject, a preheader and HTML — the same
 * fields a campaign has, minus the audience and the schedule. That is
 * deliberate: a template that carried its own recipients would be a campaign
 * you cannot see the status of.
 *
 * The starter set is seeded on first visit rather than shipped as database
 * rows, so a new deployment has something to open on day one without a data
 * migration that later has to be kept in sync with the schema.
 */

import React, { useCallback, useEffect, useState } from "react";
import { LayoutTemplate, Plus, Trash2, Copy, Loader2, Sparkles, ChevronLeft, Save } from "lucide-react";
import RichEmailEditor from "./RichEmailEditor";
import { Modal } from "./EmailContactsPanel";
import { listTemplates, saveTemplate, deleteTemplate } from "../../lib/email/marketingClient";
import type { EmailTemplate } from "../../lib/email/types";

const STARTERS: Array<Pick<EmailTemplate, "name" | "subject" | "preheader" | "html" | "category">> = [
  {
    name: "Newsletter Bulanan",
    category: "newsletter",
    subject: "{{company}} — update operasional CargoGrid bulan ini",
    preheader: "Tiga hal yang berubah di lantai operasional bulan ini.",
    html: `<h2 style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#2d3b4a;">Halo {{first_name}},</h2>
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5c6e;">Bulan ini kami merilis tiga hal yang langsung terasa di operasional harian tim {{company}}.</p>
<ul style="margin:0 0 20px;padding-left:20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.8;color:#4a5c6e;">
<li><strong style="color:#2d3b4a;">Tracking multi-moda</strong> — satu nomor resi untuk laut, darat, dan udara.</li>
<li><strong style="color:#2d3b4a;">POD digital</strong> — bukti terima terunggah dari HP driver, langsung masuk invoice.</li>
<li><strong style="color:#2d3b4a;">Rekap margin per shipment</strong> — tahu untung-rugi sebelum tutup buku.</li>
</ul>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-radius:10px;background-color:#006d80;">
<a href="https://www.cargogrid.net/solusi" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">Lihat Detail Modul →</a>
</td></tr></table>`,
  },
  {
    name: "Penawaran Demo",
    category: "sales",
    subject: "Audit sistem gratis untuk {{company}}",
    preheader: "45 menit, tanpa biaya, langsung dengan tim produk.",
    html: `<h2 style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#2d3b4a;">Halo {{first_name}},</h2>
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5c6e;">Kami membuka slot audit sistem operasional untuk perusahaan forwarder dan 3PL di Indonesia. Sesi 45 menit, dan yang Anda bawa pulang adalah peta alur kerja tim {{company}} lengkap dengan titik mana yang paling banyak memakan waktu.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr>
<td style="padding:18px 22px;background-color:#f0f4f8;border-left:4px solid #006d80;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#4a5c6e;font-style:italic;">
"Waktu penyusunan RFQ turun dari 3 hari jadi 4 jam."<br /><span style="font-style:normal;font-size:12px;color:#7a8794;">— Ops Manager, freight forwarder Surabaya</span>
</td></tr></table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-radius:10px;background-color:#cb3421;">
<a href="https://www.cargogrid.net/kontak" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">Ambil Slot Audit →</a>
</td></tr></table>`,
  },
  {
    name: "Follow-up Prospek Diam",
    category: "sales",
    subject: "Masih relevan untuk {{company}}?",
    preheader: "Satu pertanyaan singkat, boleh dijawab satu kata.",
    html: `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5c6e;">Halo {{first_name}},</p>
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5c6e;">Beberapa waktu lalu {{company}} sempat melihat-lihat CargoGrid. Saya tidak ingin mengirimi Anda rangkaian email yang tidak relevan, jadi satu pertanyaan saja:</p>
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#2d3b4a;font-weight:bold;">Apakah pembenahan sistem operasional masih jadi prioritas tahun ini?</p>
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5c6e;">Balas "ya" dan saya kirimkan rencana implementasinya. Balas "belum" dan saya berhenti menghubungi — tidak masalah sama sekali.</p>
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5c6e;">Terima kasih,<br />Tim CargoGrid</p>`,
  },
  {
    name: "Pengumuman Fitur Baru",
    category: "product",
    subject: "Baru di CargoGrid: {{company}} sudah bisa pakai ini",
    preheader: "Aktif otomatis, tidak perlu pengaturan tambahan.",
    html: `<h2 style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#2d3b4a;">Fitur baru sudah aktif</h2>
<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5c6e;">Halo {{first_name}}, ada yang baru di dashboard {{company}} — dan tidak perlu Anda aktifkan sendiri.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr>
<td width="33%" align="center" style="font-family:Arial,Helvetica,sans-serif;"><div style="font-size:26px;font-weight:bold;color:#006d80;">72%</div><div style="font-size:11px;color:#7a8794;">lebih cepat</div></td>
<td width="33%" align="center" style="font-family:Arial,Helvetica,sans-serif;"><div style="font-size:26px;font-weight:bold;color:#006d80;">4 jam</div><div style="font-size:11px;color:#7a8794;">siklus RFQ</div></td>
<td width="33%" align="center" style="font-family:Arial,Helvetica,sans-serif;"><div style="font-size:26px;font-weight:bold;color:#006d80;">1 layar</div><div style="font-size:11px;color:#7a8794;">seluruh operasi</div></td>
</tr></table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-radius:10px;background-color:#006d80;">
<a href="https://www.cargogrid.net/solusi" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">Coba Sekarang →</a>
</td></tr></table>`,
  },
];

export default function EmailTemplatesPanel() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<EmailTemplate> | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const flash = useCallback((kind: "ok" | "error", text: string) => {
    setNotice({ kind, text });
    setTimeout(() => setNotice(null), 6000);
  }, []);

  const reload = useCallback(async () => {
    try {
      setTemplates(await listTemplates());
    } catch (error) {
      flash("error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [flash]);

  useEffect(() => { void reload(); }, [reload]);

  const seed = async () => {
    setSeeding(true);
    try {
      for (const starter of STARTERS) await saveTemplate(starter);
      flash("ok", `${STARTERS.length} template contoh ditambahkan.`);
      await reload();
    } catch (error) {
      flash("error", (error as Error).message);
    } finally {
      setSeeding(false);
    }
  };

  const card = "nm-emboss bg-white rounded-2xl border-0";

  if (editing) {
    return (
      <TemplateEditor
        template={editing}
        onBack={() => { setEditing(null); void reload(); }}
        onFlash={flash}
      />
    );
  }

  return (
    <div className="space-y-5">
      {notice && (
        <div className={`p-3.5 rounded-xl text-xs font-bold border ${
          notice.kind === "ok" ? "bg-emerald-500/5 text-emerald-700 border-emerald-500/20" : "bg-red-500/5 text-red-600 border-red-500/20"
        }`}>{notice.text}</div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display font-black text-base text-slate-900">Template Email</h3>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
            Rangka email siap pakai. Memuat template ke kampanye menyalin isinya — mengubah template
            tidak mengubah kampanye yang sudah dibuat.
          </p>
        </div>
        <div className="flex gap-2">
          {templates.length === 0 && (
            <button type="button" onClick={() => void seed()} disabled={seeding}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 transition-all">
              {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Muat Contoh
            </button>
          )}
          <button type="button" onClick={() => setEditing({ name: "", subject: "", html: "", category: "general" })}
            className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover transition-all">
            <Plus className="w-3.5 h-3.5" /> Template Baru
          </button>
        </div>
      </div>

      {loading && (
        <div className={`${card} p-10 text-center text-xs font-bold text-slate-400`}>
          <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Memuat template…
        </div>
      )}

      {!loading && templates.length === 0 && (
        <div className={`${card} p-12 text-center`}>
          <LayoutTemplate className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h4 className="font-display font-black text-sm text-slate-700">Belum ada template</h4>
          <p className="text-[11px] text-slate-500 font-semibold mt-1 max-w-md mx-auto leading-relaxed">
            Muat empat contoh siap pakai (newsletter, penawaran demo, follow-up, pengumuman fitur),
            lalu sesuaikan isinya.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className={`${card} overflow-hidden flex flex-col`}>
            <div className="h-36 bg-slate-100 overflow-hidden relative">
              <iframe title={`Pratinjau ${t.name}`} srcDoc={t.html} sandbox=""
                className="w-[200%] h-[200%] origin-top-left scale-50 border-0 bg-white pointer-events-none" />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-display font-black text-sm text-slate-900 leading-tight">{t.name}</h4>
                <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 whitespace-nowrap">
                  {t.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold mt-1.5 line-clamp-2 flex-1">
                {t.subject || "(tanpa subjek)"}
              </p>
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => setEditing(t)}
                  className="flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover transition-all">
                  Ubah
                </button>
                <button type="button" title="Duplikat"
                  onClick={() => void saveTemplate({ ...t, id: undefined, name: `${t.name} (salinan)` }).then(reload)}
                  className="px-3 py-2 rounded-lg border-0 cursor-pointer bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button type="button" title="Hapus"
                  onClick={() => {
                    if (!confirm(`Hapus template "${t.name}"?`)) return;
                    void deleteTemplate(t.id).then(reload).catch((e) => flash("error", (e as Error).message));
                  }}
                  className="px-3 py-2 rounded-lg border-0 cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplateEditor({
  template, onBack, onFlash,
}: {
  template: Partial<EmailTemplate>;
  onBack: () => void;
  onFlash: (kind: "ok" | "error", text: string) => void;
}) {
  const [form, setForm] = useState(template);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.name?.trim()) return onFlash("error", "Nama template wajib diisi.");
    setSaving(true);
    try {
      await saveTemplate(form as Partial<EmailTemplate> & { name: string });
      onFlash("ok", "Template disimpan.");
      onBack();
    } catch (error) {
      onFlash("error", (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const field = "w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal";
  const label = "text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] font-black text-slate-600 hover:text-brand-teal border-0 bg-transparent cursor-pointer">
          <ChevronLeft className="w-4 h-4" /> Kembali ke daftar template
        </button>
        <button type="button" onClick={() => void submit()} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover disabled:opacity-50 transition-all">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Simpan Template
        </button>
      </div>

      <div className="nm-emboss bg-white rounded-2xl border-0 p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className={label}>Nama Template *</span>
          <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Newsletter Bulanan" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>Kategori</span>
          <input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="newsletter" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>Preheader</span>
          <input value={form.preheader || ""} onChange={(e) => setForm({ ...form, preheader: e.target.value })}
            className={field} />
        </label>
        <label className="flex flex-col gap-1.5 md:col-span-3">
          <span className={label}>Subjek Bawaan</span>
          <input value={form.subject || ""} onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="{{company}} — update operasional bulan ini" className={field} />
        </label>
      </div>

      <RichEmailEditor
        value={form.html || ""}
        onChange={(html) => setForm({ ...form, html })}
        subject={form.subject || ""}
        preheader={form.preheader || ""}
      />
    </div>
  );
}

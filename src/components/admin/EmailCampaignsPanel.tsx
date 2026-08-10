"use client";

/**
 * Campaign list and composer.
 *
 * The composer is one screen rather than a wizard: subject, body, audience,
 * throttle and schedule are all decisions that inform each other, and a wizard
 * would make you commit to the audience before you know how long 400 recipients
 * at 25/hour actually takes. The estimate updates live for exactly that reason.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Send, Plus, Play, Pause, XCircle, Trash2, Clock, Users, ShieldCheck, FlaskConical,
  Loader2, ChevronLeft, Save, Zap, AlertTriangle, CheckCircle2, Gauge, LayoutTemplate,
  Info, Mail, TrendingUp,
} from "lucide-react";
import RichEmailEditor from "./RichEmailEditor";
import { Modal } from "./EmailContactsPanel";
import {
  listCampaigns, getCampaign, saveCampaign, deleteCampaign, countAudience, queueCampaign,
  setCampaignState, listGroups, listAllTags, listTemplates, listRecipients, runDispatchNow,
  sendTestEmail, runSpamCheck, getSmtpStatus, getGlobalRate, setGlobalRate,
} from "../../lib/email/marketingClient";
import { describeSpamScore } from "../../lib/email/spamCheck";
import type {
  EmailCampaign, EmailCampaignOverview, EmailGroup, EmailRecipient, EmailTemplate, SpamReport,
} from "../../lib/email/types";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  scheduled: "bg-amber-50 text-amber-700",
  sending: "bg-brand-teal/10 text-brand-teal",
  paused: "bg-orange-50 text-orange-600",
  sent: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-400",
  failed: "bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draf", scheduled: "Terjadwal", sending: "Mengirim", paused: "Dijeda",
  sent: "Selesai", cancelled: "Dibatalkan", failed: "Gagal",
};

const EMPTY_CAMPAIGN: Partial<EmailCampaign> = {
  name: "", subject: "", preheader: "", html: "", from_name: "CargoGrid OS",
  rate_per_hour: 25, track_opens: true, track_clicks: true,
  audience_all: false, audience_group_ids: [], audience_tags: [], audience_contact_ids: [],
};

/** "3 jam 20 menit" — how long the queue will take to drain at the chosen rate. */
function formatDuration(minutes: number): string {
  if (minutes < 1) return "kurang dari 1 menit";
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = Math.round(minutes % 60);
  return [days && `${days} hari`, hours && `${hours} jam`, mins && `${mins} menit`]
    .filter(Boolean).join(" ");
}

/** datetime-local wants local wall-clock time with no zone suffix. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function EmailCampaignsPanel() {
  const [campaigns, setCampaigns] = useState<EmailCampaignOverview[]>([]);
  const [groups, setGroups] = useState<EmailGroup[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [editing, setEditing] = useState<Partial<EmailCampaign> | null>(null);
  const [viewing, setViewing] = useState<EmailCampaignOverview | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const [globalRate, setGlobalRateState] = useState<number>(25);

  const flash = useCallback((kind: "ok" | "error", text: string) => {
    setNotice({ kind, text });
    setTimeout(() => setNotice(null), 7000);
  }, []);

  const reload = useCallback(async () => {
    try {
      const [c, g, t, tpl, rate] = await Promise.all([
        listCampaigns(), listGroups(), listAllTags(), listTemplates(), getGlobalRate(),
      ]);
      setCampaigns(c);
      setGroups(g);
      setTags(t);
      setTemplates(tpl);
      setGlobalRateState(rate);
    } catch (error) {
      flash("error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [flash]);

  useEffect(() => {
    void reload();
    // A campaign in flight moves on its own, driven by cron rather than by
    // anything this screen does — so the list has to poll to stay honest.
    const timer = setInterval(() => void reload(), 30000);
    return () => clearInterval(timer);
  }, [reload]);

  const act = async (id: string, action: "pause" | "resume" | "cancel") => {
    const confirmations: Record<string, string> = {
      cancel: "Batalkan kampanye ini? Semua email yang belum terkirim akan dibatalkan permanen.",
    };
    if (confirmations[action] && !confirm(confirmations[action])) return;
    try {
      const result = await setCampaignState(id, action);
      flash("ok", `Kampanye ${action === "pause" ? "dijeda" : action === "resume" ? "dilanjutkan" : "dibatalkan"} — ${result.pending} email tersisa di antrean.`);
      await reload();
    } catch (error) {
      flash("error", (error as Error).message);
    }
  };

  const dispatchNow = async () => {
    setDispatching(true);
    try {
      const result = await runDispatchNow();
      flash("ok", result.claimed
        ? `Batch dijalankan — ${result.sent || 0} terkirim, ${result.failed || 0} gagal.`
        : "Tidak ada email yang jatuh tempo saat ini. Batch berikutnya menunggu jadwalnya.");
      await reload();
    } catch (error) {
      flash("error", (error as Error).message);
    } finally {
      setDispatching(false);
    }
  };

  const openNew = () => setEditing({ ...EMPTY_CAMPAIGN });

  const openEdit = async (id: string) => {
    try {
      setEditing(await getCampaign(id));
    } catch (error) {
      flash("error", (error as Error).message);
    }
  };

  const card = "nm-emboss bg-white rounded-2xl border-0";

  if (editing) {
    return (
      <CampaignComposer
        campaign={editing}
        groups={groups}
        tags={tags}
        templates={templates}
        onBack={() => { setEditing(null); void reload(); }}
        onFlash={flash}
      />
    );
  }

  if (viewing) {
    return <CampaignDetail campaign={viewing} onBack={() => { setViewing(null); void reload(); }} onFlash={flash} />;
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
          <h3 className="font-display font-black text-base text-slate-900">Kampanye Email</h3>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
            Pengiriman dibatasi per jam dan dijalankan dari antrean, jadi aman ditutup di tengah jalan.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void dispatchNow()} disabled={dispatching}
            title="Jalankan batch yang sudah jatuh tempo sekarang, tanpa menunggu penjadwal"
            className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 transition-all">
            {dispatching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            Kirim Batch Sekarang
          </button>
          <button type="button" onClick={openNew}
            className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover transition-all">
            <Plus className="w-3.5 h-3.5" /> Kampanye Baru
          </button>
        </div>
      </div>

      {/* The account-wide ceiling. Surfaced here rather than buried in settings
          because it is the number that actually governs throughput once more
          than one campaign is live, and it is not obvious from any single
          campaign's own rate. */}
      <div className={`${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center gap-2.5">
          <Gauge className="w-4 h-4 text-brand-teal flex-shrink-0" />
          <div>
            <span className="block text-[11px] font-black text-slate-800">
              Plafon pengiriman seluruh akun: {globalRate} email/jam
            </span>
            <span className="block text-[10px] text-slate-500 font-semibold leading-relaxed">
              Semua kampanye aktif berbagi angka ini karena keluar lewat satu mailbox yang sama.
              Batas per-kampanye hanya sub-limit di bawahnya.
            </span>
          </div>
        </div>
        <label className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider">Ubah</span>
          <input
            type="number" min={1} max={1000} defaultValue={globalRate} key={globalRate}
            aria-label="Plafon pengiriman seluruh akun per jam"
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (!value || value === globalRate) return;
              void setGlobalRate(value)
                .then(() => { setGlobalRateState(value); flash("ok", `Plafon akun diubah ke ${value} email/jam.`); })
                .catch((err) => flash("error", (err as Error).message));
            }}
            className="w-20 nm-input bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-teal"
          />
        </label>
      </div>

      {(() => {
        const active = campaigns.filter((c) => c.status === "sending" || c.status === "scheduled");
        const combined = active.reduce((sum, c) => sum + c.rate_per_hour, 0);
        if (active.length < 2 || combined <= globalRate) return null;
        return (
          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
              {active.length} kampanye aktif/terjadwal dengan total {combined} email/jam, di atas plafon akun{" "}
              {globalRate}/jam. Tidak ada yang rusak — plafon tetap ditegakkan, jadi kampanye akan saling
              menunggu dan yang paling lama tertunda dikirim lebih dulu. Naikkan plafon hanya jika penyedia
              SMTP Anda memang sanggup.
            </p>
          </div>
        );
      })()}

      {loading && (
        <div className={`${card} p-10 text-center text-xs font-bold text-slate-400`}>
          <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Memuat kampanye…
        </div>
      )}

      {!loading && campaigns.length === 0 && (
        <div className={`${card} p-12 text-center`}>
          <Send className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h4 className="font-display font-black text-sm text-slate-700">Belum ada kampanye</h4>
          <p className="text-[11px] text-slate-500 font-semibold mt-1 max-w-md mx-auto leading-relaxed">
            Buat kampanye pertama, pilih audiens dari grup atau tag kontak, lalu jadwalkan. Sistem
            mengirim maksimal 25 email per jam secara bertahap agar reputasi domain pengirim tetap aman.
          </p>
          <button type="button" onClick={openNew}
            className="mt-5 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover transition-all">
            Buat Kampanye Pertama
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {campaigns.map((c) => {
          const progress = c.total_recipients > 0
            ? Math.round(((c.sent_count + c.failed_count + c.bounced_count) / c.total_recipients) * 100)
            : 0;
          const active = c.status === "sending" || c.status === "scheduled" || c.status === "paused";

          return (
            <div key={c.id} className={`${card} p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${STATUS_STYLES[c.status]}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                    <h4 className="font-display font-black text-sm text-slate-900 truncate">{c.name}</h4>
                    {c.spam_score != null && (
                      <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${
                        c.spam_score < 3 ? "bg-emerald-50 text-emerald-700" : c.spam_score < 6 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"
                      }`} title="Skor risiko spam (0 = bersih, 10 = pasti spam)">
                        SPAM {c.spam_score}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1 truncate">{c.subject || "(tanpa subjek)"}</p>

                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[10px] font-mono font-bold text-slate-500">
                    <span><Users className="w-3 h-3 inline mr-1" />{c.total_recipients} penerima</span>
                    <span><Gauge className="w-3 h-3 inline mr-1" />{c.rate_per_hour}/jam · {c.total_batches || 0} batch</span>
                    {c.sent_count > 0 && <span className="text-emerald-600">✓ {c.sent_count} terkirim</span>}
                    {c.pending_count > 0 && <span className="text-amber-600">⏳ {c.pending_count} antre</span>}
                    {c.bounced_count > 0 && <span className="text-red-500">↩ {c.bounced_count} bounce</span>}
                    {c.sent_count > 0 && <span className="text-brand-teal">👁 {c.open_rate ?? 0}% dibuka</span>}
                  </div>

                  {c.total_recipients > 0 && (
                    <div className="mt-3 h-1.5 bg-slate-200 rounded-full overflow-hidden max-w-md">
                      <div className="h-full bg-brand-teal rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}

                  {c.status === "sending" && c.pending_count > 0 && (
                    <p className="text-[10px] text-slate-400 font-semibold mt-2">
                      Perkiraan selesai dalam {formatDuration((c.pending_count / c.rate_per_hour) * 60)}
                    </p>
                  )}
                  {c.status === "scheduled" && c.scheduled_at && (
                    <p className="text-[10px] text-amber-600 font-bold mt-2">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Mulai {new Date(c.scheduled_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => setViewing(c)}
                    className="px-3 py-1.5 text-[10px] font-bold rounded-lg border-0 cursor-pointer bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                    Detail
                  </button>
                  {(c.status === "draft" || c.status === "cancelled" || c.status === "failed") && (
                    <>
                      <button type="button" onClick={() => void openEdit(c.id)}
                        className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover transition-all">
                        Ubah
                      </button>
                      <button type="button"
                        onClick={() => {
                          if (!confirm(`Hapus kampanye "${c.name}" beserta seluruh riwayat pelacakannya?`)) return;
                          void deleteCampaign(c.id).then(reload).catch((e) => flash("error", (e as Error).message));
                        }}
                        className="p-1.5 rounded-lg border-0 cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {(c.status === "sending" || c.status === "scheduled") && (
                    <button type="button" onClick={() => void act(c.id, "pause")}
                      className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold rounded-lg border-0 cursor-pointer bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all">
                      <Pause className="w-3 h-3" /> Jeda
                    </button>
                  )}
                  {c.status === "paused" && (
                    <button type="button" onClick={() => void act(c.id, "resume")}
                      className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover transition-all">
                      <Play className="w-3 h-3" /> Lanjut
                    </button>
                  )}
                  {active && (
                    <button type="button" onClick={() => void act(c.id, "cancel")}
                      className="p-1.5 rounded-lg border-0 cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-all" title="Batalkan">
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Composer
// -----------------------------------------------------------------------------

function CampaignComposer({
  campaign, groups, tags, templates, onBack, onFlash,
}: {
  campaign: Partial<EmailCampaign>;
  groups: EmailGroup[];
  tags: string[];
  templates: EmailTemplate[];
  onBack: () => void;
  onFlash: (kind: "ok" | "error", text: string) => void;
}) {
  const [form, setForm] = useState<Partial<EmailCampaign>>(campaign);
  const [audience, setAudience] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [spam, setSpam] = useState<SpamReport | null>(campaign.spam_report || null);
  const [checkingSpam, setCheckingSpam] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [smtp, setSmtp] = useState<{ configured: boolean; reachable: boolean; from?: string; error?: string } | null>(null);

  const set = <K extends keyof EmailCampaign>(key: K, value: EmailCampaign[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    getSmtpStatus().then(setSmtp).catch(() => setSmtp(null));
  }, []);

  // The audience count is the number that decides everything else on this
  // screen, so it is recomputed server-side against the same predicate the
  // queue uses rather than estimated in the browser.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      countAudience({
        audience_all: form.audience_all || false,
        audience_group_ids: form.audience_group_ids || [],
        audience_tags: form.audience_tags || [],
        audience_contact_ids: form.audience_contact_ids || [],
      })
        .then((count) => !cancelled && setAudience(count))
        .catch(() => !cancelled && setAudience(null));
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [form.audience_all, form.audience_group_ids, form.audience_tags, form.audience_contact_ids]);

  const rate = form.rate_per_hour || 25;
  const batches = audience ? Math.ceil(audience / rate) : 0;
  const durationMinutes = audience && audience > 1 ? ((audience - 1) / rate) * 60 : 0;

  const persist = async (): Promise<EmailCampaign | null> => {
    if (!form.name?.trim()) {
      onFlash("error", "Nama kampanye wajib diisi.");
      return null;
    }
    setSaving(true);
    try {
      const saved = await saveCampaign(form as Partial<EmailCampaign> & { name: string });
      setForm(saved);
      return saved;
    } catch (error) {
      onFlash("error", (error as Error).message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = async () => {
    const saved = await persist();
    if (saved) onFlash("ok", "Draf tersimpan.");
  };

  const checkSpam = async () => {
    setCheckingSpam(true);
    try {
      const saved = form.id ? form : await persist();
      const report = await runSpamCheck({
        subject: form.subject || "",
        html: form.html || "",
        preheader: form.preheader || "",
        campaignId: saved?.id,
      }) as SpamReport;
      setSpam(report);
    } catch (error) {
      onFlash("error", (error as Error).message);
    } finally {
      setCheckingSpam(false);
    }
  };

  const launch = async (startAt: string | null) => {
    const saved = await persist();
    if (!saved) return;
    try {
      const result = await queueCampaign(saved.id, startAt);
      onFlash("ok",
        `${result.queued} penerima masuk antrean dalam ${result.batches} batch @ ${result.rate_per_hour}/jam. ` +
        `Perkiraan tuntas ${new Date(result.estimated_finish).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}.`);
      setShowSchedule(false);
      onBack();
    } catch (error) {
      onFlash("error", (error as Error).message);
    }
  };

  const readyToSend = Boolean(form.name?.trim() && form.subject?.trim() && form.html?.trim() && audience && audience > 0);
  const card = "nm-emboss bg-white rounded-2xl border-0";
  const label = "text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider";
  const field = "w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] font-black text-slate-600 hover:text-brand-teal border-0 bg-transparent cursor-pointer">
          <ChevronLeft className="w-4 h-4" /> Kembali ke daftar kampanye
        </button>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void saveDraft()} disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Simpan Draf
          </button>
          <button type="button" onClick={() => void checkSpam()} disabled={checkingSpam || !form.html}
            className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 transition-all">
            {checkingSpam ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />} Cek Spam
          </button>
          <button type="button" onClick={() => setShowTest(true)} disabled={!form.html || !form.subject}
            className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 transition-all">
            <FlaskConical className="w-3.5 h-3.5" /> Kirim Tes
          </button>
          <button type="button" onClick={() => setShowSchedule(true)} disabled={!readyToSend}
            className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover disabled:opacity-40 transition-all">
            <Send className="w-3.5 h-3.5" /> Kirim / Jadwalkan
          </button>
        </div>
      </div>

      {smtp && !smtp.configured && (
        <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-red-600 leading-relaxed">
            SMTP belum dikonfigurasi di server. Kampanye tetap bisa disusun dan diantrekan, tetapi tidak akan
            terkirim sampai SMTP_HOST, SMTP_USER, dan SMTP_PASS diisi di environment variables.
          </p>
        </div>
      )}
      {smtp?.configured && !smtp.reachable && (
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
            Server SMTP tidak dapat dihubungi: {smtp.error || "penyebab tidak diketahui"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left: content */}
        <div className="xl:col-span-8 space-y-5">
          <div className={`${card} p-5 space-y-3`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={label}>Nama Kampanye (internal) *</span>
                <input value={form.name || ""} onChange={(e) => set("name", e.target.value)}
                  placeholder="Newsletter Agustus — Modul Tracking" className={field} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={label}>Muat dari Template</span>
                <select value={form.template_id || ""} className={`${field} cursor-pointer`}
                  onChange={(e) => {
                    const template = templates.find((t) => t.id === e.target.value);
                    if (!template) return set("template_id", null);
                    setForm((prev) => ({
                      ...prev, template_id: template.id,
                      subject: prev.subject || template.subject,
                      preheader: prev.preheader || template.preheader || "",
                      html: template.html,
                    }));
                  }}>
                  <option value="">— tanpa template —</option>
                  {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={label}>Subjek Email *</span>
              <input value={form.subject || ""} onChange={(e) => set("subject", e.target.value)}
                placeholder="Cara {{company}} memangkas siklus RFQ jadi 4 jam" className={field} />
              <span className="text-[10px] text-slate-400 font-semibold">
                {(form.subject || "").length} karakter · gunakan {"{{name}}"} atau {"{{company}}"} untuk personalisasi
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={label}>Preheader</span>
              <input value={form.preheader || ""} onChange={(e) => set("preheader", e.target.value)}
                placeholder="Teks abu-abu yang muncul setelah subjek di kotak masuk" className={field} />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={label}>Nama Pengirim</span>
                <input value={form.from_name || ""} onChange={(e) => set("from_name", e.target.value)}
                  placeholder="CargoGrid OS" className={field} />
                <span className="text-[10px] text-slate-400 font-semibold">
                  Alamat pengirim tetap {smtp?.from || "sesuai SMTP_FROM"} — provider menolak From lain.
                </span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={label}>Balas Ke (Reply-To)</span>
                <input value={form.reply_to || ""} onChange={(e) => set("reply_to", e.target.value)}
                  placeholder="sales@cargogrid.net" className={field} />
              </label>
            </div>
          </div>

          <RichEmailEditor
            value={form.html || ""}
            onChange={(html) => set("html", html)}
            subject={form.subject || ""}
            preheader={form.preheader || ""}
          />
        </div>

        {/* Right: audience, throttle, spam */}
        <div className="xl:col-span-4 space-y-5">
          <div className={`${card} p-5 space-y-3`}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-teal" />
              <h4 className="font-display font-black text-sm text-slate-900">Audiens</h4>
            </div>

            <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 cursor-pointer">
              <input type="checkbox" checked={form.audience_all || false}
                onChange={(e) => set("audience_all", e.target.checked)}
                className="w-3.5 h-3.5 accent-[#006d80] cursor-pointer" />
              <span className="text-[11px] font-bold text-slate-700">Semua kontak aktif</span>
            </label>

            {!form.audience_all && (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className={label}>Grup</span>
                  <div className="flex flex-wrap gap-1.5">
                    {groups.length === 0 && <span className="text-[10px] text-slate-400 font-semibold">Belum ada grup.</span>}
                    {groups.map((g) => {
                      const on = (form.audience_group_ids || []).includes(g.id);
                      return (
                        <button key={g.id} type="button"
                          onClick={() => set("audience_group_ids",
                            on ? (form.audience_group_ids || []).filter((id) => id !== g.id)
                               : [...(form.audience_group_ids || []), g.id])}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border-0 cursor-pointer transition-all ${
                            on ? "bg-brand-teal text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}>
                          {g.name} <span className="opacity-70">({g.member_count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className={label}>Tag</span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {tags.length === 0 && <span className="text-[10px] text-slate-400 font-semibold">Belum ada tag.</span>}
                    {tags.map((tag) => {
                      const on = (form.audience_tags || []).includes(tag);
                      return (
                        <button key={tag} type="button"
                          onClick={() => set("audience_tags",
                            on ? (form.audience_tags || []).filter((t) => t !== tag)
                               : [...(form.audience_tags || []), tag])}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border-0 cursor-pointer transition-all ${
                            on ? "bg-brand-teal text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Grup dan tag digabung dengan OR — kontak yang cocok salah satu akan masuk, dan tetap
                    dihitung sekali meski cocok keduanya.
                  </span>
                </div>
              </>
            )}

            <div className="nm-deboss rounded-xl p-3.5 text-center">
              <span className="block text-2xl font-black text-brand-teal">
                {audience === null ? "…" : audience.toLocaleString("id-ID")}
              </span>
              <span className="block text-[10px] font-bold text-slate-500 mt-0.5">penerima akan menerima email ini</span>
              {audience === 0 && (
                <span className="block text-[10px] font-bold text-red-500 mt-1.5">
                  Tidak ada kontak yang cocok. Kontak yang berhenti berlangganan atau pernah bounce otomatis dikecualikan.
                </span>
              )}
            </div>
          </div>

          <div className={`${card} p-5 space-y-3`}>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-brand-teal" />
              <h4 className="font-display font-black text-sm text-slate-900">Kecepatan & Pelacakan</h4>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={label}>Batas Kirim per Jam</span>
              <div className="flex items-center gap-3">
                <input type="range" min={1} max={100} value={rate}
                  onChange={(e) => set("rate_per_hour", Number(e.target.value))}
                  className="flex-1 accent-[#006d80] cursor-pointer" />
                <span className="w-16 text-center text-sm font-black text-brand-teal font-mono">{rate}/jam</span>
              </div>
            </label>

            {audience !== null && audience > 0 && (
              <div className="nm-deboss rounded-xl p-3 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-700">
                  {batches} batch · 1 email setiap {Math.round(3600 / rate)} detik
                </p>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  {audience} penerima akan tuntas dalam {formatDuration(durationMinutes)}. Email dikirim menetes,
                  bukan sekaligus di awal jam — pola itu yang dibaca penyedia SMTP sebagai perilaku manusia,
                  bukan serangan.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.track_opens ?? true}
                  onChange={(e) => set("track_opens", e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#006d80] cursor-pointer" />
                <span className="text-[11px] font-bold text-slate-700">Lacak email dibuka</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.track_clicks ?? true}
                  onChange={(e) => set("track_clicks", e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#006d80] cursor-pointer" />
                <span className="text-[11px] font-bold text-slate-700">Lacak klik tautan</span>
              </label>
            </div>
          </div>

          {spam && <SpamPanel report={spam} />}
        </div>
      </div>

      {showTest && (
        <TestSendDialog form={form} onClose={() => setShowTest(false)} onFlash={onFlash} />
      )}

      {showSchedule && (
        <ScheduleDialog
          audience={audience || 0}
          rate={rate}
          durationMinutes={durationMinutes}
          initial={toLocalInput(form.scheduled_at || null)}
          onClose={() => setShowSchedule(false)}
          onLaunch={launch}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Spam report
// -----------------------------------------------------------------------------

function SpamPanel({ report }: { report: SpamReport }) {
  const tone = report.score < 3 ? "emerald" : report.score < 6 ? "amber" : "red";
  const toneMap: Record<string, { bar: string; text: string; bg: string }> = {
    emerald: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-500/5" },
    amber: { bar: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-500/5" },
    red: { bar: "bg-red-500", text: "text-red-600", bg: "bg-red-500/5" },
  };
  const colors = toneMap[tone];
  const problems = report.issues.filter((i) => i.severity !== "pass");
  const passes = report.issues.filter((i) => i.severity === "pass");

  return (
    <div className="nm-emboss bg-white rounded-2xl border-0 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-brand-teal" />
        <h4 className="font-display font-black text-sm text-slate-900">Cek Spam & Deliverability</h4>
      </div>

      <div className={`rounded-xl p-3.5 ${colors.bg}`}>
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl font-black ${colors.text}`}>{report.score}</span>
          <span className="text-[10px] font-mono font-bold text-slate-400">/ 10</span>
        </div>
        <div className="h-1.5 bg-white rounded-full overflow-hidden my-2">
          <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${Math.min(report.score * 10, 100)}%` }} />
        </div>
        <p className={`text-[11px] font-bold ${colors.text}`}>{describeSpamScore(report.score)}</p>
      </div>

      {report.auth && (
        <div className="grid grid-cols-3 gap-2">
          {([
            ["SPF", report.auth.spf.found],
            ["DKIM", report.auth.dkim.found],
            ["DMARC", report.auth.dmarc.found],
          ] as const).map(([name, ok]) => (
            <div key={name} className={`rounded-lg p-2 text-center ${ok ? "bg-emerald-50" : "bg-red-50"}`}>
              <span className={`block text-[9px] font-mono font-black ${ok ? "text-emerald-700" : "text-red-600"}`}>{name}</span>
              <span className={`block text-[10px] font-bold mt-0.5 ${ok ? "text-emerald-700" : "text-red-600"}`}>
                {ok ? "Aktif" : "Hilang"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {problems.map((issue) => (
          <div key={issue.id} className="p-2.5 rounded-lg bg-slate-50">
            <div className="flex items-start gap-2">
              <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded mt-0.5 ${
                issue.severity === "critical" ? "bg-red-100 text-red-600"
                  : issue.severity === "warning" ? "bg-amber-100 text-amber-700"
                  : "bg-slate-200 text-slate-500"
              }`}>
                +{issue.weight}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-slate-800">{issue.title}</p>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">{issue.detail}</p>
                {issue.fix && (
                  <p className="text-[10px] text-brand-teal font-bold leading-relaxed mt-1">→ {issue.fix}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {passes.length > 0 && (
          <details className="rounded-lg bg-emerald-50/60 p-2.5">
            <summary className="text-[10px] font-black text-emerald-700 cursor-pointer">
              {passes.length} pemeriksaan lolos
            </summary>
            <ul className="mt-2 space-y-1">
              {passes.map((issue) => (
                <li key={issue.id} className="text-[10px] text-emerald-700 font-semibold flex gap-1.5">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" /> {issue.title}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed border-t border-slate-100 pt-2.5">
        Skor ini heuristik, bukan vonis. Ia memeriksa hal-hal yang ada dalam kendali Anda —
        autentikasi domain, rasio teks/gambar, kebersihan tautan, dan pola bahasa promosi —
        tapi tidak bisa memastikan keputusan akhir Gmail.
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Test send + schedule dialogs
// -----------------------------------------------------------------------------

function TestSendDialog({
  form, onClose, onFlash,
}: {
  form: Partial<EmailCampaign>;
  onClose: () => void;
  onFlash: (kind: "ok" | "error", text: string) => void;
}) {
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    try {
      const result = await sendTestEmail({
        to, subject: form.subject || "", html: form.html || "",
        preheader: form.preheader || "", fromName: form.from_name || "", replyTo: form.reply_to || "",
      });
      onFlash(result.failed === 0 ? "ok" : "error",
        `Tes terkirim ke ${result.sent} alamat${result.failed ? `, ${result.failed} gagal: ${result.results.filter((r) => !r.ok).map((r) => r.error).join("; ")}` : "."}`);
      onClose();
    } catch (error) {
      onFlash("error", (error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Kirim Email Tes" onClose={onClose}>
      <div className="space-y-3">
        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
          Satu-satunya pratinjau yang jujur adalah emailnya sendiri. Kirim ke alamat Anda di Gmail dan
          Outlook sekaligus — dua-duanya merender HTML dengan mesin yang berbeda.
        </p>
        <label className="flex flex-col gap-1.5">
          <span className="text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider">
            Alamat Tujuan (maks. 5, pisahkan dengan koma)
          </span>
          <input value={to} onChange={(e) => setTo(e.target.value)} autoFocus
            placeholder="anda@cargogrid.net, tim@gmail.com"
            className="w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal" />
        </label>
        <div className="p-2.5 rounded-lg bg-slate-100 flex gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
            Merge tag diisi contoh data, dan pelacakan dimatikan agar statistik kampanye tidak tercemar
            oleh pengiriman tes.
          </p>
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <button type="button" onClick={onClose}
          className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all">
          Batal
        </button>
        <button type="button" disabled={busy || !to.trim()} onClick={() => void send()}
          className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover disabled:opacity-40 transition-all">
          {busy ? "Mengirim…" : "Kirim Tes"}
        </button>
      </div>
    </Modal>
  );
}

function ScheduleDialog({
  audience, rate, durationMinutes, initial, onClose, onLaunch,
}: {
  audience: number;
  rate: number;
  durationMinutes: number;
  initial: string;
  onClose: () => void;
  onLaunch: (startAt: string | null) => Promise<void>;
}) {
  const [mode, setMode] = useState<"now" | "later">(initial ? "later" : "now");
  const [when, setWhen] = useState(initial);
  const [busy, setBusy] = useState(false);

  const finish = useMemo(() => {
    const start = mode === "later" && when ? new Date(when) : new Date();
    return new Date(start.getTime() + durationMinutes * 60000);
  }, [durationMinutes, mode, when]);

  const go = async () => {
    setBusy(true);
    // datetime-local has no timezone, so it is interpreted in the operator's
    // own zone — which is what they meant when they typed it.
    await onLaunch(mode === "later" && when ? new Date(when).toISOString() : null);
    setBusy(false);
  };

  return (
    <Modal title="Kirim atau Jadwalkan Kampanye" onClose={onClose}>
      <div className="space-y-4">
        <div className="nm-deboss rounded-xl p-4 text-center">
          <span className="block text-3xl font-black text-brand-teal">{audience.toLocaleString("id-ID")}</span>
          <span className="block text-[11px] font-bold text-slate-600 mt-1">penerima · {Math.ceil(audience / rate)} batch @ {rate}/jam</span>
          <span className="block text-[10px] text-slate-400 font-semibold mt-1.5">
            Selesai sekitar {finish.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
          </span>
        </div>

        <div className="flex gap-2">
          {([
            { id: "now", label: "Kirim Sekarang" },
            { id: "later", label: "Jadwalkan" },
          ] as const).map(({ id, label }) => (
            <button key={id} type="button" onClick={() => setMode(id)}
              className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer transition-all ${
                mode === id ? "bg-brand-teal text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {mode === "later" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider">
              Waktu Mulai (zona waktu perangkat Anda)
            </span>
            <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)}
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              className="w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal" />
          </label>
        )}

        <div className="p-3 rounded-lg bg-amber-50 flex gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800 font-semibold leading-relaxed">
            Setelah diantrekan, kampanye berjalan sendiri di server — tidak perlu membiarkan browser terbuka.
            Anda tetap bisa menjeda atau membatalkan kapan saja, dan email yang sudah terkirim tidak bisa ditarik kembali.
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button type="button" onClick={onClose}
          className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all">
          Batal
        </button>
        <button type="button" disabled={busy || (mode === "later" && !when)} onClick={() => void go()}
          className="flex-[2] py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover disabled:opacity-40 transition-all">
          {busy ? "Memproses…" : mode === "now" ? `Kirim ke ${audience} Penerima` : "Jadwalkan Kampanye"}
        </button>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// Detail view
// -----------------------------------------------------------------------------

function CampaignDetail({
  campaign, onBack, onFlash,
}: {
  campaign: EmailCampaignOverview;
  onBack: () => void;
  onFlash: (kind: "ok" | "error", text: string) => void;
}) {
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listRecipients(campaign.id, filter)
      .then(setRecipients)
      .catch((error) => onFlash("error", (error as Error).message))
      .finally(() => setLoading(false));
  }, [campaign.id, filter, onFlash]);

  const batches = useMemo(() => {
    const grouped = new Map<number, EmailRecipient[]>();
    recipients.forEach((r) => {
      const list = grouped.get(r.batch_index) || [];
      list.push(r);
      grouped.set(r.batch_index, list);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  }, [recipients]);

  const card = "nm-emboss bg-white rounded-2xl border-0";

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack}
        className="flex items-center gap-1.5 text-[11px] font-black text-slate-600 hover:text-brand-teal border-0 bg-transparent cursor-pointer">
        <ChevronLeft className="w-4 h-4" /> Kembali ke daftar kampanye
      </button>

      <div className={`${card} p-5`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${STATUS_STYLES[campaign.status]}`}>
            {STATUS_LABELS[campaign.status]}
          </span>
          <h3 className="font-display font-black text-base text-slate-900">{campaign.name}</h3>
        </div>
        <p className="text-[11px] text-slate-500 font-semibold mt-1">{campaign.subject}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {[
          { label: "PENERIMA", value: campaign.total_recipients, tone: "text-slate-900" },
          { label: "TERKIRIM", value: campaign.sent_count, tone: "text-emerald-600" },
          { label: "ANTRE", value: campaign.pending_count, tone: "text-amber-600" },
          { label: "DIBUKA", value: `${campaign.opened_count} (${campaign.open_rate ?? 0}%)`, tone: "text-brand-teal" },
          { label: "DIKLIK", value: `${campaign.clicked_count} (${campaign.click_rate ?? 0}%)`, tone: "text-brand-teal" },
          { label: "BOUNCE", value: `${campaign.bounced_count} (${campaign.bounce_rate ?? 0}%)`, tone: "text-red-600" },
          { label: "BERHENTI", value: campaign.unsubscribed_count, tone: "text-slate-500" },
        ].map((stat) => (
          <div key={stat.label} className={`${card} p-4`}>
            <span className="font-mono text-[9px] font-black text-slate-400 tracking-wider block">{stat.label}</span>
            <span className={`text-lg font-black block mt-0.5 ${stat.tone}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
          <h4 className="font-display font-black text-sm text-slate-800">
            Antrean per Batch ({recipients.length})
          </h4>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter status penerima"
            className="nm-input bg-slate-50 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none">
            {[["all", "Semua"], ["queued", "Antre"], ["sent", "Terkirim"], ["bounced", "Bounce"], ["failed", "Gagal"], ["cancelled", "Dibatalkan"]]
              .map(([value, text]) => <option key={value} value={value}>{text}</option>)}
          </select>
        </div>

        {loading && (
          <p className="p-8 text-center text-xs font-bold text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Memuat antrean…
          </p>
        )}

        {!loading && recipients.length === 0 && (
          <p className="p-8 text-center text-xs font-bold text-slate-400">Tidak ada penerima dengan status ini.</p>
        )}

        <div className="max-h-[520px] overflow-y-auto">
          {batches.map(([index, list]) => (
            <div key={index}>
              <div className="px-4 py-2 bg-slate-50 border-y border-slate-100 flex items-center justify-between sticky top-0 z-10">
                <span className="text-[10px] font-black font-mono uppercase tracking-wider text-slate-500">
                  Batch {index + 1} · {list.length} email
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(list[0].scheduled_for).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                  {" → "}
                  {new Date(list[list.length - 1].scheduled_for).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <table className="w-full text-left">
                <tbody>
                  {list.map((r) => (
                    <tr key={r.id} className="border-b border-slate-50">
                      <td className="px-4 py-2">
                        <span className="block text-[11px] font-bold text-slate-700">{r.name || "—"}</span>
                        <span className="block text-[10px] font-mono text-slate-400">{r.email}</span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${
                          r.status === "sent" ? "bg-emerald-50 text-emerald-700"
                            : r.status === "queued" ? "bg-amber-50 text-amber-700"
                            : r.status === "bounced" ? "bg-red-50 text-red-600"
                            : r.status === "failed" ? "bg-red-50 text-red-600"
                            : "bg-slate-100 text-slate-500"
                        }`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-2 text-[10px] font-mono text-slate-400">
                        {r.sent_at
                          ? new Date(r.sent_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })
                          : new Date(r.scheduled_for).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="px-4 py-2 text-[10px] font-mono">
                        {r.open_count > 0 && <span className="text-brand-teal mr-2" title="Dibuka">👁 {r.open_count}</span>}
                        {r.click_count > 0 && <span className="text-emerald-600" title="Diklik">🔗 {r.click_count}</span>}
                        {r.unsubscribed_at && <span className="text-slate-400 ml-2">berhenti</span>}
                      </td>
                      <td className="px-4 py-2 text-[10px] text-red-500 font-semibold max-w-[220px] truncate" title={r.last_error || ""}>
                        {r.last_error || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

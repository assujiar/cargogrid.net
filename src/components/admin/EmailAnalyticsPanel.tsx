"use client";

/**
 * Cross-campaign tracker: sent, opened, clicked, bounced, unsubscribed.
 *
 * Two things this screen is careful about, because both are routinely reported
 * as facts when they are not:
 *
 *   Open rate under-reports. Gmail's image proxy and Apple Mail Privacy
 *   Protection either strip the pixel or fetch it on the reader's behalf, so
 *   the number is a floor with noise on top, not a measurement. It is stated on
 *   screen rather than buried here.
 *
 *   Bounce rate is only as complete as the feedback reaching /api/email/bounce.
 *   Rejections during the SMTP conversation are always captured; a mailbox that
 *   accepts and then bounces asynchronously is only counted if something
 *   forwards that DSN back.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  TrendingUp, Loader2, Mail, MousePointerClick, AlertTriangle, UserMinus, Info, Eye,
} from "lucide-react";
import { listCampaigns, listEvents, topClickedLinks, type CampaignEvent } from "../../lib/email/marketingClient";
import type { EmailCampaignOverview } from "../../lib/email/types";

const EVENT_LABELS: Record<string, { label: string; tone: string }> = {
  sent: { label: "Terkirim", tone: "text-emerald-600" },
  open: { label: "Dibuka", tone: "text-brand-teal" },
  click: { label: "Diklik", tone: "text-blue-600" },
  bounce: { label: "Bounce", tone: "text-red-600" },
  failed: { label: "Gagal", tone: "text-red-500" },
  unsubscribe: { label: "Berhenti", tone: "text-slate-500" },
  complaint: { label: "Lapor Spam", tone: "text-orange-600" },
};

export default function EmailAnalyticsPanel() {
  const [campaigns, setCampaigns] = useState<EmailCampaignOverview[]>([]);
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [links, setLinks] = useState<Array<{ url: string; clicks: number }>>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [c, e] = await Promise.all([listCampaigns(), listEvents(selected || undefined, 150)]);
      setCampaigns(c);
      setEvents(e);
      setLinks(selected ? await topClickedLinks(selected) : []);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => { void reload(); }, [reload]);

  /** Only campaigns that actually sent something belong in a rate calculation. */
  const sentCampaigns = useMemo(() => campaigns.filter((c) => c.sent_count > 0), [campaigns]);

  const totals = useMemo(() => {
    const sum = (key: keyof EmailCampaignOverview) =>
      sentCampaigns.reduce((acc, c) => acc + (Number(c[key]) || 0), 0);

    const sent = sum("sent_count");
    const bounced = sum("bounced_count");
    return {
      campaigns: sentCampaigns.length,
      sent,
      opened: sum("opened_count"),
      clicked: sum("clicked_count"),
      bounced,
      unsubscribed: sum("unsubscribed_count"),
      failed: sum("failed_count"),
      // Bounce rate is over everything that was attempted, not just what got
      // through — a 50% bounce rate would otherwise read as 100%.
      attempted: sent + bounced,
    };
  }, [sentCampaigns]);

  const rate = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);
  const card = "nm-emboss bg-white rounded-2xl border-0";

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3.5 rounded-xl text-xs font-bold bg-red-500/5 text-red-600 border border-red-500/20">{error}</div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display font-black text-base text-slate-900">Email Tracker</h3>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
            Angka gabungan dari {totals.campaigns} kampanye yang sudah mengirim.
          </p>
        </div>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} aria-label="Pilih kampanye"
          className="nm-input bg-white rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none">
          <option value="">Semua kampanye</option>
          {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Headline metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "TERKIRIM", value: totals.sent.toLocaleString("id-ID"), sub: `${totals.failed} gagal`, icon: Mail, tone: "text-slate-900" },
          { label: "DIBUKA", value: `${rate(totals.opened, totals.sent)}%`, sub: `${totals.opened} penerima unik`, icon: Eye, tone: "text-brand-teal" },
          { label: "DIKLIK", value: `${rate(totals.clicked, totals.sent)}%`, sub: `${totals.clicked} penerima unik`, icon: MousePointerClick, tone: "text-blue-600" },
          { label: "BOUNCE RATE", value: `${rate(totals.bounced, totals.attempted)}%`, sub: `${totals.bounced} alamat`, icon: AlertTriangle, tone: totals.attempted > 0 && rate(totals.bounced, totals.attempted) > 5 ? "text-red-600" : "text-slate-600" },
          { label: "BERHENTI", value: `${rate(totals.unsubscribed, totals.sent)}%`, sub: `${totals.unsubscribed} kontak`, icon: UserMinus, tone: "text-slate-500" },
        ].map((stat) => (
          <div key={stat.label} className={`${card} p-4`}>
            <div className="flex items-center gap-1.5">
              <stat.icon className="w-3 h-3 text-slate-300" />
              <span className="font-mono text-[9px] font-black text-slate-400 tracking-wider">{stat.label}</span>
            </div>
            <span className={`text-2xl font-black block mt-1 ${stat.tone}`}>{stat.value}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Health warnings — thresholds are the ones providers actually act on. */}
      {totals.attempted > 20 && rate(totals.bounced, totals.attempted) > 5 && (
        <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-red-600 leading-relaxed">
            Bounce rate {rate(totals.bounced, totals.attempted)}% — di atas ambang 5% yang biasa dipakai penyedia
            email sebelum membatasi pengiriman. Bersihkan daftar kontak sebelum kampanye berikutnya:
            alamat yang hard-bounce sudah otomatis masuk daftar blokir, tapi sisa daftar yang berasal dari
            sumber yang sama kemungkinan juga usang.
          </p>
        </div>
      )}
      {totals.sent > 50 && rate(totals.unsubscribed, totals.sent) > 2 && (
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
            Unsubscribe rate {rate(totals.unsubscribed, totals.sent)}% — di atas 2%, biasanya pertanda audiens
            terlalu luas atau isi email tidak sesuai harapan mereka saat mendaftar.
          </p>
        </div>
      )}

      <div className="p-3 rounded-xl bg-slate-100 flex gap-2.5">
        <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
          Angka <strong>dibuka</strong> selalu lebih rendah dari kenyataan: Gmail dan Apple Mail memblokir atau
          memproksi pixel pelacak, jadi banyak pembacaan tidak tercatat — sebaliknya, proxy yang melakukan
          prefetch bisa mencatat pembukaan yang tidak pernah terjadi. Gunakan sebagai tren, bukan angka mutlak.
          <strong> Klik</strong> adalah metrik yang jujur. Untuk <strong>bounce</strong>, penolakan saat koneksi SMTP selalu
          tercatat; bounce yang datang belakangan lewat DSN hanya masuk bila diteruskan ke /api/email/bounce.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        {/* Per-campaign table */}
        <div className={`${card} overflow-hidden`}>
          <h4 className="p-4 font-display font-black text-sm text-slate-800 border-b border-slate-100">
            Performa per Kampanye
          </h4>
          <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr>{["Kampanye", "Kirim", "Buka", "Klik", "Bounce"].map((h) => (
                  <th key={h} className="p-3 text-[9px] font-black font-mono uppercase tracking-wider text-slate-400">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} className="p-8 text-center text-xs font-bold text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Memuat…
                  </td></tr>
                )}
                {!loading && sentCampaigns.length === 0 && (
                  <tr><td colSpan={5} className="p-10 text-center">
                    <TrendingUp className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-500">Belum ada kampanye yang terkirim.</p>
                  </td></tr>
                )}
                {sentCampaigns.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                    <td className="p-3">
                      <span className="block text-[11px] font-black text-slate-800 truncate max-w-[180px]">{c.name}</span>
                      <span className="block text-[9px] font-mono text-slate-400">
                        {c.completed_at ? new Date(c.completed_at).toLocaleDateString("id-ID") : "sedang berjalan"}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] font-mono font-bold text-slate-700">{c.sent_count}</td>
                    <td className="p-3 text-[11px] font-mono font-bold text-brand-teal">{c.open_rate ?? 0}%</td>
                    <td className="p-3 text-[11px] font-mono font-bold text-blue-600">{c.click_rate ?? 0}%</td>
                    <td className={`p-3 text-[11px] font-mono font-bold ${(c.bounce_rate ?? 0) > 5 ? "text-red-600" : "text-slate-500"}`}>
                      {c.bounce_rate ?? 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          {/* Clicked links — only meaningful scoped to one campaign */}
          {selected && (
            <div className={`${card} overflow-hidden`}>
              <h4 className="p-4 font-display font-black text-sm text-slate-800 border-b border-slate-100">
                Tautan Paling Banyak Diklik
              </h4>
              {links.length === 0 ? (
                <p className="p-6 text-center text-[11px] font-bold text-slate-400">Belum ada klik tercatat.</p>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-52 overflow-y-auto">
                  {links.map((link) => (
                    <li key={link.url} className="p-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-mono text-slate-600 truncate" title={link.url}>{link.url}</span>
                      <span className="text-[10px] font-mono font-black text-brand-teal whitespace-nowrap">{link.clicks}×</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Event stream */}
          <div className={`${card} overflow-hidden`}>
            <h4 className="p-4 font-display font-black text-sm text-slate-800 border-b border-slate-100">
              Aktivitas Terbaru
            </h4>
            {events.length === 0 ? (
              <p className="p-6 text-center text-[11px] font-bold text-slate-400">Belum ada aktivitas.</p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                {events.map((event) => {
                  const meta = EVENT_LABELS[event.type] || { label: event.type, tone: "text-slate-500" };
                  return (
                    <li key={event.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className={`text-[11px] font-black ${meta.tone}`}>{meta.label}</span>
                        {event.url && (
                          <span className="block text-[9px] font-mono text-slate-400 truncate max-w-[240px]" title={event.url}>
                            {event.url}
                          </span>
                        )}
                        {event.detail && (
                          <span className="block text-[9px] text-red-400 font-semibold truncate max-w-[240px]" title={event.detail}>
                            {event.detail}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap">
                        {new Date(event.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

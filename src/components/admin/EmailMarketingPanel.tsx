"use client";

/**
 * Container for the email marketing workspace.
 *
 * Four sub-screens under one tab in the admin portal. They are separate
 * components rather than one file because each owns its own data loading, and
 * only one is mounted at a time — a campaign list that keeps polling while you
 * are editing contacts is wasted work.
 */

import React, { useEffect, useState } from "react";
import { Send, Users, LayoutTemplate, TrendingUp, Server, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import EmailCampaignsPanel from "./EmailCampaignsPanel";
import EmailContactsPanel from "./EmailContactsPanel";
import EmailTemplatesPanel from "./EmailTemplatesPanel";
import EmailAnalyticsPanel from "./EmailAnalyticsPanel";
import { getSmtpStatus } from "../../lib/email/marketingClient";

type Section = "campaigns" | "contacts" | "templates" | "analytics";

const SECTIONS = [
  { id: "campaigns", label: "Kampanye", icon: Send },
  { id: "contacts", label: "Kontak & Grup", icon: Users },
  { id: "templates", label: "Template", icon: LayoutTemplate },
  { id: "analytics", label: "Tracker", icon: TrendingUp },
] as const;

export default function EmailMarketingPanel() {
  const [section, setSection] = useState<Section>("campaigns");
  const [smtp, setSmtp] = useState<{
    configured: boolean; reachable: boolean; from?: string; host?: string; port?: number; error?: string;
  } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getSmtpStatus()
      .then(setSmtp)
      .catch(() => setSmtp(null))
      .finally(() => setChecking(false));
  }, []);

  return (
    <div className="lg:col-span-12 space-y-5">
      {/* SMTP status strip — the one dependency every screen below relies on. */}
      <div className="nm-emboss bg-white rounded-2xl border-0 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            checking ? "bg-slate-100" : smtp?.reachable ? "bg-emerald-500/10" : "bg-red-500/10"
          }`}>
            {checking
              ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              : smtp?.reachable
                ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                : <XCircle className="w-4 h-4 text-red-500" />}
          </div>
          <div>
            <span className="block text-[11px] font-black text-slate-800">
              {checking
                ? "Memeriksa koneksi SMTP…"
                : smtp?.reachable
                  ? "SMTP terhubung"
                  : smtp?.configured
                    ? "SMTP dikonfigurasi tapi tidak dapat dihubungi"
                    : "SMTP belum dikonfigurasi"}
            </span>
            <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
              {smtp?.configured
                ? `${smtp.host}:${smtp.port} · pengirim ${smtp.from}`
                : "Isi SMTP_HOST, SMTP_USER, SMTP_PASS di environment variables server"}
              {smtp?.error ? ` · ${smtp.error}` : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
          <Server className="w-3.5 h-3.5" />
          <span>Semua pengiriman lewat SMTP yang sama dengan email transaksional</span>
        </div>
      </div>

      <div className="flex gap-1.5 p-1 bg-slate-200/60 rounded-xl w-fit max-w-full overflow-x-auto">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setSection(id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold rounded-lg border-0 cursor-pointer whitespace-nowrap transition-all ${
              section === id ? "bg-white text-slate-900 shadow-sm font-extrabold" : "text-slate-600 hover:text-slate-900 hover:bg-white/30"
            }`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {section === "campaigns" && <EmailCampaignsPanel />}
      {section === "contacts" && <EmailContactsPanel />}
      {section === "templates" && <EmailTemplatesPanel />}
      {section === "analytics" && <EmailAnalyticsPanel />}
    </div>
  );
}

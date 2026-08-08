"use client";

/**
 * Contact list management: browse, filter, import, group, tag, suppress.
 *
 * The import flow is deliberately three steps (paste/upload → map columns →
 * confirm) rather than one. A one-click import of somebody's CSV is how you end
 * up with 400 contacts whose "name" is a phone number, and the only way to find
 * out is to send them all an email addressed to +6281234567890.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Users, Search, Upload, Download, Plus, Trash2, Tag, FolderPlus, X, Check,
  Ban, RotateCcw, AlertTriangle, Database, ChevronRight, Mail, Loader2,
} from "lucide-react";
import {
  listContacts, listGroups, listAllTags, saveGroup, deleteGroup, addToGroup, removeFromGroup,
  importContacts, importFromLeads, upsertContact, deleteContacts, setContactStatus,
  listSuppressions, removeSuppression, countContactsByStatus,
} from "../../lib/email/marketingClient";
import { parseCsv, guessMapping, mapRows, toCsv, IMPORT_FIELDS, type ImportFieldKey } from "../../lib/email/csv";
import type { EmailContact, EmailGroup } from "../../lib/email/types";

const STATUS_STYLES: Record<string, string> = {
  subscribed: "bg-emerald-50 text-emerald-700",
  unsubscribed: "bg-slate-100 text-slate-500",
  bounced: "bg-red-50 text-red-600",
  complained: "bg-orange-50 text-orange-600",
  cleaned: "bg-slate-100 text-slate-500",
};

const STATUS_LABELS: Record<string, string> = {
  subscribed: "Aktif",
  unsubscribed: "Berhenti",
  bounced: "Bounce",
  complained: "Spam",
  cleaned: "Dibersihkan",
};

type Panel = "contacts" | "groups" | "suppressions";

export default function EmailContactsPanel() {
  const [panel, setPanel] = useState<Panel>("contacts");
  const [contacts, setContacts] = useState<EmailContact[]>([]);
  const [groups, setGroups] = useState<EmailGroup[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [suppressions, setSuppressions] = useState<Array<{ email: string; reason: string; detail: string | null; created_at: string }>>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const [showImport, setShowImport] = useState(false);
  const [editContact, setEditContact] = useState<Partial<EmailContact> | null>(null);
  const [editGroup, setEditGroup] = useState<Partial<EmailGroup> | null>(null);

  const flash = useCallback((kind: "ok" | "error", text: string) => {
    setNotice({ kind, text });
    setTimeout(() => setNotice(null), 6000);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [c, g, t, k] = await Promise.all([
        listContacts({ search, status: statusFilter, groupId: groupFilter || undefined, tag: tagFilter || undefined }),
        listGroups(),
        listAllTags(),
        countContactsByStatus(),
      ]);
      setContacts(c);
      setGroups(g);
      setTags(t);
      setCounts(k);
      if (panel === "suppressions") setSuppressions(await listSuppressions());
    } catch (error) {
      flash("error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [flash, groupFilter, panel, search, statusFilter, tagFilter]);

  // Debounced so typing in the search box does not fire a query per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => void reload(), search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [reload, search]);

  const allSelected = contacts.length > 0 && selected.size === contacts.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(contacts.map((c) => c.id)));
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    try {
      await fn();
      await reload();
    } catch (error) {
      flash("error", (error as Error).message);
    } finally {
      setBusy("");
    }
  };

  const exportCsv = () => {
    const rows = contacts.map((c) => ({
      email: c.email, name: c.name, company: c.company, phone: c.phone,
      job_role: c.job_role, status: c.status, tags: c.tags, created_at: c.created_at,
    }));
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cargogrid-kontak-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const card = "nm-emboss bg-white rounded-2xl border-0";
  const chip = "px-2.5 py-1 text-[10px] font-bold rounded-lg border-0 cursor-pointer transition-all";

  return (
    <div className="space-y-5">
      {notice && (
        <div className={`p-3.5 rounded-xl text-xs font-bold border ${
          notice.kind === "ok" ? "bg-emerald-500/5 text-emerald-700 border-emerald-500/20" : "bg-red-500/5 text-red-600 border-red-500/20"
        }`}>
          {notice.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "TOTAL KONTAK", value: counts.total || 0, tone: "text-slate-900" },
          { label: "AKTIF", value: counts.subscribed || 0, tone: "text-emerald-600" },
          { label: "BERHENTI", value: counts.unsubscribed || 0, tone: "text-slate-500" },
          { label: "BOUNCE", value: counts.bounced || 0, tone: "text-red-600" },
          { label: "GRUP", value: groups.length, tone: "text-brand-teal" },
        ].map((stat) => (
          <div key={stat.label} className={`${card} p-4`}>
            <span className="font-mono text-[9px] font-black text-slate-400 tracking-wider block">{stat.label}</span>
            <span className={`text-2xl font-black block mt-0.5 ${stat.tone}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 p-1 bg-slate-200/60 rounded-xl">
          {([
            { id: "contacts", label: "Kontak", icon: Users },
            { id: "groups", label: "Grup", icon: FolderPlus },
            { id: "suppressions", label: "Daftar Blokir", icon: Ban },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => { setPanel(id); setSelected(new Set()); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-lg border-0 cursor-pointer transition-all ${
                panel === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {panel === "contacts" && (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover transition-all">
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
            <button type="button" onClick={() => setEditContact({ email: "", lang: "id", tags: [] })}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all">
              <Plus className="w-3.5 h-3.5" /> Kontak Baru
            </button>
            <button type="button" onClick={exportCsv} disabled={contacts.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all disabled:opacity-40">
              <Download className="w-3.5 h-3.5" /> Ekspor
            </button>
          </div>
        )}

        {panel === "groups" && (
          <button type="button" onClick={() => setEditGroup({ name: "", color: "teal" })}
            className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover transition-all">
            <Plus className="w-3.5 h-3.5" /> Grup Baru
          </button>
        )}
      </div>

      {/* CONTACTS ------------------------------------------------------------ */}
      {panel === "contacts" && (
        <>
          <div className={`${card} p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center`}>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari email, nama, atau perusahaan…"
                aria-label="Cari kontak"
                className="w-full nm-input bg-slate-50 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter status"
              className="nm-input bg-slate-50 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer">
              <option value="all">Semua status</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} aria-label="Filter grup"
              className="nm-input bg-slate-50 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer">
              <option value="">Semua grup</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name} ({g.member_count})</option>)}
            </select>
            <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} aria-label="Filter tag"
              className="nm-input bg-slate-50 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer">
              <option value="">Semua tag</option>
              {tags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {selected.size > 0 && (
            <div className={`${card} p-3 flex flex-wrap items-center gap-2`}>
              <span className="text-[11px] font-black text-slate-700 mr-1">{selected.size} dipilih</span>
              <select defaultValue="" aria-label="Tambahkan ke grup"
                onChange={(e) => {
                  const groupId = e.target.value;
                  e.target.selectedIndex = 0;
                  if (groupId) void run("group", async () => {
                    await addToGroup(groupId, Array.from(selected));
                    flash("ok", `${selected.size} kontak ditambahkan ke grup.`);
                    setSelected(new Set());
                  });
                }}
                className="nm-input bg-slate-50 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none">
                <option value="" disabled>+ Tambah ke grup…</option>
                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              {groupFilter && (
                <button type="button" className={`${chip} bg-slate-200 text-slate-700 hover:bg-slate-300`}
                  onClick={() => void run("ungroup", async () => {
                    await removeFromGroup(groupFilter, Array.from(selected));
                    flash("ok", "Dikeluarkan dari grup.");
                    setSelected(new Set());
                  })}>
                  Keluarkan dari grup ini
                </button>
              )}
              <button type="button" className={`${chip} bg-slate-200 text-slate-700 hover:bg-slate-300`}
                onClick={() => void run("unsub", async () => {
                  for (const id of selected) await setContactStatus(id, "unsubscribed", "manual admin");
                  flash("ok", "Ditandai berhenti berlangganan.");
                  setSelected(new Set());
                })}>
                <Ban className="w-3 h-3 inline mr-1" /> Berhentikan
              </button>
              <button type="button" className={`${chip} bg-red-50 text-red-600 hover:bg-red-100`}
                onClick={() => {
                  if (!confirm(`Hapus permanen ${selected.size} kontak? Riwayat pengiriman tetap tersimpan.`)) return;
                  void run("delete", async () => {
                    await deleteContacts(Array.from(selected));
                    flash("ok", `${selected.size} kontak dihapus.`);
                    setSelected(new Set());
                  });
                }}>
                <Trash2 className="w-3 h-3 inline mr-1" /> Hapus
              </button>
            </div>
          )}

          <div className={`${card} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-10">
                      <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Pilih semua"
                        className="w-3.5 h-3.5 accent-[#006d80] cursor-pointer" />
                    </th>
                    {["Kontak", "Perusahaan", "Status", "Tag", "Kirim / Buka", "Aksi"].map((h) => (
                      <th key={h} className="p-3 text-[9px] font-black font-mono uppercase tracking-wider text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={7} className="p-8 text-center text-xs font-bold text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Memuat kontak…
                    </td></tr>
                  )}
                  {!loading && contacts.length === 0 && (
                    <tr><td colSpan={7} className="p-10 text-center">
                      <Users className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-500">Belum ada kontak yang cocok.</p>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">
                        Import CSV, atau tarik langsung dari tabel prospek lewat tombol Import.
                      </p>
                    </td></tr>
                  )}
                  {!loading && contacts.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleOne(c.id)}
                          aria-label={`Pilih ${c.email}`} className="w-3.5 h-3.5 accent-[#006d80] cursor-pointer" />
                      </td>
                      <td className="p-3">
                        <span className="block text-xs font-black text-slate-800">{c.name || "—"}</span>
                        <span className="block text-[10px] font-mono text-slate-500">{c.email}</span>
                      </td>
                      <td className="p-3 text-[11px] font-semibold text-slate-600">{c.company || "—"}</td>
                      <td className="p-3">
                        <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${STATUS_STYLES[c.status]}`}>
                          {STATUS_LABELS[c.status]}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(c.tags || []).slice(0, 3).map((t) => (
                            <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-teal/10 text-brand-teal">{t}</span>
                          ))}
                          {(c.tags || []).length > 3 && <span className="text-[9px] font-bold text-slate-400">+{c.tags.length - 3}</span>}
                        </div>
                      </td>
                      <td className="p-3 text-[10px] font-mono font-bold text-slate-500">
                        {c.sent_count} / {c.open_count}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => setEditContact(c)} title="Ubah"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-teal hover:bg-slate-100 border-0 bg-transparent cursor-pointer">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          {c.status !== "subscribed" && (
                            <button type="button" title="Aktifkan kembali"
                              onClick={() => void run("resub", async () => {
                                await setContactStatus(c.id, "subscribed");
                                flash("ok", `${c.email} diaktifkan kembali.`);
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 border-0 bg-transparent cursor-pointer">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {contacts.length >= 500 && (
              <p className="p-3 text-[10px] font-bold text-amber-700 bg-amber-50 border-t border-amber-100">
                Menampilkan 500 kontak pertama. Persempit dengan filter untuk melihat sisanya — jumlah penerima
                kampanye tetap dihitung dari seluruh database, bukan dari daftar ini.
              </p>
            )}
          </div>
        </>
      )}

      {/* GROUPS -------------------------------------------------------------- */}
      {panel === "groups" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.length === 0 && !loading && (
            <div className={`${card} p-10 text-center md:col-span-2 xl:col-span-3`}>
              <FolderPlus className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Belum ada grup.</p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                Grup adalah daftar statis. Untuk segmentasi dinamis, pakai tag pada kontak.
              </p>
            </div>
          )}
          {groups.map((g) => (
            <div key={g.id} className={`${card} p-5`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-display font-black text-sm text-slate-900">{g.name}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-relaxed">
                    {g.description || "Tanpa deskripsi"}
                  </p>
                </div>
                <span className="text-[9px] font-mono font-black px-2 py-1 rounded-full bg-brand-teal/10 text-brand-teal whitespace-nowrap">
                  {g.member_count} kontak
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => { setGroupFilter(g.id); setPanel("contacts"); }}
                  className="flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border-0 cursor-pointer bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                  Lihat Anggota
                </button>
                <button type="button" onClick={() => setEditGroup(g)}
                  className="px-3 py-2 text-[10px] font-bold rounded-lg border-0 cursor-pointer bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                  Ubah
                </button>
                <button type="button"
                  onClick={() => {
                    if (!confirm(`Hapus grup "${g.name}"? Kontaknya tidak ikut terhapus.`)) return;
                    void run("delgroup", async () => { await deleteGroup(g.id); flash("ok", "Grup dihapus."); });
                  }}
                  className="px-3 py-2 rounded-lg border-0 cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUPPRESSIONS -------------------------------------------------------- */}
      {panel === "suppressions" && (
        <div className={`${card} overflow-hidden`}>
          <div className="p-4 bg-amber-50 border-b border-amber-100 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-semibold text-amber-800 leading-relaxed">
              Alamat di daftar ini tidak akan pernah masuk antrean kampanye, bahkan jika di-import ulang dari CSV
              baru. Itu disengaja: alamat yang hard-bounce atau melapor spam merusak reputasi domain pengirim
              setiap kali dikirimi ulang. Hapus dari daftar hanya jika Anda yakin alamatnya sudah benar.
            </p>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{["Email", "Alasan", "Detail", "Tanggal", ""].map((h) => (
                <th key={h} className="p-3 text-[9px] font-black font-mono uppercase tracking-wider text-slate-400">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {suppressions.length === 0 && (
                <tr><td colSpan={5} className="p-10 text-center text-xs font-bold text-slate-400">
                  Daftar blokir kosong — belum ada bounce, komplain, atau unsubscribe.
                </td></tr>
              )}
              {suppressions.map((s) => (
                <tr key={s.email} className="border-b border-slate-100">
                  <td className="p-3 text-[11px] font-mono font-bold text-slate-700">{s.email}</td>
                  <td className="p-3">
                    <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{s.reason}</span>
                  </td>
                  <td className="p-3 text-[10px] text-slate-500 font-semibold max-w-xs truncate">{s.detail || "—"}</td>
                  <td className="p-3 text-[10px] font-mono text-slate-400">{new Date(s.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="p-3">
                    <button type="button"
                      onClick={() => void run("unsuppress", async () => {
                        await removeSuppression(s.email);
                        flash("ok", `${s.email} dikeluarkan dari daftar blokir.`);
                      })}
                      className="text-[10px] font-black text-brand-teal hover:underline border-0 bg-transparent cursor-pointer">
                      Keluarkan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showImport && (
        <ImportDialog
          groups={groups}
          onClose={() => setShowImport(false)}
          onDone={(message) => { setShowImport(false); flash("ok", message); void reload(); }}
          onError={(message) => flash("error", message)}
        />
      )}

      {editContact && (
        <ContactDialog
          contact={editContact}
          onClose={() => setEditContact(null)}
          onSave={async (contact) => {
            await upsertContact(contact);
            setEditContact(null);
            flash("ok", "Kontak disimpan.");
            void reload();
          }}
          onError={(message) => flash("error", message)}
        />
      )}

      {editGroup && (
        <GroupDialog
          group={editGroup}
          onClose={() => setEditGroup(null)}
          onSave={async (group) => {
            await saveGroup(group);
            setEditGroup(null);
            flash("ok", "Grup disimpan.");
            void reload();
          }}
          onError={(message) => flash("error", message)}
        />
      )}

      {busy && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-[11px] font-bold shadow-xl">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memproses…
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Import dialog
// -----------------------------------------------------------------------------

function ImportDialog({
  groups, onClose, onDone, onError,
}: {
  groups: EmailGroup[];
  onClose: () => void;
  onDone: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ReturnType<typeof parseCsv> | null>(null);
  const [mapping, setMapping] = useState<Record<number, ImportFieldKey | "">>({});
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [extraTags, setExtraTags] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const analyse = (text: string) => {
    const result = parseCsv(text);
    if (result.headers.length === 0) {
      onError("File tidak berisi data yang bisa dibaca.");
      return;
    }
    setParsed(result);
    setMapping(guessMapping(result.headers));
    setStep(2);
  };

  const preview = useMemo(() => (parsed ? mapRows(parsed, mapping) : null), [mapping, parsed]);
  const hasEmail = Object.values(mapping).includes("email");

  const confirm = async () => {
    if (!preview || preview.contacts.length === 0) return;
    setBusy(true);
    try {
      const tags = extraTags.split(",").map((t) => t.trim()).filter(Boolean);
      const result = await importContacts(preview.contacts, groupIds, tags, "csv");
      onDone(`Import selesai — ${result.inserted} kontak baru, ${result.updated} diperbarui, ${result.skipped} dilewati.`);
    } catch (error) {
      onError((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const pullLeads = async (source: "all" | "inquiries" | "tool_leads") => {
    setBusy(true);
    try {
      const result = await importFromLeads(source, groupIds);
      onDone(`Tarik prospek selesai — ${result.inserted} kontak baru, ${result.updated} diperbarui.`);
    } catch (error) {
      onError((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Import Kontak" onClose={onClose} wide>
      {step === 1 && (
        <div className="space-y-5">
          <div className="nm-deboss rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-brand-teal" />
              <h5 className="text-xs font-black text-slate-800">Tarik dari database CargoGrid</h5>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-3">
              Orang-orang ini sudah mengisi formulir di situs Anda sendiri, jadi ini daftar berbasis izin —
              bukan daftar beli. Alamat yang sudah ada akan diperbarui, tidak diduplikasi.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={busy} onClick={() => void pullLeads("inquiries")}
                className="px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover disabled:opacity-50 transition-all">
                Prospek (inquiries)
              </button>
              <button type="button" disabled={busy} onClick={() => void pullLeads("tool_leads")}
                className="px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover disabled:opacity-50 transition-all">
                Pengguna Kalkulator
              </button>
              <button type="button" disabled={busy} onClick={() => void pullLeads("all")}
                className="px-3 py-2 text-[10px] font-bold rounded-lg border-0 cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 transition-all">
                Semua Sumber
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-300" />
            <span className="text-[9px] font-black font-mono uppercase tracking-widest text-slate-400">atau dari CSV</span>
            <div className="flex-1 h-px bg-slate-300" />
          </div>

          <div className="space-y-3">
            <input ref={fileRef} type="file" accept=".csv,.txt,text/csv" className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => analyse(String(reader.result || ""));
                reader.readAsText(file, "utf-8");
              }} />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full py-8 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-brand-teal hover:bg-brand-teal/5 transition-all cursor-pointer flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-black text-slate-600">Pilih file CSV</span>
              <span className="text-[10px] text-slate-400 font-semibold">Pemisah koma, titik koma, atau tab — terdeteksi otomatis</span>
            </button>

            <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={5}
              placeholder={"Atau tempel langsung di sini:\nemail,nama,perusahaan\nbudi@firma.co.id,Budi,PT Firma"}
              aria-label="Tempel data CSV"
              className="w-full nm-input bg-slate-50 rounded-xl px-3 py-2.5 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-brand-teal" />
            <button type="button" disabled={!raw.trim()} onClick={() => analyse(raw)}
              className="w-full py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-40 transition-all">
              Baca Data Tempelan
            </button>
          </div>
        </div>
      )}

      {step === 2 && parsed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-600">
              {parsed.rows.length} baris terbaca — cocokkan tiap kolom ke field kontak.
            </p>
            <button type="button" onClick={() => setStep(1)}
              className="text-[10px] font-black text-brand-teal hover:underline border-0 bg-transparent cursor-pointer">
              ← Ganti data
            </button>
          </div>

          <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
            {parsed.headers.map((header, index) => (
              <div key={index} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50">
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-black text-slate-700 truncate">{header || `Kolom ${index + 1}`}</span>
                  <span className="block text-[10px] font-mono text-slate-400 truncate">
                    {parsed.rows[0]?.[index] || "(kosong)"}
                  </span>
                </div>
                <select value={mapping[index] || ""} aria-label={`Petakan kolom ${header}`}
                  onChange={(e) => setMapping({ ...mapping, [index]: e.target.value as ImportFieldKey | "" })}
                  className="nm-input bg-white rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none">
                  <option value="">— simpan sebagai field kustom —</option>
                  {IMPORT_FIELDS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider">Tag tambahan (opsional)</span>
              <input value={extraTags} onChange={(e) => setExtraTags(e.target.value)}
                placeholder="webinar-agustus, prioritas"
                className="w-full nm-input bg-white rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider">Masukkan ke grup (opsional)</span>
              <select multiple value={groupIds} aria-label="Grup tujuan"
                onChange={(e) => setGroupIds(Array.from(e.target.selectedOptions).map((o) => o.value))}
                className="w-full nm-input bg-white rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none h-[42px]">
                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </label>
          </div>

          {preview && (
            <div className={`p-3 rounded-xl text-[11px] font-bold ${
              hasEmail && preview.contacts.length > 0
                ? "bg-emerald-500/5 text-emerald-700 border border-emerald-500/20"
                : "bg-red-500/5 text-red-600 border border-red-500/20"
            }`}>
              {!hasEmail
                ? "Kolom Email belum dipetakan — wajib dipilih sebelum import."
                : `${preview.contacts.length} kontak valid siap di-import${preview.invalid > 0 ? `, ${preview.invalid} baris dilewati karena email tidak valid` : ""}.`}
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all">
              Batal
            </button>
            <button type="button" disabled={busy || !hasEmail || !preview?.contacts.length} onClick={() => void confirm()}
              className="flex-[2] py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover disabled:opacity-40 transition-all">
              {busy ? "Meng-import…" : `Import ${preview?.contacts.length || 0} Kontak`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// Contact + group dialogs
// -----------------------------------------------------------------------------

function ContactDialog({
  contact, onClose, onSave, onError,
}: {
  contact: Partial<EmailContact>;
  onClose: () => void;
  onSave: (contact: Partial<EmailContact> & { email: string }) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [form, setForm] = useState(contact);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof EmailContact, value: unknown) => setForm({ ...form, [key]: value });

  const submit = async () => {
    if (!form.email?.trim()) return onError("Email wajib diisi.");
    setBusy(true);
    try {
      await onSave({ ...form, email: form.email } as Partial<EmailContact> & { email: string });
    } catch (error) {
      onError((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal";
  const label = "text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider";

  return (
    <Modal title={contact.id ? "Ubah Kontak" : "Kontak Baru"} onClose={onClose}>
      <div className="space-y-3">
        <label className="flex flex-col gap-1.5">
          <span className={label}>Email *</span>
          <input value={form.email || ""} onChange={(e) => set("email", e.target.value)}
            type="email" placeholder="budi@perusahaan.co.id" className={field} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={label}>Nama</span>
            <input value={form.name || ""} onChange={(e) => set("name", e.target.value)} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>Perusahaan</span>
            <input value={form.company || ""} onChange={(e) => set("company", e.target.value)} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>Telepon</span>
            <input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>Jabatan</span>
            <input value={form.job_role || ""} onChange={(e) => set("job_role", e.target.value)} className={field} />
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className={label}>Tag (pisahkan dengan koma)</span>
          <input value={(form.tags || []).join(", ")}
            onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
            placeholder="forwarder, jakarta, prioritas" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>Catatan</span>
          <textarea value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} rows={2} className={field} />
        </label>
      </div>
      <div className="flex gap-2 pt-4">
        <button type="button" onClick={onClose}
          className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all">
          Batal
        </button>
        <button type="button" disabled={busy} onClick={() => void submit()}
          className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover disabled:opacity-50 transition-all">
          {busy ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </Modal>
  );
}

function GroupDialog({
  group, onClose, onSave, onError,
}: {
  group: Partial<EmailGroup>;
  onClose: () => void;
  onSave: (group: Partial<EmailGroup> & { name: string }) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [form, setForm] = useState(group);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!form.name?.trim()) return onError("Nama grup wajib diisi.");
    setBusy(true);
    try {
      await onSave(form as Partial<EmailGroup> & { name: string });
    } catch (error) {
      onError((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const field = "w-full nm-input bg-white rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-teal";

  return (
    <Modal title={group.id ? "Ubah Grup" : "Grup Baru"} onClose={onClose}>
      <div className="space-y-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider">Nama Grup *</span>
          <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Freight Forwarder Jakarta" className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[9px] text-slate-400 font-black font-mono uppercase tracking-wider">Deskripsi</span>
          <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2} placeholder="Untuk siapa grup ini, dan kapan dipakai." className={field} />
        </label>
      </div>
      <div className="flex gap-2 pt-4">
        <button type="button" onClick={onClose}
          className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all">
          Batal
        </button>
        <button type="button" disabled={busy} onClick={() => void submit()}
          className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer bg-brand-teal text-white hover:bg-brand-teal-hover disabled:opacity-50 transition-all">
          {busy ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </Modal>
  );
}

export function Modal({
  title, children, onClose, wide,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}>
      <div className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} nm-emboss bg-[#eaf0f6] rounded-2xl p-6 border-0 my-8`}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-black text-base text-slate-900">{title}</h4>
          <button type="button" onClick={onClose} aria-label="Tutup"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 border-0 bg-transparent cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

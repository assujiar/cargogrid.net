"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ImageIcon, ImageOff, X } from "lucide-react";
import {
  archetypesByClass,
  classLabel,
  VEHICLE_ARCHETYPES,
  VEHICLE_CLASS_ORDER,
  type VehicleArchetype,
} from "../../content/reference/vehicles";
import { formatNumber } from "../../lib/logistics/volume";
import { useLanguage } from "../shared/LanguageProvider";

/**
 * Card-based browser for the 61-archetype fleet taxonomy, replacing the
 * class-by-class table.
 *
 * A table forces a horizontal scroll on every phone and hides the one thing
 * that actually differentiates 61 rows of similar-looking specs: what the
 * unit looks like. Cards fix both at once -- the essentials stay in one
 * glance and the illustration is one tap away instead of absent -- at the
 * cost of needing client state (category filter, dialog open/close) that the
 * old table never touched.
 *
 * Illustrations live at public/fleet-illustration/<id>.png. Three archetypes
 * (CV007, CV042, CV055) don't have one yet -- their source uploads arrived
 * corrupted -- so the button degrades to a disabled state instead of the
 * whole page assuming a file that isn't there.
 */

const MISSING_ILLUSTRATION = new Set(["CV007", "CV042", "CV055"]);

function illustrationSrc(id: string): string | null {
  return MISSING_ILLUSTRATION.has(id) ? null : `/fleet-illustration/${id}.png`;
}

/**
 * One spec, as a label/value row rather than a boxed tile.
 *
 * Tiles in a grid have a fixed width, and several archetypes carry values
 * that simply do not fit one -- "6x4/8x4 + multi-axle", "multi-axle lines",
 * "N/A / site". Clipping them with `truncate` hid the part that
 * distinguishes a heavy-haul prime mover from an SPMT, which is exactly the
 * information the row exists to carry. A row lets the value wrap and take
 * the height it needs, so the card survives both the narrow column and the
 * longest string in the taxonomy.
 */
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-slate-300/40 py-2 last:border-0">
      <span className="flex-shrink-0 font-mono text-[8px] font-black uppercase tracking-[0.1em] text-slate-400">
        {label}
      </span>
      <span className="text-right text-[12px] font-bold leading-[1.5] text-slate-800">{value}</span>
    </div>
  );
}

/**
 * `compact` is what a card shows, the full list is what the dialog shows.
 *
 * A card's job is to let someone rule an archetype in or out while
 * scanning 61 of them, and the two figures that actually do that are how
 * many axles it runs and how much it carries. Toll and ferry class matter
 * when costing a route, which is a different task performed on one chosen
 * vehicle -- so they wait behind the button rather than competing for
 * attention in every card.
 */
function SpecList({ vehicle, isEn, compact = false }: { vehicle: VehicleArchetype; isEn: boolean; compact?: boolean }) {
  return (
    <div className="nm-deboss-sm rounded-xl px-3.5 py-0.5">
      {!compact && <SpecRow label={isEn ? "Configuration" : "Konfigurasi"} value={vehicle.axleConfig} />}
      <SpecRow label={isEn ? "Axles" : "Gandar"} value={vehicle.totalAxles} />
      <SpecRow
        label={isEn ? "Est. payload" : "Perkiraan muatan"}
        value={`${formatNumber(vehicle.planningPayload.min)}-${formatNumber(vehicle.planningPayload.max)} t`}
      />
      {!compact && <SpecRow label={isEn ? "Toll class" : "Gol. tol"} value={vehicle.tollClass} />}
      {!compact && <SpecRow label={isEn ? "Ferry class" : "Gol. kapal"} value={vehicle.ferryClass} />}
    </div>
  );
}

function VehicleCard({
  vehicle,
  isEn,
  onOpenIllustration,
}: {
  vehicle: VehicleArchetype;
  isEn: boolean;
  onOpenIllustration: (v: VehicleArchetype) => void;
}) {
  const hasIllustration = illustrationSrc(vehicle.id) !== null;

  return (
    <div className="nm-emboss flex h-full flex-col gap-4 rounded-2xl bg-[#eef2f6]/60 p-5">
      <div>
        <p className="font-mono text-[9px] font-black uppercase tracking-[0.12em] text-brand-teal">{vehicle.legalCategory}</p>
        <h3 className="mt-1.5 font-display text-[15px] font-bold leading-snug text-slate-900">
          {isEn ? vehicle.marketNamesEn : vehicle.marketNames}
        </h3>
        <p className="mt-1 text-[12px] leading-[1.6] text-slate-500">{isEn ? vehicle.commercialTypeEn : vehicle.commercialType}</p>
      </div>

      <SpecList vehicle={vehicle} isEn={isEn} compact />

      <button
        type="button"
        onClick={() => onOpenIllustration(vehicle)}
        disabled={!hasIllustration}
        aria-haspopup="dialog"
        className={`mt-auto inline-flex min-h-[2.5rem] items-center justify-center gap-2 rounded-full px-4 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
          hasIllustration ? "nm-btn cursor-pointer text-slate-700 hover:text-brand-teal" : "cursor-not-allowed text-slate-400"
        }`}
      >
        {hasIllustration ? <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" /> : <ImageOff className="h-3.5 w-3.5" aria-hidden="true" />}
        {hasIllustration ? (isEn ? "View illustration" : "Lihat ilustrasi") : isEn ? "Illustration not available" : "Ilustrasi belum tersedia"}
      </button>
    </div>
  );
}

function IllustrationDialog({
  vehicle,
  isEn,
  isClosing,
  onClose,
}: {
  vehicle: VehicleArchetype | null;
  isEn: boolean;
  isClosing: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!vehicle) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle]);

  if (!vehicle) return null;
  const src = illustrationSrc(vehicle.id);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="fleet-dialog-title">
      <div
        className={`absolute inset-0 bg-navy-dark/85 ${isClosing ? "backdrop-animate-out" : "backdrop-animate-in"}`}
        onClick={onClose}
      />

      <div
        className={`relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl nm-emboss-lg bg-white/85 ${
          isClosing ? "modal-animate-out" : "modal-animate-in"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/50 p-5 sm:p-6">
          <div>
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.14em] text-brand-teal">
              {isEn ? vehicle.mainClass : classLabel(vehicle.mainClass)}
            </p>
            <h3 id="fleet-dialog-title" className="mt-1 font-display text-lg font-black text-slate-900 sm:text-xl">
              {isEn ? vehicle.marketNamesEn : vehicle.marketNames}
            </h3>
            <p className="mt-1 text-[12px] text-slate-500">{isEn ? vehicle.commercialTypeEn : vehicle.commercialType}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? "Close" : "Tutup"}
            className="flex-shrink-0 cursor-pointer rounded-full border-0 p-2 text-slate-400 transition-all hover:text-red-500 hover:shadow-[inset_4px_4px_10px_#cdd4db,inset_-4px_-4px_10px_#ffffff]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="nm-deboss overflow-hidden rounded-2xl bg-white/60" style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
            {src ? (
              <Image
                src={src}
                alt={`${isEn ? "Illustration of" : "Ilustrasi"} ${isEn ? vehicle.marketNamesEn : vehicle.marketNames}, ${isEn ? vehicle.commercialTypeEn : vehicle.commercialType}`}
                fill
                sizes="(min-width: 640px) 640px, 100vw"
                style={{ objectFit: "contain" }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <ImageOff className="h-8 w-8 text-slate-400" aria-hidden="true" />
                <p className="max-w-xs text-sm text-slate-500">
                  {isEn ? "This archetype's illustration isn't available yet." : "Ilustrasi kelas armada ini belum tersedia."}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5">
            <SpecList vehicle={vehicle} isEn={isEn} />
          </div>

          <p className="mt-5 text-[13px] leading-[1.75] text-slate-600">{isEn ? vehicle.notesEn : vehicle.notes}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function FleetExplorer() {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const [activeClass, setActiveClass] = useState<string>("semua");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleArchetype | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = selectedVehicle ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedVehicle]);

  const groups = useMemo(() => {
    return VEHICLE_CLASS_ORDER.filter((cls) => activeClass === "semua" || activeClass === cls)
      .map((cls) => ({ cls, items: archetypesByClass(cls) }))
      .filter((group) => group.items.length > 0);
  }, [activeClass]);

  function handleOpenIllustration(vehicle: VehicleArchetype) {
    setSelectedVehicle(vehicle);
    setIsClosing(false);
  }

  function handleCloseDialog() {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedVehicle(null);
      setIsClosing(false);
    }, 500);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="nm-emboss rounded-3xl bg-[#eef2f6]/60 p-5 sm:p-6">
        <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveClass("semua")}
            aria-pressed={activeClass === "semua"}
            className={`min-h-[2.25rem] flex-shrink-0 snap-start rounded-full px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
              activeClass === "semua" ? "nm-btn-accent" : "nm-btn text-slate-600"
            }`}
          >
            {isEn ? "All classes" : "Semua kelas"} ({VEHICLE_ARCHETYPES.length})
          </button>
          {VEHICLE_CLASS_ORDER.map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setActiveClass(cls)}
              aria-pressed={activeClass === cls}
              className={`min-h-[2.25rem] flex-shrink-0 snap-start rounded-full px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                activeClass === cls ? "nm-btn-accent" : "nm-btn text-slate-600"
              }`}
            >
              {isEn ? cls : classLabel(cls)}
            </button>
          ))}
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.cls}>
          {activeClass === "semua" && (
            <h2 className="mb-5 flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              {isEn ? group.cls : classLabel(group.cls)}
              <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
              <span className="text-slate-400">{group.items.length}</span>
            </h2>
          )}
          {/* Two-up at every width above phones: this grid now lives inside
              ToolShell's narrower instrument column, where a third card
              would squeeze each one below the width its longest spec value
              needs. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {group.items.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} isEn={isEn} onOpenIllustration={handleOpenIllustration} />
            ))}
          </div>
        </div>
      ))}

      <IllustrationDialog vehicle={selectedVehicle} isEn={isEn} isClosing={isClosing} onClose={handleCloseDialog} />
    </div>
  );
}

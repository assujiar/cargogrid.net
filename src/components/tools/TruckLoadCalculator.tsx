"use client";

import React, { useMemo, useState } from "react";
import { Truck, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { checkCompliance, planLoad, type ComplianceLevel } from "../../lib/logistics/truckLoad";
import { formatNumber, type LengthUnit } from "../../lib/logistics/volume";
import { classLabel, loadableArchetypes, VEHICLE_CLASS_ORDER } from "../../content/reference/vehicles";
import { ROAD_CLASSES } from "../../content/reference/regulations";
import { FieldLabel, NumberField, ResultCard, ResultGrid, ToggleField, ToolPanel } from "./controls";

const UNITS: { value: LengthUnit; label: string }[] = [
  { value: "cm", label: "cm" },
  { value: "m", label: "m" },
  { value: "mm", label: "mm" },
];

const FLEET = loadableArchetypes();

/**
 * Options are grouped by vehicle class in the plain-Indonesian names people
 * actually use. The dataset's own keys stay English so results can be traced
 * back to the research they came from, but none of that vocabulary belongs in
 * front of a visitor — a dropdown reading "Semi-trailer Body" reads like a
 * leaked internal document rather than a tool.
 */
const GROUPED = VEHICLE_CLASS_ORDER.map((cls) => ({
  label: classLabel(cls),
  items: FLEET.filter((v) => v.mainClass === cls),
})).filter((group) => group.items.length > 0);

const LEVEL_STYLE: Record<ComplianceLevel, { wrap: string; icon: React.ReactNode }> = {
  ok: { wrap: "nm-deboss", icon: <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" /> },
  periksa: {
    wrap: "nm-deboss ring-1 ring-brand-orange/25",
    icon: <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />,
  },
  langgar: {
    wrap: "nm-emboss-orange bg-brand-orange/5",
    icon: <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />,
  },
};

export default function TruckLoadCalculator() {
  const [vehicleId, setVehicleId] = useState(FLEET.find((v) => v.marketNames.startsWith("CDD /"))?.id || FLEET[0].id);
  const vehicle = FLEET.find((v) => v.id === vehicleId) || FLEET[0];

  const [roadClassCode, setRoadClassCode] = useState(ROAD_CLASSES[0].code);
  const roadClass = ROAD_CLASSES.find((r) => r.code === roadClassCode) || ROAD_CLASSES[0];

  const [carton, setCarton] = useState({ length: 60, width: 40, height: 40, unit: "cm" as LengthUnit });
  const [weightPerCarton, setWeightPerCarton] = useState(20);
  const [desiredQuantity, setDesiredQuantity] = useState(500);
  const [allowRotation, setAllowRotation] = useState(true);

  // Body and payload seed from the picked class and are then owned by the user.
  // Karoseri bodies differ enough between builds of the same nominal truck that
  // a locked spec table would be a liability rather than a convenience.
  const [body, setBody] = useState(vehicle.cargo!);
  const [payloadKg, setPayloadKg] = useState(Math.round(vehicle.planningPayload.max * 1000));

  function pickVehicle(id: string) {
    const next = FLEET.find((v) => v.id === id);
    if (!next || !next.cargo) return;
    setVehicleId(id);
    setBody(next.cargo);
    setPayloadKg(Math.round(next.planningPayload.max * 1000));
  }

  const plan = useMemo(
    () => planLoad({ carton, weightPerCarton, body, payloadKg, desiredQuantity, allowRotation }),
    [carton, weightPerCarton, body, payloadKg, desiredQuantity, allowRotation],
  );

  const compliance = useMemo(
    () =>
      checkCompliance({
        vehicle,
        roadClass,
        loadedWeightKg: plan.loadedWeight,
        payloadLimitKg: payloadKg,
        bodyWidthM: body.width,
      }),
    [vehicle, roadClass, plan.loadedWeight, payloadKg, body.width],
  );

  const limitCopy = {
    volume: {
      title: "Ruang yang lebih dulu habis",
      body: "Bak penuh sementara timbangan masih longgar. Yang menolong adalah kemasan yang lebih rapat atau bak yang lebih besar — menambah unit hanya memindahkan udara.",
    },
    weight: {
      title: "Berat yang lebih dulu mentok",
      body: "Batas muat tercapai sementara bak masih lapang. Penataan ulang tidak akan menolong sama sekali; yang dibutuhkan unit tambahan atau pemecahan kiriman.",
    },
    both: {
      title: "Ruang dan berat habis bersamaan",
      body: "Kombinasi kardus dan armada ini sudah pas. Catat sebagai acuan untuk kiriman serupa.",
    },
    none: {
      title: "Kardus tidak muat",
      body: "Dengan arah yang diizinkan sekarang, satu kardus pun tidak masuk ke dalam bak. Periksa satuan yang dipakai, lalu coba izinkan kardus direbahkan.",
    },
  }[plan.limitedBy];

  return (
    <ToolPanel>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <FieldLabel htmlFor="vehicle">Armada</FieldLabel>
            <select
              id="vehicle"
              value={vehicleId}
              onChange={(e) => pickVehicle(e.target.value)}
              className="nm-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              {GROUPED.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.items.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.marketNames} — {v.commercialType}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="mt-2 text-[12px] leading-[1.7] text-slate-500">
              {vehicle.notes} Perkiraan kapasitas kelas ini {formatNumber(vehicle.planningPayload.min)}–
              {formatNumber(vehicle.planningPayload.max)} ton
              {vehicle.planningVolume
                ? `, ruang muat ${formatNumber(vehicle.planningVolume.min)}–${formatNumber(vehicle.planningVolume.max)} m³`
                : ""}
              .
            </p>
          </div>

          <div>
            <FieldLabel htmlFor="roadclass">Kelas jalan pada rute</FieldLabel>
            <select
              id="roadclass"
              value={roadClassCode}
              onChange={(e) => setRoadClassCode(e.target.value)}
              className="nm-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              {ROAD_CLASSES.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.code} — lebar maks {r.maxWidthM} m, panjang maks {r.maxLengthM} m, MST {r.mstTon} ton
                </option>
              ))}
            </select>
            <p className="mt-2 text-[12px] leading-[1.7] text-slate-500">{roadClass.note}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Panjang bak" value={body.length} onChange={(v) => setBody({ ...body, length: v })} min={0} step={0.1} suffix="m" />
            <NumberField label="Lebar bak" value={body.width} onChange={(v) => setBody({ ...body, width: v })} min={0} step={0.1} suffix="m" />
            <NumberField label="Tinggi bak" value={body.height} onChange={(v) => setBody({ ...body, height: v })} min={0} step={0.1} suffix="m" />
          </div>

          <NumberField
            label="Batas berat muatan"
            value={payloadKg}
            onChange={setPayloadKg}
            min={0}
            step={100}
            suffix="kg"
            hint="Angka pastinya adalah JBI pada dokumen kendaraan dikurangi berat kosong unit setelah karoseri terpasang."
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Panjang kardus" value={carton.length} onChange={(v) => setCarton({ ...carton, length: v })} min={0} step={1} />
            <NumberField label="Lebar kardus" value={carton.width} onChange={(v) => setCarton({ ...carton, width: v })} min={0} step={1} />
            <NumberField label="Tinggi kardus" value={carton.height} onChange={(v) => setCarton({ ...carton, height: v })} min={0} step={1} />
            <div>
              <FieldLabel htmlFor="carton-unit">Satuan kardus</FieldLabel>
              <select
                id="carton-unit"
                value={carton.unit}
                onChange={(e) => setCarton({ ...carton, unit: e.target.value as LengthUnit })}
                className="nm-input w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
            <NumberField label="Berat per kardus" value={weightPerCarton} onChange={setWeightPerCarton} min={0} step={0.5} suffix="kg" />
            <NumberField label="Total kardus dikirim" value={desiredQuantity} onChange={setDesiredQuantity} min={0} step={10} />
          </div>

          <ToggleField
            label="Kardus boleh direbahkan"
            checked={allowRotation}
            onChange={setAllowRotation}
            hint="Matikan untuk barang bertanda this way up yang tidak boleh dibalik."
          />
        </div>
      </div>

      <ResultGrid>
        <ResultCard label="Muat per unit" value={`${formatNumber(plan.maxCartons, 0)} kardus`} hint={`${plan.perLayer} per lapis × ${plan.layers} lapis`} emphasis />
        <ResultCard label="Batas ruang" value={`${formatNumber(plan.fitByVolume, 0)} kardus`} hint={`Bak ${formatNumber(plan.bodyCbm, 1)} m³`} />
        <ResultCard label="Batas berat" value={`${formatNumber(plan.fitByWeight, 0)} kardus`} hint={`Muatan ${formatNumber(plan.loadedWeight)} kg`} />
        <ResultCard
          label="Unit dibutuhkan"
          value={plan.trucksNeeded ? `${plan.trucksNeeded} unit` : "—"}
          hint={plan.remainderCartons ? `${plan.remainderCartons} kardus di unit terakhir` : "Isi jumlah kiriman"}
          emphasis
        />
      </ResultGrid>

      <div
        className={`mt-5 flex items-start gap-4 rounded-2xl p-5 ${
          plan.limitedBy === "none" ? "nm-emboss-orange bg-brand-orange/5" : "nm-deboss"
        }`}
      >
        {plan.limitedBy === "none" ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />
        ) : (
          <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" />
        )}
        <div>
          <p className="font-display text-sm font-bold text-slate-900">{limitCopy.title}</p>
          <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">{limitCopy.body}</p>
          {plan.limitedBy !== "none" && (
            <p className="mt-3 font-mono text-[11px] font-bold text-slate-500">
              Pemakaian ruang {formatNumber(plan.volumeUtilisation * 100, 0)}% · pemakaian berat{" "}
              {formatNumber(plan.weightUtilisation * 100, 0)}%
            </p>
          )}
        </div>
      </div>

      {/* Compliance sits below the load plan, not beside it: the arithmetic
          answers "how many fit", and this answers "may it travel" — a second
          question that only becomes relevant once there is a plan to check. */}
      <section aria-labelledby="kepatuhan" className="mt-8">
        <h3 id="kepatuhan" className="mb-4 flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
          Yang perlu diperiksa sebelum berangkat
          <span aria-hidden="true" className="h-px flex-1 bg-slate-300/60" />
        </h3>
        <div className="flex flex-col gap-3">
          {compliance.map((item) => (
            <div key={item.title} className={`flex items-start gap-4 rounded-2xl p-5 ${LEVEL_STYLE[item.level].wrap}`}>
              {LEVEL_STYLE[item.level].icon}
              <div>
                <p className="font-display text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-600">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ToolPanel>
  );
}

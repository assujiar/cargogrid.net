"use client";

import React, { useMemo, useState } from "react";
import { Truck, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { checkCompliance, planLoad, type ComplianceLevel } from "../../lib/logistics/truckLoad";
import { formatNumber, type LengthUnit } from "../../lib/logistics/volume";
import { classLabel, loadableArchetypes, VEHICLE_CLASS_ORDER } from "../../content/reference/vehicles";
import { ROAD_CLASSES } from "../../content/reference/regulations";
import { NumberField, ResultCard, ResultGrid, SelectField, ToggleField, ToolPanel } from "./controls";
import { useLanguage } from "../shared/LanguageProvider";

const TIPS = {
  vehicle:
    "Pilih kelas armada yang akan dipakai. Ukuran bak dan batas berat di bawahnya langsung menyesuaikan, dan tetap bisa Anda ubah.",
  roadClass:
    "Kelas jalan pada ruas tersempit yang dilewati, karena ruas itulah yang membatasi. Bila belum tahu, tanyakan ke dinas perhubungan setempat atau ke sopir yang biasa melewatinya.",
  bodyLength: "Panjang ruang muat bagian dalam, bukan panjang kendaraan. Ukur dari dinding depan ke pintu belakang.",
  bodyWidth: "Lebar ruang muat bagian dalam, diukur di antara kedua dinding bak.",
  bodyHeight: "Tinggi ruang muat bagian dalam, dari lantai bak ke titik terendah atap.",
  payload:
    "Berat muatan maksimum yang Anda pakai sebagai batas. Angka pastinya: JBI di STNK dikurangi berat kosong unit setelah karoseri.",
  cartonLength: "Panjang kardus bagian luar. Ukur kemasannya, bukan barang di dalamnya.",
  cartonWidth: "Lebar kardus bagian luar.",
  cartonHeight: "Tinggi kardus bagian luar, termasuk palet bila barang dipaletkan.",
  cartonUnit: "Satuan untuk ketiga ukuran kardus. Ukuran ruang muat truk selalu dalam meter, terpisah dari pilihan ini.",
  cartonWeight: "Berat satu kardus sesuai timbangan, sudah termasuk kemasannya.",
  quantity: "Total kardus yang akan dikirim. Dipakai menghitung berapa unit truk yang dibutuhkan.",
  rotation:
    "Aktif berarti kardus boleh direbahkan atau diputar agar lebih banyak yang muat. Matikan untuk barang yang tidak boleh dibalik.",
} as const;

const TIPS_EN = {
  vehicle: "Choose the fleet class to use. The body size and weight limit below adjust immediately, and you can still edit them.",
  roadClass:
    "The road class of the narrowest segment on the route, since that's what actually limits you. If you don't know it, ask the local transport office or a driver who regularly runs that route.",
  bodyLength: "The interior load space length, not the vehicle's overall length. Measure from the front wall to the rear door.",
  bodyWidth: "The interior load space width, measured between the two side walls.",
  bodyHeight: "The interior load space height, from the floor to the lowest point of the roof.",
  payload: "The maximum load weight you're using as a limit. The exact figure: the JBI on the STNK minus the unit's tare weight after the body is fitted.",
  cartonLength: "The outer length of the box. Measure the packaging, not the item inside it.",
  cartonWidth: "The outer width of the box.",
  cartonHeight: "The outer height of the box, including the pallet if the goods are palletized.",
  cartonUnit: "The unit for the three carton dimensions. The truck's load space is always in meters, independent of this choice.",
  cartonWeight: "The weight of one box as it comes off the scale, packaging included.",
  quantity: "The total number of boxes being shipped. Used to work out how many truck units are needed.",
  rotation: "On means boxes may be laid down or rotated to fit more in. Turn off for goods that must not be turned over.",
} as const;

const UNITS: { value: LengthUnit; label: string; labelEn: string }[] = [
  { value: "cm", label: "sentimeter (cm)", labelEn: "centimeter (cm)" },
  { value: "m", label: "meter (m)", labelEn: "meter (m)" },
  { value: "mm", label: "milimeter (mm)", labelEn: "millimeter (mm)" },
];

const FLEET = loadableArchetypes();

/**
 * Options are grouped by vehicle class in the plain names people actually
 * use -- plain Indonesian for the Indonesian UI, and the dataset's own
 * `mainClass` (already English, e.g. "Semi-trailer Body") for the English
 * one. A dropdown reading "Semi-trailer Body" in the middle of an Indonesian
 * page reads like a leaked internal document rather than a tool; in English
 * mode that same string is just the right label.
 */
function groupFleet(isEn: boolean) {
  return VEHICLE_CLASS_ORDER.map((cls) => ({
    label: isEn ? cls : classLabel(cls),
    items: FLEET.filter((v) => v.mainClass === cls),
  })).filter((group) => group.items.length > 0);
}

const LEVEL_STYLE: Record<ComplianceLevel, { wrap: string; icon: React.ReactNode }> = {
  ok: { wrap: "nm-deboss", icon: <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-teal" aria-hidden="true" /> },
  periksa: {
    wrap: "nm-deboss ring-1 ring-brand-orange/25",
    icon: <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />,
  },
  langgar: {
    wrap: "nm-emboss bg-white/60 ring-2 ring-brand-orange/35",
    icon: <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" aria-hidden="true" />,
  },
};

export default function TruckLoadCalculator() {
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const GROUPED = useMemo(() => groupFleet(isEn), [isEn]);
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
      checkCompliance(
        {
          vehicle,
          roadClass,
          loadedWeightKg: plan.loadedWeight,
          payloadLimitKg: payloadKg,
          bodyWidthM: body.width,
        },
        isEn,
      ),
    [vehicle, roadClass, plan.loadedWeight, payloadKg, body.width, isEn],
  );

  const limitCopy = (
    isEn
      ? {
          volume: {
            title: "Space runs out first",
            body: "The body is full while the scale still has headroom. What helps is tighter packing or a bigger body. Adding units just moves air.",
          },
          weight: {
            title: "Weight hits its limit first",
            body: "The load limit is reached while the body still has room. Rearranging won't help at all; what's needed is an extra unit or splitting the shipment.",
          },
          both: {
            title: "Space and weight run out together",
            body: "This carton-and-fleet combination is already well matched. Note it down as a reference for similar shipments.",
          },
          none: {
            title: "The carton doesn't fit",
            body: "With the orientation currently allowed, not even one carton fits in the body. Check the units used, then try allowing the carton to be laid down.",
          },
        }
      : {
          volume: {
            title: "Ruang yang lebih dulu habis",
            body: "Bak penuh sementara timbangan masih longgar. Yang menolong adalah kemasan yang lebih rapat atau bak yang lebih besar. Menambah unit hanya memindahkan udara.",
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
        }
  )[plan.limitedBy];

  return (
    <ToolPanel>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SelectField
            label={isEn ? "Fleet" : "Armada"}
            value={vehicleId}
            onChange={pickVehicle}
            tip={isEn ? TIPS_EN.vehicle : TIPS.vehicle}
            hint={
              isEn
                ? `${vehicle.notesEn} This class's estimated capacity is ${formatNumber(vehicle.planningPayload.min)} to ${formatNumber(vehicle.planningPayload.max)} tonnes${
                    vehicle.planningVolume
                      ? `, load space ${formatNumber(vehicle.planningVolume.min)} to ${formatNumber(vehicle.planningVolume.max)} m³`
                      : ""
                  }.`
                : `${vehicle.notes} Perkiraan kapasitas kelas ini ${formatNumber(vehicle.planningPayload.min)} sampai ${formatNumber(vehicle.planningPayload.max)} ton${
                    vehicle.planningVolume
                      ? `, ruang muat ${formatNumber(vehicle.planningVolume.min)} sampai ${formatNumber(vehicle.planningVolume.max)} m³`
                      : ""
                  }.`
            }
          >
            {GROUPED.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((v) => (
                  <option key={v.id} value={v.id}>
                    {isEn ? `${v.marketNamesEn} (${v.commercialTypeEn})` : `${v.marketNames} (${v.commercialType})`}
                  </option>
                ))}
              </optgroup>
            ))}
          </SelectField>

          <SelectField
            label={isEn ? "Road class on the route" : "Kelas jalan pada rute"}
            value={roadClassCode}
            onChange={setRoadClassCode}
            tip={isEn ? TIPS_EN.roadClass : TIPS.roadClass}
            hint={isEn ? roadClass.noteEn : roadClass.note}
          >
            {ROAD_CLASSES.map((r) => (
              <option key={r.code} value={r.code}>
                {isEn
                  ? `${r.codeEn}: max width ${r.maxWidthM} m, max length ${r.maxLengthM} m, MST ${r.mstTon} t`
                  : `${r.code}: lebar maks ${r.maxWidthM} m, panjang maks ${r.maxLengthM} m, MST ${r.mstTon} ton`}
              </option>
            ))}
          </SelectField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <NumberField label={isEn ? "Body length" : "Panjang bak"} value={body.length} onChange={(v) => setBody({ ...body, length: v })} min={0} step={0.1} suffix="m" tip={isEn ? TIPS_EN.bodyLength : TIPS.bodyLength} />
            <NumberField label={isEn ? "Body width" : "Lebar bak"} value={body.width} onChange={(v) => setBody({ ...body, width: v })} min={0} step={0.1} suffix="m" tip={isEn ? TIPS_EN.bodyWidth : TIPS.bodyWidth} />
            <NumberField label={isEn ? "Body height" : "Tinggi bak"} value={body.height} onChange={(v) => setBody({ ...body, height: v })} min={0} step={0.1} suffix="m" tip={isEn ? TIPS_EN.bodyHeight : TIPS.bodyHeight} />
          </div>

          <NumberField
            label={isEn ? "Payload limit" : "Batas berat muatan"}
            value={payloadKg}
            onChange={setPayloadKg}
            min={0}
            step={100}
            suffix="kg"
            tip={isEn ? TIPS_EN.payload : TIPS.payload}
            hint={
              isEn
                ? "The exact figure is the JBI on the vehicle's documents minus the unit's tare weight after the body is fitted."
                : "Angka pastinya adalah JBI pada dokumen kendaraan dikurangi berat kosong unit setelah karoseri terpasang."
            }
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumberField label={isEn ? "Carton length" : "Panjang kardus"} suffix={carton.unit} value={carton.length} onChange={(v) => setCarton({ ...carton, length: v })} min={0} step={1} tip={isEn ? TIPS_EN.cartonLength : TIPS.cartonLength} />
            <NumberField label={isEn ? "Carton width" : "Lebar kardus"} suffix={carton.unit} value={carton.width} onChange={(v) => setCarton({ ...carton, width: v })} min={0} step={1} tip={isEn ? TIPS_EN.cartonWidth : TIPS.cartonWidth} />
            <NumberField label={isEn ? "Carton height" : "Tinggi kardus"} suffix={carton.unit} value={carton.height} onChange={(v) => setCarton({ ...carton, height: v })} min={0} step={1} tip={isEn ? TIPS_EN.cartonHeight : TIPS.cartonHeight} />
            <SelectField
              label={isEn ? "Carton unit" : "Satuan kardus"}
              value={carton.unit}
              onChange={(v) => setCarton({ ...carton, unit: v as LengthUnit })}
              tip={isEn ? TIPS_EN.cartonUnit : TIPS.cartonUnit}
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {isEn ? u.labelEn : u.label}
                </option>
              ))}
            </SelectField>
            <NumberField label={isEn ? "Weight per carton" : "Berat per kardus"} value={weightPerCarton} onChange={setWeightPerCarton} min={0} step={0.5} suffix="kg" tip={isEn ? TIPS_EN.cartonWeight : TIPS.cartonWeight} />
            <NumberField label={isEn ? "Total cartons shipped" : "Total kardus dikirim"} value={desiredQuantity} onChange={setDesiredQuantity} min={0} step={10} suffix={isEn ? "pcs" : "kardus"} tip={isEn ? TIPS_EN.quantity : TIPS.quantity} />
          </div>

          <ToggleField
            label={isEn ? "Cartons may be laid down" : "Kardus boleh direbahkan"}
            checked={allowRotation}
            onChange={setAllowRotation}
            tip={isEn ? TIPS_EN.rotation : TIPS.rotation}
            hint={isEn ? "Turn off for goods marked \"this way up\" that must not be turned over." : "Matikan untuk barang bertanda this way up yang tidak boleh dibalik."}
          />
        </div>
      </div>

      <ResultGrid>
        <ResultCard
          label={isEn ? "Fits per unit" : "Muat per unit"}
          value={`${formatNumber(plan.maxCartons, 0)} ${isEn ? "cartons" : "kardus"}`}
          hint={isEn ? `${plan.perLayer} per layer × ${plan.layers} layers` : `${plan.perLayer} per lapis × ${plan.layers} lapis`}
          emphasis
        />
        <ResultCard
          label={isEn ? "Space limit" : "Batas ruang"}
          value={`${formatNumber(plan.fitByVolume, 0)} ${isEn ? "cartons" : "kardus"}`}
          hint={isEn ? `Body ${formatNumber(plan.bodyCbm, 1)} m³` : `Bak ${formatNumber(plan.bodyCbm, 1)} m³`}
        />
        <ResultCard
          label={isEn ? "Weight limit" : "Batas berat"}
          value={`${formatNumber(plan.fitByWeight, 0)} ${isEn ? "cartons" : "kardus"}`}
          hint={isEn ? `At the limit of ${formatNumber(payloadKg)} kg` : `Pada batas ${formatNumber(payloadKg)} kg`}
        />
        <ResultCard
          label={isEn ? "Units needed" : "Unit dibutuhkan"}
          value={plan.trucksNeeded ? `${formatNumber(plan.trucksNeeded, 0)} ${isEn ? "units" : "unit"}` : isEn ? "Not filled in" : "Belum diisi"}
          hint={
            plan.remainderCartons
              ? isEn
                ? `${plan.remainderCartons} cartons in the last unit`
                : `${plan.remainderCartons} kardus di unit terakhir`
              : isEn
                ? "Enter shipment quantity"
                : "Isi jumlah kiriman"
          }
          emphasis
        />
      </ResultGrid>

      <div
        className={`mt-5 flex items-start gap-4 rounded-2xl p-5 ${
          plan.limitedBy === "none" ? "nm-emboss bg-white/60 ring-2 ring-brand-orange/35" : "nm-deboss"
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
              {isEn ? "Space utilisation" : "Pemakaian ruang"} {formatNumber(plan.volumeUtilisation * 100, 0)}% ·{" "}
              {isEn ? "weight utilisation" : "pemakaian berat"} {formatNumber(plan.weightUtilisation * 100, 0)}%
            </p>
          )}
        </div>
      </div>

      {/* Compliance sits below the load plan, not beside it: the arithmetic
          answers "how many fit", and this answers "may it travel", a second
          question that only becomes relevant once there is a plan to check. */}
      <section aria-labelledby="kepatuhan-panel" className="mt-8">
        <h3 id="kepatuhan-panel" className="mb-4 flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
          {isEn ? "What to check before departure" : "Yang perlu diperiksa sebelum berangkat"}
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

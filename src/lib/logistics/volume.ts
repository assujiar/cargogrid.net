/**
 * Volume, volumetric weight and chargeable weight.
 *
 * This is the arithmetic behind the single most-searched question in Indonesian
 * logistics operations, "berapa CBM-nya, dan berapa yang ditagih?", and it is
 * deliberately kept free of React so it can be reasoned about, and corrected,
 * on its own terms.
 *
 * The one modelling decision worth explaining: every mode is expressed as a
 * single **kg per CBM** factor rather than as the divisor most tables quote.
 * Air freight is universally written as `L x W x H (cm) / 6000`, which reads
 * like a different formula from sea LCL's `1 CBM = 1000 kg`, and that apparent
 * difference is why people keep two incompatible spreadsheets. They are the
 * same formula. 1 CBM is 1,000,000 cm3, so dividing by 6000 is multiplying by
 * 166.67 kg/CBM. Collapsing both into one factor means the calculator has one
 * code path, and, more useful to the reader, it makes the modes directly
 * comparable: sea charges volume six times more leniently than air does.
 */

export type LengthUnit = "cm" | "m" | "mm" | "in";

/** Millimetres per unit, used to normalise every input to one internal scale. */
const MM_PER_UNIT: Record<LengthUnit, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
};

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: LengthUnit;
}

/**
 * A shipping mode's volumetric convention.
 *
 * `kgPerCbm` is the whole model. `divisor` is carried alongside it purely
 * because that is the number printed on rate sheets and quoted by sales, a
 * calculator that shows only kg/CBM would be arithmetically right and
 * practically useless, because the user cannot check it against the document
 * in front of them.
 */
export interface VolumetricMode {
  id: string;
  label: string;
  labelEn: string;
  /** The `L x W x H (cm) / n` divisor, where the convention is written that way. */
  divisor: number | null;
  kgPerCbm: number;
  /** Shown under the result so nobody quotes a default as if it were a contract. */
  note: string;
  noteEn: string;
}

/**
 * The conventions actually encountered on Indonesian shipments.
 *
 * `laut-lcl`, `udara-iata` and `express` are industry standards and safe to
 * default to. `darat` is not: domestic trucking has no single convention, and
 * 250 vs 333 kg/CBM is a ~33% difference on the same carton. It is included
 * because leaving it out would not stop anyone from needing the number, it
 * would only push them to reuse the air divisor by mistake, but its note is
 * blunt about where the real figure comes from.
 */
export const VOLUMETRIC_MODES: VolumetricMode[] = [
  {
    id: "laut-lcl",
    label: "Laut LCL (W/M)",
    labelEn: "Sea LCL (W/M)",
    divisor: null,
    kgPerCbm: 1000,
    note: "Konvensi weight/measurement: 1 CBM disetarakan 1.000 kg, lalu yang lebih besar yang ditagih. Sebagian pelayaran memakai 1 CBM = 1 ton metrik dengan minimum 1 CBM per bill of lading.",
    noteEn:
      "The weight/measurement convention: 1 CBM is equated with 1,000 kg, and whichever is larger gets billed. Some carriers use 1 CBM = 1 metric ton with a minimum of 1 CBM per bill of lading.",
  },
  {
    id: "udara-iata",
    label: "Udara (IATA, /6000)",
    labelEn: "Air (IATA, /6000)",
    divisor: 6000,
    kgPerCbm: 1_000_000 / 6000,
    note: "Standar IATA untuk kargo udara umum. Setara 166,67 kg per CBM.",
    noteEn: "The IATA standard for general air cargo. Equivalent to 166.67 kg per CBM.",
  },
  {
    id: "express",
    label: "Kurir/Express (/5000)",
    labelEn: "Courier/Express (/5000)",
    divisor: 5000,
    kgPerCbm: 1_000_000 / 5000,
    note: "Divisor yang lazim dipakai perusahaan kurir internasional. Setara 200 kg per CBM, lebih mahal untuk barang ringan dibanding divisor 6000.",
    noteEn:
      "The divisor commonly used by international courier companies. Equivalent to 200 kg per CBM, more expensive for light cargo than the /6000 divisor.",
  },
  {
    id: "darat",
    label: "Darat/domestik (perkiraan)",
    labelEn: "Domestic road (estimate)",
    divisor: null,
    kgPerCbm: 250,
    note: "Angkutan darat domestik tidak punya konvensi tunggal. 250 kg/CBM hanya titik awal, banyak operator memakai 300 atau 333. Pastikan angkanya ke operator sebelum dipakai menghitung harga jual.",
    noteEn:
      "Domestic road transport has no single convention. 250 kg/CBM is just a starting point; many operators use 300 or 333. Confirm the figure with your operator before using it to price a sale.",
  },
];

export function getVolumetricMode(id: string): VolumetricMode {
  return VOLUMETRIC_MODES.find((mode) => mode.id === id) || VOLUMETRIC_MODES[0];
}

/** One edge length converted to metres. */
export function toMetres(value: number, unit: LengthUnit): number {
  return (value * MM_PER_UNIT[unit]) / 1000;
}

/** All three edges in metres, for anything that has to share units with a truck body. */
export function dimsInMetres(dims: Dimensions): { length: number; width: number; height: number } {
  return {
    length: toMetres(dims.length, dims.unit),
    width: toMetres(dims.width, dims.unit),
    height: toMetres(dims.height, dims.unit),
  };
}

/** Volume of one piece in cubic metres. */
export function cbmPerPiece(dims: Dimensions): number {
  const factor = MM_PER_UNIT[dims.unit];
  const mmVolume = dims.length * factor * (dims.width * factor) * (dims.height * factor);
  // 1 m3 = 1e9 mm3.
  return mmVolume / 1e9;
}

export interface CargoLine {
  /** Free-text label so a multi-line quote stays readable; never used in maths. */
  label?: string;
  dims: Dimensions;
  quantity: number;
  /** Actual (gross) weight of ONE piece, in kilograms. */
  weightPerPiece: number;
}

export interface LineResult {
  cbmPerPiece: number;
  totalCbm: number;
  totalActualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  /** Which of the two weights won. Drives the explanation shown to the user. */
  basis: "volume" | "actual" | "equal";
}

export interface ShipmentResult extends LineResult {
  lines: LineResult[];
  totalPieces: number;
  /** Actual density of the whole consignment, kg/CBM. */
  densityKgPerCbm: number;
  /**
   * The density at which the two weights cross over. Below it a shipment is
   * charged on volume, above it on weight. Knowing this number is what lets
   * someone decide whether repacking is worth the effort, which is the
   * decision the calculation is usually in service of.
   */
  breakEvenDensity: number;
}

function summarise(totalCbm: number, totalActualWeight: number, mode: VolumetricMode): LineResult {
  const volumetricWeight = totalCbm * mode.kgPerCbm;
  const chargeableWeight = Math.max(volumetricWeight, totalActualWeight);

  // Rounded before comparing: a 0.0001 kg gap is a floating-point artefact, not
  // a billing basis, and telling someone their shipment is "charged on volume"
  // over that difference would be noise dressed up as a finding.
  const diff = Math.abs(volumetricWeight - totalActualWeight);
  const basis: LineResult["basis"] =
    diff < 0.01 ? "equal" : volumetricWeight > totalActualWeight ? "volume" : "actual";

  return {
    cbmPerPiece: 0,
    totalCbm,
    totalActualWeight,
    volumetricWeight,
    chargeableWeight,
    basis,
  };
}

/**
 * Chargeable weight for a whole consignment.
 *
 * Note that the comparison happens once, on the totals, not per line. That
 * matters and is not a simplification: carriers rate a shipment, not a carton,
 * so a pallet of dense goods and a pallet of light goods on the same booking
 * offset each other. Summing per-line chargeable weights would overstate the
 * bill, sometimes badly, and it is a common spreadsheet error.
 */
export function calculateShipment(lines: CargoLine[], mode: VolumetricMode): ShipmentResult {
  const lineResults: LineResult[] = lines.map((line) => {
    const per = cbmPerPiece(line.dims);
    const qty = Math.max(0, line.quantity);
    const result = summarise(per * qty, line.weightPerPiece * qty, mode);
    return { ...result, cbmPerPiece: per };
  });

  const totalCbm = lineResults.reduce((sum, r) => sum + r.totalCbm, 0);
  const totalActualWeight = lineResults.reduce((sum, r) => sum + r.totalActualWeight, 0);
  const totalPieces = lines.reduce((sum, line) => sum + Math.max(0, line.quantity), 0);

  const total = summarise(totalCbm, totalActualWeight, mode);

  return {
    ...total,
    cbmPerPiece: totalPieces > 0 ? totalCbm / totalPieces : 0,
    lines: lineResults,
    totalPieces,
    densityKgPerCbm: totalCbm > 0 ? totalActualWeight / totalCbm : 0,
    breakEvenDensity: mode.kgPerCbm,
  };
}

/** Formats a number for display with Indonesian separators. */
export function formatNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits }).format(value);
}

/**
 * Free time, demurrage and detention.
 *
 * The point of putting this on a public page is not that the arithmetic is
 * hard. It is that almost nobody does it on the day the container lands, when
 * the answer would still change a decision, and everybody does it three weeks
 * later when the invoice arrives and only the amount is in question. A form
 * that produces a due date in ten seconds is the cheapest possible way to move
 * that calculation to the front of the process.
 *
 * Two conventions here are genuinely ambiguous in practice, and both are
 * exposed as inputs rather than quietly assumed:
 *
 * 1. Whether the discharge day itself is free time day 1 or day 0. Carriers
 *    differ, and it is worth a full day of demurrage.
 * 2. Whether slab day numbers restart at the first chargeable day. Most
 *    tariffs count "day 1-3 after free time" that way, so that is the default,
 *    but the slab table is editable in full.
 *
 * Dates are handled as plain calendar days, never as instants. Free time runs
 * on the terminal's calendar, so a timezone-aware Date carrying a local
 * midnight is a liability: shift it by seven hours and a shipment silently
 * gains or loses a chargeable day.
 */

/** A calendar day, `YYYY-MM-DD`. No time, no zone, deliberately. */
export type CalendarDate = string;

const MS_PER_DAY = 86_400_000;

/** Days since epoch for a `YYYY-MM-DD` string, parsed as UTC so no zone applies. */
function toDayNumber(date: CalendarDate): number {
  const [y, m, d] = date.split("-").map(Number);
  return Math.floor(Date.UTC(y, (m || 1) - 1, d || 1) / MS_PER_DAY);
}

function toCalendarDate(dayNumber: number): CalendarDate {
  return new Date(dayNumber * MS_PER_DAY).toISOString().slice(0, 10);
}

export function addDays(date: CalendarDate, days: number): CalendarDate {
  return toCalendarDate(toDayNumber(date) + days);
}

/** Inclusive day count: the same date on both sides is one day, not zero. */
export function daysBetween(from: CalendarDate, to: CalendarDate): number {
  return toDayNumber(to) - toDayNumber(from) + 1;
}

export function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d;
}

export interface TariffSlab {
  /** First day of this band, counted from day 1 of the chargeable period. */
  fromDay: number;
  /** Last day of this band. `null` means "and everything after". */
  toDay: number | null;
  /** Currency per container per day. */
  ratePerDay: number;
}

/**
 * A progressive slab table is the industry norm, and the reason demurrage bills
 * surprise people: the rate for week three is often three to five times the
 * week-one rate, so a delay that doubles in length can quadruple in cost. The
 * defaults below are shaped like a real tariff but the amounts are placeholders
 *, the user's own DO is the only authority on the numbers.
 */
export const DEFAULT_SLABS: TariffSlab[] = [
  { fromDay: 1, toDay: 3, ratePerDay: 300_000 },
  { fromDay: 4, toDay: 7, ratePerDay: 600_000 },
  { fromDay: 8, toDay: null, ratePerDay: 1_200_000 },
];

export interface FreeTimeInput {
  /** Discharge date for demurrage, gate-out date for detention. */
  startDate: CalendarDate;
  freeTimeDays: number;
  /** Pickup date for demurrage, return-to-depot date for detention. */
  endDate: CalendarDate;
  /** True when the carrier counts the start date itself as free time day 1. */
  countStartDay: boolean;
  containers: number;
  slabs: TariffSlab[];
}

export interface SlabCharge {
  slab: TariffSlab;
  days: number;
  /** Cost for all containers in this band. */
  amount: number;
}

export interface FreeTimeResult {
  lastFreeDay: CalendarDate;
  firstChargeableDay: CalendarDate;
  /** Negative once the deadline has passed, the number people actually want. */
  daysRemaining: number;
  chargeableDays: number;
  breakdown: SlabCharge[];
  totalPerContainer: number;
  total: number;
  /** True when the container came out within free time. */
  withinFreeTime: boolean;
}

/**
 * Cost of the days a container overstays.
 *
 * `asOf` exists so the same function serves both questions the tool is asked:
 * "what will this cost if I collect on the 20th" (pass the planned date) and
 * "what is it costing me right now" (pass today). They are the same calculation
 * and should never be allowed to drift apart into two.
 */
export function calculateFreeTime(input: FreeTimeInput): FreeTimeResult {
  const freeDays = Math.max(0, Math.floor(input.freeTimeDays));
  const offset = input.countStartDay ? freeDays - 1 : freeDays;
  const lastFreeDay = addDays(input.startDate, Math.max(-1, offset));
  const firstChargeableDay = addDays(lastFreeDay, 1);

  const chargeableDays = Math.max(0, daysBetween(firstChargeableDay, input.endDate));
  const daysRemaining = daysBetween(input.endDate, lastFreeDay);

  const containers = Math.max(1, Math.floor(input.containers));
  const breakdown: SlabCharge[] = [];
  let totalPerContainer = 0;

  // Sorted rather than trusted: the slab editor lets rows be added in any
  // order, and an unsorted table would charge the open-ended band first and
  // report a total several times too high.
  const slabs = [...input.slabs].sort((a, b) => a.fromDay - b.fromDay);

  for (const slab of slabs) {
    if (chargeableDays < slab.fromDay) continue;
    const bandEnd = slab.toDay === null ? chargeableDays : Math.min(slab.toDay, chargeableDays);
    const days = bandEnd - slab.fromDay + 1;
    if (days <= 0) continue;

    const perContainer = days * slab.ratePerDay;
    totalPerContainer += perContainer;
    breakdown.push({ slab, days, amount: perContainer * containers });
  }

  return {
    lastFreeDay,
    firstChargeableDay,
    daysRemaining,
    chargeableDays,
    breakdown,
    totalPerContainer,
    total: totalPerContainer * containers,
    withinFreeTime: chargeableDays === 0,
  };
}

export function formatIDR(value: number, isEn = false): string {
  return new Intl.NumberFormat(isEn ? "en-US" : "id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Long-form date. Used in results, where `2026-09-14` is correct but reads as
 * a serial number, and the whole point of the output is that someone looks at
 * it and recognises it as next Monday.
 */
export function formatLongDate(date: CalendarDate, isEn = false): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(isEn ? "en-US" : "id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

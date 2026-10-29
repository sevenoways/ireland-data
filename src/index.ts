import counties from "../data/counties.json" with { type: "json" };

export type Province = "Leinster" | "Munster" | "Connacht" | "Ulster";

export interface County {
  name: string;
  irish: string;
  province: Province;
  jurisdiction: "ROI" | "NI";
  /** True if the county contains an official Gaeltacht area. */
  gaeltacht: boolean;
}

export const COUNTIES = counties as County[];

export function countiesByProvince(province: Province): County[] {
  return COUNTIES.filter((c) => c.province === province);
}

export function findCounty(name: string): County | undefined {
  const n = name.trim().toLowerCase().replace(/^(co\.?|county)\s+/, "");
  return COUNTIES.find((c) => c.name.toLowerCase() === n || c.irish.toLowerCase() === n);
}

export interface BankHoliday {
  /** ISO date, YYYY-MM-DD */
  date: string;
  name: string;
}

function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function weekday(y: number, m: number, d: number): number {
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function firstMonday(y: number, m: number): number {
  return 1 + ((8 - weekday(y, m, 1)) % 7);
}

function lastMonday(y: number, m: number): number {
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return last - ((weekday(y, m, last) + 6) % 7);
}

// Anonymous Gregorian algorithm (Meeus/Jones/Butcher).
function easterSunday(y: number): [number, number] {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return [month, day];
}

/**
 * Republic of Ireland public holidays for a year (2023 onwards, when St Brigid's Day
 * was added). Dates are the statutory days themselves. When one falls on a weekend
 * there's no automatic substitute weekday, although employers often give the next
 * working day.
 */
export function bankHolidays(year: number): BankHoliday[] {
  if (year < 2023) throw new RangeError("bankHolidays() supports 2023 onwards");
  const feb1 = weekday(year, 2, 1);
  const brigid = feb1 === 5 ? 1 : firstMonday(year, 2); // Feb 1 if a Friday
  const [em, ed] = easterSunday(year);
  const easterMonday = new Date(Date.UTC(year, em - 1, ed + 1));

  return [
    { date: iso(year, 1, 1), name: "New Year's Day" },
    { date: iso(year, 2, brigid), name: "St Brigid's Day" },
    { date: iso(year, 3, 17), name: "St Patrick's Day" },
    { date: easterMonday.toISOString().slice(0, 10), name: "Easter Monday" },
    { date: iso(year, 5, firstMonday(year, 5)), name: "May Bank Holiday" },
    { date: iso(year, 6, firstMonday(year, 6)), name: "June Bank Holiday" },
    { date: iso(year, 8, firstMonday(year, 8)), name: "August Bank Holiday" },
    { date: iso(year, 10, lastMonday(year, 10)), name: "October Bank Holiday" },
    { date: iso(year, 12, 25), name: "Christmas Day" },
    { date: iso(year, 12, 26), name: "St Stephen's Day" },
  ].sort((a, b) => a.date.localeCompare(b.date));
}

/** The next bank holiday on or after `from` (defaults to today, UTC). */
export function nextBankHoliday(from: Date = new Date()): BankHoliday {
  const today = from.toISOString().slice(0, 10);
  const y = from.getUTCFullYear();
  return [...bankHolidays(y), ...bankHolidays(y + 1)].find((h) => h.date >= today)!;
}

export function isBankHoliday(date: Date): boolean {
  const d = date.toISOString().slice(0, 10);
  return bankHolidays(date.getUTCFullYear()).some((h) => h.date === d);
}

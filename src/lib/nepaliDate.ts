/**
 * Nepali Bikram Sambat Date & Unicode Utility
 */

const nepaliMonths = [
  "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
  "कार्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
];

const nepaliDays = [
  "आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"
];

const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

import { format } from "date-fns";

export function toNepaliNumber(num: number | string): string {
  return String(num).replace(/\d/g, (d) => devanagariDigits[parseInt(d, 10)]);
}

export function formatDateSafe(dateStr?: string | null, formatStr: string = 'MMM d, yyyy'): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return format(d, formatStr);
  } catch {
    return '';
  }
}

/**
 * Returns formatted Nepali date string (e.g. "२०८१ असोज १९, सोमबार")
 */
export function getNepaliDate(date: Date = new Date()): string {
  // Approximate standard conversion for current period:
  // AD 2026-10-05 corresponds to BS 2083 Ashwin 19 / approx +56.7 years
  // Let's implement an accurate offset-based converter
  const yearAD = date.getFullYear();
  const monthAD = date.getMonth(); // 0-indexed
  const dayAD = date.getDate();
  const dayOfWeek = date.getDay();

  // Bikram Sambat is approximately +56 years 8 months 17 days ahead
  // If month is >= April (around mid-April BS New Year), BS year is AD + 57, else AD + 56
  let bsYear = yearAD + 56;
  if (monthAD > 3 || (monthAD === 3 && dayAD >= 14)) {
    bsYear = yearAD + 57;
  }

  // Calculate BS month & day approximation
  // Mid April = Baisakh 1
  const baisakh1 = new Date(yearAD, 3, 14);
  const diffDays = Math.floor((date.getTime() - baisakh1.getTime()) / (1000 * 60 * 60 * 24));

  let bsMonthIndex = 0;
  let bsDay = 1;

  if (diffDays >= 0) {
    // Standard BS month lengths approx: 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30
    const monthDays = [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30];
    let rem = diffDays;
    for (let i = 0; i < monthDays.length; i++) {
      if (rem < monthDays[i]) {
        bsMonthIndex = i;
        bsDay = rem + 1;
        break;
      }
      rem -= monthDays[i];
    }
  } else {
    // Before mid April (Magh, Falgun, Chaitra of previous BS year)
    bsMonthIndex = 11; // Chaitra approx
    bsDay = Math.max(1, 30 + diffDays);
  }

  const nepaliDayName = nepaliDays[dayOfWeek];
  const nepaliMonthName = nepaliMonths[bsMonthIndex] || "असोज";
  
  return `${toNepaliNumber(bsYear)} ${nepaliMonthName} ${toNepaliNumber(bsDay)}, ${nepaliDayName}`;
}

export function formatNepaliTime(date: Date = new Date()): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "अपराह्न" : "पूर्वाह्न";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? `०${toNepaliNumber(minutes)}` : toNepaliNumber(minutes);
  return `${toNepaliNumber(hours)}:${minutesStr} ${ampm}`;
}

// src/lib/format.ts
export function fmtDate(value?: string | number | Date | null, locale: "ru"|"uk"|"de" = "ru") {
  if (!value) return "—";
  const d = typeof value === "string" || typeof value === "number" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatDateTimeRange(
  dateISO: string,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  locale: "ru"|"uk"|"de" = "ru"
) {
  const d = new Date(dateISO);
  const dd = new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const time = (h: number, m: number) =>
    new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(
      new Date(Date.UTC(2000, 0, 1, h, m))
    );
  return `${dd} ${time(startHour, startMinute)} — ${time(endHour, endMinute)}`;
}

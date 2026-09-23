/** Небольшие date-утилиты. Все даты — локальные, формат "YYYY-MM-DD". */

export const WEEKDAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;
export const WEEKDAYS_FULL = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
] as const;
const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Понедельник недели, к которой относится дата. */
export function startOfWeek(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = copy.getDay(); // 0 = Вс
  copy.setDate(copy.getDate() + (dow === 0 ? -6 : 1 - dow));
  return copy;
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/** 7 дат (Пн..Вс) текущей недели относительно `anchor`. */
export function weekDates(anchor: Date): string[] {
  const monday = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => toISODate(addDays(monday, i)));
}

export function weekdayIndex(iso: string): number {
  const dow = fromISODate(iso).getDay();
  return dow === 0 ? 6 : dow - 1;
}

export function formatDayLabel(iso: string): string {
  const d = fromISODate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatWeekRange(week: string[]): string {
  if (week.length !== 7) return "";
  const a = fromISODate(week[0]);
  const b = fromISODate(week[6]);
  const sameMonth = a.getMonth() === b.getMonth();
  const left = sameMonth ? `${a.getDate()}` : `${a.getDate()} ${MONTHS[a.getMonth()]}`;
  const right = `${b.getDate()} ${MONTHS[b.getMonth()]}`;
  return `${left} – ${right}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

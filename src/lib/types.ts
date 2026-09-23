export type TaskStatus = "todo" | "done";

/**
 * Цвет задачи — ключ из TASK_COLORS.
 * Храним именно ключ (а не hex), чтобы UI и БД-слой могли
 * сами решать, как выглядит палитра.
 */
export type TaskColorKey = "violet" | "sky" | "emerald" | "amber" | "rose" | "slate";

export interface Task {
  id: string;
  title: string;
  /** ISO-дата без времени, локальная: "2026-09-24" */
  date: string;
  /** "HH:MM" или "" (без привязки ко времени) */
  time: string;
  color: TaskColorKey;
  status: TaskStatus;
  createdAt: number;
}

export type NewTask = Omit<Task, "id" | "createdAt">;

export const TASK_COLORS: Record<TaskColorKey, { label: string; dot: string; card: string }> = {
  violet: {
    label: "Фиолетовый",
    dot: "bg-violet-500",
    card: "border-violet-300/70 bg-violet-50 dark:border-violet-500/25 dark:bg-violet-500/10",
  },
  sky: {
    label: "Голубой",
    dot: "bg-sky-500",
    card: "border-sky-300/70 bg-sky-50 dark:border-sky-500/25 dark:bg-sky-500/10",
  },
  emerald: {
    label: "Зелёный",
    dot: "bg-emerald-500",
    card: "border-emerald-300/70 bg-emerald-50 dark:border-emerald-500/25 dark:bg-emerald-500/10",
  },
  amber: {
    label: "Жёлтый",
    dot: "bg-amber-500",
    card: "border-amber-300/70 bg-amber-50 dark:border-amber-500/25 dark:bg-amber-500/10",
  },
  rose: {
    label: "Розовый",
    dot: "bg-rose-500",
    card: "border-rose-300/70 bg-rose-50 dark:border-rose-500/25 dark:bg-rose-500/10",
  },
  slate: {
    label: "Серый",
    dot: "bg-slate-400",
    card: "border-slate-300/70 bg-slate-50 dark:border-slate-500/25 dark:bg-slate-500/10",
  },
};

"use client";

import { useMemo, useState } from "react";
import type { NewTask, Task } from "@/lib/types";
import { addDays, formatWeekRange, startOfWeek, todayISO, weekDates } from "@/lib/dates";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import DayColumn from "./DayColumn";
import TaskForm from "./TaskForm";

interface FormState {
  open: boolean;
  task: Task | null;
  defaultDate: string;
}

export default function Planner() {
  const { tasks, loaded, addTask, updateTask, removeTask, moveTask, toggleStatus } = useTasks();
  const { theme, toggleTheme } = useTheme();

  const [anchor, setAnchor] = useState(() => new Date());
  const [form, setForm] = useState<FormState>({ open: false, task: null, defaultDate: todayISO() });
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const week = useMemo(() => weekDates(anchor), [anchor]);

  const byDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const d of week) map.set(d, []);
    for (const t of tasks) {
      if (!map.has(t.date)) continue; // показываем только текущую неделю
      map.get(t.date)!.push(t);
    }
    return map;
  }, [tasks, week]);

  const total = week.reduce((n, d) => n + (byDate.get(d)?.length ?? 0), 0);
  const doneCount = week.reduce(
    (n, d) => n + (byDate.get(d)?.filter((t) => t.status === "done").length ?? 0),
    0,
  );

  const shiftWeek = (days: number) => setAnchor((a) => addDays(startOfWeek(a), days));

  const openCreate = (date: string) => setForm({ open: true, task: null, defaultDate: date });
  const openEdit = (task: Task) => setForm({ open: true, task, defaultDate: task.date });
  const closeForm = () => setForm((f) => ({ ...f, open: false }));

  const handleSubmit = (input: NewTask) => {
    if (form.task) {
      void updateTask(form.task.id, input);
    } else {
      void addTask(input);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* фоновое свечение */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-violet-400/10 via-sky-400/5 to-transparent dark:from-violet-500/10 dark:via-sky-500/5"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── Header ─── */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">
              Планировщик
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {formatWeekRange(week)}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {loaded
                ? total === 0
                  ? "На этой неделе пока пусто — добавьте первую задачу"
                  : `${total} ${plural(total, "задача", "задачи", "задач")} · выполнено ${doneCount}`
                : "Загрузка…"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* навигация по неделям */}
            <div className="flex items-center rounded-2xl border border-slate-200/80 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <NavButton label="Предыдущая неделя" onClick={() => shiftWeek(-7)}>
                <path d="M11 4l-5 5 5 5" />
              </NavButton>
              <button
                type="button"
                onClick={() => setAnchor(new Date())}
                className="rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Сегодня
              </button>
              <NavButton label="Следующая неделя" onClick={() => shiftWeek(7)}>
                <path d="M7 4l5 5-5 5" />
              </NavButton>
            </div>

            {/* тема */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-500 shadow-sm backdrop-blur transition hover:text-violet-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:text-violet-400"
            >
              {theme === "dark" ? (
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="10" cy="10" r="4" />
                  <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M16 4l-1.4 1.4M5.4 14.6L4 16" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 11.5A7.5 7.5 0 0 1 8.5 3a7.5 7.5 0 1 0 8.5 8.5z" />
                </svg>
              )}
            </button>

            {/* создать */}
            <button
              type="button"
              onClick={() => openCreate(todayISO())}
              className="flex h-10 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700 active:scale-[0.98] dark:bg-violet-500 dark:shadow-violet-500/25 dark:hover:bg-violet-400"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M7 2v10M2 7h10" />
              </svg>
              Новая задача
            </button>
          </div>
        </header>

        {/* ─── Week grid ─── */}
        <main className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2 min-[1100px]:grid-cols-3 min-[1300px]:grid-cols-7">
          {week.map((date) => (
            <DayColumn
              key={date}
              date={date}
              tasks={byDate.get(date) ?? []}
              onDropTask={(id, target) => void moveTask(id, target)}
              onAdd={openCreate}
              onToggle={(t) => void toggleStatus(t)}
              onEdit={openEdit}
              draggingId={draggingId}
              onDragStart={setDraggingId}
              onDragEnd={() => setDraggingId(null)}
            />
          ))}
        </main>

        <footer className="mt-10 text-center text-xs text-slate-400 dark:text-slate-600">
          Данные хранятся локально в браузере · drag&amp;drop переносит задачи между днями
        </footer>
      </div>

      <TaskForm
        open={form.open}
        task={form.task}
        defaultDate={form.defaultDate}
        onClose={closeForm}
        onSubmit={handleSubmit}
        onDelete={(id) => void removeTask(id)}
      />
    </div>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

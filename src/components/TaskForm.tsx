"use client";

import { useEffect, useRef, useState } from "react";
import type { NewTask, Task, TaskColorKey } from "@/lib/types";
import { TASK_COLORS } from "@/lib/types";
import { todayISO } from "@/lib/dates";

interface Props {
  open: boolean;
  /** Задача для редактирования; null — создание. */
  task: Task | null;
  /** Дата колонки, из которой открыли форму (или на которую перетащили). */
  defaultDate: string;
  onClose: () => void;
  onSubmit: (input: NewTask) => void;
  onDelete?: (id: string) => void;
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 " +
  "shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 " +
  "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-violet-500";

const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500";

export default function TaskForm({ open, task, defaultDate, onClose, onSubmit, onDelete }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("");
  const [color, setColor] = useState<TaskColorKey>("violet");
  const [status, setStatus] = useState<"todo" | "done">("todo");
  const titleRef = useRef<HTMLInputElement>(null);

  // Инициализация при открытии
  useEffect(() => {
    if (!open) return;
    if (task) {
      setTitle(task.title);
      setDate(task.date);
      setTime(task.time);
      setColor(task.color);
      setStatus(task.status);
    } else {
      setTitle("");
      setDate(defaultDate || todayISO());
      setTime("");
      setColor("violet");
      setStatus("todo");
    }
    const t = setTimeout(() => titleRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open, task, defaultDate]);

  // Esc — закрыть
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({ title: trimmed, date, time, color, status });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-3xl bg-white p-7 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:shadow-black/40 dark:ring-white/10"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {task ? "Редактировать задачу" : "Новая задача"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <div>
          <label className={labelCls} htmlFor="task-title">Название</label>
          <input
            id="task-title"
            ref={titleRef}
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: созвониться с командой"
            maxLength={120}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} htmlFor="task-date">Дата</label>
            <input id="task-date" type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className={labelCls} htmlFor="task-time">Время <span className="normal-case text-slate-300 dark:text-slate-600">(необязательно)</span></label>
            <input id="task-time" type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div>
          <span className={labelCls}>Цвет</span>
          <div className="flex gap-2.5">
            {(Object.keys(TASK_COLORS) as TaskColorKey[]).map((key) => (
              <button
                key={key}
                type="button"
                title={TASK_COLORS[key].label}
                onClick={() => setColor(key)}
                className={`h-8 w-8 rounded-full ${TASK_COLORS[key].dot} transition transform hover:scale-110 ${
                  color === key
                    ? "ring-2 ring-slate-900/70 ring-offset-2 ring-offset-white dark:ring-slate-100/80 dark:ring-offset-slate-900 scale-110"
                    : "opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <span className={labelCls}>Статус</span>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(["todo", "done"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-lg py-1.5 text-sm font-medium transition ${
                  status === s
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {s === "todo" ? "К выполнению" : "Выполнено"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          {task && onDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              Удалить
            </button>
          )}
          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700 dark:bg-violet-500 dark:shadow-violet-500/25 dark:hover:bg-violet-400"
            >
              {task ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

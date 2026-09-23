"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";
import { WEEKDAYS_SHORT, weekdayIndex, formatDayLabel, todayISO } from "@/lib/dates";
import TaskCard from "./TaskCard";

interface Props {
  /** ISO-дата колонки */
  date: string;
  tasks: Task[];
  onDropTask: (taskId: string, date: string) => void;
  onAdd: (date: string) => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export default function DayColumn({
  date,
  tasks,
  onDropTask,
  onAdd,
  onToggle,
  onEdit,
  draggingId,
  onDragStart,
  onDragEnd,
}: Props) {
  const [over, setOver] = useState(false);
  const isToday = date === todayISO();

  const sorted = [...tasks].sort((a, b) => {
    if (a.status !== b.status) return a.status === "done" ? 1 : -1;
    if (a.time && b.time && a.time !== b.time) return a.time.localeCompare(b.time);
    if (!a.time && b.time) return 1;
    if (a.time && !b.time) return -1;
    return a.createdAt - b.createdAt;
  });

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const id = e.dataTransfer.getData("text/plain");
        if (id) onDropTask(id, date);
      }}
      className={`flex min-h-[28rem] w-full flex-col rounded-3xl border bg-white/70 p-3 backdrop-blur transition-all duration-200
        dark:bg-slate-900/60
        ${over
          ? "scale-[1.01] border-violet-400 bg-violet-50/70 shadow-lg shadow-violet-500/10 ring-2 ring-violet-400/40 dark:border-violet-500/60 dark:bg-violet-500/5"
          : "border-slate-200/70 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:shadow-black/20"}`}
      aria-label={`${WEEKDAYS_SHORT[weekdayIndex(date)]}, ${formatDayLabel(date)}`}
    >
      <header className="mb-3 flex items-baseline justify-between px-1.5 pt-1">
        <div className="flex items-baseline gap-2">
          <h3 className={`text-sm font-semibold tracking-wide ${isToday ? "text-violet-600 dark:text-violet-400" : "text-slate-700 dark:text-slate-300"}`}>
            {WEEKDAYS_SHORT[weekdayIndex(date)]}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">{formatDayLabel(date)}</span>
        </div>
        {isToday && (
          <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            сегодня
          </span>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-2.5">
        {sorted.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            dragging={draggingId === task.id}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onAdd(date)}
        className="mt-3 flex items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-300/80 py-2 text-xs font-medium text-slate-400 transition hover:border-violet-400 hover:bg-violet-50/60 hover:text-violet-600
          dark:border-slate-700 dark:text-slate-500 dark:hover:border-violet-500/60 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 2v8M2 6h8" />
        </svg>
        Задача
      </button>
    </section>
  );
}

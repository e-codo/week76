"use client";

import type { Task } from "@/lib/types";
import { TASK_COLORS } from "@/lib/types";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  dragging: boolean;
}

export default function TaskCard({ task, onToggle, onEdit, onDragStart, onDragEnd, dragging }: Props) {
  const done = task.status === "done";
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task.id);
      }}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(task);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Задача: ${task.title}. Нажмите для редактирования`}
      className={`group cursor-grab select-none rounded-2xl border p-3 shadow-sm transition 
        hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing
        ${TASK_COLORS[task.color]?.card ?? TASK_COLORS.slate.card}
        ${dragging ? "opacity-40 rotate-2 scale-95" : ""}`}
    >
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task);
          }}
          aria-label={done ? "Отметить как невыполненную" : "Отметить как выполненную"}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition
            ${done
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-300 bg-transparent text-transparent hover:border-emerald-400 dark:border-slate-600"}`}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.5L5 9l4.5-6" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm font-medium leading-snug text-slate-800 dark:text-slate-100 ${
              done ? "line-through opacity-60" : ""
            }`}
            title={task.title}
          >
            {task.title}
          </p>
          {task.time && (
            <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-white/60 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="6" cy="6" r="4.7" />
                <path d="M6 3.6V6l1.6 1.1" />
              </svg>
              {task.time}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

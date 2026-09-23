"use client";

import { useCallback, useEffect, useState } from "react";
import type { NewTask, Task } from "@/lib/types";
import { taskRepository } from "@/lib/storage";

/**
 * Хук-обёртка над репозиторием: держит список задач в состоянии,
 * оптимистично обновляет его и синхронизирует с хранилищем.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    taskRepository.list().then((list) => {
      if (!cancelled) {
        setTasks(list);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const addTask = useCallback(async (input: NewTask) => {
    const created = await taskRepository.create(input);
    setTasks((prev) => [...prev, created]);
    return created;
  }, []);

  const updateTask = useCallback(
    async (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => {
      // оптимистично
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      await taskRepository.update(id, patch);
    },
    [],
  );

  const removeTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await taskRepository.remove(id);
  }, []);

  /** Drag & drop: перенос задачи на другой день. */
  const moveTask = useCallback(
    async (id: string, date: string) => {
      await updateTask(id, { date });
    },
    [updateTask],
  );

  const toggleStatus = useCallback(
    async (task: Task) => {
      await updateTask(task.id, { status: task.status === "done" ? "todo" : "done" });
    },
    [updateTask],
  );

  return { tasks, loaded, addTask, updateTask, removeTask, moveTask, toggleStatus };
}

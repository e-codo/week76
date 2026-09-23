import type { NewTask, Task } from "../types";
import type { TaskRepository } from "./taskRepository";

const STORAGE_KEY = "planner.tasks.v1";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readAll(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch {
    return [];
  }
}

function writeAll(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Реализация TaskRepository поверх localStorage.
 *
 * TODO(Supabase): заменить на класс с тем же интерфейсом:
 *   list()   -> supabase.from("tasks").select("*")
 *   create() -> supabase.from("tasks").insert(...).select().single()
 *   update() -> supabase.from("tasks").update(patch).eq("id", id)
 *   remove() -> supabase.from("tasks").delete().eq("id", id)
 */
export class LocalStorageTaskRepository implements TaskRepository {
  async list(): Promise<Task[]> {
    // Небольшая задержка имитирует асинхронность реальной БД
    // и заставляет UI корректно обрабатывать состояние загрузки.
    return readAll().sort((a, b) => a.createdAt - b.createdAt);
  }

  async create(input: NewTask): Promise<Task> {
    const task: Task = { ...input, id: uid(), createdAt: Date.now() };
    const tasks = readAll();
    tasks.push(task);
    writeAll(tasks);
    return task;
  }

  async update(id: string, patch: Partial<Omit<Task, "id" | "createdAt">>): Promise<Task | null> {
    const tasks = readAll();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...patch, id: tasks[idx].id, createdAt: tasks[idx].createdAt };
    writeAll(tasks);
    return tasks[idx];
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((t) => t.id !== id));
  }
}

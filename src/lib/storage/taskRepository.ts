import type { NewTask, Task } from "../types";

/**
 * Абстракция хранилища задач.
 *
 * Приложение работает только через этот интерфейс, поэтому
 * переезд на Supabase = новый класс `SupabaseTaskRepository`,
 * реализующий TaskRepository поверх supabase-js, и одна строчка
 * в `index.ts`.
 */
export interface TaskRepository {
  /** Загрузить все задачи (для первой версии — весь локальный набор). */
  list(): Promise<Task[]>;
  create(input: NewTask): Promise<Task>;
  update(id: string, patch: Partial<Omit<Task, "id" | "createdAt">>): Promise<Task | null>;
  remove(id: string): Promise<void>;
}

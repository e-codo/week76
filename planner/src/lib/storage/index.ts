import type { TaskRepository } from "./taskRepository";
import { LocalStorageTaskRepository } from "./localStorage";

/**
 * Единственная точка, где приложение узнаёт, какое хранилище используется.
 * Для перехода на Supabase достаточно заменить реализацию ниже
 * (и сделать её асинхронно-инициализируемой, если понадобится клиент).
 */
export const taskRepository: TaskRepository = new LocalStorageTaskRepository();

export type { TaskRepository } from "./taskRepository";

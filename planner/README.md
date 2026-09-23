# Планировщик недели

Минималистичный планировщик задач (single-user, local-first) на **Next.js (App Router) + TypeScript + Tailwind CSS v4**.

## Запуск

```bash
cd planner
npm install
npm run dev    # http://localhost:3000
npm run build && npm start   # прод-сборка
```

## Возможности

- **Недельный вид** — 7 колонок (Пн–Вс), навигация по неделям («← / Сегодня / →»), подсветка «сегодня».
- **Создание и редактирование задач** — модалка с полями: название, дата, время (опционально), цвет (6 цветовых тем карточек), статус (todo/done). Клик по карточке — редактирование, кнопка удаления — в форме.
- **Drag & Drop** — перенос карточек между днями на нативном HTML5 DnD (без внешних зависимостей): подсветка колонки-цели, оптимистичное обновление.
- **Тёмная тема** — переключатель в шапке, выбор сохраняется в localStorage, учитывается системная тема, no-flash скрипт в `<head>`.
- Статус меняется кликом по чекбоксу карточки; выполненные — зачёркиваются и уходят вниз колонки; сортировка по времени.

## Архитектура хранения

Данные лежат в `localStorage`, но UI не знает об этом напрямую — всё через слой репозитория:

```
src/lib/
  types.ts                     # модель Task, палитра цветов
  dates.ts                     # date-утилиты (неделя Пн–Вс, форматирование)
  storage/
    taskRepository.ts          # интерфейс TaskRepository (list/create/update/remove)
    localStorage.ts            # LocalStorageTaskRepository (текущая реализация)
    index.ts                   # точка выбора реализации
src/hooks/useTasks.ts          # состояние + оптимистичные операции над репозиторием
src/components/                # Planner, DayColumn, TaskCard, TaskForm
```

### Как перейти на Supabase

1. Реализовать тот же интерфейс:

```ts
// src/lib/storage/supabase.ts
export class SupabaseTaskRepository implements TaskRepository {
  list()   { return supabase.from("tasks").select("*").then(r => r.data); }
  create(i){ return supabase.from("tasks").insert(i).select().single().then(r => r.data); }
  update(id, patch) { return supabase.from("tasks").update(patch).eq("id", id).select().single().then(r => r.data); }
  remove(id){ return supabase.from("tasks").delete().eq("id", id); }
}
```

2. Поменять одну строку в `src/lib/storage/index.ts`:

```ts
export const taskRepository: TaskRepository = new SupabaseTaskRepository();
```

Компоненты и хук `useTasks` менять не нужно.

"use client";

import React, { useEffect, useState } from "react";
import { TodoItem } from "@/app/types";
import Button from "@/components/ui/Button";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

const STORAGE_KEY = "portfolio.todos.v1";

function isTodoItem(value: unknown): value is TodoItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as TodoItem).id === "string" &&
    typeof (value as TodoItem).text === "string" &&
    typeof (value as TodoItem).completed === "boolean"
  );
}

const TodoApp: React.FC = () => {
  const t = useT();
  const seed: TodoItem[] = t.todo.seed.map((text, i) => ({
    id: String(i + 1),
    text,
    completed: i < 2,
  }));

  // Start from the (localised) seed on the server and first client render;
  // swap in stored data after mount to avoid a hydration mismatch.
  const [todos, setTodos] = useState<TodoItem[]>(seed);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    let next = seed;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(isTodoItem);
          if (valid.length > 0 || parsed.length === 0) next = valid;
        }
      }
    } catch {
      /* storage unavailable */
    }
    setTodos(next);
    setHydrated(true);
    // Only read storage once, on mount (`seed` identity changes with locale).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      /* ignore */
    }
  }, [todos, hydrated]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: input.trim(), completed: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) => prev.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)));

  const deleteTodo = (id: string) => setTodos((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t.todo.title}</h2>
        <p className="text-muted text-sm">{t.todo.subtitle}</p>
      </div>

      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.todo.placeholder}
          aria-label={t.todo.inputAria}
          className="flex-1 bg-elevated border border-line rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <Button type="submit" aria-label={t.todo.addAria}>
          <Plus size={18} />
        </Button>
      </form>

      <ul className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {todos.length === 0 && (
          <li className="text-center text-subtle py-10">{t.todo.empty}</li>
        )}
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              todo.completed ? "bg-elevated border-line opacity-75" : "bg-card border-line"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleTodo(todo.id)}
                aria-pressed={todo.completed}
                aria-label={
                  todo.completed
                    ? t.todo.markIncomplete(todo.text)
                    : t.todo.markComplete(todo.text)
                }
                className={`flex-shrink-0 transition-colors ${
                  todo.completed ? "text-emerald-500" : "text-subtle hover:text-foreground"
                }`}
              >
                {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
              <span
                className={`truncate ${todo.completed ? "line-through text-subtle" : "text-foreground"}`}
              >
                {todo.text}
              </span>
            </div>
            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              aria-label={t.todo.deleteAria(todo.text)}
              className="text-subtle hover:text-red-500 p-1 rounded-md hover:bg-elevated transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;

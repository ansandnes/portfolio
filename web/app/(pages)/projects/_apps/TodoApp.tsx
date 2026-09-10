"use client";

import React, { useEffect, useState } from "react";
import { TodoItem } from "@/app/types";
import Button from "@/components/ui/Button";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";

const STORAGE_KEY = "portfolio.todos.v1";

const SEED: TodoItem[] = [
  { id: "1", text: "Skim through Andreas' resume", completed: true },
  { id: "2", text: "Read what people say about Andreas", completed: true },
  { id: "3", text: "Invite Andreas to a chat with the team", completed: false },
];

function isTodoItem(value: unknown): value is TodoItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as TodoItem).id === "string" &&
    typeof (value as TodoItem).text === "string" &&
    typeof (value as TodoItem).completed === "boolean"
  );
}

function loadTodos(): TodoItem[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED;
    const valid = parsed.filter(isTodoItem);
    return valid.length > 0 || parsed.length === 0 ? valid : SEED;
  } catch {
    return SEED;
  }
}

const TodoApp: React.FC = () => {
  // Start from SEED on the server and the first client render (avoids a
  // hydration mismatch); swap in stored data after mount.
  const [todos, setTodos] = useState<TodoItem[]>(SEED);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Intentional: /projects is statically prerendered with SEED, so we must
    // read localStorage after mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodos(loadTodos());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      /* storage unavailable (private mode, quota) — ignore */
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
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Task Manager</h2>
        <p className="text-slate-400 text-sm">A simple to-do list — saved in your browser.</p>
      </div>

      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          aria-label="New task"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <Button type="submit" aria-label="Add task">
          <Plus size={18} />
        </Button>
      </form>

      <ul className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {todos.length === 0 && (
          <li className="text-center text-slate-500 py-10">No tasks yet. Add one above!</li>
        )}
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              todo.completed
                ? "bg-slate-900/50 border-slate-800 opacity-75"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleTodo(todo.id)}
                aria-pressed={todo.completed}
                aria-label={todo.completed ? `Mark "${todo.text}" incomplete` : `Mark "${todo.text}" complete`}
                className={`flex-shrink-0 transition-colors ${
                  todo.completed ? "text-emerald-500" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
              <span
                className={`truncate ${
                  todo.completed ? "line-through text-slate-500" : "text-white"
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete "${todo.text}"`}
              className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-slate-900 transition-colors"
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

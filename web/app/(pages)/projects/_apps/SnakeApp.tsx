"use client";

import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

const N = 15; // board is N x N
const BEST_KEY = "portfolio.snake.best";
const TICK_MS = 130;
const MIN_TICK_MS = 70;

type Point = { x: number; y: number };
type Status = "idle" | "running" | "paused" | "over" | "won";

interface GameState {
  snake: Point[]; // head at index 0
  dir: Point;
  nextDir: Point;
  food: Point;
  status: Status;
  score: number;
}

type Action =
  | { type: "start" }
  | { type: "toggle" }
  | { type: "turn"; dir: Point }
  | { type: "tick" };

const START_DIR: Point = { x: 1, y: 0 };
const eq = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
const key = (p: Point) => `${p.x},${p.y}`;

function initialSnake(): Point[] {
  const cy = Math.floor(N / 2);
  return [
    { x: 5, y: cy },
    { x: 4, y: cy },
    { x: 3, y: cy },
  ];
}

function newState(): GameState {
  return {
    snake: initialSnake(),
    dir: START_DIR,
    nextDir: START_DIR,
    food: { x: N - 4, y: Math.floor(N / 2) }, // fixed -> no SSR/hydration mismatch
    status: "idle",
    score: 0,
  };
}

function randomFood(snake: Point[]): Point | null {
  const taken = new Set(snake.map(key));
  const free: Point[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)]!;
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start":
      return { ...newState(), status: "running" };

    case "toggle":
      if (state.status === "running") return { ...state, status: "paused" };
      if (state.status === "paused") return { ...state, status: "running" };
      // idle / over / won -> fresh game
      return { ...newState(), status: "running" };

    case "turn": {
      if (state.status !== "running") return state;
      const d = action.dir;
      // ignore reversal onto the current heading
      if (d.x === -state.dir.x && d.y === -state.dir.y) return state;
      if (d.x === state.dir.x && d.y === state.dir.y) return state;
      return { ...state, nextDir: d };
    }

    case "tick": {
      if (state.status !== "running") return state;
      const dir = state.nextDir;
      const head: Point = { x: state.snake[0]!.x + dir.x, y: state.snake[0]!.y + dir.y };

      // wall
      if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N) {
        return { ...state, status: "over", dir };
      }

      const eating = eq(head, state.food);
      // body to test against: tail moves away unless we're growing
      const body = eating ? state.snake : state.snake.slice(0, -1);
      if (body.some((p) => eq(p, head))) {
        return { ...state, status: "over", dir };
      }

      const grown = [head, ...state.snake];
      if (eating) {
        const next = randomFood(grown);
        if (!next) return { ...state, snake: grown, dir, status: "won", score: state.score + 1 };
        return { ...state, snake: grown, food: next, dir, score: state.score + 1 };
      }
      grown.pop();
      return { ...state, snake: grown, dir };
    }

    default:
      return state;
  }
}

const DIRS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const SnakeApp: React.FC = () => {
  const t = useT();
  const [state, dispatch] = useReducer(reducer, undefined, newState);
  const [best, setBest] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // High score — persisted in localStorage, so it can only be read after mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BEST_KEY);
      const n = raw ? Number.parseInt(raw, 10) : 0;
      if (Number.isFinite(n) && n > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBest(n);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if ((state.status === "over" || state.status === "won") && state.score > best) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBest(state.score);
      try {
        window.localStorage.setItem(BEST_KEY, String(state.score));
      } catch {
        /* ignore */
      }
    }
  }, [state.status, state.score, best]);

  // game loop — interval is recreated when speed or run-state changes
  const speed = Math.max(MIN_TICK_MS, TICK_MS - state.score * 3);
  useEffect(() => {
    if (state.status !== "running") return;
    const id = window.setInterval(() => dispatch({ type: "tick" }), speed);
    return () => window.clearInterval(id);
  }, [state.status, speed]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        dispatch({ type: "toggle" });
        return;
      }
      const dir = DIRS[e.key] ?? DIRS[e.key.toLowerCase()];
      if (dir) {
        e.preventDefault();
        dispatch({ type: "turn", dir });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onToggle = useCallback(() => {
    dispatch({ type: "toggle" });
    boardRef.current?.focus();
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    const t0 = e.touches[0];
    touchStart.current = t0 ? { x: t0.clientX, y: t0.clientY } : null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    const t1 = e.changedTouches[0];
    if (!s || !t1) return;
    const dx = t1.clientX - s.x;
    const dy = t1.clientY - s.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    dispatch({
      type: "turn",
      dir:
        Math.abs(dx) > Math.abs(dy)
          ? { x: Math.sign(dx), y: 0 }
          : { x: 0, y: Math.sign(dy) },
    });
  };

  const snakeSet = new Set(state.snake.map(key));
  const headKey = key(state.snake[0]!);
  const foodKey = key(state.food);

  const toggleLabel =
    state.status === "running"
      ? t.snake.pause
      : state.status === "paused"
        ? t.snake.resume
        : state.status === "idle"
          ? t.snake.start
          : t.snake.playAgain;

  const statusMsg =
    state.status === "idle"
      ? t.snake.ready
      : state.status === "paused"
        ? t.snake.paused
        : state.status === "over"
          ? `${t.snake.gameOver} — ${t.snake.score} ${state.score}`
          : state.status === "won"
            ? t.snake.youWin
            : " ";

  return (
    <div className="h-full flex flex-col items-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-1">{t.snake.title}</h2>
        <p className="text-muted text-sm mb-4">{t.snake.subtitle}</p>

        <div className="flex items-center justify-between text-sm font-medium mb-3">
          <span className="text-muted">
            {t.snake.score}: <span className="text-foreground tabular-nums">{state.score}</span>
          </span>
          <span className="text-muted">
            {t.snake.best}: <span className="text-foreground tabular-nums">{best}</span>
          </span>
        </div>

        <div
          ref={boardRef}
          tabIndex={0}
          role="application"
          aria-label={t.snake.title}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="grid aspect-square w-full gap-px rounded-lg border border-line bg-line p-px outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 select-none touch-none"
          style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: N * N }, (_, i) => {
            const x = i % N;
            const y = Math.floor(i / N);
            const k = `${x},${y}`;
            const isHead = k === headKey;
            const isSnake = snakeSet.has(k);
            const isFood = k === foodKey;
            return (
              <div
                key={k}
                className={`bg-elevated ${
                  isHead
                    ? "rounded-[2px] bg-emerald-400"
                    : isSnake
                      ? "rounded-[2px] bg-emerald-500"
                      : isFood
                        ? "rounded-full bg-rose-500"
                        : ""
                }`}
              />
            );
          })}
        </div>

        <p className="mt-3 text-center text-sm text-muted min-h-5" aria-live="polite">
          {statusMsg}
        </p>

        <div className="mt-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white transition hover:bg-emerald-500"
          >
            {toggleLabel}
          </button>

          {/* D-pad (touch / mouse) */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1">
            <span />
            <DpadButton label={t.snake.up} onClick={() => dispatch({ type: "turn", dir: { x: 0, y: -1 } })}>
              <ArrowUp size={16} />
            </DpadButton>
            <span />
            <DpadButton label={t.snake.left} onClick={() => dispatch({ type: "turn", dir: { x: -1, y: 0 } })}>
              <ArrowLeft size={16} />
            </DpadButton>
            <span />
            <DpadButton label={t.snake.right} onClick={() => dispatch({ type: "turn", dir: { x: 1, y: 0 } })}>
              <ArrowRight size={16} />
            </DpadButton>
            <span />
            <DpadButton label={t.snake.down} onClick={() => dispatch({ type: "turn", dir: { x: 0, y: 1 } })}>
              <ArrowDown size={16} />
            </DpadButton>
            <span />
          </div>
        </div>
      </div>
    </div>
  );
};

function DpadButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-elevated text-foreground transition-colors hover:bg-card active:scale-95"
    >
      {children}
    </button>
  );
}

export default SnakeApp;

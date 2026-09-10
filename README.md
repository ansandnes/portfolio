# Portfolio

Personal portfolio site for Andreas Sandnes — resume, experience, testimonials, and a
set of interactive "mini-app" demos.

## Repository layout

| Path                | What it is                                                              |
| ------------------- | --------------------------------------------------------------------- |
| `web/`              | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 app.    |
| `server/`           | FastAPI service for the Energy Bill Analyzer (PDF → report). Currently a stub; moves to `services/energy/` and gets a real implementation in a later phase. |
| `REBUILD_PLAN.md`   | Architecture analysis and the phased rebuild plan this work follows.  |

## Prerequisites

- Node.js 22+
- npm 10+
- (Only for `server/`) Python 3.11+

## Getting started — web

```bash
cd web
cp .env.example .env.local   # then fill in API_KEY_GEMINI
npm install
npm run dev                  # http://localhost:3000
```

### Scripts (`web/`)

| Script                | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Start the dev server.                    |
| `npm run build`       | Production build (also type-checks).     |
| `npm run start`       | Serve the production build.              |
| `npm run typecheck`   | `tsc --noEmit` (run after a build).      |
| `npm run lint`        | ESLint (flat config).                    |
| `npm run format`      | Prettier write.                          |
| `npm run format:check`| Prettier check (no writes).              |
| `npm test`            | Vitest unit tests.                       |

## Environment variables

See [`web/.env.example`](web/.env.example). Real values live in `web/.env.local`,
which is git-ignored.

| Variable              | Scope       | Notes                                             |
| --------------------- | ----------- | ------------------------------------------------ |
| `API_KEY_GEMINI`      | server only | Gemini API key. Used by AI route handlers only. |
| `NEXT_PUBLIC_API_URL` | client      | Energy service base URL (temporary — see plan). |

## Getting started — server (optional)

```bash
cd server
python -m venv .venv && . .venv/Scripts/activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Deployment

- `web/` → Vercel.
- `server/` → a container host (Render / Fly). Not yet wired for production; see
  `REBUILD_PLAN.md` §9 Phase 6 and Phase 9.

## Contributing

CI (`.github/workflows/ci.yml`) runs build, typecheck, lint, and unit tests on
every push to `main` and every pull request. Keep them green.

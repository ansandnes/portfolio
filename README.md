# Portfolio

Personal portfolio site for Andreas Sandnes — resume, experience, testimonials, and a
set of interactive "mini-app" demos.

## Repository layout

| Path                | What it is                                                              |
| ------------------- | --------------------------------------------------------------------- |
| `web/`              | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 app.    |
| `services/energy/`  | FastAPI service for the Energy Bill Analyzer. **Deferred** — stub parsing, not deployed, not called by the app. See its README. |
| `REBUILD_PLAN.md`   | Architecture analysis and the phased rebuild plan this work follows.  |

## Prerequisites

- Node.js 22+
- npm 10+
- Python 3.11+ (only for `services/energy/`)

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
| `npm run preview`     | Build, then serve the production build.  |
| `npm run typecheck`   | `tsc --noEmit` (run after a build).      |
| `npm run lint`        | ESLint (flat config).                    |
| `npm run format`      | Prettier write.                          |
| `npm run format:check`| Prettier check (no writes).              |
| `npm test`            | Vitest unit tests.                       |

## Environment variables

See [`web/.env.example`](web/.env.example). Real values live in `web/.env.local`,
which is git-ignored.

| Variable                     | Scope       | Notes                                                    |
| ---------------------------- | ----------- | ------------------------------------------------------ |
| `API_KEY_GEMINI`             | server only | Gemini API key. Used by the AI route handlers only.   |
| `ALLOWED_ORIGINS`            | server only | Extra origins allowed to call the API routes.         |
| `LOG_LEVEL`                  | server only | `debug` \| `info` \| `warn` \| `error` (default info).|
| `NEXT_PUBLIC_SITE_URL`       | client      | Canonical URL for metadata / sitemap / robots.        |
| `NEXT_PUBLIC_ENERGY_ENABLED` | client      | `true` shows the (deferred) Energy Analyzer tab.      |

## Getting started — services/energy (optional, deferred)

Not required to run the site. See [`services/energy/README.md`](services/energy/README.md).

## Deployment

- `web/` → Vercel.
- `services/energy/` → not deployed. When built (REBUILD_PLAN.md §9 Phase 6), it
  goes on a container host (Render / Fly) behind the Next.js proxy route.

## Contributing

CI (`.github/workflows/ci.yml`) runs build, typecheck, lint, and unit tests on
every push to `main` and every pull request. Keep them green.

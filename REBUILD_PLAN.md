# Portfolio — Architecture Analysis & Phased Rebuild Plan

**Author:** Senior architect review
**Date:** 2026-09-10
**Status:** PLAN ONLY — no implementation until explicitly instructed.
**Scope reviewed:** `client/` (Next.js 16 App Router) and `server/` (FastAPI). Note: the working tree changed during review from an older Dash/Plotly portfolio to the current Next.js + FastAPI split; this plan covers the **current** tree only.

---

## 1. Executive summary

This is a **single‑person portfolio website** (resume, experience, testimonials, and a set of interactive "mini‑app" demos) built as two independent codebases:

- **`client/`** — Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript. Contains all pages, UI, a Gemini AI integration (via a legacy `pages/api` route), a half‑built custom i18n context, and a Google Translate widget.
- **`server/`** — A FastAPI service with one endpoint (`POST /analyze`) that accepts uploaded electricity‑bill PDFs and returns a ZIP of a PDF report + CSV + JSON. The PDF parsing is a **stub** (returns hard‑coded demo rows).

**Overall assessment:** the *product concept* is sound and the *baseline stack choice* (Next.js App Router + React + Tailwind + TS) is appropriate. The *execution* has significant, fixable problems: a **live API key committed to the repo**, **no version control at all**, an **unauthenticated file‑upload endpoint with a path‑traversal bug**, the root layout forced to a Client Component (killing SSR/SEO benefits), ~230 lines of translation strings for an unrelated grocery‑store app, undefined Tailwind design tokens used throughout, duplicated content in 2–3 places, and no tests, config validation, or CI.

**The frontend/backend split is *mostly not justified*.** The portfolio itself needs no Python. Only the Energy Bill Analyzer benefits from Python (PDF table extraction, pandas, HTML→PDF). Recommendation: collapse to a **single Next.js application** and treat the energy analyzer as an **optional, containerized Python sidecar** behind a Next.js proxy route — or defer it behind a feature flag until it is a real feature.

**Recommended target:** Option A — a single Next.js (App Router) app on Vercel, no database, no auth, AI via Route Handlers with validation + rate limiting; energy analyzer as a separate small FastAPI container (Render/Fly/Railway) *only if* it becomes real.

---

## 2. Current architecture (what exists today — facts from the code)

### 2.1 Repository layout

```
portfolio_claude/
├── README.md                       # duplicated "# portfolio" heading, marketing blurb
├── client/                         # Next.js app
│   ├── .env.local                  # ⚠ committed; contains a LIVE Gemini API key
│   ├── package.json                # next 16.0.7, react 19.2, tailwind 4.1.17, @google/genai 1.31, framer-motion 12, lucide-react
│   ├── package-lock.json
│   ├── next.config.ts              # empty
│   ├── postcss.config.mjs          # @tailwindcss/postcss
│   ├── next-env.d.ts               # references ./.next/dev/types → app has been run at least once
│   ├── (no tsconfig.json)          # ⚠ missing from tree
│   ├── (no .gitignore, no eslint config despite "lint" script)
│   ├── pages/
│   │   └── api/ai/gemini/generateText.ts   # ⚠ Pages Router API route mixed into an App Router app
│   ├── public/                     # cv_andreas_sandnes.pdf + stale create-next-app svgs
│   └── app/
│       ├── layout.tsx              # ⚠ "use client" on the ROOT layout; dead imports (useState, useLanguage)
│       ├── page.tsx                # Home; testimonials.slice(4,6); card markup duplicated from testimonials page
│       ├── globals.css             # Tailwind v4 @import + redundant v3 @tailwind directives; no @theme tokens
│       ├── favicon.ico
│       ├── (pages)/
│       │   ├── resume/page.tsx     # "use client"; hard-coded data; Norwegian; JSX inside data arrays
│       │   ├── experience/page.tsx # async component (nothing async); 7 typed ExperienceItems; English
│       │   ├── testimonials/page.tsx
│       │   └── projects/
│       │       ├── page.tsx        # tabbed shell; AiChat + GENAI tab commented out
│       │       └── apps/{TodoApp,RecipeApp,AiChat,EnergyBillsApp}.tsx
│       ├── components/{Navbar,Footer,Button,GoogleTranslate}.tsx
│       ├── assets/
│       │   ├── css/googleTranslate.css
│       │   └── testimonials/Testimonials.tsx   # 6 testimonials as structured data (good)
│       ├── services/ai/gemini/generateText.ts  # real Gemini calls (@google/genai), server-side
│       ├── types/index.ts          # AppRoute enum (route-as-enum), MiniAppType, TodoItem, RecipeResponse, ExperienceItem
│       └── utils/
│           ├── ResumeDownload.tsx  # bare function, anchor-injection download
│           ├── ai/gemini/          # ⚠ empty dir (naming overlap with services/ai/gemini)
│           └── context/language/LanguageContext.tsx  # ⚠ grocery-store translations; no "use client"; large commented block
└── server/                         # FastAPI
    ├── main.py                     # POST /analyze; CORS hard-coded to localhost:3000
    ├── requirements.txt            # ⚠ no version pins; weasyprint (needs system libs), kaleido, pdfplumber, pymupdf
    ├── processing/pipeline.py      # ⚠ STUB: returns hard-coded rows, no real PDF parsing
    ├── reporting/report.py         # Jinja2 string template → WeasyPrint PDF
    └── export/export.py            # df → csv + json
```

### 2.2 Frontend architecture

- **Framework:** Next.js 16, App Router, but with a **Pages Router `pages/api` route still present** for the AI endpoint → mixed routing paradigms.
- **Rendering:** Root `app/layout.tsx` is `"use client"`, which forces the **entire tree** to opt out of Server Components benefits (streaming, `metadata` API, RSC data fetching). No `metadata` export anywhere → no SEO/OpenGraph.
- **Routing:** `app/(pages)/…` route group. Routes are modeled as a TypeScript `enum AppRoute` (`HOME='/'`, …) with a stray `ENERGY='ENERGY'` value that is not a path.
- **State management:** Local `useState` per component. One React Context (`LanguageContext`) providing `{language, setLanguage, t}` — but **no UI anywhere calls `setLanguage`**, so language is effectively fixed to the browser default. `t()` is consumed **only** by `RecipeApp`.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`. `globals.css` uses both the v4 `@import "tailwindcss"` **and** the obsolete v3 `@tailwind base/components/utilities` directives. **No `tailwind.config.*` and no `@theme` block**, yet components use custom tokens that are therefore **undefined and silently no‑op**: `bg-primary`, `bg-secondary`, `bg-surface`, `text-dark`, `ring-dark`, `animate-slide-up`, `animate-fade-in`, `animate-fade-in-up`, `scrollbar-thin/scrollbar-thumb-*`.
- **Animation:** `framer-motion` (~sizeable) used for trivial fade/slide transitions.
- **Icons:** `lucide-react` (fine).
- **Components:** `Button` (variant map referencing undefined tokens), `Navbar` (mobile toggle, unused icon imports), `Footer` (embeds `GoogleTranslate`), `GoogleTranslate` (injects `<script src="//translate.google.com/...">` on mount; removes it on unmount — can throw).
- **Import style:** inconsistent — mix of `@/app/...` alias and deep `../../../` relative paths.

### 2.3 Backend architecture (`server/`)

- **FastAPI** with a single `POST /analyze` route. No routers, no versioning, no auth, no rate limiting.
- **Pipeline:** `main.py` → `processing.pipeline.process_files` → `reporting.report.generate_pdf` (Jinja2 string + WeasyPrint) + `export.export.export_csv_json`. Results zipped and returned via `FileResponse` with a `BackgroundTask` cleanup of the temp dir.
- **Parsing is not implemented.** `process_files` ignores PDF contents and emits `{"provider": "Demo Energy", "kwh": 1200, "total_cost": 1500, …}` per file.
- **`pydantic` is imported in requirements but no models are defined.**
- **CORS:** `allow_origins=["http://localhost:3000"]`, `allow_credentials=True`, `allow_methods=["*"]`, `allow_headers=["*"]`.

### 2.4 API design

| Endpoint | Style | Caller | Notes |
|---|---|---|---|
| `POST /api/ai/gemini/generateText` | Next.js **Pages Router** API route | `RecipeApp`, `AiChat` (disabled) | Body `{prompt, type}`; `type==='recipe'` → structured JSON via Gemini `responseSchema`; else free text. `console.log`s prompt + whether key is loaded. |
| `POST {NEXT_PUBLIC_API_URL}/analyze` | FastAPI | `EnergyBillsApp` (browser → FastAPI **directly**) | multipart `files[]` + optional `dataset`. Returns a ZIP blob. |

No REST resource modeling, no OpenAPI use on the Next side, no shared client. The browser calls FastAPI directly (cross‑origin), so production requires a publicly exposed FastAPI + CORS management.

### 2.5 Database architecture

**None.** No database, ORM, migrations, or persistent storage anywhere. All content is hard‑coded in `.tsx`/`.ts`. Energy analysis is stateless (temp dir, deleted after response).

### 2.6 Authentication & authorization

**None, and none required by the product.** There are no user accounts, protected pages, or per‑user data. The AI and upload endpoints are open (a cost/abuse risk — see Problems).

### 2.7 Data models / shared types

`client/app/types/index.ts`:
- `enum AppRoute` — routes-as-enum (anti‑pattern; `ENERGY='ENERGY'` is not a route).
- `enum MiniAppType` — `TODO`, `RECIPE`, `ENERGY` (`GENAI` commented out).
- `interface ExperienceItem { id, role, company, period, description[], techStack[] }` — clean, used by `experience/page.tsx`.
- `interface TodoItem`, `interface RecipeResponse { recipeName, ingredients[], instructions }`.
- Testimonials have an **implicit** shape (defined inline in `assets/testimonials/Testimonials.tsx`): `{id, name, role, company, relation, image, content, tech[], traits[], impact[]}` — no interface.
- Energy "bill row" shape lives only in the Python stub: `{provider, period_start, period_end, kwh, total_cost}` — not shared with the client, which types the result as `{pdf?, csv?, json?}`.

No shared types between `client` and `server`.

### 2.8 Business logic

- **AI orchestration:** `client/app/services/ai/gemini/generateText.ts` — `generateText()` and `generateRecipeAndIngredients()`. The recipe function correctly uses Gemini structured output (`responseMimeType: application/json` + `responseSchema`). Both re‑instantiate `new GoogleGenAI(...)` per call.
- **Energy pipeline:** `server/processing/pipeline.py` (stub) + `reporting/report.py` + `export/export.py`.
- Everything else is presentational.

### 2.9 Utilities

- `client/app/utils/ResumeDownload.tsx` — programmatic `<a download>` click (a plain link would do).
- `client/app/utils/context/language/LanguageContext.tsx` — custom `t(path)` dot‑path resolver over a translations object whose contents describe **"Family Market"** (a grocery delivery app: shop, cart, checkout, AI Chef, auth). Unrelated to this portfolio.
- `client/app/utils/ai/gemini/` — **empty**.

### 2.10 Configuration

- `next.config.ts` — empty (no image domains, no security headers, no redirects).
- `postcss.config.mjs` — Tailwind v4 plugin only.
- **No `tsconfig.json` in the tree** (Next would generate one on `dev`/`build`; its absence means the repo cannot be type‑checked as committed).
- **No ESLint config** although `package.json` has `"lint": "eslint"` and `eslint-config-next`.
- **No `.gitignore`. No git repository.**
- `server/` — no config module, no settings, no `pyproject.toml`, no lockfile.

### 2.11 Environment variables

`client/.env.local` (committed):
- `API_KEY_GEMINI="AIza…"` — **a real, working key, in the repo.** Also echoed indirectly by `console.log("API Key Loaded:", … ? "YES" : "NO")`.
- `NEXT_PUBLIC_API_URL="http://localhost:8000"` — used **client‑side** by `EnergyBillsApp` to reach FastAPI.

No env validation, no `.env.example`, no schema. `server/` reads no env vars at all (CORS origin is hard‑coded).

### 2.12 Dependencies

**client** — runtime: `next@16.0.7`, `react@19.2`, `react-dom@19.2`, `@google/genai@^1.31`, `framer-motion@^12.23`, `lucide-react@^0.555`, `postcss` (odd as a runtime dep). dev: `tailwindcss@^4.1`, `@tailwindcss/postcss`, `typescript@^5`, `eslint@^9`, `eslint-config-next@16.0.7`, `@types/*`, `baseline-browser-mapping` (looks accidentally hoisted). **Missing:** `zod` (or any validation), any test framework, `tsconfig`.

**server** — `fastapi`, `uvicorn[standard]`, `pandas`, `numpy`, `plotly`, `kaleido`, `pdfplumber`, `pymupdf`, `jinja2`, `weasyprint`, `python-multipart`, `pydantic`, `python-dateutil`. **All unpinned.** `weasyprint` requires system libraries (Pango/Cairo/GDK‑PixBuf) → will not run on Vercel/most serverless; `plotly`+`kaleido` are imported nowhere.

### 2.13 Build tooling

- Next.js built‑in (Turbopack/webpack) via `next dev` / `next build` / `next start`. No CI, no pre‑commit hooks, no formatter.
- Python: none — no build, no container, no `uv`/`poetry`, `uvicorn` invoked manually.

### 2.14 Styling system

Tailwind v4, dark theme, emerald accent. Global CSS also hand‑rolls scrollbar styling, focus rings, selection colors, reduced‑motion handling (reasonable). Undermined by the undefined custom tokens (§2.2) and the v3/v4 directive mix.

### 2.15 Testing

**None.** No unit, integration, or e2e tests anywhere. No test runner installed.

### 2.16 Error handling

- Client: `try/catch` with `alert(...)` (EnergyBillsApp) or an inline error string (RecipeApp); `AiChat` pushes an error message bubble. **No `error.tsx`, `not-found.tsx`, or `loading.tsx`** route files. No error boundary.
- AI route: catch → `500 {error: "Failed to generate AI output"}` (opaque). Recipe path can `JSON.parse` a non‑JSON response and throw.
- Server: essentially no error handling — a bad upload (non‑PDF, huge file, malformed CSV) will raise and 500.

### 2.17 Security

- **Committed live secret** (`API_KEY_GEMINI`).
- **Path traversal:** `server/main.py` writes `os.path.join(upload_dir, file.filename)` with the client‑controlled `file.filename` → `../../…` escapes the temp dir → arbitrary file write.
- **Unauthenticated, unbounded upload:** no auth, no file count limit, no size limit, no MIME/type validation; `pandas.read_csv` on an arbitrary uploaded "dataset". DoS + resource exhaustion.
- **Open AI endpoint:** no origin check, no rate limit, no auth → anyone can spend your Gemini quota.
- **Third‑party script injection:** Google Translate loads a `<script>` from `translate.google.com` on every page (Footer) — supply‑chain/CSP surface, DOM mutation, deprecated widget.
- **No security headers** (`next.config.ts` empty): no CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`.
- **PII in the client bundle:** phone number + personal email hard‑coded in `resume/page.tsx`.
- CORS on FastAPI: `allow_credentials=True` with `allow_methods/headers=["*"]`.

### 2.18 Performance

- Root layout as Client Component → no RSC/streaming, larger client bundle, no static optimization of otherwise‑static pages.
- `framer-motion` shipped for trivial transitions.
- Google Translate script on every route.
- No `next/image` usage; no image optimization config.
- `EnergyBillsApp.handleDownloadAll` **re‑POSTs and re‑runs the whole analysis** instead of reusing the blob already fetched.
- Positives: little client JS otherwise; Tailwind purges unused CSS; content is tiny.

### 2.19 Developer experience

- **No git**, no CI, no formatter, no ESLint config, no test runner, no `tsconfig`, no `.env.example`, no run docs (README is a marketing blurb + stale create‑next‑app text).
- Two languages, two dependency managers, two run commands, no orchestration (`docker-compose`/`turbo`/`Makefile`).
- Mixed import conventions; empty/placeholder directories.

### 2.20 Deployment assumptions

- Client README implies **Vercel**. But: `pages/api` route runs on Vercel fine; the **FastAPI service cannot** (WeasyPrint system libs) and the browser calls it at `http://localhost:8000` with no production URL wired. So the energy feature has **no viable deployment path today**.

### 2.21 Technical debt / dead / duplicated code

- **Dead:** `client/app/utils/ai/gemini/` (empty); `AiChat.tsx` + `MiniAppType.GENAI` (commented out of the shell); `public/{next,vercel,window,globe,file}.svg`; `plotly`/`kaleido` in `server/requirements.txt`; large commented block at the bottom of `LanguageContext.tsx`; unused icon imports in `Navbar.tsx`; unused `useState`/`useLanguage` imports in `layout.tsx`; `AppRoute.ENERGY`.
- **Wrong‑project:** the entire `translations` object in `LanguageContext.tsx` (grocery store) — ~230 lines.
- **Duplicated:** the testimonial **card markup** is copy‑pasted between `app/page.tsx` and `app/(pages)/testimonials/page.tsx` (~60 lines each). Resume/experience data exists in `resume/page.tsx` (NO, 2 jobs), `experience/page.tsx` (EN, 7 jobs), and the PDF — with mismatched dates ("05/2025‑08/2025" vs "03/25‑08/25").
- **Inconsistent:** routing paradigm (App vs Pages), i18n approach (custom context vs Google Translate), import paths, `services/ai` vs `utils/ai`.
- **Stub masquerading as a feature:** `server/processing/pipeline.py`.

---

## 3. Problems & technical debt (ranked)

### Critical

| # | Problem | Impact | Fix location |
|---|---|---|---|
| C1 | Live `API_KEY_GEMINI` committed in `client/.env.local` | Key is compromised; quota/billing abuse | Rotate key now; remove file; add `.gitignore` + `.env.example`; move to host env vars |
| C2 | No version control (no git repo, no `.gitignore`) | No history, no rollback, no review, no CI, easy to ship secrets | `git init` in Phase 1 |
| C3 | Path traversal in `server/main.py` (`file.filename` written unsanitized) | Arbitrary file write on the server host | Sanitize to basename; random names; Phase 6 |
| C4 | Unauthenticated, unbounded upload + open AI endpoint | DoS, resource exhaustion, Gemini quota theft | Size/count/type limits, rate limit, origin check; Phases 5–6, 8 |
| C5 | Root `app/layout.tsx` is `"use client"` | Whole app loses SSR/RSC/streaming/`metadata`; SEO effectively broken | Convert to Server Component; Phase 2 |

### High

| # | Problem | Impact |
|---|---|---|
| H1 | Mixed App Router + `pages/api` | Confusing, fragile, misses App Router middleware/streaming; two mental models |
| H2 | `LanguageContext` translations are for an unrelated grocery app; provider missing `"use client"`; no language switcher wired | ~230 lines of misleading dead code; i18n is non‑functional |
| H3 | Undefined Tailwind tokens (`bg-primary`, `bg-surface`, `animate-*`, …) used app‑wide | Components render without intended styling; silent failure |
| H4 | Energy pipeline is a stub; `weasyprint`/`plotly` deployment problems; browser→FastAPI direct call with no prod URL | The headline "project" doesn't work and can't deploy |
| H5 | `EnergyBillsApp` result mapping bug (pdf/csv/json all point to the ZIP blob) + `handleDownloadAll` re‑runs analysis | Broken UX, doubled cost/latency |
| H6 | No `tsconfig.json`, no ESLint config committed | Repo can't be type‑checked/linted as‑is |
| H7 | Duplicated testimonial card markup; resume/experience data in 2–3 diverging sources | Content drift, maintenance cost |
| H8 | No tests, no CI | No regression safety for the rebuild |
| H9 | `console.log` of prompt + key‑presence in the AI route | Log noise / minor info leak |

### Medium

| # | Problem |
|---|---|
| M1 | No `error.tsx` / `not-found.tsx` / `loading.tsx`; `alert()`‑based error UX |
| M2 | No `metadata` / SEO / OpenGraph / sitemap / robots |
| M3 | Routes modeled as a TS enum incl. a non‑route value |
| M4 | `next.config.ts` empty — no security headers, no image config |
| M5 | Resume content is Norwegian while the rest of the site is English (intent UNKNOWN) |
| M6 | `framer-motion` for trivial animation; Google Translate script on every page |
| M7 | `server/requirements.txt` unpinned; unused `plotly`/`kaleido`; `pydantic` imported but unused |
| M8 | Inconsistent import paths (`@/app` vs deep relative) |
| M9 | `experience/page.tsx` is `async` for no reason; `ResumeDownload` is a function in a `.tsx` file |
| M10 | CORS `allow_credentials=True` + wildcard methods/headers |
| M11 | No shared types between client and server for the energy payload |

### Low

| # | Problem |
|---|---|
| L1 | `README.md` duplicated heading + stale create‑next‑app boilerplate in `client/README.md` |
| L2 | Stale `public/*.svg` assets |
| L3 | Empty `client/app/utils/ai/gemini/` dir |
| L4 | Unused imports (`Navbar` icons, `layout.tsx`) |
| L5 | Leftover AI‑generation comment in `layout.tsx` ("You keep your layout 100% identical") |
| L6 | Typos ("triming") in experience data |
| L7 | `testimonial.image` always `null` (unfinished avatars) |

---

## 4. What should be preserved

- **Product direction:** portfolio with Resume / Experience / Testimonials / Projects + a few live mini‑app demos. Keep.
- **Baseline stack:** Next.js App Router + React 19 + TypeScript + Tailwind v4. Correct choice for this product; keep (but use it properly — Server Components, Route Handlers, design tokens).
- **Testimonials as structured data** (`assets/testimonials/Testimonials.tsx`): good shape (`name, role, company, relation, content, tech[], traits[], impact[]`). Keep the data; give it an interface; move to `content/`.
- **Experience data** (`experience/page.tsx`, typed via `ExperienceItem`): the most complete, most current résumé source (7 roles, English). Keep as the **single source of truth** for work history.
- **Gemini structured‑output usage** in `generateRecipeAndIngredients` (`responseSchema`): idiomatic and correct. Keep the approach; harden inputs.
- **Visual language:** dark UI, emerald accent, timeline layout for experience, card layout for testimonials. Keep; formalize as tokens.
- **`TodoApp` / `RecipeApp` UI**: fine as demo components after cleanup.
- **Global CSS niceties**: reduced‑motion handling, focus‑visible ring, custom scrollbar, `::selection`. Keep (fold into the token layer).
- **FastAPI as the tool for real PDF work** *if* the Energy Analyzer becomes a genuine feature — Python's `pdfplumber`/`pymupdf` + pandas are the right tools. Keep the *idea*, not the current stub.
- **`cv_andreas_sandnes.pdf`** in `public/`. Keep.

### Replace rather than carry forward

- `"use client"` root layout → Server Component.
- `pages/api/...` → `app/api/.../route.ts`.
- `LanguageContext` + grocery translations + Google Translate widget → one deliberate i18n decision (recommend: **English‑only**, delete both) or `next-intl` if bilingual is a real requirement.
- Undefined Tailwind tokens → a real `@theme` token layer.
- Hard‑coded, duplicated page data → `content/` modules with interfaces.
- `alert()` error handling → route‑level error UI + inline states.
- Unpinned `server/requirements.txt` → `pyproject.toml` + lockfile (`uv`), pinned, trimmed.
- Direct browser→FastAPI call → Next.js proxy Route Handler.

---

## 5. Target architecture (recommended)

**Option A — Minimal / efficient (RECOMMENDED)**

- **One Next.js 16 application** (App Router), TypeScript strict, React 19 Server Components by default; Client Components only for interactive islands (nav toggle, mini‑apps).
- **No database.** Content lives in typed `content/*.ts` modules (optionally MDX later). Nothing in the product needs persistence.
- **No auth.** Nothing to protect. Abuse is handled with rate limiting + same‑origin checks on the AI routes.
- **API strategy:** App Router **Route Handlers** (`app/api/*/route.ts`) for:
  - `ai/recipe` and `ai/chat` — call Gemini server‑side with the key in host env vars.
  - `energy/analyze` — *proxy* to the Python service (never expose it to the browser).
- **Validation:** `zod` at every route boundary (request bodies, uploaded file metadata). Shared schemas in `lib/schemas.ts`; inferred types reused by client fetchers.
- **State management:** local component state only. No global store. (i18n: see §10 D1.)
- **Styling:** Tailwind v4 with a `@theme` token block (`--color-primary`, `--color-surface`, `--color-accent`, radii, the `animate-*` keyframes actually referenced). Delete the v3 directives.
- **Component architecture:** `components/ui/` (Button, Tag, Section, Card primitives) + `components/` (Navbar, Footer, TestimonialCard, ExperienceTimeline). One card component, used by both Home and Testimonials.
- **Error handling:** `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx`, plus per‑route `error.tsx` for `/projects`. Route Handlers return typed error envelopes; no secrets in messages.
- **Logging:** structured `console` on the server via a tiny `lib/log.ts` (level‑gated); remove ad‑hoc `console.log`. Optionally Vercel Analytics/Log Drains later.
- **Security:** security headers + CSP in `next.config.ts`; rate limiting (`@upstash/ratelimit` if a Redis is available, else a small in‑memory limiter for the single instance); same‑origin check on AI routes; no third‑party scripts.
- **Testing:** Vitest + React Testing Library (unit/component), Playwright (e2e happy paths). CI on GitHub Actions.
- **Deployment:** Vercel for the Next app. **If** the energy analyzer is kept: a small FastAPI container on Render/Fly/Railway, reached only through the Next proxy route; env‑configured URL + shared secret header.
- **DX:** single repo, `git`, `.gitignore`, `.env.example`, Prettier + ESLint (flat config) + `tsc --noEmit` + tests in CI, a short real README, optional `Makefile`/`docker-compose` only if the Python service is retained.

**Option B — More scalable (NOT recommended here)**

Next.js frontend + a standalone backend (NestJS or FastAPI) exposing a REST/tRPC API, PostgreSQL via Prisma or Drizzle, auth (Auth.js), stored "analysis" records, background workers for PDF jobs, object storage for uploads, containerized, IaC.

*Why not:* there are **no users, no persistent data, no multi‑tenant or workflow requirements, no team**. Every element of Option B is speculative. It multiplies surface area, cost, and maintenance for a personal site that renders mostly static content plus a couple of stateless AI calls. It would be premature and is explicitly against the engineering principles for this project.

**Verdict:** **Option A.** Robust, secure, maintainable, and *sufficiently* scalable (Vercel + a stateless container scale far beyond a portfolio's needs). Revisit Option B only if the Energy Analyzer becomes a real multi‑user product with saved history.

---

## 6. Technology evaluation

### 6.1 Per‑technology verdict

| Technology (current) | Why it was likely chosen | Still appropriate? | Verdict |
|---|---|---|---|
| **Next.js 16 App Router** | Modern React meta‑framework, Vercel deploy, RSC | Yes — but currently misused (client root layout, `pages/api`) | **Keep**, use idiomatically |
| **React 19** | Default with Next 16 | Yes | **Keep** |
| **TypeScript** | Type safety | Yes — but no committed `tsconfig`, no `strict` guarantee | **Keep**, add strict `tsconfig` |
| **Tailwind CSS v4** | Fast styling, small output | Yes — but no token layer, v3/v4 mix | **Keep**, add `@theme` |
| **`@google/genai`** | Official Gemini SDK; structured output | Yes | **Keep**, centralize client, validate inputs |
| **`framer-motion`** | Easy animation | Marginal — used for trivial fades | **Replace** with CSS transitions / Tailwind `animate-*` (drop dep) |
| **Google Translate widget** | Cheap "translation" | No — deprecated, CSP/supply‑chain risk, DOM hacks | **Remove** |
| **Custom `LanguageContext`** | DIY i18n | No — wrong content, non‑functional, no switcher | **Remove** (or replace with `next-intl` if bilingual is required) |
| **`pages/api` route** | Familiar API pattern | No in an App Router app | **Replace** with Route Handler |
| **FastAPI** | Right tool for PDF/pandas/HTML→PDF | Only for the energy feature; not for the site | **Keep as optional sidecar** or **defer** |
| **WeasyPrint** | HTML→PDF | Risky deploy (system libs), not serverless | **Replace** with a container build, or `playwright` `page.pdf()`, or drop PDF output |
| **`plotly` + `kaleido`** (server) | (imported nowhere) | No | **Remove** |
| **`pydantic`** (server) | Validation | Yes — but unused | **Use it** (define request/row models) or remove |
| **No database** | Nothing to store | Correct | **Keep (none)** |
| **No auth** | No accounts | Correct | **Keep (none)** |

### 6.2 Architecture options compared

| Option | Advantages | Disadvantages | Migration difficulty | Fit |
|---|---|---|---|---|
| **A1. Next.js only, no Python** (reimplement energy parsing in TS with `unpdf`/`pdf-parse`; PDF report via Playwright or drop it) | One codebase, one deploy (Vercel), one language, simplest DX, no CORS, no sidecar cost | PDF table extraction weaker in JS; Playwright on serverless needs `@sparticuz/chromium` or a separate runtime | **Low** for the site; **Medium** for energy parsing | **Best** if energy analyzer is a *demo*; parsing quality is "good enough" |
| **A2. Next.js + small FastAPI sidecar** (proxy route; container host) *(RECOMMENDED)* | Site stays simple; Python only where it earns its place; browser never touches Python; can harden the one endpoint | Two deploy targets, one extra container, a shared‑secret to manage | **Low–Medium** | **Best overall**; matches the real requirement split |
| **A3. Next.js + FastAPI, browser calls FastAPI directly** (current shape) | Least code change | CORS management, public Python surface, no single origin, harder security headers/rate limiting | n/a (already here) | Poor |
| **B1. Next.js + NestJS + Postgres + Prisma/Drizzle + Auth** | Room to grow into a real product; typed API; persistence; RBAC | Massive overkill; ~4× surface; hosting cost; slow iteration; speculative | **High** | Poor for a portfolio |
| **B2. FastAPI‑rendered frontend (templates) / full‑Python (e.g. Reflex)** | One language (Python), matches author's background | Abandons a working modern FE; weaker component ecosystem; SEO/SSR story worse; the *previous* Dash portfolio already showed the limits | **High** (full rewrite) | Poor — regresses the FE |
| **C. Astro (content‑first) + islands + one API route** | Excellent for a mostly‑static content site; ships less JS; MDX‑native | Rewrites all pages; team familiarity with Next lost; mini‑apps still need React islands; energy proxy still needed | **Medium–High** | Reasonable alternative; not enough upside to justify the rewrite over fixing Next |

**Recommendation: A2** (with **A1** as the fallback if you decide the energy analyzer is only ever a demo — then delete `server/` entirely).

**Why A2 fits this application better than the alternatives:**
- The product is **95% static content + ~3 stateless interactive widgets**. That is Next.js App Router's sweet spot; nothing here calls for a database, an ORM, auth, a message queue, or a separate API tier.
- The **one** genuine Python need (robust PDF table extraction + pandas + HTML→PDF) is isolated to a single endpoint. A2 contains that in one small, independently deployable, independently testable service, invoked through a Next proxy so the public surface stays a single origin with unified headers and rate limiting.
- A2 is the **simplest design that removes every Critical/High issue** without adding speculative infrastructure. B‑options add cost and cognitive load with zero present benefit; a full Astro/Python rewrite throws away a working, appropriate frontend.

---

## 7. Target project structure

```text
portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml                       # typecheck + lint + unit + build (+ e2e on PR)
├── .gitignore
├── README.md                            # what it is, how to run, how to deploy
├── REBUILD_PLAN.md                      # this document
│
├── web/                                 # the Next.js application (renamed from client/)
│   ├── .env.example                     # documents every var; no real values
│   ├── next.config.ts                   # security headers, CSP, image config
│   ├── tsconfig.json                    # strict
│   ├── eslint.config.mjs                # flat config (next + @typescript-eslint)
│   ├── prettier.config.mjs
│   ├── postcss.config.mjs
│   ├── vitest.config.ts
│   ├── playwright.config.ts
│   ├── package.json
│   │
│   ├── app/
│   │   ├── layout.tsx                   # SERVER component; exports metadata
│   │   ├── page.tsx                     # Home (Server) — uses <TestimonialCard/>
│   │   ├── error.tsx  loading.tsx  not-found.tsx
│   │   ├── sitemap.ts  robots.ts  opengraph-image.tsx
│   │   ├── resume/page.tsx              # Server — renders content/resume
│   │   ├── experience/page.tsx          # Server — renders content/experience
│   │   ├── testimonials/page.tsx        # Server — renders content/testimonials
│   │   ├── projects/
│   │   │   ├── page.tsx                 # Server shell
│   │   │   ├── error.tsx
│   │   │   └── _apps/                   # Client Components (interactive islands)
│   │   │       ├── TodoApp.tsx
│   │   │       ├── RecipeApp.tsx
│   │   │       ├── AiChatApp.tsx        # ship or delete (D2)
│   │   │       └── EnergyApp.tsx        # behind feature flag (D3)
│   │   └── api/
│   │       ├── ai/
│   │       │   ├── recipe/route.ts      # POST: zod → gemini → typed JSON
│   │       │   └── chat/route.ts        # POST: zod → gemini text  (if D2 = ship)
│   │       └── energy/
│   │           └── analyze/route.ts     # POST: validate upload → proxy to services/energy
│   │
│   ├── components/
│   │   ├── ui/                          # primitives: Button, Tag, Section, Card, Field
│   │   ├── Navbar.tsx  Footer.tsx
│   │   ├── TestimonialCard.tsx          # the ONE card (Home + Testimonials)
│   │   └── ExperienceTimeline.tsx
│   │
│   ├── content/                         # SINGLE SOURCE OF TRUTH (typed, no JSX)
│   │   ├── profile.ts                   # name, headline, contact, links
│   │   ├── experience.ts                # ExperienceItem[]
│   │   ├── resume.ts                    # derived view model / or MDX
│   │   └── testimonials.ts              # Testimonial[]
│   │
│   ├── lib/
│   │   ├── env.ts                       # zod-validated process.env (server + NEXT_PUBLIC_*)
│   │   ├── schemas.ts                   # zod request/response schemas (shared client+server)
│   │   ├── gemini.ts                    # single GoogleGenAI client + helpers
│   │   ├── rate-limit.ts
│   │   ├── sanitize.ts                  # filename/basename sanitization, size/type guards
│   │   └── log.ts
│   │
│   ├── types/
│   │   └── index.ts                     # ExperienceItem, Testimonial, RecipeResponse, TodoItem, routes as const
│   │
│   ├── styles/
│   │   └── globals.css                  # @import "tailwindcss"; @theme { …tokens… }
│   │
│   ├── public/
│   │   ├── cv_andreas_sandnes.pdf
│   │   └── (favicon / og assets only — stale svgs removed)
│   │
│   └── e2e/                             # Playwright specs
│       └── *.spec.ts
│
└── services/energy/                     # OPTIONAL — only if D3 = keep
    ├── pyproject.toml                   # uv; pinned deps; ruff + mypy config
    ├── uv.lock
    ├── Dockerfile                       # includes weasyprint system libs (or swap engine)
    ├── .env.example                     # ENERGY_SHARED_SECRET, ALLOWED_ORIGIN
    ├── app/
    │   ├── main.py                      # FastAPI app + /healthz + /analyze (secret-guarded)
    │   ├── config.py                    # pydantic-settings
    │   ├── schemas.py                   # BillRow, AnalyzeResponse
    │   ├── parsing.py                   # REAL pdfplumber/pymupdf extraction
    │   ├── report.py                    # HTML template → PDF
    │   └── export.py                    # df → csv/json
    └── tests/
        ├── fixtures/sample_bill.pdf
        └── test_parsing.py
```

### Where things belong

| Concern | Location | Rule |
|---|---|---|
| **Business logic** | `web/lib/` (AI orchestration, sanitization, rate limiting) and `services/energy/app/` (PDF domain) | Never in components or route files beyond a thin call |
| **Database logic** | *none* | If ever added: `web/lib/db/` + a `drizzle/` schema dir. Not now. |
| **API routes** | `web/app/api/**/route.ts` | One folder per resource; `route.ts` only wires validation → lib → response |
| **Shared types** | `web/types/` + inferred from `web/lib/schemas.ts` | Zod schema is the source; `z.infer` for types; no hand‑kept duplicates |
| **Validation** | `web/lib/schemas.ts` (zod) at every boundary; `services/energy/app/schemas.py` (pydantic) | Reject before doing work |
| **Reusable UI** | `web/components/ui/` (primitives), `web/components/` (composite) | No markup copy‑paste across pages |
| **Content/data** | `web/content/*.ts` | Pages import from here; no inline datasets in `page.tsx` |
| **Configuration** | `web/next.config.ts`, `web/lib/env.ts`, `services/energy/app/config.py` | All env access goes through the validated module |
| **Tests** | Unit/component: colocated `*.test.ts(x)` next to source. E2E: `web/e2e/`. Python: `services/energy/tests/` | CI runs all |

---

## 8. Migration map (old → new)

### Files to keep (move + light edit)

```
client/app/types/index.ts
        ↓  split
web/types/index.ts            (ExperienceItem, Testimonial iface, RecipeResponse, TodoItem)
web/lib/routes.ts             (routes as `as const` object, drop AppRoute enum + ENERGY)

client/app/(pages)/experience/page.tsx  ──data──▶  web/content/experience.ts   (keep the 7 items)
                                        ──view──▶  web/app/experience/page.tsx  (Server) + web/components/ExperienceTimeline.tsx

client/app/assets/testimonials/Testimonials.tsx  ─▶  web/content/testimonials.ts  (add `Testimonial` interface)

client/app/(pages)/testimonials/page.tsx  ─▶  web/app/testimonials/page.tsx      (use <TestimonialCard/>)
client/app/page.tsx                       ─▶  web/app/page.tsx                    (use <TestimonialCard/>, drop slice(4,6) → curated ids)

client/app/components/Navbar.tsx   ─▶  web/components/Navbar.tsx    (drop unused icons; routes from lib/routes.ts)
client/app/components/Footer.tsx   ─▶  web/components/Footer.tsx    (remove <GoogleTranslate/>)
client/app/components/Button.tsx   ─▶  web/components/ui/Button.tsx (map variants to REAL tokens)

client/app/(pages)/projects/page.tsx            ─▶  web/app/projects/page.tsx
client/app/(pages)/projects/apps/TodoApp.tsx    ─▶  web/app/projects/_apps/TodoApp.tsx      ("use client")
client/app/(pages)/projects/apps/RecipeApp.tsx  ─▶  web/app/projects/_apps/RecipeApp.tsx    (drop useLanguage; call /api/ai/recipe)

client/app/globals.css   ─▶  web/styles/globals.css   (drop v3 @tailwind lines; add @theme)
public/cv_andreas_sandnes.pdf  ─▶  web/public/cv_andreas_sandnes.pdf
client/app/favicon.ico   ─▶  web/app/favicon.ico
```

### Files to modify (significant rework)

```
client/app/layout.tsx
        ↓  remove "use client"; delete dead imports; add `export const metadata`; wrap only client islands
web/app/layout.tsx  (Server Component)

client/pages/api/ai/gemini/generateText.ts  +  client/app/services/ai/gemini/generateText.ts
        ↓  merge; move to App Router; add zod + rate limit + origin check; single gemini client; remove console.log
web/app/api/ai/recipe/route.ts
web/app/api/ai/chat/route.ts
web/lib/gemini.ts
web/lib/schemas.ts

client/app/(pages)/resume/page.tsx
        ↓  data → web/content/resume.ts (resolve NO vs EN — D5); Server Component; no JSX-in-data
web/app/resume/page.tsx

client/app/(pages)/projects/apps/EnergyBillsApp.tsx
        ↓  fix result mapping (separate blob per artifact OR single "download ZIP"); reuse blob; call /api/energy/analyze
web/app/projects/_apps/EnergyApp.tsx

server/main.py
        ↓  sanitize filenames; size/count/type limits; shared-secret guard; /healthz; config module; pydantic models
services/energy/app/main.py + config.py + schemas.py

server/processing/pipeline.py
        ↓  implement REAL parsing (pdfplumber/pymupdf) — currently a stub
services/energy/app/parsing.py

server/reporting/report.py
        ↓  move template to a file; decide PDF engine (WeasyPrint-in-container vs Playwright vs drop)
services/energy/app/report.py

server/requirements.txt
        ↓  pyproject.toml (uv), pinned, trimmed (remove plotly/kaleido), add ruff/mypy/pytest
services/energy/pyproject.toml
```

### Files to merge

- `pages/api/ai/gemini/generateText.ts` + `app/services/ai/gemini/generateText.ts` → `web/lib/gemini.ts` + thin `route.ts` handlers.
- Testimonial card markup in `app/page.tsx` + `testimonials/page.tsx` → one `web/components/TestimonialCard.tsx`.
- `experience/page.tsx` data + `resume/page.tsx` data + PDF facts → reconcile into `web/content/experience.ts` (+ `resume.ts` view).

### Files to replace (new implementation, same intent)

- `LanguageContext.tsx` → **delete**; if bilingual is required (D1), add `next-intl` config + real `messages/en.json` / `messages/no.json`.
- `GoogleTranslate.tsx` + `assets/css/googleTranslate.css` → **delete**.
- `ResumeDownload.tsx` → plain `<a href="/cv_andreas_sandnes.pdf" download>` in the resume page.
- `next.config.ts` (empty) → security headers + CSP + image config.

### Files to delete

```
client/.env.local                              # after key rotation; replaced by .env.example + host env
client/app/utils/ai/gemini/                     # empty
client/app/utils/context/language/              # grocery-store translations
client/app/components/GoogleTranslate.tsx
client/app/assets/css/googleTranslate.css
client/app/(pages)/projects/apps/AiChat.tsx     # unless D2 = ship (then move + wire)
client/README.md                                # stale create-next-app text (replace with real one)
public/next.svg  public/vercel.svg  public/window.svg  public/globe.svg  public/file.svg
server/  (entire dir)                            # if D3 = drop the energy analyzer (Option A1)
# from server/requirements.txt: plotly, kaleido
```

### Functionality that must be rewritten (not just moved)

1. **AI endpoint** → App Router Route Handler(s), zod‑validated, rate‑limited, origin‑checked, single Gemini client, no logging of prompts/keys.
2. **Energy PDF parsing** → real extraction (currently a stub). This is net‑new implementation.
3. **Energy upload handling** → filename sanitization, size/count/MIME limits, shared‑secret between Next proxy and the service.
4. **Energy result download** → return distinct artifacts (or a single honest "Download ZIP"); never re‑run analysis to download.
5. **i18n** → one deliberate mechanism, or removed entirely.
6. **Design tokens** → `@theme` layer so `Button`/pages actually style as intended.
7. **Root layout / metadata / error & loading UI** → proper App Router primitives.

---

## 9. Phased rebuild plan

> Each phase is independently completable and verifiable. Do **not** start until told "Start Phase 1". Work **one phase at a time**; stop and report after each.

> **Pre‑req decisions** (see §10): D1 (i18n), D2 (AiChat), D3 (energy analyzer), D5 (resume language) should ideally be answered before Phase 3 / Phase 6. Phases 1–2 are safe to run regardless.

---

### Phase 1 — Foundation, safety net & tooling

**Objective:** Put the project under version control, remove the leaked secret, and establish a green baseline: type‑check, lint, format, test, and build all pass in CI.

**Why now:** Nothing else is safe to touch without git history/rollback, and the committed key must be rotated immediately. Every later phase depends on `tsc`/lint/test being runnable.

**Files/modules affected:** `client/.env.local` (delete), `client/README.md`, `README.md`, `client/package.json`, `client/globals.css` (v3 directive removal only), directory rename `client/ → web/`.

**New files/modules:** `.gitignore`, `web/.env.example`, `web/tsconfig.json` (strict), `web/eslint.config.mjs`, `web/prettier.config.mjs`, `web/vitest.config.ts`, `web/lib/env.ts`, `.github/workflows/ci.yml`, `web/lib/__tests__/env.test.ts` (smoke test).

**Dependencies:** add `zod`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `jsdom`, `prettier`, `eslint-config-prettier`, `@typescript-eslint/*`. Remove `baseline-browser-mapping` (accidental), move `postcss` to devDeps.

**Detailed tasks:**
1. **Rotate the Gemini key** in Google AI Studio; the old value in `.env.local` is burned.
2. `git init`; add `.gitignore` (`node_modules`, `.next`, `.env*` except `.env.example`, `dist`, `__pycache__`, `.venv`, coverage, Playwright artifacts).
3. Rename `client/` → `web/`. First commit = current state (post key‑removal) so history starts clean.
4. Add strict `tsconfig.json` (`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, path alias `@/*` → `web/*`).
5. Add ESLint flat config (`eslint-config-next` + `@typescript-eslint` + `eslint-config-prettier`) and Prettier config; run `--fix` once; commit the mechanical diff separately.
6. Add `lib/env.ts` — zod schema for `API_KEY_GEMINI` (server), `NEXT_PUBLIC_API_URL` / `ENERGY_SERVICE_URL` + `ENERGY_SHARED_SECRET` (mark optional for now); throw on missing at boot. Write `.env.example`.
7. `globals.css`: remove the three `@tailwind base/components/utilities` lines (keep `@import "tailwindcss"`). **Token layer is Phase 4** — here just stop the redundancy.
8. Add Vitest config + one trivial passing test.
9. Add `package.json` scripts: `typecheck` (`tsc --noEmit`), `lint`, `format`, `test`, `test:e2e` (placeholder), `build`.
10. Add CI: install → `typecheck` → `lint` → `test` → `build`.
11. Replace both READMEs with one real README (run/deploy instructions, stack, structure).

**Expected result:** A git repo with a clean history, no secret, and `npm run typecheck && npm run lint && npm run test && npm run build` all green locally and in CI. App still runs exactly as before (no behavioral change).

**Verification:**
- `git log` shows the initial commits; `git grep -i AIza` returns nothing.
- CI run is green.
- `npm run dev` — every page still renders as it did pre‑Phase‑1.
- `npm run build` completes (note any pre‑existing warnings for Phase 2).

**Risks:**
- `tsc --strict` may surface real type errors (e.g. `LanguageContext` `any`, JSX‑in‑data in `resume`). Mitigation: allow a short list of `// @ts-expect-error` with TODO(phase‑N) references to keep the baseline green; fix them in their owning phase.
- Directory rename can break IDE/editor state and any absolute paths.

**Rollback:** `git reset --hard` to the previous commit; the rename and config additions are isolated commits, each revertible.

**Definition of done:**
- [ ] Key rotated; no secret anywhere in the repo or history.
- [ ] `.gitignore`, `.env.example`, strict `tsconfig`, ESLint, Prettier, Vitest, CI all in place.
- [ ] `typecheck` + `lint` + `test` + `build` green locally and in CI.
- [ ] App behavior unchanged; single real README.

---

### Phase 2 — App Router correctness (rendering, routing, metadata, errors)

**Objective:** Make the Next.js app idiomatic: Server‑Component root layout with `metadata`, App Router API routes, proper error/loading/not‑found UI, and route constants instead of an enum.

**Why now:** This removes Critical C5 and High H1, and unblocks SEO and per‑route error handling that later phases rely on. It is content‑agnostic, so it can run before the i18n/energy decisions.

**Files/modules affected:** `web/app/layout.tsx`, `web/app/page.tsx` and all `web/app/**/page.tsx` (add `metadata`), `web/app/components/Navbar.tsx`, `web/types/index.ts`, `web/pages/api/ai/gemini/generateText.ts` (moved), `web/app/services/ai/gemini/generateText.ts` (moved into `lib/`).

**New files/modules:** `web/app/error.tsx`, `web/app/loading.tsx`, `web/app/not-found.tsx`, `web/app/projects/error.tsx`, `web/app/sitemap.ts`, `web/app/robots.ts`, `web/lib/routes.ts`, `web/app/api/ai/recipe/route.ts`, `web/app/api/ai/chat/route.ts` (chat stubbed if D2 pending), `web/lib/gemini.ts`, `web/lib/schemas.ts`, `web/lib/rate-limit.ts`.

**Dependencies:** none new (zod from Phase 1). Optional: `server-only` package for `lib/gemini.ts`.

**Detailed tasks:**
1. Convert `app/layout.tsx` to a Server Component: remove `"use client"`, remove unused `useState`/`useLanguage`/`LanguageProvider` (i18n handled in Phase 3), remove the leftover AI comment. Add `export const metadata: Metadata` (title template, description, OpenGraph, `metadataBase`).
2. Keep the visual shell identical (header/Navbar/main/Footer). Navbar is already a Client Component — fine.
3. `lib/routes.ts`: `export const ROUTES = { home:'/', resume:'/resume', experience:'/experience', testimonials:'/testimonials', projects:'/projects' } as const`. Delete `AppRoute` enum + `ENERGY`. Update `Navbar` + `page.tsx` links. Keep `MiniAppType` (it's a real discriminator) but move to `types/`.
4. Move `pages/api/ai/gemini/generateText.ts` → `app/api/ai/recipe/route.ts` (+ `app/api/ai/chat/route.ts`). Delete the `pages/` dir. Each `route.ts`: parse with a zod schema from `lib/schemas.ts`, enforce same‑origin (check `Origin`/`Referer` vs allowed host), apply `lib/rate-limit.ts`, call `lib/gemini.ts`, return typed envelope. No `console.log` of prompt/key; use `lib/log.ts`.
5. `lib/gemini.ts`: instantiate `GoogleGenAI` **once** (module scope, `server-only`); export `generateText(prompt)` and `generateRecipe(prompt)` (keep the `responseSchema`). Read key via `lib/env.ts`.
6. Update `RecipeApp` fetch path to `/api/ai/recipe` (still a Client Component; that's correct for a form island).
7. Add `error.tsx` (with `reset()`), `loading.tsx`, `not-found.tsx` for root and a `projects/error.tsx`. Replace `alert()` calls in mini‑apps with inline error state (minimal pass; full UI polish in Phase 4).
8. Add `sitemap.ts` + `robots.ts`.
9. `EnergyBillsApp`: leave functionally as‑is this phase **but** point it at a Next route path `/api/energy/analyze` that for now just 501s (real proxy in Phase 6), so no page imports `NEXT_PUBLIC_API_URL` directly anymore. (If D3 is already "drop", instead remove the Energy tab + app now.)

**Expected result:** Root layout renders on the server; `curl` of any page returns full HTML with `<title>`/meta. `/api/ai/recipe` works with validation + rate limiting. No `pages/` directory. Navigating to a bad URL shows `not-found`; a thrown error shows `error.tsx`.

**Verification:**
- `npm run build` — pages that are now static/SSR are reported as such (no "client boundary at root").
- `curl -s localhost:3000/resume | grep -i '<title>'` → real title.
- RecipeApp still generates a recipe end‑to‑end.
- Rate limit: N+1 rapid requests to `/api/ai/recipe` → `429`.
- Cross‑origin `fetch` to `/api/ai/recipe` (different `Origin`) → rejected.
- Lighthouse SEO ≥ 90 on `/`.
- `typecheck`/`lint`/`test` green.

**Risks:**
- Removing `LanguageProvider` breaks `RecipeApp`'s `useLanguage()` import → temporarily replace `t('chef.*')` with plain English strings (Phase 3 finalizes copy).
- Same‑origin check can be finicky behind proxies/preview URLs — allow a configurable list via `lib/env.ts`.
- Some child components may rely implicitly on the client‑root; verify each `page.tsx` compiles as a Server Component or is explicitly `"use client"`.

**Rollback:** Phase is a sequence of small commits (layout, routes, api‑move, error‑ui). Revert individually; the `pages/`→`app/` move is one commit.

**Definition of done:**
- [ ] Root layout is a Server Component with `metadata`; no `"use client"` above an interactive island.
- [ ] No `pages/` directory; AI is an App Router Route Handler with zod + rate limit + origin check; single Gemini client; no prompt/key logging.
- [ ] `error.tsx` / `loading.tsx` / `not-found.tsx` present; no `alert()` in the codebase.
- [ ] Routes come from `lib/routes.ts`; `AppRoute` enum deleted.
- [ ] No page imports `NEXT_PUBLIC_API_URL` directly.
- [ ] Build/typecheck/lint/test green; SEO Lighthouse ≥ 90.

---

### Phase 3 — Content layer & i18n decision

**Objective:** One typed source of truth for every piece of site content; one deliberate language strategy.

**Why now:** Removes H2 and H7 and the resume/experience drift (M5). Later UI work (Phase 4) should consume `content/`, not inline arrays.

**Prereq:** **D1** (English‑only vs bilingual) and **D5** (resume language). Recommended default: **English‑only**, delete custom i18n and Google Translate.

**Files/modules affected:** `web/app/page.tsx`, `web/app/resume/page.tsx`, `web/app/experience/page.tsx`, `web/app/testimonials/page.tsx`, `web/app/projects/_apps/RecipeApp.tsx`, `web/components/Footer.tsx`, `web/types/index.ts`.

**New files/modules:** `web/content/profile.ts`, `web/content/experience.ts`, `web/content/testimonials.ts`, `web/content/resume.ts`, tests `web/content/__tests__/content.test.ts`. If bilingual: `web/i18n/` + `messages/en.json` + `messages/no.json` + `next-intl` middleware.

**Dependencies:** none if English‑only. If bilingual: `next-intl`.

**Detailed tasks:**
1. Add interfaces to `types/`: `Testimonial`, `Profile`, `ResumeSection`. Reuse `ExperienceItem`.
2. `content/experience.ts` — move the 7 items from `experience/page.tsx` verbatim; fix the "triming" typo; reconcile the CCIT dates with the resume/PDF (pick the correct ones).
3. `content/testimonials.ts` — move the 6 testimonials; type them; keep `id` stable; homepage selects by **explicit id list**, not `slice(4,6)`.
4. `content/profile.ts` — name, headline, location, email, phone, links (single place; pages import from here).
5. `content/resume.ts` — a structured resume model (sections: profile, skills, experience (reuse), projects, education, languages). Resolve NO vs EN per D5. No JSX in data — links become `{label, href}` and are rendered by the page.
6. Rewrite the four pages as Server Components that map over `content/*`.
7. Delete `web/app/utils/context/language/` and (if English‑only) `GoogleTranslate.tsx` + `googleTranslate.css`; remove `<GoogleTranslate/>` from `Footer`. Replace `RecipeApp`'s `t('chef.*')` with strings (or `content/` copy).
8. **If bilingual (D1 = yes):** add `next-intl`, extract copy into `messages/en.json` + `messages/no.json`, add a real language switcher in `Navbar`, wire `[locale]` routing. (Larger sub‑effort — would justify its own phase.)
9. Content tests: every testimonial has non‑empty `name`/`content`; homepage id list resolves; no duplicate ids; experience sorted newest‑first.

**Expected result:** Pages render identical (or improved/consistent) content sourced entirely from `content/`. No translation code unless bilingual was chosen. Resume and Experience agree on dates and facts.

**Verification:**
- Visual diff each page vs Phase 2.
- `grep -r "slice(4, 6)"` → gone; `grep -rn "Family Market\|goog-te\|translate.google.com"` → gone (English‑only).
- Content tests pass.
- `typecheck`/`lint`/`build` green.

**Risks:**
- Date/fact reconciliation needs the owner's input (which CCIT period is correct?). Flag as a question, don't guess.
- If bilingual is chosen late, Phase 3 grows significantly — prefer to decide now.

**Rollback:** Content modules are additive; page rewrites are per‑file commits. Revert a page to its Phase‑2 version if needed.

**Definition of done:**
- [ ] All page content comes from `web/content/*`; no inline datasets in `page.tsx`.
- [ ] Testimonials + Experience typed; homepage uses explicit ids.
- [ ] i18n decision implemented (custom context + Google Translate removed, or `next-intl` fully wired with a switcher).
- [ ] Resume/Experience facts reconciled.
- [ ] Content tests + build/typecheck/lint green.

---

### Phase 4 — Design tokens & shared UI

**Objective:** Make styling real (define the tokens components already reference) and eliminate duplicated markup via a small component library.

**Why now:** Removes H3 and the testimonial‑card duplication. Best done after content (Phase 3) so components are built against final data shapes.

**Files/modules affected:** `web/styles/globals.css`, `web/components/ui/Button.tsx`, `web/app/page.tsx`, `web/app/testimonials/page.tsx`, `web/app/experience/page.tsx`, `web/app/projects/page.tsx` and `_apps/*`.

**New files/modules:** `web/components/TestimonialCard.tsx`, `web/components/ExperienceTimeline.tsx`, `web/components/ui/{Section,Tag,Card,Field}.tsx`, component tests under `web/components/**/__tests__/`.

**Dependencies:** **remove** `framer-motion` (replace with CSS/Tailwind transitions) unless a concrete need remains. Optionally add `tailwind-merge` + `clsx` for variant composition.

**Detailed tasks:**
1. `globals.css` `@theme` block: define `--color-primary`, `--color-secondary`, `--color-accent` (emerald), `--color-surface`, `--color-dark`, `--radius-*`, and the keyframes for `--animate-slide-up` / `--animate-fade-in` / `--animate-fade-in-up` that pages reference. Remove any remaining undefined‑class usage or define it.
2. `Button.tsx`: variant map now points at real tokens; keep the `isLoading` spinner; add `aria-busy`.
3. `TestimonialCard.tsx`: extract the shared card (quote, author, company, `traits`/`tech`/`impact` tag rows). Use it in Home and Testimonials. Delete both copies of the inline markup.
4. `ExperienceTimeline.tsx`: extract the timeline from `experience/page.tsx`.
5. `ui/Section`, `ui/Tag`, `ui/Card`: small primitives to stop ad‑hoc class strings; adopt incrementally.
6. Replace `framer-motion` usage in `projects/page.tsx` and `EnergyApp` with CSS transitions / `@starting-style` or a tiny `AnimatePresence`‑free fade. Remove the dep.
7. Normalize imports to the `@/` alias throughout.
8. Component tests: `TestimonialCard` renders provided fields and omits empty tag rows; `Button` disabled while `isLoading`.

**Expected result:** Visual design matches the *intent* (emerald primary buttons, surface panels, animated section entrances). One card component. Smaller client bundle (no `framer-motion`).

**Verification:**
- Buttons/panels visibly styled (not unstyled) in the browser; dark theme consistent.
- `grep -rn "framer-motion"` → gone; bundle report shows the drop.
- `grep -rn "bg-primary\|bg-surface\|animate-slide-up"` → every match resolves to a defined token.
- Card markup exists once (`git grep -c "Quote size={20}"` → 1 component).
- Component tests + build/typecheck/lint green; visual pass on all pages at 400px and desktop.

**Risks:**
- Token values are a design choice — get the owner's nod on the palette, or keep the current emerald/neutral scheme as the safe default.
- Removing `framer-motion` may change exit‑animation feel on tab switches (acceptable; document it).

**Rollback:** Token block is one commit; each component extraction is its own commit with the old markup deleted in the same commit (revert restores it).

**Definition of done:**
- [ ] `@theme` tokens defined; no undefined utility classes remain.
- [ ] `TestimonialCard` + `ExperienceTimeline` extracted; zero duplicated card markup.
- [ ] `framer-motion` removed (or a written justification to keep it).
- [ ] Imports use `@/` consistently.
- [ ] Component tests + build/typecheck/lint green; responsive check passes.

---

### Phase 5 — Mini‑apps: Todo, Recipe, AI Chat

**Objective:** Finish the interactive demos that don't need Python: Todo (local), Recipe (hardened AI route), and resolve AI Chat (ship or delete).

**Why now:** AI route infrastructure landed in Phase 2 and UI primitives in Phase 4; this is pure feature completion with a small surface.

**Prereq:** **D2** — ship `AiChat` or delete it.

**Files/modules affected:** `web/app/projects/page.tsx`, `web/app/projects/_apps/{TodoApp,RecipeApp}.tsx`, `web/app/api/ai/{recipe,chat}/route.ts`, `web/lib/schemas.ts`, `web/lib/gemini.ts`, `web/types/index.ts`.

**New files/modules:** `web/app/projects/_apps/AiChatApp.tsx` (if D2 = ship) or its deletion; tests `web/app/api/ai/__tests__/*.test.ts`, `web/app/projects/_apps/__tests__/*`.

**Dependencies:** none new.

**Detailed tasks:**
1. **Todo:** mark `"use client"` explicitly; persist to `localStorage` (wrapped in try/catch, SSR‑safe); keep seed tasks as the empty‑state default; add labels/`aria`.
2. **Recipe:** finalize `RecipeResponse` zod schema; the route validates the Gemini JSON against it before returning (don't trust `JSON.parse`); handle model refusal/empty with a typed error; UI shows a friendly message; loading + error states use Phase‑4 primitives.
3. **AI Chat (D2 = ship):** move `AiChat.tsx` → `_apps/AiChatApp.tsx`, `"use client"`; wire to `/api/ai/chat`; add the tab + `MiniAppType.CHAT` back; the route streams or returns text, zod‑validated, rate‑limited, origin‑checked; cap history length sent to the model. **(D2 = delete):** remove `AiChat.tsx`, the commented tab, and `MiniAppType.GENAI`/`CHAT`; drop `app/api/ai/chat/route.ts`.
4. Rate limiting tuned per‑route (recipe vs chat).
5. Tests: recipe route returns typed data for a mocked Gemini success; returns a typed error on malformed model output; rate limiter returns 429; Todo add/toggle/delete + persistence.

**Expected result:** Todo works and persists; Recipe reliably returns structured recipes or a clean error; AI Chat is either a working, hardened demo or fully removed with no dead references.

**Verification:**
- Manual: add/complete/delete todos; reload → persisted. Generate 3 recipes incl. a nonsense prompt → graceful handling. (If shipped) chat conversation works; flooding → 429.
- `grep -rn "AiChat\|GENAI"` → matches only if D2 = ship.
- Route tests + build/typecheck/lint green.

**Risks:**
- Gemini occasionally returns schema‑violating JSON → the validation layer must degrade gracefully, not 500.
- Streaming chat adds complexity; a non‑streaming version is acceptable for a demo.

**Rollback:** Per‑app commits; the projects shell change (tabs) is one commit.

**Definition of done:**
- [ ] Todo: `"use client"`, persists, accessible.
- [ ] Recipe: response validated against zod before返回; typed error path; Phase‑4 loading/error UI.
- [ ] AI Chat: shipped (hardened, wired, tabbed) or deleted (no dead refs).
- [ ] Route + component tests; build/typecheck/lint green.

---

### Phase 6 — Energy Bill Analyzer decision & implementation

**Objective:** Turn the stub into either (a) a real, hardened, deployable feature via a Python sidecar behind a Next proxy, or (b) a cleanly removed / clearly‑labeled "coming soon" feature.

**Why now:** It's the riskiest, most isolated piece; doing it last means the rest of the site is already shippable. Needs the AI/proxy patterns and error UI from earlier phases.

**Prereq:** **D3** — keep (build it for real) vs drop (delete `server/`) vs defer (feature‑flag, hide the tab).

**Files/modules affected:** `web/app/projects/_apps/EnergyApp.tsx`, `web/app/projects/page.tsx`, `web/app/api/energy/analyze/route.ts`, `web/lib/env.ts`, `web/lib/schemas.ts`, `web/lib/sanitize.ts`; entire `server/` → `services/energy/`.

**New files/modules (if keep):** `services/energy/pyproject.toml`, `uv.lock`, `Dockerfile`, `.env.example`, `app/{main,config,schemas,parsing,report,export}.py`, `tests/test_parsing.py` + `fixtures/sample_bill.pdf`, `web/app/api/energy/__tests__/route.test.ts`, `docker-compose.yml` (local dev).

**Dependencies (if keep):** Python via `uv` — pinned `fastapi`, `uvicorn[standard]`, `pdfplumber` (or `pymupdf`), `pandas`, `jinja2`, `pydantic`, `pydantic-settings`, `python-multipart`, `python-dateutil`; dev `pytest`, `ruff`, `mypy`. **Drop** `plotly`, `kaleido`. Decide the PDF engine: `weasyprint` (needs system libs in the Dockerfile) vs `playwright` `page.pdf()` vs **no PDF** (ship HTML + CSV + JSON only — simplest).

**Detailed tasks (KEEP path):**
1. Move `server/` → `services/energy/`; restructure into `app/` package; add `pyproject.toml` + lockfile; `ruff`/`mypy`/`pytest` config.
2. `app/config.py` (`pydantic-settings`): `ALLOWED_ORIGIN`, `ENERGY_SHARED_SECRET`, `MAX_FILES`, `MAX_FILE_MB`. CORS from config (no wildcards with credentials).
3. `app/main.py`: `GET /healthz`; `POST /analyze` requires `X-Internal-Secret == ENERGY_SHARED_SECRET` (set by the Next proxy only). Enforce `len(files) <= MAX_FILES`, each `content_type == application/pdf` and size `<= MAX_FILE_MB`, reject otherwise with 4xx.
4. `app/sanitize` (or inline): write each upload to a **random** filename in the temp dir (`secrets.token_hex`), never `file.filename`. Validate the optional `dataset` is small CSV/JSON with an expected header before `read_csv`.
5. `app/parsing.py`: **implement real extraction** for at least one real bill layout (pdfplumber tables / text regex for provider, period start/end, kWh, total cost). Return `list[BillRow]` (pydantic). Unknown layout → structured "unrecognized format" result, not a crash.
6. `app/report.py`: template moved to a file; render HTML; PDF via the chosen engine (or skip PDF).
7. `app/export.py`: unchanged logic, typed.
8. **Next proxy** `web/app/api/energy/analyze/route.ts`: accept the multipart upload, re‑validate count/type/size client‑side‑independently, forward to `ENERGY_SERVICE_URL` with the secret header, stream the ZIP back. The browser only ever talks to Next.
9. `EnergyApp.tsx`: fix the result model — either return **one** honest "Download analysis (ZIP)" action, or have the service return separate artifact URLs. Remove `handleDownloadAll` re‑POST; reuse the fetched blob. Replace `alert()` with inline errors. `accept=".pdf"`, client‑side count/size guard for UX.
10. `docker-compose.yml` for local (`web` + `energy`); document the two‑service run.
11. Tests: Python `test_parsing.py` on the fixture bill; Next route test with a mocked upstream (secret header present, size limit enforced, non‑PDF rejected).

**Detailed tasks (DEFER path):** hide the Energy tab behind `env.ENERGY_ENABLED`; `EnergyApp` shows a "planned" state; keep `services/energy/` out of the deploy; no browser code path to it.

**Detailed tasks (DROP path):** delete `server/` / `services/energy/`, the Energy tab, `MiniAppType.ENERGY`, `AppRoute.ENERGY` (already gone), `/api/energy/*`, and the `ENERGY_*` env vars.

**Expected result (KEEP):** Uploading a genuine electricity‑bill PDF through the site returns a real report (HTML/PDF + CSV + JSON) with correct totals; oversized/non‑PDF/too‑many uploads are rejected with clear messages; the Python service is never reachable from the browser; both services run locally via compose and are independently deployable.

**Verification:**
- `pytest` in `services/energy` green on the fixture.
- End‑to‑end: real bill → correct kWh/cost in the output; 11 files (limit 10) → 4xx; a `.zip` renamed `.pdf` → rejected as non‑PDF; direct `POST` to the Python service without the secret → 401/403.
- Path‑traversal probe: filename `../../evil.pdf` → written as a random name inside the temp dir only.
- Next route test + web build/typecheck/lint green.

**Risks:**
- Real PDF parsing is genuinely hard and layout‑specific — scope to the specific bill(s) the owner can provide; everything else returns "unrecognized".
- `weasyprint` in a container adds image size/build complexity; "no PDF, just HTML+CSV+JSON" is a legitimate simplification.
- Second deploy target = more ops. The DEFER path avoids this until the feature is worth it.

**Rollback:** The sidecar is entirely separate; disabling `ENERGY_ENABLED` or reverting the proxy route commit removes the feature with no impact on the rest of the site.

**Definition of done (KEEP):**
- [ ] `services/energy/` packaged (`pyproject`/lock), typed, `ruff`/`mypy`/`pytest` green.
- [ ] Real parsing for the provided bill layout(s); unknown layouts handled gracefully.
- [ ] Secret‑guarded endpoint; file count/size/type limits; random filenames; validated dataset.
- [ ] Browser → Next proxy → service only; no `NEXT_PUBLIC` URL to Python.
- [ ] `EnergyApp` download bug fixed; no re‑analysis on download; inline errors.
- [ ] `docker-compose` local run documented; tests green.

*(DEFER / DROP DoD: tab hidden or feature fully removed with no dead references or unused env vars; web build green.)*

---

### Phase 7 — Testing depth

**Objective:** Raise coverage on the parts that can regress: content selectors, AI schema handling, sanitization, and the primary user journeys.

**Why now:** All features exist and are stable; lock them in before hardening/deploy.

**Files/modules affected:** test files across `web/` and `services/energy/`; `ci.yml`.

**New files/modules:** `web/e2e/{navigation,recipe,energy}.spec.ts`, `web/playwright.config.ts`, `web/lib/__tests__/{schemas,sanitize,rate-limit}.test.ts`, `services/energy/tests/test_main.py`.

**Dependencies:** `@playwright/test`.

**Detailed tasks:**
1. Unit: zod schemas (accept/reject fixtures), `sanitize` (traversal, weird unicode, long names), `rate-limit` (window rollover), `content` invariants.
2. Component (RTL): `Navbar` active state + mobile toggle; `TestimonialCard` field rendering; `RecipeApp` loading→result and loading→error; `TodoApp` CRUD + persistence.
3. E2E (Playwright): nav across all pages; CV download link resolves (200, `application/pdf`); recipe happy path with the AI route **mocked**; energy upload with the proxy **mocked** (skipped if D3 ≠ keep).
4. Python: `test_main.py` — 401 without secret, 4xx on non‑PDF / over‑limit, 200 + expected JSON on the fixture.
5. CI: run unit + component + build on every push; Playwright + `pytest` on PRs (and pushes to main). Upload coverage artifacts.

**Expected result:** A red test on any regression to routing, content shape, AI validation, upload limits, or the core journeys.

**Verification:** `npm run test`, `npm run test:e2e`, `pytest` all green locally and in CI; coverage thresholds met on `lib/` and `content/`.

**Risks:** Flaky e2e — mock all network (AI, energy proxy); pin Playwright browsers in CI. Keep the suite fast (< a few minutes).

**Rollback:** Tests are additive; loosen a threshold rather than block if a check proves flaky, with a TODO.

**Definition of done:**
- [ ] Unit + component + e2e + Python suites present and green in CI.
- [ ] Coverage thresholds on `lib/`, `content/`, schemas enforced.
- [ ] E2E covers nav, CV download, recipe (mocked), energy (mocked, if applicable).

---

### Phase 8 — Security & performance hardening

**Objective:** Production‑grade headers, rate limiting, and a fast Lighthouse profile; remove the last third‑party/perf liabilities.

**Why now:** Everything is feature‑complete and tested; this is the pre‑ship pass.

**Files/modules affected:** `web/next.config.ts`, `web/lib/rate-limit.ts`, `web/app/api/**/route.ts`, `web/app/layout.tsx` (fonts), `web/public/`, `services/energy/app/main.py` + `Dockerfile`.

**New files/modules:** `web/lib/security-headers.ts` (or inline in `next.config.ts`), optionally `web/middleware.ts` (only if a real need emerges — avoid otherwise).

**Dependencies:** optional `@upstash/ratelimit` + `@upstash/redis` if a hosted Redis is available; otherwise keep the in‑memory limiter and document the single‑instance assumption.

**Detailed tasks:**
1. Security headers in `next.config.ts`: `Content-Security-Policy` (self; `img-src 'self' data:`; `connect-src 'self'` + the energy proxy is same‑origin so nothing extra; no third‑party script origins since Google Translate is gone), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` (disable camera/mic/geo).
2. Verify no inline scripts violate CSP; add `next/font` (self‑hosted) so there's no `fonts.googleapis.com` need; if a font CDN is required, add the two Google Fonts origins explicitly.
3. Rate limiting: confirm every AI route and the energy proxy are covered; add a small global cap per IP. Return `Retry-After`.
4. AI routes: cap prompt length; strip/deny suspicious content; ensure error envelopes never echo internal details or the key‑presence.
5. Performance: run `next build` + analyze; confirm `framer-motion` gone; ensure static pages are static; images via `next/image` with sizes; remove stale `public/*.svg`; check no client component higher than necessary.
6. Energy service: non‑root user in the `Dockerfile`; drop capabilities; request body size limit at the ASGI/server layer; `--workers` sane; `/healthz` for the platform.
7. PII: confirm the owner is OK with email/phone in the client bundle; consider an obfuscated/`mailto:` only + a contact form later (out of scope).
8. Dependency audit: `npm audit --production`, `pip`/`uv` audit; pin/refresh.

**Expected result:** All responses carry security headers; CSP has no third‑party allowances; Lighthouse Perf ≥ 95 / Best‑Practices ≥ 95 / SEO ≥ 95 on Home, Resume, Projects; AI/upload endpoints are rate‑limited and quota‑safe.

**Verification:**
- `curl -I` on a page and an API route → headers present; `securityheaders.com`‑style check passes.
- CSP: browser console shows no violations across all pages/apps.
- Lighthouse (mobile) meets thresholds.
- Load test: 100 rapid AI requests → mostly 429 after the limit, service stays up.
- `npm audit` / `uv` audit clean of high severities.

**Risks:**
- CSP can break the mini‑apps (e.g. blob URLs for downloads) — test each app with CSP on; allow `blob:` in `img-src`/`connect-src` only as needed.
- In‑memory rate limiting resets on redeploy and isn't shared across instances — acceptable for a single‑instance portfolio; note it.

**Rollback:** Headers and limiter config are isolated commits; relax a specific CSP directive if it blocks a needed feature, with a comment.

**Definition of done:**
- [ ] CSP + HSTS + nosniff + Referrer‑Policy + frame + Permissions‑Policy on all routes; no third‑party script origins.
- [ ] Every AI/upload route rate‑limited; prompt length capped; opaque error envelopes.
- [ ] Lighthouse Perf/BP/SEO ≥ 95 on key pages; `framer-motion` and stale assets gone.
- [ ] Energy `Dockerfile` runs non‑root with a body‑size limit (if kept).
- [ ] Dependency audits clean of highs.

---

### Phase 9 — Deployment & documentation

**Objective:** Ship it: the Next app on Vercel, the energy service (if kept) on a container host, with documented env and a reproducible local setup.

**Why now:** Everything is built, tested, and hardened.

**Files/modules affected:** `README.md`, `web/.env.example`, `services/energy/.env.example`, `.github/workflows/` (add deploy or document manual), `next.config.ts` (prod origin for the same‑origin check).

**New files/modules:** `docs/DEPLOY.md`, `vercel.json` (if needed), `services/energy/README.md`, optional `render.yaml` / `fly.toml`.

**Dependencies:** none.

**Detailed tasks:**
1. **Web → Vercel:** connect the repo; set `API_KEY_GEMINI`, `ENERGY_SERVICE_URL`, `ENERGY_SHARED_SECRET`, allowed‑origin/prod host in Project env (Production + Preview separately). Confirm the build; set the production domain.
2. **Energy → container host (if kept):** build the image in CI; deploy to Render/Fly/Railway; set `ALLOWED_ORIGIN` = the Vercel prod URL, `ENERGY_SHARED_SECRET` (match Vercel). Private networking if the platform supports it; otherwise the secret header is the gate. Health check → `/healthz`.
3. Update the same‑origin check allow‑list with the production + preview domains.
4. `README.md`: what the project is, the stack, `web/` vs `services/energy/`, local run (with and without the energy service), env vars (link `.env.example`), test commands, deploy overview.
5. `docs/DEPLOY.md`: step‑by‑step for both targets, rollback (Vercel instant rollback; container image tag pin), how to rotate `API_KEY_GEMINI` and `ENERGY_SHARED_SECRET`.
6. Smoke‑test production: every page, CV download, recipe generation, (if kept) a real energy upload; check headers on the live domain; check no secret in the client bundle (`view-source` / bundle search).
7. Tag `v1.0.0`.

**Expected result:** A live portfolio at the production domain with all features working end‑to‑end, correct headers, no secrets client‑side, and docs that let a fresh clone run locally in minutes and redeploy confidently.

**Verification:**
- Production smoke test checklist passes.
- `curl -I https://<domain>` → security headers.
- Bundle search for `AIza` / the key → nothing.
- Fresh clone + `.env` from `.env.example` + documented commands → app runs; `services/energy` runs via compose.
- Vercel rollback tested once (deploy, then roll back).

**Risks:**
- The energy container host differs from local (system libs, memory limits for pandas/WeasyPrint) — test on the actual platform before switching the tab on in production; keep `ENERGY_ENABLED` as the kill switch.
- Preview deploys need their own env + origin allow‑list entries or the AI route's origin check will 403 them.

**Rollback:** Vercel keeps every deployment — one‑click rollback. The energy service is pinned by image tag; redeploy the previous tag. `ENERGY_ENABLED=false` disables the feature without a deploy.

**Definition of done:**
- [ ] Web live on Vercel (prod + preview) with env set and the build green.
- [ ] Energy service deployed and reachable only via the Next proxy with the shared secret (or feature‑disabled).
- [ ] Production smoke test + header check + bundle secret check all pass.
- [ ] `README.md` + `docs/DEPLOY.md` complete; `.env.example` accurate.
- [ ] `v1.0.0` tagged; a rollback has been exercised.

---

### Phase sequencing summary

| # | Phase | Removes | Gate |
|---|---|---|---|
| 1 | Foundation, safety net & tooling | C1, C2, H6 | CI green, no secret |
| 2 | App Router correctness | C5, H1, M2, M3, H9 | SSR + metadata + error UI; AI route hardened |
| 3 | Content layer & i18n decision | H2, H7, M5 | one content source; i18n decided |
| 4 | Design tokens & shared UI | H3, M6 (partial) | styling real; one card component |
| 5 | Mini‑apps (Todo/Recipe/Chat) | H5 (recipe), M1 (partial) | demos complete; AI validated |
| 6 | Energy analyzer decision & build | C3, C4, H4, H5, M7, M10, M11 | real feature behind a proxy, or removed/deferred |
| 7 | Testing depth | H8 | regression safety |
| 8 | Security & performance hardening | C4 (finish), M4, M6 | headers + rate limits + Lighthouse |
| 9 | Deployment & documentation | L1, DX | live, documented, rollback‑tested |

---

## 10. Risks & important decisions

### Decisions needed from the owner (block later phases)

| ID | Decision | Options | Recommendation | Blocks |
|---|---|---|---|---|
| **D1** | Is the site bilingual (EN/NO/AR) a real requirement? | (a) English only; (b) EN+NO via `next-intl`; (c) keep Google Translate | **(a) English only** — the current i18n is non‑functional and the strings are from another project | Phase 3 |
| **D2** | `AiChat` mini‑app | (a) ship it (hardened); (b) delete it | **(a) ship** — it's already built; a live Gemini chat is a good portfolio piece — but only with rate limiting | Phase 5 |
| **D3** | Energy Bill Analyzer | (a) build for real (Python sidecar); (b) defer behind a flag; (c) drop entirely | **(b) defer** now, **(a)** later if you have sample bills and want it as a flagship — don't ship a stub | Phase 6 |
| **D4** | Energy PDF engine (if D3=build) | WeasyPrint‑in‑container / Playwright `page.pdf()` / no PDF (HTML+CSV+JSON) | **no PDF** for v1 (simplest, deployable); add PDF later | Phase 6 |
| **D5** | Resume language & canonical work history | NO vs EN; which dates are correct (CCIT `03/25–08/25` vs `05/2025–08/2025`) | **EN**, reconcile against the PDF; owner confirms dates | Phase 3 |
| **D6** | Hosting for the energy service (if kept) | Render / Fly.io / Railway / Vercel (won't fit WeasyPrint) | **Render or Fly** container | Phase 9 |
| **D7** | Rate‑limit backend | in‑memory (single instance) vs Upstash Redis | **in‑memory** for v1; Upstash if you go multi‑instance | Phase 2/8 |

### Architectural risks

- **R1 — Energy parsing scope creep.** Real bill parsing is layout‑specific and open‑ended. Mitigation: support only the specific layouts the owner provides; everything else returns "unrecognized format". Time‑box it.
- **R2 — Two deploy targets.** Keeping Python doubles ops surface. Mitigation: the DEFER path (D3b) keeps the repo ready without the operational cost until the feature earns it.
- **R3 — `tsc --strict` fallout in Phase 1.** Existing loose types (`LanguageContext: any`, JSX‑in‑data) may not compile. Mitigation: scoped `@ts-expect-error` with `TODO(phase-N)` to keep the baseline green; each is removed in its owning phase.
- **R4 — CSP vs blob downloads.** The mini‑apps create `blob:`/`data:` URLs for downloads; a strict CSP can break them. Mitigation: test each app with CSP enabled in Phase 8; allow `blob:` narrowly.
- **R5 — Preview deployments and the same‑origin AI check.** Vercel preview URLs are dynamic. Mitigation: allow `*.vercel.app` for previews or read the allow‑list from env per environment.
- **R6 — Content ownership.** Dates/facts across resume/experience/PDF disagree. Only the owner can resolve them — do not guess (flagged in D5).
- **R7 — In‑memory rate limiting** resets per deploy and isn't shared across instances. Acceptable for a single‑instance portfolio; revisit with D7 if scaling.

### Assumptions (from code; correct me if wrong)

- No analytics/telemetry requirement beyond what Vercel provides. **UNKNOWN.**
- No CMS requirement; content edits via code + redeploy are acceptable. **UNKNOWN** (README mentions "CMS … for future").
- No contact form / email sending is required for v1 (only a `mailto:`/links). **UNKNOWN.**
- The owner controls the Google AI Studio project and can rotate the key. **Assumed.**
- Target audience is recruiters/hiring managers; SEO and load speed matter. **Inferred from content.**

---

## 11. Recommended starting point

**Do Phase 1 first, and nothing else.** Concretely, the very first actions:

1. **Rotate `API_KEY_GEMINI`** in Google AI Studio (the committed value is compromised).
2. `git init` + add `.gitignore`; **delete `client/.env.local`**; make the first commit clean.
3. Rename `client/ → web/`; add strict `tsconfig.json`, ESLint flat config, Prettier, Vitest, and a CI workflow.
4. Add `web/lib/env.ts` (zod‑validated env) + `web/.env.example`.
5. Trim the redundant v3 `@tailwind` directives from `globals.css` (tokens come in Phase 4).
6. Replace the two READMEs with one real one.
7. Get **Phase 1's DoD green**: `typecheck` + `lint` + `test` + `build` pass locally and in CI, app behavior unchanged.

Before Phase 3, please answer **D1** and **D5**; before Phase 5, **D2**; before Phase 6, **D3** (and **D4/D6** if D3 = build).

---

**STOP.** No implementation will begin until you say **"Start Phase 1"**. At the start of that phase I will restate its objective, re‑read the relevant files, describe the exact changes, implement only Phase 1, run typecheck/lint/test/build, report what changed and any decisions that arose, state whether the phase is complete, and wait for your approval.

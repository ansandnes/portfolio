# CLAUDE.md

Guidance for Claude Code sessions in this repo. See `README.md` for setup/scripts
and `REBUILD_PLAN.md` for the architecture rebuild plan — this file only covers
what isn't already obvious from those, plus context from recent sessions.

## Running the dev server

Use `start-app.bat` (repo root) — a Windows batch file that `cd`s into `web/`,
installs deps if `node_modules` is missing, and runs `next dev`.

**It's pinned to port 3210, not 3000.** This machine also runs another,
unrelated project ("direkte") whose dev server frequently occupies port 3000 in
a separate terminal. If you `npm run dev` directly without pinning the port,
Next may silently pick a different port than you expect, or — worse — you end
up looking at the *other* project in the browser while assuming it's this one.
Always verify with a request to `http://localhost:3210` (or whatever port the
server actually reports on startup) before concluding a change is live.

`web/.env.local` is already configured with a working `API_KEY_GEMINI`
(gitignored, not documented here). No need to re-request one unless the user
says it's been rotated or stopped working.

## Verifying changes

After any edit, run from `web/`:

```bash
npx tsc --noEmit
npx eslint <changed files>
npx vitest run
```

All three should stay green; the full test suite runs in a few seconds.

## Content & i18n conventions

- `web/i18n/messages/en.ts` is the source of truth for UI chrome strings (the
  `Messages` type); `no.ts` must `satisfies Messages`. TypeScript only catches
  missing/renamed *keys* — semantic drift (Norwegian text that no longer means
  the same thing as the English) is **not** caught automatically. When editing
  one language's strings, check the other side by hand.
- Body content (`content/experience.ts`, `content/testimonials.ts`,
  `content/profile.ts`) is intentionally **English-only** regardless of the
  site's EN/NO toggle — that toggle only swaps UI chrome, not this content.
  This is a deliberate, established pattern, not an oversight.
- Exception: `content/projects.ts` (featured projects) *does* localize its
  prose, via a `translations: { en, no }` bundle on each `FeaturedProject` —
  read it with `useLocale()` (not `useT()`). This was introduced to satisfy a
  specific user request; the two content-localization models coexist
  intentionally, don't try to unify them.
- `content/cv/en.json` / `content/cv/no.json` are validated by a zod schema in
  `content/resume.ts` at import time — an invalid edit throws at build/dev-server
  start with a message pointing at the offending field. Keep `bullets` arrays
  non-empty (schema enforces `min(1)`) unless you deliberately change the schema.

## Resume PDF generation — non-obvious gotchas

`npm run cv:pdf` re-renders `/resume` (both `?lang=` variants) via headless
Chrome (`scripts/generate-cv-pdfs.mjs`) and writes to
`public/assets/cv_andreas_sandnes_{en,no}.pdf`. **These are snapshots, not
generated at request time** — if you edit `content/cv/*.json` or the résumé's
layout/styling, the PDFs go stale until you re-run this script (needs the dev
server up — e.g. `CV_BASE_URL=http://localhost:3210 npm run cv:pdf` since the
dev server runs on 3210, not the script's default of 3000).

Two real bugs were found and fixed while making the résumé fit one page —
worth knowing if the PDF layout ever looks wrong again:

1. **Tailwind's `md:`/`sm:` breakpoints do not reliably apply during
   headless-Chrome print rendering.** The tool's default viewport is narrower
   than 768px, so `md:grid-cols-3` silently fell back to `grid-cols-1`,
   stacking the résumé into one long column and roughly doubling its printed
   height — with no error, just a mysteriously tall PDF. Fix: use Tailwind's
   `print:` variant (e.g. `print:grid-cols-3`) for anything whose PDF layout
   must not depend on viewport width. Don't rely on `md:`/`sm:` alone for
   layout that has to survive print rendering.
2. **`[data-print-hide]` only hides the element it's actually attached to.**
   `TopBar` rendered as a sibling *before* the semantic `<header>` tag in
   `app/layout.tsx`, so the print rule `header { display: none }` never caught
   it, and it leaked into the PDF (wasted vertical space at the top of every
   page). Any new global/sticky chrome added to the root layout needs its own
   `data-print-hide` (or to live inside `<header>`/`<footer>`) to be excluded
   from print.

To debug PDF layout issues locally: this machine has MiKTeX installed, whose
bundled poppler tools (`pdfinfo.exe`, `pdftoppm.exe`, `pdftotext.exe`, under
`C:\Users\asand\AppData\Local\Programs\MiKTeX\miktex\bin\x64\`) can check page
count, render pages to PNG, or dump text — no new install needed to verify a
PDF's actual output.

## Session state (as of 2026-09-21)

Recent work landed but **not yet committed** as of this note — check `git
status` before assuming a clean tree:

- Projects page restructured: a "Featured Projects" section (real, from-scratch
  work) now sits above a visually secondary "Mini Apps" section. MatTilGaza is
  the first featured project with a real link/goal/motivation/tech-stack, but
  its **architecture diagram is still placeholder/dummy content** — the user
  said they'll provide the real component breakdown later.
- Experience page: the Ivar S. Moe A/S entry has a circular photo
  (`public/images/bricklayer.png`); A. Sandnes Mur og Flis got an added bullet.
- Resume: removed the "Software Developer — Student Assistant..." experience
  entry per user request; both CV PDFs regenerated and confirmed one page each
  (see gotchas above for how that was actually achieved).
- Gemini API usage limits: the user chose to handle this via a **Google-side
  quota/budget** (set in Google Cloud Console, outside this repo) rather than
  tightening the in-app rate limiter (`lib/rate-limit.ts`). No code change was
  made for this — if asked to revisit rate limiting, that in-app limiter is
  still at its original per-IP setting (10 req/min) and has no global cap.

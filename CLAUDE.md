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
- Body content (`content/testimonials.ts`, `content/profile.ts`) is
  intentionally **English-only** regardless of the site's EN/NO toggle — that
  toggle only swaps UI chrome, not this content.
- Exception: `content/projects.ts` (featured projects) and
  `content/experience.ts` *do* localize their prose, via a
  `translations: { en, no }` bundle on each item — read it with `useLocale()`
  (not `useT()`). Introduced on specific user requests; the two
  content-localization models coexist intentionally, don't try to unify them.
- `content/cv/en.json` / `content/cv/no.json` are validated by a zod schema in
  `content/resume.ts` at import time — an invalid edit throws at build/dev-server
  start with a message pointing at the offending field. Keep `bullets` arrays
  non-empty (schema enforces `min(1)`) unless you deliberately change the schema.

## Resume page vs. downloadable PDF

`/resume` renders `content/cv/*.json` in a two-column sidebar layout. The
**downloadable PDF is a separate, hand-made single-column résumé** (Canva)
in `public/assets/Resume_AndreasSandnes_<lang>.pdf` — chosen because a linear
one-column PDF is read better by ATS/AI parsers. It is not generated from the
JSON (the old headless-Chrome `cv:pdf` generator was removed), so edits to the
JSON don't change it. A PNG render of it (`.png`, same base name, 1241×1755 =
A4 @150dpi) is shown in the "Preview downloadable version" modal, because
mobile browsers can't reliably show PDFs inline. Mapping per language lives in
`DOWNLOADABLE` in `content/resume.ts`. Steps for replacing a PDF are in
`content/cv/README.md` — if the user updates a PDF, re-render its PNG too.

This machine has MiKTeX installed, whose bundled poppler tools (`pdfinfo.exe`,
`pdftoppm.exe`, `pdftotext.exe`, under
`C:\Users\asand\AppData\Local\Programs\MiKTeX\miktex\bin\x64\`) can check
page count, render pages to PNG, or dump text — no new install needed.

The print CSS (`@page { size: A4 }`, `print:` variants, `header { display:
none }` in print) still exists for printing `/resume` from a browser. Note
that `md:`/`sm:` breakpoints don't reliably apply in print rendering — use
`print:` variants for print layout.

## Mobile

The user cares that every page works at phone widths. Check at ~375px for
horizontal overflow (`document.documentElement.scrollWidth` vs viewport) —
e.g. by driving headless Chrome over CDP; the home page's testimonial carousel
intentionally has off-screen slides inside its own scroll container.

## Deployment

- GitHub: `origin` = `https://github.com/ansandnes/portfolio.git`, branch
  `main`. This repo *replaced* an older, unrelated portfolio there (force-push);
  the old history is preserved under the tag `legacy`. GitHub Pages is
  **disabled** on purpose — Vercel is the only host.
- Vercel: project `ansandnes-projects/portfolio`, auto-deploys every push to
  `main`. Live at https://portfolio-blue-chi-26.vercel.app. Its **Root
  Directory must be `web`** (it was `client` from the old repo, which made
  builds fail right after cloning). Deploy status is readable without the
  Vercel CLI: `gh api repos/ansandnes/portfolio/commits/<sha>/statuses`.
- The repo root is `vercel link`ed (`.vercel/` and a root `.env.local` holding
  a short-lived OIDC token — both gitignored). `vercel link` also appends
  duplicate/over-broad lines (`.env*`) to `.gitignore`; revert those if it's
  re-run. In Git Bash, `vercel api /v9/...` needs `MSYS_NO_PATHCONV=1` or the
  path gets rewritten into a Windows file path.
- `API_KEY_GEMINI` in Vercel (all three environments) was rotated on
  2026-09-24 and matches `web/.env.local`. Env var changes only take effect on
  the next deploy (`vercel redeploy <url> --target production`).

## Line endings

There's no `.gitattributes` and `core.autocrlf=false`, and the repo is mixed:
almost everything is LF, but `web/i18n/messages/en.ts` and `no.ts` are
**CRLF**. Preserve each file's existing endings — writing files from Python in
text mode on Windows silently converts to CRLF and turns small edits into
whole-file diffs. Check with `git diff --stat` vs
`git diff --stat --ignore-cr-at-eol` before committing.

## Session state (as of 2026-09-24)

Everything is committed and deployed (last: `0a11c52`). Open items:

- MatTilGaza's **architecture diagram is still placeholder content** — the
  user will provide the real component breakdown later.
- The MSc thesis card (`content/projects.ts`, `msc-thesis`) has no `url` yet;
  the user plans to publish an HTML version of the thesis (from Overleaf).
  Adding `url` makes the "Read the full thesis" button appear.
- `public/images/projects/direkte-home.png` is a one-off headless-Chrome
  screenshot of https://direkte-next.vercel.app — it won't track changes to
  that site. Direkte is the user's separate project (local repo at
  `../direkte/project`, the one that often occupies port 3000).
- Modals use a shared native-`<dialog>` component (`components/ui/Modal.tsx`).
  jsdom has no `showModal()`/`close()`, so `vitest.setup.ts` stubs them; a
  closed dialog's content is still in the DOM in tests (scope queries with
  `within(dialog)` or filter out `dialog.contains(el)`).
- Gemini usage limits are handled via a **Google-side quota/budget** (Google
  Cloud Console), not the in-app limiter (`lib/rate-limit.ts`, still 10
  req/min per IP, no global cap).

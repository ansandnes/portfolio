# services/energy

FastAPI service for the **Energy Bill Analyzer** mini-app (upload electricity-bill
PDFs → report + CSV + JSON).

## Status: deferred (not deployed, not wired)

Phase 6 chose the **defer** path (REBUILD_PLAN.md §9 Phase 6, decision D3):

- The parsing in `processing/pipeline.py` is still a **stub** — it returns
  hard-coded demo rows and ignores the PDF contents.
- The web app does **not** call this service. The browser hits
  `web/app/api/energy/analyze/route.ts`, which returns `501` until this is built
  for real.
- The Energy Analyzer tab in `/projects` is hidden unless
  `NEXT_PUBLIC_ENERGY_ENABLED=true`.

## To finish it (the "build" path)

1. Real PDF extraction in `processing/pipeline.py` for the specific bill layouts
   you have (`pdfplumber` / `pymupdf`); unknown layouts return "unrecognized",
   not a crash.
2. Package: `pyproject.toml` + lockfile, pinned deps, drop unused `plotly` /
   `kaleido`, add `ruff` / `mypy` / `pytest`.
3. Harden `main.py`: `X-Internal-Secret` gate, per-request file count/size/type
   limits, random on-disk filenames (no `file.filename`), validated `dataset`.
4. Decide the PDF engine (D4) — simplest v1: skip PDF, ship HTML + CSV + JSON.
5. Turn `web/app/api/energy/analyze/route.ts` into a proxy: validate the upload →
   forward to `ENERGY_SERVICE_URL` with the shared secret → stream the ZIP back.
6. Deploy to a container host (D6: Render / Fly); set `NEXT_PUBLIC_ENERGY_ENABLED=true`.

## Run locally (current stub)

```bash
cd services/energy
python -m venv .venv && . .venv/Scripts/activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

// Regenerate the downloadable resume PDFs from the /resume print view so they
// stay in sync with content/cv/*.json.
//
//   1. start the site:  npm run dev   (or: npm run preview)
//   2. run this:        npm run cv:pdf
//
// Env:
//   CV_BASE_URL   base URL of the running site (default http://localhost:3000)
//   CHROME_PATH   path to a Chrome/Chromium/Edge binary (auto-detected otherwise)

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/assets");
const baseUrl = (process.env.CV_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/c/Program Files/Google/Chrome/Application/chrome.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

function findChrome() {
  for (const p of CHROME_CANDIDATES) if (existsSync(p)) return p;
  console.error(
    "Could not find Chrome/Chromium/Edge. Set CHROME_PATH to a browser binary.",
  );
  process.exit(1);
}

async function assertServerUp() {
  try {
    const res = await fetch(`${baseUrl}/resume`, { method: "HEAD" });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    console.error(
      `No site responding at ${baseUrl}. Start it first:\n` +
        "  npm run dev      (or: npm run preview)\n" +
        "then re-run: npm run cv:pdf",
    );
    process.exit(1);
  }
}

await assertServerUp();
const chrome = findChrome();

for (const [lang, url] of [
  ["en", `${baseUrl}/resume`],
  ["no", `${baseUrl}/resume?lang=no`],
]) {
  const out = resolve(outDir, `cv_andreas_sandnes_${lang}.pdf`);
  execFileSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=12000",
      `--print-to-pdf=${out}`,
      url,
    ],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  console.log(`✓ ${lang.toUpperCase()}  ${out}`);
}

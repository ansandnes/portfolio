"use client";

import React, { useState } from "react";
import { Upload, FileText, Database, Lightbulb } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

const EnergyBillsApp: React.FC = () => {
  const t = useT();
  const [files, setFiles] = useState<File[]>([]);
  const [dataset, setDataset] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ pdf?: string; csv?: string; json?: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleDatasetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setDataset(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!files.length) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (dataset) formData.append("dataset", dataset);

    try {
      const res = await fetch("/api/energy/analyze", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Server error: ${res.status}`);
      }
      const url = URL.createObjectURL(await res.blob());
      setResult({ pdf: url, csv: url, json: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.energy.errReport);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (dataset) formData.append("dataset", dataset);

    try {
      const res = await fetch("/api/energy/analyze", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Server error: ${res.status}`);
      }
      const url = window.URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = "energy-analysis.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.energy.errZip);
    }
  };

  const uploadCard = "bg-elevated border border-line rounded-xl p-5 transition-transform hover:scale-[1.01]";
  const fileInput =
    "w-full text-sm text-muted file:bg-emerald-500/15 file:text-emerald-600 dark:file:text-emerald-400 file:border-0 file:px-3 file:py-2 file:rounded-md file:cursor-pointer";
  const dlBtn = "px-4 py-2 rounded-md bg-card border border-line hover:bg-elevated text-sm";

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-1">{t.energy.title}</h2>
        <p className="text-muted text-sm">{t.energy.subtitle}</p>
      </div>

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-600 dark:text-amber-300">
        {t.energy.previewBanner}
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className={uploadCard}>
          <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
            <Upload size={18} />
            <span className="font-medium">{t.energy.uploadBills}</span>
          </div>
          <input type="file" multiple accept=".pdf" onChange={handleFileChange} className={fileInput} />
          <p className="text-xs text-subtle mt-2">{t.energy.uploadBillsHint}</p>
        </div>

        <div className={uploadCard}>
          <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
            <Database size={18} />
            <span className="font-medium">{t.energy.uploadDataset}</span>
          </div>
          <input type="file" accept=".csv,.json" onChange={handleDatasetChange} className={fileInput} />
          <p className="text-xs text-subtle mt-2">{t.energy.uploadDatasetHint}</p>
        </div>
      </div>

      <div>
        <button
          onClick={handleSubmit}
          disabled={loading || !files.length}
          className="flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition"
        >
          <Lightbulb size={16} />
          {loading ? t.energy.analyzing : t.energy.generate}
        </button>
        {error && (
          <p className="mt-3 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="bg-elevated border border-line rounded-xl p-5 animate-fade-in-up">
          <h3 className="text-foreground font-medium mb-3 flex items-center gap-2">
            <FileText size={16} />
            {t.energy.downloadResults}
          </h3>
          <div className="flex flex-wrap gap-3">
            <a href={result.pdf} download="energy-report.pdf" className={dlBtn}>
              {t.energy.downloadPdf}
            </a>
            <a href={result.csv} download="energy-data.csv" className={dlBtn}>
              {t.energy.downloadCsv}
            </a>
            <a href={result.json} download="energy-data.json" className={dlBtn}>
              {t.energy.downloadJson}
            </a>
            <button onClick={handleDownloadAll} className={dlBtn}>
              {t.energy.downloadZip}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyBillsApp;

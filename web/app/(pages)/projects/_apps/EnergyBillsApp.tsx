"use client";

import React, { useState } from "react";
import { Upload, FileText, Database, Lightbulb } from "lucide-react";

const EnergyBillsApp: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [dataset, setDataset] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<{
        pdf?: string;
        csv?: string;
        json?: string;
    } | null>(null);

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
            const res = await fetch("/api/energy/analyze", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.error ?? `Server error: ${res.status}`);
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            setResult({
                pdf: url,
                csv: url,
                json: url,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate report.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAll = async () => {
        // Optional: send files + dataset if you want a cumulative ZIP
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        if (dataset) formData.append("dataset", dataset);

        try {
            const res = await fetch("/api/energy/analyze", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.error ?? `Server error: ${res.status}`);
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "energy-analysis.zip";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to download ZIP.");
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-white mb-1">
                    Energy Bill Analyzer
                </h2>
                <p className="text-slate-400 text-sm">
                    Upload electricity bills to generate privacy-first reports. No data is stored.
                </p>
            </div>

            {/* Upload cards */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* PDF Upload */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 transition-transform hover:scale-[1.01]">
                    <div className="flex items-center gap-2 mb-3 text-emerald-400">
                        <Upload size={18} />
                        <span className="font-medium">Upload Bills</span>
                    </div>

                    <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full text-sm text-slate-400 file:bg-emerald-600/20 file:text-emerald-400 file:border-0 file:px-3 file:py-2 file:rounded-md file:cursor-pointer"
                    />

                    <p className="text-xs text-slate-500 mt-2">
                        Upload one or multiple electricity bill PDFs.
                    </p>
                </div>

                {/* Dataset Upload */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 transition-transform hover:scale-[1.01]">
                    <div className="flex items-center gap-2 mb-3 text-emerald-400">
                        <Database size={18} />
                        <span className="font-medium">Upload Previous Dataset</span>
                    </div>

                    <input
                        type="file"
                        accept=".csv,.json"
                        onChange={handleDatasetChange}
                        className="w-full text-sm text-slate-400 file:bg-emerald-600/20 file:text-emerald-400 file:border-0 file:px-3 file:py-2 file:rounded-md file:cursor-pointer"
                    />

                    <p className="text-xs text-slate-500 mt-2">
                        Optional: merge with previous year data.
                    </p>
                </div>
            </div>

            {/* Submit */}
            <div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !files.length}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition"
                >
                    <Lightbulb size={16} />
                    {loading ? "Analyzing..." : "Generate Report"}
                </button>
                {error && (
                    <p className="mt-3 text-sm text-red-400" role="alert">
                        {error}
                    </p>
                )}
            </div>

            {/* Result */}
            {result && (
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 animate-fade-in-up">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <FileText size={16} />
                        Download Results
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        <a
                            href={result.pdf}
                            download="energy-report.pdf"
                            className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm"
                        >
                            Download PDF Report
                        </a>

                        <a
                            href={result.csv}
                            download="energy-data.csv"
                            className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm"
                        >
                            Download CSV
                        </a>

                        <a
                            href={result.json}
                            download="energy-data.json"
                            className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm"
                        >
                            Download JSON
                        </a>

                        {/* Fixed download all button */}
                        <button
                            onClick={handleDownloadAll}
                            className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm"
                        >
                            Download All Files as ZIP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnergyBillsApp;
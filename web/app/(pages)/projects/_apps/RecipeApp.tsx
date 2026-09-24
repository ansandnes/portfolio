"use client";

import React, { useState } from "react";
import { RecipeResponse } from "@/app/types";
import { ChefHat, Loader2, ArrowRight } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

const ChefAssistant: React.FC = () => {
  const t = useT();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json().catch(() => null);

      if (res.status === 429) {
        setError(t.recipe.errRate);
      } else if (!res.ok || !json?.data) {
        setError(t.recipe.errGeneric);
      } else {
        setResult(json.data as RecipeResponse);
      }
    } catch {
      setError(t.recipe.errNetwork);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-4 py-6 sm:py-10">
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-4">
          <ChefHat size={32} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t.recipe.title}</h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">{t.recipe.desc}</p>
      </div>

      <div className="bg-white text-slate-900 shadow-xl rounded-2xl overflow-hidden mb-8">
        <div className="p-4 sm:p-8">
          {/* Stacked on small screens (button below the input); side by side from sm up. */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.recipe.placeholder}
              aria-label={t.recipe.placeholder}
              enterKeyHint="go"
              className="w-full min-w-0 flex-1 border-2 border-gray-200 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full sm:w-auto shrink-0 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {t.recipe.generate} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        </div>
      </div>

      {result && (
        <div className="bg-white text-slate-900 border border-gray-200 rounded-2xl overflow-hidden animate-fade-in-up">
          <div className="bg-emerald-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-emerald-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{result.recipeName}</h2>
          </div>
          <div className="p-4 sm:p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.recipe.instructions}</h3>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {result.instructions}
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.recipe.ingredients}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.ingredients.map((ingredient, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors group"
                >
                  <span className="text-gray-700">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefAssistant;

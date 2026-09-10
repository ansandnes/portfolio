"use client";

import React, { useMemo, useState } from "react";
import { MiniAppType } from "@/app/types";
import { isEnergyEnabled } from "@/lib/features";
import TodoApp from "./_apps/TodoApp";
import RecipeApp from "./_apps/RecipeApp";
import AiChatApp from "./_apps/AiChatApp";
import EnergyBillsApp from "./_apps/EnergyBillsApp";
import { CheckSquare, ChefHat, Lightbulb, Sparkles } from "lucide-react";

const Projects: React.FC = () => {
  const [activeApp, setActiveApp] = useState<MiniAppType>(MiniAppType.TODO);

  const appsMap = useMemo<Record<MiniAppType, React.ReactNode>>(
    () => ({
      [MiniAppType.TODO]: <TodoApp />,
      [MiniAppType.RECIPE]: <RecipeApp />,
      [MiniAppType.CHAT]: <AiChatApp />,
      [MiniAppType.ENERGY]: <EnergyBillsApp />,
    }),
    [],
  );

  const tabs = [
    { id: MiniAppType.TODO, label: "Todo List", icon: <CheckSquare size={16} /> },
    { id: MiniAppType.RECIPE, label: "Chef Assistant", icon: <ChefHat size={16} /> },
    { id: MiniAppType.CHAT, label: "AI Chat", icon: <Sparkles size={16} /> },
    // Energy Analyzer is deferred (Phase 6) — hidden unless the flag is set.
    ...(isEnergyEnabled()
      ? [{ id: MiniAppType.ENERGY, label: "Energy Analyzer", icon: <Lightbulb size={16} /> }]
      : []),
  ];

  return (
    <div className="pt-24 pb-10 max-w-6xl mx-auto px-4 min-h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mini Applications</h1>
        <p className="text-slate-400">Interactive demonstrations of my projects.</p>
      </div>

      {/* Main container */}
      <div className="flex-1 bg-surface rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar / Topbar */}
        <div
          role="tablist"
          aria-label="Mini apps"
          className="bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-700 p-2 md:w-64 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible custom-scrollbar"
        >
          {tabs.map((tab) => {
            const isActive = activeApp === tab.id;
            return (
              <button
                key={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveApp(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isActive
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* App content — `key` remounts on tab change, replaying the CSS fade */}
        <div className="flex-1 p-6 bg-surface overflow-hidden relative">
          <div key={activeApp} className="h-full animate-fade-in">
            {appsMap[activeApp]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

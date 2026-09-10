"use client";

import React, { useMemo, useState } from "react";
import { MiniAppType } from "@/app/types";
import { isEnergyEnabled } from "@/lib/features";
import { useT } from "@/i18n/LocaleProvider";
import TodoApp from "./_apps/TodoApp";
import RecipeApp from "./_apps/RecipeApp";
import SnakeApp from "./_apps/SnakeApp";
import EnergyBillsApp from "./_apps/EnergyBillsApp";
import { CheckSquare, ChefHat, Gamepad2, Lightbulb } from "lucide-react";

const Projects: React.FC = () => {
  const t = useT();
  const [activeApp, setActiveApp] = useState<MiniAppType>(MiniAppType.TODO);

  const appsMap = useMemo<Record<MiniAppType, React.ReactNode>>(
    () => ({
      [MiniAppType.TODO]: <TodoApp />,
      [MiniAppType.RECIPE]: <RecipeApp />,
      [MiniAppType.SNAKE]: <SnakeApp />,
      [MiniAppType.ENERGY]: <EnergyBillsApp />,
    }),
    [],
  );

  const tabs = [
    { id: MiniAppType.TODO, label: t.projects.tabs.todo, icon: <CheckSquare size={16} /> },
    { id: MiniAppType.RECIPE, label: t.projects.tabs.recipe, icon: <ChefHat size={16} /> },
    { id: MiniAppType.SNAKE, label: t.projects.tabs.snake, icon: <Gamepad2 size={16} /> },
    // Energy Analyzer is deferred (Phase 6) — hidden unless the flag is set.
    ...(isEnergyEnabled()
      ? [{ id: MiniAppType.ENERGY, label: t.projects.tabs.energy, icon: <Lightbulb size={16} /> }]
      : []),
  ];

  return (
    <div className="pb-10 max-w-6xl mx-auto px-4 min-h-[70vh] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.projects.title}</h1>
        <p className="text-muted">{t.projects.subtitle}</p>
      </div>

      {/* Main container */}
      <div className="flex-1 bg-card rounded-2xl border border-line shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar / Topbar */}
        <div
          role="tablist"
          aria-label={t.projects.tablist}
          className="bg-elevated border-b md:border-b-0 md:border-r border-line p-2 md:w-64 flex flex-wrap md:flex-col gap-2"
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
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                    : "text-muted hover:text-foreground hover:bg-card"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* App content — `key` remounts on tab change, replaying the CSS fade */}
        <div className="flex-1 p-6 bg-card overflow-hidden relative">
          <div key={activeApp} className="h-full animate-fade-in">
            {appsMap[activeApp]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

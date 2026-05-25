"use client";

import React, { useState, useMemo } from "react";
import { MiniAppType } from "../../types";
import TodoApp from "./apps/TodoApp";
import RecipeApp from "./apps/RecipeApp";
// import AiChat from "./apps/AiChat";
// import EnergyBillsApp from "./apps/EnergyBillsApp";
import { CheckSquare, Lightbulb, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const projects: React.FC = () => {
    const [activeApp, setActiveApp] = useState<MiniAppType>(MiniAppType.TODO);

    const appsMap = useMemo<Record<MiniAppType, React.ReactNode>>(
        () => ({
            [MiniAppType.TODO]: <TodoApp />,
            [MiniAppType.RECIPE]: <RecipeApp />,
            // [MiniAppType.GENAI]: <AiChat />,
            // [MiniAppType.ENERGY]: <EnergyBillsApp />,
        }),
        []
    );

    const tabs = [
        { id: MiniAppType.TODO, label: "Todo List", icon: <CheckSquare size={16} /> },
        { id: MiniAppType.RECIPE, label: "Chef Assistant", icon: <CheckSquare size={16} /> },
        // { id: MiniAppType.GENAI, label: "AI Chat", icon: <Sparkles size={16} /> },
        // { id: MiniAppType.ENERGY, label: "Energy Analyzer", icon: <Lightbulb size={16} /> }
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
                <div className="bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-700 p-2 md:w-64 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                    {tabs.map((tab) => {
                        const isActive = activeApp === tab.id;
                        return (
                            <button
                                key={`tab-${tab.id}`}
                                onClick={() => setActiveApp(tab.id)}
                                aria-selected={isActive}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${isActive
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

                {/* App content */}
                <div className="flex-1 p-6 bg-surface overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeApp}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {appsMap[activeApp]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default projects;

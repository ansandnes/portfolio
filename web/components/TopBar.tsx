"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { LOCALES, useLocale } from "@/i18n/LocaleProvider";

export default function TopBar() {
  const { locale, setLocale, t } = useLocale();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes can't know the theme until mounted.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <div className="w-full border-b border-line bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-end gap-3 text-xs">
        {/* Language */}
        <div
          role="group"
          aria-label={t.topbar.languageLabel}
          className="inline-flex rounded-md border border-line p-0.5"
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              aria-pressed={locale === l}
              className={`px-2 py-0.5 rounded font-medium uppercase tracking-wide transition-colors ${
                locale === l
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Theme */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? t.topbar.toLight : t.topbar.toDark}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-elevated transition-colors"
        >
          {mounted && isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </div>
  );
}

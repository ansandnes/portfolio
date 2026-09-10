"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { en, type Messages } from "./messages/en";
import { no } from "./messages/no";

export type Locale = "en" | "no";
export const LOCALES: readonly Locale[] = ["en", "no"];

const MESSAGES: Record<Locale, Messages> = { en, no };
const STORAGE_KEY = "portfolio.locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Messages;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Server + first client render use "en" so hydration matches; the effect
  // swaps in the stored / browser preference.
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    let next: Locale = "en";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "no") {
        next = stored;
      } else {
        const lang = navigator.language?.toLowerCase() ?? "";
        if (lang.startsWith("nb") || lang.startsWith("nn") || lang.startsWith("no")) next = "no";
      }
    } catch {
      /* storage / navigator unavailable */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: MESSAGES[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

/** Shorthand for the current locale's messages. */
export function useT(): Messages {
  return useLocale().t;
}

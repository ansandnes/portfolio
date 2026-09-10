"use client";

import { useT } from "@/i18n/LocaleProvider";

export default function Loading() {
  const t = useT();
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-line-strong border-t-emerald-400"
        aria-hidden="true"
      />
      <span className="sr-only">{t.errors.loading}</span>
    </div>
  );
}

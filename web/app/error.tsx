"use client";

import { useEffect } from "react";
import { useT } from "@/i18n/LocaleProvider";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">{t.errors.genericTitle}</h1>
      <p className="mt-3 text-muted">{t.errors.genericBody}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-500"
      >
        {t.errors.retry}
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { useT } from "@/i18n/LocaleProvider";

export default function NotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="text-sm font-semibold text-emerald-500">404</p>
      <h1 className="mt-2 text-2xl font-bold text-foreground">{t.errors.notFoundTitle}</h1>
      <p className="mt-3 text-muted">{t.errors.notFoundBody}</p>
      <Link
        href={ROUTES.home}
        className="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-500"
      >
        {t.errors.goHome}
      </Link>
    </div>
  );
}

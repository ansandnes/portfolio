"use client";

import { useT } from "@/i18n/LocaleProvider";

export default function Footer() {
  const t = useT();
  return (
    <footer className="max-w-6xl mx-auto px-6 md:px-8 py-6 flex items-center text-sm text-muted">
      <div>{t.footer.builtWith}</div>
    </footer>
  );
}

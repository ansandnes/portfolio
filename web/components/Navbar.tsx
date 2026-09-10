"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES, type RoutePath } from "@/lib/routes";
import { Code2, FileText, Briefcase, Grid, Menu, X, MessageSquareQuote } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

interface NavItem {
  to: RoutePath;
  label: string;
  icon: React.ReactNode;
}

export default function Navbar() {
  const pathname = usePathname();
  const t = useT();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { to: ROUTES.home, label: t.nav.home, icon: <Code2 size={18} /> },
    { to: ROUTES.resume, label: t.nav.resume, icon: <FileText size={18} /> },
    { to: ROUTES.experience, label: t.nav.experience, icon: <Briefcase size={18} /> },
    { to: ROUTES.testimonials, label: t.nav.testimonials, icon: <MessageSquareQuote size={18} /> },
    { to: ROUTES.projects, label: t.nav.projects, icon: <Grid size={18} /> },
  ];

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <nav className="bg-background/90 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
              {t.nav.brand}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                      : "text-muted hover:text-foreground hover:bg-elevated"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-md text-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-400"
            onClick={toggleMobile}
            aria-label={t.nav.menuToggle}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-background border-t border-line pb-4">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-foreground transition-colors ${
                  isActive ? "bg-emerald-500/15 font-semibold" : "hover:bg-elevated"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

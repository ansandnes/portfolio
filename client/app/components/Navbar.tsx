"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppRoute } from "@/app/types";
import { Code2, FileText, Briefcase, Grid, Menu, X, MessageSquareQuote, Globe } from "lucide-react";

interface NavItem {
  to: AppRoute;
  label: string;
  icon: React.ReactNode;
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { to: AppRoute.HOME, label: "Home", icon: <Code2 size={18} /> },
    { to: AppRoute.RESUME, label: "CV - Resume", icon: <FileText size={18} /> },
    { to: AppRoute.EXPERIENCE, label: "Experience", icon: <Briefcase size={18} /> },
    { to: AppRoute.TESTIMONIALS, label: "Testimonials", icon: <MessageSquareQuote size={18} /> },
    { to: AppRoute.PROJECTS, label: "Projects", icon: <Grid size={18} /> },
  ];

  const toggleMobile = () => setMobileOpen((prev) => !prev);


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-around h-28 pt-10">

          {/* Logo */}
          <Link href={AppRoute.HOME} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
              Portfolio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">

            {navItems.map((item) => {
              const isActive = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive
                    ? "bg-emerald-600/20 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-neutral-800/50"
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
            className="sm:hidden p-2 rounded-md text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            onClick={toggleMobile}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-neutral-900/95 border-t border-neutral-800 pb-4">

          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-white transition-colors ${isActive ? "bg-emerald-600/20 font-semibold" : "hover:bg-neutral-800/50"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
          <div className="px-4 py-3">
          </div>

        </div>
      )}
    </nav>
  );
}


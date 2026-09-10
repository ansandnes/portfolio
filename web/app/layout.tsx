"use client";
import React, { useState } from "react";
import "@/app/globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { LanguageProvider, useLanguage } from '@/app/utils/context/language/LanguageContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-neutral-900 text-slate-100 antialiased">

        {/* You keep your layout 100% identical */}
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <header className="w-full z-20">
              <Navbar />
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-8 py-10">
              <div className="w-full">
                {children}
              </div>
            </main>

            <Footer />
          </div>
        </LanguageProvider>

      </body>
    </html>
  );
}

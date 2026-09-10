import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Andreas Sandnes — Portfolio",
    template: "%s — Andreas Sandnes",
  },
  description:
    "Portfolio of Andreas Sandnes — resume, experience, testimonials, and interactive project demos.",
  openGraph: {
    type: "website",
    siteName: "Andreas Sandnes — Portfolio",
    title: "Andreas Sandnes — Portfolio",
    description:
      "Resume, experience, testimonials, and interactive project demos.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Andreas Sandnes — Portfolio",
    description:
      "Resume, experience, testimonials, and interactive project demos.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-neutral-900 text-slate-100 antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="w-full z-20">
            <Navbar />
          </header>

          <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-8 py-10">
            <div className="w-full">{children}</div>
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}

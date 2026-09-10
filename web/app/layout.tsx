import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import { LocaleProvider } from "@/i18n/LocaleProvider";

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
    description: "Resume, experience, testimonials, and interactive project demos.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Andreas Sandnes — Portfolio",
    description: "Resume, experience, testimonials, and interactive project demos.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocaleProvider>
            <div className="min-h-screen flex flex-col">
              <div className="sticky top-0 z-50">
                <TopBar />
                <header className="w-full">
                  <Navbar />
                </header>
              </div>

              <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-8 py-10">
                <div className="w-full">{children}</div>
              </main>

              <Footer />
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/routes";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return Object.values(ROUTES).map((path) => ({
    url: new URL(path, BASE).toString(),
    lastModified,
  }));
}

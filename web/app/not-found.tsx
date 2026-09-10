import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="text-sm font-semibold text-emerald-400">404</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-slate-400">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <Link
        href={ROUTES.home}
        className="mt-6 inline-block rounded-lg bg-emerald-600/80 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-600"
      >
        Go home
      </Link>
    </div>
  );
}

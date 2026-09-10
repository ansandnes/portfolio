"use client";

import { useEffect } from "react";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl font-bold text-white">This demo hit an error</h1>
      <p className="mt-3 text-slate-400">
        Something went wrong running the mini-app. You can retry or pick another one.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-emerald-600/80 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-600"
      >
        Try again
      </button>
    </div>
  );
}

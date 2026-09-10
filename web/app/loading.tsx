export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400"
        aria-hidden="true"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

"use client";

import { useRef, type ReactNode, type Ref } from "react";
import { X } from "lucide-react";
import { useT } from "@/i18n/LocaleProvider";

/**
 * Modal built on a native <dialog>. The caller holds the ref and opens it
 * with `ref.current.showModal()`, which gives focus trapping, Escape-to-close
 * and focus restoration for free.
 *
 * A click whose press *and* release both land on the <dialog> element itself
 * (i.e. the backdrop — the content wrapper fills the dialog box) closes it;
 * checking the press too stops a text-selection drag that ends outside from
 * closing it.
 */
export default function Modal({
  ref,
  labelledBy,
  children,
}: {
  ref: Ref<HTMLDialogElement>;
  /** id of the element that titles the modal. */
  labelledBy: string;
  children: ReactNode;
}) {
  const t = useT();
  const pressedOnBackdrop = useRef(false);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onMouseDown={(e) => {
        pressedOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressedOnBackdrop.current && e.target === e.currentTarget) e.currentTarget.close();
        pressedOnBackdrop.current = false;
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-3xl p-0 rounded-2xl border border-line bg-card text-foreground shadow-2xl overflow-hidden backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 md:p-8 animate-fade-in">
        <button
          type="button"
          onClick={(e) => e.currentTarget.closest("dialog")?.close()}
          aria-label={t.modal.close}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted hover:text-foreground hover:bg-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </dialog>
  );
}

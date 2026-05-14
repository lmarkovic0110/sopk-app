"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateQuizHeaderFksAction } from "@/app/actions/quiz.actions";

export type QuizHeaderFkCategory = { id: string; name: string };
export type QuizHeaderFkLocation = { id: string; name: string };

type QuizHeaderFkControlsProps = {
  quizId: string;
  categoryId: string;
  locationId: string;
  categoryName?: string;
  locationName?: string;
  maxTeams?: number;
  entryFeePerMember?: number;
  categories: QuizHeaderFkCategory[];
  locations: QuizHeaderFkLocation[];
};

const selectClass =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

const labelClass = "text-xs uppercase tracking-wide text-[var(--muted)]";

export function QuizHeaderFkControls({
  quizId,
  categoryId,
  locationId,
  categoryName,
  locationName,
  maxTeams,
  entryFeePerMember,
  categories,
  locations,
}: QuizHeaderFkControlsProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const roles: string[] = (user?.["http://localhost:3000/roles"] as string[]) || [];
  const canManage = roles.some((role) => ["Admin", "Organizator"].includes(role));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const cat = String(fd.get("categoryId") ?? "").trim();
    const loc = String(fd.get("locationId") ?? "").trim();

    startTransition(async () => {
      const res = await updateQuizHeaderFksAction(quizId, cat, loc);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30 md:col-span-4 text-sm text-[var(--muted)]">
          Loading…
        </div>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
          <p className={labelClass}>Category</p>
          <p className="mt-1 font-semibold">{categoryName ?? "Unknown"}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
          <p className={labelClass}>Location</p>
          <p className="mt-1 font-semibold">{locationName ?? "Unknown"}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
          <p className={labelClass}>Max teams</p>
          <p className="mt-1 font-semibold">{maxTeams ?? 0} teams</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
          <p className={labelClass}>Entry fee</p>
          <p className="mt-1 font-semibold">
            {entryFeePerMember?.toFixed(2) ?? "0.00"} EUR{" "}
            <span className="text-[10px] text-[var(--muted)]">/ member</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
          <label htmlFor={`quiz-${quizId}-category`} className={labelClass}>
            Category
          </label>
          <select
            id={`quiz-${quizId}-category`}
            name="categoryId"
            required
            defaultValue={categoryId || ""}
            className={selectClass}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
          <label htmlFor={`quiz-${quizId}-location`} className={labelClass}>
            Location
          </label>
          <select
            id={`quiz-${quizId}-location`}
            name="locationId"
            required
            defaultValue={locationId || ""}
            className={selectClass}
          >
            <option value="" disabled>
              Select location
            </option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
          <p className={labelClass}>Max teams</p>
          <p className="mt-1 font-semibold">{maxTeams ?? 0} teams</p>
          <p className="mt-1 text-[10px] text-[var(--muted)]">Edit on full quiz form if needed.</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
          <p className={labelClass}>Entry fee</p>
          <p className="mt-1 font-semibold">
            {entryFeePerMember?.toFixed(2) ?? "0.00"} EUR{" "}
            <span className="text-[10px] text-[var(--muted)]">/ member</span>
          </p>
        </div>
      </div>
      {error ? (
        <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save category & location"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createQuizAction, updateQuizAction } from "@/app/actions/quiz.actions";
import type { DbQuizStatus } from "@/types/quiz";

export type QuizFormCategory = { id: string; name: string };
export type QuizFormLocation = { id: string; name: string; tableCapacity: number };

export type QuizFormInitial = {
  id: string;
  title: string;
  scheduledAt: string;
  categoryId: string;
  locationId: string;
  maxTeams: number;
  entryFeePerMember: number;
  dbStatus: DbQuizStatus;
};

const fieldClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--muted)]/55 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]";

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const EDIT_STATUS_OPTIONS: { value: DbQuizStatus; label: string }[] = [
  { value: "Najavljen", label: "Draft" },
  { value: "U tijeku", label: "Live" },
  { value: "Popunjen", label: "Full" },
  { value: "Završen", label: "Closed" },
  { value: "Otkazan", label: "Cancelled" },
];

type QuizFormProps = {
  categories: QuizFormCategory[];
  locations: QuizFormLocation[];
  mode?: "create" | "edit";
  initialQuiz?: QuizFormInitial;
};

export function QuizForm({
  categories,
  locations,
  mode = "create",
  initialQuiz,
}: QuizFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" && initialQuiz;

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState(
    isEdit && initialQuiz ? initialQuiz.locationId : ""
  );
  const maxTeamsInputRef = useRef<HTMLInputElement>(null);

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);
  const maxTeamsUpperBound = selectedLocation?.tableCapacity;

  const syncMaxTeamsToLocation = (locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    const input = maxTeamsInputRef.current;
    if (!loc || !input) return;

    const current = Number.parseInt(input.value, 10);
    if (!Number.isFinite(current) || input.value.trim() === "") {
      input.value = String(loc.tableCapacity);
      return;
    }
    if (current > loc.tableCapacity) {
      input.value = String(loc.tableCapacity);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, unknown>;

    const locationId = typeof data.locationId === "string" ? data.locationId.trim() : "";
    const loc = locations.find((l) => l.id === locationId);
    const maxTeamsRaw = data.maxTeams;
    const maxTeamsNum =
      typeof maxTeamsRaw === "string" && maxTeamsRaw.trim() !== ""
        ? Number.parseInt(maxTeamsRaw, 10)
        : typeof maxTeamsRaw === "number"
          ? Math.trunc(maxTeamsRaw)
          : NaN;

    if (!loc) {
      setFormError("Select a location.");
      setLoading(false);
      return;
    }
    if (!Number.isFinite(maxTeamsNum) || maxTeamsNum < 1) {
      setFormError("Enter a valid max teams value.");
      setLoading(false);
      return;
    }
    if (maxTeamsNum > loc.tableCapacity) {
      setFormError(`Max teams cannot exceed this venue's table count (${loc.tableCapacity}).`);
      setLoading(false);
      return;
    }

    const result = isEdit
      ? await updateQuizAction(initialQuiz.id, data)
      : await createQuizAction(data);

    if (result.success) {
      if (isEdit) {
        router.push(`/quiz/${initialQuiz.id}`);
      } else {
        router.push("/quiz");
      }
      router.refresh();
    } else {
      setFormError("error" in result && result.error ? result.error : isEdit ? "Could not update the quiz." : "Could not create the quiz.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="quiz-title" className={labelClass}>
          Quiz title
        </label>
        <input
          id="quiz-title"
          name="title"
          required
          className={fieldClass}
          placeholder="Enter quiz name…"
          defaultValue={isEdit ? initialQuiz.title : undefined}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="quiz-category" className={labelClass}>
            Category
          </label>
          <select
            id="quiz-category"
            name="categoryId"
            required
            className={fieldClass}
            defaultValue={isEdit ? initialQuiz.categoryId : ""}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quiz-location" className={labelClass}>
            Location
          </label>
          <select
            id="quiz-location"
            name="locationId"
            required
            className={fieldClass}
            defaultValue={isEdit ? initialQuiz.locationId : ""}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedLocationId(id);
              syncMaxTeamsToLocation(id);
            }}
          >
            <option value="">Select location</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="quiz-scheduled" className={labelClass}>
            Date &amp; time
          </label>
          <input
            id="quiz-scheduled"
            name="scheduledAt"
            type="datetime-local"
            required
            className={fieldClass}
            defaultValue={isEdit ? toDatetimeLocalValue(initialQuiz.scheduledAt) : undefined}
          />
        </div>
        <div>
          <label htmlFor="quiz-status" className={labelClass}>
            {isEdit ? "Status" : "Initial status"}
          </label>
          <select
            id="quiz-status"
            name="status"
            className={fieldClass}
            defaultValue={isEdit ? initialQuiz.dbStatus : "Najavljen"}
          >
            {isEdit
              ? EDIT_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))
              : (
                <>
                  <option value="Najavljen">Draft</option>
                  <option value="U tijeku">Live</option>
                  <option value="Popunjen">Full</option>
                </>
              )}
          </select>
        </div>
        <div>
          <label htmlFor="quiz-max-teams" className={labelClass}>
            Max teams
          </label>
          <input
            id="quiz-max-teams"
            ref={maxTeamsInputRef}
            name="maxTeams"
            type="number"
            required
            min={1}
            max={maxTeamsUpperBound}
            className={fieldClass}
            defaultValue={isEdit ? initialQuiz.maxTeams : ""}
          />
          <p className="mt-1.5 text-xs text-[var(--muted)]">
            Must be between 1 and this venue&apos;s table count
            {maxTeamsUpperBound != null ? ` (${maxTeamsUpperBound})` : ""}. Changing location adjusts the value if it
            was too high.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="quiz-entry-fee" className={labelClass}>
          Entry fee (EUR / member)
        </label>
        <input
          id="quiz-entry-fee"
          name="entryFee"
          type="number"
          step="0.01"
          min={0}
          className={fieldClass}
          defaultValue={isEdit ? initialQuiz.entryFeePerMember : 0}
        />
      </div>

      {formError ? (
        <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
        >
          {loading
            ? isEdit
              ? "Saving…"
              : "Creating…"
            : isEdit
              ? "Save changes"
              : "Create Quiz"}
        </button>
      </div>
    </form>
  );
}

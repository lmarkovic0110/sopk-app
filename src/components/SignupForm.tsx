"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createTeamAndSignupAction } from "@/app/actions/signup.actions";

export type SignupPlayerOption = { id: string; label: string };

type SignupFormProps = {
  quizId: string;
  players: SignupPlayerOption[];
};

const selectClass =
  "rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25 shadow-sm w-full";

export default function SignupForm({ quizId, players }: SignupFormProps) {
  const [memberFields, setMemberFields] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const errorBody = useMemo(() => {
    if (error === "db_error") {
      return "Something went wrong while saving your signup. Please try again.";
    }
    if (error === "duplicate_roster") {
      return "The same player ID cannot appear more than once on this team (captain and members must be unique).";
    }
    if (error === "duplicate_quiz_player") {
      return "One or more players are already registered with another team for this quiz.";
    }
    return "All player IDs (captain and members) must already exist in the system before you can register for this quiz.";
  }, [error]);

  useEffect(() => {
    if (
      error === "invalid_members" ||
      error === "missing_players" ||
      error === "db_error" ||
      error === "duplicate_roster" ||
      error === "duplicate_quiz_player"
    ) {
      setShowErrorPopup(true);
    }
  }, [error]);

  const closePopup = () => {
    setShowErrorPopup(false);
    router.replace(`/quiz/${quizId}`);
  };

  const addMember = () => setMemberFields([...memberFields, Date.now()]);
  const removeMember = (id: number) => setMemberFields(memberFields.filter((f) => f !== id));

  const noPlayers = players.length === 0;

  return (
    <>
      {noPlayers ? (
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
          There are no registered players in the system yet. Add players to the <code className="text-xs">igrac</code>{" "}
          table before teams can sign up.
        </p>
      ) : null}

      <form action={createTeamAndSignupAction} className={`mt-5 space-y-4 ${noPlayers ? "pointer-events-none opacity-50" : ""}`}>
        <input type="hidden" name="quizId" value={quizId} />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="teamName"
            required
            placeholder="Team name"
            className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25 md:col-span-2 shadow-sm"
          />
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1 block">
              Captain (player)
            </label>
            <select name="captainId" required className={selectClass} defaultValue="">
              <option value="" disabled>
                Select captain…
              </option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} (#{p.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
            Team members (players)
          </label>
          {memberFields.map((fieldId, index) => (
            <div key={fieldId} className="flex gap-2 animate-in fade-in slide-in-from-left-1 duration-200">
              <select name="memberIds" required className={selectClass}>
                <option value="" disabled>
                  Select member {index + 2}…
                </option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} (#{p.id})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeMember(fieldId)}
                className="text-rose-500 px-2 hover:bg-rose-50 rounded-md transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMember}
            disabled={noPlayers}
            className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 disabled:opacity-40"
          >
            + Add another member
          </button>
        </div>

        <button
          type="submit"
          disabled={noPlayers}
          className="w-full rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          Register team and members
        </button>
      </form>

      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closePopup} />
          <div className="relative w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#1a0b0b] p-8 shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-9 w-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">Validation error</h3>
            <div className="mt-4 space-y-2">
              <p className="text-xs leading-relaxed text-white/50">{errorBody}</p>
            </div>

            <button
              type="button"
              onClick={closePopup}
              className="mt-8 w-full rounded-xl bg-rose-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all active:scale-95"
            >
              Close and try again
            </button>
          </div>
        </div>
      )}
    </>
  );
}

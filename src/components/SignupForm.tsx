"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createTeamAndSignupAction } from "@/app/actions/signup.actions";

export default function SignupForm({ quizId }: { quizId: string }) {
  const [memberFields, setMemberFields] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // Slušamo promjene u URL-u i otvaramo popup ako postoji specifičan error
  useEffect(() => {
    if (error === "invalid_members" || error === "missing_players" || error === "db_error") {
      setShowErrorPopup(true);
    }
  }, [error]);

  const closePopup = () => {
    setShowErrorPopup(false);
    // Čistimo query parametre iz URL-a bez osvježavanja stranice
    router.replace(`/quiz/${quizId}`);
  };

  const addMember = () => setMemberFields([...memberFields, Date.now()]);
  const removeMember = (id: number) => setMemberFields(memberFields.filter(f => f !== id));

  return (
    <>
      <form action={createTeamAndSignupAction} className="mt-5 space-y-4">
        <input type="hidden" name="quizId" value={quizId} />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="teamName"
            required
            placeholder="Naziv tima"
            className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25 md:col-span-2 shadow-sm"
          />
          <input
            name="captainId"
            type="number"
            required
            placeholder="ID Kapetana"
            className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Članovi tima (ID-ovi)</label>
          {memberFields.map((fieldId, index) => (
            <div key={fieldId} className="flex gap-2 animate-in fade-in slide-in-from-left-1 duration-200">
              <input
                name="memberIds"
                type="number"
                required
                placeholder={`ID člana ${index + 2}`}
                className="flex-1 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25 shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeMember(fieldId)}
                className="text-rose-500 px-2 hover:bg-rose-50 rounded-md transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMember}
            className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            + Dodaj još jednog člana
          </button>
        </div>

        <button className="w-full rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105 transition-all shadow-md active:scale-[0.98]">
          Prijavi tim i članove
        </button>
      </form>

      {/* error */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay / Pozadina */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closePopup} />
          {/* Sadržaj Popupa */}
          <div className="relative w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#1a0b0b] p-8 shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-9 w-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">Greška kod unosa!</h3>
            <div className="mt-4 space-y-2">
              <p className="text-xs leading-relaxed text-white/50">
                Svi uneseni ID-ovi (kapetan i članovi) moraju biti registrirani u sustavu prije prijave na kviz.
              </p>
            </div>

            <button
              onClick={closePopup}
              className="mt-8 w-full rounded-xl bg-rose-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all active:scale-95"
            >
              Zatvori i ispravi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

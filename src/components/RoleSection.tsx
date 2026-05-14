"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export default function RoleSection() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Roles from Auth0 custom claim (values must match IdP, e.g. Organizator, Ugostitelj)
  const roles: string[] = (user?.['http://localhost:3000/roles'] as string[]) || [];

  // Permission flags for action buttons
  const canCreateQuiz = roles.some(role => ['Admin', 'Organizator'].includes(role));
  const canCreateLocation = roles.some(role => ['Admin', 'Ugostitelj'].includes(role));

  // While roles are loading, show a skeleton block
  if (isLoading) return <div className="h-48 animate-pulse rounded-2xl bg-white/5" />;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)] to-[#2d7a58] p-8 text-white shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#ece3d3]">Pub Quiz Platform</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white">
        Discover, host, and join quiz events.
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[#efe6d8]">
        Browse upcoming events and sign your team up in a few clicks.
      </p>

      {/* Role */}
      {(canCreateQuiz || canCreateLocation) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {/* Admin/Organizer */}
          {canCreateQuiz && (
            <button
              onClick={() => router.push("/quiz/create")}
              className="rounded-md bg-white px-5 py-2.5 text-sm font-bold text-[var(--primary)] hover:bg-gray-100 transition-all active:scale-95 shadow-md"
            >
              Create Quiz
            </button>
          )}

          {/* Admin / Host (Ugostitelj) */}
          {canCreateLocation && (
            <button
              onClick={() => router.push("/locations/create")}
              className="rounded-md border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/20 backdrop-blur-sm transition-all active:scale-95"
            >
              Create Location
            </button>
          )}
        </div>
      )}
    </section>
  );
}

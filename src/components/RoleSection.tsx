"use client";

import { useUser } from '@auth0/nextjs-auth0/client';

export default function RoleSection() {
  const { user } = useUser();
  
  const roles: string[] = (user?.['http://localhost:3000/roles'] as string[]) || [];
  const canCreate = roles.some(role => ['Admin', 'Organizator', 'Ugostitelj'].includes(role));

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)] to-[#2d7a58] p-8 text-white shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#ece3d3]">Pub Quiz Platform</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Discover, host, and join quiz events.</h1>
      <p className="mt-3 max-w-2xl text-sm text-[#efe6d8]">Browse upcoming events and sign your team up in a few clicks.</p>

      {canCreate && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-gray-100 transition-colors">
            Create Quiz
          </button>
          <button className="rounded-md border border-white/70 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
            Create Location
          </button>
        </div>
      )}
    </section>
  );
}

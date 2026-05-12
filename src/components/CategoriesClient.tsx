"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

interface Category {
  id: number;
  name: string;
  description: string | null;
}

export default function CategoriesClient({ categories }: { categories: Category[] }) {
  const { user, isLoading: authLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");


  const roles: string[] = (user?.['http://localhost:3000/roles'] as string[]) || [];
  const canManage = roles.some(role => ['Admin', 'Organizator', 'Ugostitelj'].includes(role));

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (authLoading) return (
    <div className="mx-auto max-w-5xl p-10 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-r-transparent"></div>
      <p className="mt-2 text-sm text-[var(--muted)]">Učitavanje podataka...</p>
    </div>
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-[var(--muted)]">Manage and browse quiz categories.</p>
        </div>
        {canManage && (
          <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105 transition-all shadow-sm">
            + Create Category
          </button>
        )}
      </section>

      {/* Search Filter */}
      <section className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm dark:bg-[var(--surface)]">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25 transition-all"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
             <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2 text-[var(--muted)] hover:text-[var(--foreground)]"
             >
                ✕
             </button>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm dark:bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-soft)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Description</th>
              {canManage && <th className="px-6 py-4 font-bold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[var(--foreground)]">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)] italic">
                    {category.description || "No description provided"}
                  </td>
                  {canManage && (
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--surface-soft)] transition-colors">
                          Edit
                        </button>
                        <button className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canManage ? 3 : 2} className="px-6 py-10 text-center text-[var(--muted)]">
                  No categories found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {!canManage && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-center">
          <p className="text-xs text-[var(--muted)] font-medium">
            {user ? "You don't have permission to edit categories." : "Please log in to manage categories."}
          </p>
        </div>
      )}
    </main>
  );
}

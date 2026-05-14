"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import Link from "next/link";
import type { Quiz } from "@/types/quiz";

export default function QuizzesClient({ quizzes }: { quizzes: Quiz[] }) {
  const { user } = useUser();

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");

  // Auth0 roles (claim values must match IdP)
  const roles: string[] = (user?.['http://localhost:3000/roles'] as string[]) || [];
  const canManage = roles.some(role => ['Admin', 'Organizator'].includes(role));

  // Distinct filter option lists
  const statuses = ["All statuses", ...Array.from(new Set(quizzes.map(q => q.status)))];
  const categories = ["All categories", ...Array.from(new Set(quizzes.map(q => q.categoryName || "General")))];

  // Apply filters
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || quiz.status === statusFilter;
    const matchesCategory = categoryFilter === "All categories" || (quiz.categoryName || "General") === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All statuses");
    setCategoryFilter("All categories");
  };

  const filterInputClass =
    "w-full rounded-lg border border-white/25 bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] shadow-sm outline-none transition-shadow placeholder:text-[var(--muted)]/65 focus:border-white/50 focus:ring-2 focus:ring-white/35";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Quizzes</h1>
          <p className="mt-2 text-sm text-[var(--muted)] italic">
            Browse events, filter results, and open quiz details.
          </p>
        </div>
          {canManage && (
            <Link
              href="/quiz/create"
              className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all shadow-lg inline-block"
            >
              + Create Quiz
            </Link>
          )}
      </section>

      {/* Filter bar */}
      <section className="rounded-xl border border-[var(--primary)] bg-[var(--primary)] p-5 shadow-lg">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <label htmlFor="quiz-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90">
              Search by title
            </label>
            <input
              id="quiz-search"
              type="text"
              className={filterInputClass}
              placeholder="Type a quiz name…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="lg:col-span-3">
            <label htmlFor="quiz-status" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90">
              Status
            </label>
            <select
              id="quiz-status"
              className={filterInputClass}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="lg:col-span-3">
            <label htmlFor="quiz-category" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90">
              Category
            </label>
            <select
              id="quiz-category"
              className={filterInputClass}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-end lg:col-span-2">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full rounded-lg border border-white/40 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/25"
            >
              Reset filters
            </button>
          </div>
        </div>
      </section>

      {/* Quiz cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-all hover:border-[var(--primary)]/45 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="aspect-video w-full rounded-xl border border-[var(--border)] bg-[var(--primary)]/10 flex items-center justify-center text-[var(--muted)] text-xs mb-5 overflow-hidden">
                 <span className="uppercase tracking-widest font-semibold">No poster</span>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    quiz.status === 'published'
                      ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                      : 'bg-[var(--surface-soft)] text-[var(--muted)]'
                  }`}>
                    {quiz.status}
                  </span>
                  <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-widest">
                    {quiz.categoryName || "General"}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                  {quiz.title}
                </h3>
                <div className="mt-auto pt-5 flex items-center justify-between border-t border-[var(--border)] text-[var(--muted)]">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Date</span>
                    <span className="text-xs font-medium text-[var(--foreground)]">{new Date(quiz.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Time</span>
                    <span className="text-xs font-medium text-[var(--foreground)]">{new Date(quiz.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--surface)]/80">
            <p className="text-[var(--muted)] font-medium">No quizzes match your current filters.</p>
            <button type="button" onClick={resetFilters} className="mt-4 text-sm font-bold text-[var(--primary)] hover:underline">Clear all filters</button>
          </div>
        )}
      </section>
    </main>
  );
}

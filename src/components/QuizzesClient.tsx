"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import Link from 'next/link';

interface Quiz {
  id: number;
  title: string;
  status: string;
  scheduledAt: string;
  categoryName?: string;
}

export default function QuizzesClient({ quizzes }: { quizzes: Quiz[] }) {
  const { user } = useUser();
  
  // States za filtere
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");

  // Auth0 uloge
  const roles: string[] = (user?.['http://localhost:3000/roles'] as string[]) || [];
  const canManage = roles.some(role => ['Admin', 'Organizator', 'Ugostitelj'].includes(role));

  // Opcije za filtere
  const statuses = ["All statuses", ...Array.from(new Set(quizzes.map(q => q.status)))];
  const categories = ["All categories", ...Array.from(new Set(quizzes.map(q => q.categoryName || "General")))];

  // Logika filtriranja
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

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Quizzes</h1>
          <p className="mt-2 text-sm text-[var(--muted)] italic">
            Browse events, filter results, and open quiz details.
          </p>
        </div>
        {canManage && (
          <button className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all shadow-lg">
            + Create Quiz
          </button>
        )}
      </section>

      {/* FILTER BAR */}
      <section className="rounded-xl border border-white/10 bg-[#0d1f18] p-4 shadow-2xl">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/50"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <select
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--primary)]/50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(s => <option key={s} value={s} className="bg-[#0d1f18]">{s}</option>)}
          </select>

          {/* Category Dropdown */}
          <select
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--primary)]/50"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c} className="bg-[#0d1f18]">{c}</option>)}
          </select>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Reset filters
          </button>
        </div>
      </section>

      {/* Kartice */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="group flex flex-col rounded-2xl border border-white/5 bg-[#142921] p-5 shadow-sm transition-all hover:bg-[#1a332a] hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-video w-full rounded-xl bg-black/20 flex items-center justify-center text-white/20 text-xs border border-white/5 mb-5 overflow-hidden">
                 {/* Img */}
                 <span className="uppercase tracking-widest">No Poster</span>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    quiz.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {quiz.status}
                  </span>
                  <span className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">
                    {quiz.categoryName || "General"}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors">
                  {quiz.title}
                </h3>
                <div className="mt-auto pt-5 flex items-center justify-between border-t border-white/5 text-[var(--muted)]">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-white/30">Date</span>
                    <span className="text-xs font-medium text-white/80">{new Date(quiz.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-white/30">Time</span>
                    <span className="text-xs font-medium text-white/80">{new Date(quiz.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-white/40 font-medium">No quizzes match your current filters.</p>
            <button onClick={resetFilters} className="mt-4 text-[var(--primary)] text-sm font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </section>
    </main>
  );
}

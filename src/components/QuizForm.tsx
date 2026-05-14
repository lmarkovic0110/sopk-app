"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuizAction } from "@/app/actions/quiz.actions";

export function QuizForm({ categories, locations }: { categories: any[], locations: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const result = await createQuizAction(data);

    if (result.success) {
      router.push("/quiz");
      router.refresh();
    } else {
      alert("Error saving quiz");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Quiz Title</label>
        <input name="title" required className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[var(--primary)] outline-none" placeholder="Enter quiz name..." />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Short Description (Optional)</label>
        <textarea name="description" className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[var(--primary)] outline-none h-24 resize-none" placeholder="Briefly describe the event..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Category</label>
          <select name="categoryId" required className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[var(--primary)] outline-none">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id} className="bg-[#0d1f18]">{c.name}</option>)}
          </select>
        </div>
        {/* Location */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Location</label>
          <select name="locationId" required className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[var(--primary)] outline-none">
            <option value="">Select Location</option>
            {locations.map(l => <option key={l.id} value={l.id} className="bg-[#0d1f18]">{l.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Date & Time</label>
          <input name="scheduledAt" type="datetime-local" required className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[var(--primary)] outline-none" />
        </div>
        {/* Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Initial Status</label>
          <select name="status" className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[var(--primary)] outline-none">
            <option value="Najavljen" className="bg-[#0d1f18]">Draft (Najavljen)</option>
            <option value="U tijeku" className="bg-[#0d1f18]">Live (U tijeku)</option>
            <option value="Popunjen" className="bg-[#0d1f18]">Full (Popunjen)</option>
          </select>
        </div>
        {/* Max Teams */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Max Teams</label>
          <input name="maxTeams" type="number" defaultValue={15} min={1} className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[var(--primary)] outline-none" />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 font-bold text-white/40 hover:text-white uppercase text-xs transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="rounded-lg bg-[var(--primary)] px-10 py-3 font-bold text-white uppercase text-xs hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-[var(--primary)]/10">
          {loading ? "Creating..." : "Create Quiz"}
        </button>
      </div>
    </form>
  );
}

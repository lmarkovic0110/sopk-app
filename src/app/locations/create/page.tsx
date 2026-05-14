"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { createLocationAction } from "@/app/actions/location.actions";

export default function CreateLocationPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return alert("Morate biti prijavljeni!");
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      capacity: formData.get("capacity") as string,
      email: user.email as string,
      firstName: user.given_name as string,
      lastName: user.family_name as string,
    };

    const result = await createLocationAction(payload);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      alert(result.error || "Greška pri spremanju.");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">Nova Lokacija</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-[#0d1f18] p-8 rounded-2xl border border-white/10">
        <div>
          <label className="block text-xs uppercase text-white/40 mb-2 font-bold">Naziv Objekta</label>
          <input name="name" required className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-[var(--primary)]" />
        </div>
        <div>
          <label className="block text-xs uppercase text-white/40 mb-2 font-bold">Adresa</label>
          <input name="address" required className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-[var(--primary)]" />
        </div>
        <div>
          <label className="block text-xs uppercase text-white/40 mb-2 font-bold">Kapacitet Stolova</label>
          <input name="capacity" type="number" required className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-[var(--primary)]" />
        </div>
        <button 
          type="submit"
          disabled={loading || !user}
          className="w-full bg-[var(--primary)] py-3 rounded-lg font-bold uppercase tracking-widest hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Spremanje..." : "Spremi Lokaciju"}
        </button>
      </form>
    </main>
  );
}

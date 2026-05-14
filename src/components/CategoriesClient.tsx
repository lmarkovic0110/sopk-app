"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/app/actions/category.actions';

interface Category {
  id: number;
  name: string;
}

export default function CategoriesClient({ categories }: { categories: Category[] }) {
  const { user, isLoading: authLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");

  // State za Delete Confirmation Popup
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const roles: string[] = (user?.['http://localhost:3000/roles'] as string[]) || [];
  const canManage = roles.some(role => ['Admin', 'Organizator'].includes(role));

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Otvaranje modala za kreiranje ili uređivanje
  const handleOpenEditModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
    } else {
      setEditingCategory(null);
      setName("");
    }
    setIsModalOpen(true);
  };

  // Slanje forme (Create ili Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = editingCategory
      ? await updateCategoryAction(editingCategory.id, name)
      : await createCategoryAction(name);

    if (res.success) {
      setIsModalOpen(false);
      setName("");
    } else {
      alert(res.error || "Došlo je do greške");
    }
  };

  // Izvršavanje brisanja nakon potvrde u popupu
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    const res = await deleteCategoryAction(categoryToDelete.id);
    if (!res.success) {
      alert(res.error);
    }
    setIsDeleting(false);
    setCategoryToDelete(null);
  };

  if (authLoading) return (
    <div className="flex h-64 items-center justify-center text-white italic">
      Učitavanje podataka...
    </div>
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      {/* Header */}
      <section className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-sm text-[var(--muted)]">Manage quiz categories.</p>
        </div>
        {canManage && (
          <button
            onClick={() => handleOpenEditModal()}
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/20"
          >
            + Create Category
          </button>
        )}
      </section>

      {/* Search */}
      <div className="relative">
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--primary)] transition-all"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d1f18] shadow-sm">
        <table className="w-full text-left text-sm text-white">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-white/40">
            <tr>
              <th className="px-6 py-4">Category Name</th>
              {canManage && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  {canManage && (
                    <td className="px-6 py-4 text-right space-x-4">
                      <button
                        onClick={() => handleOpenEditModal(category)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(category)}
                        className="text-rose-500 hover:text-rose-400 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-10 text-center text-white/30 italic">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*DELETE CONF*/}
      {categoryToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCategoryToDelete(null)} />
          {/* Popup */}
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1f18] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Brisanje kategorije</h3>
              <p className="mt-3 text-sm text-white/50 leading-relaxed">
                Jeste li sigurni da želite obrisati kategoriju <span className="font-bold text-white">"{categoryToDelete.name}"</span>?
                Ova radnja se ne može poništiti.
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 rounded-xl bg-white/5 py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all"
              >
                Odustani
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all"
              >
                {isDeleting ? "..." : "Obriši"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1f18] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingCategory ? "Uredi Kategoriju" : "Nova Kategorija"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Naziv Kategorije</label>
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="npr. Opće znanje"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-[var(--primary)] transition-all"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--primary)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/20"
                >
                  Spremi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

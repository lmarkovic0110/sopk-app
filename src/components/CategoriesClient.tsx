"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/app/actions/category.actions';
import type { Category } from '@/types/category';

export default function CategoriesClient({ categories }: { categories: Category[] }) {
  const { user, isLoading: authLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const roles: string[] = (user?.['http://localhost:3000/roles'] as string[]) || [];
  const canManage = roles.some(role => ['Admin', 'Organizator'].includes(role));

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = editingCategory
      ? await updateCategoryAction(editingCategory.id, name)
      : await createCategoryAction(name);

    if (res.success) {
      setIsModalOpen(false);
      setName("");
    } else {
      alert(res.error || "Something went wrong.");
    }
  };

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

  const filterInputClass =
    "w-full rounded-lg border border-white/25 bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] shadow-sm outline-none transition-shadow placeholder:text-[var(--muted)]/65 focus:border-white/50 focus:ring-2 focus:ring-white/35";

  if (authLoading) return (
    <div className="flex h-64 items-center justify-center text-[var(--muted)] italic">
      Loading…
    </div>
  );

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Categories</h1>
          <p className="mt-2 text-sm text-[var(--muted)] italic">
            Browse categories, search results, and create or edit names.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => handleOpenEditModal()}
            className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all shadow-lg"
          >
            + Create Category
          </button>
        )}
      </section>

      <section className="rounded-xl border border-[var(--primary)] bg-[var(--primary)] p-5 shadow-lg">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <label htmlFor="category-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90">
              Search by title
            </label>
            <input
              id="category-search"
              type="text"
              className={filterInputClass}
              placeholder="Type a category name…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <table className="w-full text-left text-sm text-[var(--foreground)]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-soft)]/80 text-xs uppercase tracking-widest text-[var(--muted)]">
            <tr>
              <th className="px-6 py-4 font-semibold">Category name</th>
              {canManage && <th className="px-6 py-4 text-right font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-[var(--primary)]/5">
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  {canManage && (
                    <td className="px-6 py-4 text-right space-x-4">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(category)}
                        className="text-sm font-semibold text-[var(--primary)] hover:underline transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryToDelete(category)}
                        className="text-sm font-semibold text-rose-600 hover:text-rose-500 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-10 text-center text-[var(--muted)] italic">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {categoryToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCategoryToDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">Delete category</h3>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                Are you sure you want to delete the category{" "}
                <span className="font-bold text-[var(--foreground)]">"{categoryToDelete.name}"</span>? This cannot be undone.
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 rounded-lg bg-rose-600 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all"
              >
                {isDeleting ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="border-b border-[var(--primary)] bg-[var(--primary)] px-8 py-5">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? "Edit category" : "New category"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
              <div>
                <label htmlFor="category-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Category name
                </label>
                <input
                  id="category-name"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. General knowledge"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--muted)]/55 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all shadow-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

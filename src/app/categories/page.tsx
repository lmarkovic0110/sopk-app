import { getAllCategories } from "@/services/category.service";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Codebook screen with list/search and CRUD actions.
          </p>
        </div>
        <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105">
          Create Category
        </button>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-white p-4 dark:bg-[var(--surface)]">
        <input
          className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25"
          placeholder="Search categories"
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-soft)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-semibold">{category.name}</td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {category.description ?? "No description"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded-md border border-[var(--border)] px-3 py-1 hover:bg-[var(--surface-soft)]">
                      Edit
                    </button>
                    <button className="rounded-md border border-rose-200 px-3 py-1 text-rose-700 hover:bg-rose-50">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

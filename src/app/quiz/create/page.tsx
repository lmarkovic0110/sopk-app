import { listCategories } from "@/repositories/category.repository";
import { listLocations } from "@/repositories/location.repository";
import { QuizForm } from "@/components/QuizForm";

export default async function CreateQuizPage() {
  const categories = await listCategories();
  const locations = await listLocations();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Create New Quiz</h1>
          <p className="mt-2 text-sm text-[var(--muted)] italic">
            Fill in the details to schedule a new quiz event.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
        <div className="border-b border-[var(--primary)] bg-[var(--primary)] px-8 py-5">
          <h2 className="text-xl font-bold text-white">Quiz details</h2>
        </div>
        <div className="px-8 py-8">
          <QuizForm categories={categories} locations={locations} />
        </div>
      </div>
    </main>
  );
}

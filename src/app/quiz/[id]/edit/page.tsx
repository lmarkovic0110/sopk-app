import { notFound } from "next/navigation";
import { listCategories } from "@/repositories/category.repository";
import { listLocations } from "@/repositories/location.repository";
import { getQuizDetails } from "@/services/quiz.service";
import { QuizForm } from "@/components/QuizForm";
import type { DbQuizStatus } from "@/types/quiz";

type EditQuizPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const { id } = await params;
  const quiz = await getQuizDetails(id);
  if (!quiz) {
    notFound();
  }

  const categories = await listCategories();
  const locations = await listLocations();

  const initialQuiz = {
    id: quiz.id,
    title: quiz.title,
    scheduledAt: quiz.scheduledAt,
    categoryId: quiz.categoryId,
    locationId: quiz.locationId ?? "",
    maxTeams: quiz.maxTeams ?? 15,
    entryFeePerMember: quiz.entryFeePerMember ?? 0,
    dbStatus: (quiz.dbStatus ?? "Najavljen") as DbQuizStatus,
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Edit Quiz</h1>
          <p className="mt-2 text-sm text-[var(--muted)] italic">
            Update the event details and save your changes.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
        <div className="border-b border-[var(--primary)] bg-[var(--primary)] px-8 py-5">
          <h2 className="text-xl font-bold text-white">Quiz details</h2>
        </div>
        <div className="px-8 py-8">
          <QuizForm
            mode="edit"
            initialQuiz={initialQuiz}
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            locations={locations}
          />
        </div>
      </div>
    </main>
  );
}

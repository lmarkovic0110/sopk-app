import Link from "next/link";
import { getUpcomingQuizzes } from "@/services/quiz.service";
import RoleSection from "@/components/RoleSection";

export default async function Home() {
  const upcomingQuizzes = await getUpcomingQuizzes(3);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
      <RoleSection />

      <section className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Upcoming Quizzes</h2>
        <Link href="/quiz" className="text-sm font-semibold text-[var(--primary)] hover:underline">
          View all
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {upcomingQuizzes.length === 0 ? (
          <p className="text-sm text-[var(--muted)] md:col-span-3">
            No upcoming quizzes scheduled from now. See the full list for past and future events.
          </p>
        ) : (
          upcomingQuizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="group rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:bg-[var(--surface-soft)] hover:-translate-y-1 dark:bg-[var(--surface)]"
            >
              <span className="inline-flex rounded-full bg-[var(--surface-soft)] px-2 py-1 text-xs font-semibold text-[var(--primary)]">
                {quiz.status}
              </span>
              <h3 className="mt-3 text-lg font-bold group-hover:text-[var(--primary)] transition-colors">
                {quiz.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {new Date(quiz.scheduledAt).toLocaleDateString()}
              </p>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}

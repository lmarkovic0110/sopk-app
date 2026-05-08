import Link from "next/link";
import { getAllQuizzes } from "@/services/quiz.service";

export default async function Home() {
  const quizzes = await getAllQuizzes();
  const upcomingQuizzes = quizzes
    .slice()
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    )
    .slice(0, 3);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
      <section className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)] to-[#2d7a58] p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#ece3d3]">
          Pub Quiz Platform
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
          Discover, host, and join quiz events.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#efe6d8]">
          Browse upcoming events and sign your team up in a few clicks.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--surface)]">
            Create Quiz
          </button>
          <button className="rounded-md border border-white/70 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            Create Location
          </button>
        </div>
      </section>

      <section className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Upcoming Quizzes</h2>
        <Link href="/quiz" className="text-sm font-semibold text-[var(--primary)]">
          View all
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {upcomingQuizzes.map((quiz) => {
          const date = new Date(quiz.scheduledAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          });

          return (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-[var(--surface)]"
            >
              <span className="inline-flex rounded-full bg-[var(--surface-soft)] px-2 py-1 text-xs font-semibold text-[var(--primary)]">
                {quiz.status}
              </span>
              <h3 className="mt-3 text-lg font-bold">{quiz.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{date}</p>
              <p className="mt-4 text-sm">
                Category:{" "}
                <span className="font-semibold">{quiz.categoryName ?? "Unknown"}</span>
              </p>
            </Link>
          );
        })}
      </section>
    </main>
  );
}

import Link from "next/link";
import { getAllQuizzes } from "@/services/quiz.service";

export default async function QuizPage() {
  const quizzes = await getAllQuizzes();
  const categoryNames = [
    ...new Set(
      quizzes
        .map((quiz) => quiz.categoryName)
        .filter((name): name is string => Boolean(name)),
    ),
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Browse events, filter results, and open quiz details.
          </p>
        </div>
        <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105">
          Create Quiz
        </button>
      </section>

      <section className="grid gap-3 rounded-xl border border-[var(--border)] bg-white p-4 md:grid-cols-4 dark:bg-[var(--surface)]">
        <input
          className="rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25"
          placeholder="Search by title"
        />
        <select className="rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25">
          <option>All statuses</option>
          <option>draft</option>
          <option>published</option>
          <option>closed</option>
        </select>
        <select className="rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25">
          <option>All categories</option>
          {categoryNames.map((categoryName) => (
            <option key={categoryName}>{categoryName}</option>
          ))}
        </select>
        <button className="rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--surface-soft)]">
          Reset filters
        </button>
      </section>

      <section className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--surface)]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[var(--surface-soft)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => {
              const date = new Date(quiz.scheduledAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <tr key={quiz.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-semibold">{quiz.title}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{date}</td>
                  <td className="px-4 py-3">{quiz.categoryName ?? "Unknown"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[var(--surface-soft)] px-2 py-1 text-xs font-semibold text-[var(--primary)]">
                      {quiz.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/quiz/${quiz.id}`} className="font-semibold text-[var(--primary)]">
                      Open details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}

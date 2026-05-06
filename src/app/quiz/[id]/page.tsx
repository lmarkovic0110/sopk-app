import { mockCategories, mockQuizzes } from "@/lib/mock-data";

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;
  const quiz = mockQuizzes.find((item) => item.id === id) ?? mockQuizzes[0];
  const category = mockCategories.find((item) => item.id === quiz.categoryId);
  const formattedDate = new Date(quiz.scheduledAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="rounded-2xl border border-[var(--border)] bg-white p-6 dark:bg-[var(--surface)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Quiz ID: {quiz.id}
            </p>
            <h1 className="mt-2 text-3xl font-bold">{quiz.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{formattedDate}</p>
          </div>
          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-sm font-semibold text-[var(--primary)]">
            {quiz.status}
          </span>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Category</p>
            <p className="mt-1 font-semibold">{category?.name ?? "Unknown"}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Location</p>
            <p className="mt-1 font-semibold">Central Pub Hall</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Max teams</p>
            <p className="mt-1 font-semibold">20 teams</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 dark:bg-[var(--surface)]">
          <h2 className="text-xl font-bold">Team Signup</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Sign your team up for this quiz event.
          </p>
          <form className="mt-5 grid gap-3">
            <input
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25"
              placeholder="Team name"
            />
            <input
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25"
              placeholder="Captain email"
            />
            <input
              type="number"
              min={1}
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25"
              placeholder="Number of members"
            />
            <button className="mt-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105">
              Submit signup
            </button>
          </form>
        </div>

        <aside className="rounded-2xl border border-[var(--border)] bg-white p-6 dark:bg-[var(--surface)]">
          <h3 className="text-lg font-bold">Current teams</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-md bg-[var(--surface-soft)] p-3">Quiz Masters (4)</li>
            <li className="rounded-md bg-[var(--surface-soft)] p-3">Brainstormers (3)</li>
            <li className="rounded-md bg-[var(--surface-soft)] p-3">Trivia Ninjas (5)</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}

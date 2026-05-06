import { notFound } from "next/navigation";
import { getQuizDetails } from "@/services/quiz.service";
import { getSignupsForQuiz } from "@/services/signup.service";

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ team?: string; created?: string; error?: string }>;
};

export default async function QuizDetailPage({
  params,
  searchParams,
}: QuizDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const teamFilter = resolvedSearchParams.team?.trim() ?? "";
  const created = resolvedSearchParams.created === "1";
  const errorMessage = resolvedSearchParams.error;
  const quiz = await getQuizDetails(id);
  if (!quiz) {
    notFound();
  }
  const signups = await getSignupsForQuiz(id, teamFilter);
  const totalMembers = signups.reduce((sum, signup) => sum + signup.memberCount, 0);

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
            <p className="mt-1 font-semibold">{quiz.categoryName ?? "Unknown"}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Location</p>
            <p className="mt-1 font-semibold">{quiz.locationName ?? "Unknown"}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Max teams</p>
            <p className="mt-1 font-semibold">{quiz.maxTeams ?? 0} teams</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Entry fee</p>
            <p className="mt-1 font-semibold">
              {quiz.entryFeePerMember?.toFixed(2) ?? "0.00"} EUR per member
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 dark:bg-[var(--surface)]">
          {created ? (
            <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Team signup created successfully.
            </div>
          ) : null}
          {errorMessage ? (
            <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <h2 className="text-xl font-bold">Add Signup</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Create a new team and register it for this quiz.
          </p>

          <form className="mt-5 grid gap-3 md:grid-cols-2" method="POST" action="/api/signup">
            <input type="hidden" name="quizId" value={id} />
            <input
              name="teamName"
              required
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25 md:col-span-2"
              placeholder="Team name"
            />
            <input
              name="captainId"
              type="number"
              required
              min={1}
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25"
              placeholder="Captain player ID (e.g. 1)"
            />
            <input
              name="memberCount"
              type="number"
              required
              min={1}
              className="rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25"
              placeholder="Number of members"
            />
            <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105 md:col-span-2">
              Create team and signup
            </button>
          </form>

          <div className="my-6 border-t border-[var(--border)]" />

          <h2 className="text-xl font-bold">Team Signups</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Detail list for this quiz event (master-detail).
          </p>

          <form className="mt-5 flex flex-wrap gap-3" method="GET">
            <input
              name="team"
              defaultValue={teamFilter}
              className="min-w-[220px] flex-1 rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25"
              placeholder="Search by team name"
            />
            <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105">
              Search
            </button>
          </form>

          <div className="mt-5 overflow-hidden rounded-lg border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-soft)] text-xs uppercase tracking-wide text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Members</th>
                  <th className="px-4 py-3">Signup time</th>
                </tr>
              </thead>
              <tbody>
                {signups.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-[var(--muted)]">
                      No signups found for this filter.
                    </td>
                  </tr>
                ) : (
                  signups.map((signup) => (
                    <tr key={signup.id} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3 font-semibold">{signup.teamName}</td>
                      <td className="px-4 py-3">{signup.memberCount}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {new Date(signup.signupTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-2xl border border-[var(--border)] bg-white p-6 dark:bg-[var(--surface)]">
          <h3 className="text-lg font-bold">Summary</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-md bg-[var(--surface-soft)] p-3">
              Registered teams: <span className="font-semibold">{signups.length}</span>
            </li>
            <li className="rounded-md bg-[var(--surface-soft)] p-3">
              Total participants: <span className="font-semibold">{totalMembers}</span>
            </li>
            <li className="rounded-md bg-[var(--surface-soft)] p-3">
              Remaining slots:{" "}
              <span className="font-semibold">
                {Math.max((quiz.maxTeams ?? 0) - signups.length, 0)}
              </span>
            </li>
          </ul>
        </aside>
      </section>
    </main>
  );
}

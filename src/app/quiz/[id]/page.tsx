import { notFound } from "next/navigation";
import { getQuizDetails } from "@/services/quiz.service";
import { getSignupsForQuiz } from "@/services/signup.service";
import SignupForm from "@/components/SignupForm";
import QuizManageActions from "@/components/QuizManageActions";

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
  const errorCode = resolvedSearchParams.error?.trim();
  const signupErrorBanner =
    errorCode === "invalid_members"
      ? "Some player IDs are not registered in the system."
      : errorCode === "duplicate_roster"
        ? "The same player ID cannot appear more than once on this team."
        : errorCode === "duplicate_quiz_player"
          ? "One or more players are already on another team for this quiz."
          : errorCode === "db_error"
            ? "Something went wrong while saving the signup. Please try again."
            : errorCode
              ? errorCode
              : null;

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
      {/* Quiz Header Info */}
      <section className="rounded-2xl border border-[var(--border)] bg-white p-6 dark:bg-[var(--surface)] shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Quiz ID: {quiz.id}
            </p>
            <h1 className="mt-2 text-3xl font-bold">{quiz.title}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{formattedDate}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-sm font-semibold text-[var(--primary)] border border-[var(--primary)]/10">
              {quiz.status}
            </span>
            <QuizManageActions quizId={quiz.id} />
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Category</p>
            <p className="mt-1 font-semibold">{quiz.categoryName ?? "Unknown"}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Location</p>
            <p className="mt-1 font-semibold">{quiz.locationName ?? "Unknown"}</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Max teams</p>
            <p className="mt-1 font-semibold">{quiz.maxTeams ?? 0} teams</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--surface-soft)]/30">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Entry fee</p>
            <p className="mt-1 font-semibold">
              {quiz.entryFeePerMember?.toFixed(2) ?? "0.00"} EUR <span className="text-[10px] text-[var(--muted)]">/ member</span>
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 dark:bg-[var(--surface)] shadow-sm">
          {/* Status Messages */}
          {created && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
              <span className="text-lg">✓</span> Team and members registered successfully.
            </div>
          )}
          {signupErrorBanner && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
              <span className="text-lg">✕</span> {signupErrorBanner}
            </div>
          )}

          <h2 className="text-xl font-bold">Add Signup</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Register a team and its members. Use player IDs for each member.
          </p>

          <SignupForm quizId={id} />

          <div className="my-8 border-t border-[var(--border)]" />

          {/* Team Signups List */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Team Signups</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">List of teams currently registered for this event.</p>
            </div>
          </div>

          <form className="mt-5 flex flex-wrap gap-3" method="GET">
            <input
              name="team"
              defaultValue={teamFilter}
              className="min-w-[220px] flex-1 rounded-md border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/25 bg-[var(--surface-soft)]"
              placeholder="Search by team name..."
            />
            <button className="rounded-md bg-[var(--primary)] px-6 py-2 text-sm font-semibold text-white hover:brightness-105 transition-all">
              Search
            </button>
          </form>

          <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-soft)] text-xs uppercase tracking-wide text-[var(--muted)]">
                <tr>
                  <th className="px-6 py-4 font-bold">Team Name</th>
                  <th className="px-6 py-4 font-bold text-center">Members</th>
                  <th className="px-6 py-4 font-bold text-right">Signup Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {signups.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-[var(--muted)] italic">
                      No signups found matching your search.
                    </td>
                  </tr>
                ) : (
                  signups.map((signup) => (
                    <tr key={signup.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[var(--foreground)]">{signup.teamName}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {signup.memberCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--muted)]">
                        {new Date(signup.signupTime).toLocaleString("en-GB", {
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

        {/* Sidebar Summary */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 dark:bg-[var(--surface)] shadow-sm">
            <h3 className="text-lg font-bold border-b pb-3 mb-4">Live Summary</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between items-center rounded-lg bg-[var(--surface-soft)]/50 p-3">
                <span className="text-[var(--muted)]">Registered teams</span>
                <span className="font-bold text-lg">{signups.length}</span>
              </li>
              <li className="flex justify-between items-center rounded-lg bg-[var(--surface-soft)]/50 p-3">
                <span className="text-[var(--muted)]">Total participants</span>
                <span className="font-bold text-lg">{totalMembers}</span>
              </li>
              <li className="flex justify-between items-center rounded-lg bg-[var(--surface-soft)]/50 p-3">
                <span className="text-[var(--muted)]">Remaining slots</span>
                <span className={`font-bold text-lg ${(quiz.maxTeams ?? 0) - signups.length <= 3 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {Math.max((quiz.maxTeams ?? 0) - signups.length, 0)}
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}

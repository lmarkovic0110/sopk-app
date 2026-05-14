"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteQuizAction } from "@/app/actions/quiz.actions";

export default function QuizManageActions({ quizId }: { quizId: string }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const roles: string[] = (user?.["http://localhost:3000/roles"] as string[]) || [];
  const canManage = roles.some((role) => ["Admin", "Organizator"].includes(role));

  if (isLoading || !canManage) return null;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    setDeleting(true);
    const res = await deleteQuizAction(quizId);
    setDeleting(false);
    if (res.success) {
      router.push("/quiz");
      router.refresh();
    } else {
      alert(res.error ?? "Delete failed.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/quiz/${quizId}/edit`}
        className="rounded-md border border-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={deleting}
        onClick={handleDelete}
        className="rounded-md border border-rose-600/40 bg-rose-600/10 px-3 py-1.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-600/20 disabled:opacity-50"
      >
        {deleting ? "…" : "Delete"}
      </button>
    </div>
  );
}

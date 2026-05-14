"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeamAndSignupAction(formData: FormData) {
  const quizId = formData.get("quizId") as string;
  const teamName = formData.get("teamName") as string;
  const captainId = formData.get("captainId") as string;
  const memberIds = (formData.getAll("memberIds") as string[]).filter(id => id.trim() !== "");

  const allIdsToCheck = [captainId, ...memberIds];
  const numericIds = allIdsToCheck.map((id) => Number.parseInt(String(id).trim(), 10));

  if (numericIds.some((n) => !Number.isFinite(n))) {
    return redirect(`/quiz/${quizId}?error=invalid_members`);
  }

  if (new Set(numericIds).size !== numericIds.length) {
    return redirect(`/quiz/${quizId}?error=duplicate_roster`);
  }

  try {
    // 1. Verify all player IDs exist in igrac
    const playersRes = await db.query(
      `SELECT id_korisnik FROM igrac WHERE id_korisnik = ANY($1::int[])`,
      [numericIds]
    );

    const foundIds = new Set(playersRes.rows.map((r) => Number(r.id_korisnik)));
    if (numericIds.some((id) => !foundIds.has(id))) {
      return redirect(`/quiz/${quizId}?error=invalid_members`);
    }

    // 2. No player may already be on another team for this quiz (clantima.id_igrac stores igrac id)
    const conflictRes = await db.query<{ exists: boolean }>(
      `SELECT EXISTS (
        SELECT 1
        FROM prijava p
        INNER JOIN clantima ct ON ct.id_tim = p.id_tim
        WHERE p.id_kviz = $1
          AND ct.id_igrac = ANY($2::int[])
      ) AS exists`,
      [Number(quizId), numericIds]
    );

    if (conflictRes.rows[0]?.exists) {
      return redirect(`/quiz/${quizId}?error=duplicate_quiz_player`);
    }

    await db.query("BEGIN");

    const teamRes = await db.query(
      `INSERT INTO Tim (naziv_tima, id_kapetan) VALUES ($1, $2) RETURNING id_tim`,
      [teamName, captainId]
    );
    const idTim = teamRes.rows[0].id_tim;

    for (const pId of allIdsToCheck) {
      await db.query(
        `INSERT INTO ClanTima (id_tim, id_igrac) VALUES ($1, $2)`,
        [idTim, pId]
      );
    }

    await db.query(
      `INSERT INTO Prijava (id_kviz, id_tim, broj_clanova) VALUES ($1, $2, $3)`,
      [quizId, idTim, allIdsToCheck.length]
    );

    await db.query("COMMIT");

  } catch (error: any) {
    await db.query("ROLLBACK");
    console.error("Signup Error:", error);
    // If this is already a Next.js redirect, rethrow
    if (error.digest?.includes('NEXT_REDIRECT')) throw error;
    return redirect(`/quiz/${quizId}?error=db_error`);
  }

  revalidatePath(`/quiz/${quizId}`);
  return redirect(`/quiz/${quizId}?created=1`);
}

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

  try {
    // 1. Provjera postoje li svi igrači
    const playersRes = await db.query(
      `SELECT id_igrac FROM Igrac WHERE id_igrac = ANY($1::int[])`,
      [allIdsToCheck.map(id => parseInt(id))]
    );

    const foundIds = playersRes.rows.map(r => r.id_igrac.toString());
    const missingIds = allIdsToCheck.filter(id => !foundIds.includes(id));

    if (missingIds.length > 0) {
      return redirect(`/quiz/${quizId}?error=invalid_members`);
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
    // Ako je greška već redirect, samo je pusti (Next.js redirecti bacaju interni error)
    if (error.digest?.includes('NEXT_REDIRECT')) throw error;
    return redirect(`/quiz/${quizId}?error=db_error`);
  }

  revalidatePath(`/quiz/${quizId}`);
  return redirect(`/quiz/${quizId}?created=1`);
}

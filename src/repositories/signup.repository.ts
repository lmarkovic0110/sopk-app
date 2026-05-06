import { db } from "@/lib/db";
import type { CreateSignupRequest } from "@/types/signup";
import type { Signup } from "@/types/signup";

export async function listSignupsByQuizId(
  quizId: string,
  teamSearch = "",
): Promise<Signup[]> {
  const query = `
    SELECT
      p.id_prijava,
      p.id_kviz,
      p.id_tim,
      p.vrijeme_prijave,
      p.broj_clanova,
      t.naziv_tima
    FROM prijava p
    INNER JOIN tim t ON t.id_tim = p.id_tim
    WHERE p.id_kviz = $1
      AND ($2 = '' OR LOWER(t.naziv_tima) LIKE '%' || LOWER($2) || '%')
    ORDER BY p.vrijeme_prijave DESC
  `;

  const { rows } = await db.query<{
    id_prijava: number;
    id_kviz: number;
    id_tim: number;
    vrijeme_prijave: string | Date;
    broj_clanova: number;
    naziv_tima: string;
  }>(query, [Number(quizId), teamSearch.trim()]);

  return rows.map((row) => ({
    id: String(row.id_prijava),
    quizId: String(row.id_kviz),
    teamId: String(row.id_tim),
    teamName: row.naziv_tima,
    memberCount: row.broj_clanova,
    signupTime: new Date(row.vrijeme_prijave).toISOString(),
  }));
}

export async function createSignupWithTeam(input: CreateSignupRequest): Promise<Signup> {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const limitResult = await client.query<{ max_timova: number }>(
      "SELECT max_timova FROM kvizevent WHERE id_kviz = $1",
      [Number(input.quizId)],
    );
    const quizRow = limitResult.rows[0];
    if (!quizRow) {
      throw new Error("Quiz not found.");
    }

    const countResult = await client.query<{ signup_count: string }>(
      "SELECT COUNT(*)::text AS signup_count FROM prijava WHERE id_kviz = $1",
      [Number(input.quizId)],
    );
    const signupCount = Number(countResult.rows[0]?.signup_count ?? 0);
    if (signupCount >= quizRow.max_timova) {
      throw new Error("Quiz has reached max team capacity.");
    }

    const teamResult = await client.query<{ id_tim: number }>(
      "INSERT INTO tim (naziv_tima, id_kapetan) VALUES ($1, $2) RETURNING id_tim",
      [input.teamName.trim(), input.captainId],
    );
    const teamId = teamResult.rows[0]?.id_tim;
    if (!teamId) {
      throw new Error("Failed to create team.");
    }

    const signupResult = await client.query<{
      id_prijava: number;
      id_kviz: number;
      id_tim: number;
      vrijeme_prijave: string | Date;
      broj_clanova: number;
    }>(
      `
      INSERT INTO prijava (id_kviz, id_tim, broj_clanova)
      VALUES ($1, $2, $3)
      RETURNING id_prijava, id_kviz, id_tim, vrijeme_prijave, broj_clanova
      `,
      [Number(input.quizId), teamId, input.memberCount],
    );

    await client.query("COMMIT");

    const row = signupResult.rows[0];
    return {
      id: String(row.id_prijava),
      quizId: String(row.id_kviz),
      teamId: String(row.id_tim),
      teamName: input.teamName.trim(),
      memberCount: row.broj_clanova,
      signupTime: new Date(row.vrijeme_prijave).toISOString(),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

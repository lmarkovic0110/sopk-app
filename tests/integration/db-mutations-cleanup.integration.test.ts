import { db } from "@/lib/db";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

(hasDatabaseUrl ? describe : describe.skip)(
  "Integration write and delete",
  () => {
    function uniqueLabel(prefix: string) {
      return `${prefix}__jest_${process.pid}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    async function deleteCategoryById(categoryId: number) {
      await db.query(`DELETE FROM kategorija WHERE id_kategorija = $1`, [categoryId]);
    }

    async function purgeQuizAndOptionalTeam(quizId: number, teamId?: number) {
      await db.query(`DELETE FROM prijava WHERE id_kviz = $1`, [quizId]);
      if (teamId != null) {
        await db.query(`DELETE FROM tim WHERE id_tim = $1`, [teamId]);
      }
      await db.query(`DELETE FROM kvizevent WHERE id_kviz = $1`, [quizId]);
    }

    it("inserted category shows in list then gets deleted", async () => {
      const name = uniqueLabel("cat");
      const insert = await db.query<{ id_kategorija: number }>(
        `INSERT INTO kategorija (naziv_kategorije) VALUES ($1) RETURNING id_kategorija`,
        [name],
      );
      const categoryId = insert.rows[0]!.id_kategorija;
      try {
        const { listCategories } = await import("@/repositories/category.repository");
        const categories = await listCategories();
        const hit = categories.find((c) => c.id === String(categoryId));
        expect(hit?.name).toBe(name);
      } finally {
        await deleteCategoryById(categoryId);
      }
    });

    it("created quiz shows on API then gets deleted", async () => {
      const loc = await db.query<{ id_lokacija: number }>(
        `SELECT id_lokacija FROM lokacija ORDER BY id_lokacija ASC LIMIT 1`,
      );
      expect(loc.rows.length).toBeGreaterThan(0);
      const locationId = loc.rows[0]!.id_lokacija;

      const catName = uniqueLabel("cat");
      const catIns = await db.query<{ id_kategorija: number }>(
        `INSERT INTO kategorija (naziv_kategorije) VALUES ($1) RETURNING id_kategorija`,
        [catName],
      );
      const categoryId = catIns.rows[0]!.id_kategorija;

      const title = uniqueLabel("Quiz");
      let quizId: number | null = null;
      try {
        const { createQuiz } = await import("@/repositories/quiz.repository");
        const created = await createQuiz({
          title,
          scheduledAt: "2030-06-15T18:00:00.000Z",
          categoryId: String(categoryId),
          locationId: String(locationId),
          status: "Najavljen",
          maxTeams: 20,
          entryFee: 0,
        });
        quizId = Number(created.id);

        const { GET } = await import("@/app/api/quiz/route");
        const response = await GET();
        expect(response.status).toBe(200);
        const body = (await response.json()) as { success: boolean; data?: { id: string; title: string }[] };
        expect(body.success).toBe(true);
        const found = body.data?.find((q) => q.id === String(quizId) && q.title === title);
        expect(found).toBeDefined();
      } finally {
        if (quizId != null) {
          await purgeQuizAndOptionalTeam(quizId);
        }
        await deleteCategoryById(categoryId);
      }
    });

    it("team signup saves and shows in list then gets deleted", async () => {
      const player = await db.query<{ id_korisnik: number }>(
        `SELECT id_korisnik FROM igrac ORDER BY id_korisnik ASC LIMIT 1`,
      );
      if (player.rows.length === 0) {
        throw new Error("Integration signup test needs at least one row in igrac (seed DB).");
      }
      const captainId = player.rows[0]!.id_korisnik;

      const loc = await db.query<{ id_lokacija: number }>(
        `SELECT id_lokacija FROM lokacija ORDER BY id_lokacija ASC LIMIT 1`,
      );
      expect(loc.rows.length).toBeGreaterThan(0);
      const locationId = loc.rows[0]!.id_lokacija;

      const catName = uniqueLabel("cat");
      const catIns = await db.query<{ id_kategorija: number }>(
        `INSERT INTO kategorija (naziv_kategorije) VALUES ($1) RETURNING id_kategorija`,
        [catName],
      );
      const categoryId = catIns.rows[0]!.id_kategorija;

      const title = uniqueLabel("SignupQuiz");
      let quizId: number | null = null;
      let teamId: string | null = null;

      try {
        const { createQuiz } = await import("@/repositories/quiz.repository");
        const created = await createQuiz({
          title,
          scheduledAt: "2030-07-01T19:00:00.000Z",
          categoryId: String(categoryId),
          locationId: String(locationId),
          status: "Najavljen",
          maxTeams: 50,
          entryFee: 1,
        });
        quizId = Number(created.id);

        const { createSignup } = await import("@/services/signup.service");
        const teamName = uniqueLabel("Team");
        const signup = await createSignup({
          quizId: String(quizId),
          teamName,
          captainId,
          memberCount: 3,
        });
        teamId = signup.teamId;

        const { listSignupsByQuizId } = await import("@/repositories/signup.repository");
        const rows = await listSignupsByQuizId(String(quizId), "");
        expect(rows.some((s) => s.teamName === teamName && s.memberCount === 3)).toBe(true);
      } finally {
        if (quizId != null) {
          await purgeQuizAndOptionalTeam(quizId, teamId != null ? Number(teamId) : undefined);
        }
        await deleteCategoryById(categoryId);
      }
    });
  },
);

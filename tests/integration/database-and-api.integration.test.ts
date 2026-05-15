/**
 * @jest-environment node
 */

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

(hasDatabaseUrl ? describe : describe.skip)(
  "Integration read from database",
  () => {
    it("GET /api/quiz returns 200 and quiz list", async () => {
      const { GET } = await import("@/app/api/quiz/route");
      const response = await GET();
      expect(response.status).toBe(200);
      const body = (await response.json()) as {
        success: boolean;
        data?: unknown;
        message?: string;
      };
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });

    it("listCategories returns categories from database", async () => {
      const { listCategories } = await import("@/repositories/category.repository");
      const categories = await listCategories();
      expect(Array.isArray(categories)).toBe(true);
      for (const category of categories) {
        expect(category).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
        });
      }
    });

    it("getQuizById returns null for missing id", async () => {
      const { getQuizById } = await import("@/repositories/quiz.repository");
      const quiz = await getQuizById("999999999");
      expect(quiz).toBeNull();
    });
  },
);

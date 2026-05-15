import { listQuizzes } from "@/repositories/quiz.repository";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({
  db: {
    query: jest.fn(),
  },
}));

const mockedQuery = db.query as jest.Mock;

describe("quiz.repository", () => {
  beforeEach(() => {
    mockedQuery.mockReset();
  });

  it("Najavljen becomes draft", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          id_kviz: 1,
          naziv: "Trivia Night",
          datum_odrzavanja: "2026-05-20T19:00:00.000Z",
          trenutni_status: "Najavljen",
          max_timova: 10,
          kotizacija_po_clanu: "5",
          id_kategorija: 1,
          naziv_kategorije: "General",
          naziv_objekta: "Hall A",
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    });

    const quizzes = await listQuizzes();
    expect(quizzes[0].status).toBe("draft");
    expect(quizzes[0].title).toBe("Trivia Night");
    expect(quizzes[0].entryFeePerMember).toBe(5);
  });

  it("U tijeku becomes published", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          id_kviz: 2,
          naziv: "Live Quiz",
          datum_odrzavanja: "2026-05-21T19:00:00.000Z",
          trenutni_status: "U tijeku",
          max_timova: 8,
          kotizacija_po_clanu: 10,
          id_kategorija: null,
          naziv_kategorije: null,
          naziv_objekta: null,
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    });

    const quizzes = await listQuizzes();
    expect(quizzes[0].status).toBe("published");
    expect(quizzes[0].categoryId).toBe("");
  });
});

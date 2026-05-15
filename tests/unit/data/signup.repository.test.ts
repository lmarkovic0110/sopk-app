import { listSignupsByQuizId } from "@/repositories/signup.repository";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({
  db: {
    query: jest.fn(),
  },
}));

const mockedQuery = db.query as jest.Mock;

describe("signup.repository", () => {
  beforeEach(() => {
    mockedQuery.mockReset();
  });

  it("sends quiz id and trimmed search to SQL", async () => {
    mockedQuery.mockResolvedValue({
      rows: [],
      command: "SELECT",
      rowCount: 0,
      oid: 0,
      fields: [],
    });

    await listSignupsByQuizId("42", "  alpha  ");

    expect(mockedQuery).toHaveBeenCalledTimes(1);
    const [, params] = mockedQuery.mock.calls[0];
    expect(params).toEqual([42, "alpha"]);
  });

  it("turns join into Signup object", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          id_prijava: 9,
          id_kviz: 1,
          id_tim: 3,
          vrijeme_prijave: "2026-05-01T12:00:00.000Z",
          broj_clanova: 4,
          naziv_tima: "Winners",
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    });

    const signups = await listSignupsByQuizId("1", "");
    expect(signups).toHaveLength(1);
    expect(signups[0].id).toBe("9");
    expect(signups[0].teamName).toBe("Winners");
    expect(signups[0].memberCount).toBe(4);
  });
});

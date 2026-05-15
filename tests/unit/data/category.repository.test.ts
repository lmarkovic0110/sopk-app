import { listCategories } from "@/repositories/category.repository";
import { db } from "@/lib/db";

jest.mock("@/lib/db", () => ({
  db: {
    query: jest.fn(),
  },
}));

/** `Pool#query` overloads + `jest.MockedFunction` infer `never` for mockResolvedValue; use plain `jest.Mock`. */
const mockedQuery = db.query as jest.Mock;

describe("category.repository", () => {
  beforeEach(() => {
    mockedQuery.mockReset();
  });

  it("turns DB row into Category", async () => {
    mockedQuery.mockResolvedValue({
      rows: [{ id_kategorija: 2, naziv_kategorije: "History" }],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    });

    const categories = await listCategories();

    expect(categories).toHaveLength(1);
    expect(categories[0].id).toBe("2");
    expect(categories[0].name).toBe("History");
    expect(typeof categories[0].createdAt).toBe("string");
  });

  it("returns empty array when no rows", async () => {
    mockedQuery.mockResolvedValue({
      rows: [],
      command: "SELECT",
      rowCount: 0,
      oid: 0,
      fields: [],
    });

    const categories = await listCategories();
    expect(categories).toEqual([]);
  });
});

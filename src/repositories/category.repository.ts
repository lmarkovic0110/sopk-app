import { db } from "@/lib/db";
import type { Category } from "@/types/category";

export async function listCategories(): Promise<Category[]> {
  const query = `
    SELECT
      id_kategorija,
      naziv_kategorije
    FROM kategorija
    ORDER BY naziv_kategorije ASC
  `;

  const { rows } = await db.query<{
    id_kategorija: number;
    naziv_kategorije: string;
  }>(query);

  const now = new Date().toISOString();

  return rows.map((row) => ({
    id: String(row.id_kategorija),
    name: row.naziv_kategorije,
    description: undefined,
    createdAt: now,
    updatedAt: now,
  }));
}

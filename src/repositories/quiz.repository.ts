import { db } from "@/lib/db";
import type { CreateQuizRequest, Quiz } from "@/types/quiz";

type DbQuizStatus = "Najavljen" | "Popunjen" | "U tijeku" | "Završen" | "Otkazan";

function mapDbStatusToQuizStatus(status: DbQuizStatus): Quiz["status"] {
  switch (status) {
    case "Najavljen":
      return "draft";
    case "U tijeku":
      return "published";
    case "Popunjen":
    case "Završen":
    case "Otkazan":
      return "closed";
    default:
      return "draft";
  }
}

export async function listQuizzes(): Promise<Quiz[]> {
  const query = `
    SELECT
      kv.id_kviz,
      kv.naziv,
      kv.datum_odrzavanja,
      kv.trenutni_status,
      kv.max_timova,
      kv.kotizacija_po_clanu,
      kv.id_kategorija,
      k.naziv_kategorije,
      l.naziv_objekta
    FROM kvizevent kv
    LEFT JOIN kategorija k ON k.id_kategorija = kv.id_kategorija
    LEFT JOIN lokacija l ON l.id_lokacija = kv.id_lokacija
    ORDER BY kv.datum_odrzavanja DESC
  `;

  const { rows } = await db.query<{
    id_kviz: number;
    naziv: string;
    datum_odrzavanja: string | Date;
    trenutni_status: DbQuizStatus;
    max_timova: number;
    kotizacija_po_clanu: string | number;
    id_kategorija: number | null;
    naziv_kategorije: string | null;
    naziv_objekta: string | null;
  }>(query);

  return rows.map((row) => {
    const timestamp = new Date(row.datum_odrzavanja).toISOString();

    return {
      id: String(row.id_kviz),
      title: row.naziv,
      scheduledAt: timestamp,
      categoryId: row.id_kategorija ? String(row.id_kategorija) : "",
      categoryName: row.naziv_kategorije ?? undefined,
      locationName: row.naziv_objekta ?? undefined,
      maxTeams: row.max_timova,
      entryFeePerMember: Number(row.kotizacija_po_clanu),
      status: mapDbStatusToQuizStatus(row.trenutni_status),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  const query = `
    SELECT
      kv.id_kviz,
      kv.naziv,
      kv.datum_odrzavanja,
      kv.trenutni_status,
      kv.max_timova,
      kv.kotizacija_po_clanu,
      kv.id_kategorija,
      k.naziv_kategorije,
      l.naziv_objekta
    FROM kvizevent kv
    LEFT JOIN kategorija k ON k.id_kategorija = kv.id_kategorija
    LEFT JOIN lokacija l ON l.id_lokacija = kv.id_lokacija
    WHERE kv.id_kviz = $1
    LIMIT 1
  `;

  const { rows } = await db.query<{
    id_kviz: number;
    naziv: string;
    datum_odrzavanja: string | Date;
    trenutni_status: DbQuizStatus;
    max_timova: number;
    kotizacija_po_clanu: string | number;
    id_kategorija: number | null;
    naziv_kategorije: string | null;
    naziv_objekta: string | null;
  }>(query, [Number(id)]);

  const row = rows[0];
  if (!row) return null;

  const timestamp = new Date(row.datum_odrzavanja).toISOString();

  return {
    id: String(row.id_kviz),
    title: row.naziv,
    scheduledAt: timestamp,
    categoryId: row.id_kategorija ? String(row.id_kategorija) : "",
    categoryName: row.naziv_kategorije ?? undefined,
    locationName: row.naziv_objekta ?? undefined,
    maxTeams: row.max_timova,
    entryFeePerMember: Number(row.kotizacija_po_clanu),
    status: mapDbStatusToQuizStatus(row.trenutni_status),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function createQuiz(input: any): Promise<Quiz> {
  const query = `
    INSERT INTO kvizevent (
      naziv,
      opis,
      datum_odrzavanja,
      id_kategorija,
      id_lokacija,
      trenutni_status,
      max_timova,
      kotizacija_po_clanu
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id_kviz
  `;

  const { rows } = await db.query<{ id_kviz: number }>(query, [
    input.title,
    input.description || null,
    input.scheduledAt,
    Number(input.categoryId),
    Number(input.locationId),
    input.status || "Najavljen",
    Number(input.maxTeams) || 15,
    Number(input.entryFee) || 0
  ]);

  const newId = rows[0].id_kviz;

  return {
    id: String(newId),
    title: input.title,
    scheduledAt: input.scheduledAt,
    categoryId: input.categoryId,
    status: mapDbStatusToQuizStatus(input.status as DbQuizStatus || "Najavljen"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateQuizRepo(id: string, input: any): Promise<void> {
  const query = `
    UPDATE kvizevent
    SET
      naziv = $1,
      opis = $2,
      datum_odrzavanja = $3,
      id_kategorija = $4,
      id_lokacija = $5,
      trenutni_status = $6,
      max_timova = $7,
      kotizacija_po_clanu = $8
    WHERE id_kviz = $9
  `;
  await db.query(query, [
    input.title,
    input.description || null,
    input.scheduledAt,
    Number(input.categoryId),
    Number(input.locationId),
    input.status,
    Number(input.maxTeams),
    Number(input.entryFee),
    Number(id)
  ]);
}

export async function deleteQuizRepo(id: string): Promise<void> {
  await db.query(`DELETE FROM kvizevent WHERE id_kviz = $1`, [Number(id)]);
}

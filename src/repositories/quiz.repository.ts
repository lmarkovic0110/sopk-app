import { db } from "@/lib/db";
import type { CreateQuizRequest, DbQuizStatus, Quiz } from "@/types/quiz";

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

type QuizListRow = {
  id_kviz: number;
  naziv: string;
  datum_odrzavanja: string | Date;
  trenutni_status: DbQuizStatus;
  max_timova: number;
  kotizacija_po_clanu: string | number;
  id_kategorija: number | null;
  naziv_kategorije: string | null;
  naziv_objekta: string | null;
};

function mapListRowToQuiz(row: QuizListRow): Quiz {
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

const quizListSelect = `
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
`;

export async function listQuizzes(): Promise<Quiz[]> {
  const query = `${quizListSelect}
    ORDER BY kv.datum_odrzavanja DESC
  `;

  const { rows } = await db.query<QuizListRow>(query);

  return rows.map(mapListRowToQuiz);
}

/** Quizzes with `datum_odrzavanja` at or after DB server time, soonest first. */
export async function listUpcomingQuizzes(limit: number): Promise<Quiz[]> {
  const query = `${quizListSelect}
    WHERE kv.datum_odrzavanja >= NOW()
    ORDER BY kv.datum_odrzavanja ASC
    LIMIT $1
  `;

  const { rows } = await db.query<QuizListRow>(query, [limit]);

  return rows.map(mapListRowToQuiz);
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
      kv.id_lokacija,
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
    id_lokacija: number | null;
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
    locationId: row.id_lokacija != null ? String(row.id_lokacija) : "",
    locationName: row.naziv_objekta ?? undefined,
    maxTeams: row.max_timova,
    entryFeePerMember: Number(row.kotizacija_po_clanu),
    status: mapDbStatusToQuizStatus(row.trenutni_status),
    dbStatus: row.trenutni_status,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function createQuiz(input: any): Promise<Quiz> {
  const query = `
    INSERT INTO kvizevent (
      naziv,
      datum_odrzavanja,
      id_kategorija,
      id_lokacija,
      trenutni_status,
      max_timova,
      kotizacija_po_clanu
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id_kviz
  `;

  const { rows } = await db.query<{ id_kviz: number }>(query, [
    input.title,
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
      datum_odrzavanja = $2,
      id_kategorija = $3,
      id_lokacija = $4,
      trenutni_status = $5,
      max_timova = $6,
      kotizacija_po_clanu = $7
    WHERE id_kviz = $8
  `;
  await db.query(query, [
    input.title,
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

/** Updates only category and location FKs (master-detail header on quiz detail page). */
export async function updateQuizCategoryAndLocation(
  quizId: string,
  categoryId: string,
  locationId: string,
): Promise<void> {
  await db.query(
    `UPDATE kvizevent SET id_kategorija = $1, id_lokacija = $2 WHERE id_kviz = $3`,
    [Number(categoryId), Number(locationId), Number(quizId)],
  );
}

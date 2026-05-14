import { db } from "@/lib/db";

export type PlayerSelectOption = {
  id: string;
  label: string;
};

/**
 * Registered players (`igrac`) with a display label for signup `<select>` lists.
 */
export async function listPlayersForSelect(): Promise<PlayerSelectOption[]> {
  const query = `
    SELECT
      i.id_korisnik,
      k.ime,
      k.prezime,
      k.email
    FROM igrac i
    INNER JOIN korisnik k ON k.id_korisnik = i.id_korisnik
    ORDER BY k.prezime ASC NULLS LAST, k.ime ASC NULLS LAST, i.id_korisnik ASC
  `;

  const { rows } = await db.query<{
    id_korisnik: number;
    ime: string | null;
    prezime: string | null;
    email: string | null;
  }>(query);

  return rows.map((r) => {
    const name = [r.ime, r.prezime].filter(Boolean).join(" ").trim();
    const label = name || r.email || `Player #${r.id_korisnik}`;
    return { id: String(r.id_korisnik), label };
  });
}

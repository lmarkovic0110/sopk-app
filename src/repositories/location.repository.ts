import { db } from "@/lib/db";

export async function listLocations() {
  const query = `SELECT id_lokacija as id, naziv_objekta as name FROM lokacija ORDER BY naziv_objekta ASC`;
  const { rows } = await db.query<{ id: number; name: string }>(query);
  return rows.map(r => ({ id: String(r.id), name: r.name }));
}


export async function createLocation(data: { name: string, address: string, capacity: number, ownerId: number }) {
  const query = `
    INSERT INTO Lokacija (naziv_objekta, adresa, kapacitet_stolova, id_ugostitelj)
    VALUES ($1, $2, $3, $4)
    RETURNING id_lokacija
  `;
  const { rows } = await db.query(query, [
    data.name,
    data.address,
    data.capacity,
    data.ownerId
  ]);
  return rows[0];
}

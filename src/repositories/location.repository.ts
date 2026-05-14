import { db } from "@/lib/db";

export type LocationListItem = {
  id: string;
  name: string;
  /** `lokacija.kapacitet_stolova` — max quiz teams at this venue must not exceed this. */
  tableCapacity: number;
};

export async function listLocations(): Promise<LocationListItem[]> {
  const query = `
    SELECT id_lokacija as id, naziv_objekta as name, kapacitet_stolova as table_capacity
    FROM lokacija
    ORDER BY naziv_objekta ASC
  `;
  const { rows } = await db.query<{ id: number; name: string; table_capacity: string | number }>(query);
  return rows.map((r) => ({
    id: String(r.id),
    name: r.name,
    tableCapacity: Number(r.table_capacity),
  }));
}

export async function getLocationTableCapacityById(locationId: string): Promise<number | null> {
  const { rows } = await db.query<{ kapacitet_stolova: string | number }>(
    `SELECT kapacitet_stolova FROM lokacija WHERE id_lokacija = $1 LIMIT 1`,
    [Number(locationId)]
  );
  const row = rows[0];
  if (!row) return null;
  const n = Number(row.kapacitet_stolova);
  return Number.isFinite(n) ? n : null;
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

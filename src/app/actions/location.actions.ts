"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createLocationAction(data: {
  name: string,
  address: string,
  capacity: string,
  email: string,
  firstName: string,
  lastName: string
}) {
  try {
    if (!data.email) return { success: false, error: "Email is required." };

    // 1. Sinkronizacija korisnika
    let userResult = await db.query(`SELECT id_korisnik FROM Korisnik WHERE email = $1`, [data.email]);
    let userId;

    if (userResult.rows.length === 0) {
      const newUser = await db.query(
        `INSERT INTO Korisnik (ime, prezime, email, lozinka)
         VALUES ($1, $2, $3, $4) RETURNING id_korisnik`,
        [data.firstName || "Unknown", data.lastName || "User", data.email, "OAUTH_USER"]
      );
      userId = newUser.rows[0].id_korisnik;
      await db.query(`INSERT INTO Ugostitelj (id_korisnik) VALUES ($1)`, [userId]);
    } else {
      userId = userResult.rows[0].id_korisnik;
      await db.query(`INSERT INTO Ugostitelj (id_korisnik) VALUES ($1) ON CONFLICT DO NOTHING`, [userId]);
    }

    // 2. Spremanje lokacije
    await db.query(
      `INSERT INTO Lokacija (naziv_objekta, adresa, kapacitet_stolova, id_ugostitelj)
       VALUES ($1, $2, $3, $4)`,
      [data.name, data.address, parseInt(data.capacity) || 0, userId]
    );

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Database Error:", error);
    return { success: false, error: "Could not save to the database." };
  }
}

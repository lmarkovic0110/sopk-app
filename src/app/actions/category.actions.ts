"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(name: string) {
  try {
    await db.query(
      `INSERT INTO Kategorija (naziv_kategorije) VALUES ($1)`,
      [name]
    );
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Greška pri kreiranju." };
  }
}

export async function updateCategoryAction(id: number, name: string) {
  try {
    await db.query(
      `UPDATE Kategorija SET naziv_kategorije = $1 WHERE id_kategorija = $2`,
      [name, id]
    );
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function deleteCategoryAction(id: number) {
  try {
    await db.query(`DELETE FROM Kategorija WHERE id_kategorija = $1`, [id]);
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Kategorija je vjerojatno povezana s kvizom i ne može se obrisati." };
  }
}

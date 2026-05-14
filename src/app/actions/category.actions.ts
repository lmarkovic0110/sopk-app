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
    return { success: false, error: "Could not create category." };
  }
}

export async function updateCategoryAction(id: string | number, name: string) {
  try {
    await db.query(
      `UPDATE Kategorija SET naziv_kategorije = $1 WHERE id_kategorija = $2`,
      [name, Number(id)]
    );
    revalidatePath("/categories");
    return { success: true as const };
  } catch (error) {
    console.error(error);
    return { success: false as const, error: "Could not update category." };
  }
}

export async function deleteCategoryAction(id: string | number) {
  try {
    await db.query(`DELETE FROM Kategorija WHERE id_kategorija = $1`, [Number(id)]);
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "This category is probably linked to a quiz and cannot be deleted." };
  }
}

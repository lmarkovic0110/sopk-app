import { listCategories } from "@/repositories/category.repository";
import type { Category } from "@/types/category";

export async function getAllCategories(): Promise<Category[]> {
  return listCategories();
}

import { getAllCategories } from "@/services/category.service";
import CategoriesClient from "@/components/CategoriesClient";

export default async function CategoriesPage() {

  const categories = await getAllCategories();

  return <CategoriesClient categories={categories} />;
}

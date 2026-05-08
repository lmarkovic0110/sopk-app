import type { CreateCategoryRequest } from "@/types/category";

export function validateCreateCategoryRequest(
  input: unknown,
):
  | { valid: true; data: CreateCategoryRequest }
  | { valid: false; message: string } {
  if (!input || typeof input !== "object") {
    return { valid: false, message: "Request body must be an object." };
  }

  const payload = input as Partial<CreateCategoryRequest>;

  if (typeof payload.name !== "string" || payload.name.trim().length === 0) {
    return { valid: false, message: "Name is required." };
  }

  if (
    payload.description !== undefined &&
    typeof payload.description !== "string"
  ) {
    return { valid: false, message: "Description must be a string." };
  }

  return {
    valid: true,
    data: {
      name: payload.name,
      description: payload.description,
    },
  };
}

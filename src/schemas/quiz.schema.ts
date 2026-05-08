import type { CreateQuizRequest } from "@/types/quiz";

export function validateCreateQuizRequest(
  input: unknown,
): { valid: true; data: CreateQuizRequest } | { valid: false; message: string } {
  if (!input || typeof input !== "object") {
    return { valid: false, message: "Request body must be an object." };
  }

  const payload = input as Partial<CreateQuizRequest>;

  if (typeof payload.title !== "string" || payload.title.trim().length === 0) {
    return { valid: false, message: "Title is required." };
  }

  if (
    typeof payload.scheduledAt !== "string" ||
    payload.scheduledAt.trim().length === 0
  ) {
    return { valid: false, message: "scheduledAt is required." };
  }

  if (
    typeof payload.categoryId !== "string" ||
    payload.categoryId.trim().length === 0
  ) {
    return { valid: false, message: "categoryId is required." };
  }

  return {
    valid: true,
    data: {
      title: payload.title,
      scheduledAt: payload.scheduledAt,
      categoryId: payload.categoryId,
    },
  };
}

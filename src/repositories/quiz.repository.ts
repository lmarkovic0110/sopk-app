import type { CreateQuizRequest, Quiz } from "@/types/quiz";

export async function listQuizzes(): Promise<Quiz[]> {
  // TODO: Replace with real PostgreSQL query implementation.
  return [];
}

export async function createQuiz(input: CreateQuizRequest): Promise<Quiz> {
  // TODO: Replace with real PostgreSQL insert implementation.
  return {
    id: "placeholder-id",
    title: input.title,
    scheduledAt: input.scheduledAt,
    categoryId: input.categoryId,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

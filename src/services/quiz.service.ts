import { createQuiz, listQuizzes } from "@/repositories/quiz.repository";
import type { CreateQuizRequest, Quiz } from "@/types/quiz";

export async function getAllQuizzes(): Promise<Quiz[]> {
  return listQuizzes();
}

export async function createQuizUseCase(input: CreateQuizRequest): Promise<Quiz> {
  return createQuiz(input);
}

import {
  createQuiz,
  getQuizById,
  listQuizzes,
  listUpcomingQuizzes,
} from "@/repositories/quiz.repository";
import type { CreateQuizRequest, Quiz } from "@/types/quiz";

export async function getAllQuizzes(): Promise<Quiz[]> {
  return listQuizzes();
}

export async function getUpcomingQuizzes(limit: number): Promise<Quiz[]> {
  return listUpcomingQuizzes(limit);
}

export async function createQuizUseCase(input: CreateQuizRequest): Promise<Quiz> {
  return createQuiz(input);
}

export async function getQuizDetails(id: string): Promise<Quiz | null> {
  return getQuizById(id);
}

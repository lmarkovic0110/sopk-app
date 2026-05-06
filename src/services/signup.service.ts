import { createSignupWithTeam, listSignupsByQuizId } from "@/repositories/signup.repository";
import type { CreateSignupRequest } from "@/types/signup";
import type { Signup } from "@/types/signup";

export async function getSignupsForQuiz(
  quizId: string,
  teamSearch = "",
): Promise<Signup[]> {
  return listSignupsByQuizId(quizId, teamSearch);
}

export async function createSignup(input: CreateSignupRequest): Promise<Signup> {
  if (!input.quizId) {
    throw new Error("Quiz id is required.");
  }
  if (!input.teamName || input.teamName.trim().length < 2) {
    throw new Error("Team name must have at least 2 characters.");
  }
  if (!Number.isInteger(input.captainId) || input.captainId <= 0) {
    throw new Error("Captain id must be a positive integer.");
  }
  if (!Number.isInteger(input.memberCount) || input.memberCount <= 0) {
    throw new Error("Member count must be a positive integer.");
  }

  return createSignupWithTeam(input);
}

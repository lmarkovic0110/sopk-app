"use server";

import {
  createQuiz,
  deleteQuizRepo,
  getQuizById,
  updateQuizCategoryAndLocation,
  updateQuizRepo,
} from "@/repositories/quiz.repository";
import { getLocationTableCapacityById } from "@/repositories/location.repository";
import { revalidatePath } from "next/cache";

function parseMaxTeams(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

async function validateMaxTeamsForLocation(
  locationId: unknown,
  maxTeams: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const id = typeof locationId === "string" ? locationId.trim() : "";
  if (!id) return { ok: false, error: "Location is required." };

  const capacity = await getLocationTableCapacityById(id);
  if (capacity == null) return { ok: false, error: "Invalid location." };
  if (capacity < 1) {
    return { ok: false, error: "This venue has no tables configured; fix the location capacity first." };
  }
  if (maxTeams > capacity) {
    return {
      ok: false,
      error: `Max teams cannot exceed this venue's table count (${capacity}).`,
    };
  }
  return { ok: true };
}

export async function createQuizAction(data: Record<string, unknown>) {
  const maxTeams = parseMaxTeams(data.maxTeams);
  if (maxTeams == null || maxTeams < 1) {
    return { success: false as const, error: "Enter a valid max teams value." };
  }
  const check = await validateMaxTeamsForLocation(data.locationId, maxTeams);
  if (!check.ok) return { success: false as const, error: check.error };

  try {
    await createQuiz({ ...data, maxTeams });
    revalidatePath("/quiz");
    return { success: true as const };
  } catch (error) {
    console.error(error);
    return { success: false as const, error: "Could not create the quiz." };
  }
}

export async function updateQuizAction(quizId: string, data: Record<string, unknown>) {
  const maxTeams = parseMaxTeams(data.maxTeams);
  if (maxTeams == null || maxTeams < 1) {
    return { success: false as const, error: "Enter a valid max teams value." };
  }
  const check = await validateMaxTeamsForLocation(data.locationId, maxTeams);
  if (!check.ok) return { success: false as const, error: check.error };

  try {
    await updateQuizRepo(quizId, {
      title: data.title,
      scheduledAt: data.scheduledAt,
      categoryId: data.categoryId,
      locationId: data.locationId,
      status: data.status,
      maxTeams,
      entryFee: data.entryFee,
    });
    revalidatePath("/quiz");
    revalidatePath(`/quiz/${quizId}`);
    return { success: true as const };
  } catch (error) {
    console.error(error);
    return { success: false as const, error: "Could not update the quiz." };
  }
}

export async function updateQuizHeaderFksAction(
  quizId: string,
  categoryId: string,
  locationId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const cat = categoryId.trim();
  const loc = locationId.trim();
  if (!cat) return { success: false, error: "Category is required." };
  if (!loc) return { success: false, error: "Location is required." };

  const quiz = await getQuizById(quizId);
  if (!quiz) return { success: false, error: "Quiz not found." };

  const maxTeams = quiz.maxTeams ?? 0;
  if (maxTeams < 1) {
    return { success: false, error: "Quiz has no valid max teams; fix it on the full edit screen first." };
  }

  const check = await validateMaxTeamsForLocation(loc, maxTeams);
  if (!check.ok) return { success: false, error: check.error };

  try {
    await updateQuizCategoryAndLocation(quizId, cat, loc);
    revalidatePath("/quiz");
    revalidatePath(`/quiz/${quizId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Could not update category or location." };
  }
}

export async function deleteQuizAction(quizId: string) {
  try {
    await deleteQuizRepo(quizId);
    revalidatePath("/quiz");
    revalidatePath(`/quiz/${quizId}`);
    return { success: true as const };
  } catch (error) {
    console.error(error);
    return {
      success: false as const,
      error: "Could not delete this quiz. It may still have signups or related records.",
    };
  }
}

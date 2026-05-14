"use server";

import { createQuiz } from "@/repositories/quiz.repository";
import { revalidatePath } from "next/cache";

export async function createQuizAction(data: any) {
  try {
    await createQuiz(data);
    revalidatePath("/quiz");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

import { NextResponse } from "next/server";
import { getAllQuizzes } from "@/services/quiz.service";
import type { ApiResponse } from "@/types/api";
import type { Quiz } from "@/types/quiz";

export async function GET() {
  try {
    const quizzes = await getAllQuizzes();
    const response: ApiResponse<Quiz[]> = { success: true, data: quizzes };
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<Quiz[]> = {
      success: false,
      message: "Failed to fetch quizzes.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

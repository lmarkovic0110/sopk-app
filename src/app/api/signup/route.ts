import { NextResponse } from "next/server";
import { createSignup } from "@/services/signup.service";

export async function GET() {
  return NextResponse.json({ message: "Signup API placeholder" });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const quizId = String(formData.get("quizId") ?? "");
  const teamName = String(formData.get("teamName") ?? "");
  const captainId = Number(formData.get("captainId"));
  const memberCount = Number(formData.get("memberCount"));

  const redirectUrl = new URL(`/quiz/${quizId}`, request.url);

  try {
    await createSignup({
      quizId,
      teamName,
      captainId,
      memberCount,
    });
    redirectUrl.searchParams.set("created", "1");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create signup.";
    redirectUrl.searchParams.set("error", message);
  }

  return NextResponse.redirect(redirectUrl);
}

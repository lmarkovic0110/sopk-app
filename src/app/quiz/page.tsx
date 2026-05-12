import { getAllQuizzes } from "@/services/quiz.service";
import QuizzesClient from "@/components/QuizzesClient";

export default async function QuizPage() {

  const quizzes = await getAllQuizzes();
  return <QuizzesClient quizzes={quizzes} />;
}

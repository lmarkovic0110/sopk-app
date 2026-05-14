import { listCategories } from "@/repositories/category.repository";
import { listLocations } from "@/repositories/location.repository";
import { QuizForm } from "@/components/QuizForm";

export default async function CreateQuizPage() {
  const categories = await listCategories();
  const locations = await listLocations();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create New Quiz</h1>
        <p className="text-white/40">Fill in the details to schedule a new quiz event.</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#0d1f18] p-8 shadow-2xl">
        <QuizForm categories={categories} locations={locations} />
      </div>
    </main>
  );
}

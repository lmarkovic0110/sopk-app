type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-6 py-10">
      <h1 className="text-3xl font-bold">Quiz Details</h1>
      <p className="text-sm text-zinc-600">Selected quiz id: {id}</p>
    </main>
  );
}

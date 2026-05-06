export type QuizStatus = "draft" | "published" | "closed";

export type Quiz = {
  id: string;
  title: string;
  scheduledAt: string;
  categoryId: string;
  status: QuizStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateQuizRequest = {
  title: string;
  scheduledAt: string;
  categoryId: string;
};

export type UpdateQuizRequest = Partial<CreateQuizRequest> & {
  status?: QuizStatus;
};

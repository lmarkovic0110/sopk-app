export type QuizStatus = "draft" | "published" | "closed";

/** Values stored in `kvizevent.trenutni_status` */
export type DbQuizStatus = "Najavljen" | "Popunjen" | "U tijeku" | "Završen" | "Otkazan";

export type Quiz = {
  id: string;
  title: string;
  scheduledAt: string;
  categoryId: string;
  categoryName?: string;
  locationId?: string;
  locationName?: string;
  maxTeams?: number;
  entryFeePerMember?: number;
  status: QuizStatus;
  /** Raw DB status; set when loading a single quiz for editing */
  dbStatus?: DbQuizStatus;
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

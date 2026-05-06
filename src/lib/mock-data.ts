import type { Category } from "@/types/category";
import type { Quiz } from "@/types/quiz";

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "General Knowledge",
    description: "Mixed topics for everyone.",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Movies and TV",
    description: "Popular culture and entertainment.",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Sports",
    description: "Teams, players, and records.",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: "101",
    title: "Thursday Trivia Night",
    scheduledAt: "2026-05-15T19:00:00.000Z",
    categoryId: "1",
    status: "published",
    createdAt: "2026-05-01T08:00:00.000Z",
    updatedAt: "2026-05-01T08:00:00.000Z",
  },
  {
    id: "102",
    title: "Movie Quotes Challenge",
    scheduledAt: "2026-05-18T20:00:00.000Z",
    categoryId: "2",
    status: "published",
    createdAt: "2026-05-02T08:00:00.000Z",
    updatedAt: "2026-05-02T08:00:00.000Z",
  },
  {
    id: "103",
    title: "Champions Sports Quiz",
    scheduledAt: "2026-05-22T18:30:00.000Z",
    categoryId: "3",
    status: "draft",
    createdAt: "2026-05-03T08:00:00.000Z",
    updatedAt: "2026-05-03T08:00:00.000Z",
  },
];

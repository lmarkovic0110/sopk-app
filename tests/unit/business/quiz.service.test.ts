import type { Quiz } from "@/types/quiz";

const mockListQuizzes = jest.fn();
const mockListUpcomingQuizzes = jest.fn();
const mockGetQuizById = jest.fn();
const mockCreateQuiz = jest.fn();

jest.mock("@/repositories/quiz.repository", () => ({
  listQuizzes: (...args: unknown[]) => mockListQuizzes(...args),
  listUpcomingQuizzes: (...args: unknown[]) => mockListUpcomingQuizzes(...args),
  getQuizById: (...args: unknown[]) => mockGetQuizById(...args),
  createQuiz: (...args: unknown[]) => mockCreateQuiz(...args),
}));

import {
  createQuizUseCase,
  getAllQuizzes,
  getQuizDetails,
  getUpcomingQuizzes,
} from "@/services/quiz.service";

describe("quiz.service", () => {
  beforeEach(() => {
    mockListQuizzes.mockReset();
    mockListUpcomingQuizzes.mockReset();
    mockGetQuizById.mockReset();
    mockCreateQuiz.mockReset();
  });

  it("getAllQuizzes calls listQuizzes", async () => {
    const quizzes: Quiz[] = [];
    mockListQuizzes.mockResolvedValue(quizzes);
    await expect(getAllQuizzes()).resolves.toBe(quizzes);
    expect(mockListQuizzes).toHaveBeenCalledTimes(1);
  });

  it("getUpcomingQuizzes sends limit", async () => {
    mockListUpcomingQuizzes.mockResolvedValue([]);
    await getUpcomingQuizzes(5);
    expect(mockListUpcomingQuizzes).toHaveBeenCalledWith(5);
  });

  it("getQuizDetails calls getQuizById", async () => {
    mockGetQuizById.mockResolvedValue(null);
    await expect(getQuizDetails("12")).resolves.toBeNull();
    expect(mockGetQuizById).toHaveBeenCalledWith("12");
  });

  it("createQuizUseCase calls createQuiz", async () => {
    const input = {
      title: "T",
      scheduledAt: "2030-01-01T12:00:00.000Z",
      categoryId: "1",
    };
    const created = { id: "9", title: "T" } as Quiz;
    mockCreateQuiz.mockResolvedValue(created);
    await expect(createQuizUseCase(input)).resolves.toBe(created);
    expect(mockCreateQuiz).toHaveBeenCalledWith(input);
  });
});

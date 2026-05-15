const mockCreateSignupWithTeam = jest.fn();

jest.mock("@/repositories/signup.repository", () => ({
  createSignupWithTeam: (...args: unknown[]) => mockCreateSignupWithTeam(...args),
  listSignupsByQuizId: jest.fn(),
}));

import { createSignup } from "@/services/signup.service";

describe("signup.service", () => {
  beforeEach(() => {
    mockCreateSignupWithTeam.mockReset();
  });

  it("throws without quizId", async () => {
    await expect(
      createSignup({
        quizId: "",
        teamName: "Team A",
        captainId: 1,
        memberCount: 4,
      }),
    ).rejects.toThrow(/quiz id is required/i);
    expect(mockCreateSignupWithTeam).not.toHaveBeenCalled();
  });

  it("throws when team name is too short", async () => {
    await expect(
      createSignup({
        quizId: "10",
        teamName: "x",
        captainId: 1,
        memberCount: 4,
      }),
    ).rejects.toThrow(/team name/i);
    expect(mockCreateSignupWithTeam).not.toHaveBeenCalled();
  });

  it("saves signup when input is ok", async () => {
    mockCreateSignupWithTeam.mockResolvedValue({
      id: "1",
      quizId: "10",
      teamId: "20",
      teamName: "The Aces",
      memberCount: 4,
      signupTime: new Date().toISOString(),
    });

    const result = await createSignup({
      quizId: "10",
      teamName: "The Aces",
      captainId: 5,
      memberCount: 4,
    });

    expect(mockCreateSignupWithTeam).toHaveBeenCalledWith({
      quizId: "10",
      teamName: "The Aces",
      captainId: 5,
      memberCount: 4,
    });
    expect(result.teamName).toBe("The Aces");
  });
});

export type Signup = {
  id: string;
  quizId: string;
  teamId: string;
  teamName: string;
  memberCount: number;
  signupTime: string;
};

export type CreateSignupRequest = {
  quizId: string;
  teamName: string;
  captainId: number;
  memberCount: number;
};

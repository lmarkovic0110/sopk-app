/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import AuthStatus from "@/components/AuthStatus";

const mockUseUser = jest.fn();

jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: () => mockUseUser(),
}));

describe("AuthStatus", () => {
  beforeEach(() => {
    mockUseUser.mockReset();
  });

  it("shows loading while auth loads", () => {
    mockUseUser.mockReturnValue({ user: undefined, isLoading: true });
    const { container } = render(<AuthStatus />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows name and Log out when logged in", () => {
    mockUseUser.mockReturnValue({
      user: { nickname: "quizmaster", name: "Quiz Master" },
      isLoading: false,
    });
    render(<AuthStatus />);
    expect(screen.getByText("quizmaster")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^log out$/i })).toHaveAttribute("href", "/api/auth/logout");
  });

  it("shows Log in and Sign up when logged out", () => {
    mockUseUser.mockReturnValue({ user: undefined, isLoading: false });
    render(<AuthStatus />);
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/api/auth/login",
    );
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/api/auth/login?screen_hint=signup",
    );
  });
});

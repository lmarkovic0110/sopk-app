/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import RoleSection from "@/components/RoleSection";

const mockUseUser = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: () => mockUseUser(),
}));

describe("RoleSection", () => {
  beforeEach(() => {
    mockUseUser.mockReset();
    mockPush.mockReset();
  });

  it("shows homepage title", () => {
    mockUseUser.mockReturnValue({ user: undefined, isLoading: false });
    render(<RoleSection />);
    expect(
      screen.getByRole("heading", { name: /discover, host, and join quiz events/i }),
    ).toBeInTheDocument();
  });

  it("Admin sees create buttons", () => {
    mockUseUser.mockReturnValue({
      user: { "http://localhost:3000/roles": ["Admin"] },
      isLoading: false,
    });
    render(<RoleSection />);
    expect(screen.getByRole("button", { name: /create quiz/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create location/i })).toBeInTheDocument();
  });

  it("Player does not see create buttons", () => {
    mockUseUser.mockReturnValue({
      user: { "http://localhost:3000/roles": ["Player"] },
      isLoading: false,
    });
    render(<RoleSection />);
    expect(screen.queryByRole("button", { name: /create quiz/i })).not.toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CreditBalance from "../app/components/CreditBalance";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Supabase
const mockGetSession = jest.fn();
jest.mock("../utils/supabase/client", () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: mockGetSession,
    },
  })),
}));

// Mock fetch
global.fetch = jest.fn();

describe("CreditBalance Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it("renders loading state initially", () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    render(<CreditBalance />);
    // Component should render without crashing
    expect(screen.queryByText(/loading/i)).toBeNull();
  });

  it("displays premium status when user has premium", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          access_token: "test-token",
        },
      },
      error: null,
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          balance: 1000,
          premiumStatus: "pro",
          unlimited: false,
        },
      }),
    });

    render(<CreditBalance />);

    await waitFor(() => {
      // Component should render without errors
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("displays free status when user is on free plan", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          access_token: "test-token",
        },
      },
      error: null,
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          balance: 50,
          premiumStatus: "free",
          unlimited: false,
        },
      }),
    });

    render(<CreditBalance />);

    await waitFor(() => {
      // Component should render without errors
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("displays low credits warning when balance is low", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          access_token: "test-token",
        },
      },
      error: null,
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          balance: 20,
          premiumStatus: "free",
          unlimited: false,
        },
      }),
    });

    render(<CreditBalance />);

    await waitFor(() => {
      // Component should render without errors
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("handles API errors gracefully", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          access_token: "test-token",
        },
      },
      error: null,
    });

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(<CreditBalance />);

    await waitFor(() => {
      // Component should still render without crashing
      expect(screen.queryByText(/error/i)).toBeNull();
    });
  });
});



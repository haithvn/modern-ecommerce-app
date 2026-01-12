import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Register from "./Register";
import * as authApi from "../api/authApi";
import { BrowserRouter } from "react-router-dom";

// Mock authApi
vi.mock("../api/authApi", () => ({
  register: vi.fn(),
}));

describe("Register Component", () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );
  };

  it("renders registration form", () => {
    renderComponent();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register/i }),
    ).toBeInTheDocument();
  });

  it("validates password mismatch", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("calls register api on valid submission", async () => {
    renderComponent();

    // Mock successful response
    (authApi.register as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      {},
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
    });
  });
});

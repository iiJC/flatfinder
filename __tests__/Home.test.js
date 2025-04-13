import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";

describe("HomePage", () => {
  it("renders the welcome message", () => {
    render(<HomePage />);
    expect(screen.getByText(/Welcome to FlatMate Finder/i)).toBeInTheDocument();
  });

  it("renders buttons to find flats and flatmates", () => {
    render(<HomePage />);
    expect(screen.getByText(/Looking for a flat!/i)).toBeInTheDocument();
    expect(screen.getByText(/Looking for a flatmate!/i)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";

// test the home page
describe("HomePage", () => {
  it("renders the welcome message", () => {
    // render the page and check for welcome text
    render(<HomePage />);
    expect(screen.getByText(/Welcome to FlatMate Finder/i)).toBeInTheDocument();
  });

  it("renders buttons to find flats and flatmates", () => {
    // render the page and check for both buttons
    render(<HomePage />);
    expect(screen.getByText(/Find a flat!/i)).toBeInTheDocument();
    expect(screen.getByText(/Find a flatmate!/i)).toBeInTheDocument();
  });
});

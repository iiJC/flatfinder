import { render, screen } from "@testing-library/react";
import FlatsPage from "../app/flats/page";

describe("FlatsPage", () => {
  it("shows loading initially", () => {
    render(<FlatsPage />);
    expect(screen.getByText(/Loading flats/i)).toBeInTheDocument();
  });
});

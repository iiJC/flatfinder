import { render, screen } from "@testing-library/react";
import FlatsPage from "../app/flats/page";

// test the flats page
describe("FlatsPage", () => {
  it("shows loading initially", () => {
    // render the component
    render(<FlatsPage />);

    // check for loading text
    expect(screen.getByText(/Loading flats/i)).toBeInTheDocument();
  });
});

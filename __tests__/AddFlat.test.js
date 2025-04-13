import { render, screen, fireEvent } from "@testing-library/react";
import AddFlat from "../app/addflat/page";

describe("AddFlat", () => {
  it("renders form fields", () => {
    render(<AddFlat />);
    expect(screen.getByPlaceholderText("Flat Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Rent per Week")).toBeInTheDocument();
  });

  it("submits with missing coordinates shows alert", () => {
    window.alert = jest.fn();
    render(<AddFlat />);
    fireEvent.click(screen.getByText(/Submit Flat/i));
    expect(window.alert).toHaveBeenCalledWith(
      "Please select a valid address from suggestions."
    );
  });

  it("renders tag toggle buttons", () => {
    render(<AddFlat />);
    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(screen.getByText("Furnished")).toBeInTheDocument();
  });
});

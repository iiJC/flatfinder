import { render, screen, fireEvent } from "@testing-library/react";
import AddFlat from "@/app/addflat/page";

beforeAll(() => {
  window.alert = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("AddFlat", () => {
  it("submits with missing coordinates shows alert", () => {
    render(<AddFlat />);

    // Fill in required fields (except address / coordinates)
    fireEvent.change(screen.getByPlaceholderText("Flat Name"), {
      target: { value: "Test Flat" }
    });
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Dunedin" }
    });
    fireEvent.change(screen.getByPlaceholderText("Rent per Week"), {
      target: { value: "200" }
    });
    fireEvent.change(screen.getByPlaceholderText("Bond"), {
      target: { value: "600" }
    });
    fireEvent.change(screen.getByPlaceholderText("Total Rooms"), {
      target: { value: "4" }
    });
    fireEvent.change(screen.getByPlaceholderText("Available Rooms"), {
      target: { value: "2" }
    });

    // Submit without selecting coordinates (no geocoder selection)
    fireEvent.click(screen.getByText(/Submit Flat/i));

    // Expect alert
    expect(window.alert).toHaveBeenCalledWith(
      "Please select a valid address from suggestions."
    );
  });
});

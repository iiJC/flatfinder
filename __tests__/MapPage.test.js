import { render, screen } from "@testing-library/react";
import MapPage from "../app/map/page";

describe("MapPage", () => {
  it("renders map container", () => {
    render(<MapPage />);
    expect(screen.getByText(/Filter Flats/i)).toBeInTheDocument();
  });
});

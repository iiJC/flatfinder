import { render, screen } from "@testing-library/react";
import MapPage from "../app/map/page";

describe("MapPage", () => {
  it("renders map container", () => {
    render(<MapPage />);
    expect(screen.getByText(/Filter Flats/i)).toBeInTheDocument();
  });
});

jest.mock('@mapbox/mapbox-gl-geocoder', () => {
  return jest.fn().mockImplementation(() => ({
    onAdd: jest.fn(() => document.createElement('div')),
    on: jest.fn(),
    off: jest.fn(),
    addTo: jest.fn(),
    remove: jest.fn(),
  }));
});


import { render, screen } from "@testing-library/react";
import MapPage from "../app/map/page";

jest.mock("mapbox-gl", () => {
  const originalModule = jest.requireActual("mapbox-gl");
  return {
    ...originalModule,
    Map: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      addControl: jest.fn(),
    })),
    Marker: jest.fn().mockImplementation(() => ({
      setLngLat: jest.fn(),
      addTo: jest.fn(),
    })),
  };
});

jest.mock("@mapbox/mapbox-gl-geocoder", () => {
  return jest.fn().mockImplementation(() => ({
    onAdd: jest.fn().mockReturnValue(document.createElement('div')), 
    on: jest.fn(),
    addTo: jest.fn(),
  }));
});

describe("MapPage", () => {
  it("renders map container and filter button", () => {
    render(<MapPage />);

    expect(screen.getByText(/Filter Flats/i)).toBeInTheDocument();

    expect(screen.getByTestId('map')).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText(/Search for an address/i)).toBeInTheDocument();
  });
});

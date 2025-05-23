// mock mapbox geocoder to avoid real api calls in tests
const MapboxGeocoder = jest.fn(() => ({
  // mock event listener method
  on: jest.fn(),

  // mock adding geocoder to the map
  addTo: jest.fn(),

  // mock removing geocoder from the map
  remove: jest.fn()
}));

// export mock for use in test files
export default MapboxGeocoder;

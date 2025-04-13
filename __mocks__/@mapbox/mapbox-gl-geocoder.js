const MapboxGeocoder = jest.fn(() => ({
  on: jest.fn(),
  addTo: jest.fn(),
  remove: jest.fn()
}));

export default MapboxGeocoder;

const mapboxgl = {
  Map: function () {
    return {
      on: jest.fn(),
      addControl: jest.fn(),
      remove: jest.fn(),
      setCenter: jest.fn(),
      setZoom: jest.fn()
    };
  },
  NavigationControl: jest.fn(),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setPopup: jest.fn().mockReturnThis(),
    addTo: jest.fn()
  })),
  Popup: jest.fn(() => ({
    setHTML: jest.fn().mockReturnThis(),
    setText: jest.fn().mockReturnThis()
  })),
  GeolocateControl: jest.fn()
};

export default mapboxgl;

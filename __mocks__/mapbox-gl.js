// mock mapboxgl module for tests

const mapboxgl = {
  // mock map constructor
  Map: function () {
    return {
      on: jest.fn(), // mock event listener
      addControl: jest.fn(), // mock adding controls
      remove: jest.fn(), // mock remove map
      setCenter: jest.fn(), // mock setting center
      setZoom: jest.fn() // mock setting zoom
    };
  },
  // mock navigation control
  NavigationControl: jest.fn(),

  // mock marker with chainable methods
  Marker: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setPopup: jest.fn().mockReturnThis(),
    addTo: jest.fn()
  })),

  // mock popup with chainable methods
  Popup: jest.fn(() => ({
    setHTML: jest.fn().mockReturnThis(),
    setText: jest.fn().mockReturnThis()
  })),

  // mock geolocate control
  GeolocateControl: jest.fn()
};

export default mapboxgl;

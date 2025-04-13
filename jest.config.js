const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "^mapbox-gl$": "<rootDir>/__mocks__/mapbox-gl.js",
    "^@mapbox/mapbox-gl-geocoder$":
      "<rootDir>/__mocks__/@mapbox/mapbox-gl-geocoder.js"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@mapbox/mapbox-gl-geocoder|nanoid)/)" // 👈 allow these modules to be transformed
  ]
};

module.exports = createJestConfig(customJestConfig);

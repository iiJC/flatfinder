const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@mapbox/mapbox-gl-geocoder|nanoid)/)" // 👈 allow these modules to be transformed
  ]
};

module.exports = createJestConfig(customJestConfig);

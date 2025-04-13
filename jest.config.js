const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  },
  testEnvironment: "jest-environment-jsdom",

  // ✅ Transpile problematic node_modules
  transformIgnorePatterns: ["/node_modules/(?!(@mapbox|mapbox-gl|nanoid)/)"],

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },

  testPathIgnorePatterns: ["/node_modules/", "/.next/"]
};

module.exports = createJestConfig(customJestConfig);

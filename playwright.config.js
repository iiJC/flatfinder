import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests", // Only look here
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true
  }
});

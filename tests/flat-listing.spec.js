import { test, expect } from "@playwright/test";

test("user can log in and list a flat", async ({ page }) => {
  // Go to the login page
  await page.goto("http://localhost:3000/login");

  // Fill in login form
  await page.fill('input[name="email"]', "john@example.com");
  await page.fill('input[name="password"]', "password");
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard or homepage
  await page.waitForURL("**/dashboard", { timeout: 5000 });

  // Go to flats list
  await page.goto("http://localhost:3000/flats");

  // Click the first flat's "View" or similar link
  await page.click('a[href^="/flats/"]');

  // Click apply
  await page.click("text=Apply Here");

  // Fill application form
  await page.fill("input[type='text']", "Referee Name");
  await page.fill("input[type='tel']", "0211234567");
  await page.fill("textarea", "I'm tidy, friendly, and love plants 🌿");

  // Submit form
  await page.click('button[type="submit"]');

  // Expect a success alert to appear
  await page.waitForEvent("dialog").then((dialog) => {
    expect(dialog.message()).toContain("Application submitted");
    dialog.dismiss();
  });
});

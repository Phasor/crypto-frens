// @ts-check
const { test, expect } = require('@playwright/test');

// test('homepage has title and links to intro page', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);

//   // create a locator
//   const getStarted = page.getByRole('link', { name: 'Get started' });

//   // Expect an attribute "to be strictly equal" to the value.
//   await expect(getStarted).toHaveAttribute('href', '/docs/intro');

//   // Click the get started link.
//   await getStarted.click();
  
//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/);
// });

test.describe("Log in page", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto("http://localhost:3002");
  });

  test("URL is correct", async ({ page }) => {
    // Assertions use the expect API.
    await expect(page).toHaveURL("http://localhost:3002");
  });

  test("title is correct", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Crypto Frens - Log In/);  
  });

  test("Navbar login button is present", async ({ page }) => {
      const loginButton = await page.locator('[data-test=nav-login-button]')
      await expect(loginButton).toBeVisible();
  });

  test("Navbar sign up button is present", async ({ page }) => {
    const signUpButton = await page.locator('[data-test=nav-signup-button]')
    await expect(signUpButton).toBeVisible();
  });
});

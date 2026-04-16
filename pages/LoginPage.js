const { test, expect } = require('@playwright/test');
require('dotenv').config();

test('login using email and pin', async ({ page }) => {
  await page.goto('https://crmqa2.pooraa.net/login');

  await page.fill('input[type="email"]', process.env.USER_EMAIL);
  await page.click('text=Continue');

  const pinInput = page.locator('input[type="password"]');
  await pinInput.fill(process.env.USER_PIN);

  await expect(page).toHaveURL(/dashboard|home/);
});

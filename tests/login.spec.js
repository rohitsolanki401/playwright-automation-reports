import { test, expect } from '@playwright/test';
import { excelReader } from '../utils/excelReader.js';

const testData = excelReader('Sheet1');

test.use({
  launchOptions: {
    slowMo: 400,
  },
});

test.describe.serial('Login tests with cooldown gap', () => {

    test.setTimeout(90_000); // ⬅ 90 seconds per test

  for (const data of testData) {
    test(`Login test for ${data.Role}`, async ({ page }) => {

      if (!data.email || !data.d1) {
        throw new Error(`Invalid test data for role: ${data.Role}`);
      }

      await page.goto('https://crmpreprod.pooraa.net/login');

      // Email
      await page
        .getByRole('textbox', { name: 'Enter your email' })
        .fill(data.email);

      await page
        .getByRole('button', { name: 'Continue', exact: true })
        .click();

      // OTP digits
      await page.locator('#_r_4_').fill(String(data.d1));
      await page.locator('#_r_5_').fill(String(data.d2));
      await page.locator('#_r_6_').fill(String(data.d3));
      await page.locator('#_r_7_').fill(String(data.d4));
      await page.locator('#_r_8_').fill(String(data.d5));
      await page.locator('#_r_9_').fill(String(data.d6));

      // ✅ Post-login URL validation
      await expect(page).toHaveURL(
        /https:\/\/crmpreprod\.pooraa\.net/,
        { timeout: 15000 }
      );

      console.log(`✅ Login successful for ${data.Role}`);

      // ⏳ Cooldown gap to avoid IP restriction
      console.log('⏳ Waiting 30 seconds before next user login...');
      await page.waitForTimeout(30_000);
    });
  }

});

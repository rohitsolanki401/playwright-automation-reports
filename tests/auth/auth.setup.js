// import { test as setup, expect } from '@playwright/test';

// setup('login and save session', async ({ page }) => {

//   console.log("🚀 Auth setup started");

//   await page.goto('https://crmqa2.pooraa.net/login');

//   await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
//   await page.getByRole('button', { name: 'Continue', exact: true }).click();

//   console.log("Entering OTP");
// await page.locator('input').nth(0).fill('6');
//   await page.locator('input').nth(1).fill('5');
//   await page.locator('input').nth(2).fill('4');
//   await page.locator('input').nth(3).fill('3');
//   await page.locator('input').nth(4).fill('2');
//   await page.locator('input').nth(5).fill('1');

//   await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();

//   await page.waitForURL('**/dashboard');

//   console.log("Saving session");

// //   await page.context().storageState({ path: 'storageState.json' });

// await page.context().storageState({ path: 'playwright/.auth/user.json' });

//   console.log("✅ Auth setup finished");

// });
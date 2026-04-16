import { chromium } from '@playwright/test';

async function globalSetup() {

  console.log("🚀 Global setup started");

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://crmqa2.pooraa.net/login');

  console.log("Login page opened");

  await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  console.log("Entering OTP");

  await page.locator('#_r_4_').fill('6');
  await page.locator('#_r_5_').fill('5');
  await page.locator('#_r_6_').fill('4');
  await page.locator('#_r_7_').fill('3');
  await page.locator('#_r_8_').fill('2');
  await page.locator('#_r_9_').fill('1');

  await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();

  // wait until dashboard fully loaded
  await page.waitForURL('**/dashboard');

  // important wait for session to stabilize
  await page.waitForTimeout(5000);

  console.log("Saving storage state");

  await context.storageState({ path: 'storageState.json' });

  await browser.close();

  console.log("✅ Global setup finished");
}

export default globalSetup;
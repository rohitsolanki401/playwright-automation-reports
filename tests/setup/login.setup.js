// import { test as setup, expect } from '@playwright/test';

// setup('login', async ({ page }) => {
//   await page.goto('https://crmqa2.pooraa.net/login');
//   await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
//   await page.getByRole('button', { name: 'Continue', exact: true }).click();

//   await page.locator('#_r_4_').fill('6');
//   await page.locator('#_r_5_').fill('5');
//   await page.locator('#_r_6_').fill('4');
//   await page.locator('#_r_7_').fill('3');
//   await page.locator('#_r_8_').fill('2');
//   await page.locator('#_r_9_').fill('1');

//   await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();
//   await page.waitForURL('**/dashboard');
 
//   await page.context().storageState({ path: 'storageState.json' });
// });
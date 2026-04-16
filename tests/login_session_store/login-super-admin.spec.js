import { test, expect } from '@playwright/test';
test.use({
        storageState: 'storageState.json',
    launchOptions:{
        slowMo:100,
    }
})

test('Login with super admin', async ({ page }) => {

  // --- LOGIN (your existing code) ---
  await page.goto('https://crmqa2.pooraa.net/dashboard');
  // await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
  // await page.getByRole('button', { name: 'Continue', exact: true }).click();

//   await page.locator('#_r_4_').fill('6');
//   await page.locator('#_r_5_').fill('5');
//   await page.locator('#_r_6_').fill('4');
//   await page.locator('#_r_7_').fill('3');
//   await page.locator('#_r_8_').fill('2');
//   await page.locator('#_r_9_').fill('1');

// await page.locator('input').nth(0).fill('6');
// await page.locator('input').nth(1).fill('5');
// await page.locator('input').nth(2).fill('4');
// await page.locator('input').nth(3).fill('3');
// await page.locator('input').nth(4).fill('2');
// await page.locator('input').nth(5).fill('1');

  // --- NAVIGATION ---
  await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();

  test.afterAll(async () => {
  await new Promise(res => setTimeout(res, 10000)); // 10 sec delay
});

});
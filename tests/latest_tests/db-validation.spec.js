import { test, expect } from '@playwright/test';
import { db } from '../../utils/db.js';

test.use({
      // storageState: 'storageState.json',
  launchOptions: {
    slowMo: 400,
  },
});

test('verify record saved in DB', async ({ page }) => {
  await page.goto('https://crmqa2.pooraa.net/login');

  // UI Action
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator('[id="_r_4_"]').click();
  await page.locator('[id="_r_4_"]').fill('6');
  await page.locator('[id="_r_5_"]').fill('5');
  await page.locator('[id="_r_6_"]').fill('4');
  await page.locator('[id="_r_7_"]').fill('3');
  await page.locator('[id="_r_8_"]').fill('2');
  await page.locator('[id="_r_9_"]').fill('1');

  console.log('👉 Before DB query');

  // DB Validation
const result = await db.query(
  'SELECT * FROM users WHERE email = $1',
  ['crm@busy.in']
);

console.log('👉 After DB query, rows:', result.rows.length);


  expect(result.rows.length).toBe(1);
});

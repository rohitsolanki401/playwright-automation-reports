import { test, expect } from '@playwright/test';
test.use({
        storageState: 'storageState.json',
    launchOptions:{
        slowMo:400,
    }
})

function generateUniqueMobile() {
  const timestamp = Date.now().toString();
  return '9' + timestamp.slice(-9);
}

function generateRemarks() {
  return `testing_${Date.now()}`;
}

test('Create Lead with unique mobile & handle duplicate', async ({ page }) => {

  // --- LOGIN (your existing code) ---
  await page.goto('https://crmqa2.pooraa.net/dashboard');
  // await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
  // await page.getByRole('button', { name: 'Continue', exact: true }).click();

  // await page.locator('#_r_4_').fill('6');
  // await page.locator('#_r_5_').fill('5');
  // await page.locator('#_r_6_').fill('4');
  // await page.locator('#_r_7_').fill('3');
  // await page.locator('#_r_8_').fill('2');
  // await page.locator('#_r_9_').fill('1');

  // --- NAVIGATION ---
  await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();
  await page.getByRole('menuitem', { name: 'Lead' }).click();
  await page.getByRole('button', { name: 'Create Lead' }).click();

  // --- CREATE LEAD ---
  let mobile = generateUniqueMobile();
  await page.getByRole('textbox', { name: 'Mobile' }).fill(mobile);
  await page.getByRole('textbox', { name: 'Contact Person' }).fill('Rohit Test');
await page.getByRole('textbox', { name: 'Remarks' }).fill(generateRemarks());

  await page.getByRole('button', { name: 'Create Lead' }).click();

  // --- HANDLE DUPLICATE ERROR ---
  const duplicateError = page.locator('text=/mobile.*already.*exists/i');

  if (await duplicateError.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('Duplicate mobile detected, retrying with new number');

    mobile = generateUniqueMobile();
    await page.getByRole('textbox', { name: 'Mobile' }).fill(mobile);
    await page.getByRole('button', { name: 'Create Lead' }).click();
  }

  // --- ASSERT EDIT LEAD POPUP OPENS ---
  await expect(page.locator('text=Edit Lead')).toBeVisible();

    await page.getByRole('button').first().click();  // Close the Edit Lead popup

  // --- NAVIGATE TO LEAD LISTING ---
  await page.getByRole('menuitem', { name: 'Lead' }).click();

  // --- SEARCH LEAD BY MOBILE ---
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  await searchBox.fill(mobile);
  await page.getByRole('button', { name: 'search' }).first().click();

  // --- VERIFY MOBILE IN LISTING ---
  const leadRow = page.locator(`tr:has-text("${mobile}")`);
  await expect(leadRow).toBeVisible({ timeout: 5000 });
  console.log('✅ Lead mobile found in listing');
});

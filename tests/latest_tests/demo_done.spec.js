import { test, expect } from '@playwright/test';
test.use({
      // storageState: 'storageState.json',
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
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await page.locator('#_r_4_').fill('6');
  await page.locator('#_r_5_').fill('5');
  await page.locator('#_r_6_').fill('4');
  await page.locator('#_r_7_').fill('3');
  await page.locator('#_r_8_').fill('2');
  await page.locator('#_r_9_').fill('1');

  // --- NAVIGATION ---
  await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();
  await page.getByRole('menuitem', { name: 'Lead' }).click();
  await page.getByRole('button', { name: 'Create Lead' }).click();

  // --- CREATE LEAD ---
  let mobile = generateUniqueMobile();
  await page.getByRole('textbox', { name: 'Mobile' }).fill(mobile);
  await page.getByRole('textbox', { name: 'Contact Person' }).fill('Rohit Testing');
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
 await page.getByRole('combobox', { name: 'Select Stage' }).click();
  await page.getByRole('option', { name: 'Demo Done' }).click();
  await page.getByRole('combobox', { name: 'Select Call Disposition' }).click();
  await page.getByRole('option', { name: 'Follow Up - Customer' }).click();
  await page.getByRole('button', { name: 'Choose date' }).nth(1).click();

const today = new Date().getDate().toString();
await page.getByRole('gridcell', { name: today }).click();

// Open time picker
//await page.getByRole('button', { name: 'Choose time' }).click();

// Select hour & minute (LEFT = hour, RIGHT = minute)
await page.getByRole('option', { name: '17 hours' }).click();
await page.getByRole('option', { name: '30 minutes' }).click();

  await page.getByRole('button', { name: 'Choose date', exact: true }).click();
  await page.getByRole('gridcell', { name: today }).click();
  await page.getByRole('button', { name: 'Save Details' }).click();
});
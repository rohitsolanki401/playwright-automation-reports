import { test, expect } from '@playwright/test';

test.use({
    // storageState: 'storageState.json',
  launchOptions: {
    slowMo: 400,
  }
});

function generateUniqueMobile() {
  const timestamp = Date.now().toString();
  return '9' + timestamp.slice(-9);
}

function generateRemarks() {
  return `testing_${Date.now()}`;
}

test('Create Lead and verify in listing + follow-up remarks', async ({ page }) => {

  // ---------- LOGIN ----------
  await page.goto('https://crmqa2.pooraa.net/login');
  console.log("Current URL:", page.url());
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  // await page.locator('#_r_4_').fill('6');
  // await page.locator('#_r_5_').fill('5');
  // await page.locator('#_r_6_').fill('4');
  // await page.locator('#_r_7_').fill('3');
  // await page.locator('#_r_8_').fill('2');
  // await page.locator('#_r_9_').fill('1');

  await page.locator('input').nth(0).fill('6');
  await page.locator('input').nth(1).fill('5');
  await page.locator('input').nth(2).fill('4');
  await page.locator('input').nth(3).fill('3');
  await page.locator('input').nth(4).fill('2');
  await page.locator('input').nth(5).fill('1');

  // // ---------- NAVIGATION ----------
  await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();
  await page.getByRole('menuitem', { name: 'Lead' }).click();
  await page.getByRole('button', { name: 'Create Lead' }).click();

  // ---------- CREATE LEAD ----------
  let mobile = generateUniqueMobile();
  const remarks = generateRemarks();

  await page.getByRole('textbox', { name: 'Mobile' }).fill(mobile);
  await page.getByRole('textbox', { name: 'Contact Person' }).fill('Rohit Test');
  await page.getByRole('textbox', { name: 'Remarks' }).fill(remarks);
  await page.getByRole('button', { name: 'Create Lead' }).click();

  // ---------- HANDLE DUPLICATE ----------
  const duplicateError = page.locator('text=/mobile.*already.*exists/i');
  if (await duplicateError.isVisible({ timeout: 3000 }).catch(() => false)) {
    mobile = generateUniqueMobile();
    await page.getByRole('textbox', { name: 'Mobile' }).fill(mobile);
    await page.getByRole('button', { name: 'Create Lead' }).click();
  }

  // ---------- VERIFY EDIT POPUP ----------
  await expect(page.locator('text=Edit Lead')).toBeVisible();

  // Close Edit Lead popup
  await page.getByRole('button').first().click();

  // ---------- GO TO LISTING ----------
  await page.getByRole('menuitem', { name: 'Lead' }).click();

  // ---------- SEARCH BY MOBILE ----------
  await page.getByRole('textbox', { name: 'Search' }).fill(mobile);
  await page.waitForTimeout(1000);

  const leadRow = page.getByRole('row', { name: new RegExp(mobile) });
  await expect(leadRow).toBeVisible();
  console.log('✅ Lead found in listing');

  // ---------- OPEN FOLLOW UP HISTORY ----------
  await leadRow
    .getByLabel('See all past updates with')
    .click();

  await page.getByRole('tab', { name: 'Follow Up History' }).click();

  // ---------- VERIFY REMARKS ----------
  await expect(
    page.getByText(`Follow Up Remarks: ${remarks}`)
  ).toBeVisible({ timeout: 5000 });

  console.log('✅ Follow-up remarks verified successfully');
});




// import { test, expect } from '@playwright/test';

// test.use({
//   launchOptions: {
//     slowMo: 400,
//   }
// });

// function generateUniqueMobile() {
//   const timestamp = Date.now().toString();
//   return '9' + timestamp.slice(-9);
// }

// function generateRemarks() {
//   return `testing_${Date.now()}`;
// }

// test('Create Lead and verify in listing + follow-up remarks', async ({ page }) => {

//   // Go directly to dashboard (already logged in via auth setup)
//   await page.goto('https://crmqa2.pooraa.net/dashboard');

//   console.log("Current URL:", await page.url());

//   // ---------- NAVIGATION ----------
//   await page.getByRole('menuitem', { name: 'Lead' }).click();
//   await page.getByRole('button', { name: 'Create Lead' }).click();

//   // ---------- CREATE LEAD ----------
//   let mobile = generateUniqueMobile();
//   const remarks = generateRemarks();

//   await page.getByRole('textbox', { name: 'Mobile' }).fill(mobile);
//   await page.getByRole('textbox', { name: 'Contact Person' }).fill('Rohit Test');
//   await page.getByRole('textbox', { name: 'Remarks' }).fill(remarks);
//   await page.getByRole('button', { name: 'Create Lead' }).click();

//   // ---------- HANDLE DUPLICATE ----------
//   const duplicateError = page.locator('text=/mobile.*already.*exists/i');

//   if (await duplicateError.isVisible({ timeout: 3000 }).catch(() => false)) {
//     mobile = generateUniqueMobile();
//     await page.getByRole('textbox', { name: 'Mobile' }).fill(mobile);
//     await page.getByRole('button', { name: 'Create Lead' }).click();
//   }

//   // ---------- VERIFY EDIT POPUP ----------
//   await expect(page.locator('text=Edit Lead')).toBeVisible();

//   // Close Edit Lead popup
//   await page.getByRole('button').first().click();

//   // ---------- GO TO LISTING ----------
//   await page.getByRole('menuitem', { name: 'Lead' }).click();

//   // ---------- SEARCH BY MOBILE ----------
//   await page.getByRole('textbox', { name: 'Search' }).fill(mobile);
//   await page.waitForTimeout(1000);

//   const leadRow = page.getByRole('row', { name: new RegExp(mobile) });

//   await expect(leadRow).toBeVisible();
//   console.log('✅ Lead found in listing');

//   // ---------- OPEN FOLLOW UP HISTORY ----------
//   await leadRow.getByLabel('See all past updates with').click();

//   await page.getByRole('tab', { name: 'Follow Up History' }).click();

//   // ---------- VERIFY REMARKS ----------
//   await expect(
//     page.getByText(`Follow Up Remarks: ${remarks}`)
//   ).toBeVisible({ timeout: 5000 });

//   console.log('✅ Follow-up remarks verified successfully');
// });
import { test, expect } from '@playwright/test';

test.use({
  launchOptions: {
    slowMo: 400,
  },
});

function generateUniqueMobile() {
  const timestamp = Date.now().toString();
  return '9' + timestamp.slice(-9);
}

function generateRemarks() {
  return `testing_${Date.now()}`;
}

test('Create Lead with unique mobile & verify follow-up remarks', async ({ page }) => {

  // ---------- TEST DATA ----------
  let mobile = generateUniqueMobile();
  const expectedRemark = generateRemarks(); // ✅ STORE REMARK

  // ---------- LOGIN ----------
  await page.goto('https://crmqa2.pooraa.net/login');
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await page.locator('#_r_4_').fill('6');
  await page.locator('#_r_5_').fill('5');
  await page.locator('#_r_6_').fill('4');
  await page.locator('#_r_7_').fill('3');
  await page.locator('#_r_8_').fill('2');
  await page.locator('#_r_9_').fill('1');

  // ---------- NAVIGATION ----------
  await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();
  await page.getByRole('menuitem', { name: 'Lead' }).click();
  await page.getByRole('button', { name: 'Create Lead' }).click();

  // ---------- CREATE LEAD ----------
  await page.getByRole('textbox', { name: 'Mobile' }).fill(mobile);
  await page.getByRole('textbox', { name: 'Contact Person' }).fill('Rohit Test');
  await page.getByRole('textbox', { name: 'Remarks' }).fill(expectedRemark);
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
  console.log(`✅ Lead created successfully with mobile: ${mobile}`);

  // Close popup
  await page.getByRole('button').first().click();

  // ---------- GO TO LEAD LIST ----------
  await page.getByRole('menuitem', { name: 'Lead' }).click();

  // ---------- SEARCH BY MOBILE ----------
  await page.getByRole('textbox', { name: 'Search' }).fill(mobile);
  await page.waitForTimeout(1000);

  const leadRow = page.getByRole('row', { name: new RegExp(mobile) });
  await expect(leadRow).toBeVisible();
  console.log(`✅ New lead found in listing: ${mobile}`);

  // ---------- OPEN FOLLOW-UP HISTORY ----------
  await leadRow.getByLabel('See all past updates with').click();
  await page.getByRole('tab', { name: 'Follow Up History' }).click();

  // ---------- EXTRACT & VERIFY REMARK VALUE ----------
  const remarkValue = await page
    .getByText('Follow Up Remarks:')
    .last()
    .locator('xpath=following-sibling::*')
    .first()
    .textContent();

  const actualRemark = remarkValue?.trim() || '';

  expect(actualRemark).toContain(expectedRemark);
  console.log(`✅ Follow-up remark verified: ${actualRemark}`);

  // ---------- REPORT ----------
  test.info().annotations.push(
    { type: 'verification', description: `Mobile verified: ${mobile}` },
    { type: 'verification', description: `Follow-up remark verified: ${actualRemark}` }
  );
});

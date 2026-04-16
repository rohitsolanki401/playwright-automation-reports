import { test, expect } from '@playwright/test';

test.use({
      //storageState: 'storageState.json',
  launchOptions: {
    slowMo: 400,
  },
});

test('Verify existing lead appears in listing and follow-up remarks', async ({ page }) => {

  // 🔹 Existing test data
  const mobile = '9876545645';
  const expectedRemark = 'testing'; // only the value, not label

  // ---------- LOGIN ----------
   await page.goto('https://crmqa2.pooraa.net/dashboard');
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await page.locator('#_r_4_').fill('6');
  await page.locator('#_r_5_').fill('5');
  await page.locator('#_r_6_').fill('4');
  await page.locator('#_r_7_').fill('3');
  await page.locator('#_r_8_').fill('2');
  await page.locator('#_r_9_').fill('1');

  // // ---------- NAVIGATE TO LEAD LIST ----------
  // await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();
  await page.getByRole('menuitem', { name: 'Lead' }).click();

  // ---------- SEARCH LEAD ----------
  await page.getByRole('textbox', { name: 'Search' }).fill(mobile);
  await page.waitForTimeout(1000);

  const leadRow = page.getByRole('row', { name: new RegExp(mobile) });
  await expect(leadRow).toBeVisible();
  console.log(`✅ Mobile verified in listing: ${mobile}`);

  // ---------- OPEN FOLLOW-UP HISTORY ----------
  await leadRow.getByLabel('See all past updates with').click();
  await page.getByRole('tab', { name: 'Follow Up History' }).click();

  // ---------- EXTRACT & VERIFY REMARK VALUE ----------

// Locate the label
const remarkLabel = page.getByText('Follow Up Remarks:');

// Get the value next to the label
const actualRemark = await remarkLabel
  .locator('xpath=following-sibling::*')
  .first()
  .textContent();

const remarkValue = actualRemark?.trim() || '';

// Assertion
expect(remarkValue).toContain(expectedRemark);

console.log(`✅ Follow-up remark value verified: ${remarkValue}`);


  // ---------- ADD TO REPORT ----------
  test.info().annotations.push(
    {
      type: 'verification',
      description: `Mobile verified: ${mobile}`,
    },
    {
      type: 'verification',
      description: `Follow-up remark value: ${actualRemark}`,
    }
  );
});

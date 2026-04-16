// import { test, expect } from '@playwright/test';

// test.use({
//   launchOptions: {
//     slowMo: 800,
//   },
// });

// test('Smoke | View Overall Summary report loads successfully', async ({ page }) => {

//   // ---------- LOGIN ----------
//   await page.goto('https://crmqa2.pooraa.net/login');
//   await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
//   await page.getByRole('button', { name: 'Continue', exact: true }).click();

//   await page.locator('#_r_4_').fill('6');
//   await page.locator('#_r_5_').fill('5');
//   await page.locator('#_r_6_').fill('4');
//   await page.locator('#_r_7_').fill('3');
//   await page.locator('#_r_8_').fill('2');
//   await page.locator('#_r_9_').fill('1');

//   // ---------- NAVIGATE TO REPORT ----------
//   await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();
//   await page.getByLabel('Main Navigation').getByRole('menuitem', { name: 'Report' }).click();

//   // ---------- OPEN OVERALL SUMMARY (VIEW) ----------
//   await page
//     .getByRole('row', { name: 'Overall Summary View Report' })
//     .getByLabel('View Report')
//     .click();

//   // ---------- SMOKE ASSERTIONS ----------

//   // URL check
//   await expect(page).toHaveURL(/reports/i);

//   // Report page should not show error / empty state
//   await expect(
//     page.locator('text=/No data|Something went wrong|Error/i')
//   ).not.toBeVisible({ timeout: 15000 });

//   /// Table container visible
//   const reportTable = page.locator('table').first();
  
//   // wait for report to load (explicit delay)
//    await page.waitForTimeout(15000); // 15s

//   await expect(reportTable).toBeVisible({ timeout: 15000 });

//   // ---------- VERIFY KEY SECTIONS ----------
//   await expect(reportTable).toContainText('New Leads');
//   await expect(reportTable).toContainText('BIPL Generated');
//   await expect(reportTable).toContainText('KPI (Overall Any Duration Conversion)');
//   await expect(reportTable).toContainText('Follow Up Hygiene (Assigned to First Follow Up)');

//   console.log('✅ Overall Summary report loaded successfully with all key sections');
// });





import { test, expect } from '@playwright/test';

// ---------- GLOBAL SETTINGS ----------
test.use({
      storageState: 'storageState.json',
  launchOptions: {
    slowMo: 400,
  },
});

let sharedPage;
let reportTable;

test.describe.serial('Overall Summary Report Tests', () => {

  // ---------- LOGIN + OPEN REPORT ONCE ----------
  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();

    console.log('🔹 Logging in...');
    await sharedPage.goto('https://crmqa2.pooraa.net/dashboard');
    // await sharedPage.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
    // await sharedPage.getByRole('button', { name: 'Continue', exact: true }).click();
    // await sharedPage.locator('#_r_4_').fill('6');
    // await sharedPage.locator('#_r_5_').fill('5');
    // await sharedPage.locator('#_r_6_').fill('4');
    // await sharedPage.locator('#_r_7_').fill('3');
    // await sharedPage.locator('#_r_8_').fill('2');
    // await sharedPage.locator('#_r_9_').fill('1');

    console.log('🔹 Navigating to Report module...');
    await sharedPage.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();
    await sharedPage.getByLabel('Main Navigation').getByRole('menuitem', { name: 'Report' }).click();

    console.log('🔹 Opening Overall Summary report...');
    await sharedPage
      .getByRole('row', { name: 'Overall Summary View Report' })
      .getByLabel('View Report')
      .click();

    reportTable = sharedPage.locator('table').first();
    await sharedPage.waitForTimeout(15000); // wait for table to load
    console.log('✅ Report loaded successfully');
  });

  // ---------- TEST CASES ----------

  test('1️⃣ Report URL is correct', async () => {
    await expect(sharedPage).toHaveURL(/reports/i);
  });

  test('2️⃣ Report page shows no errors or empty state', async () => {
    await expect(
      sharedPage.locator('text=/No data|Something went wrong|Error/i')
    ).not.toBeVisible({ timeout: 15000 });
  });

  test('3️⃣ Table is visible', async () => {
    await expect(reportTable).toBeVisible({ timeout: 15000 });
  });

  test('4️⃣ Report contains "New Leads"', async () => {
    await expect(reportTable).toContainText('New Leads');
  });

  test('5️⃣ Report contains other key sections', async () => {
    await expect(reportTable).toContainText('BIPL Generated');
    await expect(reportTable).toContainText('KPI (Overall Any Duration Conversion)');
    await expect(reportTable).toContainText('Follow Up Hygiene (Assigned to First Follow Up)');
  });

  // ---------- CLEANUP ----------
  test.afterAll(async () => {
    await sharedPage.close();
    console.log('🟢 Test session finished, browser closed');
  });

});
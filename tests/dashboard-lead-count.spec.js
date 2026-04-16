import { test, expect } from '@playwright/test';

test.use({
  launchOptions: { slowMo: 400 },
});

test('Verify dashboard lead count matches lead listing', async ({ page }) => {
  // LOGIN
  await page.goto('https://crmqa2.pooraa.net/login');
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('crm@busy.in');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await page.locator('#_r_4_').fill('6');
  await page.locator('#_r_5_').fill('5');
  await page.locator('#_r_6_').fill('4');
  await page.locator('#_r_7_').fill('3');
  await page.locator('#_r_8_').fill('2');
  await page.locator('#_r_9_').fill('1');

  await page.getByRole('button', { name: 'Busy Pvt. Ltd.' }).click();
  await expect(page.getByText('Tasks for Today')).toBeVisible();

  // DASHBOARD → read lead count
  const dashboardTable = page.getByRole('table', {
    name: 'Dashboard KPI metrics table',
  });

  const dashboardLeadCell = dashboardTable
    .locator('tr', { hasText: /^Total$/ })
    .locator('td')
    .nth(1);

  const dashboardLeadCount = Number(
    (await dashboardLeadCell.textContent()).trim()
  );

  // Navigate to lead listing
  await Promise.all([
    page.waitForURL(/leads/),
    dashboardLeadCell.click(),
  ]);

  // LEAD LISTING → count rows
  const leadRows = page.locator('table tbody tr');
  await expect(leadRows.first()).toBeVisible();

  const listingLeadCount = await leadRows.count();

  // ASSERT
  expect(listingLeadCount).toBe(dashboardLeadCount);
});

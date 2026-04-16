// utils/dateRangeHelper.js
import { expect } from '@playwright/test';

function buildAriaLabel(dateObj) {
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  // Example: "Thursday, January 1, 2026"
  const formatted = dateObj.toLocaleDateString('en-US', options);

  // react-datepicker format:
  // "Choose Thursday, January 1st, 2026"
  const day = dateObj.getDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? 'st'
    : day % 10 === 2 && day !== 12 ? 'nd'
    : day % 10 === 3 && day !== 13 ? 'rd'
    : 'th';

  return `Choose ${formatted.replace(
    `${day},`,
    `${day}${suffix},`
  )}`;
}

export async function selectDateRange(page, startDay, endDay) {
  // 1️⃣ Scope to Advance Filters dialog
  const filtersDialog = page.getByRole('dialog', { name: /advance filters/i });
  await expect(filtersDialog).toBeVisible();

  // 2️⃣ Open Date Range picker
  const dateRangeCombo = filtersDialog
    .locator('p:has-text("Date Range")')
    .locator('..')
    .getByRole('combobox');

  await dateRangeCombo.click();

  // 3️⃣ Two calendars open
  const calendars = page.getByRole('dialog', { name: 'Choose Date' });
  await expect(calendars).toHaveCount(2);

  const fromCalendar = calendars.first();
  const toCalendar = calendars.nth(1);

  // ⚠️ Hard-coded month/year based on your example
  // Adjust if month navigation is added later
  const startDate = new Date(2026, 0, startDay); // Jan
  const endDate = new Date(2026, 1, endDay);     // Feb

  const startAriaLabel = buildAriaLabel(startDate);
  const endAriaLabel = buildAriaLabel(endDate);

  // 4️⃣ Select start date (FROM)
  await fromCalendar.getByRole('option', {
    name: startAriaLabel,
  }).click();

  // 5️⃣ Select end date (TO) ✅ FIX
  await toCalendar.getByRole('option', {
    name: endAriaLabel,
  }).click();

  // 6️⃣ Apply
  await page.getByRole('button', { name: 'Done' }).click();
}

// utils/dropdownHelper.js
import { expect } from '@playwright/test';

export async function selectFromSearchableDropdown(
  page,
  labelText,
  searchText,
  optionText
) {
  // 1️⃣ Locate filter block by label
  const filterBlock = page
    .getByText(labelText, { exact: false })
    .locator('..');

  // 2️⃣ Click & type into combobox (this IS the search)
  const combobox = filterBlock.getByRole('combobox');
  await expect(combobox).toBeVisible();
  await combobox.click();
  await combobox.fill(searchText);

  // 3️⃣ Dropdown results panel (appears after typing)
  const dropdownPanel = page.locator(
    '[role="listbox"], .MuiAutocomplete-popper, .dropdown-menu'
  ).first();

  await expect(dropdownPanel).toBeVisible({ timeout: 5000 });

  // 4️⃣ Select option INSIDE dropdown (checkbox label)
  const option = dropdownPanel.getByText(optionText, { exact: false });

  await expect(option).toBeVisible({ timeout: 5000 });
  await option.click();
}

// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto("https://in.linkedin.com/");
  await page.click("a[href='https://www.linkedin.com/login']");
  await page.fill("#username", "eashunagarkar15@gmail.com");
  await page.fill("#password", "Eashwari@15");
  await page.click("button[type='submit']");
  await page.waitForTimeout(2000);
  await page.click("div.profile-card-member-details a");
  await page.click("a[href='/in/eashwari-nagarkar/edit/intro/?profileFormEntryPoint=PROFILE_SECTION']");
  await page.click("div.fb-gai-text__component textarea");
  await page.waitForTimeout(5000);
  await page.fill("textarea","Manual & Automation Testing | Software Development");
  await page.click("button[data-view-name='profile-form-save']");
  await page.waitForTimeout(5000);
});

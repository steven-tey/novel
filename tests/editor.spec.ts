import { test, expect } from '@playwright/test';

test('editing the content should work', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByText("Hello World!")).toHaveCount(0)
  
  await page.getByRole('heading', { name: 'Introducing Novel' }).click();
  await page.keyboard.press('Enter');
  await page.keyboard.type('Hello World!');
  
  await expect(page.getByText("Hello World!")).toHaveCount(1)
});

test('pressing `/` should open the slash menu', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator("#slash-command")).toHaveCount(0)
  
  await page.getByRole('heading', { name: 'Introducing Novel' }).click();
  await page.keyboard.press('Enter');
  await page.keyboard.press('/');
  
  await expect(page.locator("#slash-command")).toHaveCount(1)
});

test('highlighting text should open the bubble menu', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator(".tippy-box")).toHaveCount(0)
  
  await page.getByRole('heading', { name: 'Introducing Novel' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('heading', { name: 'Introducing Novel' }).dblclick();

  await page.waitForTimeout(3000);
  
  await expect(page.locator(".tippy-box")).toHaveCount(1)
});
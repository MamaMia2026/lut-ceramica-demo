const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const URL = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;

let errors;

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console.error: ' + m.text());
  });
  await page.goto(URL);
  await page.waitForLoadState('load');
});

test.afterEach(() => {
  expect(errors, 'erori JS / console.error').toEqual([]);
});

test('fără erori JS și fără overflow orizontal', async ({ page }) => {
  // parcurge pagina ca să declanșeze eventualele animații la scroll
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(300);
  const { sw, bw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    bw: document.body.scrollWidth,
  }));
  const vw = page.viewportSize().width;
  expect(sw).toBeLessThanOrEqual(vw);
  expect(bw).toBeLessThanOrEqual(vw);
});

test('#hb vizibil doar pe mobil', async ({ page }) => {
  const hb = page.locator('#hb');
  if (page.viewportSize().width <= 390) await expect(hb).toBeVisible();
  else await expect(hb).toBeHidden();
});

test('laborator: bol + pătat + gravură „Mara” × 6 = 486 lei', async ({ page }) => {
  await page.locator('#fm button[data-f="bol"]').click();
  await page.locator('#fin button[data-v="s"]').click();
  await page.locator('#eng').fill('Mara');
  for (let i = 0; i < 5; i++) await page.locator('#qp').click();
  await expect(page.locator('#tot')).toContainText('486 lei');
});

test('#ladd adaugă în coș: #cn devine 1', async ({ page }) => {
  await expect(page.locator('#cn')).toHaveText('0');
  await page.locator('#ladd').click();
  await expect(page.locator('#cn')).toHaveText('1');
});

test('restaurante: estimarea implicită este 9.680 lei', async ({ page }) => {
  await page.locator('#bt').scrollIntoViewIfNeeded();
  await expect(page.locator('#bt')).toHaveText('9.680 lei');
});

test('raft: prima piesă devine „Rezervată” și #cn crește', async ({ page }) => {
  const cn = page.locator('#cn');
  const before = parseInt(await cn.textContent(), 10);
  const btn = page.locator('#shelf button').first();
  await btn.click();
  await expect(btn).toHaveText('Rezervată');
  await expect
    .poll(async () => parseInt(await cn.textContent(), 10))
    .toBeGreaterThan(before);
});

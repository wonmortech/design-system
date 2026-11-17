import { test, expect } from '@playwright/test';

const ROUTES = [
  ['', 'One set of tokens'],
  ['colour', 'Colour'],
  ['contrast', 'Contrast'],
  ['type', 'Type'],
  ['layout', 'Spacing & layout'],
  ['motion', 'Motion'],
  ['components', 'Components'],
  ['themes', 'Themes'],
  ['playground', 'Playground'],
  ['tokens', 'All tokens'],
];

function watch(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return errors;
}

for (const [hash, title] of ROUTES) {
  test(`route #/${hash} renders`, async ({ page }) => {
    const errors = watch(page);
    await page.goto('./#/' + hash);
    await expect(page.locator('html')).toHaveAttribute('data-ready', '1');
    await expect(page.locator('main h1')).toContainText(title);
    await expect(page.locator('.demo-pill')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('tokens load from tokens.json and the fonts resolve', async ({ page }) => {
  await page.goto('./#/tokens');
  await expect(page.locator('main tbody tr')).toHaveCount(await page.evaluate(async () => {
    let n = 0;
    (function walk(o) { for (const [k, v] of Object.entries(o)) { if (k.startsWith('$')) continue; if (v && 'value' in v) n++; else if (v && typeof v === 'object') walk(v); } })(await (await fetch('tokens/tokens.json')).json());
    return n;
  }));
  const loaded = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family); });
  expect(loaded.join(' ')).toContain('Wm Sans');
});

test('theme switch swaps semantic tokens', async ({ page }) => {
  await page.goto('./#/colour');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(await bg()).toBe('rgb(250, 249, 245)');
  await page.click('.theme-switch [data-theme="slate"]');
  await expect.poll(bg).toBe('rgb(20, 20, 19)');
});

test('component table supports add, edit and delete in memory', async ({ page }) => {
  await page.goto('./#/components');
  const rows = page.locator('.tbl-wrap tbody tr');
  await expect(rows).toHaveCount(30);
  await page.click('#add');
  await page.fill('[name=name]', 'Sabina Olimova');
  await page.fill('[name=org]', 'Test club');
  await page.fill('[name=amount]', '1000000');
  await page.click('#save');
  await expect(rows).toHaveCount(31);
  await expect(rows.first()).toContainText('Sabina Olimova');
  await rows.first().locator('[data-edit]').click();
  await page.fill('[name=name]', 'Sabina Olimova-Karimova');
  await page.click('#save');
  await expect(rows.first()).toContainText('Olimova-Karimova');
  await rows.first().locator('[data-del]').click();
  await expect(rows).toHaveCount(30);
  await page.fill('#q', 'nobody-matches-this');
  await expect(page.locator('.empty')).toContainText('No rows match');
  await page.reload();
  await expect(rows).toHaveCount(30);
});

test('playground exports CSS and warns on low contrast', async ({ page }) => {
  await page.goto('./#/playground');
  await page.fill('[data-t="--theme-foreground-primary"]', '#dddddd');
  await page.dispatchEvent('[data-t="--theme-foreground-primary"]', 'change');
  await expect(page.locator('#out')).toHaveValue(/--theme-foreground-primary: #dddddd/);
  await expect(page.locator('#pgwarn')).toContainText('below AA');
});

test('contrast checker grades a pair', async ({ page }) => {
  await page.goto('./#/contrast');
  await expect(page.locator('main')).toContainText('AAA');
});

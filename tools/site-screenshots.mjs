// README screenshots from the token playground: builds it, serves it under the wonmor.io CSP, visits every
// section (with dialogs open and controls moved where it matters) and writes 1440x900 JPEGs plus one phone
// shot to docs/screenshots/. Run again whenever the tokens or the playground change:  npm run site:screenshots
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { build } from './build-demo.mjs';
import { start, BASE } from './serve-demo.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIR = join(ROOT, 'docs', 'screenshots');
mkdirSync(DIR, { recursive: true });
build();
const server = await start(4281);
const url = `http://127.0.0.1:4281${BASE}`;
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });

async function shot(name, hash, act, opts = {}) {
  const ctx = await browser.newContext({ viewport: opts.phone ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: opts.phone ? 2 : 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url + (opts.query || '') + '#' + hash);
  await page.waitForSelector('html[data-ready="1"]');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  if (act) await act(page);
  await page.waitForTimeout(450);
  await page.screenshot({ path: join(DIR, name + '.jpg'), type: 'jpeg', quality: 78 });
  if (errors.length) throw new Error(name + ': ' + errors.join('; '));
  console.log('shot', name);
  await ctx.close();
}

try {
  await shot('overview', '/');
  await shot('colour', '/colour');
  await shot('contrast', '/contrast', async (p) => { await p.selectOption('#fg', '--theme-foreground-tertiary'); await p.selectOption('#bg', '--theme-background-tertiary'); });
  await shot('type', '/type', async (p) => { await p.fill('#vw', '1920'); await p.dispatchEvent('#vw', 'input'); await p.selectOption('#fam', 'serif'); });
  await shot('layout', '/layout', async (p) => { await p.click('[data-w="768"]'); });
  await shot('motion', '/motion', async (p) => { await p.fill('#dur', '400'); await p.dispatchEvent('#dur', 'input'); await p.click('#all'); await p.waitForTimeout(500); });
  await shot('components', '/components', async (p) => { await p.locator('h2', { hasText: 'Table' }).scrollIntoViewIfNeeded(); await p.click('#add'); await p.fill('[name=name]', 'Sabina Olimova'); await p.fill('[name=org]', 'Bektemir bogʻbonlar jamiyati'); await p.fill('[name=amount]', '3750000'); });
  await shot('table', '/components', async (p) => { await p.click('[data-status="pending"]'); await p.locator('.toolbar').scrollIntoViewIfNeeded(); });
  await shot('themes', '/themes');
  await shot('slate', '/colour', null, { query: '?theme=slate' });
  await shot('playground', '/playground', async (p) => { await p.click('#preset'); });
  await shot('tokens', '/tokens', async (p) => { await p.click('[data-g="easing"]'); await p.click('[data-g="theme"]'); });
  await shot('phone', '/themes', null, { phone: true });
} finally {
  await browser.close();
  server.close();
}

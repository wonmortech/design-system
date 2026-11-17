// Smoke tests for the token playground (demo/), built by tools/build-demo.mjs and served under the wonmor.io
// CSP at /demo/design-system/.   npm run test:demo
import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.DEMO_PORT) || 4282;
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: 'tests/demo',
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: { baseURL: `http://127.0.0.1:${PORT}/demo/design-system/` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: executablePath ? { executablePath } : {} } }],
  webServer: {
    command: 'node tools/build-demo.mjs && node tools/serve-demo.mjs',
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}/demo/design-system/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});

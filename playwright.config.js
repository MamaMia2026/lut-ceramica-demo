const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: [['list']],
  use: { browserName: 'chromium' },
  projects: [
    { name: 'desktop-1440', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobil-390', use: { viewport: { width: 390, height: 844 } } },
  ],
});

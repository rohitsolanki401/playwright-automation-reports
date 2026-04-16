// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: 1,

  workers: 1,

  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],

  use: {
    baseURL: 'https://crmqa2.pooraa.net',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [

    // 🔐 Authentication Setup Project
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },

    // 🌐 Chromium
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json'
      },
      dependencies: ['setup'],
    },

    // 🦊 Firefox
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json'
      },
      dependencies: ['setup'],
    },

    // 🧭 Safari / Webkit
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json'
      },
      dependencies: ['setup'],
    }

  ],

});
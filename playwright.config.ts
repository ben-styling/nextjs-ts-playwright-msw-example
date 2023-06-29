import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";
import path from "path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();
// or
// require('dotenv').config({ path: '.env.test' });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const projectDir = path.join(process.cwd(), "tests");
loadEnvConfig(projectDir);

const config = defineConfig({
  globalSetup: "./tests/global-setup.ts",
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: process.env.CI ? 60 * 1000 : 40 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: process.env.CI ? 30 * 1000 : 20 * 1000,
  },
  maxFailures: 4,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : "90%",
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    // actionTimeout: 0,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
    timezoneId: "Europe/London",
    locale: "en-GB",
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
});

export default config;

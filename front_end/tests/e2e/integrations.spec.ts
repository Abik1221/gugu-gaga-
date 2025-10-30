import { test, expect } from '@playwright/test';

const OWNER_EMAIL = process.env.E2E_OWNER_EMAIL || '';
const OWNER_PASSWORD = process.env.E2E_OWNER_PASSWORD || '';
const TENANT_ID = process.env.E2E_TENANT_ID || '';
const PROVIDER_KEY = process.env.E2E_INTEGRATION_KEY || 'google_sheets';

function requireEnv(value: string, name: string): void {
  if (!value) {
    throw new Error(`Missing required env var ${name} for Integrations E2E test`);
  }
}

test.describe('Owner integrations flow', () => {
  test.beforeEach(() => {
    requireEnv(OWNER_EMAIL, 'E2E_OWNER_EMAIL');
    requireEnv(OWNER_PASSWORD, 'E2E_OWNER_PASSWORD');
    requireEnv(TENANT_ID, 'E2E_TENANT_ID');
  });

  test('connects provider and triggers import', async ({ page }) => {
    await page.goto('/auth?tab=signin');
    await page.getByLabel('Email').fill(OWNER_EMAIL);
    await page.getByLabel('Password').fill(OWNER_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL('**/dashboard/owner**', { timeout: 30_000 });
    await expect(page.getByRole('heading', { level: 1, name: /welcome back/i })).toBeVisible();

    await page.getByRole('button', { name: /connect tools/i }).click();
    await page.waitForURL('**/dashboard/owner/integrations', { timeout: 10_000 });

    const providerCard = page.getByRole('heading', { name: new RegExp(PROVIDER_KEY.replace('_', ' '), 'i') });
    await expect(providerCard).toBeVisible();

    const connectButton = providerCard.locator('..').getByRole('button', { name: /connect/i });
    await connectButton.click();

    const sheet = page.locator('[role="dialog"]');
    await expect(sheet).toBeVisible();

    const continueButton = sheet.getByRole('button', { name: /continue to provider/i });
    await expect(continueButton).toBeVisible();

    await sheet.getByRole('button', { name: /cancel/i }).click();
    await expect(sheet).toBeHidden();

    if (process.env.E2E_PROVIDER_CONNECTED === '1') {
      const firstConnected = page.locator('[data-testid="connected-provider-card"]').first();
      await expect(firstConnected).toBeVisible();
      const importButton = firstConnected.getByRole('button', { name: /import/i }).first();
      await importButton.click();
      await expect(importButton).toBeDisabled({ timeout: 5_000 });
    }
  });
});

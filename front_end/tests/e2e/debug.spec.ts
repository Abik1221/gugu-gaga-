import { test, expect } from '@playwright/test';

test('debug auth redirect', async ({ page }) => {
    console.log('Starting debug test...');
    try {
        console.log('Navigating to /dashboard/affiliate...');
        const response = await page.goto('/dashboard/affiliate');
        console.log(`Response status: ${response?.status()}`);
        console.log(`Response headers: ${JSON.stringify(response?.headers())}`);
        console.log(`Current URL: ${page.url()}`);

        await expect(page).toHaveURL(/\/affiliate-signin/);
        console.log('Assertion passed!');
    } catch (error) {
        console.error('Test failed:', error);
        throw error;
    }
});

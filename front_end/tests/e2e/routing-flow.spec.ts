import { test, expect } from '@playwright/test';

test.describe('Routing Flow Tests', () => {

    test('Affiliate Registration -> Verify -> Dashboard', async ({ page }) => {
        // Mock the verification API
        await page.route('**/api/v1/auth/register/verify', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: 'mock_access_token',
                    refresh_token: 'mock_refresh_token',
                    user: {
                        id: '1',
                        email: 'affiliate@example.com',
                        role: 'affiliate',
                        full_name: 'Test Affiliate'
                    }
                })
            });
        });

        // Mock the /me API
        await page.route('**/api/v1/auth/me', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: '1',
                    email: 'affiliate@example.com',
                    role: 'affiliate',
                    full_name: 'Test Affiliate'
                })
            });
        });

        // Navigate to verify page with params
        await page.goto('/verify?email=affiliate@example.com&code=123456');

        // Fill code
        await page.fill('input[placeholder="Enter 6-digit code"]', '123456');
        await page.click('button:has-text("Verify account")');

        // Expect success message
        await expect(page.getByText('Account verified!')).toBeVisible();

        // Click "Go now" or wait for redirect
        await page.click('button:has-text("Go now")');

        // Should redirect to affiliate dashboard
        await expect(page).toHaveURL(/\/dashboard\/affiliate/);
    });

    test('Owner Registration -> Verify -> KYC Pending', async ({ page }) => {
        // Mock verification
        await page.route('**/api/v1/auth/register/verify', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: 'mock_owner_token',
                    refresh_token: 'mock_refresh_token',
                    user: {
                        id: '2',
                        email: 'owner@example.com',
                        role: 'pharmacy_owner',
                        kyc_status: 'pending',
                        subscription_status: 'inactive'
                    }
                })
            });
        });

        // Mock /me with KYC pending
        await page.route('**/api/v1/auth/me', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: '2',
                    email: 'owner@example.com',
                    role: 'pharmacy_owner',
                    kyc_status: 'pending',
                    subscription_status: 'inactive'
                })
            });
        });

        await page.goto('/verify?email=owner@example.com');
        await page.fill('input[placeholder="Enter 6-digit code"]', '123456');
        await page.click('button:has-text("Verify account")');
        await page.click('button:has-text("Go now")');

        // Should redirect to KYC pending
        await expect(page).toHaveURL(/\/dashboard\/kyc/);
    });

    test('Owner Login (KYC Approved, Payment Pending) -> Payment Pending', async ({ page }) => {
        // Mock /me with KYC approved but Payment pending
        await page.route('**/api/v1/auth/me', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: '2',
                    email: 'owner@example.com',
                    role: 'pharmacy_owner',
                    kyc_status: 'approved',
                    subscription_status: 'inactive'
                })
            });
        });

        // Set token manually to simulate login
        await page.addInitScript(() => {
            localStorage.setItem('access_token', 'mock_owner_token');
            document.cookie = "access_token=mock_owner_token; path=/";
        });

        await page.goto('/dashboard/owner');

        // Should redirect to Payment pending
        await expect(page).toHaveURL(/\/dashboard\/payment/);
    });

    test('Owner Login (Active) -> Dashboard', async ({ page }) => {
        // Mock /me with everything active
        await page.route('**/api/v1/auth/me', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: '2',
                    email: 'owner@example.com',
                    role: 'pharmacy_owner',
                    kyc_status: 'approved',
                    subscription_status: 'active'
                })
            });
        });

        await page.addInitScript(() => {
            localStorage.setItem('access_token', 'mock_owner_token');
            document.cookie = "access_token=mock_owner_token; path=/";
        });

        await page.goto('/dashboard/owner');

        // Should stay on dashboard (or redirect to it if we went to root)
        await expect(page).toHaveURL(/\/dashboard\/owner/);
        await expect(page.getByText('KYC Verification Pending')).not.toBeVisible();
    });

});

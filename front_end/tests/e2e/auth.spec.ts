import { test, expect } from '@playwright/test';

/**
 * Comprehensive Authentication Tests
 * These tests ensure that dashboard routes are properly protected
 * and that users are redirected to appropriate login pages when not authenticated.
 */

test.describe('Authentication Protection', () => {

    test.describe('Unauthenticated Access', () => {

        test('should redirect to affiliate sign-in when accessing affiliate dashboard without auth', async ({ page }) => {
            // Navigate to affiliate dashboard without authentication
            await page.goto('/dashboard/affiliate');

            // Should redirect to affiliate sign-in page
            await expect(page).toHaveURL(/\/affiliate-signin/);
        });

        test('should redirect to owner sign-in when accessing owner dashboard without auth', async ({ page }) => {
            // Navigate to owner dashboard without authentication
            await page.goto('/dashboard/owner');

            // Should redirect to owner sign-in page
            await expect(page).toHaveURL(/\/owner-signin/);
        });

        test('should redirect to supplier sign-in when accessing supplier dashboard without auth', async ({ page }) => {
            // Navigate to supplier dashboard without authentication
            await page.goto('/dashboard/supplier');

            // Should redirect to supplier sign-in page
            await expect(page).toHaveURL(/\/supplier-signin/);
        });

        test('should not allow direct URL access to affiliate dashboard', async ({ page, context }) => {
            // Clear all cookies and local storage
            await context.clearCookies();
            await page.goto('/');
            await page.evaluate(() => localStorage.clear());

            // Try to access affiliate dashboard directly
            const response = await page.goto('/dashboard/affiliate');

            // Should redirect, not show dashboard content
            await expect(page).not.toHaveURL(/\/dashboard\/affiliate$/);
            await expect(page.locator('text=Affiliate Dashboard')).not.toBeVisible();
        });

        test('should not allow direct URL access to owner dashboard', async ({ page, context }) => {
            // Clear all cookies and local storage
            await context.clearCookies();
            await page.goto('/');
            await page.evaluate(() => localStorage.clear());

            // Try to access owner dashboard directly
            const response = await page.goto('/dashboard/owner');

            // Should redirect, not show dashboard content
            await expect(page).not.toHaveURL(/\/dashboard\/owner$/);
        });

        test('should not allow direct URL access to supplier dashboard', async ({ page, context }) => {
            // Clear all cookies and local storage
            await context.clearCookies();
            await page.goto('/');
            await page.evaluate(() => localStorage.clear());

            // Try to access supplier dashboard directly
            const response = await page.goto('/dashboard/supplier');

            // Should redirect, not show dashboard content
            await expect(page).not.toHaveURL(/\/dashboard\/supplier$/);
        });
    });

    test.describe('Authenticated Access with Correct Role', () => {

        test('affiliate user should access affiliate dashboard after login', async ({ page }) => {
            // Navigate to affiliate sign-in
            await page.goto('/affiliate-signin');

            // Fill in login form (replace with actual test credentials)
            await page.fill('[type="email"]', 'affiliate@test.com');
            await page.fill('[type="password"]', 'testpassword');

            // Submit form
            await page.click('button[type="submit"]');

            // Wait for redirect to affiliate dashboard
            await page.waitForURL(/\/dashboard\/affiliate/);

            // Verify we're on the dashboard and not seeing mock data
            await expect(page).toHaveURL(/\/dashboard\/affiliate/);
            await expect(page.locator('text=Affiliate Dashboard')).toBeVisible();

            // Verify no "John Doe" placeholder data is shown
            const bodyText = await page.textContent('body');
            expect(bodyText).not.toContain('John Doe');
        });

        test('owner user should access owner dashboard after login', async ({ page }) => {
            // Navigate to owner sign-in
            await page.goto('/owner-signin');

            // Fill in login form (replace with actual test credentials)
            await page.fill('[type="email"]', 'owner@test.com');
            await page.fill('[type="password"]', 'testpassword');

            // Submit form
            await page.click('button[type="submit"]');

            // Wait for redirect to owner dashboard
            await page.waitForURL(/\/dashboard\/owner/);

            // Verify we're on the dashboard
            await expect(page).toHaveURL(/\/dashboard\/owner/);
        });
    });

    test.describe('Role-Based Access Control', () => {

        test('affiliate user should not access owner dashboard', async ({ page, context }) => {
            // Simulate affiliate user authentication
            await context.addCookies([{
                name: 'access_token',
                value: 'mock_affiliate_token',
                domain: 'localhost',
                path: '/'
            }]);

            await page.goto('/');
            await page.evaluate(() => {
                localStorage.setItem('access_token', 'mock_affiliate_token');
                localStorage.setItem('user_role', 'affiliate');
            });

            // Try to access owner dashboard
            await page.goto('/dashboard/owner');

            // Should be redirected away from owner dashboard
            await page.waitForURL(/^(?!.*\/dashboard\/owner$)/);
        });

        test('owner user should not access affiliate dashboard', async ({ page, context }) => {
            // Simulate owner user authentication
            await context.addCookies([{
                name: 'access_token',
                value: 'mock_owner_token',
                domain: 'localhost',
                path: '/'
            }]);

            await page.goto('/');
            await page.evaluate(() => {
                localStorage.setItem('access_token', 'mock_owner_token');
                localStorage.setItem('user_role', 'pharmacy_owner');
            });

            // Try to access affiliate dashboard
            await page.goto('/dashboard/affiliate');

            // Should be redirected away from affiliate dashboard
            await page.waitForURL(/^(?!.*\/dashboard\/affiliate$)/);
        });
    });

    test.describe('Session Validation', () => {

        test('should redirect to login when token is invalid', async ({ page, context }) => {
            // Set an invalid/expired token
            await context.addCookies([{
                name: 'access_token',
                value: 'invalid_or_expired_token',
                domain: 'localhost',
                path: '/'
            }]);

            await page.goto('/');
            await page.evaluate(() => {
                localStorage.setItem('access_token', 'invalid_or_expired_token');
            });

            // Try to access dashboard
            await page.goto('/dashboard/affiliate');

            // Should redirect to sign-in
            await expect(page).toHaveURL(/signin/);
        });

        test('should show loading state while checking authentication', async ({ page }) => {
            // Navigate to dashboard
            const navigation = page.goto('/dashboard/affiliate');

            // Should show loading skeleton while checking auth
            await expect(page.locator('.animate-spin')).toBeVisible({ timeout: 1000 });
        });
    });

    test.describe('No Placeholder Data', () => {

        test('marketing pages should not contain John Doe placeholder', async ({ page }) => {
            // Check main marketing page
            await page.goto('/');
            const homeContent = await page.textContent('body');

            // Verify John Doe is not used as a placeholder
            const inputs = await page.locator('input[placeholder]').all();
            for (const input of inputs) {
                const placeholder = await input.getAttribute('placeholder');
                expect(placeholder).not.toBe('John Doe');
            }
        });

        test('request integration page should not contain John Doe placeholder', async ({ page }) => {
            await page.goto('/request-integration');

            // Check that placeholder is not "John Doe"
            const nameInput = page.locator('input[name="name"], input[placeholder*="Name"]').first();
            const placeholder = await nameInput.getAttribute('placeholder');

            expect(placeholder).not.toBe('John Doe');
            expect(placeholder).toBeTruthy(); // Should have some placeholder
        });

        test('authenticated dashboards should show real user data, not mock data', async ({ page, context }) => {
            // This test requires actual authentication flow
            // Once logged in, verify that real user data is displayed

            // Note: This is a placeholder for actual implementation
            // You would need to:
            // 1. Authenticate a test user
            // 2. Navigate to their dashboard
            // 3. Verify their real name/email is shown
            // 4. Verify "John Doe" or "TENANT-001" mock data is NOT shown
        });
    });

    test.describe('Middleware Protection', () => {

        test('middleware should protect all dashboard routes', async ({ page, context }) => {
            // Clear authentication
            await context.clearCookies();
            await page.goto('/');
            await page.evaluate(() => localStorage.clear());

            const protectedRoutes = [
                '/dashboard/affiliate',
                '/dashboard/owner',
                '/dashboard/supplier',
                '/dashboard/admin',
                '/dashboard/staff'
            ];

            for (const route of protectedRoutes) {
                await page.goto(route);

                // Should not stay on the protected route
                await expect(page).not.toHaveURL(route);

                // Should be redirected to a sign-in page
                const currentUrl = page.url();
                expect(currentUrl).toMatch(/signin|login/);
            }
        });

        test('middleware should allow access to public routes', async ({ page, context }) => {
            // Clear authentication
            await context.clearCookies();
            await page.goto('/');
            await page.evaluate(() => localStorage.clear());

            const publicRoutes = [
                '/',
                '/affiliate-signin',
                '/owner-signin',
                '/supplier-signin',
            ];

            for (const route of publicRoutes) {
                const response = await page.goto(route);

                // Should successfully load
                expect(response?.status()).toBeLessThan(400);

                // Should stay on the route (not redirect)
                await expect(page).toHaveURL(route);
            }
        });
    });
});

const { test, expect } = require('@playwright/test');

test('scenario 1: direct access to contact page', async ({ page }) => {
    console.log('=== DIRECT ACCESS TEST ===');

    await page.goto('http://localhost:8888/contact/');
    await page.waitForLoadState('networkidle');

    console.log('Waiting 2 seconds for form replacement...');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'tests/screenshots/direct-access.png', fullPage: true });

    const customForm = page.locator('.custom-contact-form-container');
    const firstName = page.locator('input[name="firstName"]');
    const message = page.locator('textarea[name="message"]');

    await expect(customForm).toBeVisible();
    await expect(firstName).toBeVisible();
    await expect(message).toBeVisible();

    console.log('✓ Direct access works - all fields visible!');
});

test('scenario 2: navigation from menu', async ({ page }) => {
    console.log('=== MENU NAVIGATION TEST ===');

    // Start at home
    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');

    console.log('Clicking Контакты link...');
    await page.locator('a:has-text("Контакты")').click();
    await page.waitForLoadState('networkidle');

    console.log('Waiting 2 seconds for form replacement...');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'tests/screenshots/menu-navigation.png', fullPage: true });

    const customForm = page.locator('.custom-contact-form-container');
    const firstName = page.locator('input[name="firstName"]');
    const message = page.locator('textarea[name="message"]');

    await expect(customForm).toBeVisible();
    await expect(firstName).toBeVisible();
    await expect(message).toBeVisible();

    console.log('✓ Menu navigation works - all fields visible!');
});

test('scenario 3: navigate away and back', async ({ page }) => {
    console.log('=== NAVIGATE AWAY AND BACK TEST ===');

    // Start at contact page
    await page.goto('http://localhost:8888/contact/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('Form loaded on contact page');

    // Navigate away to home
    await page.locator('a:has-text("Что мы делаем")').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    console.log('Navigated to home, going back to contact...');

    // Navigate back to contact
    await page.locator('a:has-text("Контакты")').click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'tests/screenshots/navigate-back.png', fullPage: true });

    const customForm = page.locator('.custom-contact-form-container');
    const message = page.locator('textarea[name="message"]');

    await expect(customForm).toBeVisible();
    await expect(message).toBeVisible();

    console.log('✓ Navigate away and back works - form re-rendered!');
});

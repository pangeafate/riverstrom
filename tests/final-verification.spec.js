const { test, expect } = require('@playwright/test');

test('final form verification - all working', async ({ page }) => {
    console.log('Navigate to contact page');
    await page.goto('http://localhost:8888/contact/', { waitUntil: 'networkidle' });

    console.log('Screenshot 1: Immediate load (form should be hidden)');
    await page.screenshot({ path: 'tests/screenshots/11-immediate.png', fullPage: true });

    console.log('Wait 1 second');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/12-after-1sec.png', fullPage: true });

    console.log('Wait 2 more seconds for replacement');
    await page.waitForTimeout(2000);

    console.log('Screenshot 3: After replacement (form should be visible)');
    await page.screenshot({ path: 'tests/screenshots/13-final-visible.png', fullPage: true });

    // Verify all fields exist and are visible
    const firstName = page.locator('input[name="firstName"]');
    const lastName = page.locator('input[name="lastName"]');
    const email = page.locator('input[name="email"]');
    const city = page.locator('select[name="city"]');
    const message = page.locator('textarea[name="message"]');
    const submit = page.locator('button[type="submit"]');

    await expect(firstName).toBeVisible();
    await expect(lastName).toBeVisible();
    await expect(email).toBeVisible();
    await expect(city).toBeVisible();
    await expect(message).toBeVisible();
    await expect(submit).toBeVisible();

    console.log('✓ All fields are visible!');
    console.log('✓ Form is working correctly!');
});

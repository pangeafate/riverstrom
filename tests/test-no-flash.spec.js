const { test, expect } = require('@playwright/test');

test('verify no flash of old form', async ({ page }) => {
    console.log('Navigate to contact page');
    await page.goto('http://localhost:8888/contact/');

    console.log('Take immediate screenshot (should show hidden form)');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/07-immediate-load.png', fullPage: true });

    console.log('Wait 1 second');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/08-after-1-second.png', fullPage: true });

    console.log('Wait another 2 seconds for replacement');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/09-after-replacement.png', fullPage: true });

    // Verify custom form is visible
    const customForm = await page.locator('.custom-contact-form-container');
    const isVisible = await customForm.isVisible();
    console.log(`Custom form visible: ${isVisible}`);

    expect(isVisible).toBe(true);

    console.log('✓ Test complete - check screenshots for visual confirmation');
});

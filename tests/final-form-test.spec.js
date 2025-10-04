const { test, expect } = require('@playwright/test');

test('final form rendering verification', async ({ page }) => {
    console.log('Navigate to contact page');
    await page.goto('http://localhost:8888/contact/');
    await page.waitForLoadState('networkidle');

    console.log('Wait 1 second for initial load');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/05-before-replacement.png', fullPage: true });

    console.log('Wait 5 more seconds for form replacement');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'tests/screenshots/06-after-replacement.png', fullPage: true });

    // Check if form is visible
    const customForm = await page.locator('.custom-contact-form-container');
    const isVisible = await customForm.isVisible();
    console.log(`Custom form is visible: ${isVisible}`);

    const opacity = await customForm.evaluate(el => window.getComputedStyle(el).opacity);
    console.log(`Form opacity: ${opacity}`);

    expect(isVisible).toBe(true);
    expect(opacity).toBe('1');

    console.log('✓ Form is rendering correctly!');
});

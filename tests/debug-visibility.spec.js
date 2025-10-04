const { test } = require('@playwright/test');

test('debug form visibility', async ({ page }) => {
    await page.goto('http://localhost:8888/contact/');
    await page.waitForLoadState('networkidle');

    console.log('Wait 3 seconds for script');
    await page.waitForTimeout(3000);

    // Check if form container exists and has form-visible class
    const containerExists = await page.locator('.framer-aemcht[data-framer-name="Form"]').count();
    console.log(`Form container exists: ${containerExists > 0}`);

    if (containerExists > 0) {
        const hasClass = await page.locator('.framer-aemcht[data-framer-name="Form"]').evaluate(el => {
            return {
                hasFormVisibleClass: el.classList.contains('form-visible'),
                classList: Array.from(el.classList),
                computedOpacity: window.getComputedStyle(el).opacity,
                inlineOpacity: el.style.opacity
            };
        });
        console.log('Container state:', JSON.stringify(hasClass, null, 2));
    }

    // Check if custom form exists
    const customFormExists = await page.locator('.custom-contact-form-container').count();
    console.log(`Custom form exists in DOM: ${customFormExists > 0}`);

    await page.screenshot({ path: 'tests/screenshots/10-debug-visibility.png', fullPage: true });
});

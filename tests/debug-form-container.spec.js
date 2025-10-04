const { test } = require('@playwright/test');

test('debug form container presence', async ({ page }) => {
    await page.goto('http://localhost:8888/contact/');
    await page.waitForLoadState('networkidle');

    // Check initial HTML for Framer form
    const framerForm = await page.locator('.framer-aemcht[data-framer-name="Form"]').count();
    console.log(`Framer form container found: ${framerForm}`);

    if (framerForm > 0) {
        const computed = await page.locator('.framer-aemcht[data-framer-name="Form"]').evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
                opacity: styles.opacity,
                pointerEvents: styles.pointerEvents,
                display: styles.display,
                visibility: styles.visibility,
                innerHTML: el.innerHTML.substring(0, 200)
            };
        });
        console.log('Framer form styles:', JSON.stringify(computed, null, 2));
    }

    // Wait for script to execute
    console.log('Waiting 5 seconds for custom form script...');
    await page.waitForTimeout(5000);

    // Check for custom form
    const customForm = await page.locator('.custom-contact-form-container').count();
    console.log(`Custom form found: ${customForm}`);

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/04-debug-form.png', fullPage: true });

    // Check if form was replaced
    const framerFormAfter = await page.locator('.framer-aemcht[data-framer-name="Form"]').count();
    console.log(`Framer form after replacement: ${framerFormAfter}`);

    if (framerFormAfter > 0) {
        const innerHTML = await page.locator('.framer-aemcht[data-framer-name="Form"]').innerHTML();
        console.log(`Form content length: ${innerHTML.length} characters`);
        if (innerHTML.includes('custom-contact-form-container')) {
            console.log('✓ Form was successfully replaced!');
        } else {
            console.log('✗ Form was NOT replaced - still contains Framer content');
        }
    }
});

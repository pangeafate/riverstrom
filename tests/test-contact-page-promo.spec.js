const { test } = require('@playwright/test');

test('verify contact page has promo code field', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/contact/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2500);

    // Check if promo code field exists
    const promoField = await page.locator('input[name="promoCode"]').count();
    console.log(`Promo code field count: ${promoField}`);

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/contact-page-with-promo.png' });

    // Check all form fields
    const formInfo = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) return { exists: false };

        const fields = Array.from(form.querySelectorAll('input, textarea, select')).map(field => ({
            tag: field.tagName,
            name: field.name || 'no-name',
            type: field.type || 'no-type'
        }));

        return {
            exists: true,
            fieldCount: fields.length,
            fields: fields
        };
    });

    console.log('Form info:', JSON.stringify(formInfo, null, 2));
});

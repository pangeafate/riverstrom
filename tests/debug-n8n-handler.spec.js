const { test } = require('@playwright/test');

test('debug N8N handler submission', async ({ page }) => {
    // Capture ALL console messages
    page.on('console', msg => console.log(`BROWSER [${msg.type()}]:`, msg.text()));

    // Capture console errors
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    // Capture network
    page.on('request', req => {
        if (req.url().includes('n8n')) {
            console.log('[N8N REQUEST]', req.method(), req.url());
            console.log('[N8N DATA]', req.postDataJSON());
        }
    });

    page.on('response', async resp => {
        if (resp.url().includes('n8n')) {
            console.log('[N8N RESPONSE]', resp.status());
        }
    });

    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('\n=== FILLING FORM ===');
    await page.locator('input[type="email"]').first().fill('debug@test.com');
    await page.locator('textarea').first().fill('Debug message');

    console.log('\n=== CLICKING SUBMIT ===');
    await page.locator('button[type="submit"]').first().click();

    console.log('\n=== WAITING FOR RESPONSE ===');
    await page.waitForTimeout(3000);

    // Check form state after submission
    const formState = await page.evaluate(() => {
        const form = document.querySelector('form');
        const button = form?.querySelector('button[type="submit"]');
        return {
            buttonText: button?.textContent,
            buttonDisabled: button?.disabled,
            formData: form ? Array.from(new FormData(form)).reduce((acc, [key, val]) => {
                acc[key] = val;
                return acc;
            }, {}) : {}
        };
    });

    console.log('\n=== FORM STATE AFTER SUBMIT ===');
    console.log(JSON.stringify(formState, null, 2));
});

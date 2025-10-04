const { test, expect } = require('@playwright/test');

test('bottom form submission to N8N', async ({ page }) => {
    // Listen for network requests
    const n8nRequests = [];
    page.on('request', request => {
        if (request.url().includes('n8n.lakestrom.com')) {
            n8nRequests.push({
                url: request.url(),
                method: request.method(),
                postData: request.postDataJSON()
            });
            console.log('[N8N REQUEST]', request.method(), request.url());
            console.log('[N8N DATA]', JSON.stringify(request.postDataJSON(), null, 2));
        }
    });

    page.on('response', async response => {
        if (response.url().includes('n8n.lakestrom.com')) {
            console.log('[N8N RESPONSE]', response.status(), response.statusText());
            try {
                const body = await response.text();
                console.log('[N8N RESPONSE BODY]', body);
            } catch(e) {}
        }
    });

    // Enable console logging
    page.on('console', msg => {
        if (msg.text().includes('N8N')) {
            console.log('BROWSER:', msg.text());
        }
    });

    console.log('Navigate to main page');
    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for handler to attach

    console.log('Looking for form fields...');
    const emailInput = page.locator('input[type="email"]').first();
    const messageInput = page.locator('textarea').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    console.log('Filling form...');
    await emailInput.fill('test@example.com');
    await messageInput.fill('Test message from automated test');

    await page.screenshot({ path: 'tests/screenshots/form-before-submit.png', fullPage: true });

    console.log('Submitting form...');
    await submitButton.click();

    // Wait for submission to complete
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'tests/screenshots/form-after-submit.png', fullPage: true });

    console.log('Checking if N8N request was sent...');
    console.log(`Total N8N requests: ${n8nRequests.length}`);

    if (n8nRequests.length > 0) {
        console.log('✓ Form data sent to N8N!');
        expect(n8nRequests[0].postData).toHaveProperty('email', 'test@example.com');
        expect(n8nRequests[0].postData).toHaveProperty('message', 'Test message from automated test');
    } else {
        console.log('✗ No N8N request detected');
    }

    expect(n8nRequests.length).toBeGreaterThan(0);
});

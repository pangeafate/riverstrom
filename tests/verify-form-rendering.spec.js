const { test, expect } = require('@playwright/test');

test.describe('Contact Form Rendering Verification', () => {
    test('form should render with all fields visible', async ({ page }) => {
        console.log('Step 1: Navigate to contact page');
        await page.goto('http://localhost:8888/contact/');

        // Wait for page load
        await page.waitForLoadState('networkidle');

        console.log('Step 2: Take screenshot of initial page');
        await page.screenshot({ path: 'tests/screenshots/02-contact-form-check.png', fullPage: true });

        console.log('Step 3: Wait for custom form to load (5 seconds)');
        await page.waitForTimeout(5000);

        console.log('Step 4: Take screenshot after form replacement');
        await page.screenshot({ path: 'tests/screenshots/03-contact-form-replaced.png', fullPage: true });

        console.log('Step 5: Check for custom form container');
        const customForm = await page.locator('.custom-contact-form-container').count();
        console.log(`Custom form found: ${customForm > 0}`);

        console.log('Step 6: Check for all form fields');
        const firstName = await page.locator('input[name="firstName"]').count();
        const lastName = await page.locator('input[name="lastName"]').count();
        const email = await page.locator('input[name="email"]').count();
        const city = await page.locator('select[name="city"]').count();
        const message = await page.locator('textarea[name="message"]').count();
        const submitButton = await page.locator('button[type="submit"]').count();

        console.log(`Fields found: firstName=${firstName}, lastName=${lastName}, email=${email}, city=${city}, message=${message}, submit=${submitButton}`);

        console.log('Step 7: Verify all fields are present');
        expect(customForm).toBeGreaterThan(0);
        expect(firstName).toBeGreaterThan(0);
        expect(lastName).toBeGreaterThan(0);
        expect(email).toBeGreaterThan(0);
        expect(city).toBeGreaterThan(0);
        expect(message).toBeGreaterThan(0);
        expect(submitButton).toBeGreaterThan(0);

        console.log('✓ All fields verified successfully!');
    });
});

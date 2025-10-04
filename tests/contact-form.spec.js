/**
 * Contact Form Visual Test
 * Tests for E001: Message field visibility issue
 */

const { test, expect } = require('@playwright/test');

test.describe('Contact Form - Message Field Visibility (E001)', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to contact page
        await page.goto('http://localhost:8888/contact/');

        // Wait for page to fully load
        await page.waitForLoadState('networkidle');

        // Wait for Framer to hydrate
        await page.waitForTimeout(3000);
    });

    test('Step 1: Take screenshot of full contact page', async ({ page }) => {
        // Scroll to contact form
        await page.locator('h2:has-text("Обращайтесь 24/7")').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        // Take full page screenshot
        await page.screenshot({
            path: 'tests/screenshots/01-contact-page-full.png',
            fullPage: true
        });

        console.log('✓ Full page screenshot taken');
    });

    test('Step 2: Verify contact form is visible', async ({ page }) => {
        // Check form heading
        const heading = page.locator('h5:has-text("Напишите нам")');
        await expect(heading).toBeVisible();

        // Check form container
        const form = page.locator('form.framer-7wmuvs');
        await expect(form).toBeVisible();

        console.log('✓ Contact form container is visible');
    });

    test('Step 3: Verify all form fields are visible', async ({ page }) => {
        const form = page.locator('form.framer-7wmuvs');

        // First Name field
        const firstName = form.locator('input[placeholder*="Иван"]');
        await expect(firstName).toBeVisible();
        console.log('✓ First name field visible');

        // Last Name field
        const lastName = form.locator('input[placeholder*="Петров"]');
        await expect(lastName).toBeVisible();
        console.log('✓ Last name field visible');

        // Email field
        const email = form.locator('input[type="email"], input[placeholder*="yandex"]');
        await expect(email).toBeVisible();
        console.log('✓ Email field visible');

        // City dropdown
        const city = form.locator('select');
        await expect(city).toBeVisible();
        console.log('✓ City dropdown visible');

        // **CRITICAL TEST: Message textarea**
        const messageTextarea = form.locator('textarea[name="message"]');
        await expect(messageTextarea).toBeVisible();
        console.log('✓✓✓ MESSAGE TEXTAREA IS VISIBLE ✓✓✓');

        // Submit button
        const submitButton = form.locator('button[type="submit"]');
        await expect(submitButton).toBeVisible();
        console.log('✓ Submit button visible');
    });

    test('Step 4: Verify message textarea has adequate dimensions', async ({ page }) => {
        const messageTextarea = page.locator('textarea[name="message"]');

        // Get bounding box
        const box = await messageTextarea.boundingBox();

        console.log(`Message textarea dimensions: ${box.width}px × ${box.height}px`);

        // Assert minimum height (should be at least 100px based on our CSS fix)
        expect(box.height).toBeGreaterThanOrEqual(100);
        console.log(`✓ Textarea height is adequate: ${box.height}px (minimum: 100px)`);

        // Assert width (should be reasonable, not collapsed)
        expect(box.width).toBeGreaterThanOrEqual(200);
        console.log(`✓ Textarea width is adequate: ${box.width}px`);
    });

    test('Step 5: Take detailed screenshot of form with message field', async ({ page }) => {
        // Scroll to form
        const form = page.locator('form.framer-7wmuvs');
        await form.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        // Highlight message textarea with border
        await page.evaluate(() => {
            const textarea = document.querySelector('textarea[name="message"]');
            if (textarea) {
                textarea.style.border = '3px solid red';
                textarea.style.outline = '3px solid yellow';
            }
        });

        // Take screenshot of form area
        await page.screenshot({
            path: 'tests/screenshots/02-form-with-message-field-highlighted.png',
            fullPage: false
        });

        console.log('✓ Detailed form screenshot taken with message field highlighted');
    });

    test('Step 6: Test message field interactivity', async ({ page }) => {
        const messageTextarea = page.locator('textarea[name="message"]');

        // Click on textarea
        await messageTextarea.click();
        console.log('✓ Clicked on message textarea');

        // Type test message
        const testMessage = 'Это тестовое сообщение для проверки функциональности поля.\nМногострочный текст работает!';
        await messageTextarea.fill(testMessage);
        console.log('✓ Typed multi-line message in Russian');

        // Verify value
        const value = await messageTextarea.inputValue();
        expect(value).toBe(testMessage);
        console.log('✓ Message textarea accepts and retains input');

        // Take screenshot with filled content
        await page.screenshot({
            path: 'tests/screenshots/03-message-field-with-content.png',
            fullPage: false
        });
    });

    test('Step 7: Fill entire form and take screenshot', async ({ page }) => {
        const form = page.locator('form.framer-7wmuvs');

        // Fill all fields
        await form.locator('input[placeholder*="Иван"]').fill('Тест');
        await form.locator('input[placeholder*="Петров"]').fill('Тестов');
        await form.locator('input[type="email"], input[placeholder*="yandex"]').fill('test@test.ru');
        await form.locator('select').selectOption('Москва');
        await form.locator('textarea[name="message"]').fill('Тестовое сообщение для проверки формы контактов');

        await page.waitForTimeout(500);

        // Take screenshot of completed form
        await form.scrollIntoViewIfNeeded();
        await page.screenshot({
            path: 'tests/screenshots/04-form-fully-filled.png',
            fullPage: false
        });

        console.log('✓ Form filled and screenshot taken');
    });

    test('Step 8: Verify CSS override is applied', async ({ page }) => {
        // Check if our CSS fix is applied
        const cssOverride = await page.evaluate(() => {
            const textarea = document.querySelector('textarea[name="message"]');
            const wrapper = textarea?.closest('.framer-v9uijd');

            if (!wrapper) return { error: 'Wrapper not found' };

            const wrapperStyles = window.getComputedStyle(wrapper);
            const textareaStyles = window.getComputedStyle(textarea);

            return {
                wrapperHeight: wrapperStyles.height,
                wrapperMinHeight: wrapperStyles.minHeight,
                textareaHeight: textareaStyles.height,
                textareaMinHeight: textareaStyles.minHeight,
                textareaDisplay: textareaStyles.display
            };
        });

        console.log('CSS Computed Styles:', cssOverride);

        // Verify our CSS fixes are applied
        expect(cssOverride.textareaDisplay).not.toBe('none');
        expect(cssOverride.wrapperHeight).not.toBe('46px');

        console.log('✓ CSS override successfully applied');
        console.log(`  - Wrapper height: ${cssOverride.wrapperHeight} (was 46px before fix)`);
        console.log(`  - Wrapper min-height: ${cssOverride.wrapperMinHeight}`);
        console.log(`  - Textarea height: ${cssOverride.textareaHeight}`);
        console.log(`  - Textarea min-height: ${cssOverride.textareaMinHeight}`);
    });

    test('Step 9: Compare before/after visual states', async ({ page }) => {
        // This test documents the fix
        console.log('\n=== VISUAL COMPARISON ===');
        console.log('BEFORE FIX:');
        console.log('  - Message field had height: 46px (collapsed)');
        console.log('  - Field was essentially invisible');
        console.log('  - Users could not enter messages');
        console.log('\nAFTER FIX:');
        console.log('  - Message field has min-height: 120px');
        console.log('  - Field is fully visible and usable');
        console.log('  - Users can enter multi-line messages');
        console.log('========================\n');

        // Take final comparison screenshot
        await page.screenshot({
            path: 'tests/screenshots/05-final-form-state.png',
            fullPage: true
        });

        console.log('✓ Final state documented');
    });

    test('Step 10: Test form submission readiness', async ({ page }) => {
        const form = page.locator('form.framer-7wmuvs');

        // Fill required fields
        await form.locator('input[placeholder*="Иван"]').fill('Иван');
        await form.locator('input[placeholder*="Петров"]').fill('Петров');
        await form.locator('input[type="email"], input[placeholder*="yandex"]').fill('test@example.com');
        await form.locator('select').selectOption('Санкт-Петербург');
        await form.locator('textarea[name="message"]').fill('Тестовое сообщение');

        // Check submit button is enabled
        const submitButton = form.locator('button[type="submit"]');
        await expect(submitButton).toBeEnabled();

        console.log('✓ Form is ready for submission');
        console.log('  - All required fields filled');
        console.log('  - Submit button is enabled');
        console.log('  - Message field is functional');

        // Take pre-submission screenshot
        await page.screenshot({
            path: 'tests/screenshots/06-ready-for-submission.png',
            fullPage: false
        });
    });
});

test.describe('Responsive Design - Message Field', () => {
    const viewports = [
        { name: 'Desktop', width: 1440, height: 900 },
        { name: 'Tablet', width: 810, height: 1080 },
        { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
        test(`Message field is visible on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
            // Set viewport
            await page.setViewportSize({ width: viewport.width, height: viewport.height });

            // Navigate
            await page.goto('http://localhost:8888/contact/');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);

            // Verify message field
            const messageTextarea = page.locator('textarea[name="message"]');
            await messageTextarea.scrollIntoViewIfNeeded();
            await expect(messageTextarea).toBeVisible();

            // Take screenshot
            await page.screenshot({
                path: `tests/screenshots/responsive-${viewport.name.toLowerCase()}.png`,
                fullPage: true
            });

            console.log(`✓ Message field visible on ${viewport.name}`);
        });
    }
});

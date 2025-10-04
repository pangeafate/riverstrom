const { test } = require('@playwright/test');

test('debug bottom form on main page', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    console.log('Navigate to main page');
    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');

    console.log('Wait for page to fully load');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'tests/screenshots/main-page-full.png', fullPage: true });

    console.log('Looking for form with text "Напишите свой вопрос"');
    const formHeading = await page.locator('text="Напишите свой вопрос"').count();
    console.log(`Form heading found: ${formHeading > 0}`);

    console.log('Looking for any forms on the page');
    const forms = await page.locator('form').count();
    console.log(`Total forms found: ${forms}`);

    if (forms > 0) {
        for (let i = 0; i < forms; i++) {
            const form = page.locator('form').nth(i);
            const className = await form.getAttribute('class');
            const dataName = await form.getAttribute('data-framer-name');
            console.log(`Form ${i}: class="${className}", data-framer-name="${dataName}"`);

            // Check if this form has the submit button with "Спасибо!"
            const hasButton = await form.locator('button:has-text("Спасибо")').count();
            if (hasButton > 0) {
                console.log(`  → This is the bottom form! Has "Спасибо!" button`);

                // Get all input fields
                const inputs = await form.locator('input').count();
                const textareas = await form.locator('textarea').count();
                console.log(`  → Inputs: ${inputs}, Textareas: ${textareas}`);

                // Check if n8n handler is attached
                const hasN8NHandler = await form.evaluate((el) => {
                    return el.dataset.n8nHandled === 'true';
                });
                console.log(`  → N8N handler attached: ${hasN8NHandler}`);
            }
        }
    }

    // Try to submit the form
    console.log('Attempting to fill and submit form...');
    const nameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="Имя"]')).first();
    const emailInput = page.locator('input[name="email"]').or(page.locator('input[type="email"]')).first();
    const messageInput = page.locator('textarea').first();

    const nameExists = await nameInput.count();
    const emailExists = await emailInput.count();
    const messageExists = await messageInput.count();

    console.log(`Name field: ${nameExists > 0}`);
    console.log(`Email field: ${emailExists > 0}`);
    console.log(`Message field: ${messageExists > 0}`);

    if (nameExists && emailExists && messageExists) {
        console.log('Filling form...');
        await nameInput.fill('Test User');
        await emailInput.fill('test@example.com');
        await messageInput.fill('Test message');

        await page.screenshot({ path: 'tests/screenshots/form-filled.png', fullPage: true });

        console.log('Looking for submit button...');
        const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Спасибо")')).first();
        console.log('Clicking submit...');

        await submitButton.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'tests/screenshots/after-submit.png', fullPage: true });
    }
});

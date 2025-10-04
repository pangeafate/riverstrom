const { test } = require('@playwright/test');

test('compare contact page form vs bottom form', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    console.log('=== TESTING CONTACT PAGE FORM ===');
    await page.goto('http://localhost:8888/contact/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const contactFormInfo = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) return { exists: false };

        const fields = Array.from(form.querySelectorAll('input, textarea, select')).map(field => ({
            tag: field.tagName,
            name: field.name || 'no-name',
            type: field.type || 'no-type',
            placeholder: field.placeholder || 'no-placeholder',
            className: field.className
        }));

        return {
            exists: true,
            formClass: form.className,
            isCustomForm: form.innerHTML.includes('custom-contact-form-container'),
            hasN8NHandler: form.dataset.n8nHandled === 'true',
            fieldCount: fields.length,
            fields: fields,
            submitButton: form.querySelector('button[type="submit"]')?.textContent
        };
    });

    console.log('CONTACT FORM:', JSON.stringify(contactFormInfo, null, 2));

    console.log('\n=== TESTING BOTTOM FORM ON MAIN PAGE ===');
    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const bottomFormInfo = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) return { exists: false };

        const fields = Array.from(form.querySelectorAll('input, textarea, select')).map(field => ({
            tag: field.tagName,
            name: field.name || 'no-name',
            type: field.type || 'no-type',
            placeholder: field.placeholder || 'no-placeholder',
            className: field.className
        }));

        return {
            exists: true,
            formClass: form.className,
            isCustomForm: form.innerHTML.includes('custom-contact-form-container'),
            hasN8NHandler: form.dataset.n8nHandled === 'true',
            fieldCount: fields.length,
            fields: fields,
            submitButton: form.querySelector('button[type="submit"]')?.textContent
        };
    });

    console.log('BOTTOM FORM:', JSON.stringify(bottomFormInfo, null, 2));

    console.log('\n=== COMPARISON ===');
    console.log(`Contact form is custom: ${contactFormInfo.isCustomForm}`);
    console.log(`Bottom form is custom: ${bottomFormInfo.isCustomForm}`);
    console.log(`Contact form has N8N handler: ${contactFormInfo.hasN8NHandler}`);
    console.log(`Bottom form has N8N handler: ${bottomFormInfo.hasN8NHandler}`);
    console.log(`Contact form fields: ${contactFormInfo.fieldCount}`);
    console.log(`Bottom form fields: ${bottomFormInfo.fieldCount}`);

    console.log('\n=== KEY DIFFERENCE ===');
    if (contactFormInfo.isCustomForm && !bottomFormInfo.isCustomForm) {
        console.log('✓ Contact form uses CUSTOM form (assets/js/custom-contact-form.js)');
        console.log('✗ Bottom form uses ORIGINAL Framer form with N8N handler');
        console.log('→ The custom form has built-in N8N submission');
        console.log('→ The N8N handler V2 intercepts Framer forms');
    }

    // Test submission on bottom form
    console.log('\n=== TESTING BOTTOM FORM SUBMISSION ===');

    const requests = [];
    page.on('request', req => {
        if (req.url().includes('n8n')) {
            requests.push({ url: req.url(), data: req.postDataJSON() });
            console.log('[N8N REQUEST]', req.postDataJSON());
        }
    });

    const emailInput = page.locator('input[type="email"]').first();
    const messageInput = page.locator('textarea').first();

    await emailInput.fill('test@test.com');
    await messageInput.fill('Test message');

    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(2000);

    console.log(`N8N requests sent: ${requests.length}`);
    if (requests.length > 0) {
        console.log('✓ Bottom form IS sending to N8N!');
    } else {
        console.log('✗ Bottom form NOT sending to N8N');
    }
});

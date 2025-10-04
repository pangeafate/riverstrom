const { test, expect } = require('@playwright/test');

test('navigation from menu to contact page', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    console.log('=== STEP 1: Navigate to home page ===');
    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'tests/screenshots/nav-01-home.png', fullPage: true });

    console.log('=== STEP 2: Find and click Контакты link ===');
    // Look for the Контакты (Contacts) link in the menu
    const contactsLink = page.locator('a:has-text("Контакты")');
    const linkExists = await contactsLink.count();
    console.log(`Contacts link found: ${linkExists > 0}`);

    if (linkExists > 0) {
        const href = await contactsLink.getAttribute('href');
        console.log(`Link href: ${href}`);

        await contactsLink.click();
        console.log('Clicked Контакты link');

        // Wait for navigation
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        console.log('Current URL:', page.url());
        await page.screenshot({ path: 'tests/screenshots/nav-02-after-click.png', fullPage: true });
    }

    console.log('=== STEP 3: Wait for form to appear ===');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/nav-03-after-2sec.png', fullPage: true });

    console.log('=== STEP 4: Check form state ===');
    const formState = await page.evaluate(() => {
        const container = document.querySelector('.framer-aemcht[data-framer-name="Form"]');
        if (!container) return { containerExists: false };

        const customForm = document.querySelector('.custom-contact-form-container');
        const styles = window.getComputedStyle(container);

        return {
            containerExists: true,
            customFormExists: customForm !== null,
            classes: Array.from(container.classList),
            opacity: styles.opacity,
            pointerEvents: styles.pointerEvents,
            scriptTag: !!document.querySelector('script[src="/assets/js/custom-contact-form.js"]')
        };
    });
    console.log('Form state:', JSON.stringify(formState, null, 2));

    console.log('=== STEP 5: Wait longer and check again ===');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/nav-04-after-4sec.png', fullPage: true });

    const formStateFinal = await page.evaluate(() => {
        const container = document.querySelector('.framer-aemcht[data-framer-name="Form"]');
        const customForm = document.querySelector('.custom-contact-form-container');
        const firstName = document.querySelector('input[name="firstName"]');

        return {
            containerExists: !!container,
            customFormExists: !!customForm,
            firstNameFieldExists: !!firstName,
            containerClasses: container ? Array.from(container.classList) : []
        };
    });
    console.log('Final form state:', JSON.stringify(formStateFinal, null, 2));

    // Verify form rendered
    if (formStateFinal.customFormExists) {
        console.log('✓ Form rendered successfully after navigation!');
    } else {
        console.log('✗ Form DID NOT render after navigation');
    }
});

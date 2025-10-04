const { test } = require('@playwright/test');

test('debug form blinking issue', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    console.log('=== STEP 1: Navigate to page ===');
    await page.goto('http://localhost:8888/contact/');

    console.log('=== STEP 2: Immediate screenshot ===');
    await page.waitForTimeout(100);
    await page.screenshot({ path: 'tests/screenshots/blink-01-immediate.png', fullPage: true });

    console.log('=== STEP 3: Check form container state ===');
    const state1 = await page.evaluate(() => {
        const container = document.querySelector('.framer-aemcht[data-framer-name="Form"]');
        if (!container) return { exists: false };

        const styles = window.getComputedStyle(container);
        return {
            exists: true,
            classes: Array.from(container.classList),
            opacity: styles.opacity,
            display: styles.display,
            visibility: styles.visibility,
            pointerEvents: styles.pointerEvents,
            hasCustomForm: container.innerHTML.includes('custom-contact-form-container')
        };
    });
    console.log('State after 100ms:', JSON.stringify(state1, null, 2));
    await page.screenshot({ path: 'tests/screenshots/blink-02-after-100ms.png', fullPage: true });

    console.log('=== STEP 4: Wait 500ms ===');
    await page.waitForTimeout(500);
    const state2 = await page.evaluate(() => {
        const container = document.querySelector('.framer-aemcht[data-framer-name="Form"]');
        if (!container) return { exists: false };

        const styles = window.getComputedStyle(container);
        return {
            exists: true,
            classes: Array.from(container.classList),
            opacity: styles.opacity,
            display: styles.display,
            visibility: styles.visibility,
            pointerEvents: styles.pointerEvents,
            hasCustomForm: container.innerHTML.includes('custom-contact-form-container')
        };
    });
    console.log('State after 600ms:', JSON.stringify(state2, null, 2));
    await page.screenshot({ path: 'tests/screenshots/blink-03-after-600ms.png', fullPage: true });

    console.log('=== STEP 5: Wait 1 second ===');
    await page.waitForTimeout(1000);
    const state3 = await page.evaluate(() => {
        const container = document.querySelector('.framer-aemcht[data-framer-name="Form"]');
        if (!container) return { exists: false };

        const styles = window.getComputedStyle(container);
        return {
            exists: true,
            classes: Array.from(container.classList),
            opacity: styles.opacity,
            display: styles.display,
            visibility: styles.visibility,
            pointerEvents: styles.pointerEvents,
            hasCustomForm: container.innerHTML.includes('custom-contact-form-container'),
            inlineOpacity: container.style.opacity
        };
    });
    console.log('State after 1600ms:', JSON.stringify(state3, null, 2));
    await page.screenshot({ path: 'tests/screenshots/blink-04-after-1600ms.png', fullPage: true });

    console.log('=== STEP 6: Wait 2 more seconds ===');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/blink-05-final.png', fullPage: true });
});

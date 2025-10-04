const { test } = require('@playwright/test');

test('manual rectangle visibility test', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    console.log('\n=== INITIAL STATE ===');

    // Take screenshot before click
    await page.screenshot({ path: 'tests/screenshots/before-hamburger-click.png' });

    // Check rectangle state
    let state = await page.evaluate(() => {
        const rect = document.getElementById('mobile-logo-cover');
        if (!rect) return { exists: false };

        const computed = window.getComputedStyle(rect);
        return {
            exists: true,
            inlineDisplay: rect.style.display,
            computedDisplay: computed.display,
            inlineBackground: rect.style.background,
            computedBackground: computed.background,
            computedBackgroundColor: computed.backgroundColor,
            position: computed.position,
            top: computed.top,
            left: computed.left,
            width: computed.width,
            height: computed.height,
            zIndex: computed.zIndex,
            opacity: computed.opacity,
            visibility: computed.visibility,
            pointerEvents: computed.pointerEvents,
            boundingRect: rect.getBoundingClientRect()
        };
    });

    console.log('Rectangle before click:', JSON.stringify(state, null, 2));

    // Click hamburger (top-right corner)
    console.log('\n=== CLICKING HAMBURGER ===');
    await page.mouse.click(350, 50);
    await page.waitForTimeout(500);

    // Check rectangle state after click
    state = await page.evaluate(() => {
        const rect = document.getElementById('mobile-logo-cover');
        if (!rect) return { exists: false };

        const computed = window.getComputedStyle(rect);
        return {
            exists: true,
            inlineDisplay: rect.style.display,
            computedDisplay: computed.display,
            inlineBackground: rect.style.background,
            computedBackground: computed.background,
            computedBackgroundColor: computed.backgroundColor,
            position: computed.position,
            top: computed.top,
            left: computed.left,
            width: computed.width,
            height: computed.height,
            zIndex: computed.zIndex,
            opacity: computed.opacity,
            visibility: computed.visibility,
            pointerEvents: computed.pointerEvents,
            boundingRect: rect.getBoundingClientRect()
        };
    });

    console.log('\n=== AFTER CLICK ===');
    console.log('Rectangle after click:', JSON.stringify(state, null, 2));

    // Take screenshot after click
    await page.screenshot({ path: 'tests/screenshots/after-hamburger-click.png', fullPage: true });

    // Wait a bit to see if menu opens
    await page.waitForTimeout(2000);

    // Check if menu is actually open
    const menuState = await page.evaluate(() => {
        const navSections = document.querySelectorAll('[data-framer-name*="Nav"]');
        const results = [];

        navSections.forEach(nav => {
            const rect = nav.getBoundingClientRect();
            const style = window.getComputedStyle(nav);
            results.push({
                name: nav.getAttribute('data-framer-name'),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                display: style.display,
                opacity: style.opacity,
                transform: style.transform
            });
        });

        return results;
    });

    console.log('\n=== MENU STATE ===');
    console.log(JSON.stringify(menuState, null, 2));

    await page.waitForTimeout(1000);
});

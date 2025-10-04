const { test, expect } = require('@playwright/test');

test('test click-based logo hiding', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    console.log('\n=== BEFORE CLICK ===');

    // Check if rectangle exists but is hidden
    let rectangleState = await page.evaluate(() => {
        const rect = document.getElementById('mobile-logo-cover');
        if (rect) {
            return {
                exists: true,
                display: window.getComputedStyle(rect).display,
                position: rect.style.position,
                zIndex: rect.style.zIndex
            };
        }
        return { exists: false };
    });

    console.log('Rectangle state before click:', JSON.stringify(rectangleState, null, 2));

    // Take screenshot before
    await page.screenshot({ path: 'tests/screenshots/click-test-before.png' });

    // Click in top-right corner (where hamburger should be)
    console.log('\n=== CLICKING TOP-RIGHT CORNER ===');
    await page.mouse.click(350, 50); // Right side, near top
    await page.waitForTimeout(500);

    // Check if rectangle is now visible
    rectangleState = await page.evaluate(() => {
        const rect = document.getElementById('mobile-logo-cover');
        if (rect) {
            return {
                exists: true,
                display: window.getComputedStyle(rect).display,
                position: rect.style.position,
                width: rect.style.width,
                height: rect.style.height,
                zIndex: rect.style.zIndex,
                background: rect.style.background
            };
        }
        return { exists: false };
    });

    console.log('\n=== AFTER CLICK ===');
    console.log('Rectangle state after click:', JSON.stringify(rectangleState, null, 2));

    // Take screenshot after
    await page.screenshot({ path: 'tests/screenshots/click-test-after.png', fullPage: true });

    // Verify rectangle is visible
    expect(rectangleState.exists).toBe(true);
    expect(rectangleState.display).toBe('block');

    await page.waitForTimeout(1000);
});

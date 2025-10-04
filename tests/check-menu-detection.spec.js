const { test } = require('@playwright/test');

test('check what elements exist when menu is open', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    console.log('\n=== BEFORE MENU OPEN ===');

    // Click hamburger
    const hamburger = page.locator('[data-framer-name="Nav section"] div[style*="cursor: pointer"]').first();
    await hamburger.click();
    await page.waitForTimeout(1500);

    console.log('\n=== AFTER MENU OPEN ===');

    // Check what our function would detect
    const detectionInfo = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const possibleMenus = document.querySelectorAll('[data-framer-name*="Nav"], [data-framer-name*="Menu"], div[class*="nav"], div[class*="menu"]');

        const results = [];

        possibleMenus.forEach((menu, idx) => {
            const style = window.getComputedStyle(menu);
            const rect = menu.getBoundingClientRect();

            const widthPercent = (rect.width / viewportWidth) * 100;
            const heightPercent = (rect.height / viewportHeight) * 100;

            const isFullScreen = rect.width >= viewportWidth * 0.95 && rect.height >= viewportHeight * 0.8;

            results.push({
                index: idx,
                dataFramerName: menu.getAttribute('data-framer-name'),
                className: menu.className,
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                widthPercent: Math.round(widthPercent),
                heightPercent: Math.round(heightPercent),
                viewportWidth,
                viewportHeight,
                opacity: style.opacity,
                display: style.display,
                position: style.position,
                backgroundColor: style.backgroundColor,
                isFullScreen,
                meetsOpenCriteria: isFullScreen && style.opacity !== '0' && style.display !== 'none'
            });
        });

        return results;
    });

    console.log('\n=== MENU DETECTION INFO ===');
    console.log(JSON.stringify(detectionInfo, null, 2));

    // Check if rectangle was added
    const rectangleExists = await page.evaluate(() => {
        const rect = document.getElementById('mobile-logo-cover');
        if (rect) {
            return {
                exists: true,
                display: rect.style.display,
                position: rect.style.position,
                width: rect.style.width,
                height: rect.style.height,
                zIndex: rect.style.zIndex,
                background: rect.style.background
            };
        }
        return { exists: false };
    });

    console.log('\n=== RECTANGLE INFO ===');
    console.log(JSON.stringify(rectangleExists, null, 2));

    await page.screenshot({ path: 'tests/screenshots/menu-detection-debug.png', fullPage: true });

    await page.waitForTimeout(1000);
});

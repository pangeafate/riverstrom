const { test } = require('@playwright/test');

test('find and click hamburger menu', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    // Take screenshot before
    await page.screenshot({ path: 'tests/screenshots/before-menu.png' });

    // Try to find hamburger by looking for clickable elements in top-right
    const hamburgerInfo = await page.evaluate(() => {
        const elements = document.querySelectorAll('[style*="cursor: pointer"], [style*="cursor:pointer"]');
        const results = [];

        elements.forEach((el, idx) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);

            // Look for elements in top-right corner
            if (rect.right > window.innerWidth - 100 && rect.top < 100) {
                results.push({
                    index: idx,
                    tag: el.tagName,
                    className: el.className,
                    dataFramerName: el.getAttribute('data-framer-name'),
                    top: Math.round(rect.top),
                    right: Math.round(rect.right),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    cursor: style.cursor,
                    innerHTML: el.innerHTML.substring(0, 200)
                });
            }
        });

        return results;
    });

    console.log('\n=== POSSIBLE HAMBURGER ELEMENTS ===');
    console.log(JSON.stringify(hamburgerInfo, null, 2));

    // Click the first clickable element in top-right
    const clicked = await page.evaluate(() => {
        const elements = document.querySelectorAll('[style*="cursor: pointer"], [style*="cursor:pointer"]');
        for (const el of elements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth - 100 && rect.top < 100) {
                el.click();
                return true;
            }
        }
        return false;
    });

    console.log('\n=== CLICKED ===', clicked);

    await page.waitForTimeout(1500);

    // Take screenshot after
    await page.screenshot({ path: 'tests/screenshots/after-menu-click.png', fullPage: true });

    // Check if menu is visible
    const menuInfo = await page.evaluate(() => {
        const possibleMenus = document.querySelectorAll('[data-framer-name*="Nav"], [data-framer-name*="Menu"], div[class*="nav"], div[class*="menu"]');

        const results = [];
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        possibleMenus.forEach((menu, idx) => {
            const style = window.getComputedStyle(menu);
            const rect = menu.getBoundingClientRect();

            results.push({
                index: idx,
                dataFramerName: menu.getAttribute('data-framer-name'),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                widthPercent: Math.round((rect.width / viewportWidth) * 100),
                heightPercent: Math.round((rect.height / viewportHeight) * 100),
                opacity: style.opacity,
                display: style.display,
                position: style.position,
                backgroundColor: style.backgroundColor
            });
        });

        return results;
    });

    console.log('\n=== MENU INFO AFTER CLICK ===');
    console.log(JSON.stringify(menuInfo, null, 2));

    // Check if rectangle exists
    const rectangleExists = await page.evaluate(() => {
        const rect = document.getElementById('mobile-logo-cover');
        if (rect) {
            return {
                exists: true,
                display: rect.style.display,
                position: rect.style.position,
                width: rect.style.width,
                height: rect.style.height,
                zIndex: rect.style.zIndex
            };
        }
        return { exists: false };
    });

    console.log('\n=== RECTANGLE INFO ===');
    console.log(JSON.stringify(rectangleExists, null, 2));

    await page.waitForTimeout(2000);
});

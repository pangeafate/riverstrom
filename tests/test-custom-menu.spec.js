const { test } = require('@playwright/test');

test('test custom menu vs Framer menu', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    console.log('\n=== CHECKING MENUS ===');

    // Check what hamburgers exist
    const hamburgers = await page.evaluate(() => {
        const results = {
            customHamburger: !!document.getElementById('custom-hamburger'),
            framerNavs: [],
            allSVGs: []
        };

        // Find Framer nav elements
        const navElements = document.querySelectorAll('[data-framer-name*="Nav"], [data-framer-name*="nav"]');
        navElements.forEach(nav => {
            const style = window.getComputedStyle(nav);
            results.framerNavs.push({
                name: nav.getAttribute('data-framer-name'),
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                rect: nav.getBoundingClientRect()
            });
        });

        // Find all SVGs in top-right
        const svgs = document.querySelectorAll('svg');
        svgs.forEach(svg => {
            const rect = svg.getBoundingClientRect();
            if (rect.top < 100 && rect.right > window.innerWidth - 100) {
                const style = window.getComputedStyle(svg);
                results.allSVGs.push({
                    viewBox: svg.getAttribute('viewBox'),
                    display: style.display,
                    rect: { top: rect.top, right: rect.right, width: rect.width, height: rect.height }
                });
            }
        });

        return results;
    });

    console.log('\nCustom hamburger exists:', hamburgers.customHamburger);
    console.log('\nFramer nav elements:', JSON.stringify(hamburgers.framerNavs, null, 2));
    console.log('\nSVGs in top-right:', JSON.stringify(hamburgers.allSVGs, null, 2));

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/custom-menu-test.png' });

    // Try clicking custom hamburger
    const customHam = await page.$('#custom-hamburger');
    if (customHam) {
        console.log('\n=== CLICKING CUSTOM HAMBURGER ===');
        await customHam.click();
        await page.waitForTimeout(500);

        const menuState = await page.evaluate(() => {
            const menu = document.getElementById('custom-mobile-menu');
            return {
                exists: !!menu,
                active: menu?.classList.contains('active'),
                display: menu ? window.getComputedStyle(menu).display : null,
                opacity: menu ? window.getComputedStyle(menu).opacity : null
            };
        });

        console.log('Menu state after click:', JSON.stringify(menuState, null, 2));
        await page.screenshot({ path: 'tests/screenshots/custom-menu-open.png' });
    } else {
        console.log('\nCustom hamburger NOT FOUND!');
    }
});

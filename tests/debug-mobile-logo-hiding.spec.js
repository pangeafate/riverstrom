const { test } = require('@playwright/test');

test('debug mobile menu logo hiding', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    console.log('\n=== BEFORE OPENING MENU ===');

    // Check if our script is loaded
    const scriptLoaded = await page.evaluate(() => {
        return typeof window.hideMobileMenuLogo !== 'undefined';
    });
    console.log('Logo hiding script loaded:', scriptLoaded);

    // Find and click hamburger menu
    console.log('\n=== CLICKING HAMBURGER MENU ===');
    const hamburger = page.locator('[data-framer-name="Nav section"] div[style*="cursor: pointer"]').first();
    await hamburger.click();
    await page.waitForTimeout(1000);

    // Take screenshot of menu open
    await page.screenshot({ path: 'tests/screenshots/mobile-menu-debug.png', fullPage: true });

    // Check for overlays
    const overlayInfo = await page.evaluate(() => {
        const overlays = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"]');
        const results = [];

        overlays.forEach((overlay, index) => {
            const style = window.getComputedStyle(overlay);
            const rect = overlay.getBoundingClientRect();

            results.push({
                index,
                zIndex: style.zIndex,
                opacity: style.opacity,
                display: style.display,
                position: style.position,
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
                className: overlay.className,
                childCount: overlay.children.length
            });
        });

        return results;
    });

    console.log('\n=== OVERLAY INFO ===');
    console.log(JSON.stringify(overlayInfo, null, 2));

    // Check for elements in top-left of overlays
    const topLeftElements = await page.evaluate(() => {
        const overlays = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"]');
        const results = [];

        overlays.forEach((overlay, overlayIndex) => {
            const style = window.getComputedStyle(overlay);
            const zIndex = parseInt(style.zIndex) || 0;
            const opacity = parseFloat(style.opacity) || 1;

            if (zIndex > 100 && opacity > 0) {
                const elements = overlay.querySelectorAll('div, img, svg, a');

                elements.forEach(el => {
                    const rect = el.getBoundingClientRect();

                    if (rect.top >= 0 && rect.top < 120 && rect.left >= 0 && rect.left < 200 && rect.width > 0 && rect.height > 0) {
                        if (rect.width < 300 && rect.height < 100) {
                            results.push({
                                overlayIndex,
                                tag: el.tagName,
                                className: el.className,
                                rect: {
                                    top: Math.round(rect.top),
                                    left: Math.round(rect.left),
                                    width: Math.round(rect.width),
                                    height: Math.round(rect.height)
                                },
                                text: el.textContent?.substring(0, 50),
                                currentDisplay: el.style.display,
                                computedDisplay: window.getComputedStyle(el).display
                            });
                        }
                    }
                });
            }
        });

        return results;
    });

    console.log('\n=== TOP-LEFT ELEMENTS (should be logo) ===');
    console.log(JSON.stringify(topLeftElements, null, 2));

    // Manually run the hiding function
    console.log('\n=== MANUALLY RUNNING HIDE FUNCTION ===');
    await page.evaluate(() => {
        if (typeof window.hideMobileMenuLogo === 'function') {
            window.hideMobileMenuLogo();
        }
    });

    await page.waitForTimeout(500);

    // Check again after manual run
    const afterManual = await page.evaluate(() => {
        const overlays = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"]');
        const results = [];

        overlays.forEach((overlay) => {
            const style = window.getComputedStyle(overlay);
            const zIndex = parseInt(style.zIndex) || 0;
            const opacity = parseFloat(style.opacity) || 1;

            if (zIndex > 100 && opacity > 0) {
                const elements = overlay.querySelectorAll('div, img, svg, a');

                elements.forEach(el => {
                    const rect = el.getBoundingClientRect();

                    if (rect.top >= 0 && rect.top < 120 && rect.left >= 0 && rect.left < 200 && rect.width > 0 && rect.height > 0) {
                        if (rect.width < 300 && rect.height < 100) {
                            results.push({
                                tag: el.tagName,
                                currentDisplay: el.style.display,
                                currentVisibility: el.style.visibility,
                                currentOpacity: el.style.opacity,
                                text: el.textContent?.substring(0, 30)
                            });
                        }
                    }
                });
            }
        });

        return results;
    });

    console.log('\n=== AFTER MANUAL HIDE ===');
    console.log(JSON.stringify(afterManual, null, 2));

    // Take final screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-menu-after-hide.png', fullPage: true });
});

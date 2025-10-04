const { test } = require('@playwright/test');

test('check mobile overlay structure', async ({ page }) => {
    await page.goto('http://localhost:8888/');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);

    // Click hamburger
    const hamburger = page.locator('[data-framer-name="Nav section"] div[style*="cursor: pointer"]').first();
    await hamburger.click();
    await page.waitForTimeout(1000);

    // Get ALL fixed position elements
    const fixedElements = await page.evaluate(() => {
        const allDivs = document.querySelectorAll('div');
        const fixed = [];

        allDivs.forEach(div => {
            const style = window.getComputedStyle(div);
            if (style.position === 'fixed') {
                const rect = div.getBoundingClientRect();
                fixed.push({
                    className: div.className,
                    zIndex: style.zIndex,
                    opacity: style.opacity,
                    display: style.display,
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    childCount: div.children.length,
                    hasLogoInTopLeft: (() => {
                        // Check for elements in top-left
                        const topLeftElements = div.querySelectorAll('div, img, svg, a');
                        let found = false;
                        topLeftElements.forEach(el => {
                            const r = el.getBoundingClientRect();
                            if (r.top < 120 && r.left < 200 && r.width < 300 && r.height < 100 && r.width > 0) {
                                found = true;
                            }
                        });
                        return found;
                    })()
                });
            }
        });

        return fixed;
    });

    console.log('\n=== FIXED ELEMENTS ===');
    console.log(JSON.stringify(fixedElements, null, 2));
});

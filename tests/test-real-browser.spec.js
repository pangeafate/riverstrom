const { test } = require('@playwright/test');

test('check what renders in real browser after refresh', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.setViewportSize({ width: 375, height: 812 });

    console.log('\n=== WAITING FOR PAGE TO SETTLE ===');
    await page.waitForTimeout(3000);

    console.log('\n=== CHECKING WHAT IS IN TOP-RIGHT CORNER ===');

    const topRightElements = await page.evaluate(() => {
        const results = {
            customHamburger: null,
            allInTopRight: []
        };

        // Check custom hamburger
        const customHam = document.getElementById('custom-hamburger');
        if (customHam) {
            const rect = customHam.getBoundingClientRect();
            const style = window.getComputedStyle(customHam);
            results.customHamburger = {
                exists: true,
                display: style.display,
                visibility: style.visibility,
                rect: { top: rect.top, right: rect.right, width: rect.width, height: rect.height }
            };
        } else {
            results.customHamburger = { exists: false };
        }

        // Find ALL elements in top-right corner
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);

            // Top-right corner (top < 100px, right side of viewport)
            if (rect.top < 100 && rect.right > window.innerWidth - 100) {
                if (style.display !== 'none' && style.visibility !== 'hidden' &&
                    style.opacity !== '0' && rect.width > 0 && rect.height > 0) {
                    results.allInTopRight.push({
                        tag: el.tagName.toLowerCase(),
                        id: el.id,
                        classes: el.className,
                        dataFramerName: el.getAttribute('data-framer-name'),
                        dataFramerComponentType: el.getAttribute('data-framer-component-type'),
                        display: style.display,
                        position: style.position,
                        zIndex: style.zIndex,
                        rect: {
                            top: Math.round(rect.top),
                            right: Math.round(rect.right),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        },
                        innerHTML: el.innerHTML.substring(0, 200)
                    });
                }
            }
        });

        return results;
    });

    console.log('\n=== CUSTOM HAMBURGER ===');
    console.log(JSON.stringify(topRightElements.customHamburger, null, 2));

    console.log('\n=== ALL VISIBLE ELEMENTS IN TOP-RIGHT (total: ' + topRightElements.allInTopRight.length + ') ===');
    topRightElements.allInTopRight.forEach((el, i) => {
        console.log(`\n[${i}] ${el.tag}${el.id ? '#' + el.id : ''}${el.dataFramerName ? ' [' + el.dataFramerName + ']' : ''}`);
        console.log('  Display:', el.display);
        console.log('  Position:', el.position);
        console.log('  Z-index:', el.zIndex);
        console.log('  Rect:', JSON.stringify(el.rect));
        if (el.tag === 'svg') {
            console.log('  SVG content:', el.innerHTML.substring(0, 100));
        }
    });

    await page.screenshot({ path: 'tests/screenshots/real-browser-test.png' });
});

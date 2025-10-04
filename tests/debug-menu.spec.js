const { test } = require('@playwright/test');

test('debug mobile menu structure', async ({ page }) => {
    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    // Get ALL elements in top-right corner and their details
    const topRightElements = await page.evaluate(() => {
        const elements = [];
        const allElements = document.querySelectorAll('*');

        allElements.forEach((el) => {
            const rect = el.getBoundingClientRect();

            // Only elements in top 100px and right 100px
            if (rect.top < 100 && rect.right > window.innerWidth - 100 && rect.width > 0 && rect.height > 0) {
                const computedStyle = window.getComputedStyle(el);
                elements.push({
                    tag: el.tagName,
                    class: el.className,
                    id: el.id,
                    text: el.textContent?.substring(0, 30),
                    cursor: computedStyle.cursor,
                    position: computedStyle.position,
                    zIndex: computedStyle.zIndex,
                    rect: {
                        top: Math.round(rect.top),
                        right: Math.round(rect.right),
                        bottom: Math.round(rect.bottom),
                        left: Math.round(rect.left),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    },
                    dataFramerName: el.getAttribute('data-framer-name'),
                    role: el.getAttribute('role'),
                    onclick: el.onclick !== null,
                    clickable: computedStyle.cursor === 'pointer' || el.onclick !== null
                });
            }
        });

        return elements.sort((a, b) => b.rect.right - a.rect.right); // Sort by rightmost first
    });

    console.log('Elements in top-right corner:');
    console.log(JSON.stringify(topRightElements.slice(0, 20), null, 2)); // First 20 elements

    // Try to find the actual hamburger SVG
    const hamburgerSVG = await page.evaluate(() => {
        const svgs = document.querySelectorAll('svg');
        const found = [];
        svgs.forEach(svg => {
            const rect = svg.getBoundingClientRect();
            if (rect.top < 100 && rect.right > window.innerWidth - 100) {
                found.push({
                    innerHTML: svg.innerHTML.substring(0, 200),
                    parent: svg.parentElement?.className,
                    rect: { top: rect.top, right: rect.right, width: rect.width, height: rect.height }
                });
            }
        });
        return found;
    });

    console.log('\nSVGs in top-right:');
    console.log(JSON.stringify(hamburgerSVG, null, 2));
});

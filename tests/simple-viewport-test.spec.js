const { test } = require('@playwright/test');

test('simple viewport test', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(3000);

    const info = await page.evaluate(() => {
        return {
            viewportWidth: window.innerWidth,
            rectangleExists: !!document.getElementById('mobile-logo-cover')
        };
    });

    console.log('\n=== INFO ===');
    console.log(JSON.stringify(info, null, 2));
});

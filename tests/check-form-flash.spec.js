const { test } = require('@playwright/test');

test('check if Framer form flashes before custom form', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    console.log('=== TESTING CONTACT PAGE ===');
    await page.goto('http://localhost:8888/contact/');
    
    // Take screenshot immediately after navigation
    await page.waitForTimeout(100);
    await page.screenshot({ path: 'tests/screenshots/contact-100ms.png' });
    console.log('Screenshot at 100ms');
    
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'tests/screenshots/contact-500ms.png' });
    console.log('Screenshot at 500ms');
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/contact-1000ms.png' });
    console.log('Screenshot at 1000ms');
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/contact-1500ms.png' });
    console.log('Screenshot at 1500ms');
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/contact-2000ms.png' });
    console.log('Screenshot at 2000ms');

    console.log('\n=== TESTING MAIN PAGE ===');
    await page.goto('http://localhost:8888/');
    
    await page.waitForTimeout(100);
    await page.screenshot({ path: 'tests/screenshots/main-100ms.png' });
    console.log('Screenshot at 100ms');
    
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'tests/screenshots/main-500ms.png' });
    console.log('Screenshot at 500ms');
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/main-1000ms.png' });
    console.log('Screenshot at 1000ms');
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/main-1500ms.png' });
    console.log('Screenshot at 1500ms');
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/main-2000ms.png' });
    console.log('Screenshot at 2000ms');
});

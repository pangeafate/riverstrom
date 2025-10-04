const { test } = require('@playwright/test');

test('check bottom form flash on main page', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    
    // Scroll to bottom where form is
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(100);
    
    console.log('Screenshot at 100ms (scrolled to bottom)');
    await page.screenshot({ path: 'tests/screenshots/bottom-100ms.png', fullPage: false });
    
    await page.waitForTimeout(400);
    console.log('Screenshot at 500ms');
    await page.screenshot({ path: 'tests/screenshots/bottom-500ms.png', fullPage: false });
    
    await page.waitForTimeout(500);
    console.log('Screenshot at 1000ms');
    await page.screenshot({ path: 'tests/screenshots/bottom-1000ms.png', fullPage: false });
    
    await page.waitForTimeout(500);
    console.log('Screenshot at 1500ms');
    await page.screenshot({ path: 'tests/screenshots/bottom-1500ms.png', fullPage: false });
    
    await page.waitForTimeout(500);
    console.log('Screenshot at 2000ms');
    await page.screenshot({ path: 'tests/screenshots/bottom-2000ms.png', fullPage: false });
    
    // Check form state
    const formInfo = await page.evaluate(() => {
        const forms = Array.from(document.querySelectorAll('form'));
        return forms.map((form, idx) => ({
            index: idx,
            className: form.className,
            isCustom: form.innerHTML.includes('custom-bottom-form-container'),
            fieldCount: form.querySelectorAll('input, textarea').length,
            visible: form.offsetParent !== null
        }));
    });
    
    console.log('\nForm state:', JSON.stringify(formInfo, null, 2));
});

const { test } = require('@playwright/test');

test('find form location and check for flash', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');
    
    // Wait for page to fully load
    await page.waitForTimeout(100);
    
    // Find form position
    const formPosition = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) return null;
        
        const rect = form.getBoundingClientRect();
        return {
            top: rect.top,
            bottom: rect.bottom,
            scrollY: window.scrollY,
            viewportHeight: window.innerHeight,
            isInView: rect.top >= 0 && rect.bottom <= window.innerHeight,
            className: form.className
        };
    });
    
    console.log('Form position at 100ms:', JSON.stringify(formPosition, null, 2));
    
    // Take screenshot at current position
    await page.screenshot({ path: 'tests/screenshots/form-pos-100ms.png' });
    
    // Scroll to form
    await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) {
            form.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
    });
    
    console.log('Scrolled to form, taking screenshots...');
    
    await page.waitForTimeout(50);
    await page.screenshot({ path: 'tests/screenshots/form-150ms.png' });
    
    await page.waitForTimeout(350);
    await page.screenshot({ path: 'tests/screenshots/form-500ms.png' });
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/form-1000ms.png' });
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/form-1500ms.png' });
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/form-2000ms.png' });
});

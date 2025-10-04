const { test } = require('@playwright/test');

test('screenshot form with title for comparison', async ({ page }) => {
    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to form area
    await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) {
            // Scroll to include title above form
            const formRect = form.getBoundingClientRect();
            window.scrollTo(0, window.scrollY + formRect.top - 200);
        }
    });
    
    await page.waitForTimeout(2000);
    
    // Take screenshot of form with surrounding context
    await page.screenshot({ 
        path: 'tests/screenshots/bottom-form-with-title.png',
        fullPage: false 
    });
    
    console.log('Screenshot saved');
});

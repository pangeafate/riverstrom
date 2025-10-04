const { test } = require('@playwright/test');

test('test promo code submission to N8N', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    const requests = [];
    page.on('request', req => {
        if (req.url().includes('n8n')) {
            requests.push({ 
                url: req.url(), 
                data: req.postDataJSON() 
            });
            console.log('[N8N REQUEST]', JSON.stringify(req.postDataJSON(), null, 2));
        }
    });

    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to form
    await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) form.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    
    await page.waitForTimeout(2000);
    
    // Fill form with promo code
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@test.com');
    await page.locator('textarea[name="message"]').fill('Test message');
    await page.locator('input[name="promoCode"]').fill('PROMO123');
    
    console.log('Filled form with promo code PROMO123');
    
    // Submit
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    
    console.log(`\n=== N8N requests sent: ${requests.length} ===`);
    if (requests.length > 0) {
        console.log('Request data:', JSON.stringify(requests[0].data, null, 2));
        
        if (requests[0].data.promoCode) {
            console.log('✓ Promo code IS being sent:', requests[0].data.promoCode);
        } else {
            console.log('✗ Promo code NOT in request data');
        }
    }
});

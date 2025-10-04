const { test } = require('@playwright/test');

test('check mobile menu logo', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    await page.goto('http://localhost:8888/');
    await page.waitForLoadState('networkidle');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    console.log('Taking screenshot of initial page...');
    await page.screenshot({ path: 'tests/screenshots/mobile-initial.png', fullPage: true });

    // Click the hamburger menu button (the framer component in top-right)
    console.log('Looking for hamburger menu button...');

    // The hamburger menu is a Framer component with data-framer-name
    // It's in the nav section and has cursor:pointer
    const menuButton = page.locator('[data-framer-name="Nav section"] div[style*="cursor: pointer"]').first();
    const buttonCount = await menuButton.count();

    if (buttonCount === 0) {
        console.log('Trying alternative selector...');
        // Fallback: look for the specific classes we found in debug
        const altSelector = '.framer-7fs4d';
        const alt = page.locator(altSelector).first();
        if (await alt.count() > 0) {
            console.log('Found hamburger line element, clicking parent...');
            // Get the parent element and click it using JavaScript
            await page.evaluate((selector) => {
                const el = document.querySelector(selector);
                if (el && el.parentElement) {
                    console.log('[Test] Clicking parent element:', el.parentElement.className);
                    el.parentElement.click();
                }
            }, altSelector);
        } else {
            console.log('ERROR: Could not find hamburger menu!');
            return;
        }
    } else {
        console.log(`Found menu button, clicking...`);
        await menuButton.click();
    }

    await page.waitForTimeout(2000); // Wait for menu overlay to appear

    console.log('Taking screenshot after menu opened...');
    await page.screenshot({ path: 'tests/screenshots/mobile-menu-open.png', fullPage: true });

    // Check what's visible on the page now
    const pageState = await page.evaluate(() => {
        // Look for overlay/modal elements (they usually have position:fixed and high z-index)
        const overlays = Array.from(document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]'));
        const visibleOverlays = overlays.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });

        return {
            overlayCount: visibleOverlays.length,
            overlayClasses: visibleOverlays.map(el => el.className),
            allShortText: Array.from(document.querySelectorAll('*'))
                .map(el => el.textContent?.trim())
                .filter(text => text && text.length < 50 && text.length > 2)
                .slice(0, 30) // First 30 short text elements
        };
    });

    console.log('Page state after click:', JSON.stringify(pageState, null, 2));

    // Check for the logo in the mobile menu overlay
    const logoCheck = await page.evaluate(() => {
        const results = {
            foundTauRUS: false,
            foundRIVERSTROM: false,
            foundTay: false,
            logoText: '',
            allTextWithTauOrRUS: []
        };

        // Look for ANY element containing these strings
        document.querySelectorAll('*').forEach(el => {
            const text = el.textContent;

            if (text && text.length < 200) {
                if ((text.includes('тау') || text.includes('тay') || text.includes('tay')) && text.includes('RUS')) {
                    results.foundTauRUS = true;
                    results.logoText = text.substring(0, 50);
                    results.allTextWithTauOrRUS.push({
                        tag: el.tagName,
                        text: text.substring(0, 100),
                        class: el.className
                    });
                } else if (text.includes('RIVERSTROM')) {
                    results.foundRIVERSTROM = true;
                    if (!results.logoText) results.logoText = text.substring(0, 50);
                } else if (text.includes('тay') || text.includes('tay')) {
                    results.foundTay = true;
                }
            }
        });

        return results;
    });

    console.log('Logo check results:', JSON.stringify(logoCheck, null, 2));

    if (logoCheck.foundTauRUS) {
        console.log('ERROR: Found wrong logo "тауRUS" in mobile menu!');
    } else if (logoCheck.foundRIVERSTROM) {
        console.log('SUCCESS: Found correct logo "RIVERSTROM" in mobile menu!');
    } else {
        console.log('WARNING: No logo text found in mobile menu');
    }
});

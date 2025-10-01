/**
 * Fix Mobile Menu Logo - Replace "тауRUS" with "RIVERSTROM"
 * This script replaces the incorrect logo in the mobile menu overlay
 */

(function() {
    'use strict';

    console.log('[Mobile Logo Fix] Initializing...');

    // The correct RIVERSTROM SVG logo
    const correctLogoSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="170" height="32" viewBox="0 0 170 32" fill="none">
            <path d="M28.5714 16C28.5714 7.16344 21.4366 0 12.6364 0C5.65934 0 0 5.68934 0 12.7025V19.2975C0 26.3107 5.65934 32 12.6364 32C19.6134 32 25.2727 26.3107 25.2727 19.2975V12.7025C25.2727 9.19508 22.1429 6.34426 18.3636 6.34426C14.5844 6.34426 11.4545 9.19508 11.4545 12.7025C11.4545 16.2098 14.5844 19.0607 18.3636 19.0607C20.2532 19.0607 21.9481 18.2951 23.1818 17.0328" stroke="#1DE189" stroke-width="2"/>
            <text x="40" y="23" font-family="Inter, sans-serif" font-size="18" font-weight="500" fill="#1DE189" letter-spacing="0.05em">RIVERSTROM</text>
        </svg>
    `.trim();

    function replaceMobileLogo() {
        // Look for text elements in the mobile menu that contain "тау" or "RUS"
        const allTextElements = document.querySelectorAll('[data-framer-component-type="Text"]');

        allTextElements.forEach(el => {
            const text = el.textContent.trim();

            // Check if this is the incorrect logo text
            if (text.includes('тау') || text.includes('RUS') || text === 'тауRUS' || text === 'tayRUS') {
                console.log('[Mobile Logo Fix] Found incorrect logo:', text);
                console.log('[Mobile Logo Fix] Parent element:', el.parentElement);

                // Replace the text content with correct text
                const newLogoHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M28.5714 16C28.5714 7.16344 21.4366 0 12.6364 0C5.65934 0 0 5.68934 0 12.7025V19.2975C0 26.3107 5.65934 32 12.6364 32C19.6134 32 25.2727 26.3107 25.2727 19.2975V12.7025C25.2727 9.19508 22.1429 6.34426 18.3636 6.34426C14.5844 6.34426 11.4545 9.19508 11.4545 12.7025C11.4545 16.2098 14.5844 19.0607 18.3636 19.0607C20.2532 19.0607 21.9481 18.2951 23.1818 17.0328" stroke="#1DE189" stroke-width="2"/>
                        </svg>
                        <span style="font-family: Inter, sans-serif; font-size: 18px; font-weight: 500; color: #1DE189; letter-spacing: 0.05em;">RIVERSTROM</span>
                    </div>
                `;

                el.innerHTML = newLogoHTML;
                console.log('[Mobile Logo Fix] Logo replaced successfully');
            }
        });

        // Also look for SVG elements that might be the logo
        const allSVGs = document.querySelectorAll('svg');
        allSVGs.forEach(svg => {
            // Check if SVG is in a container that looks like a logo
            const parent = svg.closest('a[href="/"]') || svg.closest('[class*="logo"]');
            if (parent) {
                const nearbyText = parent.textContent.trim();
                if (nearbyText.includes('тау') || nearbyText.includes('RUS')) {
                    console.log('[Mobile Logo Fix] Found logo with incorrect text near SVG');
                    // Find the text element and replace it
                    const textEl = parent.querySelector('[data-framer-component-type="Text"]');
                    if (textEl) {
                        textEl.innerHTML = '<span style="font-family: Inter, sans-serif; font-size: 18px; font-weight: 500; color: #1DE189; letter-spacing: 0.05em;">RIVERSTROM</span>';
                        console.log('[Mobile Logo Fix] Text replaced');
                    }
                }
            }
        });
    }

    // Run on initial load
    function init() {
        setTimeout(replaceMobileLogo, 1000);

        // Watch for mobile menu opening
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if this is a menu overlay
                        if (node.getAttribute && (
                            node.getAttribute('data-framer-name') === 'Overlay' ||
                            node.className && node.className.includes('overlay')
                        )) {
                            console.log('[Mobile Logo Fix] Menu overlay detected, replacing logo...');
                            setTimeout(replaceMobileLogo, 300);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[Mobile Logo Fix] Monitoring for menu changes...');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/**
 * Fix Mobile Menu Logo - Hide logo area with white rectangle
 * Detects when hamburger menu is clicked and shows a white rectangle to cover the logo
 */

(function() {
    'use strict';

    console.log('[Mobile Logo Fix] Initializing...');

    let mobileMenuOpen = false;

    let coverRectCreated = false;
    let clickDetectionSetup = false;

    function createMobileLogoCover() {
        if (coverRectCreated) {
            console.log('[Mobile Logo Fix] Rectangle already created, skipping');
            return;
        }

        // Create the rectangle element (hidden by default)
        let coverRect = document.getElementById('mobile-logo-cover');

        if (!coverRect) {
            coverRect = document.createElement('div');
            coverRect.id = 'mobile-logo-cover';
            coverRect.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 80px !important;
                background: rgb(255, 255, 255) !important;
                z-index: 999999999 !important;
                pointer-events: none !important;
                display: none !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            `;
            document.body.appendChild(coverRect);
            coverRectCreated = true;
            console.log('[Mobile Logo Fix] ✅ Created cover rectangle (100vw x 80px)');
        } else {
            coverRectCreated = true;
        }
    }

    function showMobileLogoCover() {
        const coverRect = document.getElementById('mobile-logo-cover');
        if (coverRect && mobileMenuOpen) {
            coverRect.style.display = 'block';
            console.log('[Mobile Logo Fix] ✅ Showing cover rectangle');
        } else if (coverRect) {
            coverRect.style.display = 'none';
        }
    }

    function hideMobileLogoCover() {
        const coverRect = document.getElementById('mobile-logo-cover');
        if (coverRect) {
            coverRect.style.display = 'none';
            console.log('[Mobile Logo Fix] Hiding cover rectangle');
        }
    }

    function setupMobileMenuDetection() {
        if (clickDetectionSetup) {
            console.log('[Mobile Logo Fix] Click detection already setup, skipping');
            return;
        }

        if (window.innerWidth > 809) {
            return;
        }

        clickDetectionSetup = true;

        // Listen for clicks on the entire document
        document.addEventListener('click', function(e) {
            const clickX = e.clientX;
            const clickY = e.clientY;
            const viewportWidth = window.innerWidth;

            // Check if click is in top-right area (hamburger menu location)
            // Top-right = right 20% of screen, top 100px
            const isTopRight = clickX > viewportWidth * 0.8 && clickY < 100;

            if (isTopRight) {
                // Toggle menu state
                mobileMenuOpen = !mobileMenuOpen;
                console.log('[Mobile Logo Fix] Menu toggled:', mobileMenuOpen ? 'OPEN' : 'CLOSED');

                // Show/hide cover immediately
                showMobileLogoCover();
            }
        }, false); // Use false (bubble phase) so we don't block the actual click

        // Also listen for clicks outside to close menu
        document.addEventListener('click', function(e) {
            if (mobileMenuOpen) {
                const clickX = e.clientX;
                const clickY = e.clientY;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Check if click is in main content area (not in menu area)
                const isMainContent = clickY > 100 || clickX < viewportWidth * 0.5;

                if (isMainContent) {
                    // Check immediately if menu should close
                    const allDivs = document.querySelectorAll('div');
                    let hasFullScreenDiv = false;

                    allDivs.forEach(div => {
                        const rect = div.getBoundingClientRect();
                        if (rect.width >= viewportWidth * 0.95 && rect.height >= viewportHeight * 0.8) {
                            hasFullScreenDiv = true;
                        }
                    });

                    if (!hasFullScreenDiv) {
                        mobileMenuOpen = false;
                        hideMobileLogoCover();
                        console.log('[Mobile Logo Fix] Menu closed by content click');
                    }
                }
            }
        }, false);

        console.log('[Mobile Logo Fix] Click detection initialized');
    }

    // Expose functions globally for debugging
    window.createMobileLogoCover = createMobileLogoCover;
    window.showMobileLogoCover = showMobileLogoCover;
    window.hideMobileLogoCover = hideMobileLogoCover;

    // Initialize on mobile
    function init() {
        console.log('[Mobile Logo Fix] Init called, viewport width:', window.innerWidth);
        if (window.innerWidth <= 809) {
            console.log('[Mobile Logo Fix] Mobile viewport detected, setting up...');
            createMobileLogoCover(); // Create the rectangle element
            setupMobileMenuDetection(); // Set up click listeners
        } else {
            console.log('[Mobile Logo Fix] Not mobile viewport, skipping');
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        console.log('[Mobile Logo Fix] Waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        console.log('[Mobile Logo Fix] DOM already ready, running init...');
        init();
    }

    // Also listen for viewport changes
    window.addEventListener('resize', () => {
        console.log('[Mobile Logo Fix] Resize detected, viewport:', window.innerWidth);
        init();
    });

    // Run init after a short delay to catch viewport changes
    setTimeout(() => {
        console.log('[Mobile Logo Fix] Delayed init check, viewport:', window.innerWidth);
        init();
    }, 100);
})();

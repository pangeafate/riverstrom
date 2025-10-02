/**
 * Fix Mobile Menu Logo - Hide logo area with white rectangle
 * Uses MutationObserver to detect actual menu state changes (reliable in production)
 */

(function() {
    'use strict';

    console.log('[Mobile Logo Fix] Initializing with DOM observation...');

    let coverRect = null;
    let observer = null;
    let isMenuOpen = false;

    function createCoverRectangle() {
        if (coverRect) return;

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
        console.log('[Mobile Logo Fix] ✅ Rectangle created');
    }

    function showCover() {
        if (coverRect && !isMenuOpen) {
            coverRect.style.display = 'block';
            isMenuOpen = true;
            console.log('[Mobile Logo Fix] ✅ Cover shown');
        }
    }

    function hideCover() {
        if (coverRect && isMenuOpen) {
            coverRect.style.display = 'none';
            isMenuOpen = false;
            console.log('[Mobile Logo Fix] ✅ Cover hidden');
        }
    }

    function checkMenuState() {
        // Look for the mobile menu overlay (Framer creates a full-screen div when menu opens)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Find divs that could be the menu overlay
        const allDivs = document.querySelectorAll('div');
        let menuIsOpen = false;

        allDivs.forEach(div => {
            const rect = div.getBoundingClientRect();
            const style = window.getComputedStyle(div);

            // Check if this is a full-screen overlay (menu)
            // Framer menu: full width/height, high z-index, visible
            if (rect.width >= viewportWidth * 0.9 &&
                rect.height >= viewportHeight * 0.7 &&
                style.position === 'fixed' &&
                parseInt(style.zIndex) > 100 &&
                style.opacity !== '0' &&
                style.display !== 'none' &&
                style.visibility !== 'hidden') {
                menuIsOpen = true;
            }
        });

        if (menuIsOpen) {
            showCover();
        } else {
            hideCover();
        }
    }

    function startObserving() {
        if (observer) return;

        observer = new MutationObserver((mutations) => {
            // Check menu state whenever DOM changes
            checkMenuState();
        });

        // Observe the entire body for changes
        observer.observe(document.body, {
            childList: true,      // Watch for added/removed elements
            subtree: true,        // Watch entire subtree
            attributes: true,     // Watch attribute changes (style, class, etc.)
            attributeFilter: ['style', 'class', 'data-framer-name'] // Only relevant attributes
        });

        console.log('[Mobile Logo Fix] ✅ Observer started');
    }

    function init() {
        const viewportWidth = window.innerWidth;
        console.log('[Mobile Logo Fix] Init, viewport:', viewportWidth);

        if (viewportWidth > 809) {
            console.log('[Mobile Logo Fix] Desktop viewport, skipping');
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            if (coverRect) {
                coverRect.style.display = 'none';
            }
            return;
        }

        console.log('[Mobile Logo Fix] Mobile viewport detected');
        createCoverRectangle();
        startObserving();
        checkMenuState(); // Initial check
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-initialize on viewport changes
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(init, 150);
    });

    // Expose for debugging
    window.mobileLogoFix = {
        checkMenuState,
        showCover,
        hideCover,
        getState: () => ({ isMenuOpen, hasRect: !!coverRect, hasObserver: !!observer })
    };

    console.log('[Mobile Logo Fix] ✅ Initialized (use window.mobileLogoFix for debugging)');
})();

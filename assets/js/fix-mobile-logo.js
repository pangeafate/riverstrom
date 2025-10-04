/**
 * Fix Mobile Menu Logo - Hide logo area with white rectangle
 * Ultra-fast MutationObserver with synchronous checks for instant response
 */

(function() {
    'use strict';

    console.log('[Mobile Logo Fix] Initializing with ultra-fast DOM observation...');

    let coverRect = null;
    let observer = null;
    let isMenuOpen = false;
    let checkScheduled = false;

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
        // Ultra-fast check - runs synchronously
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const allDivs = document.querySelectorAll('div');
        let menuIsOpen = false;

        for (let i = 0; i < allDivs.length; i++) {
            const div = allDivs[i];
            const rect = div.getBoundingClientRect();
            const style = window.getComputedStyle(div);

            // Check if this is a full-screen overlay (menu)
            if (rect.width >= viewportWidth * 0.9 &&
                rect.height >= viewportHeight * 0.7 &&
                style.position === 'fixed' &&
                parseInt(style.zIndex) > 100 &&
                style.opacity !== '0' &&
                style.display !== 'none' &&
                style.visibility !== 'hidden') {
                menuIsOpen = true;
                break; // Exit early when found
            }
        }

        if (menuIsOpen) {
            showCover();
        } else {
            hideCover();
        }

        checkScheduled = false;
    }

    function scheduleCheck() {
        // Use synchronous check instead of debouncing
        if (!checkScheduled) {
            checkScheduled = true;
            // Check immediately, no setTimeout
            checkMenuState();
        }
    }

    function startObserving() {
        if (observer) return;

        observer = new MutationObserver((mutations) => {
            // Immediate synchronous check on every mutation
            scheduleCheck();
        });

        // Observe with maximum sensitivity
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'data-framer-name'],
            attributeOldValue: false,
            characterData: false
        });

        console.log('[Mobile Logo Fix] ✅ Observer started (ultra-fast mode)');
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
        resizeTimeout = setTimeout(init, 100);
    });

    // Also check on any click (for instant response to hamburger)
    document.addEventListener('click', () => {
        if (window.innerWidth <= 809) {
            // Double-check menu state on any click for instant response
            setTimeout(checkMenuState, 0);
            setTimeout(checkMenuState, 10);
        }
    }, true); // Use capture phase to run before other handlers

    // Expose for debugging
    window.mobileLogoFix = {
        checkMenuState,
        showCover,
        hideCover,
        getState: () => ({ isMenuOpen, hasRect: !!coverRect, hasObserver: !!observer })
    };

    console.log('[Mobile Logo Fix] ✅ Initialized (ultra-fast mode with click detection)');
})();

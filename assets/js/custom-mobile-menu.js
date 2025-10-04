/**
 * Custom Mobile Menu - Replaces Framer's menu with pixel-perfect custom version
 * Includes RIVERSTROM logo and prevents all Framer menu interactions
 */

(function() {
    'use strict';

    console.log('[Custom Mobile Menu] Initializing...');

    let menuOpen = false;

    // Hide Framer's hamburger menu completely
    function hideFramerMenu() {
        const style = document.createElement('style');
        style.id = 'hide-framer-menu';
        style.textContent = `
            /* Hide Framer's mobile menu hamburger and overlay */
            [data-framer-name*="Nav"] { display: none !important; }
            [data-framer-component-type*="menu"] { display: none !important; }

            /* Prevent Framer menu clicks */
            body.custom-menu-active { pointer-events: none !important; }
            body.custom-menu-active #custom-mobile-menu { pointer-events: all !important; }
            body.custom-menu-active #custom-hamburger { pointer-events: all !important; }
        `;
        document.head.appendChild(style);
    }

    // Create custom hamburger button (matches screenshot)
    function createHamburger() {
        const hamburger = document.createElement('div');
        hamburger.id = 'custom-hamburger';
        hamburger.innerHTML = `
            <div class="hamburger-lines">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #custom-hamburger {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                z-index: 9999999999;
                cursor: pointer;
                display: none;
            }

            @media (max-width: 809px) {
                #custom-hamburger { display: flex; }
            }

            .hamburger-lines {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                gap: 6px;
            }

            .hamburger-lines span {
                display: block;
                height: 2px;
                background: #000;
                transition: all 0.3s ease;
            }

            .hamburger-lines span:nth-child(1) { width: 100%; }
            .hamburger-lines span:nth-child(2) { width: 80%; }
            .hamburger-lines span:nth-child(3) { width: 100%; }

            /* X icon when menu is open */
            #custom-hamburger.menu-open .hamburger-lines span:nth-child(1) {
                transform: rotate(45deg) translate(8px, 8px);
                width: 100%;
            }

            #custom-hamburger.menu-open .hamburger-lines span:nth-child(2) {
                opacity: 0;
            }

            #custom-hamburger.menu-open .hamburger-lines span:nth-child(3) {
                transform: rotate(-45deg) translate(8px, -8px);
                width: 100%;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(hamburger);

        hamburger.addEventListener('click', toggleMenu);
    }

    // Create custom menu overlay (matches screenshot exactly)
    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'custom-mobile-menu';
        menu.innerHTML = `
            <div class="menu-content">
                <div class="menu-logo">
                    <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
                        <path d="M22.5 0C10.074 0 0 10.074 0 22.5S10.074 45 22.5 45 45 34.926 45 22.5 34.926 0 22.5 0z" fill="#1DE189"/>
                        <path d="M15 15h15v15H15V15z" fill="#fff"/>
                    </svg>
                    <span>RIVERSTROM</span>
                </div>

                <nav class="menu-nav">
                    <a href="/page.html">Продукты</a>
                    <a href="/page.html#pricing">Цены</a>
                    <a href="/page.html#about">О компании</a>
                    <a href="/contact">Контакты</a>
                </nav>

                <a href="/contact" class="menu-cta">
                    Оставить заявку
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </a>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #custom-mobile-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #fff;
                z-index: 9999999998;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            #custom-mobile-menu.active {
                display: flex;
                opacity: 1;
            }

            @media (min-width: 810px) {
                #custom-mobile-menu { display: none !important; }
            }

            .menu-content {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 80px 40px 40px;
                gap: 60px;
            }

            .menu-logo {
                display: flex;
                align-items: center;
                gap: 12px;
                display: none; /* Hidden for now, add logo later */
            }

            .menu-logo span {
                font-size: 20px;
                font-weight: 600;
                color: #1DE189;
                font-family: 'Inter', sans-serif;
            }

            .menu-nav {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 32px;
            }

            .menu-nav a {
                font-size: 32px;
                font-weight: 400;
                color: #C3C4C5;
                text-decoration: none;
                font-family: 'Inter', sans-serif;
                transition: color 0.2s ease;
            }

            .menu-nav a:hover {
                color: #575757;
            }

            .menu-cta {
                display: inline-flex;
                align-items: center;
                gap: 12px;
                padding: 16px 32px;
                background: transparent;
                border: 1px solid #ECECED;
                border-radius: 100px;
                font-size: 16px;
                font-weight: 500;
                color: #262628;
                text-decoration: none;
                font-family: 'Inter', sans-serif;
                transition: all 0.2s ease;
            }

            .menu-cta:hover {
                background: #f5f5f5;
            }

            .menu-cta svg {
                width: 16px;
                height: 16px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(menu);
    }

    function toggleMenu() {
        menuOpen = !menuOpen;
        const menu = document.getElementById('custom-mobile-menu');
        const hamburger = document.getElementById('custom-hamburger');

        if (menuOpen) {
            menu.classList.add('active');
            hamburger.classList.add('menu-open');
            document.body.classList.add('custom-menu-active');
            document.body.style.overflow = 'hidden';
        } else {
            menu.classList.remove('active');
            hamburger.classList.remove('menu-open');
            document.body.classList.remove('custom-menu-active');
            document.body.style.overflow = '';
        }

        console.log('[Custom Mobile Menu] Menu', menuOpen ? 'opened' : 'closed');
    }

    // Close menu when clicking menu links
    function setupMenuLinks() {
        const menu = document.getElementById('custom-mobile-menu');
        menu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                toggleMenu();
            }
        });
    }

    // Initialize
    function init() {
        if (window.innerWidth <= 809) {
            hideFramerMenu();
            createHamburger();
            createMenu();
            setupMenuLinks();
            console.log('[Custom Mobile Menu] ✅ Initialized');
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.customMobileMenu = {
        toggleMenu,
        isOpen: () => menuOpen
    };

})();

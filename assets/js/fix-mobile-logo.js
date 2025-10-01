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
        console.log('[Mobile Logo Fix] Running replacement...');

        // Method 1: Look for ALL elements with the wrong text (more aggressive)
        const allElements = document.querySelectorAll('*');
        let replacementCount = 0;

        allElements.forEach(el => {
            // Skip script and style elements
            if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;

            // Check direct text nodes
            Array.from(el.childNodes).forEach(node => {
                if (node.nodeType === 3) { // Text node
                    const text = node.textContent;
                    if (text.includes('тау') || text.includes('RUS')) {
                        console.log('[Mobile Logo Fix] Found wrong text in text node:', text);
                        node.textContent = text.replace(/тау/g, '').replace(/RUS/g, 'RIVERSTROM');
                        replacementCount++;
                    }
                }
            });

            // Check element's own text content
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                const text = el.textContent.trim();
                if (text === 'тауRUS' || text === 'tayRUS' || text === 'тау' || text === 'RUS') {
                    console.log('[Mobile Logo Fix] Found wrong text in element:', text, el.tagName, el.className);
                    el.textContent = 'RIVERSTROM';
                    el.style.fontFamily = 'Inter, sans-serif';
                    el.style.fontSize = '18px';
                    el.style.fontWeight = '500';
                    el.style.color = '#1DE189';
                    el.style.letterSpacing = '0.05em';
                    replacementCount++;
                }
            }
        });

        // Method 2: Look specifically for Framer text components
        const allTextElements = document.querySelectorAll('[data-framer-component-type="Text"]');
        allTextElements.forEach(el => {
            const text = el.textContent.trim();
            if (text.includes('тау') || text.includes('RUS') || text === 'тауRUS' || text === 'tayRUS') {
                console.log('[Mobile Logo Fix] Found incorrect logo in Framer component:', text);
                el.textContent = 'RIVERSTROM';
                el.style.fontFamily = 'Inter, sans-serif';
                el.style.fontSize = '18px';
                el.style.fontWeight = '500';
                el.style.color = '#1DE189';
                el.style.letterSpacing = '0.05em';
                replacementCount++;
            }
        });

        // Method 3: Use CSS to hide wrong text and inject correct one
        if (replacementCount === 0) {
            console.log('[Mobile Logo Fix] No replacements made, trying CSS method...');

            // Find any element containing the wrong text
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.includes('тау') || node.textContent.includes('RUS')) {
                    const parent = node.parentElement;
                    if (parent) {
                        console.log('[Mobile Logo Fix] Found wrong text via tree walker:', node.textContent);
                        parent.style.display = 'none';

                        // Create replacement
                        const replacement = document.createElement('span');
                        replacement.textContent = 'RIVERSTROM';
                        replacement.style.fontFamily = 'Inter, sans-serif';
                        replacement.style.fontSize = '18px';
                        replacement.style.fontWeight = '500';
                        replacement.style.color = '#1DE189';
                        replacement.style.letterSpacing = '0.05em';

                        parent.parentElement.insertBefore(replacement, parent);
                        replacementCount++;
                    }
                }
            }
        }

        console.log('[Mobile Logo Fix] Replacements made:', replacementCount);
    }

    // Run on initial load
    function init() {
        // Run multiple times to catch React renders
        setTimeout(replaceMobileLogo, 500);
        setTimeout(replaceMobileLogo, 1000);
        setTimeout(replaceMobileLogo, 2000);

        // Watch for ANY DOM changes and run replacement
        const observer = new MutationObserver(() => {
            replaceMobileLogo();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
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

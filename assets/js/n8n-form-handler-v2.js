/**
 * N8N Form Handler V2 - Minimal interference with Framer forms
 * Captures form data and sends to N8N without breaking Framer's functionality
 */

(function() {
    'use strict';

    const N8N_WEBHOOK_URL = 'https://n8n.lakestrom.com/webhook/contact-form';
    let isProcessing = false;

    function init() {
        console.log('[N8N Handler V2] Initializing...');

        // Wait for Framer's initial render
        setTimeout(() => {
            waitForFramerHydration();
        }, 1000);
    }

    function waitForFramerHydration() {
        // Check if Framer has finished hydrating by looking for ANY Framer form
        const forms = document.querySelectorAll('form[class*="framer-"]');

        if (forms.length === 0) {
            console.log('[N8N Handler V2] Waiting for Framer hydration...');
            setTimeout(waitForFramerHydration, 300);
            return;
        }

        console.log(`[N8N Handler V2] Found ${forms.length} Framer form(s)`);

        // Wait a bit more to ensure hydration is complete
        setTimeout(() => {
            setupFormCapture();
        }, 500);
    }

    function setupFormCapture() {
        // Find ALL Framer forms and attach handlers
        const forms = document.querySelectorAll('form[class*="framer-"]');

        if (forms.length === 0) {
            console.log('[N8N Handler V2] No forms found after hydration, retrying...');
            setTimeout(setupFormCapture, 500);
            return;
        }

        console.log(`[N8N Handler V2] Attaching handlers to ${forms.length} form(s)`);

        forms.forEach((form, index) => {
            // Skip if already handled
            if (form.dataset.n8nHandled) {
                console.log(`[N8N Handler V2] Form ${index} already handled, skipping`);
                return;
            }

            console.log(`[N8N Handler V2] Attaching handler to form ${index}:`, form.className);

            // Mark as handled
            form.dataset.n8nHandled = 'true';

            // Intercept form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                if (isProcessing) return;

                const button = form.querySelector('button[type="submit"]');
                handleFormSubmit(form, button, e);
            }, true); // Use capture phase to intercept before Framer
        });

        console.log('[N8N Handler V2] All forms handled successfully');
    }

    function handleFormSubmit(form, button, event) {
        console.log('[N8N Handler V2] handleFormSubmit called');

        if (isProcessing) {
            console.log('[N8N Handler V2] Already processing, skipping');
            return;
        }

        // Collect form data
        const formData = collectFormData(form);
        console.log('[N8N Handler V2] Collected form data:', formData);

        // Check if all required fields are filled
        if (!formData.email || !formData.message) {
            console.log('[N8N Handler V2] Missing required fields - email:', !!formData.email, 'message:', !!formData.message);
            // Let browser validation handle it
            return;
        }

        console.log('[N8N Handler V2] All fields valid, submitting to N8N...');

        isProcessing = true;
        submitToN8N(formData, button, form);
    }

    function collectFormData(form) {
        const data = {};
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach((input, index) => {
            const value = input.value.trim();
            const name = (input.name || '').toLowerCase(); // Case-insensitive matching
            const placeholder = (input.placeholder || '').toLowerCase();

            if (!value) return;

            // Try to identify field by name first (case-insensitive)
            if (name === 'firstname' || name === 'first-name' || name === 'name') {
                data.firstName = value;
            } else if (name === 'lastname' || name === 'last-name') {
                data.lastName = value;
            } else if (name === 'email') {
                data.email = value;
            } else if (name === 'city') {
                data.city = value;
            } else if (name === 'message') {
                data.message = value;
            } else if (name === 'promocode') {
                data.promoCode = value;
            } else if (placeholder.includes('имя') && !placeholder.includes('фамилия')) {
                data.firstName = value;
            } else if (placeholder.includes('фамилия')) {
                data.lastName = value;
            } else if (placeholder.includes('email') || placeholder.includes('@') || input.type === 'email') {
                data.email = value;
            } else if (placeholder.includes('город') || input.tagName === 'SELECT') {
                data.city = value;
            } else if (placeholder.includes('сообщение') || placeholder.includes('message') || input.tagName === 'TEXTAREA') {
                data.message = value;
            }
        });

        // Add metadata
        data.referer = window.location.href;
        data.timestamp = new Date().toISOString();

        return data;
    }

    async function submitToN8N(data, button, form) {
        const originalText = button.textContent;
        button.textContent = 'Отправка...';
        button.disabled = true;

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
                mode: 'cors'
            });

            if (response.ok) {
                console.log('[N8N Handler V2] Success!');
                button.textContent = '✓ Отправлено!';
                button.style.backgroundColor = '#10b981';

                // Clear form inputs
                form.reset();

                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'n8n_form',
                        'event_label': 'contact'
                    });
                }

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                    button.disabled = false;
                    isProcessing = false;
                }, 3000);
            } else {
                throw new Error('HTTP ' + response.status);
            }
        } catch (error) {
            console.error('[N8N Handler V2] Error:', error);
            button.textContent = '✗ Ошибка';
            button.style.backgroundColor = '#ef4444';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.disabled = false;
                isProcessing = false;
            }, 3000);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.N8NHandlerV2 = {
        collectFormData,
        submitToN8N,
        webhook: N8N_WEBHOOK_URL
    };
})();
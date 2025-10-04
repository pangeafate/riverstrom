/**
 * N8N Form Handler V3 - Hijacks Framer form without DOM replacement
 * Intercepts form submission and redirects to N8N while keeping Framer UI intact
 */

(function() {
    'use strict';

    const N8N_WEBHOOK_URL = 'https://n8n.lakestrom.com/webhook/contact-form';
    let isProcessing = false;
    let formIntercepted = false;

    function init() {
        console.log('[N8N Handler V3] Initializing...');

        // Wait for Framer to fully hydrate
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(interceptForm, 2000);
            });
        } else {
            setTimeout(interceptForm, 2000);
        }
    }

    function interceptForm() {
        const form = document.querySelector('form.framer-7wmuvs');

        if (!form) {
            console.log('[N8N Handler V3] Form not found, retrying...');
            setTimeout(interceptForm, 500);
            return;
        }

        if (formIntercepted) {
            return;
        }

        console.log('[N8N Handler V3] Form found, intercepting...');

        // Use capture phase to intercept BEFORE Framer's handlers
        form.addEventListener('submit', handleSubmit, true);

        formIntercepted = true;
    }

    function handleSubmit(event) {
        // Prevent default form submission
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (isProcessing) {
            console.log('[N8N Handler V3] Already processing, ignoring...');
            return false;
        }

        console.log('[N8N Handler V3] Form submit intercepted');

        const form = event.target;
        const formData = collectFormData(form);

        // Validate required fields
        if (!formData.email || !formData.message) {
            console.log('[N8N Handler V3] Missing required fields');
            alert('Пожалуйста, заполните все обязательные поля');
            return false;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        submitToN8N(formData, submitButton, form);

        return false;
    }

    function collectFormData(form) {
        const data = {};

        // Get all form inputs
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            const value = input.value.trim();
            if (!value) return;

            const name = input.name;
            const placeholder = (input.placeholder || '').toLowerCase();

            // Map by name attribute (if Framer provides them)
            if (name && name !== 'website') {
                data[name] = value;
            }
            // Fallback to placeholder matching
            else if (placeholder.includes('иван') || placeholder.includes('name')) {
                data.firstName = value;
            } else if (placeholder.includes('петров') || placeholder.includes('last')) {
                data.lastName = value;
            } else if (placeholder.includes('yandex') || placeholder.includes('@') || input.type === 'email') {
                data.email = value;
            } else if (input.tagName === 'SELECT' || placeholder.includes('select')) {
                data.city = value;
            } else if (input.tagName === 'TEXTAREA' || placeholder.includes('расскажите')) {
                data.message = value;
            }
        });

        // Add metadata
        data.referer = window.location.href;
        data.timestamp = new Date().toISOString();

        console.log('[N8N Handler V3] Collected data:', data);
        return data;
    }

    async function submitToN8N(data, button, form) {
        isProcessing = true;

        const originalText = button.textContent;
        const originalBg = button.style.backgroundColor;

        button.textContent = 'Отправка...';
        button.disabled = true;
        button.style.opacity = '0.7';

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
                console.log('[N8N Handler V3] Success!');
                button.textContent = '✓ Отправлено!';
                button.style.backgroundColor = '#10b981';
                button.style.opacity = '1';

                // Clear form
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    if (input.type !== 'hidden') {
                        input.value = '';
                    }
                });

                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'n8n_form',
                        'event_label': 'contact'
                    });
                }

                // Reset button after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = originalBg;
                    button.style.opacity = '';
                    button.disabled = false;
                    isProcessing = false;
                }, 3000);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('[N8N Handler V3] Error:', error);

            button.textContent = '✗ Ошибка';
            button.style.backgroundColor = '#ef4444';
            button.style.opacity = '1';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = originalBg;
                button.style.opacity = '';
                button.disabled = false;
                isProcessing = false;
            }, 3000);
        }
    }

    // Initialize
    init();

    // Expose for debugging
    window.N8NHandlerV3 = {
        interceptForm,
        collectFormData,
        webhook: N8N_WEBHOOK_URL
    };
})();

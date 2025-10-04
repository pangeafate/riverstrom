/**
 * N8N Form Handler - Intercepts Framer form submissions and redirects to N8N webhook
 * Works with existing Framer forms without replacing them
 */

(function() {
    'use strict';

    // N8N webhook configuration
    const N8N_WEBHOOK_URL = 'https://n8n.lakestrom.com/webhook/contact-form';

    // Debounce function to prevent multiple initializations
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Intercept Framer form submissions
     */
    function interceptFramerForms() {
        console.log('[N8N Form Handler] Searching for Framer forms...');

        // Find all input elements and work backwards to find their form containers
        const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
        const processedContainers = new Set();

        allInputs.forEach(input => {
            // Find the closest container that looks like a form
            let formContainer = input.closest('[data-framer-component-type]');

            // Go up the tree to find a container with multiple inputs
            while (formContainer && formContainer.parentElement) {
                const inputs = formContainer.querySelectorAll('input, textarea');
                const buttons = formContainer.querySelectorAll('button');

                // If we found a container with multiple inputs and a button, it's likely a form
                if (inputs.length >= 2 && buttons.length > 0) {
                    break;
                }
                formContainer = formContainer.parentElement.closest('[data-framer-component-type]');
            }

            if (formContainer && !processedContainers.has(formContainer)) {
                processedContainers.add(formContainer);
                setupFormInterception(formContainer);
            }
        });

        // Also try to intercept any actual form elements (rare in Framer but possible)
        document.querySelectorAll('form').forEach(form => {
            if (!form.dataset.n8nProcessed) {
                form.dataset.n8nProcessed = 'true';
                interceptFormSubmit(form);
            }
        });

        console.log(`[N8N Form Handler] Processed ${processedContainers.size} form containers`);
    }

    /**
     * Setup interception for a Framer form container
     */
    function setupFormInterception(container) {
        // Find all inputs and the submit button
        const inputs = container.querySelectorAll('input:not([type="hidden"]), textarea, select');
        const submitButton = container.querySelector('button');

        if (!submitButton) {
            console.log('[N8N Form Handler] No submit button found in container');
            return;
        }

        // Mark as processed
        container.dataset.n8nProcessed = 'true';

        // Create a virtual form object to track values
        const virtualForm = {
            fields: {},
            container: container,
            button: submitButton
        };

        // Map common field patterns to N8N field names
        const fieldMappings = {
            'имя': 'firstName',
            'name': 'firstName',
            'first': 'firstName',
            'фамилия': 'lastName',
            'surname': 'lastName',
            'last': 'lastName',
            'email': 'email',
            'почта': 'email',
            'компания': 'company',
            'company': 'company',
            'organization': 'company',
            'город': 'city',
            'city': 'city',
            'сообщение': 'message',
            'message': 'message',
            'comment': 'message',
            'text': 'message'
        };

        // Process each input
        inputs.forEach((input, index) => {
            // Try to determine field name from placeholder, name, or nearby label
            let fieldName = null;

            // Check placeholder
            const placeholder = (input.placeholder || '').toLowerCase();
            for (const [key, value] of Object.entries(fieldMappings)) {
                if (placeholder.includes(key)) {
                    fieldName = value;
                    break;
                }
            }

            // Check name attribute
            if (!fieldName && input.name) {
                const name = input.name.toLowerCase();
                for (const [key, value] of Object.entries(fieldMappings)) {
                    if (name.includes(key)) {
                        fieldName = value;
                        break;
                    }
                }
            }

            // Check nearby text
            if (!fieldName) {
                const parent = input.closest('[data-framer-component-type]');
                if (parent) {
                    const text = (parent.textContent || '').toLowerCase();
                    for (const [key, value] of Object.entries(fieldMappings)) {
                        if (text.includes(key)) {
                            fieldName = value;
                            break;
                        }
                    }
                }
            }

            // Fallback field names based on position and type
            if (!fieldName) {
                if (input.type === 'email') {
                    fieldName = 'email';
                } else if (input.tagName === 'TEXTAREA') {
                    fieldName = 'message';
                } else if (index === 0) {
                    fieldName = 'firstName';
                } else if (index === 1) {
                    fieldName = 'lastName';
                } else if (index === 2) {
                    fieldName = 'city';
                }
            }

            // Store the input reference
            if (fieldName) {
                virtualForm.fields[fieldName] = input;
                // Add data attribute for debugging
                input.dataset.n8nField = fieldName;
            }
        });

        console.log('[N8N Form Handler] Mapped fields:', Object.keys(virtualForm.fields));

        // Intercept button click
        const originalOnClick = submitButton.onclick;
        submitButton.onclick = null;

        // Remove existing event listeners by cloning
        const newButton = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newButton, submitButton);
        virtualForm.button = newButton;

        // Add our handler
        newButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handleFormSubmit(virtualForm, e);
        });

        // Also intercept Enter key in inputs
        Object.values(virtualForm.fields).forEach(input => {
            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    await handleFormSubmit(virtualForm, e);
                }
            });
        });
    }

    /**
     * Handle form submission
     */
    async function handleFormSubmit(virtualForm, event) {
        console.log('[N8N Form Handler] Handling form submission...');

        // Collect form data
        const formData = {};
        for (const [fieldName, input] of Object.entries(virtualForm.fields)) {
            formData[fieldName] = input.value || '';
        }

        // Add referer
        formData.referer = window.location.href;

        console.log('[N8N Form Handler] Form data:', formData);

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'city', 'message'];
        const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');

        if (missingFields.length > 0) {
            // Highlight empty required fields
            missingFields.forEach(field => {
                if (virtualForm.fields[field]) {
                    virtualForm.fields[field].style.borderColor = '#ef4444';
                    setTimeout(() => {
                        virtualForm.fields[field].style.borderColor = '';
                    }, 3000);
                }
            });
            console.log('[N8N Form Handler] Missing required fields:', missingFields);
            return;
        }

        // Show loading state
        const button = virtualForm.button;
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Отправка...';
        button.style.opacity = '0.7';

        try {
            // Submit to N8N
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                mode: 'cors'
            });

            if (response.ok) {
                console.log('[N8N Form Handler] Form submitted successfully');

                // Clear form
                Object.values(virtualForm.fields).forEach(input => {
                    input.value = '';
                });

                // Show success
                button.textContent = '✓ Отправлено!';
                button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                // Track event if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'engagement',
                        'event_label': 'contact_form_n8n'
                    });
                }

                // Reset button after delay
                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = originalText;
                    button.style.opacity = '';
                    button.style.background = '';
                }, 3000);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('[N8N Form Handler] Submission error:', error);

            // Show error
            button.textContent = '✗ Ошибка';
            button.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

            // Reset button after delay
            setTimeout(() => {
                button.disabled = false;
                button.textContent = originalText;
                button.style.opacity = '';
                button.style.background = '';
            }, 3000);
        }
    }

    /**
     * Intercept traditional form submit
     */
    function interceptFormSubmit(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {};

            // Convert FormData to object with field mapping
            formData.forEach((value, key) => {
                // Map to expected N8N fields
                if (key.toLowerCase().includes('name') || key.toLowerCase().includes('имя')) {
                    if (key.toLowerCase().includes('last') || key.toLowerCase().includes('фамилия')) {
                        data.lastName = value;
                    } else {
                        data.firstName = value;
                    }
                } else if (key.toLowerCase().includes('email')) {
                    data.email = value;
                } else if (key.toLowerCase().includes('company') || key.toLowerCase().includes('компания')) {
                    data.company = value;
                } else if (key.toLowerCase().includes('city') || key.toLowerCase().includes('город')) {
                    data.city = value;
                } else if (key.toLowerCase().includes('message') || key.toLowerCase().includes('сообщение')) {
                    data.message = value;
                } else {
                    data[key] = value;
                }
            });

            // Add referer
            data.referer = window.location.href;

            console.log('[N8N Form Handler] Intercepted form submission:', data);

            // Submit to N8N
            try {
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                    mode: 'cors'
                });

                if (response.ok) {
                    console.log('[N8N Form Handler] Form submitted successfully');
                    form.reset();

                    // Show success message
                    const submitButton = form.querySelector('[type="submit"], button');
                    if (submitButton) {
                        const originalText = submitButton.textContent;
                        submitButton.textContent = '✓ Отправлено!';
                        setTimeout(() => {
                            submitButton.textContent = originalText;
                        }, 3000);
                    }
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                console.error('[N8N Form Handler] Submission error:', error);
                alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
            }
        });
    }

    /**
     * Initialize the handler
     */
    function init() {
        interceptFramerForms();

        // Watch for dynamic content changes
        const observer = new MutationObserver(debounce(() => {
            // Re-scan for new forms
            interceptFramerForms();
        }, 500));

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for DOM and Framer to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 1000); // Give Framer time to render
        });
    } else {
        // DOM is ready, but wait for Framer
        setTimeout(init, 1000);
    }

    // Also try again after a longer delay in case Framer loads content later
    setTimeout(init, 3000);

    // Expose for debugging
    window.N8NFormHandler = {
        interceptFramerForms,
        webhook: N8N_WEBHOOK_URL
    };
})();
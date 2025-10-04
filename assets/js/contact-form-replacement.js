/**
 * Contact Form Replacement
 * Replaces Framer form with custom HTML form connected to N8N
 * Maintains exact visual appearance from the original
 */

(function() {
    'use strict';

    const N8N_WEBHOOK_URL = 'https://n8n.lakestrom.com/webhook/contact-form';

    function init() {
        console.log('[Contact Form Replacement] Initializing...');

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', replaceForm);
        } else {
            // DOM is already ready
            setTimeout(replaceForm, 1000);
        }
    }

    function replaceForm() {
        // Find the form container with "Напишите нам"
        const formContainers = document.querySelectorAll('.framer-aemcht');

        formContainers.forEach(container => {
            // Check if this container has the "Напишите нам" heading
            const heading = container.querySelector('h5');
            if (heading && heading.textContent.includes('Напишите нам')) {
                console.log('[Contact Form Replacement] Found form to replace');
                createCustomForm(container);
            }
        });
    }

    function createCustomForm(container) {
        // Clear the existing form content but keep the container
        const existingForm = container.querySelector('form.framer-7wmuvs');
        if (!existingForm) return;

        // Get the parent that contains both heading and form
        const formParent = existingForm.parentElement;

        // Create new form with identical styling
        const newForm = document.createElement('form');
        newForm.className = 'framer-7wmuvs n8n-contact-form';
        newForm.innerHTML = `
            <!-- Name inputs row -->
            <div class="framer-1a6mif5" data-framer-name="Name inputs" style="display: flex; gap: 16px;">
                <label class="framer-4py5qc" style="flex: 1;">
                    <div class="framer-1abfow6" style="outline:none;display:flex;flex-direction:column;justify-content:flex-start;flex-shrink:0;transform:none">
                        <p class="framer-text framer-styles-preset-1dsqqmj" style="--framer-text-color:var(--token-8e9f7d65-9fbe-4bbc-aa91-54812dc50f56, rgb(38, 38, 40))">Имя</p>
                    </div>
                    <div class="framer-form-text-input framer-form-input-wrapper framer-v9uijd">
                        <input type="text" required name="firstName" placeholder="Иван" class="framer-form-input">
                    </div>
                </label>
                <label class="framer-155tre" style="flex: 1;">
                    <div class="framer-1uemrnm" style="outline:none;display:flex;flex-direction:column;justify-content:flex-start;flex-shrink:0;transform:none">
                        <p class="framer-text framer-styles-preset-1dsqqmj" style="--framer-text-color:var(--token-8e9f7d65-9fbe-4bbc-aa91-54812dc50f56, rgb(38, 38, 40))">Фамилия</p>
                    </div>
                    <div class="framer-form-text-input framer-form-input-wrapper framer-1lngoon">
                        <input type="text" required name="lastName" placeholder="Петров" class="framer-form-input">
                    </div>
                </label>
            </div>

            <!-- Email input -->
            <label class="framer-utuxtu">
                <div class="framer-11dr4cq" style="outline:none;display:flex;flex-direction:column;justify-content:flex-start;flex-shrink:0;transform:none">
                    <p class="framer-text framer-styles-preset-1dsqqmj" style="--framer-text-color:var(--token-8e9f7d65-9fbe-4bbc-aa91-54812dc50f56, rgb(38, 38, 40))">Email</p>
                </div>
                <div class="framer-form-text-input framer-form-input-wrapper framer-1pg7ujy">
                    <input type="email" required name="email" placeholder="petrov@yandex.ru" class="framer-form-input">
                </div>
            </label>

            <!-- City selector -->
            <label class="framer-1rp8iof">
                <div class="framer-1kuos8w" style="outline:none;display:flex;flex-direction:column;justify-content:flex-start;flex-shrink:0;transform:none">
                    <p class="framer-text framer-styles-preset-1dsqqmj" style="--framer-text-color:var(--token-8e9f7d65-9fbe-4bbc-aa91-54812dc50f56, rgb(38, 38, 40))">Ваш город</p>
                </div>
                <div class="framer-form-input-wrapper framer-form-select-wrapper framer-10f52m1">
                    <select name="city" required class="framer-form-input">
                        <option value="" disabled selected>Select…</option>
                        <option value="Москва">Москва</option>
                        <option value="Санкт-Петербург">Санкт-Петербург</option>
                        <option value="Новосибирск">Новосибирск</option>
                        <option value="Екатеринбург">Екатеринбург</option>
                        <option value="Казань">Казань</option>
                        <option value="Другой город">Другой город</option>
                    </select>
                </div>
            </label>

            <!-- Message textarea (NEW) -->
            <label class="framer-message-field" style="display: block; margin-top: 16px;">
                <div style="outline:none;display:flex;flex-direction:column;justify-content:flex-start;flex-shrink:0;transform:none">
                    <p class="framer-text framer-styles-preset-1dsqqmj" style="--framer-text-color:var(--token-8e9f7d65-9fbe-4bbc-aa91-54812dc50f56, rgb(38, 38, 40))">Сообщение</p>
                </div>
                <div class="framer-form-textarea-wrapper" style="position: relative;">
                    <textarea
                        name="message"
                        required
                        placeholder="Расскажите о вашем проекте..."
                        class="framer-form-input"
                        style="
                            width: 100%;
                            min-height: 120px;
                            padding: 12px 16px;
                            background: rgb(250, 250, 250);
                            border: 1px solid rgb(236, 237, 239);
                            border-radius: 12px;
                            font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            font-size: 16px;
                            line-height: 1.5;
                            color: rgb(38, 38, 40);
                            resize: vertical;
                            transition: all 0.2s ease;
                            outline: none;
                        "
                        onfocus="this.style.borderColor='rgb(29, 225, 137)'; this.style.boxShadow='0 0 0 2px rgba(29, 225, 137, 0.1)';"
                        onblur="this.style.borderColor='rgb(236, 237, 239)'; this.style.boxShadow='none';"
                    ></textarea>
                </div>
            </label>

            <!-- Honeypot field (hidden) -->
            <input type="text" name="website" style="position: absolute; left: -9999px;" tabindex="-1" autocomplete="off">

            <!-- Submit button -->
            <button
                type="submit"
                class="framer-submit-btn"
                style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 16px 24px;
                    margin-top: 24px;
                    background: rgb(29, 225, 137);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(29, 225, 137, 0.3)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
            >
                <span class="button-text">Отправить</span>
            </button>
        `;

        // Replace the old form with the new one
        existingForm.replaceWith(newForm);

        // Add event listener for form submission
        newForm.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('.framer-submit-btn');
        const btnText = submitBtn.querySelector('.button-text');
        const originalText = btnText.textContent;

        // Collect form data
        const formData = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            email: form.email.value.trim(),
            city: form.city.value,
            message: form.message.value.trim(),
            website: form.website.value, // honeypot
            referer: window.location.href,
            timestamp: new Date().toISOString()
        };

        // Check honeypot
        if (formData.website) {
            console.log('[Contact Form] Honeypot triggered, ignoring submission');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Отправка...';
        submitBtn.style.opacity = '0.7';

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                mode: 'cors'
            });

            if (response.ok) {
                // Success
                console.log('[Contact Form] Submission successful');
                btnText.textContent = '✓ Отправлено!';
                submitBtn.style.background = 'rgb(16, 185, 129)';

                // Clear form
                form.reset();

                // Track event if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'n8n_contact_form',
                        'event_label': 'contact_page'
                    });
                }

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    btnText.textContent = originalText;
                    submitBtn.style.opacity = '';
                    submitBtn.style.background = 'rgb(29, 225, 137)';
                }, 3000);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('[Contact Form] Submission error:', error);

            // Show error
            btnText.textContent = '✗ Ошибка';
            submitBtn.style.background = 'rgb(239, 68, 68)';

            // Reset button after delay
            setTimeout(() => {
                submitBtn.disabled = false;
                btnText.textContent = originalText;
                submitBtn.style.opacity = '';
                submitBtn.style.background = 'rgb(29, 225, 137)';
            }, 3000);
        }
    }

    // Add required CSS if not already present
    function addStyles() {
        if (document.getElementById('contact-form-styles')) return;

        const style = document.createElement('style');
        style.id = 'contact-form-styles';
        style.textContent = `
            .n8n-contact-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .n8n-contact-form label {
                display: block;
            }

            .n8n-contact-form .framer-form-input:focus {
                border-color: rgb(29, 225, 137);
                box-shadow: 0 0 0 2px rgba(29, 225, 137, 0.1);
                outline: none;
            }

            .n8n-contact-form .framer-form-input {
                width: 100%;
                padding: 12px 16px;
                background: rgb(250, 250, 250);
                border: 1px solid rgb(236, 237, 239);
                border-radius: 12px;
                font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 16px;
                color: rgb(38, 38, 40);
                transition: all 0.2s ease;
            }

            .n8n-contact-form select.framer-form-input {
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23575757' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 16px center;
                padding-right: 40px;
            }

            @media (max-width: 809px) {
                .n8n-contact-form .framer-1a6mif5 {
                    flex-direction: column !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    addStyles();
    init();

    // Expose for debugging
    window.ContactFormReplacement = {
        init,
        replaceForm,
        webhook: N8N_WEBHOOK_URL
    };
})();
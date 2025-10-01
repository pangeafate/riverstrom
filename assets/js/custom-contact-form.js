/**
 * Custom Contact Form - Replaces Framer form with custom design
 * Includes message field and sends to N8N
 * Works with both direct page loads and SPA navigation
 */

(function() {
    'use strict';

    const N8N_WEBHOOK_URL = 'https://n8n.lakestrom.com/webhook/contact-form';
    let isFormReplaced = false;
    let observer = null;
    let replacementTimer = null;

    function injectHidingCSS() {
        // Hide both contact form and bottom form until custom forms load
        const style = document.createElement('style');
        style.textContent = `
            /* Hide contact page form */
            .framer-aemcht[data-framer-name="Form"] {
                opacity: 0 !important;
                pointer-events: none !important;
            }
            .framer-aemcht[data-framer-name="Form"].form-visible {
                opacity: 1 !important;
                pointer-events: auto !important;
            }

            /* Hide bottom form on main page */
            form.framer-1oy82dr,
            form[class*="framer-"] {
                opacity: 0 !important;
                pointer-events: none !important;
            }
            form.framer-1oy82dr.form-visible,
            form[class*="framer-"].form-visible {
                opacity: 1 !important;
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);
        console.log('[Custom Form] Hiding CSS injected');
    }

    function init() {
        console.log('[Custom Form] Initializing with SPA navigation support...');

        // Inject CSS to hide forms before replacement
        injectHidingCSS();

        // Set up MutationObserver to watch for form container appearing
        setupMutationObserver();

        // Try immediate replacement in case we're already on contact page
        checkAndReplaceForm();

        // Listen for URL changes (SPA navigation)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                console.log('[Custom Form] URL changed, checking for contact page...');
                lastUrl = currentUrl;
                isFormReplaced = false;

                // Clear any pending replacement
                if (replacementTimer) {
                    clearTimeout(replacementTimer);
                }

                // Check if we're on contact page after navigation
                checkAndReplaceForm();
            }
        }).observe(document.querySelector('body'), { subtree: true, childList: true });
    }

    function setupMutationObserver() {
        // Watch for the form container being added to DOM
        observer = new MutationObserver((mutations) => {
            if (isFormReplaced) return;

            const formContainer = document.querySelector('.framer-aemcht[data-framer-name="Form"]');
            if (formContainer && !isFormReplaced) {
                console.log('[Custom Form] Form container detected via observer');
                checkAndReplaceForm();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function checkAndReplaceForm() {
        // Check which page we're on
        const isContactPage = window.location.pathname.includes('/contact');
        const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';

        if (isContactPage) {
            console.log('[Custom Form] On contact page, replacing full contact form...');
            replacementTimer = setTimeout(() => {
                replaceFramerForm();
            }, 1500);
        } else if (isHomePage) {
            console.log('[Custom Form] On home page, replacing bottom form...');
            replacementTimer = setTimeout(() => {
                replaceBottomForm();
            }, 1500);
        } else {
            console.log('[Custom Form] Not on contact or home page, skipping');
        }
    }

    function replaceFramerForm() {
        if (isFormReplaced) {
            console.log('[Custom Form] Form already replaced, skipping');
            return;
        }

        // Find the Framer form container
        const formContainer = document.querySelector('.framer-aemcht[data-framer-name="Form"]');

        if (!formContainer) {
            console.log('[Custom Form] Form container not found, retrying...');
            setTimeout(replaceFramerForm, 100);
            return;
        }

        console.log('[Custom Form] Replacing Framer form with custom form...');

        // Create custom form HTML
        const customFormHTML = `
            <div class="custom-contact-form-container" style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            ">
                <div class="form-heading" style="margin-bottom: 24px;">
                    <h5 style="
                        font-family: Inter, sans-serif;
                        font-size: 20px;
                        font-weight: 600;
                        margin: 0 0 8px 0;
                        color: rgb(38, 38, 40);
                    "><strong>Напишите нам</strong></h5>
                    <p style="
                        font-family: Inter, sans-serif;
                        font-size: 14px;
                        margin: 0;
                        color: rgb(87, 87, 87);
                    ">Будем рады общению с вами!</p>
                </div>

                <form id="custom-contact-form" style="display: flex; flex-direction: column; gap: 20px;">
                    <!-- Name fields row -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-field">
                            <label style="
                                display: block;
                                font-family: Inter, sans-serif;
                                font-size: 14px;
                                font-weight: 500;
                                margin-bottom: 8px;
                                color: rgb(38, 38, 40);
                            ">Имя</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Иван"
                                required
                                style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    font-family: Inter, sans-serif;
                                    font-size: 14px;
                                    border: 1px solid rgb(195, 196, 197);
                                    border-radius: 8px;
                                    outline: none;
                                    transition: border-color 0.2s;
                                    box-sizing: border-box;
                                "
                                onfocus="this.style.borderColor='rgb(29, 225, 137)'"
                                onblur="this.style.borderColor='rgb(195, 196, 197)'"
                            />
                        </div>

                        <div class="form-field">
                            <label style="
                                display: block;
                                font-family: Inter, sans-serif;
                                font-size: 14px;
                                font-weight: 500;
                                margin-bottom: 8px;
                                color: rgb(38, 38, 40);
                            ">Фамилия</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Петров"
                                required
                                style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    font-family: Inter, sans-serif;
                                    font-size: 14px;
                                    border: 1px solid rgb(195, 196, 197);
                                    border-radius: 8px;
                                    outline: none;
                                    transition: border-color 0.2s;
                                    box-sizing: border-box;
                                "
                                onfocus="this.style.borderColor='rgb(29, 225, 137)'"
                                onblur="this.style.borderColor='rgb(195, 196, 197)'"
                            />
                        </div>
                    </div>

                    <!-- Email field -->
                    <div class="form-field">
                        <label style="
                            display: block;
                            font-family: Inter, sans-serif;
                            font-size: 14px;
                            font-weight: 500;
                            margin-bottom: 8px;
                            color: rgb(38, 38, 40);
                        ">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="petrov@yandex.ru"
                            required
                            style="
                                width: 100%;
                                padding: 12px 16px;
                                font-family: Inter, sans-serif;
                                font-size: 14px;
                                border: 1px solid rgb(195, 196, 197);
                                border-radius: 8px;
                                outline: none;
                                transition: border-color 0.2s;
                                box-sizing: border-box;
                            "
                            onfocus="this.style.borderColor='rgb(29, 225, 137)'"
                            onblur="this.style.borderColor='rgb(195, 196, 197)'"
                        />
                    </div>

                    <!-- City field -->
                    <div class="form-field">
                        <label style="
                            display: block;
                            font-family: Inter, sans-serif;
                            font-size: 14px;
                            font-weight: 500;
                            margin-bottom: 8px;
                            color: rgb(38, 38, 40);
                        ">Ваш город</label>
                        <select
                            name="city"
                            required
                            style="
                                width: 100%;
                                padding: 12px 16px;
                                font-family: Inter, sans-serif;
                                font-size: 14px;
                                border: 1px solid rgb(195, 196, 197);
                                border-radius: 8px;
                                outline: none;
                                transition: border-color 0.2s;
                                background: white;
                                cursor: pointer;
                                box-sizing: border-box;
                            "
                            onfocus="this.style.borderColor='rgb(29, 225, 137)'"
                            onblur="this.style.borderColor='rgb(195, 196, 197)'"
                        >
                            <option value="" disabled selected>Select...</option>
                            <option value="Москва">Москва</option>
                            <option value="Санкт-Петербург">Санкт-Петербург</option>
                            <option value="Новосибирск">Новосибирск</option>
                            <option value="Екатеринбург">Екатеринбург</option>
                            <option value="Казань">Казань</option>
                            <option value="Другой город">Другой город</option>
                        </select>
                    </div>

                    <!-- Message field -->
                    <div class="form-field">
                        <label style="
                            display: block;
                            font-family: Inter, sans-serif;
                            font-size: 14px;
                            font-weight: 500;
                            margin-bottom: 8px;
                            color: rgb(38, 38, 40);
                        ">Сообщение</label>
                        <textarea
                            name="message"
                            placeholder="Расскажите о вашей задаче"
                            required
                            rows="4"
                            style="
                                width: 100%;
                                padding: 12px 16px;
                                font-family: Inter, sans-serif;
                                font-size: 14px;
                                border: 1px solid rgb(195, 196, 197);
                                border-radius: 8px;
                                outline: none;
                                transition: border-color 0.2s;
                                resize: vertical;
                                min-height: 100px;
                                box-sizing: border-box;
                            "
                            onfocus="this.style.borderColor='rgb(29, 225, 137)'"
                            onblur="this.style.borderColor='rgb(195, 196, 197)'"
                        ></textarea>
                    </div>

                    <!-- Promo code field -->
                    <div class="form-field">
                        <label style="
                            display: block;
                            font-family: Inter, sans-serif;
                            font-size: 14px;
                            font-weight: 500;
                            margin-bottom: 8px;
                            color: rgb(38, 38, 40);
                        ">Промокод</label>
                        <input
                            type="text"
                            name="promoCode"
                            placeholder=""
                            style="
                                width: 100%;
                                padding: 12px 16px;
                                font-family: Inter, sans-serif;
                                font-size: 14px;
                                border: 1px solid rgb(195, 196, 197);
                                border-radius: 8px;
                                outline: none;
                                transition: border-color 0.2s;
                                box-sizing: border-box;
                            "
                            onfocus="this.style.borderColor='rgb(29, 225, 137)'"
                            onblur="this.style.borderColor='rgb(195, 196, 197)'"
                        />
                    </div>

                    <!-- Submit button -->
                    <button
                        type="submit"
                        style="
                            width: 100%;
                            padding: 14px 24px;
                            font-family: Inter, sans-serif;
                            font-size: 16px;
                            font-weight: 600;
                            color: white;
                            background: rgb(38, 38, 40);
                            border: none;
                            border-radius: 12px;
                            cursor: pointer;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)';"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                    >
                        Отправить
                    </button>
                </form>
            </div>
        `;

        // Replace the form
        formContainer.innerHTML = customFormHTML;

        // Add a class to override the !important hiding CSS
        formContainer.classList.add('form-visible');

        // Start with opacity 0 for smooth fade-in
        setTimeout(() => {
            formContainer.style.transition = 'opacity 0.3s ease';
            formContainer.style.opacity = '1';
        }, 50);

        // Mark as replaced to prevent duplicate replacements
        isFormReplaced = true;

        // Attach form submission handler
        const form = document.getElementById('custom-contact-form');
        if (form) {
            form.addEventListener('submit', handleSubmit);
            console.log('[Custom Form] Form replaced and handler attached');
        }
    }

    function replaceBottomForm() {
        if (isFormReplaced) {
            console.log('[Custom Form] Bottom form already replaced, skipping');
            return;
        }

        // Find the bottom Framer form (different class than contact form)
        const formContainer = document.querySelector('form.framer-1oy82dr') || document.querySelector('form[class*="framer-"]');

        if (!formContainer) {
            console.log('[Custom Form] Bottom form container not found, retrying...');
            setTimeout(replaceBottomForm, 100);
            return;
        }

        console.log('[Custom Form] Replacing bottom form...');

        // Create custom form HTML matching Framer design exactly
        const customFormHTML = `
            <div class="custom-bottom-form-container" style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                width: 100%;
                max-width: 964px;
            ">
                <!-- Name field - left column with label -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="
                        font-family: Inter, sans-serif;
                        font-size: 14px;
                        color: rgb(153, 153, 153);
                        font-weight: 400;
                    ">Имя</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Иван Петров"
                        required
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            font-family: Inter, sans-serif;
                            font-size: 16px;
                            background: rgb(236, 237, 239);
                            border: none;
                            border-radius: 12px;
                            outline: none;
                            box-sizing: border-box;
                        "
                    />
                </div>

                <!-- Email field - right column with label -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="
                        font-family: Inter, sans-serif;
                        font-size: 14px;
                        color: rgb(153, 153, 153);
                        font-weight: 400;
                    ">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="petrov@yandex.ru"
                        required
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            font-family: Inter, sans-serif;
                            font-size: 16px;
                            background: rgb(236, 237, 239);
                            border: none;
                            border-radius: 12px;
                            outline: none;
                            box-sizing: border-box;
                        "
                    />
                </div>

                <!-- Message field spanning 2 columns with label -->
                <div style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="
                        font-family: Inter, sans-serif;
                        font-size: 14px;
                        color: rgb(153, 153, 153);
                        font-weight: 400;
                    ">Сообщение</label>
                    <textarea
                        name="message"
                        placeholder="Ваше сообщение"
                        required
                        rows="4"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            font-family: Inter, sans-serif;
                            font-size: 16px;
                            background: rgb(236, 237, 239);
                            border: none;
                            border-radius: 12px;
                            outline: none;
                            resize: vertical;
                            min-height: 140px;
                            box-sizing: border-box;
                        "
                    ></textarea>
                </div>

                <!-- Promo code field spanning 2 columns with label -->
                <div style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 8px;">
                    <label style="
                        font-family: Inter, sans-serif;
                        font-size: 14px;
                        color: rgb(153, 153, 153);
                        font-weight: 400;
                    ">Промокод</label>
                    <input
                        type="text"
                        name="promoCode"
                        placeholder=""
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            font-family: Inter, sans-serif;
                            font-size: 16px;
                            background: rgb(236, 237, 239);
                            border: none;
                            border-radius: 12px;
                            outline: none;
                            box-sizing: border-box;
                        "
                    />
                </div>

                <!-- Submit button spanning 2 columns -->
                <button
                    type="submit"
                    style="
                        grid-column: 1 / -1;
                        width: 100%;
                        padding: 18px 24px;
                        font-family: Inter, sans-serif;
                        font-size: 16px;
                        font-weight: 600;
                        color: white;
                        background: rgb(38, 38, 40);
                        border: none;
                        border-radius: 12px;
                        cursor: pointer;
                        transition: all 0.2s;
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)';"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                >
                    Отправить
                </button>
            </div>
        `;

        // Replace the form content
        formContainer.innerHTML = customFormHTML;

        // Add class to show form (override hiding CSS)
        formContainer.classList.add('form-visible');

        // Start with opacity 0 for smooth fade-in
        setTimeout(() => {
            formContainer.style.transition = 'opacity 0.3s ease';
            formContainer.style.opacity = '1';
        }, 50);

        // Mark as replaced
        isFormReplaced = true;

        // Attach form submission handler
        formContainer.addEventListener('submit', handleSubmit);
        console.log('[Custom Form] Bottom form replaced and handler attached');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Collect form data - handle both contact form and bottom form
        const formData = {
            referer: window.location.href,
            timestamp: new Date().toISOString()
        };

        // Try to get fields that might exist
        if (form.firstName) formData.firstName = form.firstName.value.trim();
        if (form.lastName) formData.lastName = form.lastName.value.trim();
        if (form.name) formData.name = form.name.value.trim();
        if (form.email) formData.email = form.email.value.trim();
        if (form.city) formData.city = form.city.value;
        if (form.message) formData.message = form.message.value.trim();
        if (form.promoCode && form.promoCode.value.trim()) formData.promoCode = form.promoCode.value.trim();

        console.log('[Custom Form] Submitting:', formData);

        // Update button state
        submitButton.textContent = 'Отправка...';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';

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
                console.log('[Custom Form] Success!');

                // Success state
                submitButton.textContent = '✓ Отправлено!';
                submitButton.style.background = 'rgb(16, 185, 129)';
                submitButton.style.opacity = '1';

                // Clear form
                form.reset();

                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'custom_contact_form',
                        'event_label': 'contact_page'
                    });
                }

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = 'rgb(38, 38, 40)';
                    submitButton.disabled = false;
                }, 3000);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('[Custom Form] Error:', error);

            // Error state
            submitButton.textContent = '✗ Ошибка';
            submitButton.style.background = 'rgb(239, 68, 68)';
            submitButton.style.opacity = '1';

            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = 'rgb(38, 38, 40)';
                submitButton.style.opacity = '';
                submitButton.disabled = false;
            }, 3000);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

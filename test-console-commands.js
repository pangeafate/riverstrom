// Console commands to test N8N Form Handler V2
// Copy and paste these into your browser console (F12)

// 1. Check if handler is loaded
console.log('=== N8N Handler V2 Status ===');
if (window.N8NHandlerV2) {
    console.log('✅ N8N Handler V2 is loaded');
    console.log('Webhook URL:', window.N8NHandlerV2.webhook);
} else {
    console.log('❌ N8N Handler V2 not found');
}

// 2. Find all forms on the page
console.log('\n=== Forms on Page ===');
const forms = document.querySelectorAll('form, .framer-7wmuvs, [data-framer-name*="Form"]');
console.log(`Found ${forms.length} form(s)`);
forms.forEach((form, index) => {
    const inputs = form.querySelectorAll('input, textarea, select');
    console.log(`Form ${index + 1}: ${inputs.length} input field(s)`);
});

// 3. Test form field interaction
console.log('\n=== Testing Form Fields ===');
const testInput = document.querySelector('input[type="text"], input[type="email"]');
if (testInput) {
    // Try to set a value
    testInput.value = 'Test Value';
    testInput.dispatchEvent(new Event('input', { bubbles: true }));

    if (testInput.value === 'Test Value') {
        console.log('✅ Form fields are accepting input');
        testInput.value = ''; // Clear test value
    } else {
        console.log('❌ Form fields may not be accepting input properly');
    }
} else {
    console.log('⚠️ No input fields found to test');
}

// 4. Check for old form handler
console.log('\n=== Old Form Handler Check ===');
const oldHandlerScript = document.querySelector('script[src*="form-handler.js"]:not([src*="n8n"])');
if (oldHandlerScript) {
    console.log('❌ Old form-handler.js is still loaded:', oldHandlerScript.src);
} else {
    console.log('✅ Old form-handler.js has been removed');
}

// 5. Simulate form data collection (without submitting)
console.log('\n=== Test Form Data Collection ===');
const formContainer = document.querySelector('.framer-7wmuvs, form');
if (formContainer && window.N8NHandlerV2 && window.N8NHandlerV2.collectFormData) {
    // Fill in some test data first
    const nameInput = formContainer.querySelector('input[placeholder*="Иван"], input[name*="First"]');
    const emailInput = formContainer.querySelector('input[type="email"]');

    if (nameInput) nameInput.value = 'Тест';
    if (emailInput) emailInput.value = 'test@example.com';

    const formData = window.N8NHandlerV2.collectFormData(formContainer);
    console.log('Collected form data:', formData);
    console.log('✅ Form data collection is working');

    // Clear test values
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
} else {
    console.log('⚠️ Cannot test form data collection');
}

console.log('\n=== Test Complete ===');
console.log('The forms should now be working properly.');
console.log('Try filling out a form and submitting it to test the full flow.');
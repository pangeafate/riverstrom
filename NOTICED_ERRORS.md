# Noticed Errors

## E001: Contact Form Message Field Not Visible

**First Noticed:** 2025-10-01

**Description:**
The message textarea field in the contact form at `/contact/` is not visible to users. The field exists in the Framer-generated HTML but is not displayed on the page.

**User Impact:**
Users cannot enter a message when trying to contact the company, making the contact form incomplete and unusable.

**Environment:**
- Page: http://localhost:8888/contact/
- Form: Framer contact form with class `framer-7wmuvs`
- Script: n8n-form-handler-v3.js

**Noticed Again:**
- 2025-10-01 - Initial report
- 2025-10-01 - Form not rendering at all (E002)

**Root Cause:**
The message field (`<textarea name="message">`) existed in the static HTML but was being removed by Framer's React hydration process during page load. Framer was re-rendering the form without the message field, indicating it was likely removed from the original Framer design but remnants remained in the exported HTML.

**Resolution:**
Completely replaced the Framer form with a custom HTML/JavaScript solution:

1. **Created** `assets/js/custom-contact-form.js` - A custom form that:
   - Waits for Framer to load
   - Completely replaces the Framer form DOM
   - Includes all fields with proper styling (matching target design)
   - Adds the missing message textarea field
   - Sends form data to N8N webhook
   - Handles loading/success/error states

2. **Fixed flash of old form (2025-10-01)**:
   - **Root Cause**: CSS hiding was in `<body>` (loaded after render), Framer styles were in `<head>` (loaded first)
   - **Solution**: Moved hiding CSS `.framer-aemcht[data-framer-name="Form"]{opacity:0!important;}` inside Framer's HEAD style tag (line 31)
   - **Result**: Form is now hidden BEFORE first paint, eliminating visible flash

3. **Updated** `contact/index.html`:
   - Removed old CSS/JS fixes that didn't work
   - Added critical CSS hiding inside HEAD style tag for immediate application
   - Loads custom form script without defer for faster execution

The custom form provides a seamless user experience with all fields visible and functional, including the previously missing message textarea. No visible form replacement occurs.

---

## E002: Contact Form Not Rendering At All

**First Noticed:** 2025-10-01

**Description:**
The contact form was completely invisible on the contact page. Only the contact information (email, phone numbers, telegram) was visible, but the form itself did not render at all.

**User Impact:**
Complete inability to submit contact forms. The page appeared incomplete with no way to send messages to the company.

**Environment:**
- Page: http://localhost:8888/contact/
- Related files: contact/index.html, assets/js/custom-contact-form.js

**Root Cause Analysis:**

The form was failing to render due to TWO compounding issues:

1. **Incorrect Script Path (Primary):**
   - The custom form script was referenced as `../assets/js/custom-contact-form.js` (relative path)
   - Due to the `<base href="/">` tag in the HTML head, all relative paths resolve from the root
   - The browser was attempting to load from the wrong path, causing a 404 error
   - The script never executed, so the form replacement never happened

2. **Overly Aggressive Hiding CSS (Secondary):**
   - The Framer form container had `opacity: 0 !important` CSS in the HEAD
   - This CSS was added to prevent the "flash" of the old form before replacement
   - However, with the script failing to load (issue #1), the form remained hidden permanently
   - Even after fixing the script path, the form was invisible due to this CSS

**Resolution:**

1. **Fixed Script Path:**
   - Changed from `../assets/js/custom-contact-form.js` to `/assets/js/custom-contact-form.js` (absolute path)
   - This ensures correct loading regardless of the base href tag
   - contact/index.html:101

2. **Added Proper CSS Hiding with Override:**
   - Added `.framer-aemcht[data-framer-name="Form"]{opacity:0!important;pointer-events:none!important}` to HEAD
   - This hides the Framer form immediately on page load (prevents flash)
   - Added override class `.framer-aemcht[data-framer-name="Form"].form-visible{opacity:1!important;pointer-events:auto!important}`
   - JavaScript adds `form-visible` class after replacement to show the custom form
   - Result: No flash of old form, smooth fade-in of new form

**Testing:**
- Playwright visual tests confirm form renders correctly with all 6 fields visible
- Form loads within 2 seconds and smoothly fades in
- All fields functional: firstName, lastName, email, city dropdown, message textarea, submit button
- Screenshots: tests/screenshots/06-after-replacement.png

**Key Learnings:**
- When using `<base href="/">`, always use absolute paths (starting with `/`) for scripts and assets
- To override `!important` CSS with JavaScript, use a class with equal specificity and `!important`
- Visual testing with screenshots is essential for UI issues - the form appeared broken visually but tests showed elements existed in DOM
- CSS hiding strategy: Hide with `!important` in HEAD, then add override class via JS after replacement

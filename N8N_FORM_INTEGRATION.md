# N8N Form Integration - Riverstrom AI

## Overview
This document describes the implementation of HTML forms that replace Framer's virtual forms and integrate with N8N webhook for form processing.

## Problem Statement
- Framer uses React-based virtual DOM forms (not real HTML `<form>` elements)
- Existing form-handler.js couldn't intercept Framer forms
- Need to maintain identical visual appearance while switching to N8N backend

## Solution Architecture

### 1. Form Handler Script
**File:** `assets/js/n8n-form-handler.js`

**Features:**
- Detects and replaces Framer form containers
- Creates HTML forms with identical Framer styling
- Handles form submission to N8N webhook
- Includes honeypot spam protection
- Shows loading states and success/error messages
- Watches for dynamic content changes

### 2. N8N Webhook Configuration
**URL:** `https://n8n.lakestrom.com/webhook/contact-form`
**Method:** POST
**Content-Type:** application/json

**Expected Fields:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required)",
  "company": "string (optional)",
  "city": "string (required)",
  "message": "string (required)",
  "website": "string (honeypot - should be empty)",
  "referer": "string (auto-added)"
}
```

## Implementation Details

### Form Detection
The script looks for these selectors:
- `[data-framer-name="Form"]`
- `[data-framer-name="ContactForm"]`
- `.framer-7wmuvs`
- `.framer-1oy82dr`
- Elements with ID containing "contactform"
- Containers with input and textarea elements

### Visual Styling
Exact match of Framer's design:
- Font: Inter
- Input background: rgb(250, 250, 250)
- Border: 1px solid rgb(236, 237, 239)
- Border radius: 12px
- Focus color: rgb(29, 225, 137)
- Button gradient: rgb(29, 225, 137) to rgb(26, 200, 122)

### Spam Protection
Honeypot field:
- Field name: `website`
- Hidden from view with CSS
- If filled, form submission is ignored

## Installation

### 1. Add Script to HTML Pages

**For root pages:**
```html
<script defer src="assets/js/n8n-form-handler.js"></script>
```

**For subdirectory pages:**
```html
<script defer src="../assets/js/n8n-form-handler.js"></script>
```

### 2. Files Updated
- `/index.html` - Main page
- `/contact/index.html` - Contact page
- Additional pages can be updated as needed

## Testing

### Test Page
Access `/test-n8n-form.html` to test the form integration.

### Test Steps:
1. Open the test page in a browser
2. Fill in the form fields:
   - Имя (First Name)
   - Фамилия (Last Name)
   - Email
   - Компания (Company) - optional
   - Город (City)
   - Сообщение (Message)
3. Click "Отправить" (Submit)
4. Verify:
   - Loading spinner appears
   - Success message displays
   - Form clears after successful submission
   - Telegram notification received

### CORS Configuration
Ensure N8N webhook allows requests from:
- `https://riverstrom.ai`
- `http://localhost` (for testing)

## N8N Workflow Issues Found

### Current Issues in workflow.json:
1. Hardcoded redirect URLs pointing to GitHub Pages instead of riverstrom.ai
2. Missing CORS headers configuration
3. Field validation might reject legitimate submissions

### Recommended N8N Fixes:
1. Update redirect URL logic to use actual domain
2. Add CORS headers to webhook response:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type
   ```
3. Make `website` field validation check for empty string only

## Monitoring & Debugging

### Browser Console
The script logs:
- Number of forms replaced
- Submission attempts
- Errors during submission

### Success Indicators:
- Form shows green success message
- Form fields clear
- No console errors

### Failure Indicators:
- Red error message displays
- Console shows network error
- Form retains entered data

## Rollback Plan

To disable N8N integration and revert to Framer:
1. Remove script tags from HTML files
2. Delete `/assets/js/n8n-form-handler.js`
3. Framer forms will automatically take over

## Future Improvements

1. **Enhanced Validation:** Add client-side email/phone validation
2. **Retry Logic:** Implement automatic retry on network failures
3. **Analytics:** Track form submissions in Google Analytics
4. **A/B Testing:** Compare conversion rates between Framer and N8N forms
5. **Multi-language:** Support for English form labels
6. **File Uploads:** Add support for attachments

## Support

For issues or questions:
- Check browser console for errors
- Verify N8N webhook is accessible
- Ensure CORS is properly configured
- Test with the dedicated test page first
# N8N Workflow Testing Instructions

## Overview
This guide helps you test the form integration between your localhost website and the N8N cloud workflow.

## Modified Workflow Features

### 1. **CORS Support Added**
- Allows requests from any origin (`*`)
- Supports localhost testing
- Proper headers for cross-origin requests

### 2. **JSON Responses**
- Changed from HTML redirect to JSON responses
- Better for testing and debugging
- Works with the N8N Handler V2 script

### 3. **Environment Detection**
- Automatically detects if submission is from localhost
- Adds "LOCALHOST TEST" label in Telegram notifications
- Includes timestamp for tracking

### 4. **Enhanced Error Handling**
- Clear error messages in JSON format
- Proper HTTP status codes
- CORS headers on both success and error responses

## Setup Instructions

### Step 1: Import the Workflow in N8N

1. Open your N8N instance at https://n8n.lakestrom.com
2. Go to Workflows → Import
3. Import the file: `riverstrom-ai-form-workflow-localhost.json`
4. **Important**: After importing, you need to:
   - Click on the Telegram node
   - Re-select or confirm the credentials
   - Save the workflow

### Step 2: Activate the Workflow

1. Toggle the workflow to "Active" status
2. Copy the webhook URL (should be: `https://n8n.lakestrom.com/webhook/contact-form`)

### Step 3: Test from Localhost

1. Make sure your local server is running:
   ```bash
   cd /Users/sergeypodolskiy/CODEBASE/25\ 07\ 29\ Riverstrom
   python3 -m http.server 8888
   ```

2. Open http://localhost:8888 in your browser

3. Fill out the form with test data:
   - **Имя**: Тест
   - **Фамилия**: Локалхост
   - **Email**: test@localhost.com
   - **Город**: Москва (or select from dropdown)
   - **Сообщение**: Тестовое сообщение с localhost

4. Click "Отправить"

### Step 4: Verify the Results

#### In the Browser:
- You should see "✓ Отправлено!" message
- Check browser console (F12) for the response:
  ```javascript
  // You should see something like:
  {
    success: true,
    message: "Спасибо! Мы получили вашу заявку и скоро свяжемся с вами.",
    timestamp: "2024-XX-XX...",
    environment: "localhost-test"
  }
  ```

#### In Telegram:
You should receive a message like:
```
🔔 Новая заявка с сайта (LOCALHOST TEST):

👤 Имя: Тест Локалхост
📧 Email: test@localhost.com
📍 Город: Москва

💬 Сообщение:
Тестовое сообщение с localhost

📄 Страница: http://localhost:8888/
🌐 IP: localhost
⚙️ Среда: localhost-test
🕐 Время: 2024-XX-XX...
```

#### In N8N:
1. Go to the workflow in N8N
2. Click on "Executions" tab
3. You should see successful executions
4. Click on an execution to see the data flow

## Troubleshooting

### If form doesn't submit:

1. **Check N8N Handler is loaded:**
   ```javascript
   console.log('Handler loaded?', !!window.N8NHandlerV2);
   ```

2. **Check for CORS errors in console:**
   - If you see CORS errors, make sure the workflow is active
   - Verify the webhook URL is correct

3. **Test webhook directly:**
   ```bash
   curl -X POST https://n8n.lakestrom.com/webhook/contact-form \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "Direct",
       "email": "test@direct.com",
       "city": "Moscow",
       "message": "Direct webhook test"
     }'
   ```

### If Telegram doesn't receive messages:

1. Check the Telegram bot credentials in N8N
2. Verify the chat ID is correct (-4807946331)
3. Check N8N execution logs for errors

### Common Issues:

- **"Failed to fetch"**: Check if N8N workflow is active
- **400 Bad Request**: Check that all required fields are filled
- **No response**: Verify the webhook URL in the script matches N8N

## Testing Checklist

- [ ] Local server running on port 8888
- [ ] N8N workflow imported and activated
- [ ] Form accepts input in all fields
- [ ] Submit button shows loading state
- [ ] Success message appears after submission
- [ ] Form clears after successful submission
- [ ] Telegram notification received
- [ ] N8N execution shows success

## Production Deployment

When ready for production:

1. Remove the test indicators from the workflow
2. Update CORS settings to only allow `https://riverstrom.ai`
3. Remove localhost detection code
4. Test thoroughly on the production domain

## Notes

- The honeypot field (`website`) should remain empty for legitimate submissions
- All timestamps are in ISO 8601 format
- The workflow validates email format and required fields
- Test submissions from localhost are clearly marked to avoid confusion
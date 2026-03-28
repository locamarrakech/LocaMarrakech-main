# Vercel Deployment Guide

This guide explains how to deploy the LocaMarrakech project to Vercel and ensure all functionality works correctly.

## Deployment Steps

1. **Set up Environment Variables in Vercel**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add the following variables:
     - `EMAIL_USER` - Your Gmail address
     - `EMAIL_PASS` - Your Gmail App Password
     - `WHATSAPP_NUMBER` - WhatsApp number for notifications

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Or use the Vercel CLI: `vercel --prod`

## Important Notes

### API Routes
- Vercel requires API routes to be in the `/api` directory
- The project includes Vercel-compatible API handlers in the `api/` directory
- These handlers import and wrap the original API logic from `pages/api/`

### WhatsApp Integration
- WhatsApp functionality requires a persistent session
- On Vercel, you may need to re-authenticate WhatsApp after each deployment
- The QR code will be displayed in the Vercel function logs

### Email Configuration
- Ensure you're using a Gmail App Password, not your regular password
- The email service must be configured with valid credentials in Vercel environment variables

## Troubleshooting

### API 404 Errors
If you're getting 404 errors for API routes:
1. Verify the `vercel.json` file is in your project root
2. Check that environment variables are properly set
3. Ensure the API files in the `api/` directory are deployed

### Email Not Sending
If emails aren't being sent:
1. Check Vercel function logs for authentication errors
2. Verify `EMAIL_USER` and `EMAIL_PASS` environment variables
3. Ensure you're using a Gmail App Password

### WhatsApp Issues
If WhatsApp messages aren't sending:
1. Check Vercel function logs for WhatsApp errors
2. You may need to re-authenticate WhatsApp after deployment
3. Ensure `WHATSAPP_NUMBER` is set correctly
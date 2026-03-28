# Gmail Setup for LocaMarrakech

To enable email functionality for booking confirmations and contact form submissions, you need to configure Gmail with an App Password.

## Steps to Set Up Gmail

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate an App Password**
   - In your Google Account, go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Google will generate a 16-character password

3. **Configure Environment Variables**
   - Open the `.env.local` file in your project root
   - Replace the placeholder values:
     ```
     EMAIL_USER=your-actual-gmail-address@gmail.com
     EMAIL_PASS=your-16-character-app-password
     ```

4. **Restart the Development Server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` to restart

## Testing Email Functionality

After configuration:
1. Try submitting a booking request from a car details page
2. Check your Gmail inbox for the confirmation email
3. Test the contact form as well

## Troubleshooting

If emails are not being sent:
- Verify your Gmail address and App Password are correct
- Ensure 2-Factor Authentication is enabled
- Check that your App Password has not expired
- Look at the server console for detailed error messages

## Security Notes

- Never commit your `.env.local` file to version control
- App Passwords are specific to the application and can be revoked at any time
- Use a dedicated Gmail account for production applications
// pages/api/contact.ts

import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local or .env
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

type ContactData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const body: ContactData = req.body;
  console.log('Received contact form:', body);

  // Validate required fields
  if (!body.name || !body.email || !body.phone || !body.message) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  // Check if email credentials are configured
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error('Email credentials not configured properly');
    return res.status(500).json({ 
      success: false, 
      message: 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS environment variables in .env.local file with your Gmail address and App Password.' 
    });
  }

  // Warn if using default placeholder values
  if (emailUser === 'locamarrakech.com@gmail.com' || emailPass === 'oyee ciop hzbb pzeu') {
    console.warn('Warning: Using default placeholder email credentials. Please update .env.local with your actual Gmail credentials.');
  }

  // Create transporter with your email credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transporter.sendMail({
      from: body.email,
      to: process.env.EMAIL_USER || 'locamarrakech.com@gmail.com',
      subject: `Nouveau message de contact - ${body.name}`,
      text: `Nouveau message de contact reçu:

Nom: ${body.name}
Email: ${body.email}
Téléphone: ${body.phone}

Message:
${body.message}

---
Ce message a été envoyé depuis le formulaire de contact de LocaMarrakech.`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau message de contact</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #DAB875 0%, #C09A55 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                Nouveau Message de Contact
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 30px 0; color: #1a1a1a; font-size: 16px; line-height: 1.6;">
                Vous avez reçu un nouveau message depuis le formulaire de contact de votre site web.
              </p>

              <!-- Contact Details -->
              <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Informations du Contact
                </h2>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(26,26,26,0.1);">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; width: 30%;">Nom:</td>
                          <td style="color: #1a1a1a; font-size: 14px; text-align: right;">${body.name}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(26,26,26,0.1);">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; width: 30%;">Email:</td>
                          <td style="text-align: right;">
                            <a href="mailto:${body.email}" style="color: #1a1a1a; font-size: 14px; text-decoration: none;">${body.email}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; width: 30%;">Téléphone:</td>
                          <td style="text-align: right;">
                            <a href="tel:${body.phone}" style="color: #1a1a1a; font-size: 14px; text-decoration: none;">${body.phone}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Message -->
              <div style="background: linear-gradient(135deg, #DAB875 0%, #C09A55 100%); padding: 25px; border-radius: 8px;">
                <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Message
                </h2>
                <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${body.message.replace(/\n/g, '<br>')}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 12px;">
                Ce message a été envoyé depuis le formulaire de contact de LocaMarrakech
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    console.log('Contact email sent successfully');
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('Error sending contact email:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send message. Please try again later.' 
    });
  }
}


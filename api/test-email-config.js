import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

export default async function handler(req, res) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Check for common issues
  const issues = [];
  const info = {};

  if (!emailUser) {
    issues.push('EMAIL_USER is not set');
  } else {
    info.emailUser = {
      set: true,
      length: emailUser.length,
      hasQuotes: emailUser.startsWith('"') || emailUser.startsWith("'"),
      hasSpaces: emailUser.includes(' '),
      preview: emailUser.substring(0, 5) + '...',
      isGmail: emailUser.includes('@gmail.com') || emailUser.includes('@googlemail.com'),
    };
    
    if (emailUser.startsWith('"') || emailUser.startsWith("'")) {
      issues.push('EMAIL_USER has quotes - remove quotes from .env file');
    }
    if (emailUser.includes(' ')) {
      issues.push('EMAIL_USER has spaces - remove any spaces');
    }
    if (!emailUser.includes('@gmail.com') && !emailUser.includes('@googlemail.com')) {
      issues.push('EMAIL_USER does not appear to be a Gmail address');
    }
  }

  if (!emailPass) {
    issues.push('EMAIL_PASS is not set');
  } else {
    info.emailPass = {
      set: true,
      length: emailPass.length,
      hasQuotes: emailPass.startsWith('"') || emailPass.startsWith("'"),
      hasSpaces: emailPass.includes(' '),
      preview: '****' + emailPass.substring(emailPass.length - 4),
      correctLength: emailPass.length === 16,
    };
    
    if (emailPass.startsWith('"') || emailPass.startsWith("'")) {
      issues.push('EMAIL_PASS has quotes - remove quotes from .env file');
    }
    if (emailPass.includes(' ')) {
      issues.push('EMAIL_PASS has spaces - Gmail App Passwords should not have spaces');
    }
    if (emailPass.length !== 16) {
      issues.push(`EMAIL_PASS length is ${emailPass.length}, but should be exactly 16 characters`);
    }
  }

  return res.status(200).json({
    success: issues.length === 0,
    issues,
    info,
    recommendations: [
      'Make sure your .env file is in the project root (same folder as package.json)',
      'Format should be: EMAIL_USER=your-email@gmail.com (no quotes, no spaces)',
      'Format should be: EMAIL_PASS=your16charapppass (exactly 16 characters, no spaces)',
      'Restart your development server after updating .env file',
      'Make sure you are using a Gmail App Password, not your regular Gmail password',
    ],
  });
}


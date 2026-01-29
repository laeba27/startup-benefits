import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send magic link email
export const sendMagicLinkEmail = async (
  to: string, 
  magicLink: string, 
  userName?: string
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Startup Benefits Platform',
      address: process.env.EMAIL_FROM || 'noreply@startupbenefits.com',
    },
    to,
    subject: 'Your Magic Link - Startup Benefits Platform',
    html: createMagicLinkEmailTemplate(magicLink, userName),
    text: createMagicLinkEmailText(magicLink, userName),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Magic link email sent to ${to}`);
  } catch (error) {
    console.error('  Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// HTML email template
const createMagicLinkEmailTemplate = (magicLink: string, userName?: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Your Magic Link</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 2px solid #3b82f6;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #3b82f6;
        }
        .content {
          padding: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px 0;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">⚡ Startup Benefits Platform</div>
      </div>
      
      <div class="content">
        <h1>Welcome${userName ? `, ${userName}` : ''}!</h1>
        
        <p>Click the button below to securely sign in to your Startup Benefits Platform account:</p>
        
        <div style="text-align: center;">
          <a href="${magicLink}" class="button">Sign In to Your Account</a>
        </div>
        
        
        
        <div class="warning">
          <strong>Security Notice:</strong><br>
          This link will expire in 15 minutes and can only be used once. 
          Never share this link with anyone.
        </div>
        
        <p>If you didn't request this, please ignore this email.</p>
      </div>
      
      <div class="footer">
        <p>© 2024 Startup Benefits Platform. All rights reserved.</p>
        <p>This is an automated message, please do not reply.</p>
      </div>
    </body>
    </html>
  `;
};

// Plain text email template
const createMagicLinkEmailText = (magicLink: string, userName?: string): string => {
  return `
Welcome${userName ? `, ${userName}` : ''}!

Sign in to your Startup Benefits Platform account by clicking this link:
${magicLink}

This link will expire in 15 minutes and can only be used once.

If you didn't request this, please ignore this email.

---
Startup Benefits Platform
© 2024 All rights reserved.
  `.trim();
};
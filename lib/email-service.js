/**
 * Email Service for OTP and other notifications
 * Supports: Resend, SendGrid, SMTP
 */

import nodeFetch from 'node-fetch';
import nodemailer from 'nodemailer';

// Prefer global fetch (Node 18+, Vercel) and fall back to node-fetch when needed
const fetchImpl = typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : nodeFetch;

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend';

// ============================================
// RESEND EMAIL SERVICE (Recommended)
// ============================================
async function sendViaResend(to, subject, htmlContent) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const emailFrom = process.env.OTP_EMAIL_FROM || 'noreply@resend.dev';

  console.log(`[EMAIL] Sending via Resend to: ${to}`);

  try {
  const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: emailFrom,
        to: to,
        subject: subject,
        html: htmlContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[EMAIL] Resend error:', data);
      // Provide actionable message for missing/invalid API key without leaking secrets
      const reason = data.error || data.message || JSON.stringify(data);
      throw new Error(`Failed to send email via Resend: ${reason}`);
    }

    console.log(`[EMAIL] ✅ Email sent successfully. ID: ${data.id}`);
    return { success: true, messageId: data.id };

  } catch (error) {
    console.error('[EMAIL] ❌ Resend error:', error.message || error);
    throw error;
  }
}

// ============================================
// SENDGRID EMAIL SERVICE
// ============================================
async function sendViaSendGrid(to, subject, htmlContent) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not configured');
  }

  const emailFrom = process.env.OTP_EMAIL_FROM || 'noreply@example.com';

  console.log(`[EMAIL] Sending via SendGrid to: ${to}`);

  try {
  const response = await fetchImpl('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject
          }
        ],
        from: { email: emailFrom },
        content: [
          {
            type: 'text/html',
            value: htmlContent
          }
        ]
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[EMAIL] SendGrid error:', errorBody);
      throw new Error(`Failed to send email via SendGrid: ${errorBody}`);
    }

    console.log('[EMAIL] ✅ Email sent successfully via SendGrid');
    return { success: true };

  } catch (error) {
    console.error('[EMAIL] ❌ SendGrid error:', error.message || error);
    throw error;
  }
}

// ============================================
// SMTP EMAIL SERVICE
// ============================================
let smtpTransporter = null;

function getSMTPTransporter() {
  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
  return smtpTransporter;
}

async function sendViaSMTP(to, subject, htmlContent) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP configuration is incomplete');
  }

  const emailFrom = process.env.OTP_EMAIL_FROM || process.env.SMTP_USER;

  console.log(`[EMAIL] Sending via SMTP to: ${to}`);

  try {
    const transporter = getSMTPTransporter();
    
    const result = await transporter.sendMail({
      from: emailFrom,
      to: to,
      subject: subject,
      html: htmlContent
    });

    console.log(`[EMAIL] ✅ Email sent successfully. ID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('[EMAIL] ❌ SMTP error:', error.message);
    throw error;
  }
}

// ============================================
// MAIN EMAIL SENDING FUNCTION
// ============================================
export async function sendOTPEmail(email, otp) {
  if (!email || !otp) {
    throw new Error('Email and OTP are required');
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 5px; text-align: center; }
            .content { padding: 20px; background-color: #f3f4f6; border-radius: 5px; margin: 20px 0; }
            .otp-code { 
                font-size: 32px; 
                font-weight: bold; 
                color: #1e40af; 
                text-align: center; 
                padding: 20px;
                background-color: #dbeafe;
                border-radius: 5px;
                margin: 20px 0;
                letter-spacing: 5px;
            }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            .warning { color: #dc2626; font-size: 14px; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Two-Factor Authentication</h1>
            </div>
            
            <div class="content">
                <p>Hello,</p>
                <p>Your one-time verification code is:</p>
                
                <div class="otp-code">${otp}</div>
                
                <p>This code will expire in <strong>5 minutes</strong>.</p>
                
                <p class="warning">
                    ⚠️ <strong>Never share this code with anyone.</strong> We will never ask for this code.
                </p>
                
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
            
            <div class="footer">
                <p>© 2024 E-Commerce 2FA. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const subject = '🔐 Your 2FA Verification Code';

  try {
    // Route to appropriate email provider
    switch (EMAIL_PROVIDER) {
      case 'resend':
        return await sendViaResend(email, subject, htmlContent);
      
      case 'sendgrid':
        return await sendViaSendGrid(email, subject, htmlContent);
      
      case 'smtp':
        return await sendViaSMTP(email, subject, htmlContent);
      
      default:
        throw new Error(`Unknown email provider: ${EMAIL_PROVIDER}`);
    }
  } catch (error) {
    console.error('[EMAIL] Failed to send OTP email:', error.message);
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email, userName) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; border-radius: 5px; text-align: center; }
            .content { padding: 20px; background-color: #f3f4f6; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome! 🎉</h1>
            </div>
            
            <div class="content">
                <p>Hi ${userName},</p>
                <p>Thank you for registering! Your account has been successfully created.</p>
                <p>You can now log in and start shopping.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return sendEmail(email, 'Welcome to Our Store', htmlContent);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, resetLink) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f59e0b; color: white; padding: 20px; border-radius: 5px; text-align: center; }
            .content { padding: 20px; background-color: #f3f4f6; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            
            <div class="content">
                <p>We received a request to reset your password.</p>
                <a href="${resetLink}" class="button">Reset Password</a>
                <p>This link will expire in 30 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return sendEmail(email, 'Password Reset Request', htmlContent);
}

/**
 * Generic send email function
 */
export async function sendEmail(to, subject, htmlContent) {
  try {
    switch (EMAIL_PROVIDER) {
      case 'resend':
        return await sendViaResend(to, subject, htmlContent);
      
      case 'sendgrid':
        return await sendViaSendGrid(to, subject, htmlContent);
      
      case 'smtp':
        return await sendViaSMTP(to, subject, htmlContent);
      
      default:
        throw new Error(`Unknown email provider: ${EMAIL_PROVIDER}`);
    }
  } catch (error) {
    console.error('[EMAIL] Failed to send email:', error.message);
    throw error;
  }
}

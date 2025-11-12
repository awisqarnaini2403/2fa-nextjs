import { supabaseAdmin } from '../../../lib/supabase';
import { sendOTPEmail } from '../../../lib/email-service';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Store OTP codes temporarily (in production, use Redis or database)
const otpStore = new Map();

// Maximum attempts before lockout
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Track failed attempts
const failedAttempts = new Map();

// Generate random 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Check if email is locked out due to too many failed attempts
function isLockedOut(email) {
  const attempts = failedAttempts.get(email);
  if (!attempts) return false;
  
  if (Date.now() > attempts.expiresAt) {
    failedAttempts.delete(email);
    return false;
  }
  
  return attempts.count >= MAX_ATTEMPTS;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, tempToken, code } = req.body;

    // SEND OTP via email
    if (action === 'send') {
      if (!tempToken) {
        return res.status(400).json({ error: 'Temp token required' });
      }

      // Verify temp token
      let decoded;
      try {
        decoded = jwt.verify(tempToken, JWT_SECRET);
        if (!decoded.temp) {
          return res.status(401).json({ error: 'Invalid token' });
        }
      } catch (error) {
        return res.status(401).json({ error: 'Token expired or invalid' });
      }

      const { userId, email } = decoded;

      console.log('\n📧 OTP Send Request');
      console.log('  Email:', email);
      console.log('  User ID:', userId);

      // Generate OTP
      const otp = generateOTP();
      
      // Store OTP with expiry (5 minutes)
      const otpData = {
        code: otp,
        userId,
        email,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
      };
      otpStore.set(email, otpData);

      console.log('  Generated OTP:', otp);
      console.log('  Expires at:', new Date(otpData.expiresAt).toLocaleTimeString());

      // Send email
      try {
        const emailResult = await sendOTPEmail(email, otp);
        console.log('  ✅ Email sent successfully');

        return res.status(200).json({
          success: true,
          message: 'OTP sent to your email',
          // In development mode, also return OTP for testing
          devOTP: process.env.NODE_ENV === 'development' ? otp : undefined
        });

      } catch (emailError) {
        console.error('  ❌ Email send failed:', emailError.message);
        
        // If email sending fails in production, return error
        if (process.env.NODE_ENV === 'production') {
          return res.status(500).json({ 
            success: false,
            error: 'Failed to send OTP email. Please try again later.' 
          });
        }

        // In development, still allow with dev OTP
        return res.status(200).json({
          success: true,
          message: 'OTP generated (email service unavailable in dev)',
          devOTP: otp
        });
      }
    }

    // VERIFY OTP
    if (action === 'verify') {
      if (!tempToken || !code) {
        return res.status(400).json({ error: 'Temp token and code required' });
      }

      // Verify temp token
      let decoded;
      try {
        decoded = jwt.verify(tempToken, JWT_SECRET);
        if (!decoded.temp) {
          return res.status(401).json({ error: 'Invalid token' });
        }
      } catch (error) {
        return res.status(401).json({ error: 'Token expired or invalid' });
      }

      const { userId, email } = decoded;

      console.log('\n🔐 OTP Verification Request');
      console.log('  Email:', email);
      console.log('  Provided code:', code);

      // Check if email is locked out
      if (isLockedOut(email)) {
        console.log('  ❌ Email locked due to too many failed attempts');
        return res.status(429).json({ 
          error: `Too many failed attempts. Please try again in 15 minutes.` 
        });
      }

      // Get stored OTP
      const storedOTP = otpStore.get(email);

      if (!storedOTP) {
        console.log('  ❌ No OTP found');
        return res.status(400).json({ error: 'OTP expired or not found. Please request a new one.' });
      }

      // Check expiry
      if (Date.now() > storedOTP.expiresAt) {
        console.log('  ❌ OTP expired');
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
      }

      // Verify code
      if (storedOTP.code !== code) {
        console.log('  ❌ Invalid code - tracking failed attempt');
        
        // Track failed attempt
        const attempts = failedAttempts.get(email) || { count: 0, expiresAt: Date.now() + LOCKOUT_TIME };
        attempts.count++;
        attempts.expiresAt = Date.now() + LOCKOUT_TIME;
        failedAttempts.set(email, attempts);
        
        const remainingAttempts = MAX_ATTEMPTS - attempts.count;
        
        if (remainingAttempts <= 0) {
          console.log('  🔒 Email locked - too many failed attempts');
          return res.status(429).json({ 
            error: 'Too many failed attempts. Please try again in 15 minutes.' 
          });
        }

        return res.status(401).json({ 
          error: 'Invalid OTP code',
          remainingAttempts: remainingAttempts
        });
      }

      console.log('  ✅ OTP verified successfully!');

      // Delete used OTP and clear failed attempts
      otpStore.delete(email);
      failedAttempts.delete(email);

      // Get user data
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, name, email, role')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate final JWT token
      const token = jwt.sign(
        { 
          userId: userData.id,
          email: userData.email,
          role: userData.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          twoFactorEnabled: true
        }
      });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('Email OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

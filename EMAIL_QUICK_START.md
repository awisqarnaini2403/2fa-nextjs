# Email OTP Quick Setup Guide

## 🎯 Quick Start (5 menit)

### Option 1: Resend (Recommended)

**Fastest Setup:**

1. Go to https://resend.com → Sign up
2. Get API Key dari Dashboard → API Keys
3. Edit `.env.local`:
   ```env
   EMAIL_PROVIDER=resend
   RESEND_API_KEY=re_your_key_here
   OTP_EMAIL_FROM=noreply@resend.dev
   ```
4. Run: `npm install && npm run dev`
5. Test login dengan 2FA enabled → check email ✅

---

### Option 2: Gmail SMTP

**For Testing/Small Projects:**

1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password (Security → App passwords)
3. Edit `.env.local`:
   ```env
   EMAIL_PROVIDER=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your_16_char_app_password
   OTP_EMAIL_FROM=your-email@gmail.com
   ```
4. Run: `npm install && npm run dev`
5. Test login → check email ✅

---

### Option 3: SendGrid

**For Professional Use:**

1. Sign up: https://sendgrid.com
2. Get API Key: Dashboard → Settings → API Keys
3. Verify Email: Dashboard → Sender Authentication
4. Edit `.env.local`:
   ```env
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG_your_key_here
   OTP_EMAIL_FROM=your-verified-email@domain.com
   ```
5. Run: `npm install && npm run dev`
6. Test login → check email ✅

---

## 📧 How It Works

1. **User Login** → Account dengan 2FA enabled
2. **System Generate OTP** → 6 digit code valid 5 menit
3. **Email Sent** → Via Resend/SendGrid/SMTP
4. **User Verify** → Input kode dari email
5. **JWT Token Generated** → Successful login ✅

---

## 🔒 Features

✅ Email OTP verification
✅ Brute force protection (5 attempts, 15 min lockout)
✅ OTP expiry (5 minutes)
✅ Works in development & production
✅ Multiple email providers
✅ Secure JWT authentication

---

## 🚀 Deploy to Vercel

1. Add environment variables ke Vercel project
2. Set `NODE_ENV=production`
3. Deploy: `git push`
4. Email OTP akan bekerja di production ✅

---

## 📊 File Changes

**New Files:**
- `lib/email-service.js` - Email service layer
- `EMAIL_SETUP.md` - Complete setup guide

**Updated Files:**
- `pages/api/auth/email-otp.js` - Real email sending + brute force protection
- `.env.local` - Email configuration
- `package.json` - Added nodemailer, node-fetch

---

## ⚡ Next Steps

1. **Choose email provider** (Resend recommended)
2. **Update `.env.local`** with credentials
3. **Test locally**: `npm run dev` → Login → Check email
4. **Deploy to Vercel** with env variables set
5. **Done!** 🎉

See `EMAIL_SETUP.md` for detailed documentation.

# Email OTP - Production Deployment Checklist

Gunakan checklist ini untuk memastikan email OTP berfungsi di production (Vercel).

---

## 📋 Pre-Deployment Checklist

### Code & Dependencies
- [ ] Run `npm install` - semua dependencies installed
- [ ] Run `npm run build` - no build errors
- [ ] Run `npm run dev` - server starts without errors
- [ ] No console errors saat running dev server

### Email Service Setup
- [ ] Choose email provider:
  - [ ] Resend (recommended)
  - [ ] SendGrid
  - [ ] Gmail SMTP
  
### Environment Variables (Local)
- [ ] `EMAIL_PROVIDER` set correctly
- [ ] API Key / credentials valid
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] `JWT_SECRET` set (32 character random string)
- [ ] `NODE_ENV=development` (for local testing)

### Local Testing
- [ ] Create test user dengan 2FA enabled
- [ ] Test login flow:
  - [ ] Email & password correct
  - [ ] OTP email received within 30 seconds
  - [ ] OTP code correct
  - [ ] Login successful
- [ ] Test brute force protection:
  - [ ] Enter wrong OTP 5x
  - [ ] Get locked out message
  - [ ] Wait 15 minutes or reset

### Code Commit
- [ ] No uncommitted changes
- [ ] All files added: `git status`
- [ ] Commit message clear: `git log`

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: Add email OTP service for production"
git push origin main
```
- [ ] Pushed to main branch
- [ ] No merge conflicts

### Step 2: Vercel Configuration

**Open Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables

**Add Email Service Variables:**

**If using Resend:**
```
EMAIL_PROVIDER = resend
RESEND_API_KEY = re_your_actual_key_here
OTP_EMAIL_FROM = noreply@resend.dev
```
- [ ] Copied API key correctly (no typos)
- [ ] API key starts with `re_`
- [ ] All 3 variables added

**If using SendGrid:**
```
EMAIL_PROVIDER = sendgrid
SENDGRID_API_KEY = SG_your_actual_key_here
OTP_EMAIL_FROM = your-verified-email@domain.com
```
- [ ] Copied API key correctly (starts with `SG_`)
- [ ] Email verified in SendGrid
- [ ] All 3 variables added

**If using Gmail SMTP:**
```
EMAIL_PROVIDER = smtp
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = your-email@gmail.com
SMTP_PASSWORD = your_16_char_app_password
OTP_EMAIL_FROM = your-email@gmail.com
```
- [ ] All SMTP variables added
- [ ] Gmail 2FA enabled
- [ ] App password generated (not regular password)

**Add Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
JWT_SECRET = your_32_character_secret_here
NODE_ENV = production
```
- [ ] All Supabase variables correct
- [ ] JWT_SECRET not empty
- [ ] NODE_ENV = production

**Verify Variables:**
- [ ] Total variables count correct
- [ ] No empty values
- [ ] No typos in variable names

### Step 3: Deploy

**Option A: Automatic (Recommended)**
```bash
git push origin main
# Vercel auto-detects and deploys
```
- [ ] Go to vercel.com/dashboard
- [ ] See "Deployment in progress"
- [ ] Wait for green checkmark
- [ ] Deployment successful

**Option B: Manual Trigger (if needed)**
```bash
# In Vercel dashboard:
# Deployments → Latest → Redeploy → Redeploy
```
- [ ] Clicked Redeploy button
- [ ] Build started

### Step 4: Wait for Build

Monitor deployment:
- [ ] Build started
- [ ] Building dependencies
- [ ] Running build script
- [ ] Deploying to CDN
- [ ] Green checkmark ✅

Typical time: 2-3 minutes

---

## 🧪 Production Testing

### Test 1: Access Application
- [ ] Open https://your-app.vercel.app
- [ ] Page loads without errors
- [ ] No 404 errors

### Test 2: Login Flow
1. Go to /login page
   - [ ] Page loads
   - [ ] Form visible

2. Create test user (if needed):
   - [ ] Go to /register
   - [ ] Enter test email & password
   - [ ] Create account success
   - [ ] Update user in Supabase: `two_factor_enabled = true`

3. Login with test user:
   - [ ] Enter email
   - [ ] Enter password
   - [ ] Click Login

4. Expect OTP page:
   - [ ] Redirected to OTP verification
   - [ ] Message: "Enter code from email"
   - [ ] OTP input field visible

5. Check email:
   - [ ] Check inbox of test email
   - [ ] Email received from sender (Resend/SendGrid)
   - [ ] Subject: "🔐 Your 2FA Verification Code"
   - [ ] OTP code visible in email

6. Enter OTP:
   - [ ] Copy OTP code from email
   - [ ] Paste into form
   - [ ] Click Verify

7. Verify success:
   - [ ] Redirected to dashboard
   - [ ] User logged in
   - [ ] Session token in localStorage
   - [ ] Login successful ✅

### Test 3: Brute Force Protection
1. Login again with same credentials
2. At OTP page, enter WRONG code 5 times
   - [ ] After 5th attempt: locked out message
   - [ ] Cannot try anymore
   - [ ] Message: "Too many attempts, try again in 15 minutes"

### Test 4: OTP Expiry
1. Login again
2. Wait 5 minutes without entering OTP
3. Try to verify after 5 minutes
   - [ ] Error: "OTP expired"
   - [ ] Need to request new OTP

### Test 5: Different Email
1. Logout
2. Create different test email
3. Update 2FA for this user
4. Login → OTP sent to different email
   - [ ] Email received at correct address
   - [ ] Can verify successfully

---

## 📊 Monitoring

### Check Vercel Logs

```bash
vercel logs --follow
# or via dashboard: Deployments → Function Logs
```

**Look for:**
- [ ] No 500 errors
- [ ] Email sending logs present
- [ ] OTP generation logged
- [ ] Verification successful messages

### Check Email Service Dashboard

**For Resend:**
- [ ] Dashboard → Emails
- [ ] See sent emails
- [ ] Check delivery status (Delivered)

**For SendGrid:**
- [ ] Dashboard → Mail Send → Activity Feed
- [ ] See sent emails
- [ ] Check status (Delivered)

**For Gmail:**
- [ ] Check Gmail sent folder
- [ ] Check receiving account for test email

---

## ✅ Final Checks

### Performance
- [ ] Page loads < 2 seconds
- [ ] Email sent < 30 seconds
- [ ] No timeout errors

### Security
- [ ] OTP not visible in URL
- [ ] JWT token in localStorage (httpOnly if possible)
- [ ] No API keys exposed in browser
- [ ] HTTPS enabled (automatic with Vercel)

### Functionality
- [ ] Email OTP working
- [ ] Brute force protection working
- [ ] Session management working
- [ ] Logout working

### Documentation
- [ ] README updated
- [ ] .env.local documented
- [ ] Instructions clear for other developers

---

## 🎉 Deployment Complete!

If all checks pass:
- ✅ Email OTP is working in production
- ✅ Users can login with 2FA
- ✅ Emails being sent correctly
- ✅ Security features active
- ✅ Application ready for public use

---

## 🚨 If Something Goes Wrong

### Email not sent

```bash
# 1. Check logs
vercel logs --follow

# 2. Verify environment variables
# Vercel dashboard → Settings → Environment Variables
# Check all email config variables present

# 3. Test credentials locally first
npm run dev
# Make sure email works locally

# 4. Re-deploy
git push origin main
```

### Build failed

```bash
# 1. Check build logs in Vercel dashboard
# Deployments → Failed deployment → Logs

# 2. Test locally
npm run build
npm start

# 3. Fix errors, commit, push
git push origin main
```

### 500 error

```bash
# 1. Check Vercel logs
vercel logs --follow

# 2. Check Supabase credentials in .env
# Make sure SERVICE_ROLE_KEY set

# 3. Restart build
# Vercel dashboard → Redeploy
```

### Still not working?

1. Check EMAIL_SETUP.md troubleshooting section
2. Check VERCEL_DEPLOYMENT.md troubleshooting section
3. Verify all env variables in Vercel
4. Test locally first with same credentials

---

## 📞 Support Resources

- Email Setup Guide: `EMAIL_SETUP.md`
- Quick Start: `EMAIL_QUICK_START.md`
- Deployment Guide: `VERCEL_DEPLOYMENT.md`
- Implementation Details: `EMAIL_OTP_IMPLEMENTATION.md`

---

**Deployment Checklist Complete!** ✅

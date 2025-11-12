# Email OTP Service Setup Guide

Sistem email OTP Anda sekarang siap digunakan di production! Ikuti panduan di bawah untuk setup email service pilihan Anda.

## 🚀 Pilihan Email Service

Kami mendukung 3 email service yang dapat digunakan baik di local maupun production:

### 1. **RESEND (Recommended - Termudah)**

Resend adalah email service modern yang paling mudah disetup. Free tier: 100 emails/day.

#### Setup Steps:

1. **Buat akun Resend**
   - Kunjungi https://resend.com
   - Sign up dengan GitHub atau Email
   - Verifikasi email Anda

2. **Dapatkan API Key**
   - Buka Dashboard → API Keys
   - Copy API Key Anda

3. **Setup Domain (Optional tapi recommended)**
   - Dashboard → Domains
   - Add Domain Anda (contoh: `mail.yourdomain.com`)
   - Follow DNS instructions
   - Atau gunakan default Resend domain: `noreply@resend.dev`

4. **Update `.env.local`**
   ```env
   EMAIL_PROVIDER=resend
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
   OTP_EMAIL_FROM=noreply@resend.dev  # atau email domain Anda yang sudah verified
   ```

5. **Test Email**
   ```bash
   npm run dev
   # Coba register/login → Seharusnya email diterima
   ```

---

### 2. **SendGrid**

Email service populer dengan free tier: 100 emails/day.

#### Setup Steps:

1. **Buat akun SendGrid**
   - Kunjungi https://sendgrid.com
   - Sign up dengan Email
   - Verifikasi email Anda

2. **Dapatkan API Key**
   - Dashboard → Settings → API Keys
   - Create API Key (Full Access)
   - Copy dan simpan (hanya muncul sekali!)

3. **Verify Sender Email**
   - Dashboard → Sender Authentication
   - Verify Single Sender
   - Masukkan email yang akan digunakan untuk mengirim
   - Follow verification link di email

4. **Update `.env.local`**
   ```env
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   OTP_EMAIL_FROM=noreply@yourdomain.com  # Email yang sudah diverify
   ```

5. **Test Email**
   ```bash
   npm run dev
   # Coba register/login → Seharusnya email diterima
   ```

---

### 3. **SMTP (Gmail, Outlook, atau SMTP Custom)**

Gunakan SMTP server lokal atau dari provider email Anda.

#### Setup dengan Gmail:

1. **Enable 2-Step Verification** (jika belum)
   - Buka https://myaccount.google.com/security
   - 2-Step Verification → Enable

2. **Generate App Password**
   - Security → App passwords (hanya muncul jika 2FA sudah enabled)
   - Select "Mail" dan "Windows Computer"
   - Google akan generate 16-character password

3. **Update `.env.local`**
   ```env
   EMAIL_PROVIDER=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your_app_password_16_chars
   OTP_EMAIL_FROM=your-email@gmail.com
   ```

#### Setup dengan Provider SMTP Lain:

Gunakan settings SMTP dari provider Anda. Contoh:

**Outlook/Office365:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your_password
```

**Custom SMTP Server:**
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_username
SMTP_PASSWORD=your_password
```

---

## 📋 Environment Variables

### Resend Configuration
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_api_key
OTP_EMAIL_FROM=noreply@resend.dev
```

### SendGrid Configuration
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_key
OTP_EMAIL_FROM=your_verified_email@domain.com
```

### SMTP Configuration
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_password
OTP_EMAIL_FROM=your_email@example.com
```

### Universal Configuration
```env
# NODE_ENV untuk development/production (affects OTP response)
NODE_ENV=development  # Shows devOTP in response for testing
NODE_ENV=production   # Hides OTP code, pengguna harus check email

# OTP Settings
OTP_EXPIRY=10  # OTP valid for 10 minutes
```

---

## 🧪 Testing Email Locally

### Test Mode (Development)

1. Set `NODE_ENV=development` di `.env.local`
2. Run: `npm run dev`
3. Login dengan credentials yang punya 2FA enabled
4. Di response, Anda akan melihat `devOTP` (untuk testing)
5. Atau buka email yang dikirim untuk mendapatkan kode OTP

### Production Mode (Testing)

1. Set `NODE_ENV=production`
2. Run: `npm run dev`
3. Login - akan diminta OTP
4. Cek email Anda untuk mendapatkan kode
5. Kode hanya valid 5 menit

---

## 🚀 Deploy ke Vercel

### Step 1: Update Environment Variables

1. Buka Vercel Project → Settings → Environment Variables
2. Add semua email configuration:
   - `EMAIL_PROVIDER`
   - `RESEND_API_KEY` (jika pakai Resend)
   - `SENDGRID_API_KEY` (jika pakai SendGrid)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` (jika pakai SMTP)
   - `OTP_EMAIL_FROM`
   - `NODE_ENV=production`

### Step 2: Deploy

```bash
git add .
git commit -m "Add email OTP service"
git push
# Vercel akan auto-deploy
```

### Step 3: Test di Production

1. Buka deployed URL
2. Login dengan user yang punya 2FA enabled
3. Cek email Anda untuk OTP
4. Verify OTP

---

## 📊 Email Limits & Pricing

### Resend
- **Free:** 100 emails/day
- **Paid:** Pay-as-you-go ($0.0005 per email)
- **Perfect untuk:** E-commerce dengan moderate traffic

### SendGrid
- **Free:** 100 emails/day
- **Paid:** Starting $19.95/month
- **Perfect untuk:** Enterprise applications

### Gmail (SMTP)
- **Free:** Up to 500 emails/day
- **Limitation:** May get flagged as spam for bulk emails
- **Perfect untuk:** Personal projects, testing

---

## ✅ Checklist Setup

### Local Testing
- [ ] Choose email provider
- [ ] Get API key / credentials
- [ ] Update `.env.local`
- [ ] Run `npm install`
- [ ] Test: `npm run dev`
- [ ] Try login with 2FA enabled
- [ ] Check email received

### Production Deployment
- [ ] Add email credentials to Vercel
- [ ] Set `NODE_ENV=production`
- [ ] Deploy to Vercel
- [ ] Test production URL
- [ ] Monitor email sending

---

## 🐛 Troubleshooting

### Email tidak terkirim

**Check:**
1. API Key / credentials sudah benar?
   ```bash
   # Lihat di terminal output saat running
   npm run dev
   # Lihat logs saat email dikirim
   ```

2. Domain / Email verified?
   - Resend: Check dashboard
   - SendGrid: Check Sender Authentication
   - Gmail: Check 2FA dan App Password

3. Email masuk spam folder?
   - Resend: Check spam folder
   - Gmail: Check spam folder
   - Add email ke contacts

### "RESEND_API_KEY is not configured"

- Pastikan `.env.local` sudah created
- Restart dev server: `npm run dev`
- Check file sudah saved

### SMTP Connection Error

- Check SMTP credentials benar
- Check port (587 untuk TLS, 465 untuk SSL)
- Gmail: Pastikan 2FA enabled dan app password digunakan

### Email masuk spam

**Solutions:**
1. Verify domain di Resend
2. Add SPF, DKIM, DMARC records
3. Gunakan professional domain (bukan @gmail.com)
4. Resend dan SendGrid lebih reliable daripada SMTP

---

## 📚 Resources

- [Resend Docs](https://resend.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com)
- [Nodemailer Docs](https://nodemailer.com/about/)
- [Gmail App Password](https://support.google.com/accounts/answer/185833)

---

**Ready to send emails!** 🎉

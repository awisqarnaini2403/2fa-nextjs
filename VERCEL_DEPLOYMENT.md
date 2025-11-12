# Vercel Deployment dengan Email OTP

Panduan lengkap untuk deploy aplikasi dengan email OTP ke Vercel.

## 🚀 Step-by-Step Deployment

### 1. Push ke Repository

```bash
cd d:\2fa-ecommerce\supabase-next-auth
git add .
git commit -m "feat: Add email OTP service for production"
git push origin main
```

### 2. Deploy ke Vercel

**Option A: Via Vercel CLI**
```bash
npm install -g vercel
vercel
# Follow prompts, select project/create new
```

**Option B: Via GitHub (Recommended)**
1. Push to GitHub
2. Connect GitHub repo ke Vercel
3. Vercel auto-deploy pada setiap push

**Option C: Via Vercel Dashboard**
1. Buka https://vercel.com
2. Import Git repository
3. Configure settings
4. Deploy

### 3. Configure Environment Variables di Vercel

#### A. Buka Vercel Project

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables

#### B. Add Email Configuration Variables

**For Resend:**
```
EMAIL_PROVIDER = resend
RESEND_API_KEY = re_xxxxxxxxxxxxx
OTP_EMAIL_FROM = noreply@resend.dev
```

**For SendGrid:**
```
EMAIL_PROVIDER = sendgrid
SENDGRID_API_KEY = SG_xxxxxxxxxxxxx
OTP_EMAIL_FROM = your-verified-email@domain.com
```

**For Gmail SMTP:**
```
EMAIL_PROVIDER = smtp
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = your-email@gmail.com
SMTP_PASSWORD = your_app_password
OTP_EMAIL_FROM = your-email@gmail.com
```

#### C. Add Other Required Variables

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
JWT_SECRET = your_32_character_secret
NODE_ENV = production
```

### 4. Deploy

1. Klik "Deploy" di Vercel dashboard
2. Atau trigger via: `git push origin main`
3. Tunggu build selesai (biasanya 2-3 menit)

### 5. Test Production URL

1. Buka URL Vercel Anda (contoh: `https://ecommerce-2fa.vercel.app`)
2. Register user baru dengan email yang punya 2FA enabled
3. Login → Masukkan email & password
4. Seharusnya dapat OTP via email
5. Verify OTP → Login berhasil ✅

---

## 📋 Checklist Pre-Deployment

### Code
- [ ] `npm install` sudah di-run
- [ ] Tidak ada error di `npm run dev`
- [ ] Email service configuration sudah di `.env.local`
- [ ] `.git/config` sudah connect ke repo

### Environment Variables
- [ ] `EMAIL_PROVIDER` set dengan benar
- [ ] API Key / credentials sudah valid
- [ ] `SUPABASE_*` variables sudah set
- [ ] `JWT_SECRET` sudah di-set
- [ ] `NODE_ENV=production`

### Email Service
- [ ] API Key / credentials active
- [ ] Email sender address verified (untuk SendGrid/SMTP)
- [ ] Test email sending di local (`npm run dev`)

### Supabase
- [ ] Service Role Key sudah di `.env.local`
- [ ] Database schema sudah created
- [ ] At least 1 user dengan `two_factor_enabled=true`

---

## 🧪 Testing di Production

### Test User Creation

1. Create user di production:
   ```bash
   curl -X POST https://your-vercel-url.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "name": "Test User"
     }'
   ```

2. Update user untuk enable 2FA:
   - Buka Supabase dashboard
   - Table: users
   - Set `two_factor_enabled = true` untuk user test

### Test Login Flow

1. Navigate ke: `https://your-vercel-url.vercel.app/login`
2. Enter test user email & password
3. Seharusnya redirect ke OTP verification
4. Cek email untuk OTP code
5. Enter OTP code
6. Seharusnya login successful ✅

### Monitor Logs

```bash
vercel logs
# atau di Vercel dashboard: Deployments → Logs
```

---

## 🔧 Troubleshooting

### Email tidak terkirim

**Check:**

1. **API Key valid?**
   - Vercel → Settings → Environment Variables
   - Pastikan tidak ada typo

2. **Email service credentials working?**
   - Test di local terlebih dahulu: `npm run dev`
   - Check terminal logs untuk error

3. **Email domain verified?**
   - Resend: Check dashboard
   - SendGrid: Check Sender Authentication
   - Gmail: Enable 2FA & use App Password

**Solution:**

```bash
# 1. Redeploy dengan latest env vars
vercel env pull  # Pull latest env vars
npm run dev      # Test locally
git push         # Trigger redeploy

# 2. Check logs
vercel logs --follow  # Real-time logs
```

### Build error

```bash
# Clean rebuild
vercel env pull
npm install
npm run build
git push
```

### JWT_SECRET error

- Pastikan JWT_SECRET sudah di Vercel env vars
- Restart server setelah add env var
- Trigger redeploy: `git push`

### Supabase connection error

- Check SUPABASE_URL & SUPABASE_ANON_KEY
- Pastikan network access allowed di Supabase
- Test locally terlebih dahulu

---

## 🚀 Advanced Configuration

### Custom Domain

1. Vercel → Settings → Domains
2. Add custom domain
3. Follow DNS configuration
4. Update email `OTP_EMAIL_FROM` jika perlu

### Performance Optimization

```env
# Vercel deployment config (vercel.json)
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### CDN Configuration

Email service sudah handled server-side, tidak perlu CDN optimization.

---

## 📊 Monitoring

### Vercel Analytics

1. Vercel dashboard → Analytics
2. Monitor:
   - Page load times
   - Error rates
   - API latency

### Email Service Monitoring

**Resend:**
- Dashboard → Emails → View delivery status

**SendGrid:**
- Dashboard → Mail Send → Activity Feed

**Gmail SMTP:**
- Check Gmail activity log

---

## 💡 Tips

1. **Use Resend** untuk production - paling reliable
2. **Monitor email delivery** di dashboard email service
3. **Set up alerts** untuk failed deliveries
4. **Test regularly** - pastikan OTP masih berfungsi
5. **Keep secrets secure** - never commit `.env.local`

---

## 🔐 Security Best Practices

✅ **Do:**
- Use production email service (Resend/SendGrid)
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Enable brute force protection ✓ (built-in)
- Keep API keys in Vercel env vars, not in code

❌ **Don't:**
- Use Gmail SMTP untuk production traffic tinggi
- Commit `.env.local` ke git
- Expose API keys di frontend
- Disable OTP expiry
- Use weak JWT_SECRET

---

## 📞 Support

Jika ada masalah:

1. Check Vercel logs: `vercel logs --follow`
2. Check email service dashboard
3. Test locally terlebih dahulu: `npm run dev`
4. Read documentation di EMAIL_SETUP.md

---

**Ready to deploy!** 🎉

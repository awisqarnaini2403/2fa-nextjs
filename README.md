# 🛒 E-Commerce with 2FA Authentication

> **Production-ready e-commerce platform** dengan autentikasi dua faktor (Email OTP) menggunakan Next.js dan Supabase PostgreSQL

[![Next.js](https://img.shields.io/badge/Next.js-13.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC)](https://tailwindcss.com/)

---

## 📋 Daftar Isi
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Cara Instalasi Lengkap](#-cara-instalasi-lengkap)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [API Documentation](#-api-documentation)

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ **User Registration & Login** dengan email/password
- ✅ **Two-Factor Authentication (2FA)** menggunakan Email OTP (6 digit)
- ✅ **JWT Authentication** dengan 7 hari expiry
- ✅ **Password Hashing** dengan bcrypt (salt rounds: 10)
- ✅ **Role-Based Access Control** - User & Admin roles

### 🛍️ E-Commerce Features
- ✅ **Product Catalog** dengan search dan filter
- ✅ **Shopping Cart** dengan real-time total calculation
- ✅ **Order Management** - Create, track, update orders
- ✅ **Payment Proof Upload** - Bukti transfer
- ✅ **Stock Management** - Auto-decrement on purchase
- ✅ **Order Status Tracking** - Pending → Processing → Completed/Cancelled

### 👤 User Features
- ✅ **User Dashboard** dengan order history
- ✅ **Profile Management** dengan 2FA controls
- ✅ **Search Products** - Cari berdasarkan nama, deskripsi, kategori
- ✅ **Order Cancellation** dengan alasan

### 👨‍💼 Admin Features
- ✅ **Admin Dashboard** dengan statistik real-time
- ✅ **Order Management** - Process, complete, cancel orders
- ✅ **Product Management** - Add/edit products
- ✅ **Auto-refresh Dashboard** setiap 5 detik
- ✅ **Order Statistics** by status

### 🎨 UI/UX
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Footer** - Informasi lengkap dan navigasi
- ✅ **Search Bar** - Pencarian produk real-time
- ✅ **Loading States** - Smooth loading indicators
- ✅ **Toast Notifications** - User feedback
- ✅ **Modern UI** - Clean & professional design

---

## 🛠 Tech Stack

### Frontend
- **Next.js 13.5.6** - React framework dengan SSR & API routes
- **React 18.2.0** - UI library dengan hooks
- **TailwindCSS 3.3.0** - Utility-first CSS framework

### Backend & Database
- **Supabase** - PostgreSQL database (FREE tier)
- **Row Level Security (RLS)** - Database-level security
- **UUID Primary Keys** - Secure identifiers

### Authentication & Security
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **crypto** - OTP generation untuk Email 2FA

### Deployment
- **Vercel** - Frontend & API hosting (recommended)
- **Supabase** - Database hosting (FREE tier)

---

## 🚀 Cara Instalasi Lengkap

### Prasyarat
Sebelum memulai, pastikan Anda sudah menginstal:
- ✅ **Node.js** versi 16 atau lebih tinggi ([Download Node.js](https://nodejs.org/))
- ✅ **npm** (sudah termasuk dengan Node.js)
- ✅ **Git** ([Download Git](https://git-scm.com/))
- ✅ **Akun Supabase** (gratis) - [Daftar di sini](https://supabase.com/)

---

### 📦 Langkah 1: Clone Repository

Buka terminal/command prompt, lalu jalankan:

```bash
# Clone repository dari GitHub
git clone https://github.com/muhammadsyauqijazuli/supabase-next-auth.git

# Masuk ke folder project
cd supabase-next-auth
```

---

### 📚 Langkah 2: Install Dependencies

Install semua package yang diperlukan:

```bash
npm install
```

Proses ini akan menginstal semua dependencies yang ada di `package.json`, termasuk:
- Next.js, React
- Supabase client
- TailwindCSS
- bcryptjs, jsonwebtoken
- dan lainnya

**Tunggu hingga proses selesai** (biasanya 1-3 menit tergantung koneksi internet)

---

### 🗄️ Langkah 3: Setup Database Supabase

#### 3.1. Buat Project Supabase Baru

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Klik **"Sign In"** atau **"Start your project"**
3. Login dengan GitHub/Google/Email
4. Klik **"New Project"**
5. Isi form:
   - **Name**: `ecommerce-2fa` (atau nama bebas)
   - **Database Password**: Buat password yang kuat (simpan baik-baik!)
   - **Region**: Pilih **Southeast Asia (Singapore)** untuk performa terbaik
   - **Pricing Plan**: Pilih **FREE** (cukup untuk development)
6. Klik **"Create new project"**
7. **Tunggu 2-3 menit** hingga project selesai dibuat

#### 3.2. Jalankan SQL Schema

1. Di Supabase Dashboard, klik menu **"SQL Editor"** di sidebar kiri
2. Klik tombol **"New Query"** (hijau, di pojok kanan atas)
3. Buka file `supabase-schema.sql` di text editor Anda
4. **Copy semua isi file** (Ctrl+A, Ctrl+C)
5. **Paste** di SQL Editor Supabase
6. Klik **"Run"** atau tekan **Ctrl+Enter**
7. Tunggu hingga muncul pesan **"Success. No rows returned"**

✅ Database Anda sekarang sudah berisi:
- Tabel `users` dengan 2 akun demo (admin & user)
- Tabel `products` dengan 8 produk sampel
- Tabel `orders` (masih kosong)

#### 3.3. Ambil API Keys

1. Di Supabase Dashboard, klik **"Settings"** di sidebar
2. Klik **"API"**
3. Di bagian **"Project API keys"**, copy 3 values berikut:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1N...` (key panjang)
   - **service_role**: `eyJhbGciOiJIUzI1N...` (key panjang, **JANGAN SHARE!**)

---

### 🔧 Langkah 4: Setup Environment Variables

#### 4.1. Buat File `.env.local`

Di folder project, buat file baru bernama `.env.local`:

**Windows:**
```bash
type nul > .env.local
notepad .env.local
```

**Mac/Linux:**
```bash
touch .env.local
nano .env.local
```

#### 4.2. Isi File `.env.local`

Copy template berikut dan **ganti dengan credentials Anda**:

```env
# Supabase Configuration (dari Step 3.3)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...

# Service Role Key (PENTING! untuk login & seeding)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...

# JWT Secret untuk 2FA (generate random string)
JWT_SECRET=your_very_long_random_secret_key_32_characters_minimum

# Environment
NODE_ENV=development
```

#### 4.3. Generate JWT Secret

Jalankan di terminal:

**Windows PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output contoh:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

Copy hasil output dan paste sebagai value `JWT_SECRET` di `.env.local`

#### 4.4. Save File

- Tekan **Ctrl+S** untuk save
- **Restart terminal** jika masih terbuka

⚠️ **PENTING**: 
- File `.env.local` sudah ada di `.gitignore`, jadi tidak akan ter-commit ke Git
- **JANGAN** share file ini atau upload ke GitHub!
- `SUPABASE_SERVICE_ROLE_KEY` harus dijaga kerahasiaannya

---

### ▶️ Langkah 5: Jalankan Development Server

Sekarang aplikasi siap dijalankan!

```bash
npm run dev
```

**Output yang diharapkan:**
```
> ecommerce-2fa@1.0.0 dev
> next dev

- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully in XXX ms
```

✅ **Aplikasi berjalan di**: [http://localhost:3000](http://localhost:3000)

---

### 🎉 Langkah 6: Testing Aplikasi

#### 6.1. Buka Browser

Kunjungi: **http://localhost:3000**

Anda akan melihat homepage dengan katalog produk.

#### 6.2. Login dengan Akun Demo

Klik **"Login"** di header, lalu gunakan:

**Sebagai User:**
- Email: `user@example.com`
- Password: `user123`

**Sebagai Admin:**
- Email: `admin@example.com`
- Password: `admin123`

#### 6.3. Testing 2FA Email OTP

1. Login dengan salah satu akun
2. Klik **"Profile"** di header
3. Klik tombol **"Enable 2FA"**
4. Logout
5. Login lagi dengan akun yang sama
6. **Form OTP akan muncul**
7. Dalam **development mode**, kode OTP akan muncul di:
   - ✅ Alert popup otomatis
   - ✅ Kotak kuning di halaman login
   - ✅ Console browser (F12 → Console)
   - ✅ Terminal server (logs)

#### 6.4. Testing Fitur Lainnya

✅ **Shopping Cart**: Tambah produk ke keranjang → Checkout
✅ **Search**: Gunakan search bar untuk cari produk
✅ **Orders**: Lihat pesanan Anda di menu "Pesanan"
✅ **Admin Dashboard**: Login sebagai admin → Lihat statistik & kelola order

---

### 🔍 Verifikasi Instalasi Berhasil

Checklist untuk memastikan semuanya berjalan:

- [ ] `npm run dev` berjalan tanpa error
- [ ] Homepage muncul dengan 8 produk
- [ ] Bisa login dengan `user@example.com` / `user123`
- [ ] Bisa login dengan `admin@example.com` / `admin123`
- [ ] Bisa enable 2FA di Profile
- [ ] OTP code muncul saat login (setelah enable 2FA)
- [ ] Search bar berfungsi
- [ ] Bisa add to cart dan checkout
- [ ] Admin dashboard menampilkan statistik

Jika semua checklist ✅, **instalasi berhasil!** 🎉

---

### 📁 Struktur Project

```
ecommerce-2fa/
├── 📂 components/          # Komponen React reusable
│   ├── Header.js          # Navigation header
│   ├── Footer.js          # Footer dengan info & links
│   ├── SearchBar.js       # Search bar component
│   ├── Loading.js         # Loading indicator
│   ├── Toast.js           # Toast notifications
│   └── admin/
│       └── StatsCard.js   # Card statistik admin
│
├── 📂 pages/              # Next.js pages & routes
│   ├── _app.js           # App wrapper dengan footer
│   ├── index.js          # Homepage (catalog + search)
│   ├── login.js          # Login dengan 2FA
│   ├── register.js       # Registrasi user baru
│   ├── profile.js        # Profile & 2FA management
│   ├── dashboard.js      # User dashboard
│   ├── products/
│   │   └── index.js      # Halaman products dengan search
│   ├── user/
│   │   └── orders.js     # Order history user
│   ├── admin/
│   │   └── dashboard.js  # Admin dashboard
│   └── api/              # API Routes (backend)
│       ├── auth/
│       │   ├── register.js    # API register
│       │   ├── login.js       # API login
│       │   ├── email-otp.js   # API send/verify OTP
│       │   └── simple-2fa.js  # API enable/disable 2FA
│       ├── products.js        # API products
│       ├── orders.js          # API orders (user)
│       └── admin/
│           ├── orders.js      # API orders (admin)
│           └── seed-accounts.js  # API seeding
│
├── 📂 lib/                # Utility libraries
│   ├── supabase.js       # Supabase client & helpers
│   └── validator.js      # Input validation
│
├── 📂 styles/
│   └── globals.css       # Global CSS + Tailwind
│
├── 📂 public/
│   └── images/           # Product images & icons
│
├── 📂 scripts/
│   └── seed-db.js        # Script untuk seeding data
│
├── 📄 supabase-schema.sql   # Database schema SQL
├── 📄 .env.local            # Environment variables (gitignored)
├── 📄 .gitignore            # Git ignore rules
├── 📄 package.json          # Dependencies
├── 📄 next.config.js        # Next.js config
├── 📄 tailwind.config.js    # Tailwind config
└── 📄 README.md             # Dokumentasi ini
```

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build untuk production
npm start            # Start production server
npm run lint         # Run ESLint

# Database
# (jalankan SQL queries di Supabase SQL Editor)
```

### Development Tips

1. **Hot Reload**: Setiap perubahan kode akan otomatis reload
2. **Console Logs**: Cek browser console (F12) untuk debug
3. **Server Logs**: Lihat terminal untuk server-side logs
4. **Supabase Dashboard**: Monitor database real-time

---

## 🐛 Troubleshooting

### ❌ Error: "Module not found"

**Problem**: Dependency tidak terinstall
```bash
npm install
```

### ❌ Error: "Invalid API key"

**Problem**: Environment variables tidak terbaca

**Solution**:
1. Pastikan file `.env.local` ada di root project
2. Restart server: Stop (`Ctrl+C`) lalu `npm run dev` lagi
3. Cek tidak ada typo di nama variable

### ❌ Error: "relation does not exist"

**Problem**: Tabel database belum dibuat

**Solution**:
1. Buka Supabase Dashboard → SQL Editor
2. Run ulang `supabase-schema.sql`
3. Verifikasi: `SELECT * FROM users;` harus return 2 rows

### ❌ Login selalu gagal "Invalid email or password"

**Problem**: Service role key belum dikonfigurasi atau password salah

**Solution**:
1. Cek `SUPABASE_SERVICE_ROLE_KEY` sudah ada di `.env.local`
2. Restart server
3. Coba login lagi
4. Jika masih gagal, check password hash di Supabase Table Editor

### ❌ Products tidak muncul di homepage

**Problem**: Data seeding gagal atau RLS terlalu ketat

**Solution**:
1. Buka Supabase → Table Editor → products
2. Cek ada 8 products
3. Jika kosong, run ulang SQL schema
4. Jika tetap kosong, check browser console untuk error

### ❌ OTP code tidak muncul

**Problem**: Development mode belum aktif

**Solution**:
1. Cek `.env.local`: `NODE_ENV=development`
2. Restart server
3. Cek browser console & terminal logs untuk OTP

### ❌ Port 3000 already in use

**Problem**: Port sudah digunakan aplikasi lain

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Atau gunakan port lain
PORT=3001 npm run dev
```

### 💡 Masih ada masalah?

1. Cek logs di terminal
2. Cek browser console (F12)
3. Cek Supabase logs (Dashboard → Logs)
4. Pastikan semua environment variables benar
5. Buat issue di GitHub repository

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "two_factor_enabled": false
  }
}
```

#### POST `/api/auth/login`
Login with email & password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "user123"
}
```

**Response (No 2FA):**
```json
{
  "success": true,
  "requires2FA": false,
  "token": "jwt_token",
  "user": { ... }
}
```

**Response (With 2FA):**
```json
{
  "success": true,
  "requires2FA": true,
  "tempToken": "temp_token_for_5min",
  "message": "OTP sent to email"
}
```

#### POST `/api/auth/email-otp`
Send or verify OTP code.

**Send OTP:**
```json
{
  "action": "send",
  "tempToken": "temp_token"
}
```

**Verify OTP:**
```json
{
  "action": "verify",
  "tempToken": "temp_token",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token"
}
```

---

### Products Endpoints

#### GET `/api/products`
Get all products.

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "uuid",
      "name": "Laptop Gaming",
      "description": "High performance laptop",
      "price": 15000000,
      "stock": 10,
      "category": "electronics",
      "image_url": "/images/products/laptop.jpg"
    }
  ]
}
```

---

### Orders Endpoints

#### GET `/api/orders`
Get user's orders. **Requires authentication**.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid",
      "items": [...],
      "total": 15000000,
      "status": "pending",
      "payment_proof": "BCA-123",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/orders`
Create new order. **Requires authentication**.

**Request:**
```json
{
  "items": [
    { "productId": "uuid", "quantity": 1 }
  ],
  "total": 15000000,
  "paymentProof": "BCA-1234567890",
  "autoComplete": false
}
```

---

### Admin Endpoints

#### GET `/api/admin/orders`
Get all orders with statistics. **Admin only**.

**Query Params:**
- `status`: Filter by status (pending/processing/completed/cancelled/all)

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "stats": {
    "pending": { "count": 5, "total": 50000000 },
    "processing": { "count": 3, "total": 30000000 },
    "completed": { "count": 10, "total": 100000000 },
    "cancelled": { "count": 2, "total": 10000000 }
  }
}
```

---

## 🚀 Deployment ke Production

### Option 1: Deploy ke Vercel (Recommended)

#### Via GitHub Integration

1. **Push ke GitHub** (sudah dilakukan)
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Import ke Vercel**
   - Kunjungi [https://vercel.com](https://vercel.com)
   - Klik **"Import Project"**
   - Pilih repository GitHub Anda
   - Klik **"Import"**

3. **Configure Environment Variables**
   
   Di Vercel Dashboard → Settings → Environment Variables, tambahkan:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
   JWT_SECRET = your_32_character_secret
   NODE_ENV = production
   ```

4. **Deploy**
   - Klik **"Deploy"**
   - Tunggu ~2 menit
   - Aplikasi live di: `https://your-app.vercel.app`

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts
# Production deployment
vercel --prod
```

### Option 2: Deploy ke Platform Lain

Aplikasi ini bisa di-deploy ke:
- **Netlify** - Similar to Vercel
- **Railway** - With database included
- **Render** - Free tier available
- **DigitalOcean App Platform**

---

## 🔐 Security Checklist untuk Production

Sebelum deploy ke production, pastikan:

- [ ] Ganti password default admin & user
- [ ] Generate JWT_SECRET baru yang kuat
- [ ] Enable 2FA untuk semua admin account
- [ ] Review Supabase RLS policies
- [ ] Setup custom domain dengan HTTPS
- [ ] Enable Vercel/Supabase security headers
- [ ] Setup error monitoring (Sentry, LogRocket)
- [ ] Backup database regular
- [ ] Review CORS settings
- [ ] Setup rate limiting

---

## 📖 Additional Resources

- **[Supabase Documentation](https://supabase.com/docs)** - Database & auth guide
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework guide
- **[TailwindCSS Documentation](https://tailwindcss.com/docs)** - Styling guide
- **[Vercel Documentation](https://vercel.com/docs)** - Deployment guide

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📝 License

MIT License - Free untuk personal & commercial projects.

---

## 👨‍💻 Author

**Muhammad Syauqi Jazuli**
- GitHub: [@muhammadsyauqijazuli](https://github.com/muhammadsyauqijazuli)
- Repository: [supabase-next-auth](https://github.com/muhammadsyauqijazuli/supabase-next-auth)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment platform

---

## 📞 Support

Jika Anda menemukan bug atau memiliki pertanyaan:

1. **Check Troubleshooting section** di atas
2. **Open an Issue** di GitHub repository
3. **Check existing issues** - mungkin sudah ada solusinya

---

**⭐ Star repository ini jika bermanfaat!**

**🐛 Found a bug?** [Open an issue](https://github.com/muhammadsyauqijazuli/supabase-next-auth/issues)

**💡 Have suggestions?** Pull requests welcome!

**📧 Need help?** Check the issues or create a new one

---

**Happy Coding! 🚀**

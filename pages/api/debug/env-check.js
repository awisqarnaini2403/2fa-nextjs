export default function handler(req, res) {
  // Do NOT expose secret values. Only return presence/boolean flags to help debugging.
  const vars = {
    NODE_ENV: !!process.env.NODE_ENV,
    EMAIL_PROVIDER: !!process.env.EMAIL_PROVIDER,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
    SMTP_HOST: !!process.env.SMTP_HOST,
    OTP_EMAIL_FROM: !!process.env.OTP_EMAIL_FROM,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    JWT_SECRET: !!process.env.JWT_SECRET
  };

  res.status(200).json({ ok: true, vars });
}

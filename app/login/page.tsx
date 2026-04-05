import { LoginClient } from '@/components/auth/LoginClient'

export const metadata = {
  title: 'Sign In — Kudo',
}

export default function LoginPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: 'var(--black)' }}
    >
      {/* Logo */}
      <div className="mb-10 text-center">
        <div
          className="mb-2 text-[48px] font-black tracking-[-2px]"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Ku<span style={{ color: '#00af51' }}>do</span>
        </div>
        <div
          className="text-[10px] uppercase tracking-[3px]"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          RYP Golf · Proof of Work
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[400px] rounded-[22px] p-8"
        style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <h1
          className="mb-1 text-[20px] font-extrabold"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Sign in
        </h1>
        <p className="mb-8 text-[13px]" style={{ color: 'rgba(255,255,255,0.52)' }}>
          Enter your email to get a magic link.
        </p>
        <LoginClient />
      </div>
    </div>
  )
}

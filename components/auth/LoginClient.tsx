'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

const emailSchema = z.string().email('Please enter a valid email')

export function LoginClient() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = emailSchema.safeParse(email.trim())
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid email')
      return
    }

    setSending(true)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setSending(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mb-4 text-[32px]">📬</div>
        <p
          className="mb-2 text-[15px] font-semibold"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Check your inbox
        </p>
        <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.52)' }}>
          We sent a magic link to <strong className="text-white">{email}</strong>. Click it to
          sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="glass-input"
          autoComplete="email"
          autoFocus
        />
        {error && (
          <p className="mt-2 text-[11px]" style={{ color: '#ff5252' }}>
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="btn btn-primary w-full"
        style={{ opacity: sending ? 0.7 : 1 }}
      >
        {sending ? 'Sending link…' : 'Send magic link'}
      </button>
    </form>
  )
}

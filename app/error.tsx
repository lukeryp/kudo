'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error monitoring service in production
    console.error('Global error:', error)
  }, [error])

  return (
    <div
      style={{ background: '#0d0d0d', color: '#fff', minHeight: '100vh' }}
      className="flex flex-col items-center justify-center gap-6 p-8 text-center"
    >
      <div className="text-4xl">⚠️</div>
      <div>
        <h1
          className="mb-2 text-xl font-bold"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Something went wrong
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.52)' }}>
          {error.message || 'An unexpected error occurred.'}
        </p>
        {error.digest && (
          <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <button
        onClick={reset}
        className="btn btn-primary"
      >
        Try again
      </button>
    </div>
  )
}

'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <span className="text-3xl">⚠️</span>
      <div>
        <h2
          className="mb-1 text-lg font-bold"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Something went wrong
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-m)' }}>
          {error.message || 'Failed to load this section.'}
        </p>
      </div>
      <button onClick={reset} className="btn btn-primary">
        Try again
      </button>
    </div>
  )
}

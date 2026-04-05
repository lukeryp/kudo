'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface TopbarProps {
  title: string
  onSearch?: (query: string) => void
  onAddStudent?: () => void
}

export function Topbar({ title, onSearch, onAddStudent }: TopbarProps) {
  const [query, setQuery] = useState('')
  const [, startTransition] = useTransition()
  const router = useRouter()

  function handleSearch(value: string) {
    setQuery(value)
    if (onSearch) {
      onSearch(value)
    } else {
      // Update URL search param for server-side filtering
      startTransition(() => {
        const params = new URLSearchParams()
        if (value) params.set('search', value)
        router.replace(`?${params.toString()}`, { scroll: false })
      })
    }
  }

  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between px-8 py-[18px]"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        className="text-[19px] font-extrabold"
        style={{ fontFamily: 'Raleway, sans-serif' }}
      >
        {title}
      </div>

      <div className="flex items-center gap-[10px]">
        <div
          className="flex items-center gap-2 rounded-[9px] px-[13px] py-[7px] transition-all duration-200"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--green)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <svg
            width={13}
            height={13}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            style={{ color: 'var(--text-d)', flexShrink: 0 }}
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search students…"
            className="w-[190px] border-none bg-transparent text-[13px] text-white outline-none"
            style={{ fontFamily: 'Work Sans, sans-serif' }}
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="text-xs transition-colors"
              style={{ color: 'var(--text-d)' }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {onAddStudent && (
          <button onClick={onAddStudent} className="btn btn-primary">
            + Add Student
          </button>
        )}
      </div>
    </div>
  )
}

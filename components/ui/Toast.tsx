'use client'

import { useEffect, useState, useCallback } from 'react'

interface ToastEvent {
  msg: string
  id: number
}

// Simple event emitter for toast notifications
let toastListeners: Array<(event: ToastEvent) => void> = []
let toastCounter = 0

export function showToast(msg: string) {
  const event: ToastEvent = { msg, id: ++toastCounter }
  toastListeners.forEach((fn) => fn(event))
}

export function Toast() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((event: ToastEvent) => {
    setMessage(event.msg)
    setVisible(true)
    if (timer) clearTimeout(timer)
    const t = setTimeout(() => setVisible(false), 2400)
    setTimer(t)
  }, [timer])

  useEffect(() => {
    toastListeners.push(show)
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== show)
    }
  }, [show])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-[22px] right-[22px] z-[900] flex items-center gap-[7px] rounded-[11px] px-4 py-3 text-[12px] font-semibold transition-all duration-[280ms]"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-g)',
        color: 'var(--green)',
        boxShadow: 'var(--shadow-g)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      <svg
        width={13}
        height={13}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  )
}

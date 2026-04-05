'use client'

import { useEffect, useRef } from 'react'

interface ModalProps {
  title: string
  subtitle?: string | undefined
  children: React.ReactNode
  onClose: () => void
  maxWidth?: number | undefined
}

export function Modal({ title, subtitle, children, onClose, maxWidth = 540 }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.28s ease',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full overflow-y-auto rounded-[22px]"
        style={{
          maxWidth: `${maxWidth}px`,
          maxHeight: '86vh',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          animation: 'modalIn 0.28s ease',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 pb-4 pt-[22px]"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <div
              id="modal-title"
              className="text-[17px] font-extrabold"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              {title}
            </div>
            {subtitle && (
              <div className="mt-[3px] text-[11px]" style={{ color: 'var(--text-m)' }}>
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-[30px] w-[30px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[7px] text-[16px] transition-colors duration-200"
            style={{
              background: 'var(--glass)',
              border: '1px solid var(--border)',
              color: 'var(--text-m)',
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {children}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn { from { transform: translateY(18px) scale(0.97); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }
        .modal-body { padding: 22px 24px; }
        .modal-footer { padding: 14px 24px 22px; display: flex; gap: 8px; justify-content: flex-end; }
      `}</style>
    </div>
  )
}

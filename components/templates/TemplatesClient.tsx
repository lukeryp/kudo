'use client'

import { useState } from 'react'
import { TEMPLATES } from '@/lib/constants'
import type { Template } from '@/types'
import { Modal } from '../ui/Modal'
import { showToast } from '../ui/Toast'

export function TemplatesClient() {
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function copyTemplate(template: Template) {
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`).then(() => {
      showToast('Template copied to clipboard')
      setCopiedId(template.id)
      setTimeout(() => setCopiedId(null), 2200)
    })
  }

  return (
    <>
      <div
        className="grid gap-[14px]"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))' }}
      >
        {TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="overflow-hidden rounded-[16px] transition-all duration-[250ms] animate-fadeUp"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-g)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-[18px] pb-[11px] pt-[14px]"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div
                className="text-[13px] font-bold"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                {tpl.title}
              </div>
              <span
                className="rounded-[20px] border px-[9px] py-[3px] text-[9px] font-bold"
                style={{
                  background: 'rgba(0,175,81,0.14)',
                  borderColor: 'rgba(0,175,81,0.22)',
                  color: 'var(--green)',
                }}
              >
                {tpl.stage}
              </span>
            </div>

            {/* Subject preview */}
            <div
              className="px-[18px] py-[8px] text-[10px] italic"
              style={{
                color: 'var(--text-d)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {tpl.subject}
            </div>

            {/* Body preview */}
            <div className="relative px-[18px] py-[14px]">
              <div
                className="max-h-[108px] overflow-hidden text-[11px] leading-[1.75]"
                style={{ color: 'var(--text-m)' }}
              >
                {tpl.body}
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-[38px]"
                style={{
                  background: 'linear-gradient(transparent, var(--surface))',
                }}
              />
            </div>

            {/* Footer */}
            <div
              className="flex gap-[7px] px-4 py-[11px]"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <button
                onClick={() => copyTemplate(tpl)}
                className="flex flex-1 items-center justify-center gap-[5px] rounded-[7px] border px-0 py-[7px] text-[11px] font-semibold transition-all duration-200"
                style={
                  copiedId === tpl.id
                    ? {
                        background: 'rgba(0,175,81,0.28)',
                        borderColor: 'rgba(0,175,81,0.4)',
                        color: 'var(--green-light)',
                      }
                    : {
                        background: 'rgba(0,175,81,0.1)',
                        borderColor: 'rgba(0,175,81,0.2)',
                        color: 'var(--green)',
                      }
                }
              >
                {copiedId === tpl.id ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
              <button
                onClick={() => setActiveTemplate(tpl)}
                className="rounded-[7px] border px-[13px] py-[7px] text-[11px] transition-all duration-200"
                style={{
                  background: 'var(--glass)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-m)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-m)'
                }}
              >
                View Full
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full template modal */}
      {activeTemplate && (
        <Modal
          title={activeTemplate.title}
          subtitle={`Stage: ${activeTemplate.stage}`}
          onClose={() => setActiveTemplate(null)}
          maxWidth={600}
        >
          <div className="modal-body">
            <div
              className="mb-3 text-[11px] font-semibold"
              style={{ color: 'var(--text-m)' }}
            >
              Subject: <span style={{ color: 'var(--text)' }}>{activeTemplate.subject}</span>
            </div>
            <div
              className="max-h-[380px] overflow-y-auto rounded-[10px] border p-[18px] text-[12px] leading-[1.85]"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--border)',
                color: 'var(--text-m)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {activeTemplate.body}
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={() => setActiveTemplate(null)} className="btn btn-ghost">
              Close
            </button>
            <button
              onClick={() => copyTemplate(activeTemplate)}
              className="btn btn-primary"
            >
              {copiedId === activeTemplate.id ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

'use client'

import { useState } from 'react'
import type { Student, StageId, Platform } from '@/types'
import { STAGES, TEMPLATES, STAGE_TEMPLATE_MAP } from '@/lib/constants'
import { daysSince, fmtDate, fillTemplate } from '@/lib/utils'
import { Modal } from '../ui/Modal'
import { showToast } from '../ui/Toast'

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'website', label: 'Website' },
  { id: 'tiktok', label: 'TikTok' },
]

const TESTIMONIAL_STAGES: StageId[] = ['video-received', 'approved', 'deployed']

interface StudentDetailModalProps {
  student: Student
  onClose: () => void
  onUpdate: (student: Student) => void
  onDelete: (id: string) => void
  onStageMove?: (id: string, stage: StageId) => Promise<void>
}

export function StudentDetailModal({
  student,
  onClose,
  onUpdate,
  onDelete,
  onStageMove,
}: StudentDetailModalProps) {
  const [currentStage, setCurrentStage] = useState<StageId>(student.stage)
  const [notes, setNotes] = useState(student.notes ?? '')
  const [testimonialText, setTestimonialText] = useState(student.testimonial_text ?? '')
  const [platforms, setPlatforms] = useState<Platform[]>(student.platforms)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const days = daysSince(student.lesson_date)
  const showTestimonialSection = TESTIMONIAL_STAGES.includes(currentStage)

  const suggestedTemplateId = STAGE_TEMPLATE_MAP[currentStage]
  const suggestedTemplate = suggestedTemplateId
    ? TEMPLATES.find((t) => t.id === suggestedTemplateId)
    : null

  function togglePlatform(p: Platform) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    )
  }

  async function handleStageSelect(stage: StageId) {
    setCurrentStage(stage)
    if (onStageMove) {
      await onStageMove(student.id, stage)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: currentStage,
          notes: notes || undefined,
          testimonial_text: testimonialText || undefined,
          platforms,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(body.error ?? 'Save failed')
      }

      const { data } = await res.json() as { data: Student }
      onUpdate(data)
      showToast('Changes saved')
      onClose()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/students/${student.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')

      showToast(`${student.name} removed`)
      onDelete(student.id)
      onClose()
    } catch {
      showToast('Failed to remove student')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  function copySuggestedTemplate() {
    if (!suggestedTemplate) return
    const body = fillTemplate(suggestedTemplate.body, student.name)
    navigator.clipboard.writeText(body).then(() => showToast('Template copied'))
  }

  return (
    <Modal
      title={student.name}
      subtitle={STAGES.find((s) => s.id === currentStage)?.label}
      onClose={onClose}
      maxWidth={620}
    >
      <div className="modal-body">
        {/* Stage pills */}
        <div
          className="mb-[6px] text-[10px] font-bold uppercase tracking-[1.2px]"
          style={{ color: 'var(--text-m)' }}
        >
          Move to Stage
        </div>
        <div className="mb-[18px] flex flex-wrap gap-[6px]">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => handleStageSelect(s.id)}
              className="rounded-[7px] border px-[11px] py-[5px] text-[10px] font-bold transition-all duration-200"
              style={
                currentStage === s.id
                  ? {
                      background: 'rgba(0,175,81,0.18)',
                      borderColor: 'var(--green)',
                      color: 'var(--green)',
                    }
                  : {
                      background: 'var(--glass)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-m)',
                    }
              }
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Info block */}
        <div
          className="mb-4 rounded-[11px] p-[14px]"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          {[
            { key: 'Email', val: student.email || '—' },
            { key: 'Lesson Date', val: fmtDate(student.lesson_date) },
            { key: 'Days Since Lesson', val: `${days} days` },
            { key: 'Student Since', val: fmtDate(student.created_at) },
          ].map(({ key, val }) => (
            <div
              key={key}
              className="flex items-center justify-between py-[5px]"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="text-[11px]" style={{ color: 'var(--text-m)' }}>
                {key}
              </span>
              <span className="text-[12px] font-semibold">{val}</span>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="form-label">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Lesson notes, goals, follow-up reminders…"
            className="glass-input"
            rows={3}
            style={{ resize: 'vertical', minHeight: '70px', lineHeight: '1.6' }}
          />
        </div>

        {/* Testimonial section (conditional) */}
        {showTestimonialSection && (
          <>
            <div className="mb-4">
              <label className="form-label">Testimonial Text</label>
              <textarea
                value={testimonialText}
                onChange={(e) => setTestimonialText(e.target.value)}
                placeholder="Paste or type the testimonial…"
                className="glass-input"
                rows={4}
                style={{ resize: 'vertical', lineHeight: '1.6' }}
              />
            </div>

            <div className="mb-4">
              <div
                className="mb-2 text-[10px] font-bold uppercase tracking-[1.2px]"
                style={{ color: 'var(--text-m)' }}
              >
                Deployed To
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {PLATFORMS.map((p) => {
                  const active = platforms.includes(p.id)
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className="rounded-[7px] border px-[11px] py-[5px] text-[11px] font-semibold transition-all duration-200"
                      style={
                        active
                          ? {
                              borderColor: 'var(--border-g)',
                              color: 'var(--green)',
                              background: 'rgba(0,175,81,0.1)',
                            }
                          : {
                              borderColor: 'var(--border)',
                              color: 'var(--text-m)',
                              background: 'transparent',
                            }
                      }
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Suggested template */}
        {suggestedTemplate && (
          <div
            className="animate-fadeUp rounded-[11px] p-[14px]"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-g)',
            }}
          >
            <div
              className="mb-[3px] text-[13px] font-semibold"
              style={{ color: 'var(--green)' }}
            >
              {suggestedTemplate.title}
            </div>
            <div className="mb-[10px] text-[10px]" style={{ color: 'var(--text-d)' }}>
              Suggested for this stage · {suggestedTemplate.subject}
            </div>
            <div
              className="mb-[10px] max-h-[60px] overflow-hidden text-[11px] leading-[1.65]"
              style={{ color: 'var(--text-m)' }}
            >
              {fillTemplate(suggestedTemplate.body.slice(0, 200), student.name)}…
            </div>
            <button
              onClick={copySuggestedTemplate}
              className="rounded-[7px] border px-[11px] py-[6px] text-[11px] font-semibold transition-all duration-200"
              style={{
                background: 'rgba(0,175,81,0.1)',
                borderColor: 'rgba(0,175,81,0.2)',
                color: 'var(--green)',
              }}
            >
              Copy email template
            </button>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn btn-danger mr-auto"
          style={{ opacity: deleting ? 0.7 : 1 }}
        >
          {deleting ? 'Removing…' : confirmDelete ? 'Confirm Remove?' : 'Remove'}
        </button>
        <button onClick={onClose} className="btn btn-ghost">
          Close
        </button>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </Modal>
  )
}

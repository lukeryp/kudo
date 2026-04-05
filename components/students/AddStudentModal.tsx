'use client'

import { useState, useRef, useEffect } from 'react'
import { createStudentSchema, type CreateStudentInput } from '@/lib/validations'
import { showToast } from '../ui/Toast'
import { Modal } from '../ui/Modal'

interface AddStudentModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function AddStudentModal({ onClose, onSuccess }: AddStudentModalProps) {
  const nameRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof CreateStudentInput, string>>>({})

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 80)
  }, [])

  const today = new Date().toISOString().split('T')[0] ?? ''

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    const raw = {
      name: fd.get('name'),
      email: fd.get('email') || undefined,
      lesson_date: fd.get('lesson_date'),
      stage: fd.get('stage'),
      notes: fd.get('notes') || undefined,
    }

    const parsed = createStudentSchema.safeParse(raw)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] ?? '']),
        ) as Partial<Record<keyof CreateStudentInput, string>>,
      )
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(body.error ?? 'Failed to add student')
      }

      const { data } = await res.json() as { data: { name: string } }
      showToast(`${data.name} added to pipeline`)
      onSuccess()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="Add New Student"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="name" className="form-label">Full Name *</label>
              <input
                ref={nameRef}
                id="name"
                name="name"
                type="text"
                placeholder="John Smith"
                className="glass-input"
                autoComplete="off"
              />
              {errors.name && (
                <p className="mt-1 text-[11px]" style={{ color: '#ff5252' }}>{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@email.com"
                className="glass-input"
                autoComplete="off"
              />
              {errors.email && (
                <p className="mt-1 text-[11px]" style={{ color: '#ff5252' }}>{errors.email}</p>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="lesson_date" className="form-label">Lesson Date *</label>
              <input
                id="lesson_date"
                name="lesson_date"
                type="date"
                defaultValue={today}
                className="glass-input"
                style={{ colorScheme: 'dark' }}
              />
              {errors.lesson_date && (
                <p className="mt-1 text-[11px]" style={{ color: '#ff5252' }}>{errors.lesson_date}</p>
              )}
            </div>
            <div>
              <label htmlFor="stage" className="form-label">Initial Stage</label>
              <select
                id="stage"
                name="stage"
                className="glass-input"
                defaultValue="post-lesson"
              >
                <option value="post-lesson">Post-Lesson (Day 0)</option>
                <option value="hook-sent">Hook Sent (Day 1)</option>
                <option value="2-week">2-Week Check-In</option>
                <option value="4-week">4-Week Ask</option>
                <option value="8-week">8-Week Follow-Up</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Lesson focus, student goals, key swing issues…"
              className="glass-input"
              rows={3}
              style={{ resize: 'vertical', minHeight: '80px', lineHeight: '1.6' }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Adding…' : 'Add Student'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

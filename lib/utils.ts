import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { KpiMetrics, Student } from '@/types'
import { ACTIVE_STAGES, TESTIMONIAL_STAGES } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function daysSince(dateStr: string | null): number {
  if (!dateStr) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000))
}

export function fmtDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  // For YYYY-MM-DD date-only strings, parse as local midnight to avoid UTC offset shifting the day
  const d = dateStr.includes('T') ? new Date(dateStr) : new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function fmtRelative(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = daysSince(dateStr)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 7) return `${d}d ago`
  if (d < 30) return `${Math.floor(d / 7)}w ago`
  return fmtDate(dateStr)
}

export function fillTemplate(body: string, studentName: string): string {
  return body.replace(/\[Student Name\]/g, studentName)
}

export function computeKpiMetrics(students: Student[]): KpiMetrics {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const active = students.filter((s) => ACTIVE_STAGES.includes(s.stage))
  const withTestimonials = students.filter((s) => TESTIMONIAL_STAGES.includes(s.stage))

  const thisMonth = withTestimonials.filter((s) => {
    const updated = new Date(s.updated_at)
    return updated >= monthStart
  })

  const total = students.length
  const converted = withTestimonials.length
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0

  // Average days: from lesson_date to when they reached video-received/approved/deployed
  // We approximate using updated_at as proxy for testimonial receipt
  const daysArr = withTestimonials
    .filter((s) => s.lesson_date)
    .map((s) => {
      const lessonMs = new Date(s.lesson_date).getTime()
      const receivedMs = new Date(s.updated_at).getTime()
      return Math.floor((receivedMs - lessonMs) / 86_400_000)
    })
    .filter((d) => d >= 0)

  const avgDays =
    daysArr.length > 0
      ? Math.round(daysArr.reduce((a, b) => a + b, 0) / daysArr.length)
      : null

  return {
    activePipeline: active.length,
    testimonialsThisMonth: thisMonth.length,
    conversionRate,
    avgDaysToTestimonial: avgDays,
  }
}

export function getDayBadgeVariant(days: number): 'green' | 'yellow' | 'red' {
  if (days < 28) return 'green'
  if (days < 60) return 'yellow'
  return 'red'
}

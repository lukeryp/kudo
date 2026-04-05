import { describe, it, expect } from 'vitest'
import {
  daysSince,
  fmtDate,
  fmtRelative,
  fillTemplate,
  computeKpiMetrics,
  getDayBadgeVariant,
} from '../lib/utils'
import type { Student } from '../types'

// ─── daysSince ──────────��────────────────────────────────────────────────────

describe('daysSince', () => {
  it('returns 0 for null', () => {
    expect(daysSince(null)).toBe(0)
  })

  it('returns 0 for today', () => {
    const today = new Date().toISOString().split('T')[0]!
    expect(daysSince(today)).toBe(0)
  })

  it('returns correct days for past date', () => {
    const date = new Date(Date.now() - 7 * 86_400_000).toISOString()
    expect(daysSince(date)).toBe(7)
  })

  it('never returns negative', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString()
    expect(daysSince(future)).toBe(0)
  })
})

// ─── fmtDate ──────────────────────────��──────────────────────────��───────────

describe('fmtDate', () => {
  it('returns dash for null', () => {
    expect(fmtDate(null)).toBe('—')
  })

  it('formats a known date', () => {
    const result = fmtDate('2024-01-15')
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2024/)
  })
})

// ─── fmtRelative ───────────────────────────────────���─────────────────────────

describe('fmtRelative', () => {
  it('returns Today for today', () => {
    expect(fmtRelative(new Date().toISOString())).toBe('Today')
  })

  it('returns Yesterday for 1 day ago', () => {
    const d = new Date(Date.now() - 86_400_000).toISOString()
    expect(fmtRelative(d)).toBe('Yesterday')
  })

  it('returns Xd ago for days < 7', () => {
    const d = new Date(Date.now() - 3 * 86_400_000).toISOString()
    expect(fmtRelative(d)).toBe('3d ago')
  })

  it('returns Xw ago for days < 30', () => {
    const d = new Date(Date.now() - 14 * 86_400_000).toISOString()
    expect(fmtRelative(d)).toBe('2w ago')
  })

  it('returns empty string for null', () => {
    expect(fmtRelative(null)).toBe('')
  })
})

// ─── fillTemplate ───────────────────────────────────────────────────��─────────

describe('fillTemplate', () => {
  it('replaces all [Student Name] occurrences', () => {
    const body = 'Hey [Student Name], hope [Student Name] is well.'
    expect(fillTemplate(body, 'John')).toBe('Hey John, hope John is well.')
  })

  it('returns body unchanged when no placeholder', () => {
    expect(fillTemplate('No placeholder here.', 'John')).toBe('No placeholder here.')
  })
})

// ─── getDayBadgeVariant ─────────────────────────────────────────────────────��─

describe('getDayBadgeVariant', () => {
  it('green for < 28 days', () => {
    expect(getDayBadgeVariant(0)).toBe('green')
    expect(getDayBadgeVariant(27)).toBe('green')
  })

  it('yellow for 28–59 days', () => {
    expect(getDayBadgeVariant(28)).toBe('yellow')
    expect(getDayBadgeVariant(59)).toBe('yellow')
  })

  it('red for >= 60 days', () => {
    expect(getDayBadgeVariant(60)).toBe('red')
    expect(getDayBadgeVariant(200)).toBe('red')
  })
})

// ─── computeKpiMetrics ───────────────────────────────���───────────────────────

const BASE_STUDENT: Omit<Student, 'id' | 'stage'> = {
  user_id: 'user-1',
  name: 'Test',
  email: null,
  lesson_date: '2024-01-01',
  notes: null,
  testimonial_text: null,
  platforms: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

function makeStudent(id: string, stage: Student['stage'], daysAgo = 0): Student {
  const updated = new Date(Date.now() - daysAgo * 86_400_000).toISOString()
  return { ...BASE_STUDENT, id, stage, updated_at: updated }
}

describe('computeKpiMetrics', () => {
  it('counts active pipeline correctly', () => {
    const students: Student[] = [
      makeStudent('1', 'post-lesson'),
      makeStudent('2', 'hook-sent'),
      makeStudent('3', 'deployed'),
    ]
    const m = computeKpiMetrics(students)
    expect(m.activePipeline).toBe(2)
  })

  it('returns zero metrics for empty students', () => {
    const m = computeKpiMetrics([])
    expect(m.activePipeline).toBe(0)
    expect(m.testimonialsThisMonth).toBe(0)
    expect(m.conversionRate).toBe(0)
    expect(m.avgDaysToTestimonial).toBeNull()
  })

  it('computes conversion rate', () => {
    const students: Student[] = [
      makeStudent('1', 'post-lesson'),
      makeStudent('2', 'approved'),
      makeStudent('3', 'deployed'),
      makeStudent('4', '4-week'),
    ]
    const m = computeKpiMetrics(students)
    // 2 out of 4 converted = 50%
    expect(m.conversionRate).toBe(50)
  })

  it('counts testimonials this month', () => {
    const thisMonthUpdated = new Date()
    thisMonthUpdated.setDate(1)
    const students: Student[] = [
      makeStudent('1', 'video-received', 0), // this month
      makeStudent('2', 'approved', 0),        // this month
      makeStudent('3', 'deployed', 60),       // last month (60 days ago)
    ]
    const m = computeKpiMetrics(students)
    expect(m.testimonialsThisMonth).toBeGreaterThanOrEqual(1)
  })
})

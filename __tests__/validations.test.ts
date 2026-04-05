import { describe, it, expect } from 'vitest'
import { createStudentSchema, updateStudentSchema, paginationSchema } from '../lib/validations'

// ─── createStudentSchema ─────────────────────────────────────────────────────

describe('createStudentSchema', () => {
  it('accepts valid input', () => {
    const result = createStudentSchema.safeParse({
      name: 'Jane Doe',
      lesson_date: '2024-06-15',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = createStudentSchema.safeParse({
      name: '',
      lesson_date: '2024-06-15',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing lesson_date', () => {
    const result = createStudentSchema.safeParse({ name: 'John' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid date format', () => {
    const result = createStudentSchema.safeParse({
      name: 'John',
      lesson_date: '15/06/2024',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = createStudentSchema.safeParse({
      name: 'John',
      lesson_date: '2024-06-15',
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('accepts empty string email', () => {
    const result = createStudentSchema.safeParse({
      name: 'John',
      lesson_date: '2024-06-15',
      email: '',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid stage', () => {
    const result = createStudentSchema.safeParse({
      name: 'John',
      lesson_date: '2024-06-15',
      stage: 'invalid-stage',
    })
    expect(result.success).toBe(false)
  })

  it('defaults stage to post-lesson', () => {
    const result = createStudentSchema.safeParse({
      name: 'John',
      lesson_date: '2024-06-15',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.stage).toBe('post-lesson')
    }
  })

  it('rejects name over 120 chars', () => {
    const result = createStudentSchema.safeParse({
      name: 'A'.repeat(121),
      lesson_date: '2024-06-15',
    })
    expect(result.success).toBe(false)
  })

  it('trims whitespace from name', () => {
    const result = createStudentSchema.safeParse({
      name: '  Jane  ',
      lesson_date: '2024-06-15',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Jane')
    }
  })
})

// ─── updateStudentSchema ─────────────────────────────────────────────────────

describe('updateStudentSchema', () => {
  it('accepts empty object (all optional)', () => {
    expect(updateStudentSchema.safeParse({}).success).toBe(true)
  })

  it('accepts valid platforms array', () => {
    const result = updateStudentSchema.safeParse({
      platforms: ['instagram', 'youtube'],
    })
    expect(result.success).toBe(true)
  })

  it('rejects unknown platform', () => {
    const result = updateStudentSchema.safeParse({
      platforms: ['snapchat'],
    })
    expect(result.success).toBe(false)
  })
})

// ─── paginationSchema ─────────────────────────────────────────────────────────

describe('paginationSchema', () => {
  it('defaults page to 1 and limit to 50', () => {
    const result = paginationSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.limit).toBe(50)
    }
  })

  it('coerces string numbers', () => {
    const result = paginationSchema.safeParse({ page: '2', limit: '25' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(2)
      expect(result.data.limit).toBe(25)
    }
  })

  it('rejects limit > 100', () => {
    expect(paginationSchema.safeParse({ limit: '101' }).success).toBe(false)
  })

  it('rejects page < 1', () => {
    expect(paginationSchema.safeParse({ page: '0' }).success).toBe(false)
  })
})

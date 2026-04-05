import { z } from 'zod'

const STAGE_IDS = [
  'post-lesson',
  'hook-sent',
  '2-week',
  '4-week',
  '8-week',
  'video-received',
  'approved',
  'deployed',
] as const

const PLATFORMS = ['instagram', 'youtube', 'website', 'tiktok'] as const

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120, 'Name too long').trim(),
  email: z.string().email('Invalid email address').max(254).trim().optional().or(z.literal('')),
  lesson_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format')
    .refine((d) => !isNaN(new Date(d).getTime()), 'Invalid date'),
  stage: z.enum(STAGE_IDS).default('post-lesson'),
  notes: z.string().max(2000).optional(),
})

export const updateStudentSchema = z.object({
  name: z.string().min(1).max(120).trim().optional(),
  email: z.string().email().max(254).trim().optional().or(z.literal('')),
  lesson_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((d) => !isNaN(new Date(d).getTime()))
    .optional(),
  stage: z.enum(STAGE_IDS).optional(),
  notes: z.string().max(2000).optional(),
  testimonial_text: z.string().max(5000).optional(),
  platforms: z.array(z.enum(PLATFORMS)).optional(),
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  search: z.string().max(200).optional(),
  stage: z.enum(STAGE_IDS).optional(),
})

export type CreateStudentInput = z.infer<typeof createStudentSchema>
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>
export type PaginationInput = z.infer<typeof paginationSchema>

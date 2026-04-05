export type StageId =
  | 'post-lesson'
  | 'hook-sent'
  | '2-week'
  | '4-week'
  | '8-week'
  | 'video-received'
  | 'approved'
  | 'deployed'

export type Platform = 'instagram' | 'youtube' | 'website' | 'tiktok'

export type ActivityClass = 'g' | 'y' | 'b' | 'p'

export interface Stage {
  id: StageId
  label: string
  color: string
}

export interface Student {
  id: string
  user_id: string
  name: string
  email: string | null
  lesson_date: string // ISO date string YYYY-MM-DD
  stage: StageId
  notes: string | null
  testimonial_text: string | null
  platforms: Platform[]
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

export interface Activity {
  id: string
  user_id: string
  student_name: string
  details: string
  icon: string
  cls: ActivityClass
  created_at: string // ISO timestamp
}

export interface Template {
  id: string
  title: string
  stage: string
  subject: string
  body: string
}

// API response shapes
export interface ApiSuccess<T> {
  data: T
  error: null
}

export interface ApiError {
  data: null
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// KPI computed values
export interface KpiMetrics {
  activePipeline: number
  testimonialsThisMonth: number
  conversionRate: number
  avgDaysToTestimonial: number | null
}

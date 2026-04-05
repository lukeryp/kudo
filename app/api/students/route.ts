import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createStudentSchema, paginationSchema } from '@/lib/validations'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'
import type { Student } from '@/types'

// GET /api/students — list students with optional pagination + search
export async function GET(req: NextRequest) {
  const rl = await rateLimit(req, { limit: 120, windowMs: 60_000 })
  if (!rl.success) return rateLimitResponse(rl)

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = paginationSchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  )
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: 'Invalid query parameters' },
      { status: 400 },
    )
  }

  const { page, limit, search, stage } = parsed.data
  const offset = (page - 1) * limit

  let query = supabase
    .from('students')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('lesson_date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  if (stage) {
    query = query.eq('stage', stage)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('[GET /api/students]', error)
    return NextResponse.json({ data: null, error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({
    data: data as Student[],
    error: null,
    meta: {
      total: count ?? 0,
      page,
      limit,
    },
  })
}

// POST /api/students — create a new student
export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, { limit: 30, windowMs: 60_000 })
  if (!rl.success) return rateLimitResponse(rl)

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = createStudentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    )
  }

  const { name, email, lesson_date, stage, notes } = parsed.data

  const { data: student, error } = await supabase
    .from('students')
    .insert({
      user_id: user.id,
      name,
      email: email || null,
      lesson_date,
      stage,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[POST /api/students]', error)
    return NextResponse.json({ data: null, error: 'Failed to create student' }, { status: 500 })
  }

  // Log activity
  await supabase.from('activities').insert({
    user_id: user.id,
    student_name: name,
    details: `Added to pipeline`,
    icon: '👤',
    cls: 'g',
  })

  return NextResponse.json({ data: student as Student, error: null }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateStudentSchema } from '@/lib/validations'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { STAGE_MAP } from '@/lib/constants'
import type { Student } from '@/types'

interface RouteContext {
  params: { id: string }
}

function validateUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

// GET /api/students/:id
export async function GET(req: NextRequest, { params }: RouteContext) {
  if (!validateUuid(params.id)) {
    return NextResponse.json({ data: null, error: 'Invalid ID' }, { status: 400 })
  }

  const rl = await rateLimit(req, { limit: 120, windowMs: 60_000 })
  if (!rl.success) return rateLimitResponse(rl)

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ data: null, error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ data: data as Student, error: null })
}

// PATCH /api/students/:id
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!validateUuid(params.id)) {
    return NextResponse.json({ data: null, error: 'Invalid ID' }, { status: 400 })
  }

  const rl = await rateLimit(req, { limit: 60, windowMs: 60_000 })
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

  const parsed = updateStudentSchema.safeParse(body)
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

  // Fetch existing to check ownership + get current stage
  const { data: existing, error: fetchErr } = await supabase
    .from('students')
    .select('id, stage, name, user_id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (fetchErr || !existing) {
    return NextResponse.json({ data: null, error: 'Not found' }, { status: 404 })
  }

  const updatePayload: Record<string, unknown> = {}
  const updates = parsed.data

  if (updates.name !== undefined) updatePayload['name'] = updates.name
  if (updates.email !== undefined) updatePayload['email'] = updates.email || null
  if (updates.lesson_date !== undefined) updatePayload['lesson_date'] = updates.lesson_date
  if (updates.stage !== undefined) updatePayload['stage'] = updates.stage
  if (updates.notes !== undefined) updatePayload['notes'] = updates.notes || null
  if (updates.testimonial_text !== undefined)
    updatePayload['testimonial_text'] = updates.testimonial_text || null
  if (updates.platforms !== undefined) updatePayload['platforms'] = updates.platforms

  const { data: updated, error: updateErr } = await supabase
    .from('students')
    .update(updatePayload)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (updateErr || !updated) {
    console.error('[PATCH /api/students/:id]', updateErr)
    return NextResponse.json({ data: null, error: 'Update failed' }, { status: 500 })
  }

  // Log stage change activity
  if (updates.stage && updates.stage !== existing.stage) {
    const newStageName = STAGE_MAP[updates.stage]?.label ?? updates.stage
    await supabase.from('activities').insert({
      user_id: user.id,
      student_name: existing.name as string,
      details: `moved to ${newStageName}`,
      icon: '📋',
      cls: 'b',
    })
  }

  return NextResponse.json({ data: updated as Student, error: null })
}

// DELETE /api/students/:id
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!validateUuid(params.id)) {
    return NextResponse.json({ data: null, error: 'Invalid ID' }, { status: 400 })
  }

  const rl = await rateLimit(req, { limit: 30, windowMs: 60_000 })
  if (!rl.success) return rateLimitResponse(rl)

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch name before delete for activity log
  const { data: existing } = await supabase
    .from('students')
    .select('name')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) {
    console.error('[DELETE /api/students/:id]', error)
    return NextResponse.json({ data: null, error: 'Delete failed' }, { status: 500 })
  }

  if (existing) {
    await supabase.from('activities').insert({
      user_id: user.id,
      student_name: existing.name as string,
      details: 'removed from pipeline',
      icon: '🗑️',
      cls: 'y',
    })
  }

  return NextResponse.json({ data: { id: params.id }, error: null })
}

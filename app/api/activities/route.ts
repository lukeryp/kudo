import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'
import type { Activity } from '@/types'

// GET /api/activities — list recent activities for the authenticated user
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

  const limitParam = req.nextUrl.searchParams.get('limit')
  const limit = Math.min(100, Math.max(1, parseInt(limitParam ?? '30', 10) || 30))

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[GET /api/activities]', error)
    return NextResponse.json({ data: null, error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ data: data as Activity[], error: null })
}

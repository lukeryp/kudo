import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

// GET /api/export — download all student data as JSON
export async function GET(req: NextRequest) {
  const rl = await rateLimit(req, { limit: 10, windowMs: 60_000 })
  if (!rl.success) return rateLimitResponse(rl)

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const [studentsResult, activitiesResult] = await Promise.all([
    supabase.from('students').select('*').eq('user_id', user.id),
    supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  const exportData = {
    exported_at: new Date().toISOString(),
    version: '1.0.0',
    students: studentsResult.data ?? [],
    activities: activitiesResult.data ?? [],
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="kudo-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  })
}

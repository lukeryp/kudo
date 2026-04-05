import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { computeKpiMetrics } from '@/lib/utils'
import { ACTIVE_STAGES } from '@/lib/constants'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { Topbar } from '@/components/layout/Topbar'
import type { Activity, Student } from '@/types'

async function getDashboardData() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { students: [] as Student[], activities: [] as Activity[] }
  }

  const [studentsResult, activitiesResult] = await Promise.all([
    supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  return {
    students: (studentsResult.data ?? []) as Student[],
    activities: (activitiesResult.data ?? []) as Activity[],
  }
}

function KpiSkeleton() {
  return (
    <div
      className="h-[110px] animate-pulse rounded-[16px]"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    />
  )
}

async function DashboardContent() {
  const { students, activities } = await getDashboardData()
  const kpi = computeKpiMetrics(students)
  const activeStudents = students.filter((s) => ACTIVE_STAGES.includes(s.stage))

  return (
    <>
      {/* KPI Grid */}
      <div className="mb-7 grid grid-cols-4 gap-[14px]">
        <KpiCard
          label="Active Pipeline"
          value={kpi.activePipeline}
          sub="Students in progress"
          valueColor="var(--green)"
          ring={{
            stroke: 'var(--green)',
            percent: Math.min(100, kpi.activePipeline * 10),
          }}
        />
        <KpiCard
          label="Testimonials This Month"
          value={kpi.testimonialsThisMonth}
          sub="Received + approved"
          valueColor="var(--yellow)"
          ring={{
            stroke: 'var(--yellow)',
            percent: Math.min(100, kpi.testimonialsThisMonth * 20),
          }}
        />
        <KpiCard
          label="Conversion Rate"
          value={`${kpi.conversionRate}%`}
          sub="Lessons → testimonials"
        />
        <KpiCard
          label="Avg Days to Testimonial"
          value={kpi.avgDaysToTestimonial ?? '—'}
          sub="From lesson to receipt"
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-[22px]" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* Active students */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div
                className="text-[15px] font-extrabold"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                Active Students
              </div>
              <div className="mt-[2px] text-[11px]" style={{ color: 'var(--text-d)' }}>
                Currently in the pipeline
              </div>
            </div>
            <Link href="/pipeline" className="btn btn-ghost text-[11px]">
              View Pipeline →
            </Link>
          </div>

          {activeStudents.length === 0 ? (
            <div
              className="rounded-[12px] px-5 py-10 text-center text-[12px]"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-d)',
              }}
            >
              <div className="mb-2 text-[24px]">🏌️</div>
              No active students yet.{' '}
              <span style={{ color: 'var(--green)', cursor: 'pointer' }}>Add one</span> to start
              your pipeline.
            </div>
          ) : (
            <div className="grid gap-[10px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {activeStudents.map((s) => (
                <DashboardClient key={s.id} student={s} />
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div>
          <div
            className="mb-4 text-[15px] font-extrabold"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            Activity Feed
          </div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" />
      <div className="flex-1 p-8">
        <Suspense
          fallback={
            <div className="mb-7 grid grid-cols-4 gap-[14px]">
              {Array.from({ length: 4 }).map((_, i) => (
                <KpiSkeleton key={i} />
              ))}
            </div>
          }
        >
          <DashboardContent />
        </Suspense>
      </div>
    </>
  )
}

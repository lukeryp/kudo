import type { Activity } from '@/types'
import { fmtRelative } from '@/lib/utils'

const CLS_COLORS: Record<string, string> = {
  g: 'rgba(0,175,81,0.14)',
  y: 'rgba(244,238,25,0.14)',
  b: 'rgba(100,150,255,0.14)',
  p: 'rgba(180,100,255,0.14)',
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div
        className="rounded-[16px] p-[18px]"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="py-8 text-center text-[12px]" style={{ color: 'var(--text-d)' }}>
          <div className="mb-[10px] text-[18px]">⚡</div>
          No activity yet.
        </div>
      </div>
    )
  }

  return (
    <div
      className="max-h-[460px] overflow-y-auto rounded-[16px] p-[18px]"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {activities.map((act) => (
        <div
          key={act.id}
          className="flex gap-[11px] py-[9px]"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div
            className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full text-[13px]"
            style={{ background: CLS_COLORS[act.cls] ?? CLS_COLORS['g'] }}
          >
            {act.icon}
          </div>
          <div>
            <div className="text-[12px] leading-[1.45]">
              <strong style={{ color: 'var(--green)' }}>{act.student_name}</strong>{' '}
              {act.details}
            </div>
            <div className="mt-[2px] text-[10px]" style={{ color: 'var(--text-d)' }}>
              {fmtRelative(act.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

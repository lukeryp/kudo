'use client'

import type { Student } from '@/types'
import { daysSince, fmtDate, getDayBadgeVariant } from '@/lib/utils'
import { STAGE_MAP } from '@/lib/constants'

const BADGE_STYLES: Record<ReturnType<typeof getDayBadgeVariant>, React.CSSProperties> = {
  green: { background: 'rgba(0,175,81,0.14)', color: 'var(--green)' },
  yellow: { background: 'rgba(244,238,25,0.14)', color: 'var(--yellow)' },
  red: { background: 'rgba(255,80,80,0.14)', color: '#ff5252' },
}

interface ActiveStudentCardProps {
  student: Student
  onClick: (id: string) => void
}

export function ActiveStudentCard({ student, onClick }: ActiveStudentCardProps) {
  const days = daysSince(student.lesson_date)
  const variant = getDayBadgeVariant(days)
  const stage = STAGE_MAP[student.stage]

  return (
    <div
      className="cursor-pointer rounded-[12px] px-[14px] py-3 transition-all duration-[220ms] animate-fadeUp"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
      }}
      onClick={() => onClick(student.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-g)'
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.35)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div className="mb-1 text-[13px] font-semibold">{student.name}</div>
      <div
        className="mb-[6px] flex items-center gap-[5px] text-[10px]"
        style={{ color: 'var(--text-m)' }}
      >
        <span
          className="inline-block h-[6px] w-[6px] rounded-full flex-shrink-0"
          style={{ background: stage?.color ?? 'var(--green)' }}
        />
        {stage?.label ?? student.stage} · {fmtDate(student.lesson_date)}
      </div>
      <span
        className="inline-block rounded-[20px] px-[7px] py-[2px] text-[10px] font-bold"
        style={BADGE_STYLES[variant]}
      >
        {days}d since lesson
      </span>
    </div>
  )
}

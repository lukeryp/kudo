'use client'

import { useState, useOptimistic, useTransition } from 'react'
import type { Student, StageId } from '@/types'
import { STAGES } from '@/lib/constants'
import { daysSince, fmtDate, getDayBadgeVariant } from '@/lib/utils'
import { StudentDetailModal } from '../students/StudentDetailModal'
import { showToast } from '../ui/Toast'

const BADGE_STYLES: Record<ReturnType<typeof getDayBadgeVariant>, React.CSSProperties> = {
  green: { background: 'rgba(0,175,81,0.14)', color: 'var(--green)' },
  yellow: { background: 'rgba(244,238,25,0.14)', color: 'var(--yellow)' },
  red: { background: 'rgba(255,80,80,0.14)', color: '#ff5252' },
}

interface KanbanBoardProps {
  initialStudents: Student[]
}

async function moveStudentStage(studentId: string, stage: StageId): Promise<void> {
  const res = await fetch(`/api/students/${studentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage }),
  })
  if (!res.ok) throw new Error('Failed to update stage')
}

export function KanbanBoard({ initialStudents }: KanbanBoardProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [optimisticStudents, setOptimistic] = useOptimistic(
    students,
    (current, update: { id: string; stage: StageId }) =>
      current.map((s) => (s.id === update.id ? { ...s, stage: update.stage } : s)),
  )
  const [, startTransition] = useTransition()
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  async function handleStageMove(studentId: string, newStage: StageId) {
    startTransition(async () => {
      setOptimistic({ id: studentId, stage: newStage })
      try {
        await moveStudentStage(studentId, newStage)
        setStudents((prev) =>
          prev.map((s) =>
            s.id === studentId ? { ...s, stage: newStage, updated_at: new Date().toISOString() } : s,
          ),
        )
        const stageName = STAGES.find((s) => s.id === newStage)?.label ?? newStage
        showToast(`Moved to ${stageName}`)
      } catch {
        showToast('Failed to update stage')
      }
    })
  }

  function handleStudentUpdate(updated: Student) {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setSelectedStudent(updated)
  }

  function handleStudentDelete(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id))
    setSelectedStudent(null)
  }

  return (
    <>
      <div
        className="flex gap-[11px] overflow-x-auto pb-3"
        style={{ alignItems: 'flex-start' }}
      >
        {STAGES.map((stage) => {
          const cols = optimisticStudents.filter((s) => s.stage === stage.id)
          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-[16px]"
              style={{
                minWidth: '195px',
                maxWidth: '195px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              {/* Column header */}
              <div
                className="flex items-center justify-between px-[13px] py-[11px] pb-[9px]"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-[7px]">
                  <span
                    className="inline-block h-[7px] w-[7px] flex-shrink-0 rounded-full"
                    style={{ background: stage.color }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-[1px]"
                    style={{ color: 'var(--text)' }}
                  >
                    {stage.label}
                  </span>
                </div>
                <span
                  className="rounded-[20px] px-[7px] py-[1px] text-[10px] font-bold"
                  style={{
                    background: 'var(--glass)',
                    color: 'var(--text-m)',
                  }}
                >
                  {cols.length}
                </span>
              </div>

              {/* Cards */}
              <div
                className="flex flex-col gap-[7px] p-[9px]"
                style={{ minHeight: '160px' }}
              >
                {cols.length === 0 ? (
                  <div
                    className="py-[18px] text-center text-[11px]"
                    style={{ color: 'var(--text-d)' }}
                  >
                    <div className="mb-[5px] text-[18px]">○</div>
                    Empty
                  </div>
                ) : (
                  cols.map((student) => {
                    const days = daysSince(student.lesson_date)
                    const variant = getDayBadgeVariant(days)
                    return (
                      <div
                        key={student.id}
                        className="cursor-pointer rounded-[12px] px-3 py-[11px] transition-all duration-[220ms] animate-fadeUp"
                        style={{
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                        }}
                        onClick={() => setSelectedStudent(student)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-g)'
                          e.currentTarget.style.background = 'var(--surface-3)'
                          e.currentTarget.style.transform = 'translateY(-1px)'
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.35)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)'
                          e.currentTarget.style.background = 'var(--surface-2)'
                          e.currentTarget.style.transform = ''
                          e.currentTarget.style.boxShadow = ''
                        }}
                      >
                        <div className="mb-[5px] text-[13px] font-semibold">{student.name}</div>
                        <div
                          className="mb-[6px] flex items-center gap-[5px] text-[10px]"
                          style={{ color: 'var(--text-m)' }}
                        >
                          <svg
                            width={9}
                            height={9}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <rect x={3} y={4} width={18} height={18} rx={2} />
                            <line x1={16} y1={2} x2={16} y2={6} />
                            <line x1={8} y1={2} x2={8} y2={6} />
                            <line x1={3} y1={10} x2={21} y2={10} />
                          </svg>
                          {fmtDate(student.lesson_date)}
                        </div>
                        <span
                          className="inline-block rounded-[20px] px-[7px] py-[2px] text-[10px] font-bold"
                          style={BADGE_STYLES[variant]}
                        >
                          {days}d
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdate={handleStudentUpdate}
          onDelete={() => handleStudentDelete(selectedStudent.id)}
          onStageMove={handleStageMove}
        />
      )}
    </>
  )
}

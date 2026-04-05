'use client'

import { useState } from 'react'
import type { Student, Platform } from '@/types'
import { fmtDate } from '@/lib/utils'
import { StudentDetailModal } from '../students/StudentDetailModal'

type FilterType = 'all' | 'pending' | Platform

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending Deploy' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'website', label: 'Website' },
  { id: 'tiktok', label: 'TikTok' },
]

const PTAG_STYLES: Record<string, React.CSSProperties> = {
  instagram: {
    background: 'rgba(180,100,255,.18)',
    color: '#b464ff',
    border: '1px solid rgba(180,100,255,.25)',
  },
  youtube: {
    background: 'rgba(255,80,80,.18)',
    color: '#ff5252',
    border: '1px solid rgba(255,80,80,.25)',
  },
  website: {
    background: 'rgba(100,150,255,.18)',
    color: '#6496ff',
    border: '1px solid rgba(100,150,255,.25)',
  },
  tiktok: {
    background: 'rgba(0,240,255,.18)',
    color: '#00f0ff',
    border: '1px solid rgba(0,240,255,.25)',
  },
}

const STAGE_BADGE: Record<string, { label: string; style: React.CSSProperties }> = {
  'video-received': {
    label: 'Video Received',
    style: { background: 'rgba(180,100,255,0.2)', color: '#b464ff' },
  },
  approved: {
    label: 'Approved',
    style: { background: 'rgba(0,175,81,0.2)', color: 'var(--green)' },
  },
  deployed: {
    label: 'Deployed',
    style: { background: 'rgba(244,238,25,0.18)', color: 'var(--yellow)' },
  },
}

interface LibraryClientProps {
  initialTestimonials: Student[]
}

export function LibraryClient({ initialTestimonials }: LibraryClientProps) {
  const [testimonials, setTestimonials] = useState<Student[]>(initialTestimonials)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selected, setSelected] = useState<Student | null>(null)

  const filtered = testimonials.filter((s) => {
    if (filter === 'all') return true
    if (filter === 'pending') return s.platforms.length === 0
    return s.platforms.includes(filter as Platform)
  })

  function handleUpdate(updated: Student) {
    setTestimonials((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setSelected(updated)
  }

  function handleDelete(id: string) {
    setTestimonials((prev) => prev.filter((s) => s.id !== id))
    setSelected(null)
  }

  return (
    <>
      {/* Filter bar */}
      <div className="mb-[22px] flex flex-wrap gap-[7px]">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="rounded-[20px] border px-[14px] py-[5px] text-[11px] font-semibold transition-all duration-200"
            style={
              filter === f.id
                ? {
                    background: 'rgba(0,175,81,0.14)',
                    borderColor: 'rgba(0,175,81,0.35)',
                    color: 'var(--green)',
                  }
                : {
                    background: 'var(--glass)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-m)',
                  }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="py-12 text-center text-[12px]"
          style={{ color: 'var(--text-d)' }}
        >
          <div className="mb-2 text-[28px]">🎬</div>
          No testimonials match this filter.
        </div>
      ) : (
        <div
          className="grid gap-[14px]"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(275px, 1fr))' }}
        >
          {filtered.map((student) => {
            const stageBadge = STAGE_BADGE[student.stage]
            const hasPlatforms = student.platforms.length > 0

            return (
              <div
                key={student.id}
                className="cursor-pointer overflow-hidden rounded-[16px] transition-all duration-[280ms] animate-fadeUp"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
                onClick={() => setSelected(student)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-g)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-g)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                {/* Thumbnail */}
                <div
                  className="relative flex h-[155px] w-full items-center justify-center overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #071810 0%, #0b2318 55%, #051210 100%)',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 50%, rgba(0,175,81,0.12), transparent 65%)',
                    }}
                  />
                  {/* Play button */}
                  <div
                    className="relative z-[1] flex h-[46px] w-[46px] items-center justify-center rounded-full"
                    style={{
                      background: 'rgba(0,175,81,0.18)',
                      border: '2px solid rgba(0,175,81,0.5)',
                      color: 'var(--green)',
                    }}
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>

                  {/* Stage badge */}
                  {stageBadge && (
                    <div
                      className="absolute right-[10px] top-[10px] rounded-[20px] px-2 py-[3px] text-[9px] font-bold"
                      style={{
                        background: 'rgba(0,0,0,0.65)',
                        ...stageBadge.style,
                      }}
                    >
                      {stageBadge.label}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-[15px]">
                  <div
                    className="mb-[3px] text-[14px] font-bold"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                  >
                    {student.name}
                  </div>
                  <div
                    className="mb-[9px] text-[10px]"
                    style={{ color: 'var(--text-m)' }}
                  >
                    {fmtDate(student.updated_at)}
                  </div>

                  {student.testimonial_text && (
                    <div
                      className="mb-[9px] max-h-[42px] overflow-hidden text-[11px] leading-[1.55]"
                      style={{ color: 'var(--text-m)' }}
                    >
                      &ldquo;{student.testimonial_text}&rdquo;
                    </div>
                  )}

                  {/* Platform tags */}
                  <div className="flex flex-wrap gap-[5px]">
                    {hasPlatforms ? (
                      student.platforms.map((p) => (
                        <span
                          key={p}
                          className="rounded-[20px] px-[7px] py-[2px] text-[9px] font-bold uppercase tracking-[0.4px]"
                          style={PTAG_STYLES[p]}
                        >
                          {p}
                        </span>
                      ))
                    ) : (
                      <span
                        className="rounded-[20px] px-[7px] py-[2px] text-[9px] font-bold uppercase"
                        style={{
                          background: 'rgba(244,238,25,.16)',
                          color: 'var(--yellow)',
                          border: '1px solid rgba(244,238,25,.22)',
                        }}
                      >
                        Pending Deploy
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <StudentDetailModal
          student={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}

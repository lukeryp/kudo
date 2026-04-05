'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const nav = [
  {
    section: 'Overview',
    items: [
      {
        href: '/',
        label: 'Dashboard',
        icon: (
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x={3} y={3} width={7} height={7} rx={1} />
            <rect x={14} y={3} width={7} height={7} rx={1} />
            <rect x={3} y={14} width={7} height={7} rx={1} />
            <rect x={14} y={14} width={7} height={7} rx={1} />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Pipeline',
    items: [
      {
        href: '/pipeline',
        label: 'Student Pipeline',
        badge: true,
        icon: (
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x={2} y={7} width={5} height={14} rx={1} />
            <rect x={9.5} y={4} width={5} height={17} rx={1} />
            <rect x={17} y={2} width={5} height={19} rx={1} />
          </svg>
        ),
      },
      {
        href: '/library',
        label: 'Testimonial Library',
        icon: (
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x={1} y={5} width={15} height={14} rx={2} />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Tools',
    items: [
      {
        href: '/templates',
        label: 'Email Templates',
        icon: (
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        ),
      },
    ],
  },
]

interface SidebarProps {
  activePipelineCount?: number
}

export function Sidebar({ activePipelineCount = 0 }: SidebarProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="fixed left-0 top-0 bottom-0 z-[100] flex flex-col"
      style={{
        width: '230px',
        minHeight: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-[22px] pb-[18px]"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="text-[24px] font-black tracking-[-1px]"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Ku<span style={{ color: 'var(--green)' }}>do</span>
        </div>
        <div
          className="mt-[3px] text-[9px] uppercase tracking-[2.5px]"
          style={{ color: 'var(--text-d)' }}
        >
          RYP Golf · Proof of Work
        </div>
      </div>

      {/* Nav sections */}
      <div className="flex-1 overflow-y-auto py-2">
        {nav.map((section) => (
          <div key={section.section} className="px-3 pb-1 pt-[10px]">
            <div
              className="px-2 mb-[6px] text-[9px] uppercase tracking-[2px] font-medium"
              style={{ color: 'var(--text-d)' }}
            >
              {section.section}
            </div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-[10px] rounded-[10px] px-3 py-[10px] text-[13px] font-medium mb-[2px] border transition-all duration-200',
                  isActive(item.href)
                    ? 'border-[rgba(0,175,81,0.18)] text-green-DEFAULT'
                    : 'border-transparent hover:text-white',
                )}
                style={
                  isActive(item.href)
                    ? {
                        background: 'rgba(0,175,81,0.13)',
                        color: 'var(--green)',
                      }
                    : {
                        color: 'var(--text-m)',
                      }
                }
              >
                <span style={{ opacity: isActive(item.href) ? 1 : 0.7 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && activePipelineCount > 0 && (
                  <span
                    className="ml-auto min-w-[18px] rounded-[20px] px-[7px] py-[1px] text-center text-[10px] font-bold text-black"
                    style={{ background: 'var(--green)' }}
                  >
                    {activePipelineCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <a
          href="/api/export"
          download="kudo-export.json"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[9px] px-0 py-[9px] text-[12px] font-medium transition-all duration-200"
          style={{
            background: 'var(--glass)',
            border: '1px solid var(--border)',
            color: 'var(--text-m)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-g)'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-m)'
          }}
        >
          <svg
            width={13}
            height={13}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1={12} y1={15} x2={12} y2={3} />
          </svg>
          Export JSON
        </a>
      </div>
    </nav>
  )
}

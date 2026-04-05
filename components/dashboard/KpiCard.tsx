interface KpiCardProps {
  label: string
  value: string | number
  sub: string
  valueColor?: string
  ring?: {
    stroke: string
    percent: number // 0-100
  }
}

const RING_CIRCUMFERENCE = 81.68 // 2π × 13

export function KpiCard({ label, value, sub, valueColor, ring }: KpiCardProps) {
  const ringOffset = ring
    ? RING_CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, ring.percent / 100)))
    : RING_CIRCUMFERENCE

  return (
    <div
      className="relative overflow-hidden rounded-[16px] px-5 pb-4 pt-5 transition-all duration-300"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-g)'
        e.currentTarget.style.boxShadow = 'var(--shadow-g)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, var(--green), transparent)' }}
      />

      <div
        className="mb-[10px] text-[10px] uppercase tracking-[2px]"
        style={{ color: 'var(--text-m)' }}
      >
        {label}
      </div>
      <div
        className="text-[38px] font-black leading-none"
        style={{ fontFamily: 'Raleway, sans-serif', color: valueColor ?? 'var(--text)' }}
      >
        {value}
      </div>
      <div className="mt-[6px] text-[11px]" style={{ color: 'var(--text-d)' }}>
        {sub}
      </div>

      {ring && (
        <div className="absolute bottom-3 right-[14px] opacity-70">
          <svg
            width={38}
            height={38}
            viewBox="0 0 38 38"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx={19}
              cy={19}
              r={13}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={3}
            />
            <circle
              cx={19}
              cy={19}
              r={13}
              fill="none"
              stroke={ring.stroke}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
              style={{ transition: 'stroke-dashoffset 0.9s ease' }}
            />
          </svg>
        </div>
      )}
    </div>
  )
}

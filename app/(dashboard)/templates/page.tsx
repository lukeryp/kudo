import { Topbar } from '@/components/layout/Topbar'
import { TemplatesClient } from '@/components/templates/TemplatesClient'

export default function TemplatesPage() {
  return (
    <>
      <Topbar title="Email Templates" />
      <div className="p-8">
        <p
          className="mb-[22px] max-w-[640px] text-[12px] leading-[1.7]"
          style={{ color: 'var(--text-m)' }}
        >
          Pre-written emails for every stage of The Last Lesson Proof of Work Protocol. When
          viewing a student&apos;s detail, templates auto-populate with their name.
        </p>
        <TemplatesClient />
      </div>
    </>
  )
}

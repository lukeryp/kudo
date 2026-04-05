import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { LibraryClient } from '@/components/library/LibraryClient'
import { Topbar } from '@/components/layout/Topbar'
import type { Student } from '@/types'
import { TESTIMONIAL_STAGES } from '@/lib/constants'

async function getTestimonials(): Promise<Student[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', user.id)
    .in('stage', TESTIMONIAL_STAGES)
    .order('updated_at', { ascending: false })

  return (data ?? []) as Student[]
}

async function LibraryContent() {
  const testimonials = await getTestimonials()
  return <LibraryClient initialTestimonials={testimonials} />
}

export default function LibraryPage() {
  return (
    <>
      <Topbar title="Testimonial Library" />
      <div className="p-8">
        <Suspense
          fallback={
            <div className="text-[12px]" style={{ color: 'var(--text-d)' }}>
              Loading library…
            </div>
          }
        >
          <LibraryContent />
        </Suspense>
      </div>
    </>
  )
}

import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { KanbanBoard } from '@/components/pipeline/KanbanBoard'
import { PipelineClient } from '@/components/pipeline/PipelineClient'
import type { Student } from '@/types'

async function getPipelineStudents(): Promise<Student[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', user.id)
    .order('lesson_date', { ascending: false })

  return (data ?? []) as Student[]
}

async function PipelineContent() {
  const students = await getPipelineStudents()
  return <KanbanBoard initialStudents={students} />
}

export default function PipelinePage() {
  return (
    <>
      <PipelineClient />
      <div className="p-8 pt-0">
        <p className="mb-5 text-[12px]" style={{ color: 'var(--text-m)' }}>
          Click any card to view details and move between stages
        </p>
        <Suspense
          fallback={
            <div className="text-[12px]" style={{ color: 'var(--text-d)' }}>
              Loading pipeline…
            </div>
          }
        >
          <PipelineContent />
        </Suspense>
      </div>
    </>
  )
}

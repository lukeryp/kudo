import { Suspense } from 'react'
import { Sidebar } from './Sidebar'
import { createClient } from '@/lib/supabase/server'
import { ACTIVE_STAGES } from '@/lib/constants'

async function getActivePipelineCount(): Promise<number> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return 0

    const { count } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('stage', ACTIVE_STAGES)

    return count ?? 0
  } catch {
    return 0
  }
}

async function SidebarWithCount() {
  const count = await getActivePipelineCount()
  return <Sidebar activePipelineCount={count} />
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Suspense fallback={<Sidebar activePipelineCount={0} />}>
        <SidebarWithCount />
      </Suspense>
      <main
        className="flex min-h-screen flex-1 flex-col"
        style={{ marginLeft: '230px' }}
      >
        {children}
      </main>
    </div>
  )
}

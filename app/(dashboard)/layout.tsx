import { DashboardShell } from '@/components/layout/DashboardShell'
import { Toast } from '@/components/ui/Toast'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      {children}
      <Toast />
    </DashboardShell>
  )
}

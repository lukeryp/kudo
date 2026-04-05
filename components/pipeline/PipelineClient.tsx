'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Topbar } from '../layout/Topbar'
import { AddStudentModal } from '../students/AddStudentModal'

export function PipelineClient() {
  const [showAdd, setShowAdd] = useState(false)
  const router = useRouter()

  return (
    <>
      <Topbar
        title="Student Pipeline"
        onAddStudent={() => setShowAdd(true)}
      />
      {showAdd && (
        <AddStudentModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

'use client'

import { useState } from 'react'
import { Topbar } from '../layout/Topbar'
import { AddStudentModal } from '../students/AddStudentModal'

export function PipelineClient() {
  const [showAdd, setShowAdd] = useState(false)

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
            // Revalidate via router refresh
            window.location.reload()
          }}
        />
      )}
    </>
  )
}

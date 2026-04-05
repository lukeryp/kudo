'use client'

import { useState } from 'react'
import type { Student } from '@/types'
import { ActiveStudentCard } from './ActiveStudentCard'
import { StudentDetailModal } from '../students/StudentDetailModal'

interface DashboardClientProps {
  student: Student
}

export function DashboardClient({ student }: DashboardClientProps) {
  const [detailStudent, setDetailStudent] = useState<Student | null>(null)

  return (
    <>
      <ActiveStudentCard student={student} onClick={() => setDetailStudent(student)} />
      {detailStudent && (
        <StudentDetailModal
          student={detailStudent}
          onClose={() => setDetailStudent(null)}
          onUpdate={(updated) => setDetailStudent(updated)}
          onDelete={() => setDetailStudent(null)}
        />
      )}
    </>
  )
}

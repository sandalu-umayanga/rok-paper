import ProtectedRoute from '@/components/ProtectedRoutes'
import React from 'react'

const finance = () => {
  return (
    <ProtectedRoute allowedRoles={["FINANCE", "ADMIN"]}>
      <div>finance</div>
    </ProtectedRoute>
  )
}

export default finance
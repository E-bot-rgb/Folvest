import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  if (adminOnly) {
    try {
      const role = JSON.parse(atob(token.split('.')[1])).role
      if (role !== 'Admin') return <Navigate to="/dashboard" replace />
    } catch {
      return <Navigate to="/login" replace />
    }
  }
  return children
}

export default ProtectedRoute
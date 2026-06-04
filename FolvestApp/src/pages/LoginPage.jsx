import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'
import './Auth.css'

function LoginPage() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch {
      setError('Fel email eller lösenord.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">F</div>
        <h1 className="auth-title">Logga in</h1>
        <p className="auth-sub">Välkommen tillbaka till Folvest</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input className="auth-input" type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="din@email.se" required />
          </label>
          <label className="auth-label">
            Lösenord
            <input className="auth-input" type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
        <p className="auth-switch">Inget konto? <Link to="/register">Registrera dig</Link></p>
      </div>
    </div>
  )
}

export default LoginPage
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register, login } from '../api/auth'
import './Auth.css'

function RegisterPage() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError('Lösenorden matchar inte.'); return }
    setLoading(true)
    try {
      await register(email, password)
      const res = await login(email, password)
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch {
      setError('Något gick fel. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">F</div>
        <h1 className="auth-title">Skapa konto</h1>
        <p className="auth-sub">Börja handla aktier idag</p>
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
          <label className="auth-label">
            Bekräfta lösenord
            <input className="auth-input" type="password" value={confirm}
              onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Skapar konto...' : 'Registrera'}
          </button>
        </form>
        <p className="auth-switch">Har du redan ett konto? <Link to="/login">Logga in</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage

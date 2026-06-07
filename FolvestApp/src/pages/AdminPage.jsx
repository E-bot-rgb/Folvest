import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { deleteTransaction } from '../api/portfolio'
import './AdminPage.css'

function fmt(n) {
  return Number(n).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function AdminPage() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [msg, setMsg]           = useState(null)

  const fetchUsers = async () => {
    try {
      const res = await client.get('/admin/users')
      setUsers(res.data)
    } catch {
      setError('Kunde inte hämta användare. Är du inloggad som Admin?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (txId) => {
    if (!window.confirm('Ta bort transaktion?')) return
    setDeleting(txId)
    setMsg(null)
    try {
      await deleteTransaction(txId)
      setMsg('Transaktion borttagen.')
      fetchUsers()
    } catch {
      setMsg('Kunde inte ta bort transaktionen.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="admin-wrap">
      <nav className="dash-nav">
        <div className="nav-logo">Folvest <span className="admin-badge">Admin</span></div>
        <Link to="/dashboard" className="nav-link">← Tillbaka</Link>
      </nav>

      <div className="admin-content">
        <h1 className="admin-title">Adminpanel</h1>
        <p className="admin-sub">Alla användares portföljer och transaktioner</p>

        {msg && <div className="admin-msg">{msg}</div>}

        {loading && <div className="dash-loading"><div className="spinner"/><p>Laddar...</p></div>}
        {error   && <div className="admin-error">{error}</div>}

        {!loading && !error && users.length === 0 && (
          <div className="empty-state">Inga användare hittades.</div>
        )}

        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div>
                <div className="user-email">{user.email}</div>
                <div className="user-meta">
                  Saldo: <strong>{fmt(user.portfolio?.balance ?? 0)} SEK</strong>
                  &nbsp;·&nbsp;
                  {user.portfolio?.transactions?.length ?? 0} transaktioner
                </div>
              </div>
              <span className={`role-badge ${user.role?.toLowerCase()}`}>{user.role}</span>
            </div>

            {user.portfolio?.transactions?.length > 0 && (
              <div className="tx-table-wrap" style={{marginTop: 16}}>
                <table className="tx-table">
                  <thead>
                    <tr><th>ID</th><th>Symbol</th><th>Typ</th><th>Antal</th><th>Pris</th><th>Datum</th><th></th></tr>
                  </thead>
                  <tbody>
                    {user.portfolio.transactions.map(t => (
                      <tr key={t.id}>
                        <td className="tx-date">#{t.id}</td>
                        <td className="tx-symbol">{t.symbol}</td>
                        <td>
                          <span className={`tx-badge ${t.type === 'Buy' ? 'buy' : 'sell'}`}>
                            {t.type === 'Buy' ? 'Köp' : 'Sälj'}
                          </span>
                        </td>
                        <td>{t.quantity}</td>
                        <td className="tx-date">{fmt(t.priceAtPurchase)} SEK</td>
                        <td className="tx-date">{new Date(t.createdAt).toLocaleDateString('sv-SE')}</td>
                        <td>
                          <button
                            className="del-btn"
                            onClick={() => handleDelete(t.id)}
                            disabled={deleting === t.id}
                          >
                            {deleting === t.id ? '...' : 'Ta bort'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
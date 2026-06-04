import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getPortfolio, buyStock, sellStock } from '../api/portfolio'
import { getStock } from '../api/stocks'
import { getRole, logout } from '../api/auth'
import './Dashboard.css'

function computeHoldings(transactions = []) {
  const map = {}
  for (const t of transactions) {
    if (!map[t.symbol]) map[t.symbol] = { symbol: t.symbol, quantity: 0, totalCost: 0 }
    if (t.type === 'Buy') {
      map[t.symbol].quantity += t.quantity
      map[t.symbol].totalCost += t.quantity * t.priceAtPurchase
    } else {
      map[t.symbol].quantity -= t.quantity
      map[t.symbol].totalCost -= t.quantity * t.priceAtPurchase
    }
  }
  return Object.values(map).filter(h => h.quantity > 0)
}

function fmt(n) {
  return Number(n).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Dashboard() {
  const [portfolio, setPortfolio]         = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [symbol, setSymbol]               = useState('')
  const [price, setPrice]                 = useState('')
  const [quantity, setQuantity]           = useState('')
  const [tradeError, setTradeError]       = useState(null)
  const [tradeMsg, setTradeMsg]           = useState(null)
  const [tradeLoading, setTradeLoading]   = useState(false)
  const [stockData, setStockData]         = useState(null)
  const [stockLoading, setStockLoading]   = useState(false)
  const [stockError, setStockError]       = useState(null)
  const navigate = useNavigate()
  const isAdmin = getRole() === 'Admin'

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await getPortfolio()
      setPortfolio(res.data)
    } catch {
      setError('Kunde inte hämta portfölj.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPortfolio() }, [fetchPortfolio])

  const handleSearchStock = async () => {
    if (!symbol) return
    setStockLoading(true)
    setStockData(null)
    setStockError(null)
    try {
      const res = await getStock(symbol.toUpperCase())
      setStockData(res.data)
      setPrice(res.data.price)
    } catch {
      setStockError('Aktie hittades inte.')
    } finally {
      setStockLoading(false)
    }
  }

  const handleTrade = async (type) => {
    setTradeError(null); setTradeMsg(null)
    if (!symbol || !price || !quantity) { setTradeError('Fyll i alla fält.'); return }
    setTradeLoading(true)
    try {
      const fn = type === 'buy' ? buyStock : sellStock
      const res = await fn(symbol.toUpperCase(), parseInt(quantity), parseFloat(price))
      setTradeMsg(res.data.message)
      setSymbol(''); setPrice(''); setQuantity(''); setStockData(null)
      fetchPortfolio()
    } catch (err) {
      setTradeError(err.response?.data || 'Något gick fel.')
    } finally {
      setTradeLoading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  if (loading) return <div className="dash-loading"><div className="spinner"/><p>Hämtar portfölj...</p></div>
  if (error)   return <div className="dash-loading"><p style={{color:'var(--red)'}}>{error}</p></div>

  const holdings = computeHoldings(portfolio?.transactions)
  const balance  = portfolio?.balance ?? 0

  return (
    <div className="dash-wrap">
      <nav className="dash-nav">
        <div className="nav-logo">Folvest</div>
        <div className="nav-links">
          {isAdmin && <Link to="/admin" className="nav-link nav-admin">Admin</Link>}
          <button className="nav-logout" onClick={handleLogout}>Logga ut</button>
        </div>
      </nav>

      <div className="dash-content">
        <div className="balance-card">
          <div className="balance-label">Tillgängligt saldo</div>
          <div className="balance-amount">{fmt(balance)} <span>SEK</span></div>
          <div className="balance-sub">{holdings.length} aktiepositioner</div>
        </div>

        <section className="section">
          <h2 className="section-title">Ditt innehav</h2>
          {holdings.length === 0
            ? <div className="empty-state">Du äger inga aktier ännu. Köp din första nedan!</div>
            : <div className="holdings-grid">
                {holdings.map(h => (
                  <div className="holding-card" key={h.symbol}>
                    <div className="holding-ticker">{h.symbol}</div>
                    <div className="holding-qty">{h.quantity} st</div>
                    <div className="holding-price">Snitt: {fmt(h.totalCost / h.quantity)} SEK</div>
                    <div className="holding-value">Värde: {fmt(h.quantity * (h.totalCost / h.quantity))} SEK</div>
                  </div>
                ))}
              </div>
          }
        </section>

        <section className="section">
          <h2 className="section-title">Köp & Sälj</h2>
          <div className="trade-card">

            {/* Aktiesökning */}
            <div className="stock-search">
              <div className="search-row">
                <input
                  className="trade-input"
                  value={symbol}
                  onChange={e => { setSymbol(e.target.value); setStockData(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleSearchStock()}
                  placeholder="Sök symbol, t.ex. AAPL"
                />
                <button className="search-btn" onClick={handleSearchStock} disabled={stockLoading}>
                  {stockLoading ? '...' : 'Hämta pris'}
                </button>
              </div>
              {stockError && <p className="trade-error">{stockError}</p>}
              {stockData && (
                <div className="stock-result">
                  <span className="stock-symbol">{stockData.symbol}</span>
                  <span className="stock-price">${stockData.price}</span>
                  <span className={`stock-change ${parseFloat(stockData.change) >= 0 ? 'pos' : 'neg'}`}>
                    {parseFloat(stockData.change) >= 0 ? '+' : ''}{stockData.changePercent}
                  </span>
                </div>
              )}
            </div>

            <div className="trade-fields">
              <label className="trade-label">Pris per aktie (SEK)
                <input className="trade-input" type="number" min="0" step="0.01"
                  value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
              </label>
              <label className="trade-label">Antal
                <input className="trade-input" type="number" min="1" step="1"
                  value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="1" />
              </label>
            </div>

            {price && quantity && (
              <div className="trade-total">Total: <strong>{fmt(parseFloat(price||0) * parseInt(quantity||0))} SEK</strong></div>
            )}
            {tradeError && <p className="trade-error">{tradeError}</p>}
            {tradeMsg   && <p className="trade-success">{tradeMsg}</p>}
            <div className="trade-btns">
              <button className="trade-btn buy"  onClick={() => handleTrade('buy')}  disabled={tradeLoading || !symbol}>{tradeLoading ? '...' : 'Köp'}</button>
              <button className="trade-btn sell" onClick={() => handleTrade('sell')} disabled={tradeLoading || !symbol}>{tradeLoading ? '...' : 'Sälj'}</button>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Transaktionshistorik</h2>
          {!portfolio?.transactions?.length
            ? <div className="empty-state">Inga transaktioner ännu.</div>
            : <div className="tx-table-wrap">
                <table className="tx-table">
                  <thead><tr><th>Symbol</th><th>Typ</th><th>Antal</th><th>Pris</th><th>Totalt</th><th>Datum</th></tr></thead>
                  <tbody>
                    {[...portfolio.transactions].reverse().map(t => (
                      <tr key={t.id}>
                        <td className="tx-symbol">{t.symbol}</td>
                        <td><span className={`tx-badge ${t.type === 'Buy' ? 'buy' : 'sell'}`}>{t.type === 'Buy' ? 'Köp' : 'Sälj'}</span></td>
                        <td>{t.quantity}</td>
                        <td>{fmt(t.priceAtPurchase)} SEK</td>
                        <td>{fmt(t.quantity * t.priceAtPurchase)} SEK</td>
                        <td className="tx-date">{new Date(t.createdAt).toLocaleDateString('sv-SE')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </section>
      </div>
    </div>
  )
}

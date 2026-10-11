import React, { useState, useEffect } from 'react'
import { getHistory, getScanDetail, clearHistory, getStats } from '../api'
import HistoryCard from '../components/HistoryCard'
import ResultPanel from '../components/ResultPanel'
import { Clock, Trash2, ChevronLeft, Search, Download, BarChart2, ShieldAlert, CheckCircle2 } from 'lucide-react'

export default function HistoryPage() {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHistory()
    fetchStats()
  }, [])

  async function fetchHistory() {
    setLoading(true)
    try {
      const res = await getHistory(50)
      setItems(res.data)
    } catch {
      setError('Could not load history. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  async function fetchStats() {
    try {
      const res = await getStats()
      setStats(res.data)
    } catch (e) {
      console.warn('Could not load stats:', e)
    }
  }

  function handleExport() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `scamshield_history_${new Date().toISOString().slice(0,10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  async function openDetail(item) {
    setSelected(item)
    setDetailLoading(true)
    try {
      const res = await getScanDetail(item.id)
      setDetail(res.data)
    } catch {
      setDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleClear() {
    if (!window.confirm('Clear all scan history?')) return
    await clearHistory()
    setItems([])
    setSelected(null)
    setDetail(null)
    fetchStats()
  }

  const filtered = items.filter(i =>
    i.input_preview.toLowerCase().includes(search.toLowerCase()) ||
    i.risk_level.includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 16px 60px' }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={22} style={{ color: '#22d3ee' }} /> Scan History & Intelligence
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', marginTop: 4 }}>
            {items.length} previous scan{items.length !== 1 ? 's' : ''} stored locally
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {items.length > 0 && (
            <>
              <button className="btn-ghost" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22d3ee', borderColor: 'rgba(34,211,238,0.3)' }}>
                <Download size={14} /> Export JSON
              </button>
              <button className="btn-ghost" onClick={handleClear} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                <Trash2 size={14} /> Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Metrics Cards ───────────────────────────────────────────────── */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div className="card" style={{ padding: '14px 16px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Audits</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>{stats.total_scans}</div>
          </div>
          <div className="card" style={{ padding: '14px 16px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Critical Threats</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', marginTop: 4 }}>{stats.critical_count}</div>
          </div>
          <div className="card" style={{ padding: '14px 16px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suspicious / High</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: 4 }}>{stats.high_count}</div>
          </div>
          <div className="card" style={{ padding: '14px 16px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div style={{ fontSize: '0.75rem', color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Safe Verifications</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#22c55e', marginTop: 4 }}>{stats.safe_count}</div>
          </div>
        </div>
      )}

      {selected ? (
        /* ── Detail view ──────────────────────────────────────────────── */
        <div>
          <button className="btn-ghost" onClick={() => { setSelected(null); setDetail(null) }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            <ChevronLeft size={16} /> Back to history
          </button>
          {detailLoading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div className="radar" style={{ margin: '0 auto 20px' }} />
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading result…</p>
            </div>
          ) : detail ? (
            <ResultPanel result={detail} />
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Could not load this scan.</p>
          )}
        </div>
      ) : (
        /* ── List view ────────────────────────────────────────────────── */
        <div>
          {items.length > 0 && (
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: 40 }}
                placeholder="Filter by content or risk level…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div className="radar" style={{ margin: '0 auto 20px' }} />
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>{error}</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <Clock size={40} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 16px', display: 'block' }} />
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.95rem' }}>
                {items.length === 0 ? 'No scans yet. Run your first analysis!' : 'No results match your filter.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(item => (
                <HistoryCard key={item.id} item={item} onClick={() => openDetail(item)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

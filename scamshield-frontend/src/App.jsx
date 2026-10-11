import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import ScanPage from './pages/ScanPage'
import HistoryPage from './pages/HistoryPage'
import DemoPage from './pages/DemoPage'
import LearnPage from './pages/LearnPage'
import { Shield, Scan, Clock, FlaskConical, BookOpen, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',       label: 'Scanner',    icon: Scan },
  { to: '/history', label: 'History',   icon: Clock },
  { to: '/demo',    label: 'Demo',      icon: FlaskConical },
  { to: '/learn',   label: 'Learn',     icon: BookOpen },
]

function Sidebar({ open, onClose }) {
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'rgba(13,19,33,0.95)',
      borderRight: '1px solid rgba(99,179,237,0.1)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, bottom: 0, left: 0,
      zIndex: 100,
      transform: open ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(8,145,178,0.4), rgba(168,85,247,0.3))',
            border: '1px solid rgba(34,211,238,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={20} style={{ color: '#22d3ee' }} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
              Scam<span style={{ color: '#22d3ee' }}>Shield</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Threat Detector
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
          Navigation
        </div>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to} end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            onClick={onClose}
            style={{ display: 'flex', textDecoration: 'none', marginBottom: 4 }}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
          ScamShield v1.0<br />
          Evidence-based threat detection<br />
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>Vedathon 2.0 entry</span>
        </div>
      </div>
    </aside>
  )
}

function TopBar({ onMenu }) {
  const location = useLocation()
  const current = NAV_ITEMS.find(n => n.to === location.pathname || (n.to !== '/' && location.pathname.startsWith(n.to)))
  const Icon = current?.icon ?? Shield
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: 56,
      background: 'rgba(8,11,20,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(99,179,237,0.1)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14,
    }}>
      <button onClick={onMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center' }}>
        <Menu size={22} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Shield size={18} style={{ color: '#22d3ee' }} />
        <span style={{ fontWeight: 800, fontSize: '1rem' }}>Scam<span style={{ color: '#22d3ee' }}>Shield</span></span>
      </div>
      {current && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <Icon size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)' }}>{current.label}</span>
        </div>
      )}
    </header>
  )
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      {/* Ambient glows */}
      <div style={{ position: 'fixed', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <TopBar onMenu={() => setSidebarOpen(o => !o)} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <main style={{ paddingTop: 56, paddingLeft: 0, minHeight: '100vh', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Routes>
            <Route path="/"        element={<ScanPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/demo"    element={<DemoPage />} />
            <Route path="/learn"   element={<LearnPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

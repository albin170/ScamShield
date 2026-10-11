import React from 'react'
import { getRiskMeta, formatDate, truncate } from '../utils'
import { Link2, MessageSquare, ChevronRight, Clock } from 'lucide-react'

/**
 * History list item card.
 */
export default function HistoryCard({ item, onClick }) {
  const meta = getRiskMeta(item.risk_level)
  const Icon = item.scan_type === 'url' ? Link2 : MessageSquare

  return (
    <div
      className="glass"
      onClick={onClick}
      style={{
        borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      {/* Type icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${meta.color}18`,
        border: `1px solid ${meta.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} style={{ color: meta.color }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className={`tag severity-${item.risk_level}`}>{meta.label}</span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>
            {item.scan_type}
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {truncate(item.input_preview, 65)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Clock size={11} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{formatDate(item.created_at)}</span>
        </div>
      </div>

      {/* Score badge */}
      <div style={{
        fontWeight: 700, fontSize: '1.1rem',
        color: meta.color, flexShrink: 0,
      }}>
        {item.risk_score}
        <span style={{ fontSize: '0.65rem', opacity: 0.5, marginLeft: 1 }}>/100</span>
      </div>

      <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
    </div>
  )
}

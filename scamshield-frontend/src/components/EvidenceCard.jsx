import React from 'react'
import { getSeverityMeta } from '../utils'
import { ChevronRight } from 'lucide-react'

/**
 * Single evidence card explaining one signal.
 */
export default function EvidenceCard({ evidence, index }) {
  const meta = getSeverityMeta(evidence.severity)

  return (
    <div
      className={`evidence-card ${evidence.severity === 'safe' ? 'bg-risk-safe' : `bg-risk-${evidence.severity}`}`}
      style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Severity badge */}
        <span className={`tag ${meta.cls}`} style={{ flexShrink: 0, marginTop: 2 }}>
          {meta.label}
        </span>

        <div style={{ flex: 1 }}>
          {/* Category + signal */}
          {evidence.category && (
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {evidence.category}
            </div>
          )}
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}>
            {evidence.signal}
          </div>

          {/* Matched text snippet */}
          {evidence.matched_text && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,0,0,0.3)', borderRadius: 6,
              padding: '3px 10px', marginBottom: 8,
            }}>
              <ChevronRight size={12} style={{ opacity: 0.5 }} />
              <span className="mono" style={{ fontSize: '0.78rem', color: '#fbbf24' }}>
                "{evidence.matched_text}"
              </span>
            </div>
          )}

          {/* Full explanation */}
          <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            {evidence.explanation}
          </p>
        </div>
      </div>
    </div>
  )
}

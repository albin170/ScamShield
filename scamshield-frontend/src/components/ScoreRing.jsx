import React, { useEffect, useRef } from 'react'
import { getRiskMeta } from '../utils'

/**
 * Animated circular score ring using SVG.
 * Shows the risk score (0-100) with color-coded stroke.
 */
export default function ScoreRing({ score, riskLevel, size = 140 }) {
  const meta = getRiskMeta(riskLevel)
  const radius = (size / 2) - 10
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference
  const circleRef = useRef(null)

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = circumference
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (circleRef.current) {
            circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)'
            circleRef.current.style.strokeDashoffset = dashOffset
          }
        }, 100)
      })
    }
  }, [score, circumference, dashOffset])

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={10}
        />
        {/* Animated progress */}
        <circle
          ref={circleRef}
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={meta.color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ filter: `drop-shadow(0 0 8px ${meta.color}80)` }}
        />
      </svg>
      {/* Centre text */}
      <div style={{
        position: 'absolute',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color: meta.color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.1, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginTop: 2 }}>/ 100</span>
        <span style={{ fontSize: size * 0.09, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{meta.label}</span>
      </div>
    </div>
  )
}

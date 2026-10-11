import React from 'react'
import { Shield, Zap, Eye, BookOpen, AlertTriangle, CheckCircle, Globe, MessageSquare, Link2, Lock } from 'lucide-react'

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="glass" style={{ borderRadius: 14, padding: '22px 20px', transition: 'all 0.2s', cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color + '50' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '' }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 12, background: color + '18', border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        {icon}
      </div>
      <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}

function ThreatType({ icon, title, examples }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}>{title}</h4>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {examples.map((ex, i) => (
            <span key={i} style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {ex}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TipCard({ tip, good }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 10, background: good ? 'rgba(16,185,129,0.06)' : 'rgba(255,45,85,0.06)', border: `1px solid ${good ? 'rgba(16,185,129,0.2)' : 'rgba(255,45,85,0.2)'}` }}>
      {good
        ? <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
        : <AlertTriangle size={16} style={{ color: '#ff2d55', flexShrink: 0, marginTop: 2 }} />
      }
      <span style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>{tip}</span>
    </div>
  )
}

export default function LearnPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 80px' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', paddingTop: 24, marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 20, background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', marginBottom: 16 }}>
          <BookOpen size={32} style={{ color: '#22d3ee' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 900, marginBottom: 10 }}>
          <span className="shimmer-text">Safety Guide</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 520, margin: '0 auto' }}>
          Understand how scammers operate, what signals to look for, and how to protect yourself online.
        </p>
      </div>

      {/* ── What is ScamShield ────────────────────────────────────────── */}
      <div className="glass" style={{ borderRadius: 16, padding: '24px 28px', marginBottom: 28, borderColor: 'rgba(34,211,238,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Shield size={20} style={{ color: '#22d3ee' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>What ScamShield Analyses</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {[
            { icon: <Link2 size={16} style={{ color: '#22d3ee' }} />, label: 'Domain & URL structure', desc: 'Checks for IP hosts, suspicious TLDs, brand impersonation' },
            { icon: <Lock size={16} style={{ color: '#10b981' }} />, label: 'HTTPS & encryption', desc: 'Detects unencrypted HTTP links' },
            { icon: <Globe size={16} style={{ color: '#a855f7' }} />, label: 'Domain signals', desc: 'Entropy, subdomains, open redirects' },
            { icon: <MessageSquare size={16} style={{ color: '#f59e0b' }} />, label: 'Message patterns', desc: 'Urgency, threats, OTP requests, financial lures' },
            { icon: <AlertTriangle size={16} style={{ color: '#f97316' }} />, label: 'Impersonation', desc: 'Fake bank, govt, and tech-support messages' },
            { icon: <Zap size={16} style={{ color: '#ff2d55' }} />, label: 'Social engineering', desc: 'Fear tactics, prize claims, secrecy instructions' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Threat types ─────────────────────────────────────────────── */}
      <div className="glass" style={{ borderRadius: 16, padding: '24px 28px', marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 18 }}>Common Scam Types</h2>
        <ThreatType
          icon={<Eye size={18} style={{ color: '#22d3ee' }} />}
          title="Phishing / Smishing"
          examples={["Fake bank alerts", "Delivery notifications", "Account verification", "Payment failures"]}
        />
        <ThreatType
          icon={<AlertTriangle size={18} style={{ color: '#f97316' }} />}
          title="Tech Support Scams"
          examples={["Fake virus alerts", "Microsoft/Apple calls", "Remote access requests"]}
        />
        <ThreatType
          icon={<Zap size={18} style={{ color: '#f59e0b' }} />}
          title="Lottery & Prize Scams"
          examples={["KBC lottery", "Lucky winner SMS", "Prize claim fees"]}
        />
        <ThreatType
          icon={<Globe size={18} style={{ color: '#a855f7' }} />}
          title="Government Impersonation"
          examples={["Tax refund", "Aadhaar verification", "Legal notice"]}
        />
        <ThreatType
          icon={<Link2 size={18} style={{ color: '#ff2d55' }} />}
          title="Fake Websites"
          examples={["Lookalike domains", "Counterfeit shopping", "Fake login pages"]}
        />
      </div>

      {/* ── DOs and DON'Ts ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 14, color: '#10b981', display: 'flex', gap: 8, alignItems: 'center' }}>
            <CheckCircle size={18} /> Do
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Hover over links before clicking to see the actual destination.',
              'Go directly to the official website by typing the address.',
              'Enable two-factor authentication on all accounts.',
              'Report suspicious messages to your bank or telecom provider.',
              'Verify requests through official phone numbers from the real website.',
              'Use ScamShield to analyse suspicious URLs and messages.',
            ].map((tip, i) => <TipCard key={i} tip={tip} good={true} />)}
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 14, color: '#ff2d55', display: 'flex', gap: 8, alignItems: 'center' }}>
            <AlertTriangle size={18} /> Don't
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Never share OTPs, PINs, or passwords — not even with "customer service".',
              'Don\'t click links in unsolicited SMS messages or emails.',
              'Don\'t trust caller ID or email sender names alone — they can be faked.',
              'Don\'t pay fees to claim a prize. Legitimate prizes have no upfront cost.',
              'Don\'t act under pressure. Urgency is a manipulation tactic.',
              'Don\'t assume HTTPS means a site is safe — scammers use HTTPS too.',
            ].map((tip, i) => <TipCard key={i} tip={tip} good={false} />)}
          </div>
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 16 }}>How ScamShield Works</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        <FeatureCard icon={<Eye size={20} style={{ color: '#22d3ee' }} />} title="Evidence-First Results" color="#22d3ee"
          desc="Every warning shows the exact signal that triggered it — not just a number. You know why something is suspicious." />
        <FeatureCard icon={<Shield size={20} style={{ color: '#10b981' }} />} title="Zero URL Fetching" color="#10b981"
          desc="Your submitted URLs are never opened by the server, eliminating SSRF risk and protecting the backend." />
        <FeatureCard icon={<AlertTriangle size={20} style={{ color: '#f59e0b' }} />} title="Transparent Uncertainty" color="#f59e0b"
          desc="ScamShield tells you what it doesn't know. Every result includes clear limitations so you can make informed decisions." />
        <FeatureCard icon={<Zap size={20} style={{ color: '#a855f7' }} />} title="No API Dependencies" color="#a855f7"
          desc="Core detection works entirely offline. No paid APIs, no rate limits, no single point of failure." />
      </div>
    </div>
  )
}

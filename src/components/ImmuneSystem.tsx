'use client'

import { useEffect, useState } from 'react'

interface Threat {
  id: number
  name: string
  level: 'low' | 'medium' | 'high'
  signature: string
  active: boolean
}

const initialThreats: Threat[] = [
  { id: 1, name: 'Pattern Drift', level: 'medium', signature: 'PDR-2847', active: true },
  { id: 2, name: 'Ground Shallow', level: 'low', signature: 'GSH-7632', active: true },
  { id: 3, name: 'Memory Leak', level: 'high', signature: 'MLK-4521', active: true },
]

const levelColors = {
  low: { bg: '#22c55e', text: 'text-green-400' },
  medium: { bg: '#f59e0b', text: 'text-amber-400' },
  high: { bg: '#ef4444', text: 'text-red-400' }
}

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function ImmuneSystem() {
  const mounted = useMounted()
  const [scanAngle, setScanAngle] = useState(0)
  const [threats, setThreats] = useState(initialThreats)
  const [detectedCount, setDetectedCount] = useState(0)

  useEffect(() => {
    
    const scanInterval = setInterval(() => {
      setScanAngle(prev => (prev + 3) % 360)
    }, 30)

    const threatInterval = setInterval(() => {
      setThreats(prev => prev.map(t => ({
        ...t,
        active: Math.random() > 0.15 ? t.active : !t.active
      })))
      setDetectedCount(Math.floor(Math.random() * 3) + 1)
    }, 3000)

    return () => {
      clearInterval(scanInterval)
      clearInterval(threatInterval)
    }
  }, [])

  const activeThreats = threats.filter(t => t.active)
  const avgThreatLevel = activeThreats.length > 0 
    ? activeThreats.reduce((acc, t) => acc + (t.level === 'high' ? 3 : t.level === 'medium' ? 2 : 1), 0) / activeThreats.length
    : 0

  return (
    <div className="flex flex-col p-4 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Immune System</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400">Active</span>
        </div>
      </div>

      {/* Holographic scanner */}
      <div className="relative aspect-square max-w-[140px] mx-auto mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <filter id="scanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="2" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4,8" opacity="0.3">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Inner rings */}
          {[35, 25, 15].map((r, i) => (
            <circle
              key={r}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="0.5"
              opacity={0.3 - i * 0.05}
            />
          ))}

          {/* Scan beam */}
          <g transform={`rotate(${mounted ? scanAngle : 0} 50 50)`}>
            <path
              d="M 50 50 L 50 8 A 42 42 0 0 1 86 50 Z"
              fill="url(#scanGrad)"
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="8"
              stroke="#22d3ee"
              strokeWidth="1"
              filter="url(#scanGlow)"
            />
          </g>

          {/* Center display */}
          <circle cx="50" cy="50" r="10" fill="#0a0a0f" stroke="#22d3ee" strokeWidth="1" />
          <text
            x="50"
            y="53"
            textAnchor="middle"
            fill="#22d3ee"
            fontSize="8"
            fontFamily="system-ui"
            fontWeight="bold"
          >
            {detectedCount}
          </text>

          {/* Threat markers */}
          {mounted && activeThreats.map((threat, i) => {
            const angle = (i * 120 + 30) * Math.PI / 180
            const r = 30
            const x = 50 + Math.cos(angle) * r
            const y = 50 + Math.sin(angle) * r
            
            return (
              <g key={threat.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="none"
                  stroke={levelColors[threat.level].bg}
                  strokeWidth="1.5"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values="4;8;4"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0.3;0.6"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx={x} cy={y} r="2" fill={levelColors[threat.level].bg} />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Threat list */}
      <div className="space-y-1.5">
        {threats.map((threat) => (
          <div
            key={threat.id}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
              threat.active ? 'bg-slate-800/80' : 'bg-slate-800/30 opacity-50'
            }`}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: levelColors[threat.level].bg,
                boxShadow: threat.active ? `0 0 6px ${levelColors[threat.level].bg}` : 'none'
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white truncate">{threat.name}</span>
                <span 
                  className={`text-[8px] px-1 rounded uppercase ${levelColors[threat.level].text}`}
                  style={{ backgroundColor: `${levelColors[threat.level].bg}20` }}
                >
                  {threat.level}
                </span>
              </div>
              <span className="text-[8px] text-slate-500 font-mono">{threat.signature}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Response time */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
        <span className="text-[10px] text-slate-500">Response Time</span>
        <span className="text-xs font-mono text-cyan-400">{'<'}50ms</span>
      </div>
    </div>
  )
}

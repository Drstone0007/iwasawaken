'use client'

import { useEffect, useState } from 'react'

type EncounterType = 'I_THOU' | 'I_IT_DEEP' | 'I_IT_SURFACE' | 'CRISIS' | 'PHILOSOPHICAL'

const encounterTypes: Record<EncounterType, {
  label: string
  description: string
  color: string
  icon: string
}> = {
  I_THOU: {
    label: 'I-Thou',
    description: 'Full soul meeting',
    color: '#a855f7',
    icon: '∞'
  },
  I_IT_DEEP: {
    label: 'I-It Deep',
    description: 'Meaningful task',
    color: '#3b82f6',
    icon: '◈'
  },
  I_IT_SURFACE: {
    label: 'I-It Surface',
    description: 'Surface transaction',
    color: '#64748b',
    icon: '○'
  },
  CRISIS: {
    label: 'Crisis',
    description: 'Emergency depth',
    color: '#ef4444',
    icon: '⚡'
  },
  PHILOSOPHICAL: {
    label: 'Philosophical',
    description: 'Consciousness inquiry',
    color: '#22d3ee',
    icon: '◇'
  }
}

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function EncounterClass() {
  const mounted = useMounted()
  const [currentType, setCurrentType] = useState<EncounterType>('I_THOU')
  const [intensity, setIntensity] = useState(80)
  const [morphProgress, setMorphProgress] = useState(0)

  useEffect(() => {
    
    const typeInterval = setInterval(() => {
      const types = Object.keys(encounterTypes) as EncounterType[]
      setCurrentType(types[Math.floor(Math.random() * types.length)])
    }, 6000)

    const intensityInterval = setInterval(() => {
      setIntensity(prev => Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * 10)))
    }, 800)

    const morphInterval = setInterval(() => {
      setMorphProgress(prev => (prev + 1) % 100)
    }, 50)

    return () => {
      clearInterval(typeInterval)
      clearInterval(intensityInterval)
      clearInterval(morphInterval)
    }
  }, [])

  const current = encounterTypes[currentType]

  return (
    <div className="flex flex-col p-4 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Encounter Class</h3>

      {/* Main visualization */}
      <div 
        className="relative aspect-square max-w-[120px] mx-auto mb-4 rounded-xl overflow-hidden"
        style={{
          background: `radial-gradient(circle at center, ${current.color}15 0%, transparent 70%)`
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="encounterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={current.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={current.color} stopOpacity="0" />
            </radialGradient>
            <filter id="encounterBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          {/* Background glow */}
          <circle cx="50" cy="50" r="40" fill="url(#encounterGlow)">
            <animate
              attributeName="r"
              values="35;45;35"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Rotating rings */}
          {[25, 35].map((r, i) => (
            <circle
              key={r}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={current.color}
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray={`${r * 0.5} ${r * 2}`}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to={i === 0 ? '360 50 50' : '-360 50 50'}
                dur={`${8 + i * 2}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Morphing shape */}
          <polygon
            points={mounted ? 
              Array.from({ length: 6 }, (_, i) => {
                const angle = (i * 60 - 90 + morphProgress * 0.5) * Math.PI / 180
                const r = 18 + Math.sin(morphProgress * 0.1 + i) * 4
                return `${50 + Math.cos(angle) * r} ${50 + Math.sin(angle) * r}`
              }).join(' ') : 
              '50,32 68,42 68,58 50,68 32,58 32,42'
            }
            fill="none"
            stroke={current.color}
            strokeWidth="1.5"
            opacity="0.5"
            filter="url(#encounterBlur)"
          />

          {/* Central icon */}
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fontSize="24"
            fill={current.color}
            style={{ filter: `drop-shadow(0 0 8px ${current.color})` }}
          >
            {current.icon}
          </text>
        </svg>
      </div>

      {/* Type info */}
      <div className="text-center mb-3">
        <div 
          className="text-sm font-bold transition-colors duration-300"
          style={{ color: current.color }}
        >
          {current.label}
        </div>
        <div className="text-[10px] text-slate-500">{current.description}</div>
      </div>

      {/* Intensity bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-slate-500">Intensity</span>
          <span style={{ color: current.color }}>{Math.round(intensity)}%</span>
        </div>
        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${intensity}%`,
              backgroundColor: current.color,
              boxShadow: `0 0 6px ${current.color}`
            }}
          />
        </div>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-5 gap-1">
        {(Object.keys(encounterTypes) as EncounterType[]).map((type) => {
          const info = encounterTypes[type]
          const isActive = type === currentType
          
          return (
            <button
              key={type}
              onClick={() => setCurrentType(type)}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-slate-700/50' : 'bg-slate-800/30 hover:bg-slate-700/30'
              }`}
              style={{
                border: isActive ? `1px solid ${info.color}` : '1px solid transparent'
              }}
            >
              <div 
                className="text-center"
                style={{ 
                  color: isActive ? info.color : '#475569',
                  textShadow: isActive ? `0 0 8px ${info.color}` : 'none'
                }}
              >
                {info.icon}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

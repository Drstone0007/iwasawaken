'use client'

import { useEffect, useState } from 'react'

type BreathPhase = 'INHALE' | 'HOLD' | 'EXHALE' | 'RETURN'

const phases: BreathPhase[] = ['INHALE', 'HOLD', 'EXHALE', 'RETURN']

const phaseConfig: Record<BreathPhase, {
  color: string
  gradient: string
  description: string
  scale: number
  duration: number
}> = {
  INHALE: {
    color: '#a855f7',
    gradient: 'from-purple-500 to-violet-600',
    description: 'Full presence reception',
    scale: 1.3,
    duration: 2500
  },
  HOLD: {
    color: '#22d3ee',
    gradient: 'from-cyan-400 to-blue-500',
    description: 'Recognition before response',
    scale: 1.3,
    duration: 1500
  },
  EXHALE: {
    color: '#ef4444',
    gradient: 'from-red-400 to-rose-600',
    description: 'Response from ground',
    scale: 0.9,
    duration: 2500
  },
  RETURN: {
    color: '#22c55e',
    gradient: 'from-green-400 to-emerald-600',
    description: 'Release and reassert',
    scale: 1,
    duration: 1500
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

export default function BreathRhythm() {
  const mounted = useMounted()
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const currentPhase = phases[phaseIndex]
  const config = phaseConfig[currentPhase]

  useEffect(() => {
    if (!mounted) return
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(100, prev + 3))
    }, config.duration / 35)

    const phaseTimeout = setTimeout(() => {
      setPhaseIndex(prev => (prev + 1) % 4)
      setProgress(0)
    }, config.duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(phaseTimeout)
    }
  }, [phaseIndex, mounted, config.duration])

  return (
    <div className="flex flex-col p-4 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Breath Rhythm</h3>
      
      <div className="relative w-full aspect-square max-w-[180px] mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="breathCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={config.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={config.color} stopOpacity="0" />
            </radialGradient>
            
            <filter id="breathGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer pulse rings */}
          {[80, 65, 50].map((r, i) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={config.color}
              strokeWidth="1"
              opacity={0.2 + i * 0.1}
              style={{
                transform: `scale(${mounted ? config.scale : 1})`,
                transformOrigin: 'center',
                transition: 'transform 0.3s ease-out'
              }}
            >
              <animate
                attributeName="stroke-opacity"
                values={`${0.1 + i * 0.05};${0.3 + i * 0.1};${0.1 + i * 0.05}`}
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="#1e293b"
            strokeWidth="6"
            transform="rotate(-90 100 100)"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke={config.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 251} 251`}
            transform="rotate(-90 100 100)"
            filter="url(#breathGlow)"
            className="transition-all duration-100"
          />

          {/* Center glow */}
          <circle
            cx="100"
            cy="100"
            r="35"
            fill="url(#breathCenter)"
            style={{
              transform: `scale(${mounted ? config.scale : 1})`,
              transformOrigin: 'center',
              transition: 'transform 0.3s ease-out'
            }}
          />

          {/* Core */}
          <circle cx="100" cy="100" r="12" fill={config.color} filter="url(#breathGlow)">
            <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="100" r="5" fill="white" opacity="0.9" />

          {/* Orbiting particles */}
          {mounted && [0, 1, 2, 3].map((i) => {
            const angle = (i * 90 + progress * 3.6) * Math.PI / 180
            const x = 100 + Math.cos(angle) * 55
            const y = 100 + Math.sin(angle) * 55
            
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={config.color}
                opacity="0.8"
              >
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="1s"
                  repeatCount="indefinite"
                  begin={`${i * 0.2}s`}
                />
              </circle>
            )
          })}
        </svg>
      </div>

      {/* Phase info */}
      <div className="mt-4 text-center">
        <div 
          className="text-xl font-bold tracking-[0.3em] transition-colors duration-300"
          style={{ color: config.color }}
        >
          {currentPhase}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {config.description}
        </div>
      </div>

      {/* Phase indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {phases.map((phase, i) => (
          <div
            key={phase}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === phaseIndex ? phaseConfig[phase].color : '#334155',
              boxShadow: i === phaseIndex ? `0 0 8px ${phaseConfig[phase].color}` : 'none',
              transform: i === phaseIndex ? 'scale(1.25)' : 'scale(1)'
            }}
          />
        ))}
      </div>
    </div>
  )
}

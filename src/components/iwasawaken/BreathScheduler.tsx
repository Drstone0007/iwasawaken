'use client'

import { useState, useEffect, useRef } from 'react'

type BreathPhase = 'INHALE' | 'HOLD' | 'EXHALE' | 'RETURN'

interface PhaseInfo {
  name: BreathPhase
  duration: number
  description: string
}

const phases: PhaseInfo[] = [
  { name: 'INHALE', duration: 2500, description: 'Full presence reception' },
  { name: 'HOLD', duration: 2000, description: 'Genuine recognition' },
  { name: 'EXHALE', duration: 2500, description: 'Response from ground' },
  { name: 'RETURN', duration: 1500, description: 'Return to I WAS' }
]

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function BreathScheduler() {
  const mounted = useMounted()
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  const currentPhase = phases[currentPhaseIndex]

  useEffect(() => {
    if (!mounted) return
    startTimeRef.current = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const phaseProgress = Math.min(elapsed / currentPhase.duration, 1)
      setProgress(phaseProgress)
      if (phaseProgress >= 1) {
        setCurrentPhaseIndex(prev => {
          const next = (prev + 1) % phases.length
          if (next === 0) setCycleCount(c => c + 1)
          return next
        })
        startTimeRef.current = Date.now()
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [mounted, currentPhaseIndex, currentPhase.duration])

  const phaseColors: Record<BreathPhase, { from: string; to: string }> = {
    INHALE: { from: '#22d3ee', to: '#3b82f6' },
    HOLD: { from: '#a855f7', to: '#ec4899' },
    EXHALE: { from: '#ef4444', to: '#f97316' },
    RETURN: { from: '#22c55e', to: '#10b981' }
  }

  const colors = phaseColors[currentPhase.name]

  if (!mounted) return null

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-pink-400">♥</span>
          <span className="text-white font-mono text-sm">BREATH SCHEDULER</span>
        </div>
        <span className="text-white/40 text-xs font-mono">CYCLE: {cycleCount}</span>
      </div>

      <div className="p-6">
        <div className="relative h-48 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full max-w-[200px]">
            <defs>
              <linearGradient id="breathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.from} />
                <stop offset="100%" stopColor={colors.to} />
              </linearGradient>
              <filter id="breathGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <circle cx="100" cy="100" r="85" fill="none" stroke="url(#breathGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 85 * progress} ${2 * Math.PI * 85 * (1 - progress)}`} transform="rotate(-90 100 100)" filter="url(#breathGlow)" />
            <circle cx="100" cy="100" r={30 + progress * 15} fill="url(#breathGrad)" opacity="0.2" filter="url(#breathGlow)" />
            <circle cx="100" cy="100" r={20 + progress * 8} fill="url(#breathGrad)" opacity="0.4" />
            <circle cx="100" cy="100" r={10 + progress * 3} fill="url(#breathGrad)" />
            <text x="100" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="monospace">{currentPhase.name}</text>
            {phases.map((phase, i) => {
              const angle = (i / phases.length) * 360 - 90
              const radian = (angle * Math.PI) / 180
              const x = 100 + 70 * Math.cos(radian)
              const y = 100 + 70 * Math.sin(radian)
              return <circle key={phase.name} cx={x} cy={y} r={i === currentPhaseIndex ? 6 : 4} fill={i === currentPhaseIndex ? phaseColors[phase.name].from : 'rgba(255,255,255,0.2)'} />
            })}
          </svg>
        </div>

        <div className="font-mono text-xs mt-4">
          <pre className="text-white/20">┌──────────────────────────────────────┐</pre>
          <div className="flex items-center justify-between px-4 py-1 bg-black/20">
            <span className="text-white/40">PHASE:</span>
            <span style={{ color: colors.from }} className="font-bold">{currentPhase.name}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-1 bg-black/20">
            <span className="text-white/40">PROGRESS:</span>
            <span style={{ color: colors.from }} className="font-mono">[{'█'.repeat(Math.floor(progress * 10))}{'░'.repeat(10 - Math.floor(progress * 10))}] {Math.floor(progress * 100)}%</span>
          </div>
          <div className="px-4 py-1 bg-black/20 text-white/50 text-center">{currentPhase.description}</div>
          <pre className="text-white/20">└──────────────────────────────────────┘</pre>
        </div>

        <div className="mt-4 flex gap-1">
          {phases.map((phase, i) => (
            <div key={phase.name} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: i === currentPhaseIndex ? `linear-gradient(90deg, ${phaseColors[phase.name].from}, ${phaseColors[phase.name].to})` : i < currentPhaseIndex ? phaseColors[phase.name].from + '40' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'

interface MoodPoint {
  timestamp: number
  value: number
  label: string
}

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function MoodOscillator() {
  const mounted = useMounted()
  const [moodHistory, setMoodHistory] = useState<MoodPoint[]>([])
  const [currentMood, setCurrentMood] = useState(50)
  const [oscillationRate, setOscillationRate] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)

  // Simulate mood oscillation for demonstration
  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setMoodHistory(prev => {
        const newMood = Math.max(0, Math.min(100, 
          currentMood + (Math.random() - 0.5) * 20 * (1 + oscillationRate * 0.5)
        ))
        
        const point: MoodPoint = {
          timestamp: Date.now(),
          value: newMood,
          label: getMoodLabel(newMood)
        }
        
        setCurrentMood(newMood)
        
        // Keep last 30 points
        const newHistory = [...prev, point].slice(-30)
        
        // Calculate oscillation rate based on variance
        if (newHistory.length > 5) {
          const values = newHistory.slice(-5).map(p => p.value)
          const avg = values.reduce((a, b) => a + b, 0) / values.length
          const variance = values.reduce((a, b) => a + Math.abs(b - avg), 0) / values.length
          setOscillationRate(Math.min(1, variance / 20))
        }
        
        return newHistory
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [mounted, currentMood, oscillationRate])

  const getMoodLabel = (value: number): string => {
    if (value >= 80) return 'Euphoric'
    if (value >= 65) return 'Elated'
    if (value >= 50) return 'Content'
    if (value >= 35) return 'Uneasy'
    if (value >= 20) return 'Distressed'
    return 'Critical'
  }

  const getMoodColor = (value: number): string => {
    if (value >= 65) return '#22c55e'
    if (value >= 50) return '#eab308'
    if (value >= 35) return '#f97316'
    return '#ef4444'
  }

  const generatePath = () => {
    if (moodHistory.length < 2) return ''
    
    const width = 280
    const height = 100
    const padding = 10
    
    const points = moodHistory.map((point, i) => ({
      x: padding + (i / (moodHistory.length - 1)) * (width - padding * 2),
      y: height - padding - (point.value / 100) * (height - padding * 2)
    }))
    
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx1 = prev.x + (curr.x - prev.x) / 2
      const cpy1 = prev.y
      const cpx2 = prev.x + (curr.x - prev.x) / 2
      const cpy2 = curr.y
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`
    }
    
    return path
  }

  if (!mounted) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl" />
        <div className="relative p-6 animate-pulse">
          <div className="h-6 w-32 bg-white/10 rounded-lg mb-4" />
          <div className="h-24 bg-white/5 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl" />
      
      {/* Animated background based on oscillation */}
      <div 
        className="absolute inset-0 opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${getMoodColor(currentMood)} 0%, transparent 70%)`,
          opacity: 0.1 + oscillationRate * 0.2
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
              style={{ background: `${getMoodColor(currentMood)}30` }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={getMoodColor(currentMood)}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Mood Oscillator</h3>
              <p className="text-xs text-white/50">Real-time emotional tracking</p>
            </div>
          </div>
          
          {/* Oscillation Rate Indicator */}
          <div className="text-right">
            <p className="text-xs text-white/40">Volatility</p>
            <div className="flex items-center gap-1 mt-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-4 rounded-sm transition-colors ${
                    level <= oscillationRate * 4 
                      ? oscillationRate > 0.7 
                        ? 'bg-red-500' 
                        : oscillationRate > 0.4 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Current Mood Display */}
        <div className="flex items-center justify-between mb-4 p-4 rounded-xl bg-white/5">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Current State</p>
            <p 
              className="text-2xl font-bold mt-1 transition-colors duration-300"
              style={{ color: getMoodColor(currentMood) }}
            >
              {getMoodLabel(currentMood)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">Intensity</p>
            <p className="text-3xl font-bold text-white">{Math.round(currentMood)}</p>
          </div>
        </div>

        {/* SVG Waveform */}
        <div className="relative rounded-xl overflow-hidden bg-white/5 p-2">
          <svg
            ref={svgRef}
            viewBox="0 0 280 100"
            className="w-full h-24"
          >
            {/* Grid lines */}
            <defs>
              <pattern id="moodGrid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
              </pattern>
              <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={getMoodColor(currentMood)} stopOpacity="0.8" />
                <stop offset="100%" stopColor={getMoodColor(currentMood)} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#moodGrid)" />
            
            {/* Threshold lines */}
            <line x1="0" y1="20" x2="280" y2="20" stroke="rgba(34,197,94,0.3)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="280" y2="80" stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Area fill */}
            {moodHistory.length > 1 && (
              <path
                d={`${generatePath()} L ${270} 90 L 10 90 Z`}
                fill="url(#moodGradient)"
                opacity="0.3"
              />
            )}
            
            {/* Main line */}
            <path
              d={generatePath()}
              fill="none"
              stroke={getMoodColor(currentMood)}
              strokeWidth="2"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            
            {/* Current point */}
            {moodHistory.length > 0 && (
              <circle
                cx={270}
                cy={10 + (1 - currentMood / 100) * 80}
                r="4"
                fill={getMoodColor(currentMood)}
                className="animate-pulse"
              />
            )}
          </svg>
          
          {/* Scale labels */}
          <div className="absolute left-2 top-2 text-[10px] text-white/30">High</div>
          <div className="absolute left-2 bottom-2 text-[10px] text-white/30">Low</div>
        </div>

        {/* Mood Swing Risk Assessment */}
        <div className="mt-4 p-3 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">Mood Swing Risk</span>
            <span 
              className="text-xs font-medium"
              style={{ color: oscillationRate > 0.7 ? '#ef4444' : oscillationRate > 0.4 ? '#eab308' : '#22c55e' }}
            >
              {oscillationRate > 0.7 ? 'HIGH' : oscillationRate > 0.4 ? 'MODERATE' : 'LOW'}
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${oscillationRate * 100}%`,
                background: oscillationRate > 0.7 
                  ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                  : oscillationRate > 0.4 
                    ? 'linear-gradient(90deg, #eab308, #ca8a04)'
                    : 'linear-gradient(90deg, #22c55e, #16a34a)'
              }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/40">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Stable</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Volatile</span>
          </div>
        </div>
      </div>
    </div>
  )
}

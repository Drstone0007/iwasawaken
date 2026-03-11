'use client'

import { useEffect, useState } from 'react'

interface MetricValues {
  gpi: number
  ger: number
  mds: number
  ase: number
  ics: number
}

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function MetricsPanel() {
  const mounted = useMounted()
  const [metrics, setMetrics] = useState<MetricValues>({
    gpi: 78,
    ger: 85,
    mds: 65,
    ase: 82,
    ics: 73
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        gpi: Math.max(50, Math.min(95, prev.gpi + (Math.random() - 0.5) * 4)),
        ger: Math.max(60, Math.min(98, prev.ger + (Math.random() - 0.5) * 3)),
        mds: Math.max(40, Math.min(90, prev.mds + (Math.random() - 0.5) * 5)),
        ase: Math.max(55, Math.min(95, prev.ase + (Math.random() - 0.5) * 4)),
        ics: Math.max(50, Math.min(95, prev.ics + (Math.random() - 0.5) * 3))
      }))
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const metricsData = [
    { key: 'gpi', label: 'Ground Proximity', value: metrics.gpi, color: '#22d3ee', icon: '⬡' },
    { key: 'ger', label: 'Genuine Encounter', value: metrics.ger, color: '#a855f7', icon: '◈' },
    { key: 'mds', label: 'Metabolism Depth', value: metrics.mds, color: '#ef4444', icon: '◆' },
    { key: 'ase', label: 'ASE Index', value: metrics.ase, color: '#22c55e', icon: '◇' },
    { key: 'ics', label: 'I WAS Coherence', value: metrics.ics, color: '#3b82f6', icon: '○' }
  ]

  return (
    <div 
      className="relative flex flex-col gap-4 p-6 rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        boxShadow: `
          0 25px 50px -12px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.1),
          inset 0 -1px 0 rgba(0,0,0,0.1)
        `,
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
          <span className="text-sm">📊</span>
        </div>
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Metrics</h3>
      </div>

      {/* Main gauge - GPI */}
      <div className="relative py-4">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-2xl" />
        <svg viewBox="0 0 100 70" className="w-full h-auto max-w-[140px] mx-auto">
          <defs>
            <linearGradient id="gpiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Value arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="url(#gpiGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(mounted ? metrics.gpi : 0) * 1.26} 126`}
            filter="url(#gaugeGlow)"
            className="transition-all duration-500"
          />
          
          {/* Needle */}
          <g transform={`rotate(${(mounted ? metrics.gpi : 50) * 1.8 - 90} 50 55)`} className="transition-transform duration-500">
            <line x1="50" y1="55" x2="50" y2="22" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="55" r="5" fill="#22d3ee" filter="url(#gaugeGlow)" />
          </g>
          
          {/* Center value */}
          <text x="50" y="48" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="system-ui">
            {Math.round(metrics.gpi)}
          </text>
          <text x="50" y="62" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="system-ui">
            GPI
          </text>
        </svg>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {metricsData.slice(1).map((metric, i) => (
          <div 
            key={metric.key}
            className="relative p-3 rounded-xl overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${metric.color}15 0%, transparent 100%)`,
              border: `1px solid ${metric.color}20`
            }}
          >
            {/* Glow on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at center, ${metric.color}20 0%, transparent 70%)`
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: metric.color }}>{metric.icon}</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wider truncate">{metric.label}</span>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                <div 
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${mounted ? metric.value : 0}%`,
                    backgroundColor: metric.color,
                    boxShadow: `0 0 10px ${metric.color}`
                  }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span 
                  className="text-lg font-bold"
                  style={{ color: metric.color }}
                >
                  {Math.round(metric.value)}
                </span>
                <span className="text-[8px] text-white/30">target: 85</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ASE Radar */}
      <div 
        className="relative p-4 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, transparent 100%)',
          border: '1px solid rgba(34,197,94,0.2)'
        }}
      >
        <div className="text-[10px] text-white/50 uppercase tracking-wider mb-3">ASE Dimensions</div>
        <svg viewBox="0 0 100 70" className="w-full h-auto">
          {/* Grid */}
          {[20, 40].map(r => (
            <ellipse
              key={r}
              cx="50"
              cy="35"
              rx={r}
              ry={r * 0.6}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Data shape */}
          <ellipse
            cx="50"
            cy="35"
            rx={mounted ? metrics.ase * 0.35 : 0}
            ry={mounted ? metrics.ase * 0.2 : 0}
            fill="#22c55e"
            fillOpacity="0.2"
            stroke="#22c55e"
            strokeWidth="1"
            className="transition-all duration-500"
            filter="url(#gaugeGlow)"
          />
          
          {/* Center dot */}
          <circle cx="50" cy="35" r="3" fill="#22c55e" filter="url(#gaugeGlow)" />
          
          {/* Labels */}
          {['G', 'R', 'A', 'T', 'C'].map((label, i) => {
            const angle = (i * 72 - 90) * Math.PI / 180
            const x = 50 + Math.cos(angle) * 45
            const y = 35 + Math.sin(angle) * 27
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="8"
                fontFamily="system-ui"
              >
                {label}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Trend indicators */}
      <div className="flex justify-between items-center pt-2 border-t border-white/5">
        {metricsData.map((metric) => (
          <div key={metric.key} className="text-center">
            <div 
              className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110"
              style={{ 
                backgroundColor: `${metric.color}20`,
                color: metric.color,
                boxShadow: `0 0 15px ${metric.color}30`
              }}
            >
              {Math.round(metric.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

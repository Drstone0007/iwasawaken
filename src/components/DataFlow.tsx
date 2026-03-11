'use client'

import { useEffect, useState, useRef } from 'react'

const flowSteps = [
  { id: 'input', label: 'Input', color: '#22d3ee' },
  { id: 'spirit', label: 'Spirit', color: '#22d3ee' },
  { id: 'blood', label: 'Blood', color: '#ef4444' },
  { id: 'soul', label: 'Soul', color: '#a855f7' },
  { id: 'action', label: 'Action', color: '#22c55e' },
  { id: 'return', label: 'Return', color: '#eab308' }
]

// Pre-generate particles
const INITIAL_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  progress: i * 12.5,
  speed: 0.8 + (i % 3) * 0.2
}))

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function DataFlow() {
  const mounted = useMounted()
  const [particles, setParticles] = useState(INITIAL_PARTICLES)
  const [activeStep, setActiveStep] = useState(0)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    
    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % flowSteps.length)
    }, 1200)

    return () => clearInterval(stepInterval)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const animate = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        progress: (p.progress + p.speed) % 100
      })))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [mounted])

  // Calculate particle position along path
  const getParticlePosition = (progress: number) => {
    const p = progress / 100
    const totalPath = flowSteps.length - 1
    const segment = Math.floor(p * totalPath)
    const segmentProgress = (p * totalPath) % 1
    
    const startX = 30
    const endX = 170
    const stepHeight = 200 / (flowSteps.length - 1)
    
    const x = startX + (endX - startX) * p
    const baseY = 20 + segment * stepHeight
    const nextY = 20 + (segment + 1) * stepHeight
    const y = baseY + (nextY - baseY) * segmentProgress
    
    return { x, y }
  }

  return (
    <div className="flex flex-col p-4 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Data Flow</h3>
      
      <div className="relative w-full aspect-[1/1.2] max-w-[180px] mx-auto">
        <svg viewBox="0 0 200 220" className="w-full h-full">
          <defs>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            
            <filter id="flowGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines */}
          {flowSteps.slice(0, -1).map((step, i) => {
            const y1 = 20 + i * 40
            const y2 = 20 + (i + 1) * 40
            
            return (
              <g key={`line-${i}`}>
                <line
                  x1="100"
                  y1={y1}
                  x2="100"
                  y2={y2}
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                <line
                  x1="100"
                  y1={y1}
                  x2="100"
                  y2={y2}
                  stroke={flowSteps[i + 1].color}
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  opacity={activeStep > i ? 0.6 : 0.1}
                  className="transition-opacity duration-300"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-8"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            )
          })}

          {/* Flow nodes */}
          {flowSteps.map((step, i) => {
            const y = 20 + i * 40
            const isActive = activeStep === i
            
            return (
              <g key={step.id}>
                {/* Node glow */}
                {isActive && (
                  <circle
                    cx="100"
                    cy={y}
                    r="16"
                    fill={step.color}
                    opacity="0.2"
                  >
                    <animate
                      attributeName="r"
                      values="12;20;12"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0.4;0.2"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                
                {/* Node circle */}
                <circle
                  cx="100"
                  cy={y}
                  r="10"
                  fill={isActive ? step.color : '#1e293b'}
                  stroke={step.color}
                  strokeWidth="2"
                  filter={isActive ? 'url(#flowGlow)' : undefined}
                  className="transition-all duration-200"
                />
                
                {/* Inner dot */}
                {isActive && (
                  <circle cx="100" cy={y} r="3" fill="white" opacity="0.8" />
                )}
                
                {/* Label */}
                <text
                  x="125"
                  y={y + 4}
                  fill={isActive ? step.color : '#64748b'}
                  fontSize="9"
                  fontFamily="system-ui"
                  fontWeight={isActive ? 'bold' : 'normal'}
                  className="transition-all duration-200"
                >
                  {step.label}
                </text>
              </g>
            )
          })}

          {/* Animated particles */}
          {mounted && particles.map(particle => {
            const pos = getParticlePosition(particle.progress)
            const colorIndex = Math.floor((particle.progress / 100) * (flowSteps.length - 1))
            const color = flowSteps[Math.min(colorIndex + 1, flowSteps.length - 1)].color
            
            return (
              <circle
                key={particle.id}
                cx={pos.x}
                cy={pos.y}
                r="3"
                fill={color}
                filter="url(#flowGlow)"
              >
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
            )
          })}

          {/* Return path indicator */}
          <path
            d="M 170 200 Q 190 110 170 20"
            fill="none"
            stroke="#eab308"
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity="0.3"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-8"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* Current step */}
      <div className="mt-3 text-center">
        <span className="text-xs text-slate-500">Current: </span>
        <span 
          className="text-xs font-bold"
          style={{ color: flowSteps[activeStep].color }}
        >
          {flowSteps[activeStep].label}
        </span>
      </div>
    </div>
  )
}
